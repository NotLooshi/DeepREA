#!/usr/bin/env node
import { mkdirSync, mkdtempSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { classifyInspection } from './inspection-policy.mjs';
import { RULE_IDS } from '../toolkit/taste/scripts/lib/rules.mjs';

const HELP = `UICBINS mechanical inspector (Node 22+, Chrome/Edge/Chromium)
node scripts/inspect.mjs <https://url | file.html> [--out DIR] [--widths 1440,768,390] [--app] [--film] [--require rule,rule] [--json] [--style-advice]
Set CHROME_PATH to a browser executable if discovery fails.
Only listed options are accepted. --require makes known advisory rules blocking.
Default and --json output list every blocker/error, advisory count and evidence paths.
Use --style-advice to also display contextual style suggestions; these are not universal requirements.
All advisory observations remain intact in assessment.json and the raw report.
Exit 0: measured mechanical checks pass; render/advisory review is still required.
Exit 1: blocking observations. Exit 2: tool/report/argument failure (unverified).
Each run preserves original stdout, stderr, report, screenshots and process receipt.
Runs in an isolated directory: direction.json allowances are never applied.
Pass --app/--film explicitly; automatic direction mode/font checks are not inherited.
Timeout: 10 minutes per run. This is not a full accessibility or functional audit.`;

export function runInspection(argv, runner = spawnSync) {
  const args = [...argv];
  const target = args.shift();
  if (!target || target.startsWith('-')) throw new Error('Expected URL or HTML file.');
  const options = {out:'.uicbins/inspect',widths:'1440,768,390',require:[]};
  const switches = [];
  const seen = new Set();
  while (args.length) {
    const key = args.shift();
    if (seen.has(key)) throw new Error('Duplicate option: ' + key);
    seen.add(key);
    if (['--app','--film','--json','--style-advice'].includes(key)) { if(['--app','--film'].includes(key)) switches.push(key); continue; }
    if (!['--out','--widths','--require'].includes(key)) throw new Error('Unsupported option: ' + key);
    const value = args.shift();
    if (!value || value.startsWith('--')) throw new Error('Missing value: ' + key);
    options[key.slice(2)] = key === '--require' ? value.split(',') : value;
  }
  if (!/^\d+(,\d+)*$/.test(options.widths) || options.widths.split(',').some(w=>+w<240 || +w>4096) || options.widths.split(',').length>8) throw new Error('Invalid widths: use 1–8 integers from 240 to 4096.');
  if (options.require.some(id=>!RULE_IDS.includes(id))) throw new Error('Unknown required rule.');
  if (/^[a-z]+:\/\//i.test(target) && !/^https?:\/\//i.test(target)) throw new Error('Only HTTP(S) URLs or local files are supported.');
  const normalized = /^https?:\/\//i.test(target) ? target : resolve(target);
  const output = resolve(options.out);
  mkdirSync(output,{recursive:true});
  const runDir = mkdtempSync(join(output,'run-'));
  const vendor = fileURLToPath(new URL('../toolkit/taste/scripts/inspect.mjs',import.meta.url));
  const command = [vendor, normalized, '--out',join(runDir,'vendor'), '--widths',options.widths,...switches,'--json'];
  const startedAt = new Date().toISOString();
  let execution;
  try { execution = runner(process.execPath, command,{cwd:runDir,encoding:'utf8',timeout:600000,maxBuffer:32*1024*1024,windowsHide:true}); }
  catch (error) { execution={status:null,error,stdout:'',stderr:''}; }
  const stdout = execution.stdout || '', stderr = execution.stderr || '';
  writeFileSync(join(runDir,'vendor.stdout.txt'),stdout);
  writeFileSync(join(runDir,'vendor.stderr.txt'),stderr);
  const receipt = {startedAt,finishedAt:new Date().toISOString(),executable:process.execPath,args:command,cwd:runDir,vendorExit:execution.status ?? null,signal:execution.signal ?? null,error:execution.error?.message ?? null,timeoutMs:600000};
  writeFileSync(join(runDir,'receipt.json'),JSON.stringify(receipt,null,2));
  let report = null;
  try { report=JSON.parse(stdout); writeFileSync(join(runDir,'raw-report.json'),stdout); } catch {}
  const result = classifyInspection(report, execution.error || execution.signal ? null : execution.status,options.require);
  const actualWidths = Array.isArray(report?.viewports) ? report.viewports.map(v=>v?.width).sort((a,b)=>a-b) : [];
  const expectedWidths = options.widths.split(',').map(Number).sort((a,b)=>a-b);
  if (JSON.stringify(actualWidths) !== JSON.stringify(expectedWidths)) {
    result.errors.push('Reported viewports do not match the requested widths.');
    result.exitCode=2;
  }
  result.runDir=runDir;
  result.vendorExit=receipt.vendorExit;
  result.required=options.require;
  writeFileSync(join(runDir,'assessment.json'),JSON.stringify(result,null,2));
  return result;
}

// Presentation only: the API, assessment and vendor evidence retain every observation.
export function runInspectionCommand(argv, runner = spawnSync) {
  const result = runInspection(argv, runner);
  const { advisory, ...summary } = result;
  const rawReportPath = join(result.runDir, 'raw-report.json');
  return {
    ...summary,
    advisoryCount: advisory.length,
    assessmentPath: join(result.runDir, 'assessment.json'),
    rawReportPath: existsSync(rawReportPath) ? rawReportPath : null,
    rawOutputPath: join(result.runDir, 'vendor.stdout.txt'),
    ...(argv.includes('--style-advice') ? { advisory } : {}),
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.argv.slice(2).some(x=>['--help','-h'].includes(x))) console.log(HELP);
  else try {
    const result=runInspectionCommand(process.argv.slice(2));
    console.log(JSON.stringify(result,null,2));
    process.exitCode=result.exitCode;
  } catch(error) { console.error(error.message+'\n'+HELP); process.exitCode=2; }
}
