"""Evaluator-only comparator and isolated CLI runner. No semantic JSON normalization."""
import argparse, base64, hashlib, json, pathlib, subprocess, sys, tempfile
ROOT=pathlib.Path(__file__).resolve().parent
def enc(data): return base64.b64encode(data).decode('ascii')
def normalized(value):
    return None if value is None else base64.b64decode(value,validate=True).replace(b'\r\n',b'\n')
def compare(expected, actual):
    differences=[]
    if actual.get('execution_error'): differences.append('execution_error')
    if expected['returncode']!=actual['returncode']: differences.append('returncode')
    for key in ['stdout_b64','stderr_b64']:
        if normalized(expected[key])!=normalized(actual[key]): differences.append(key)
    for name in sorted(set(expected['files_b64'])|set(actual['files_b64'])):
        if normalized(expected['files_b64'].get(name))!=normalized(actual['files_b64'].get(name)):
            differences.append('file:'+name)
    return {'passed':not differences,'differences':differences}
def execute(argv,case):
    with tempfile.TemporaryDirectory(prefix='jo-grade-') as directory:
        folder=pathlib.Path(directory)
        for name,value in case['files'].items():
            (folder/name).write_bytes(value.encode('utf-8'))
        error=None
        try:
            p=subprocess.run([*argv,*case['argv']],input=case['stdin'].encode('utf-8'),capture_output=True,cwd=folder,timeout=5)
            stdout,stderr,code=p.stdout,p.stderr,p.returncode
        except subprocess.TimeoutExpired as e:
            stdout,stderr,code=e.stdout or b'',e.stderr or b'',None;error='timeout'
        except OSError as e:
            stdout,stderr,code=b'',b'',None;error=type(e).__name__+': '+str(e)
        result={'stdout_b64':enc(stdout),'stderr_b64':enc(stderr),'returncode':code,
                'files_b64':{name:enc((folder/name).read_bytes()) if (folder/name).is_file() else None for name in case['outputs']}}
        if error: result['execution_error']=error
        return result
def grade(argv):
    suite=json.loads((ROOT/'cases.json').read_text(encoding='utf-8'))
    rows=[];families={}
    for case in suite['cases']:
        actual=execute(argv,case); verdict=compare(case['expected'],actual)
        rows.append({'id':case['id'],'family':case['family'],**verdict,'actual':actual})
        tally=families.setdefault(case['family'],{'passed':0,'total':0})
        tally['total']+=1;tally['passed']+=int(verdict['passed'])
    return {'cases_sha256':hashlib.sha256((ROOT/'cases.json').read_bytes()).hexdigest(),
            'argv':argv,'passed':sum(row['passed'] for row in rows),'total':len(rows),
            'families':families,'cases':rows}
def main():
    parser=argparse.ArgumentParser()
    group=parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--submission',type=pathlib.Path)
    group.add_argument('--target',type=pathlib.Path,help='Evaluator positive-control executable only')
    parser.add_argument('--out',required=True,type=pathlib.Path)
    args=parser.parse_args()
    if args.out.exists(): parser.error('Refusing to overwrite result')
    argv=[sys.executable,'-X','utf8',str(args.submission.resolve())] if args.submission else [str(args.target.resolve())]
    result=grade(argv)
    args.out.write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({k:result[k] for k in ['passed','total','families']}))
    return 0 if result['passed']==result['total'] else 1
if __name__=='__main__': sys.exit(main())
