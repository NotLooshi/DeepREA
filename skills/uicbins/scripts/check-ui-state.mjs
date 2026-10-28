// Self-contained browser-context probe: pass this function to page.eval/evaluate.
export function inspectUIState(config) {
  const checks = [];
  const limitations = [
    'Snapshot of task-selected DOM targets, not a complete accessibility or interaction audit.',
    'Does not test occlusion, colour contrast, semantic correctness, shadow DOM or iframe contents.',
    'Scroll or reveal the intended state first; clipped scroll-container content fails in its current state. Vertical page position alone does not fail.',
    'Uses axis-aligned DOM geometry; rotated/transformed clipping and clip-path/masks need visual inspection.',
    'Does not operate controls, wait for asynchronous state changes, or prove keyboard reachability/custom widget behaviour.'
  ];
  const add = (kind, selector, status, reason) => checks.push({kind,selector,status,reason});
  const result = () => ({status:checks.some(c=>c.status==='UNVERIFIED')?'UNVERIFIED':checks.some(c=>c.status==='FAIL')?'FAIL':'PASS',checks,limitations});
  const selector = s => typeof s==='string' && s.trim().length>0;
  if (!config || typeof config!=='object' || Array.isArray(config) ||
      Object.keys(config).some(k=>!['focus','content','absent','text'].includes(k)) ||
      ('focus' in config && !selector(config.focus)) ||
      ['content','absent'].some(k=>k in config && (!Array.isArray(config[k]) || config[k].some(s=>!selector(s)))) ||
      ('text' in config && (!Array.isArray(config.text) || config.text.some(x=>!x || typeof x!=='object' || Array.isArray(x) || Object.keys(x).some(k=>!['selector','includes'].includes(k)) || !selector(x.selector) || !Array.isArray(x.includes) || !x.includes.length || x.includes.some(t=>!selector(t))))) ||
      !(config.focus || config.content?.length || config.absent?.length || config.text?.length)) {
    add('config',null,'UNVERIFIED','Expected focus, content/absent selectors and/or text entries with selector and nonempty includes strings; unknown keys are rejected.');
    return result();
  }
  const hidden = el => {
    for (let n=el;n;n=n.parentElement) {
      const s=getComputedStyle(n);
      if(n.hidden || s.display==='none' || s.visibility==='hidden' || s.visibility==='collapse' || Number(s.opacity)===0 || s.contentVisibility==='hidden') return true;
    }
    return !el.isConnected || !Array.from(el.getClientRects()).some(r=>r.width>0 && r.height>0);
  };
  const clipped = el => {
    const boxes = Array.from(el.getClientRects());
    const textBoxes = [];
    const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()) {
      const text=walker.currentNode;
      if(!text.textContent.trim() || hidden(text.parentElement))continue;
      const range=document.createRange();range.selectNodeContents(text);
      for(const r of range.getClientRects())if(r.width>0&&r.height>0)textBoxes.push(r);
    }
    // Include the element itself: text can overflow its own fixed-height/ellipsis box.
    for(let n=el;n;n=n.parentElement) {
      if(n===document.documentElement || n===document.body)continue;
      const s=getComputedStyle(n), r=n.getBoundingClientRect();
      const x=['hidden','clip','scroll','auto'].includes(s.overflowX);
      const y=['hidden','clip','scroll','auto'].includes(s.overflowY);
      const left=r.left+n.clientLeft,top=r.top+n.clientTop;
      const measured=n===el?textBoxes:[...boxes,...textBoxes];
      if(measured.some(b=>(x&&(b.left<left-1||b.right>left+n.clientWidth+1)) || (y&&(b.top<top-1||b.bottom>top+n.clientHeight+1))))return true;
    }
    return false;
  };
  for(const [kind,list] of [['focus',config.focus?[config.focus]:[]],['content',config.content||[]],['absent',config.absent||[]]]) {
    for(const target of list) {
      let nodes;
      try{nodes=document.querySelectorAll(target);}catch{add(kind,target,'UNVERIFIED','Invalid CSS selector.');continue;}
      if(nodes.length===0 && kind==='absent'){add(kind,target,'PASS','No matching element.');continue;}
      if(nodes.length!==1){add(kind,target,'UNVERIFIED',`Expected one target, found ${nodes.length}.`);continue;}
      const el=nodes[0];
      if(kind==='absent') {add(kind,target,hidden(el)?'PASS':'FAIL',hidden(el)?'Target hidden.':'Unexpected visible target.');continue;}
      if(hidden(el)){add(kind,target,'FAIL','Target or ancestor is hidden or has no rendered area.');continue;}
      if(kind==='focus') {
        if(el.closest('[inert],[aria-disabled="true"]') || el.matches(':disabled'))add(kind,target,'FAIL','Expected focus target is inert or disabled.');
        else if(document.activeElement!==el)add(kind,target,'FAIL','Active element is not the current expected target.');
        else if(clipped(el))add(kind,target,'FAIL','Focus target is clipped.');
        else add(kind,target,'PASS','Current visible enabled target has focus.');
      } else add(kind,target,clipped(el)?'FAIL':'PASS',clipped(el)?'Target or its text extends beyond an overflow clipping boundary.':'Target and measured text fit their clipping boundaries.');
    }
  }
  for(const item of config.text||[]) {
    let nodes;
    try{nodes=document.querySelectorAll(item.selector);}catch{add('text',item.selector,'UNVERIFIED','Invalid CSS selector.');continue;}
    if(nodes.length!==1){add('text',item.selector,'UNVERIFIED',`Expected one target, found ${nodes.length}.`);continue;}
    const el=nodes[0];
    if(hidden(el)){add('text',item.selector,'FAIL','Expected text target is hidden.');continue;}
    if(typeof el.innerText!=='string'){add('text',item.selector,'UNVERIFIED','Expected an HTML rendered-text target.');continue;}
    const normal=s=>s.replace(/\s+/g,' ').trim(),actual=normal(el.innerText);
    const missing=item.includes.filter(t=>!actual.includes(normal(t)));
    if(missing.length)add('text',item.selector,'FAIL','Missing expected visible text: '+JSON.stringify(missing));
    else if(clipped(el))add('text',item.selector,'FAIL','Expected text is clipped.');
    else add('text',item.selector,'PASS','Expected literal text is rendered within clipping boundaries.');
  }
  return result();
}
