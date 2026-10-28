import { readFileSync,writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Browser } from '../toolkit/taste/scripts/lib/cdp.mjs';
import { inspectUIState } from './check-ui-state.mjs';

const limitations=[
 'Static HTML with page scripts disabled before navigation; this does not simulate Google rendering or establish indexability, rankings, content truth or conversion.',
 'Only task-selected essential text at 1440 and 390 CSS pixels is checked for visibility and measured clipping. Vertical position below the fold is allowed. No occlusion, contrast, keyboard, iframe or shadow-root coverage.',
 'Native same-document fragment links only; external links, other routes, robots headers, sitemap, deployed canonical correctness and server responses need separate deployment checks.',
 'Image alt presence, canonical and structured-data observations are not semantic validation. Empty alt may be appropriate; schema and canonical are not universal requirements.',
 'File/loopback target restriction is not a network sandbox. Styles, images and redirects can still contact external resources; use trusted local fixtures.'
];
const isLocal=url=>url.protocol==='file:'||(['http:','https:'].includes(url.protocol)&&['localhost','127.0.0.1','[::1]'].includes(url.hostname)&&!url.username&&!url.password);
function validate(config){
 if(!config||typeof config!=='object'||Array.isArray(config)||Object.keys(config).some(k=>!['profile','essential','metadataRequired'].includes(k)))throw Error('Expected config object with profile, essential and optional metadataRequired only.');
 if(!['public-page','private-app','demo'].includes(config.profile))throw Error('profile must be public-page, private-app or demo.');
 if('metadataRequired' in config&&typeof config.metadataRequired!=='boolean')throw Error('metadataRequired must be boolean.');
 if(config.profile==='public-page'&&config.metadataRequired===false)throw Error('Public page metadata requirements cannot be disabled.');
 if(config.profile==='private-app'&&config.metadataRequired===true)throw Error('Public metadata requirements do not apply to private-app.');
 if('essential' in config&&(!Array.isArray(config.essential)||config.essential.some(s=>typeof s!=='string'||!s.trim())||new Set(config.essential).size!==config.essential.length))throw Error('essential must contain unique nonempty CSS selectors.');
 if(config.profile!=='private-app'&&!config.essential?.length)throw Error('Public-page and demo profiles require selected essential text.');
}

