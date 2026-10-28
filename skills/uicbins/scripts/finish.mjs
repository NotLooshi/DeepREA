#!/usr/bin/env node
// Execute trusted, task-authored checks. This is an evidence runner, not a sandbox or host gate.
import {readFileSync,writeFileSync,mkdirSync,realpathSync,statSync} from 'node:fs';
import {resolve,dirname,join,relative,isAbsolute} from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {spawn} from 'node:child_process';

const LIMIT=1024*1024;
const limitations=[
  'PASS means only that the declared commands exited zero against unchanged declared file bytes at check boundaries.',
  'The runner does not verify assertion quality, semantic/content truth, visual relevance, coverage completeness, accessibility, ranking or release readiness.',
  'Trusted commands run with current-user permissions and network access. No sandbox, host enforcement or agent-bypass prevention is provided.',
  'Hashes do not cover omitted dependencies/files, external state or changes restored between snapshots. Re-run after any delivered-file change.',
  'Timeout cleanup targets the spawned process tree; deliberately detached/escaped processes and ordinary-exit background workers are not guaranteed to be cleaned up.',
  'Missing or interrupted receipts are UNVERIFIED. A later invocation never reuses earlier PASS results.'
];
const record=x=>x&&typeof x==='object'&&!Array.isArray(x);
const string=x=>typeof x==='string'&&x.trim().length>0&&!x.includes('\0');
const allowed=(x,keys)=>Object.keys(x).every(k=>keys.includes(k));
const key=p=>process.platform==='win32'?p.toLowerCase():p;
const within=(root,p)=>{const r=relative(root,p);return r===''||(!r.startsWith('..')&&!isAbsolute(r));};
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
function validate(raw,base) {
  if(!record(raw)||!allowed(raw,['projectRoot','outputDir','profile','artifacts','checks']))throw new Error('Unknown or malformed configuration.');
  if(!string(raw.projectRoot)||!string(raw.outputDir))throw new Error('Explicit projectRoot and outputDir required.');
  if(!['public-page','private-app','demo'].includes(raw.profile))throw new Error('profile must be public-page, private-app or demo.');
  const root=realpathSync(resolve(base,raw.projectRoot));
  if(!statSync(root).isDirectory())throw new Error('projectRoot must be a directory.');
  if(!Array.isArray(raw.artifacts)||!raw.artifacts.length||raw.artifacts.length>256||!raw.artifacts.every(string))throw new Error('Declare 1–256 explicit delivered files; no globs.');
  const artifacts=raw.artifacts.map(p=>{
    const file=realpathSync(resolve(root,p));
    if(!within(root,file)||!statSync(file).isFile())throw new Error('Each artifact must be an existing file inside projectRoot.');
    return file;
  });
  if(new Set(artifacts.map(key)).size!==artifacts.length)throw new Error('Duplicate delivered artifact.');
  if(!Array.isArray(raw.checks)||!raw.checks.length||raw.checks.length>16)throw new Error('Declare 1–16 checks.');
  const names=new Set();let total=0;
  for(const c of raw.checks){
    if(!record(c)||!allowed(c,['name','kind','command','args','timeoutMs'])||!string(c.name)||c.name.length>120||!['behavior','mechanical','discovery'].includes(c.kind)||!string(c.command)||!Array.isArray(c.args)||!c.args.every(a=>typeof a==='string'&&!a.includes('\0'))||!Number.isInteger(c.timeoutMs)||c.timeoutMs<1||c.timeoutMs>120000)throw new Error('Malformed check: name, kind, command, string args and timeoutMs 1–120000 required.');
    if(names.has(c.name.trim().toLowerCase()))throw new Error('Duplicate check name.');
    names.add(c.name.trim().toLowerCase());total+=c.timeoutMs;
  }
  if(total>600000)throw new Error('Aggregate declared timeout exceeds 600000 ms.');
  for(const kind of ['behavior','mechanical',...(raw.profile==='public-page'?['discovery']:[])])if(!raw.checks.some(c=>c.kind===kind))throw new Error(`Missing required ${kind} check.`);
  const output=resolve(root,raw.outputDir);
  if(artifacts.some(p=>key(p)===key(output)||within(p,output)))throw new Error('outputDir must be outside delivered artifacts.');
  mkdirSync(output,{recursive:true});
  const actualOutput=realpathSync(output);
  if(artifacts.some(p=>key(p)===key(actualOutput)||within(p,actualOutput)))throw new Error('Resolved outputDir intersects a delivered artifact.');
  return {root,output:actualOutput,artifacts,checks:raw.checks,profile:raw.profile};
}
function snapshot(files){return files.map(path=>{const bytes=readFileSync(path);return {path,bytes:bytes.length,sha256:hash(bytes)};});}
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);

