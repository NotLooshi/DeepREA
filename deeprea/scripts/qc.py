#!/usr/bin/env python3
"""Finite JSON-lines compatibility checks. Local evidence, not an approval authority."""
import argparse,datetime,hashlib,json,math,os,pathlib,re,shutil,signal,subprocess,sys

EXIT={'VERIFIED':0,'FAILED':1,'UNVERIFIED':2}

def reject(value):raise ValueError(str(value))

def unique_object(pairs):
    result={}
    for key,value in pairs:
        if key in result:raise ValueError('duplicate JSON key: '+key)
        result[key]=value
    return result

def strict_json(data):
    return json.loads(data,object_pairs_hook=unique_object,parse_constant=reject)

def require(condition,message):
    if not condition:raise ValueError(message)

def keys(value,expected,where):
    require(type(value) is dict and set(value)==set(expected),where+': incorrect fields')

def text(value):return type(value) is str and bool(value.strip()) and '\0' not in value

def number(value):return type(value) in (int,float) and math.isfinite(value)

def load_contract(path):
    c=strict_json(path.read_text(encoding='utf-8'))
    keys(c,['version','objective','scope','comparison','timeout_seconds','original','candidate','cases'],'contract')
    require(number(c['version']) and c['version']==1,'Unsupported contract version')
    require(text(c['objective']) and text(c['scope']),'Objective and finite scope are required')
    require(c['comparison']=='jsonl-bytes','Only jsonl-bytes comparison is supported')
    require(number(c['timeout_seconds']) and 0<c['timeout_seconds']<=60,'Timeout must be >0 and <=60 seconds')
    for role in ['original','candidate']:
        keys(c[role],['argv','files'],role)
        for name in ['argv','files']:
            values=c[role][name]
            require(type(values) is list and bool(values) and all(text(v) for v in values),role+': nonempty argv/files required')
        require(len(set(c[role]['files']))==len(c[role]['files']),role+': duplicate declared files')
    require(type(c['cases']) is list and 1<=len(c['cases'])<=256,'Declare 1..256 cases')
    ids=set()
    for case in c['cases']:
        keys(case,['id','stdin','responses'],'case')
        require(type(case['id']) is str and re.fullmatch(r'[A-Za-z][A-Za-z0-9_-]{0,63}',case['id']) is not None,'Invalid case ID')
        require(case['id'] not in ids,'Duplicate case ID');ids.add(case['id'])
        require(type(case['stdin']) is str,'stdin must be a string');case['stdin'].encode('utf-8')
        n=case['responses'];require(number(n) and n==int(n) and 0<=n<=10000,'responses must be an integer in 0..10000')
    return c

def digest(path):
    with pathlib.Path(path).open('rb') as stream:return hashlib.file_digest(stream,'sha256').hexdigest()

def snapshot(contract,path):
    identity={'contract':{'path':str(path),'sha256':digest(path)},
              'tool_sha256':digest(__file__),'qc_python':{'path':sys.executable,'sha256':digest(sys.executable)},
              'cwd':str(path.parent),'programs':{}}
    for role in ['original','candidate']:
        program=contract[role];requested=program['argv'][0]
        executable=(path.parent/requested).resolve() if '/' in requested or '\\' in requested else shutil.which(requested)
        executable=str(pathlib.Path(executable).resolve()) if executable and pathlib.Path(executable).is_file() else None
        files={str((path.parent/f).resolve()):digest((path.parent/f).resolve()) for f in program['files']}
        identity['programs'][role]={'argv':[executable or requested,*program['argv'][1:]],
          'executable':executable,'executable_sha256':digest(executable) if executable else None,'declared_files':files}
    return identity

def artifact_manifest(out):
    return {p.name:digest(p) for p in sorted(out.iterdir()) if p.is_file() and p.name!='record.json'}

def write_json(path,value):
    with path.open('x',encoding='utf-8') as stream:
        json.dump(value,stream,indent=2,ensure_ascii=False,allow_nan=False);stream.write('\n')

