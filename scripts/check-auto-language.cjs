const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {chromium}=require(process.env.HURRA_PLAYWRIGHT_PATH||path.resolve(__dirname,'../../hurralingo/node_modules/playwright-core'));
const c=require('cheerio'),routes=require('../content/i18n/canonical-all.json'),manifest=require('../content/i18n/routes.json');
const origin=process.env.HURRA_AUTO_ORIGIN||'http://127.0.0.1:8017',out='docs/auto-language';
const result={origin,pass:false,scenarios:[],menus:[],seoPages:0,errors:[],consoleErrors:[],expectedCountryErrors:[],countryRequests:0};
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const key='hl-language-choice';
(async()=>{
 const baseline=require('../docs/auto-language/baseline.json');
 // Git checkout on Windows can convert tracked text from LF to CRLF.
 function checkDigest(file,digest){const data=fs.readFileSync(file);if(hash(data)!==digest){assert.equal(hash(data.toString('utf8').replace(/\r\n/g,'\n')),digest,file);(result.lineEndingNormalizations||=[]).push(file)}}
 const sitemap=c.load(fs.readFileSync('sitemap.xml','utf8'),{xmlMode:true})('loc').map((i,n)=>c.load(n).text()).get();
 assert.deepEqual(sitemap,routes.map(route=>'https://www.hurralingo.com'+route));
 assert.deepEqual(routes.filter(route=>!route.startsWith('/fr/')),Object.keys(baseline.source));
 for(const [file,digest] of Object.entries(baseline.assets))checkDigest(file,digest);
 for(const route of routes.filter(route=>baseline.source[route])){const $=c.load(fs.readFileSync(path.join('.',route,'index.html'),'utf8')),before=baseline.source[route];
 assert.equal($('link[rel=canonical]').attr('href'),before.canonical,route);
 const actual=$('link[rel=alternate][hreflang]').map((i,e)=>$(e).attr('hreflang')+' '+$(e).attr('href')).get();
 for(const previous of before.alternates)assert.ok(actual.includes(previous),'Preserved alternate '+route+' '+previous);
 const siblings=manifest.translations[route];
 assert.deepEqual(actual,[...Object.entries(siblings).map(([lang,target])=>lang+' https://www.hurralingo.com'+target),...(siblings.tr?['x-default https://www.hurralingo.com'+siblings.tr]:[])],route);
 assert.equal($('meta[name=robots]').attr('content'),before.robots,route);
 assert.equal(hash($('main').html()),before.mainHash,route);
 assert.equal($('script[src="/assets/auto-language.js"]').length,1,route);result.seoPages++;
 }
 const endpoint=await import('data:text/javascript;base64,'+fs.readFileSync('functions/api/country.js').toString('base64'));
 for(const country of ['DE','AT','AZ','US','TR','GB','FR','CA','AU',null,undefined,'XX','T1','<script>']){
 const response=endpoint.onRequestGet({request:{cf:{country}}});assert.match(response.headers.get('cache-control'),/no-store/);
 assert.equal(response.headers.get('cdn-cache-control'),'no-store');assert.equal(response.headers.get('cloudflare-cdn-cache-control'),'no-store');
 assert.deepEqual(await response.json(),{country:['DE','AT','AZ','US','TR','GB','FR','CA','AU'].includes(country)?country:null});
 }
 assert.deepEqual(await endpoint.onRequestGet({request:{}}).json(),{country:null});
 // Only Cloudflare metadata may decide the country; headers/env must never be a fallback.
 const trustCases=[
  {cf:undefined,header:'TR',expected:null},
  {cf:null,header:'DE',expected:null},
  {cf:{},header:'TR',expected:null},
  {cf:{country:'XX'},header:'TR',expected:null},
  {cf:{country:'T1'},header:'TR',expected:null},
  {cf:{country:'de'},header:'DE',expected:null},
  {cf:{country:'DE'},header:'TR',expected:'DE'},
  {cf:{country:'TR'},header:'DE',expected:'TR'}
 ];
 for(const test of trustCases){
  const request={cf:test.cf,headers:new Headers({'CF-IPCountry':test.header})};
  assert.deepEqual(await endpoint.onRequestGet({request,env:{COUNTRY:'TR',CF_IPCOUNTRY:'TR'}}).json(),{country:test.expected});
 }
 // A shared isolate must not retain a preceding request's country.
 for(const country of ['TR','DE','FR','GB','AZ',undefined,'DE']){
  const response=endpoint.onRequestGet({request:{cf:{country}}});
  assert.deepEqual(await response.json(),{country:country||null});assert.equal(response.headers.get('cloudflare-cdn-cache-control'),'no-store');
 }
 result.countryTrustChecks={headerAndEnvironmentCases:trustCases.length,perRequestIsolationCases:7,pass:true};
 // Exercise the operator's live diagnosis command without network access or private trace output.
 const diagnosticSource=fs.readFileSync('scripts/diagnose-country.cjs','utf8');
 const diagnosticCases=[
  {name:'matching DE',trace:'DE',country:'DE',unique:'DE',comparison:'countries-match',exit:0},
  {name:'reported DE/TR mismatch',trace:'DE',country:'TR',unique:'TR',comparison:'country-mismatch',exit:1},
  {name:'query differs',trace:'DE',country:'DE',unique:'TR',comparison:'country-mismatch',exit:1},
  {name:'missing trace',trace:null,country:'DE',unique:'DE',comparison:'inconclusive',exit:1},
  {name:'unavailable metadata',trace:'DE',country:null,unique:null,comparison:'country-mismatch',exit:1},
  {name:'invalid endpoint payload',trace:'DE',country:'PRIVATE_TRACE_SENTINEL',unique:'DE',comparison:'inconclusive',exit:1},
  {name:'stale asset',trace:'DE',country:'DE',unique:'DE',stale:true,comparison:'countries-match',exit:1},
  {name:'network failure',networkFailure:true,comparison:'inconclusive',exit:1}
 ];
 for(const test of diagnosticCases){
  const logs=[],fixtureAsset='/* diagnosis fixture */\n',fixtureProcess={argv:['node','diagnose-country.cjs'],exitCode:0};
  await require('node:vm').runInNewContext(diagnosticSource,{
   __dirname:path.resolve('scripts'),process:fixtureProcess,AbortSignal,performance,console:{log:s=>logs.push(s),error:s=>logs.push(s)},
   require:name=>name==='node:fs'?{readFileSync:()=>fixtureAsset}:require(name),
   fetch:async url=>{
    if(test.networkFailure)throw Error('PRIVATE_TRACE_SENTINEL');
    const pathname=new URL(url).pathname;
    const body=pathname==='/cdn-cgi/trace'?'ip=PRIVATE_TRACE_SENTINEL\nloc='+(test.trace||'')+'\ncolo=FRA\n':pathname==='/assets/auto-language.js'?(test.stale?'old asset':fixtureAsset):JSON.stringify({country:url.includes('?')?test.unique:test.country});
    return new Response(body,{headers:{'Cache-Control':'private, no-store','CF-Cache-Status':'DYNAMIC'}});
   }
  });
  const output=JSON.parse(logs[0]);assert.equal(output.comparison,test.comparison,test.name);assert.equal(fixtureProcess.exitCode,test.exit,test.name);assert.ok(!logs.join('').includes('PRIVATE_TRACE_SENTINEL'),test.name+' private trace leakage');
 }
 result.diagnosisCommandChecks={cases:diagnosticCases.length,privateTraceOmitted:true,pass:true};
 if(process.env.HURRA_COUNTRY_RUNTIME_ORIGIN){
  const response=await fetch(process.env.HURRA_COUNTRY_RUNTIME_ORIGIN+'/api/country');
  assert.equal(response.status,200);const body=await response.json();
  assert.deepEqual(Object.keys(body),['country']);assert.ok(body.country===null||/^[A-Z]{2}$/.test(body.country));
  assert.match(response.headers.get('cache-control'),/private.*no-store/);
  // Cloudflare consumes its own CDN header; the generic CDN directive remains testable over HTTP.
  assert.equal(response.headers.get('cdn-cache-control'),'no-store');
  assert.match(response.headers.get('x-robots-tag'),/noindex/);
  result.localRuntime={origin:process.env.HURRA_COUNTRY_RUNTIME_ORIGIN,status:response.status,body,cache:response.headers.get('cache-control'),cdnCache:response.headers.get('cdn-cache-control')};
 }
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
  if(options.savedCookie)await ctx.addCookies([{name:key,value:options.savedCookie,url:origin}]);
  await ctx.addInitScript(({languages,options,key})=>{
   Object.defineProperty(navigator,'languages',{get:()=>languages});
   try{if(options.saved)localStorage.setItem(key,options.saved)}catch(_){}
   if(options.blockStorage)Object.defineProperty(window,'localStorage',{get(){throw new Error('Storage blocked')}});
   if(options.blockCookies)Object.defineProperty(document,'cookie',{get:()=>'',set:()=>{}});
   if(options.noFetch)window.fetch=undefined;
   if(options.noAbort)window.AbortController=undefined;
  },{languages,options,key});
  await ctx.route('**/api/country',async route=>{calls++;if(options.fail)return route.abort();if(options.delay)await new Promise(r=>setTimeout(r,options.delay));try{if(options.httpError)return await route.fulfill({status:503,body:'Unavailable'});if(options.invalidJson)return await route.fulfill({contentType:'application/json',body:'{'});await route.fulfill({json:{country}})}catch(_){}});
  const p=await ctx.newPage();let navigations=0;p.on('framenavigated',frame=>{if(frame===p.mainFrame())navigations++});const response=await p.goto(origin+(options.path||'/')+(options.query||''),{waitUntil:'domcontentloaded'});assert.equal(response.status(),200,name);
  await p.waitForURL(url=>url.pathname===expected);
  if(expected==='/')await p.waitForTimeout(options.delay?1200:1000);
  assert.equal(new URL(p.url()).pathname,expected,name);
  if(options.query)assert.equal(new URL(p.url()).search+new URL(p.url()).hash,options.query);
  if(!options.saved&&!options.blockStorage)assert.equal(await p.evaluate(key=>localStorage.getItem(key),key),null);
  const preferenceCookies=(await ctx.cookies()).filter(cookie=>cookie.name===key);
  assert.deepEqual(preferenceCookies.map(cookie=>cookie.value),options.savedCookie?[options.savedCookie]:[],name+' automatic selection must not change preference cookie');
  assert.equal(calls,/^(tr|en|de|az|fr)(\.|$)/.test(options.savedCookie||options.saved||'')||options.path||options.noFetch||options.noAbort?0:1,name+' country priority/request count');
  assert.ok(navigations<=2,name+' redirect loop');result.scenarios.push({name,expected,countryRequests:calls,navigations});result.countryRequests+=calls;await ctx.close();
 }
 for(const [name,langs,country,target]of [
 ['Germany/German',['de-DE'],'DE','/de/'],['Germany/Turkish',['tr-TR'],'DE','/de/'],
 ['Germany/English',['en-US'],'DE','/de/'],
 ['Azerbaijan/Azeri',['az-AZ'],'AZ','/az/'],['Azerbaijan/Turkish',['tr-TR'],'AZ','/az/'],['USA/English',['en-US'],'US','/en/'],
 ['France/French',['fr-FR'],'FR','/fr/'],['France/German',['de-DE'],'FR','/fr/'],['France/English',['en-GB'],'FR','/fr/'],['France/Turkish',['tr-TR'],'FR','/fr/'],
 ['Germany/French',['fr-FR'],'DE','/de/'],['USA/Turkish',['tr'],'US','/en/'],
 ['Ordered preferences',['fr','az-Latn-AZ','de-CH'],'IT','/fr/'],
 ['BCP47 extensions',['DE-ch-u-co-phonebk'],null,'/de/'],['Invalid tag skipped',['de-!','en-AU'],null,'/en/'],
 ['No country/browser supported',['de-AT'],null,'/de/'],['No country/English',['en-US'],null,'/en/'],['No country/no language',['es'],null,'/'],
 ['Empty browser list',[],null,'/fr/'],['Empty language tag',[''],null,'/'],
 ['Other country/German',['de-DE'],'IT','/de/'],['Other country/French',['fr-FR'],'IT','/fr/'],
 ['Austria country',['fr'],'AT','/de/'],['GB country',['fr'],'GB','/en/'],
 ['US country',['fr'],'US','/en/'],['CA country/German',['de'],'CA','/fr/'],['AU country/Turkish',['tr'],'AU','/en/'],
 ['AZ country',['en'],'AZ','/az/'],['TR country',['en'],'TR','/']
 ])await scenario(name,langs,country,target);
 // Independent policy fixture: exercise every supported French country/territory.
 const frenchCountries=require('../docs/french/ip-country-policy.json').countries;
 for(const {code}of frenchCountries){
  const response=endpoint.onRequestGet({request:{cf:{country:code}}});
  assert.deepEqual(await response.json(),{country:code});assert.match(response.headers.get('cache-control'),/no-store/);
  await scenario('French country '+code,['en-US'],code,'/fr/');
 }
 for(const country of ['CA','BE','CH'])await scenario('French country explicit English '+country,['fr-FR'],country,'/en/',{saved:'en'});
 await scenario('Canada direct English',['fr-FR'],'CA','/en/',{path:'/en/'});
 await scenario('Saved German',['tr'],'TR','/de/',{saved:'de'});
 await scenario('Saved Turkish',['de'],'DE','/',{saved:'tr'});
 await scenario('Saved English',['de'],'DE','/en/',{saved:'en'});
 await scenario('France explicit English',['fr'],'FR','/en/',{saved:'en'});
 await scenario('France explicit Turkish',['fr'],'FR','/',{saved:'tr'});
 await scenario('Saved French overrides Germany',['de'],'DE','/fr/',{saved:'fr'});
 await scenario('French cookie overrides Germany',['de'],'DE','/fr/',{savedCookie:'fr.1000'});
 await scenario('French Canadian browser/unknown country',['fr-CA'],'IT','/fr/');
 await scenario('French explicit URL',['tr'],'TR','/fr/',{path:'/fr/'});
 await scenario('France cookie-only English',['fr'],'FR','/en/',{savedCookie:'en.1000'});
 await scenario('France explicit German',['fr'],'FR','/de/',{saved:'de'});
 await scenario('France direct English',['fr'],'FR','/en/',{path:'/en/'});
 await scenario('Cookie-only Turkish',['en'],'DE','/',{savedCookie:'tr.1000'});
 await scenario('Cookie-only English',['tr'],'DE','/en/',{savedCookie:'en.1000'});
 await scenario('Unsupported saved choice',['en'],'TR','/',{saved:'es'});
 await scenario('Storage blocked',['de'],'DE','/de/',{blockStorage:true});
 await scenario('Country fails/German',['de'],'FR','/de/',{fail:true});
 await scenario('Country fails/French',['fr'],'DE','/fr/',{fail:true});
 await scenario('Country fails/English',['en'],'DE','/en/',{fail:true});
 await scenario('Country times out/German',['de'],'FR','/de/',{delay:1500});
 await scenario('Country times out/French',['fr'],'DE','/fr/',{delay:1500});
 await scenario('Country HTTP error',['de'],'FR','/de/',{httpError:true});
 await scenario('Country invalid JSON',['de'],'FR','/de/',{invalidJson:true});
 await scenario('Fetch unavailable',['de'],'FR','/de/',{noFetch:true});
 await scenario('AbortController unavailable',['fr'],'DE','/fr/',{noAbort:true});
 await scenario('Tracking query/hash',['en'],'DE','/de/',{query:'?utm_source=test&x=1#main'});
 for(const route of ['/en/','/de/','/az/','/ucretler/','/ogretmenlerimiz/',manifest.locales.en.fixed[5],manifest.locales.de.articles[0].route,Object.keys(manifest.routes).find(r=>r.startsWith('/blog/'))])await scenario('Direct '+route,['en'],'US',route,{path:route,saved:'az'});
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
 {const ctx=await context();let releaseCountry;const countryGate=new Promise(resolve=>{releaseCountry=resolve});await ctx.route('**/api/country',async route=>{await countryGate;try{await route.fulfill({json:{country:'DE'}})}catch(_){}});
 const p=await ctx.newPage();await p.goto(origin+'/',{waitUntil:'domcontentloaded'});
 // Hold the response until selection instead of racing a fixed delay against live TLS/layout.
 await p.locator('#hd-lang a[lang=tr]').evaluate(link=>link.click());releaseCountry();await p.waitForTimeout(1100);assert.equal(new URL(p.url()).pathname,'/');assert.equal(await p.evaluate(key=>localStorage.getItem(key).split('.')[0],key),'tr');await ctx.close();}
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
})().catch(e=>{result.failure=e.stack;console.error(e);process.exitCode=1}).finally(()=>{fs.mkdirSync(out,{recursive:true});fs.writeFileSync(out+'/fix-verification.json',JSON.stringify(result,null,2)+'\n')});
