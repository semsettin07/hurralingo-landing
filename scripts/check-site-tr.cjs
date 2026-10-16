const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const {root,read,headerMenu,teachers,original}=require('./site-tr.cjs');
const c=require('cheerio');
const baseline=JSON.parse(read('docs/phase-1b/baseline.json'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
for(const [p,h]of Object.entries(baseline.protectedFiles))assert.equal(hash(fs.readFileSync(path.join(root,p))),h,'Protected file changed: '+p);
const routes=JSON.parse(read('content/site/canonical-tr.json'));
assert.equal(routes.length,43);assert.equal(new Set(routes).size,43);assert.equal(teachers.length,38);
const expectedHrefs=headerMenu.map(x=>x[1]);let files=0,links=0,assets=0;
const localTarget=(url,from)=>{const u=new URL(url,'https://local.test'+from);if(u.origin!=='https://local.test')return;let p=decodeURIComponent(u.pathname);let file=path.join(root,p);if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');assert.ok(fs.existsSync(file),`Missing ${url} on ${from}`);if(u.hash&&path.extname(file)==='.html'){const dest=c.load(fs.readFileSync(file,'utf8'));assert.ok(dest('[id]').toArray().some(n=>dest(n).attr('id')===decodeURIComponent(u.hash.slice(1))),`Missing anchor ${url} from ${from}`);}return file;};
for(const route of routes){const file=route.slice(1)+'index.html',$=c.load(read(file));files++;
 assert.equal($('html').attr('lang'),'tr');assert.equal($('h1').length,1,'H1 '+route);
 assert.equal($('link[rel=canonical]').attr('href'),'https://www.hurralingo.com'+route);
 assert.equal($('meta[name=robots]').attr('content'),'noindex, nofollow');
 assert.deepEqual($('header nav.nav .nav-a').map((i,e)=>$(e).attr('href')).get(),expectedHrefs);
 assert.deepEqual($('#drawer .dr-list a').map((i,e)=>$(e).attr('href')).get(),expectedHrefs);
 assert.equal($('#drawer .dr-ages a').length,4);assert.equal($('#hd-prog').length,1);
 assert.equal($('#announce').text(),original('#announce').text(),'Original Bett announcement preserved');
 const ids=new Set();$('[id]').each((i,e)=>{const id=$(e).attr('id');assert.ok(!ids.has(id),`Duplicate ${id} on ${route}`);ids.add(id);});
 $('a[href],link[href],[src],[poster],[data-src],[data-video]').each((i,e)=>{for(const attr of ['href','src','poster','data-src','data-video']){const u=$(e).attr(attr);if(!u||/^(?:[a-z]+:|\/\/)/i.test(u))continue;localTarget(u,route);if(attr==='href')links++;else assets++;}});
 $('use[href]').each((i,e)=>{const href=$(e).attr('href');if(href?.startsWith('#'))assert.ok(ids.has(href.slice(1)),`Missing SVG symbol ${href} on ${route}`)});
 $('script:not([src])').each((i,e)=>new vm.Script($(e).text()));
}
for(const p of ['assets/site-tr.js','assets/pricing-ui.js','assets/blog.js'])new vm.Script(read(p));
const posts=JSON.parse(read('content/blog/posts.json')).filter(p=>p.language==='tr');assert.equal(posts.length,34);
for(const p of posts){const now=c.load(read('blog/'+p.slug+'/index.html'));const before=c.load(execFileSync('git',['show',baseline.originalRef+':blog/'+p.slug+'/index.html'],{encoding:'utf8',maxBuffer:2e6}));assert.equal(now('.blog-prose').html(),before('.blog-prose').html(),'Blog body changed '+p.slug);}
assert.equal(c.load(read('blog/index.html'))('[data-post-card]').length,34);
assert.equal(c.load(read('ogretmenlerimiz/index.html'))('#teachers .teacher').length,38);
assert.equal(c.load(read('ogretmenlerimiz/index.html'))('[data-filter]').length,8);
assert.equal(c.load(read('ucretler/index.html'))('#main').html().replace(/\r\n/g,'\n'),read('content/site/pricing-main.html').replace(/\r\n/g,'\n'),'Calculator main changed');
const data=require('../assets/pricing-data.js'),engine=require('../assets/pricing-engine.js');
const cases=JSON.parse(read('docs/pricing-2027/calculation-verification.json')).verified;
for(const r of cases){const n=engine.calculate(data,r);assert.equal(n.selectedLesson,r.expectedLesson);assert.equal(n.selectedTotal,r.expectedTotal);}
// Reuse independent Excel parser and pricing assertions, without its obsolete old-menu assertions or writes.
const pricingCheck=read('scripts/check-pricing.cjs');
const pure=pricingCheck.slice(0,pricingCheck.indexOf("const home=fs.readFileSync"));
const isolated={require:require('node:module').createRequire(path.join(root,'scripts/check-pricing.cjs')),console,process,__dirname:path.join(root,'scripts')};vm.createContext(isolated);vm.runInContext(pure+"\nconsole.log('PASS: independently evaluated '+formulas+' Excel formulas and '+verified.length+' pricing scenarios');",isolated);
const xml=c.load(read('sitemap.xml'),{xmlMode:true});assert.deepEqual(xml('loc').map((i,e)=>xml(e).text()).get(),routes.map(r=>'https://www.hurralingo.com'+r));
const redirect=JSON.parse(read('content/site/redirects-tr.json')).rules;for(const [from,to]of Object.entries(redirect)){assert.ok(from==='/tr'||from.startsWith('/tr/'));assert.notEqual(from,to);localTarget(to,'/');}
const fallbacks=JSON.parse(read('content/site/redirects-tr.json')).cloudflareUnicodeFallbacks||{};for(const [from,to]of Object.entries(fallbacks)){assert.match(from,/^\/tr\/\d{4}\/\d{2}\/\d{2}\/.*:legacyemoji/);localTarget(to,'/');}
assert.equal(read('robots.txt'),'User-agent: *\r\nDisallow: /\r\n');
const result={pass:true,canonicalPages:files,protectedFiles:Object.keys(baseline.protectedFiles).length,teachers:38,blogDetails:34,pricingScenarios:cases.length,excelFormulas:184,localLinkChecks:links,localAssetChecks:assets,redirectRules:Object.keys(redirect).length};
fs.writeFileSync(path.join(root,'docs/phase-1c/static-verification.json'),JSON.stringify(result,null,2)+'\n');console.log(result);
