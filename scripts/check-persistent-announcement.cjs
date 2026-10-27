const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.HURRA_PLAYWRIGHT_PATH||path.resolve(__dirname,'../../hurralingo/node_modules/playwright-core'));
const origin=process.env.HURRA_PREVIEW_URL||'http://127.0.0.1:8017';
const routes=require('../content/i18n/canonical-all.json');
for(const route of routes){const html=fs.readFileSync(route.slice(1)+'index.html','utf8');assert.ok(!html.includes('class="an-x"'),route);assert.ok(html.includes('?v=20261027-bett'),route);}
for(const file of ['assets/site-tr.js',...['en','de','az','fr'].map(l=>'assets/i18n/site-'+l+'.js')])assert.ok(!fs.readFileSync(file,'utf8').includes('hl-announce-v1'),file);
(async()=>{const browser=await chromium.launch({headless:true});const errors=[],checks=[];try{
 const context=await browser.newContext({reducedMotion:'reduce'});
 await context.addInitScript(()=>{localStorage.setItem('hl-announce-v1','1');localStorage.setItem('hl-ck','reject')});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',route=>{const url=route.request().url();if(url.endsWith('/api/country'))return route.fulfill({contentType:'application/json',body:'{"country":null}'});return route.request().resourceType()==='media'||!url.startsWith(origin)?route.abort():route.continue()});
 for(const lang of ['tr','en','de','az','fr'])for(const width of [390,1440]){
  const home=lang==='tr'?'/':`/${lang}/`;
  await page.setViewportSize({width,height:900});await page.goto(origin+home,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.documentElement.classList.contains('js'));
  assert.ok(await page.locator('#announce').isVisible());assert.equal(await page.locator('#announce button').count(),0);
  assert.ok(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
  await page.reload({waitUntil:'domcontentloaded'});assert.ok(await page.locator('#announce').isVisible());
  await page.goto(origin+home+'blog/',{waitUntil:'domcontentloaded'});assert.ok(await page.locator('#announce').isVisible());assert.equal(await page.locator('#announce .an-x').count(),0);
  if(width===390){await page.locator('#hd-menu').click();assert.ok(await page.locator('#drawer').isVisible());await page.keyboard.press('Escape');}
  checks.push({lang,width,previouslyDismissed:true,visibleAfterReloadAndNavigation:true});
 }
 assert.deepEqual(errors,[]);fs.mkdirSync('docs/announcement',{recursive:true});fs.writeFileSync('docs/announcement/verification.json',JSON.stringify({pass:true,origin,staticPages:routes.length,checks,errors},null,2)+'\n');console.log('PASS: '+routes.length+' static pages and 10 browser scenarios; previous dismissal ignored, banner persists, mobile menus work.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