export async function checkDiscovery(browser,url,config){
 const report={url,status:'UNVERIFIED',publicSEO:'UNVERIFIED',checks:[],observations:null,scope:{javascript:'disabled before navigation',widths:[1440,390],mode:'static content resilience'},limitations};
 let page;
 try{
  validate(config);if(!isLocal(new URL(url)))throw Error('Only file or loopback targets are supported.');
  report.profile=config.profile;report.publicSEO=config.profile==='private-app'?'NOT_APPLICABLE':'CHECKED_SCOPE_ONLY';
  page=await browser.newPage();await page.send('Emulation.setScriptExecutionDisabled',{value:true});
  if(await page.goto(url,{settleMs:100})==='timeout')throw Error('Navigation timed out.');
  const finalURL=await page.eval(()=>location.href);if(!isLocal(new URL(finalURL)))throw Error('Navigation left file/loopback scope.');report.finalURL=finalURL;
  report.observations=await page.eval(()=>{
   const descriptions=[...document.querySelectorAll('meta[name]')].filter(e=>e.getAttribute('name').toLowerCase()==='description').map(e=>e.content.trim());
   const headings=[...document.querySelectorAll('h1')].map(e=>e.textContent.trim());
   const links=[...document.querySelectorAll('a[href]')].map(a=>{
    const raw=a.getAttribute('href');let u;
    try{u=new URL(raw,document.baseURI);}catch{return {href:raw,malformed:true};}
    const here=new URL(location.href);const same=u.origin===here.origin&&u.pathname===here.pathname&&u.search===here.search;
    const row={href:raw,sameDocument:same,fragment:u.hash};
    if(same&&u.hash){try{const id=decodeURIComponent(u.hash.slice(1));row.targetExists=!!document.getElementById(id)||[...document.getElementsByName(id)].some(e=>e.tagName==='A');}catch{row.malformedFragment=true;}}
    return row;
   });
   return {title:document.title.trim(),descriptions,headings,links,images:[...document.images].map(i=>({src:i.getAttribute('src'),altPresent:i.hasAttribute('alt'),alt:i.getAttribute('alt')})),canonicals:[...document.querySelectorAll('link[rel~="canonical"]')].map(e=>e.getAttribute('href')),structuredDataBlocks:document.querySelectorAll('script[type="application/ld+json"]').length,robots:[...document.querySelectorAll('meta[name="robots"]')].map(e=>e.content)};
  });
  const add=(kind,pass,reason)=>report.checks.push({kind,status:pass?'PASS':'FAIL',reason});
  const metadata=config.profile==='public-page'||(config.profile==='demo'&&config.metadataRequired===true);
  if(metadata){const o=report.observations;add('title',!!o.title,'Nonempty static document title.');add('description',o.descriptions.length===1&&!!o.descriptions[0],'One nonempty static meta description.');add('main-heading',o.headings.some(Boolean),'At least one nonempty native h1.');}
  if(config.profile!=='private-app')for(const link of report.observations.links)if(link.sameDocument&&link.fragment){if(link.malformedFragment)report.checks.push({kind:'fragment',status:'UNVERIFIED',reason:'Malformed encoded fragment.',href:link.href});else report.checks.push({kind:'fragment',status:link.targetExists?'PASS':'FAIL',reason:'Same-document fragment resolves to an id or named anchor.',href:link.href});}
  if(config.essential?.length){
   // Missing/ambiguous/invalid selectors are coverage errors, never observed content failures.
   const coverage=await page.eval(selectors=>selectors.map(selector=>{try{const nodes=document.querySelectorAll(selector);return {selector,count:nodes.length,text:nodes.length===1?nodes[0].textContent.trim():null};}catch{return {selector,error:'Invalid CSS selector.'};}}),config.essential);
   for(const c of coverage){if(c.error||c.count!==1)report.checks.push({kind:'essential-coverage',selector:c.selector,status:'UNVERIFIED',reason:c.error||`Expected one target, found ${c.count}.`});else if(!c.text)report.checks.push({kind:'essential-text',selector:c.selector,status:'FAIL',reason:'Selected essential text is empty.'});}
   for(const width of report.scope.widths){await page.setViewport({width,height:900});const result=await page.eval(inspectUIState,{content:config.essential});for(const c of result.checks)report.checks.push({...c,width});}
  }
  report.status=report.checks.some(c=>c.status==='UNVERIFIED')?'UNVERIFIED':report.checks.some(c=>c.status==='FAIL')?'FAIL':'PASS';
 }catch(e){report.status='UNVERIFIED';report.error=e.message;}finally{if(page)await page.close();}
 return report;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 let browser,result;const args=process.argv.slice(2);let output=args[2];
 try{if(args.length!==3)throw Error('Usage: node check-discovery.mjs <local-url-or-file> <config.json> <report.json>');
  const [target,configPath]=args;const url=/^(file|https?):/i.test(target)?target:pathToFileURL(resolve(target)).href;
  const config=JSON.parse(readFileSync(configPath,'utf8').replace(/^\uFEFF/,''));validate(config);if(!isLocal(new URL(url)))throw Error('Only file or loopback targets are supported.');
  browser=await Browser.launch();result=await checkDiscovery(browser,url,config);
 }catch(e){result={status:'UNVERIFIED',error:e.message,limitations};}finally{if(browser)await browser.close();}
 try{if(output)writeFileSync(output,JSON.stringify(result,null,2)+'\n');}catch(e){result={...result,status:'UNVERIFIED',outputError:e.message};}
 console.log(JSON.stringify(result,null,2));process.exit(result.status==='PASS'?0:result.status==='FAIL'?1:2);
}
