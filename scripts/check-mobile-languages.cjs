const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),c=require('cheerio');
const {chromium}=require(process.env.HURRA_PLAYWRIGHT_PATH||path.resolve(__dirname,'../../hurralingo/node_modules/playwright-core'));
const origin=process.env.HURRA_AUTO_ORIGIN||'http://127.0.0.1:8021';
const names={tr:'Türkçe',en:'English',de:'Deutsch',fr:'Français',az:'Azərbaycanca'};
const codes=Object.keys(names),routes=require('../content/i18n/canonical-all.json');
const report={pages:0,layouts:[],transitions:[],errors:[]};
for(const route of routes){
  const file=route.slice(1)+'index.html',html=fs.readFileSync(file,'utf8'),$=c.load(html);
  const before=c.load(cp.execFileSync('git',['show','HEAD:'+file],{encoding:'utf8',maxBuffer:4e6}));
  assert.equal($('.dr-language').length,0,route);
  assert.deepEqual($('#drawer .dr-langs a').map((i,e)=>$(e).attr('lang')).get(),codes,route);
  assert.equal($('#drawer .dr-langs').text().trim(),'','Only flags should be visible');
  for(const lang of codes){const img=$(`#drawer .dr-langs a[lang=${lang}] img`);assert.equal(img.attr('src'),`/img/flags/${lang==='en'?'gb':lang}.svg`);assert.equal(img.attr('alt'),'');assert.ok(fs.existsSync('.'+img.attr('src')));}
  for(const lang of codes){const a=$(`#drawer .dr-langs a[lang=${lang}]`);assert.equal(a.attr('aria-label'),names[lang]);assert.equal(a.attr('href'),before(`#drawer .dr-langs a[lang=${lang}]`).attr('href'),route);}
  for(const selector of ['#hdr','main','#drawer .dr-hello','#drawer .dr-ages','#drawer .dr-list','#drawer .dr-sub','#drawer .dr-foot']){
    assert.equal($(selector).html(),before(selector).html(),'Unrelated markup changed: '+route+' '+selector);
  }
  report.pages++;
}
(async()=>{
 const browser=await chromium.launch();
 try{
  const context=await browser.newContext({reducedMotion:'reduce'});
  await context.addInitScript(()=>localStorage.setItem('hl-ck','reject'));
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
  await page.route('**/api/country',r=>r.fulfill({json:{country:'TR'}}));
  for(const lang of codes)for(const width of [320,360,390,430]){
   await page.setViewportSize({width,height:900});await page.goto(origin+(lang==='tr'?'/':`/${lang}/`));
   const row=page.locator('#drawer .dr-langs');assert.ok(await row.isHidden());await page.locator('#hd-menu').click();assert.ok(await row.isVisible());
   assert.equal(await row.locator('a[aria-current=page]').getAttribute('lang'),lang);
   const geometry=await row.evaluate(row=>{
    const rect=e=>{const r=e.getBoundingClientRect();return{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
    return{row:rect(row),links:[...row.querySelectorAll('a')].map(rect),flags:[...row.querySelectorAll('img')].map(img=>({...rect(img),loaded:img.complete&&img.naturalWidth>0})),list:rect(row.nextElementSibling),wrap:rect(row.parentElement),overflow:document.documentElement.scrollWidth>innerWidth,colors:[...row.querySelectorAll('a')].map(a=>{const frame=getComputedStyle(a.querySelector('.language-flag'));return{active:a.hasAttribute('aria-current'),background:getComputedStyle(a).backgroundColor,border:frame.borderTopColor,borderWidth:frame.borderTopWidth,padding:frame.paddingTop}})};
   });
   assert.equal(geometry.overflow,false);assert.ok(await row.evaluate(e=>e.nextElementSibling.classList.contains('dr-list')));
   const links=geometry.links;assert.equal(links.length,5);
   for(const link of links){assert.ok(Math.abs(link.top-links[0].top)<1);assert.ok(Math.abs(link.width-links[0].width)<1);assert.ok(link.width>=44);assert.ok(link.height>=44);}
   for(const [i,flag]of geometry.flags.entries()){assert.equal(flag.width,36);assert.equal(flag.height,27);assert.equal(flag.loaded,true);assert.ok(Math.abs((flag.left+flag.right)/2-(links[i].left+links[i].right)/2)<1);assert.ok(Math.abs(flag.top-geometry.flags[0].top)<1);}
   const gaps=links.slice(1).map((r,i)=>r.left-links[i].right);for(const gap of gaps)assert.ok(Math.abs(gap-6)<1);
   assert.ok(Math.abs((links[0].left-geometry.wrap.left)-(geometry.wrap.right-links[4].right))<1);
   assert.ok(Math.abs(geometry.list.top-geometry.row.bottom-22)<1);
   const active=geometry.colors.find(a=>a.active);assert.equal(active.border,'rgb(8, 45, 86)');assert.equal(active.borderWidth,'2px');assert.equal(active.padding,'4px');assert.ok(geometry.colors.every(a=>a.background==='rgba(0, 0, 0, 0)'));assert.ok(geometry.colors.filter(a=>!a.active).every(a=>a.border==='rgba(0, 0, 0, 0)'));
   report.layouts.push({lang,width,gaps,buttonWidth:links[0].width,educationGap:geometry.list.top-geometry.row.bottom});
   if(lang==='tr')await page.screenshot({path:`docs/mobile-language-row-${width}.png`});
   await page.keyboard.press('Escape');
  }
  // Exercise real links on an inner page, preserving page mapping and manual preference.
  for(const lang of codes){
   await page.goto(origin+'/en/lessons/');await page.locator('#hd-menu').click();
   const link=page.locator(`#drawer .dr-langs a[lang=${lang}]`),target=await link.getAttribute('href');
   const alternate=await page.locator(`link[rel=alternate][hreflang=${lang}]`).getAttribute('href');assert.equal(target,new URL(alternate).pathname);
   await link.click();await page.waitForURL(u=>u.pathname===target);
   assert.equal(await page.evaluate(()=>localStorage.getItem('hl-language-choice').split('.')[0]),lang);
   await page.goto(origin+'/');await page.waitForURL(u=>u.pathname===(lang==='tr'?'/':`/${lang}/`));
   report.transitions.push({lang,target});
  }
  await page.setViewportSize({width:1440,height:900});await page.goto(origin+'/en/');assert.ok(await page.locator('#drawer').isHidden());
  await page.locator('#hdr .lang-dd > button').click();assert.equal(await page.locator('#hd-lang a[lang]').count(),5);assert.ok(await page.locator('#hd-lang').isVisible());
  assert.deepEqual(report.errors,[]);report.pass=true;
  console.log(`PASS: ${report.pages} pages preserve desktop/other menu markup and language routes; ${report.layouts.length} mobile layouts; ${report.transitions.length} mapped/persisted language transitions; desktop dropdown.`);
 }finally{await browser.close();fs.writeFileSync('docs/mobile-language-row-verification.json',JSON.stringify(report,null,2)+'\n');}
})().catch(e=>{console.error(e);process.exitCode=1});