function terminate(child){
  if(!child.pid)return Promise.resolve({attempted:false,exitCode:null,reason:'No spawned PID.'});
  if(process.platform!=='win32'){
    try{process.kill(-child.pid,'SIGKILL');return Promise.resolve({attempted:true,exitCode:0,method:'SIGKILL process group',pid:child.pid});}
    catch(error){return Promise.resolve({attempted:true,exitCode:2,method:'SIGKILL process group',pid:child.pid,error:error.message});}
  }
  return new Promise(resolveCleanup=>{
    const exe=join(process.env.SystemRoot||'C:/Windows','System32','taskkill.exe');
    let output='',done=false;
    const killer=spawn(exe,['/PID',String(child.pid),'/T','/F'],{shell:false,windowsHide:true,stdio:['ignore','pipe','pipe']});
    const finish=value=>{if(done)return;done=true;clearTimeout(timer);resolveCleanup({attempted:true,method:'taskkill /PID /T /F',pid:child.pid,output,...value});};
    const timer=setTimeout(()=>{killer.kill();finish({exitCode:2,error:'Cleanup timed out.'});},7000);
    for(const stream of [killer.stdout,killer.stderr])stream.on('data',b=>{output=(output+b.toString()).slice(0,8192);});
    killer.on('error',e=>finish({exitCode:2,error:e.message}));
    killer.on('close',code=>finish({exitCode:code}));
  });
}
function execute(check,cwd,runDir,index){
  return new Promise(resolveResult=>{
    const startedAt=new Date().toISOString(),start=performance.now();
    const chunks={stdout:[],stderr:[]},lengths={stdout:0,stderr:0};
    let issue=null,cleanup=null,exitCode=null,signal=null,done=false,stopping=false;
    const child=spawn(check.command,check.args,{cwd,shell:false,windowsHide:true,detached:process.platform!=='win32',stdio:['ignore','pipe','pipe']});
    const finish=()=>{
      if(done)return;done=true;clearTimeout(timer);
      const prefix=String(index+1).padStart(2,'0');
      for(const stream of ['stdout','stderr'])writeFileSync(join(runDir,`${prefix}-${stream}.txt`),Buffer.concat(chunks[stream]));
      const status=issue||signal||exitCode===null||![0,1].includes(exitCode)?'UNVERIFIED':exitCode===1?'FAIL':'PASS';
      const receipt={...check,startedAt,finishedAt:new Date().toISOString(),durationMs:Math.round(performance.now()-start),pid:child.pid??null,exitCode,signal,status,issue,cleanup,outputBytes:lengths,stdout:`${prefix}-stdout.txt`,stderr:`${prefix}-stderr.txt`};
      writeFileSync(join(runDir,`${prefix}-receipt.json`),JSON.stringify(receipt,null,2));resolveResult(receipt);
    };
    const stop=async reason=>{if(stopping||done)return;stopping=true;issue=reason;cleanup=await terminate(child);finish();};
    const timer=setTimeout(()=>void stop('Check timeout.'),check.timeoutMs);
    for(const stream of ['stdout','stderr'])child[stream].on('data',buffer=>{
      if(done)return;
      const remaining=LIMIT-lengths[stream];
      if(remaining>0){const kept=buffer.subarray(0,remaining);chunks[stream].push(kept);lengths[stream]+=kept.length;}
      if(buffer.length>remaining)void stop(`${stream} exceeded ${LIMIT} byte capture limit; output truncated.`);
    });
    child.on('error',error=>{issue=`Could not execute command: ${error.message}`;if(!stopping)finish();});
    child.on('close',(code,sig)=>{exitCode=code;signal=sig;if(!stopping)finish();});
  });
}

async function main(){
  let report={status:'UNVERIFIED',scope:'executed-declared-checks-only',limitations,checks:[]};
  try{
    if(process.argv.length!==3)throw new Error('Usage: node finish.mjs config.json');
    const configPath=resolve(process.argv[2]),configBytes=readFileSync(configPath);
    const config=validate(JSON.parse(configBytes.toString('utf8')),dirname(configPath));
    const runDir=join(config.output,`${new Date().toISOString().replace(/[:.]/g,'-')}-${randomUUID()}`);mkdirSync(runDir);
    report={...report,runDir,startedAt:new Date().toISOString(),projectRoot:config.root,profile:config.profile,configSha256:hash(configBytes),requiredKinds:['behavior','mechanical',...(config.profile==='public-page'?['discovery']:[])]};
    writeFileSync(join(runDir,'config.json'),configBytes);
    report.artifactsBefore=snapshot(config.artifacts);
    for(let i=0;i<config.checks.length;i++){
      if(!same(report.artifactsBefore,snapshot(config.artifacts)))throw new Error('Delivered artifact changed before next check; verification stale.');
      report.checks.push(await execute(config.checks[i],config.root,runDir,i));
      try{report.artifactsAfter=snapshot(config.artifacts);}catch(error){throw new Error(`Delivered artifact unavailable after check: ${error.message}`);}
      if(!same(report.artifactsBefore,report.artifactsAfter))throw new Error('Delivered artifact changed during checks; verification stale.');
    }
    report.status=report.checks.some(c=>c.status==='UNVERIFIED')?'UNVERIFIED':report.checks.some(c=>c.status==='FAIL')?'FAIL':'PASS';
    report.reason=report.status==='PASS'?'All declared commands exited zero; declared delivered bytes unchanged.':report.status==='FAIL'?'At least one executed check exited 1.':'At least one check could not establish a result.';
  }catch(error){report.status='UNVERIFIED';report.reason=error.message;}
  report.finishedAt=new Date().toISOString();
  if(report.runDir)try{writeFileSync(join(report.runDir,'report.json'),JSON.stringify(report,null,2));}catch(error){report.status='UNVERIFIED';report.reason=`Could not persist report: ${error.message}`;}
  console.log(JSON.stringify(report,null,2));process.exitCode=report.status==='PASS'?0:report.status==='FAIL'?1:2;
}
await main();
