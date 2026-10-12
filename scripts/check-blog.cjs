// Browser QA uses the already installed Playwright from the sibling project.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { chromium } = require(require.resolve('playwright', { paths: [path.resolve(__dirname,'../../hurralingo')] }));
const root=path.resolve(__dirname,'..');
const records=path.join(root,'content/blog/posts.json');
const original=fs.readFileSync(records,'utf8');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg'};
const routes=['blog/','en/blog/','de/blog/','az/blog/'];
const errors=[];
const server=http.createServer((req,res)=>{
  const url=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let file=path.resolve(root,'.'+url);
  if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  fs.readFile(file,(e,b)=>{res.writeHead(e?404:200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(e?'Not found':b);});
});
let browser;
const build=()=>execFileSync(process.execPath,[path.join(__dirname,'build-blog.cjs')],{cwd:root,stdio:'pipe'});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+server.address().port+'/';
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push(r.status()+' '+r.url());});
  for(const width of [320,390,768,1440])for(const route of routes){
    await page.setViewportSize({width,height:900});
    await page.goto(base+route);
    assert.equal(await page.locator('h1').count(),1);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Overflow '+route+' '+width);
    const links=await page.locator('#hd-lang a').evaluateAll(as=>as.map(a=>a.href));
    assert.equal(links.length,4);
    for(const link of links)assert.equal((await page.request.get(link)).status(),200);
    if(width===390){await page.locator('#hd-menu').click();assert.equal(await page.locator('#drawer').isVisible(),true);await page.keyboard.press('Escape');await page.locator('#drawer').waitFor({state:'hidden'});}
    const language=route==='blog/'?'tr':route.split('/')[0];
    assert.equal(await page.locator('[data-post-card]').count(),JSON.parse(original).filter(p=>p.language===language).length);
  }
  const originals=JSON.parse(original);
  const routeByLanguage={tr:'blog/',en:'en/blog/',de:'de/blog/',az:'az/blog/'};
  const localLinks=new Set();
  for(const post of originals){
    for(const width of [320,1440]){
      await page.setViewportSize({width,height:900});
      await page.goto(base+routeByLanguage[post.language]+post.slug+'/');
      assert.equal(await page.locator('h1').textContent(),post.title);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Article overflow '+post.slug+' '+width);
      assert.equal(await page.locator('.blog-prose').getAttribute('lang'),post.contentLanguage||post.language);
      await page.locator('.blog-prose').scrollIntoViewIfNeeded();
      const images=await page.locator('main img').evaluateAll(images=>images.map(i=>({src:i.src,alt:i.alt})));
      for(const img of images){const r=await page.request.get(img.src);assert.equal(r.status(),200,'Article image '+img.src);assert.ok(r.headers()['content-type'].startsWith('image/'));}
      const links=await page.locator('a[href]').evaluateAll(as=>as.map(a=>a.href));
      for(const link of links)if(link.startsWith(base))localLinks.add(link.split('#')[0]);
    }
  }
  for(const link of localLinks)assert.equal((await page.request.get(link)).status(),200,'Local link '+link);
  const preview=path.join(root,'docs/blog-preview');fs.mkdirSync(preview,{recursive:true});
  for(const width of [390,1440]){
    await page.setViewportSize({width,height:900});await page.goto(base+'blog/');
    await page.screenshot({path:path.join(preview,'blog-'+width+'.png')});
    if(originals.length){const post=originals.find(p=>p.language==='tr');await page.goto(base+'blog/'+post.slug+'/');await page.screenshot({path:path.join(preview,'article-'+width+'.png')});}
  }
  // Fixture content is temporary and is never retained in the real blog.
  const fixture=['tr','en','de','az'].flatMap(language=>[
    {language,slug:'qa-language-learning',title:'İletişim & language learning',summary:'Öğrenme ve pratik',date:'2025-04-15T06:00:00Z',categories:['Practice'],source:'https://example.com/article',paragraphs:['Full article paragraph. <script>unsafe()</script>']},
    {language,slug:'qa-study-habits',title:'Study habits',summary:'Daily routines',date:'2025-05-01T06:00:00Z',categories:['Routine'],source:'https://example.com/habits',paragraphs:['Second article.']}
  ]);
  fs.writeFileSync(records,JSON.stringify(fixture));build();
  for(const route of routes){
    await page.goto(base+route);
    assert.equal(await page.locator('[data-post-card]:visible').count(),2);
    await page.locator('[data-blog-search] input').fill('iletişim');
    assert.equal(await page.locator('[data-post-card]:visible').count(),1);
    await page.locator('[data-blog-search] select').selectOption('Routine');
    assert.equal(await page.locator('[data-post-card]:visible').count(),0);
    assert.equal(await page.locator('#blog-empty').isVisible(),true);
    await page.locator('[type=reset]').click();
    await page.waitForFunction(()=>document.querySelector('input[type=search]').value===''&&[...document.querySelectorAll('[data-post-card]')].every(c=>!c.hidden));
    await page.goto(base+route+'qa-language-learning/');
    assert.equal(await page.locator('.blog-prose p').count(),1);
    assert.equal(await page.locator('.blog-prose script').count(),0);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: four languages; 320/390/768/1440px archives; '+originals.length+' real articles at 320/1440px; article images and local links; language links; mobile menu; search/category/reset; article escaping; no local HTTP or JavaScript errors.');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{
  fs.writeFileSync(records,original);build();
  for(const route of routes)for(const slug of ['qa-language-learning','qa-study-habits']){
    const target=path.resolve(root,route,slug);
    if(!target.startsWith(root+path.sep)||!target.endsWith(slug))throw Error('Unsafe fixture cleanup');
    fs.rmSync(target,{recursive:true,force:true});
  }
  if(browser)await browser.close();server.close();
});