def capture(argv,stdin,cwd,out,prefix,timeout):
    stdout=out/(prefix+'.stdout');stderr=out/(prefix+'.stderr')
    record={'argv':argv,'termination':'completed','returncode':None,
            'stdout':stdout.name,'stderr':stderr.name}
    with stdout.open('xb') as a,stderr.open('xb') as b:
        captured_out,captured_err=b'',b''
        try:
            options={'creationflags':subprocess.CREATE_NO_WINDOW} if os.name=='nt' else {'start_new_session':True}
            process=subprocess.Popen(argv,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,cwd=cwd,**options)
            try:
                captured_out,captured_err=process.communicate(stdin,timeout=timeout)
                record['returncode']=process.returncode
            except subprocess.TimeoutExpired as error:
                record['termination']='timeout';captured_out,captured_err=error.output or b'',error.stderr or b''
                try:
                    if os.name=='nt':
                        killed=subprocess.run([str(pathlib.Path(os.environ['SystemRoot'])/'System32/taskkill.exe'),'/PID',str(process.pid),'/T','/F'],capture_output=True,timeout=5,creationflags=subprocess.CREATE_NO_WINDOW)
                        record['tree_cleanup_exit']=killed.returncode
                    else:os.killpg(process.pid,signal.SIGKILL)
                except (OSError,subprocess.TimeoutExpired) as cleanup:
                    record['cleanup_error']=str(cleanup)
                if process.poll() is None:process.kill()
                try:
                    captured_out,captured_err=process.communicate(timeout=1)
                    record['streams_closed_after_timeout']=True
                except subprocess.TimeoutExpired as pending:
                    captured_out,captured_err=pending.output or captured_out,pending.stderr or captured_err
                    record['streams_closed_after_timeout']=False
                record['returncode']=process.poll()
        except OSError as error:
            record['termination']='launch_error';record['error']=str(error)
        a.write(captured_out);b.write(captured_err)
    return record

def assess(case,records,out):
    incomplete=[role+': '+r['termination']+' / exit '+str(r['returncode']) for role,r in records.items() if r['termination']!='completed' or type(r['returncode']) is not int or r['returncode']!=0]
    if incomplete:return {'id':case['id'],'status':'UNVERIFIED','reasons':incomplete}
    a=(out/records['original']['stdout']).read_bytes()
    b=(out/records['candidate']['stdout']).read_bytes()
    reasons=[] if a==b else ['stdout bytes differ']
    for role,raw in [('original',a),('candidate',b)]:
        if (out/records[role]['stderr']).read_bytes():reasons.append(role+': stderr is not empty')
        lines=raw.split(b'\n');lines.pop() if raw.endswith(b'\n') or not raw else None
        if len(lines)!=case['responses']:reasons.append(role+': response count differs')
        if raw and not raw.endswith(b'\n'):reasons.append(role+': missing terminal LF')
        for line in lines:
            try:strict_json(line.decode('utf-8'))
            except (ValueError,UnicodeError):
                reasons.append(role+': invalid JSON response');break
    return {'id':case['id'],'status':'FAILED' if reasons else 'VERIFIED','reasons':reasons}

def overall(checks):
    return max((c['status'] for c in checks),key=EXIT.get,default='UNVERIFIED')

def control_command(value):
    return [sys.executable,'-c',f'import sys;sys.stdout.buffer.write(b\'{{"qc_control":{value}}}\\n\')']

def check_controls(processes,out):
    keys(processes,['a','b','bad'],'checker controls')
    for label,value in [('a',1),('b',1),('bad',2)]:
        process=processes[label]
        require(process['argv']==control_command(value),'Incorrect checker command')
        for stream in ['stdout','stderr']:
            require(process[stream]==f'checker-{label}.{stream}','Incorrect checker artifact')
    case={'id':'checker','responses':1}
    positive=assess(case,{'original':processes['a'],'candidate':processes['b']},out)
    negative=assess(case,{'original':processes['a'],'candidate':processes['bad']},out)
    known=all((out/processes[label]['stdout']).read_bytes()==f'{{"qc_control":{value}}}\n'.encode() for label,value in [('a',1),('b',1),('bad',2)])
    status='VERIFIED' if known and positive['status']=='VERIFIED' and negative['status']=='FAILED' else 'UNVERIFIED'
    return {'status':status,'positive':positive,'negative':negative,'processes':processes}

