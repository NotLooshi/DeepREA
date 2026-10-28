import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {Browser} from '../toolkit/taste/scripts/lib/cdp.mjs';
const local=u=>u.protocol==='file:'||(['http:','https:'].includes(u.protocol)&&['localhost','127.0.0.1','[::1]'].includes(u.hostname)&&!u.username&&!u.password);
export function inspectRendered(config){
 const checks=[],normal=s=>s.replace(/\s+/g,' ').trim();
 const hidden=e=>{for(let a=e;a;a=a.parentElement){const s=getComputedStyle(a);if(a.hidden||s.display==='none'||s.visibility==='hidden'||Number(s.opacity)===0)return true;}return false;};
 const accessibleOnly=e=>{for(let a=e;a;a=a.parentElement){const s=getComputedStyle(a),b=a.getBoundingClientRect();const clippedAway=s.clip.replace(/\s/g,'')==='rect(0px,0px,0px,0px)'||s.clipPath.replace(/\s/g,'')==='inset(50%)';if(['absolute','fixed'].includes(s.position)&&b.width<=1&&b.height<=1&&clippedAway)return true;}return false;};
 const clipped=(e,rects)=>{const issues=[];for(let a=e;a;a=a.parentElement){const s=getComputedStyle(a),b=a.getBoundingClientRect();
  const x=['hidden','clip'].includes(s.overflowX),y=['hidden','clip'].includes(s.overflowY);
  if(rects.some(r=>(x&&(r.left<b.left-1||r.right>b.right+1))||(y&&(r.top<b.top-1||r.bottom>b.bottom+1))))issues.push(a.tagName.toLowerCase()+(a.id?'#'+a.id:''));
 }return issues;};
 for(const item of config.critical){try{const nodes=document.querySelectorAll(item.selector);if(nodes.length!==1){checks.push({kind:'critical',id:item.id,status:'UNVERIFIED',reason:`Expected one target, found ${nodes.length}`});continue;}
  const e=nodes[0],text=normal(e.textContent||''),range=document.createRange();range.selectNodeContents(e);const rects=[...range.getClientRects()].filter(r=>r.width&&r.height);
  const reasons=[];if(hidden(e)||!rects.length)reasons.push('Not rendered');if(!text.includes(normal(item.expectedText)))reasons.push('Expected supplied text missing');if(clipped(e,rects).length)reasons.push('Text crosses clipping boundary');
  checks.push({kind:'critical',id:item.id,status:reasons.length?'FAIL':'PASS',reason:reasons.join('; ')||'Expected text rendered within clipping boundaries',text});
 }catch(e){checks.push({kind:'critical',id:item.id,status:'UNVERIFIED',reason:e.message});}}
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node,count=0;
 while(node=walker.nextNode()){const e=node.parentElement,text=normal(node.textContent||'');if(!e||!text||e.closest('script,style,noscript,template,[aria-hidden="true"]')||hidden(e)||accessibleOnly(e))continue;
  const range=document.createRange();range.selectNodeContents(node);const rects=[...range.getClientRects()].filter(r=>r.width&&r.height);if(!rects.length)continue;count++;
  const ancestors=clipped(e,rects);if(ancestors.length)checks.push({kind:'text-clipping',status:'FAIL',text:text.slice(0,160),element:e.tagName.toLowerCase(),ancestors});
 }
 checks.push({kind:'scan-coverage',status:count?'PASS':'UNVERIFIED',textNodes:count});return checks;
}
export async function checkRendered(browser,url,config,captureDir){
 const result={status:'UNVERIFIED',checks:[],captures:[],scope:{widths:[390,768,1440],height:900,dpr:1},limitations:['Geometry checks clipping boundaries, not painted occlusion, contrast, aesthetics, facts omitted from the ledger or accessibility conformity.','Automatic scan excludes hidden/aria-hidden text and allows scrollable regions. Critical targets remain explicitly checked. No shadow DOM or iframe coverage.','Only initial state is captured; task-specific interaction, motion, zoom and short-height checks remain necessary. Images must actually be opened and reviewed; their existence does not prove review.','Local target restriction is not a network sandbox. Use trusted fixtures.']};
 let page;try{
  if(!config||Object.keys(config).some(k=>k!=='critical')||!Array.isArray(config.critical)||!config.critical.length)throw Error('Config needs a nonempty critical array only.');
  const ids=new Set();for(const x of config.critical){if(!x||Object.keys(x).some(k=>!['id','selector','expectedText'].includes(k))||['id','selector','expectedText'].some(k=>typeof x[k]!=='string'||!x[k].trim())||ids.has(x.id))throw Error('Each critical item needs unique id, selector and expectedText.');ids.add(x.id);}
  if(!local(new URL(url)))throw Error('Use a file or loopback URL.');
  page=await browser.newPage();if(captureDir)mkdirSync(captureDir,{recursive:true});
  for(const width of result.scope.widths){await page.setViewport({width,height:900});if(await page.goto(url)==='timeout')throw Error('Navigation timed out');if(!local(new URL(await page.eval(()=>location.href))))throw Error('Navigation left local scope');
   await page.eval(async()=>{await document.fonts.ready;});result.checks.push(...(await page.eval(inspectRendered,config)).map(c=>({...c,width})));
   if(captureDir){for(const fullPage of [false,true]){const path=resolve(captureDir,`${width}-${fullPage?'full':'first'}.png`);await page.screenshot({path,format:'png',fullPage});result.captures.push({path,width,height:900,dpr:1,fullPage,fonts:'ready'});}}
  }
  result.status=result.checks.some(c=>c.status==='FAIL')?'FAIL':result.checks.some(c=>c.status==='UNVERIFIED')?'UNVERIFIED':'PASS';
 }catch(e){result.error=e.message;}finally{if(page)await page.close();}return result;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){let browser,result;const [target,configPath,out]=process.argv.slice(2);try{
 if(process.argv.length!==5)throw Error('Usage: node check-rendered.mjs <local-url-or-file> <config.json> <output-directory>');
 const config=JSON.parse(readFileSync(configPath,'utf8').replace(/^\uFEFF/,''));browser=await Browser.launch();result=await checkRendered(browser,/^(file|https?):/i.test(target)?target:pathToFileURL(resolve(target)).href,config,out);
 }catch(e){result={status:'UNVERIFIED',error:e.message};}finally{if(browser)await browser.close();}
 if(out){mkdirSync(out,{recursive:true});writeFileSync(join(out,'report.json'),JSON.stringify(result,null,2)+'\n');}console.log(JSON.stringify(result,null,2));process.exit(result.status==='PASS'?0:result.status==='FAIL'?1:2);}
