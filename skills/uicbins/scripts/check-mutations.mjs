import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Browser } from '../toolkit/taste/scripts/lib/cdp.mjs';

// Intentionally narrow: native form state mutation, not a general journey runner.
export async function checkMutations(browser,url,config){
 const report={url,status:'UNVERIFIED',fields:[],uncovered:[],limitations:['DOM setters and synthetic input/change events; not trusted keyboard/pointer input.','No iframe/shadow-root/custom-widget coverage. Success is the task-authored visible selector; validate its meaning independently.']};
 let page;
 try{
  const target=new URL(url);
  if(target.protocol!=='file:' && !(['http:','https:'].includes(target.protocol)&&['localhost','127.0.0.1','[::1]'].includes(target.hostname)))throw Error('Only file or loopback URLs are supported.');
  if(!config.form||!config.success||!config.submit||!Array.isArray(config.fields)||!config.fields.length)throw Error('form, success, submit and nonempty fields are required');
  const settle=Math.min(3000,Math.max(20,config.settleMs??100));
  page=await browser.newPage();
  const wait=()=>new Promise(r=>setTimeout(r,settle));
  const visible=async selector=>page.eval(s=>{const e=document.querySelector(s);return !!e&&e.checkVisibility({checkVisibilityCSS:true,checkOpacity:true});},selector);
  const click=async selector=>{await page.eval(s=>{const es=document.querySelectorAll(s);if(es.length!==1)throw Error('Action must resolve exactly once: '+s);const e=es[0];if(!e.checkVisibility({checkVisibilityCSS:true,checkOpacity:true})||e.matches(':disabled'))throw Error('Action not accessible: '+s);e.click();},selector);await wait();};
  const navigate=async()=>{
   if(await page.goto(url,{settleMs:settle})==='timeout')throw Error('Navigation timed out');
   if(Object.hasOwn(config,'open')){
    if(typeof config.open!=='string'||!config.open.trim())throw Error('opener must be a nonempty selector');
    await page.eval(s=>{
     const es=document.querySelectorAll(s);if(es.length!==1)throw Error('opener must resolve exactly once: '+s);
     const e=es[0];
     if(!e.matches('button,input[type="button"],input[type="submit"],input[type="reset"],a[href]')||!e.checkVisibility({checkVisibilityCSS:true,checkOpacity:true})||e.matches(':disabled')||e.closest('[inert],[aria-disabled="true"]'))throw Error('opener must be a visible enabled native action: '+s);
     e.click();
    },config.open);
    await wait();
   }
  };
  const set=async(field,value)=>page.eval(({selector,value})=>{
   const es=[...document.querySelectorAll(selector)],e=es[0];if(!e)throw Error('Missing field: '+selector);
   if(e.type==='radio'){
    const chosen=es.find(x=>x.value===String(value));if(!chosen||chosen.matches(':disabled')||!chosen.checkVisibility({checkVisibilityCSS:true}))throw Error('Unavailable radio value: '+selector);chosen.click();return chosen.checked;
   }
   if(es.length!==1||e.matches(':disabled')||e.readOnly||!e.checkVisibility({checkVisibilityCSS:true}))throw Error('Field not editable: '+selector);
   const proto=e instanceof HTMLSelectElement?HTMLSelectElement.prototype:e instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
   const key=e.type==='checkbox'?'checked':'value';Object.getOwnPropertyDescriptor(proto,key).set.call(e,value);
   e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));
   if(key==='checked'?e.checked!==value:e.value!==String(value))throw Error('Value rejected: '+selector);
   return key==='checked'?e.checked:e.value;
  },{selector:field.selector,value});
  const reset=async()=>{await navigate();for(const f of config.fields)await set(f,f.value);await click(config.submit);if(!await visible(config.success))throw Error('Valid fixture did not reach visible success');};
  await navigate();
  const collect=()=>page.eval(c=>{
   const forms=document.querySelectorAll(c.form);if(forms.length!==1||!(forms[0] instanceof HTMLFormElement))throw Error('form must select one native form');
   const f=forms[0],out=[];
   for(const e of [...f.elements]){
    if(['submit','button','reset','hidden','fieldset'].includes(e.type)||e.tagName==='FIELDSET')continue;
    const hit=c.fields.filter(x=>e.matches(x.selector));
    out.push({id:e.id,name:e.name,type:e.type,tag:e.tagName,covered:hit.length===1,selector:hit[0]?.selector});
   }
   for(const e of f.querySelectorAll('[role="combobox"],[role="slider"],[role="switch"],[role="checkbox"],[role="radio"],[contenteditable="true"],button[aria-pressed],iframe'))if(![...f.elements].includes(e)||e.matches('button[aria-pressed]'))out.push({id:e.id,type:'custom',covered:false});
   return out;
  },config);
  const inventory=await collect();
  report.inventory=inventory;
  report.uncovered=inventory.filter(x=>!x.covered);
  for(const field of config.fields){
   const row={selector:field.selector,status:'UNVERIFIED',resubmitted:false};report.fields.push(row);
   try{
    if(!Object.hasOwn(field,'mutation')||field.value===field.mutation)throw Error('A distinct valid mutation fixture is required');
    const members=inventory.filter(x=>x.selector===field.selector);
    if(!members.length||members.some(x=>!['text','email','tel','url','search','password','number','date','time','datetime-local','month','week','range','color','checkbox','radio','select-one','textarea'].includes(x.type)))throw Error('Unsupported or uncovered native field');
    await reset();
    for(const item of await collect())if(!inventory.some(prior=>JSON.stringify(prior)===JSON.stringify(item)))inventory.push(item);
    report.uncovered=inventory.filter(x=>!x.covered);
    const protectedState=await page.eval(s=>[...document.querySelectorAll(s)].every(e=>e.matches(':disabled')||e.readOnly||!e.checkVisibility({checkVisibilityCSS:true})),field.selector);
    row.protected=protectedState;
    if(protectedState){if(!config.edit)throw Error('Protected field needs an edit selector');await click(config.edit);if(await visible(config.success)){row.status='FAIL';row.reason='Edit left success visible';continue;}}
    await set(field,field.mutation);await wait();
    if(await visible(config.success)){row.status='FAIL';row.reason='Changing input left success visible';continue;}
    row.invalidated=true;
    await click(config.submit);row.resubmitted=await visible(config.success);
    row.status=row.resubmitted?'PASS':'FAIL';if(!row.resubmitted)row.reason='Could not confirm mutated valid input';
   }catch(e){row.reason=e.message;}
  }
  report.status=report.fields.some(x=>x.status==='FAIL')?'FAIL':report.uncovered.length||report.fields.some(x=>x.status==='UNVERIFIED')?'UNVERIFIED':'PASS';
 }catch(e){report.error=e.message;}finally{if(page)await page.close();}
 return report;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 let browser,result;
 try{
  const [target,configPath,output]=process.argv.slice(2);if(!target||!configPath)throw Error('Usage: node check-mutations.mjs <local-url-or-file> <config.json> [report.json]');
  const url=/^(file|https?):/.test(target)?target:pathToFileURL(resolve(target)).href;
  const config=JSON.parse(readFileSync(configPath,'utf8').replace(/^\uFEFF/,''));browser=await Browser.launch();result=await checkMutations(browser,url,config);
  if(output)writeFileSync(output,JSON.stringify(result,null,2)+'\n');
 }catch(e){result={status:'UNVERIFIED',error:e.message};}finally{if(browser)await browser.close();}
 console.log(JSON.stringify(result,null,2));process.exit(result.status==='PASS'?0:result.status==='FAIL'?1:2);
}
