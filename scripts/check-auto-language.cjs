const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {chromium}=require(process.env.HURRA_PLAYWRIGHT_PATH||path.resolve(__dirname,'../../hurralingo/node_modules/playwright-core'));
const c=require('cheerio'),routes=require('../content/i18n/canonical-all.json'),manifest=require('../content/i18n/routes.json');
const origin=process.env.HURRA_AUTO_ORIGIN||'http://127.0.0.1:8017',out='docs/auto-language';
const result={origin,pass:false,scenarios:[],menus:[],seoPages:0,errors:[],consoleErrors:[],expectedCountryErrors:[],countryRequests:0};
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const key='hl-language-choice';
(async()=>{
 const baseline=require('../docs/auto-language/baseline.json');
 assert.equal(hash(fs.readFileSync('sitemap.xml')),baseline.sitemapHash);
 for(const [file,digest] of Object.entries(baseline.assets))assert.equal(hash(fs.readFileSync(file)),digest,file);
 for(const route of routes){const $=c.load(fs.readFileSync(path.join('.',route,'index.html'),'utf8')),before=baseline.source[route];
 assert.equal($('link[rel=canonical]').attr('href'),before.canonical,route);
 assert.deepEqual($('link[rel=alternate][hreflang]').map((i,e)=>$(e).attr('hreflang')+' '+$(e).attr('href')).get(),before.alternates,route);
 assert.equal($('meta[name=robots]').attr('content'),before.robots,route);
 assert.equal(hash($('main').html()),before.mainHash,route);
 assert.equal($('script[src="/assets/auto-language.js"]').length,1,route);result.seoPages++;
 }
 const endpoint=await import('data:text/javascript;base64,'+fs.readFileSync('functions/api/country.js').toString('base64'));
 for(const country of ['DE','AZ','US','TR',null,undefined,'XX','T1','<script>']){
 const response=endpoint.onRequestGet({request:{cf:{country}}});assert.match(response.headers.get('cache-control'),/no-store/);
 assert.deepEqual(await response.json(),{country:['DE','AZ','US','TR'].includes(country)?country:null});
 }
 assert.deepEqual(await endpoint.onRequestGet({request:{}}).json(),{country:null});
 const browser=await chromium.launch();try{
 async function context(options={}){
   const ctx=await browser.newContext({locale:'fr-FR',viewport:{width:1440,height:1000},...options});
   // Font CDN availability is unrelated to language routing; keep tests deterministic.
   await ctx.route('https://fonts.googleapis.com/**',route=>route.fulfill({contentType:'text/css',body:''}));
   await ctx.addInitScript(()=>{try{localStorage.setItem('hl-ck','reject')}catch(_){}});
   ctx.on('page',p=>{
    p.on('pageerror',e=>result.errors.push(e.message));
    p.on('console',message=>{if(message.type()==='error'){const row={text:message.text(),url:message.location().url};if(row.url.includes('/api/country'))result.expectedCountryErrors.push(row);else result.consoleErrors.push(row)}});
    const goto=p.goto.bind(p);p.goto=async(url,options)=>{for(let attempt=0;;attempt++)try{return await goto(url,options)}catch(e){if(attempt>=5||!origin.startsWith('https:')||!/ERR_CONNECTION_RESET|ERR_CONNECTION_CLOSED/.test(e.message))throw e;result.networkRetries=(result.networkRetries||0)+1;}};
   });
   return ctx;
 }
 async function scenario(name,languages,country,expected,options={}){
  const ctx=await context();let calls=0;
  await ctx.addInitScript(({languages,options,key})=>{
   Object.defineProperty(navigator,'languages',{get:()=>languages});
   try{if(options.saved)localStorage.setItem(key,options.saved)}catch(_){}
   if(options.blockStorage)Object.defineProperty(window,'localStorage',{get(){throw new Error('Storage blocked')}});
   if(options.blockCookies)Object.defineProperty(document,'cookie',{get:()=>'',set:()=>{}});
  },{languages,options,key});
  await ctx.route('**/api/country',async route=>{calls++;if(options.fail)return route.abort();if(options.delay)await new Promise(r=>setTimeout(r,options.delay));try{await route.fulfill({json:{country}})}catch(_){}});
  const p=await ctx.newPage();let navigations=0;p.on('framenavigated',frame=>{if(frame===p.mainFrame())navigations++});const response=await p.goto(origin+(options.path||'/')+(options.query||''),{waitUntil:'domcontentloaded'});assert.equal(response.status(),200,name);
  await p.waitForURL(url=>url.pathname===expected);
  if(expected==='/')await p.waitForTimeout(options.delay?1200:1000);
  assert.equal(new URL(p.url()).pathname,expected,name);
  if(options.query)assert.equal(new URL(p.url()).search+new URL(p.url()).hash,options.query);
  if(!options.saved&&!options.blockStorage)assert.equal(await p.evaluate(key=>localStorage.getItem(key),key),null);
  if(languages.some(l=>/^(tr|en|de|az)(-|$)/i.test(l))||options.saved||options.path)assert.equal(calls,0,name+' unnecessary endpoint');
  assert.ok(navigations<=2,name+' redirect loop');result.scenarios.push({name,expected,countryRequests:calls,navigations});result.countryRequests+=calls;await ctx.close();
 }
 for(const [name,langs,country,target]of [
 ['Germany/German',['de-DE'],'DE','/de/'],['Germany/Turkish',['tr-TR'],'DE','/'],
 ['Azerbaijan/Azeri',['az-AZ'],'AZ','/az/'],['USA/English',['en-US'],'US','/en/'],
 ['France/French',['fr-FR'],'FR','/'],['France/English',['en-GB'],'FR','/en/'],
 ['Germany/French',['fr-FR'],'DE','/de/'],['USA/Turkish',['tr'],'US','/'],
 ['Ordered preferences',['fr','az-Latn-AZ','de-CH'],'DE','/az/'],
 ['BCP47 extensions',['DE-ch-u-co-phonebk'],'TR','/de/'],['Invalid tag skipped',['de-!','en-AU'],'TR','/en/'],
 ['No country/browser supported',['de-AT'],null,'/de/'],['No country/no language',['fr'],null,'/'],
 ['Austria country',['fr'],'AT','/de/'],['GB country',['fr'],'GB','/en/'],
 ['US country',['fr'],'US','/en/'],['CA country',['fr'],'CA','/en/'],['AU country',['fr'],'AU','/en/'],
 ['AZ country',['fr'],'AZ','/az/'],['TR country',['fr'],'TR','/']
 ])await scenario(name,langs,country,target);
 await scenario('Saved German',['tr'],'TR','/de/',{saved:'de'});
 await scenario('Saved Turkish',['de'],'DE','/',{saved:'tr'});
 await scenario('Unsupported saved choice',['en'],'TR','/en/',{saved:'fr'});
 await scenario('Storage blocked',['de'],'DE','/de/',{blockStorage:true});
 await scenario('Country fails',['fr'],'DE','/',{fail:true});
 await scenario('Country times out',['fr'],'DE','/',{delay:1500});
 await scenario('Tracking query/hash',['en'],'TR','/en/',{query:'?utm_source=test&x=1#main'});
 for(const route of ['/en/','/de/','/az/','/ucretler/',manifest.locales.en.fixed[5],manifest.locales.de.articles[0].route,Object.keys(manifest.routes).find(r=>r.startsWith('/blog/'))])await scenario('Direct '+route,['en'],'US',route,{path:route,saved:'az'});
 // Actual desktop/mobile activation, preference persistence and mapped blog/pricing routes.
 for(const width of [1440,390])for(const source of ['/de/',manifest.locales.de.fixed[5],manifest.locales.de.articles.find(p=>p.sourceRoute).route]){
  const ctx=await context({viewport:{width,height:950}});await ctx.addInitScript(()=>Object.defineProperty(navigator,'languages',{get:()=>['de-DE']}));
  const p=await ctx.newPage();await p.goto(origin+source);const tr=new URL(await p.locator('#hd-lang a[lang=tr]').getAttribute('href'),origin).pathname;
  if(width===390)await p.locator('#hd-menu').click();else await p.locator('#hdr .lang-dd > button').click();
  await p.locator((width===390?'#drawer':'#hd-lang')+' a[lang=tr]').click();await p.waitForURL(u=>u.pathname===tr);
  assert.equal(await p.evaluate(key=>localStorage.getItem(key).split('.')[0],key),'tr');await p.goto(origin+'/');await p.waitForTimeout(1000);assert.equal(new URL(p.url()).pathname,'/');
  result.menus.push({width,source,target:tr});await ctx.close();
 }
 // Menu switching preserves campaign parameters; cookie works when localStorage is blocked.
 for(const blocked of [false,true]){
  const ctx=await context();if(blocked)await ctx.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}}));
  const p=await ctx.newPage();await p.goto(origin+'/de/?utm_campaign=language-test');await p.locator('#hdr .lang-dd > button').click();await p.locator('#hd-lang a[lang=en]').click();await p.waitForURL(u=>u.pathname==='/en/');assert.equal(new URL(p.url()).search,'?utm_campaign=language-test');
  await p.goto(origin+'/');await p.waitForURL(u=>u.pathname==='/en/');await ctx.close();
 }
 // A real German menu selection overrides a Turkish browser on future entry.
 {const ctx=await context({locale:'tr-TR'});const p=await ctx.newPage();await p.goto(origin+'/');await p.locator('#hdr .lang-dd > button').click();await p.locator('#hd-lang a[lang=de]').click();await p.waitForURL(u=>u.pathname==='/de/');await p.goto(origin+'/');await p.waitForURL(u=>u.pathname==='/de/');await ctx.close();}
 // An in-flight country result cannot undo an explicit Turkish menu choice.
 {const ctx=await context();await ctx.route('**/api/country',async route=>{await new Promise(r=>setTimeout(r,700));try{await route.fulfill({json:{country:'DE'}})}catch(_){}});
 const p=await ctx.newPage();await p.goto(origin+'/');await p.locator('#hdr .lang-dd > button').click();await p.locator('#hd-lang a[lang=tr]').click();await p.waitForTimeout(1100);assert.equal(new URL(p.url()).pathname,'/');assert.equal(await p.evaluate(key=>localStorage.getItem(key).split('.')[0],key),'tr');await ctx.close();}
 // A stale record in one backend cannot override a newer choice in the other.
 for(const mode of ['quota','readonly-cookie']){
 const ctx=await context();const p=await ctx.newPage();await p.goto(origin+'/de/');
 await p.evaluate(({mode,key})=>{localStorage.setItem(key,'de.1000');document.cookie=key+'=de.1000; Path=/';if(mode==='quota'){Storage.prototype.setItem=function(){throw new DOMException('Full','QuotaExceededError')}}else{const value=document.cookie;Object.defineProperty(document,'cookie',{get:()=>value,set:()=>{}})}},{mode,key});
 await p.locator('#hdr .lang-dd > button').click();await p.locator('#hd-lang a[lang=tr]').click();await p.waitForURL(u=>u.pathname==='/');await p.goto(origin+'/');await p.waitForTimeout(1000);assert.equal(new URL(p.url()).pathname,'/',mode);await ctx.close();}
 // With every persistence API blocked, explicitly selecting TR still reaches TR.
 {const ctx=await context();await ctx.addInitScript(()=>{Object.defineProperty(navigator,'languages',{get:()=>['de']});Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}});Object.defineProperty(document,'cookie',{get:()=>'',set:()=>{}})});
 const p=await ctx.newPage();await p.goto(origin+'/de/');await p.locator('#hdr .lang-dd > button').click();await p.locator('#hd-lang a[lang=tr]').click();await p.waitForURL(u=>u.pathname==='/');await p.waitForTimeout(1000);assert.equal(new URL(p.url()).pathname,'/');await ctx.close();}
 {const ctx=await context({javaScriptEnabled:false});const p=await ctx.newPage();const r=await p.goto(origin+'/');assert.equal(r.status(),200);assert.equal(await p.locator('html').getAttribute('lang'),'tr');assert.ok((await p.locator('main').textContent()).length>1000);assert.equal(await p.locator('link[rel=canonical]').getAttribute('href'),'https://www.hurralingo.com/');await ctx.close();}
 assert.deepEqual(result.errors,[]);assert.deepEqual(result.consoleErrors,[]);result.pass=true;console.log('PASS: '+result.scenarios.length+' scenarios, '+result.menus.length+' actual menu transitions, 182 SEO/content pages, fallback storage/cookies, JS disabled and endpoint privacy.');
 }finally{await browser.close()}
})().catch(e=>{result.failure=e.stack;console.error(e);process.exitCode=1}).finally(()=>{fs.mkdirSync(out,{recursive:true});fs.writeFileSync(out+'/'+(origin.startsWith('https:')?'preview-verification.json':origin.endsWith(':8018')?'runtime-browser-verification.json':'verification.json'),JSON.stringify(result,null,2)+'\n')});
