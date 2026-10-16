// Focused regression check for the original header restored at the user's request.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.HURRA_PLAYWRIGHT_PATH||path.resolve(__dirname,'../../hurralingo/node_modules/playwright-core'));
const origin=process.argv[2]||'http://127.0.0.1:8021';
assert.ok(/^http:\/\/127\.0\.0\.1:8021$|^https:\/\/[a-z0-9-]+\.hurralingo-landing\.pages\.dev$/.test(origin));
const dir='docs/phase-1b-header';fs.mkdirSync(dir,{recursive:true});
const remote=origin.startsWith('https:'),label=remote?'remote':'local';
const result={origin,pass:false,widths:[],errors:[],dropdown:false,announcement:false,mobileMenu:false};
(async()=>{const browser=await chromium.launch();let context,page;try{
 for(let i=0;i<12;i++){context=await browser.newContext({reducedMotion:'reduce'});await context.addInitScript(()=>localStorage.setItem('hl-ck','reject'));page=await context.newPage();try{await page.goto(origin+'/',{waitUntil:'load',timeout:20000});break}catch(e){await context.close();if(i===11)throw e;}}
 page.on('pageerror',e=>result.errors.push(e.message));
 for(const route of ['/','/iletisim/'])for(const width of [320,390,768,1024,1181,1280,1440,1842]){
  await page.setViewportSize({width,height:950});await page.goto(origin+route,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);
  assert.ok(await page.locator('#announce').isVisible());assert.ok((await page.locator('#announce').textContent()).includes('Bett UK 2026'));
  assert.deepEqual(await page.locator('#hdr .nav .nav-a').allTextContents(),['Programlar','Öğretmenler','Fiyatlar','Veli soruları','Kurumlar','Blog']);
  const layout=await page.evaluate(()=>{const bar=document.querySelector('#hdr .bar').getBoundingClientRect(),logo=document.querySelector('#hdr .brand img').getBoundingClientRect(),content=document.querySelector('.hero-in,.page-intro').getBoundingClientRect();return{overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,logoLeft:logo.left,contentLeft:content.left,barWidth:bar.width,logoWidth:logo.width}});
  assert.equal(layout.overflow,false);assert.ok(Math.abs(layout.logoLeft-layout.contentLeft)<1);assert.ok(layout.logoWidth>=200);
  if(width>=1280)assert.ok(layout.logoLeft>50,'Header must remain centered');
  if(width<1181){await page.locator('#hd-menu').click();await page.locator('#drawer').waitFor({state:'visible'});assert.equal(await page.locator('#drawer .dr-ages a').count(),4);assert.equal(await page.locator('#drawer .dr-list a').count(),4);await page.keyboard.press('Escape');await page.locator('#drawer').waitFor({state:'hidden'});assert.ok(await page.locator('#hd-menu').evaluate(n=>n===document.activeElement));}
  result.widths.push({route,width,...layout});
  if([390,1842].includes(width))await page.screenshot({path:`${dir}/${label}-${route==='/'?'home':'contact'}-${width}.png`,animations:'disabled'});
 }
 await page.setViewportSize({width:1440,height:950});await page.goto(origin+'/');await page.locator('#hdr .dd-trig[href="/derslerimiz/#programlar"]').focus();await page.keyboard.press('ArrowDown');await page.waitForFunction(()=>document.querySelector('#hdr .nav-dd').classList.contains('is-open'));assert.equal(await page.locator('#hd-prog .dd-grid a').count(),4);await page.keyboard.press('Escape');assert.equal(await page.locator('#hdr .nav-dd').first().getAttribute('class'),'nav-dd');result.dropdown=true;
 await page.locator('#announce .an-x').click();await page.locator('#announce').waitFor({state:'hidden'});await page.goto(origin+'/iletisim/');assert.ok(await page.locator('#announce').isHidden());await page.evaluate(()=>localStorage.removeItem('hl-announce-v1'));await page.reload();assert.ok(await page.locator('#announce').isVisible());result.announcement=true;
 await page.setViewportSize({width:390,height:950});await page.locator('#hd-menu').click();await page.locator('#drawer .dr-ages a').first().click();await page.waitForURL(u=>u.pathname==='/derslerimiz/');result.mobileMenu=true;
 assert.deepEqual(result.errors,[]);result.pass=true;console.log('PASS: original header, Bett banner, alignment at 16 route/width combinations, dropdown, drawer and persistent announcement dismissal.');
}catch(e){result.failure=e.stack;throw e}finally{fs.writeFileSync(`${dir}/${label}-verification.json`,JSON.stringify(result,null,2)+'\n');await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
