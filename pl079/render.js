// Renderiza cada variante a PNG 1080x1350 y reporta texto desbordado o fuera del lienzo.
const {chromium}=require('playwright');const path=require('path');
const files=process.argv.slice(2);
(async()=>{const b=await chromium.launch();
for(const f of files){const p=await b.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:1});
await p.goto('file://'+path.resolve(f));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(800);
const issues=await p.evaluate(()=>{const out=[];for(const el of document.querySelectorAll('.poster *')){
 if(el.closest('[data-allow-bleed]'))continue;
 const r=el.getBoundingClientRect();if(!r.width||!el.textContent.trim())continue;
 if(el.scrollWidth>el.clientWidth+1&&getComputedStyle(el).overflow!=='visible')out.push('overflow '+el.className+' '+el.textContent.slice(0,30));
 if(el.children.length===0&&(r.left<0||r.top<0||r.right>1080||r.bottom>1350))out.push('offcanvas '+el.className+' '+el.textContent.slice(0,30)+' '+JSON.stringify([r.left,r.top,r.right,r.bottom].map(Math.round)));}
 return out;});
console.log(f,issues.length?issues:'OK');
await p.locator('.poster').screenshot({path:f.replace('.html','.png')});await p.close();}
await b.close();})();
