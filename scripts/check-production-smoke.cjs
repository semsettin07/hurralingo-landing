// Read-only smoke tests against the authorized production domain, using a persistent Chromium
// connection to tolerate the intermittent Pages TLS resets on this workstation.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),cheerio=require('cheerio');
const root=path.resolve(__dirname,'..');
const {chromium}=require(process.env.HURRA_PLAYWRIGHT_PATH||path.resolve(root,'../hurralingo/node_modules/playwright-core'));
const origin='https://www.hurralingo.com';
assert.equal(process.env.HURRA_PRODUCTION_SMOKE,'1','Explicit production smoke-test switch required');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const routes=read('content/site/canonical-tr.json'),rules=read('content/site/redirects-tr.json').rules;
const out=path.join(root,'docs/phase-1c/production');fs.mkdirSync(out,{recursive:true});
const result={origin,transport:'Chromium',canonical:[],foreign:[],redirects:[],widths:[],pricingScenarios:0,teacherFilters:[],blogSearch:false,mobileMenu:false,pageErrors:[],failedLocalResponses:[],networkRetries:[],pass:false};
const money=n=>new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:0}).format(n);
const pause=n=>new Promise(r=>setTimeout(r,n));
(async()=>{
 const browser=await chromium.launch();let context,base;
 const watch=p=>{p.on('pageerror',e=>result.pageErrors.push({url:p.url(),error:e.message}));p.on('response',r=>{if(r.url().startsWith(origin)&&r.status()>=400&&!r.url().includes('/unknown-phase1b-page/'))result.failedLocalResponses.push({url:r.url(),status:r.status()})});};
 try{
  for(let attempt=0;attempt<12;attempt++){
   context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
   await context.addInitScript(()=>localStorage.setItem('hl-ck','reject'));base=await context.newPage();
   try{const r=await base.goto(origin+'/',{waitUntil:'domcontentloaded',timeout:15000});assert.equal(r.status(),200);break;}
   catch(e){result.networkRetries.push({stage:'connect',attempt:attempt+1,error:e.message.split('\n')[0]});await context.close();context=null;if(attempt===11)throw e;await pause(200);}
  }
  watch(base);
  assert.ok(await base.locator('#t-empty').isHidden());
  assert.match(await base.locator('#son p').first().textContent(),/Çocuklar, gençler ve yetişkinler/);
  async function remoteFetch(route){
   for(let n=0;n<5;n++)try{return await base.evaluate(async u=>{const r=await fetch(u);return{status:r.status,url:r.url,headers:Object.fromEntries(r.headers),body:await r.text()}},origin+route)}catch(e){result.networkRetries.push({stage:'fetch',route,attempt:n+1,error:e.message.split('\n')[0]});if(n===4)throw e;await pause(250);}
  }
  for(const route of routes){const r=await remoteFetch(route);assert.equal(r.status,200,route);const $=cheerio.load(r.body);assert.equal($('meta[name=robots]').attr('content'),'index, follow',route);assert.ok(!/noindex/i.test(r.headers['x-robots-tag']||''),route);assert.equal($('link[rel=canonical]').attr('href'),'https://www.hurralingo.com'+route);result.canonical.push({route,status:200,indexable:true,headerNoindex:false});}
  const robots=await remoteFetch('/robots.txt');assert.equal(robots.status,200);assert.ok(robots.body.includes('Allow: /'));assert.ok(!/^Disallow:\s*\/\s*$/m.test(robots.body));result.robotsBlocked=false;
  const xml=cheerio.load((await remoteFetch('/sitemap.xml')).body,{xmlMode:true});assert.equal(xml('loc').length,43);result.sitemapUrls=43;
  console.log('PASS: 43 remote Turkish pages, canonical, production meta/header indexing, robots and sitemap.');
  for(const [route,language]of [['/en/','en'],['/de/','de'],['/az/','az']]){const r=await remoteFetch(route);assert.equal(r.status,200,route);const $=cheerio.load(r.body);assert.equal($('html').attr('lang'),language);assert.ok($('h1').text());result.foreign.push({route,language,status:200});}
  const page=await context.newPage();watch(page);
  async function goto(route){for(let n=0;n<4;n++)try{return await page.goto(origin+route,{waitUntil:'load',timeout:30000})}catch(e){result.networkRetries.push({stage:'navigate',route,attempt:n+1,error:e.message.split('\n')[0]});if(n===3)throw e;await page.waitForTimeout(300);}}
  await goto('/ucretler/');await page.locator('#calculator-body:not([hidden])').waitFor();
  for(const row of read('docs/pricing-2027/calculation-verification.json').verified){for(const key of ['model','teacher','membership','frequency'])await page.locator('#fee-'+key).selectOption(String(row[key]));if(row.membership!=='monthly')await page.locator('#fee-payment').selectOption(row.payment);assert.equal(await page.locator('#selected-price').textContent(),money(row.expectedLesson));assert.equal(await page.locator('#selected-total').textContent(),money(row.expectedTotal));assert.equal(await page.locator('#fee-payment').isDisabled(),row.membership==='monthly');result.pricingScenarios++;}
  await goto('/ogretmenlerimiz/');assert.equal(await page.locator('#teachers .teacher').count(),38);
  for(const language of ['İngilizce','Almanca','Fransızca','İspanyolca','Rusça','Çince','Türkçe','all']){await page.locator(`[data-filter="${language}"]`).click();await page.waitForFunction(l=>[...document.querySelectorAll('#teachers .teacher')].every(n=>n.hidden===(l!=='all'&&n.dataset.lang!==l)),language);const count=await page.locator('#teachers .teacher:not([hidden])').count();if(language==='Çince'){assert.equal(count,1);assert.ok((await page.locator('#teachers .teacher:not([hidden])').textContent()).includes('Yanshan Lin'));}if(language==='Türkçe'){assert.equal(count,0);assert.ok(await page.locator('#t-empty').isVisible())}if(language==='all')assert.equal(count,38);result.teacherFilters.push({language,count});}
  await goto('/blog/');assert.equal(await page.locator('[data-post-card]').count(),34);await page.locator('input[name=q]').fill('zzzz-qa-no-result');await page.locator('#blog-empty').waitFor({state:'visible'});await page.locator('button[type=reset]').click();await page.waitForFunction(()=>[...document.querySelectorAll('[data-post-card]')].filter(n=>!n.hidden).length===34);await page.locator('input[name=q]').fill('dil');assert.ok(await page.locator('[data-post-card]:visible').count()>0);result.blogSearch=true;
  for(const width of [320,390,768,1024,1440,1842]){await page.setViewportSize({width,height:900});await goto('/');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth));if(width<1440){await page.locator('#hd-menu').click();await page.locator('#drawer').waitFor({state:'visible'});assert.equal(await page.locator('#drawer .dr-list a').count(),8);await page.keyboard.press('Escape');await page.locator('#drawer').waitFor({state:'hidden'});assert.ok(await page.locator('#hd-menu').evaluate(n=>n===document.activeElement));}result.widths.push({width,overflow:false});}
  await page.setViewportSize({width:390,height:900});await page.locator('#hd-menu').click();await page.locator('#drawer .dr-ages a').first().click();await page.waitForURL(url=>url.pathname==='/derslerimiz/');result.mobileMenu=true;
  console.log('PASS: remote 60 pricing cases, 38 teachers/eight filters, blog search/reset, mobile menu and six widths.');
  // Browser navigation exposes the real first HTTP response before following it.
  const helperRules=Object.fromEntries(Object.entries(read('content/site/redirects-tr.json').cloudflareUnicodeFallbacks||{}).map(([from,to])=>[from.replace(':legacyemoji','phase1c-fallback-check'),to]));
  for(const [from,to]of Object.entries({...rules,...helperRules})){
   const tab=await context.newPage();let first;tab.on('response',r=>{if(!first&&r.request().isNavigationRequest()&&r.request().frame()===tab.mainFrame())first=r;});
   try{const final=await tab.goto(origin+from,{waitUntil:'commit',timeout:30000});assert.ok(first,from);assert.equal(first.status(),301,from);const headers=await first.allHeaders(),actual=new URL(headers.location,origin);assert.equal(actual.origin,origin,'Redirect escapes preview');assert.equal(decodeURI(actual.pathname+actual.hash),decodeURI(to),from);assert.equal(final.status(),200,to);result.redirects.push({from,to,status:301,targetStatus:200});}finally{await tab.close();}
  }
  result.explicitRedirects=Object.keys(rules).length;result.helperRedirects=Object.keys(helperRules).length;
  const unknown=await remoteFetch('/unknown-phase1b-page/');assert.equal(unknown.status,404);result.unknown404=true;
  assert.deepEqual(result.pageErrors,[]);assert.deepEqual(result.failedLocalResponses,[]);
  await page.setViewportSize({width:1440,height:1000});await goto('/');await page.screenshot({path:path.join(out,'remote-home-1440.png'),fullPage:false,animations:'disabled'});
  await page.setViewportSize({width:390,height:900});await goto('/');await page.screenshot({path:path.join(out,'remote-home-390.png'),fullPage:false,animations:'disabled'});
  result.pass=true;console.log('PASS: '+result.redirects.length+' remote 301 rules and target responses; no JS/HTTP errors.');
 }catch(e){result.failure=e.stack;throw e;}finally{fs.writeFileSync(path.join(out,'remote-verification.json'),JSON.stringify(result,null,2)+'\n');await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