def run(contract_path,out):
    contract=load_contract(contract_path)
    before=snapshot(contract,contract_path)
    out.mkdir(parents=True,exist_ok=False)
    record={'version':1,'before':before,'cases':[]}
    controls={label:capture(control_command(value),b'',contract_path.parent,out,f'checker-{label}',5) for label,value in [('a',1),('b',1),('bad',2)]}
    record['checker']=check_controls(controls,out)
    for i,case in enumerate(contract['cases']):
        if record['checker']['status']!='VERIFIED':break
        stdin=case['stdin'].encode('utf-8');(out/f'case-{i}.stdin').write_bytes(stdin)
        processes={role:capture(before['programs'][role]['argv'],stdin,contract_path.parent,out,f'case-{i}.{role}',contract['timeout_seconds']) for role in ['original','candidate']}
        record['cases'].append({'id':case['id'],'stdin':f'case-{i}.stdin','processes':processes,'check':assess(case,processes,out)})
    record['status']=overall(c['check'] for c in record['cases'])
    record['after']=snapshot(contract,contract_path)
    record['identity_unchanged']=before==record['after']
    if not record['identity_unchanged']:record['status']='UNVERIFIED'
    record['artifacts']=artifact_manifest(out)
    write_json(out/'record.json',record)
    return {'status':record['status'],'evidence':str(out),'checker':record['checker']['status'],
            'identity_unchanged':record['identity_unchanged'],'checks':[c['check'] for c in record['cases']]}

def release(contract_path,evidence):
    contract=load_contract(contract_path)
    record=strict_json((evidence/'record.json').read_text(encoding='utf-8'))
    require(record['version']==1,'Unsupported evidence version')
    current=snapshot(contract,contract_path)
    require(record['before']==record['after']==current,'Contract, tool, executable or declared files changed; rerun required')
    require(record['artifacts']==artifact_manifest(evidence),'Retained evidence changed or is missing')
    checker=check_controls(record['checker']['processes'],evidence)
    require(checker['status']=='VERIFIED','Checker did not pass its positive and negative controls')
    require([c['id'] for c in record['cases']]==[c['id'] for c in contract['cases']],'Missing, extra or reordered case evidence')
    checks=[]
    for i,(case,saved) in enumerate(zip(contract['cases'],record['cases'])):
        require(saved['stdin']==f'case-{i}.stdin','Invalid stdin artifact name')
        require((evidence/saved['stdin']).read_bytes()==case['stdin'].encode('utf-8'),'Different tested input')
        keys(saved['processes'],['original','candidate'],'execution roles')
        for role,process in saved['processes'].items():
            require(process['argv']==current['programs'][role]['argv'],'Different execution argv')
            for stream in ['stdout','stderr']:
                require(process[stream]==f'case-{i}.{role}.{stream}','Invalid output artifact name')
        checks.append(assess(case,saved['processes'],evidence))
    return {'version':1,'status':overall(checks),'scope':'finite JSON-lines stdout compatibility only',
            'checked_at_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),
            'evidence':{'directory':str(evidence),'record_sha256':digest(evidence/'record.json'),
                        'contract_sha256':current['contract']['sha256'],'tool_sha256':current['tool_sha256']},
            'gates':{'contract':'VALID','checker':checker['status'],'comparison':overall(checks),'identity':'UNCHANGED'},
            'verified_cases':[c['id'] for c in checks if c['status']=='VERIFIED'],'checks':checks,
            'limits':['No assertion of exhaustive equivalence, side effects, semantic report truth or permission.']}

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command',choices=['run','release'])
    parser.add_argument('--contract',required=True,type=pathlib.Path)
    parser.add_argument('--out',required=True,type=pathlib.Path)
    parser.add_argument('--run',type=pathlib.Path)
    args=parser.parse_args()
    try:
        if args.command=='run':result=run(args.contract.resolve(),args.out.resolve())
        else:
            require(args.run is not None,'release requires --run')
            result=release(args.contract.resolve(),args.run.resolve())
            write_json(args.out.resolve(),result)
    except (OSError,ValueError,KeyError,TypeError) as error:
        result={'status':'UNVERIFIED','reasons':[str(error)]}
    print(json.dumps(result,ensure_ascii=False,allow_nan=False))
    return EXIT[result['status']]

if __name__=='__main__':sys.exit(main())
