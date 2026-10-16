const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),vm=require('node:vm'),cp=require('node:child_process'),c=require('cheerio');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const manifest=JSON.parse(read('content/i18n/routes.json')),routes=JSON.parse(read('content/i18n/canonical-all.json'));
const baseline=JSON.parse(read('content/i18n/baseline.json')),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const config=require('./locale-content.cjs');
for(const [p,h]of Object.entries(baseline.files)){if(p.endsWith('.html'))continue;assert.equal(hash(fs.readFileSync(path.join(root,p))),h,'Protected asset '+p);}
for(const route of JSON.parse(read('content/site/canonical-tr.json'))){const p=route.slice(1)+'index.html',now=c.load(read(p)),before=c.load(cp.execFileSync('git',['show',baseline.ref+':'+p],{encoding:'utf8',maxBuffer:3e6}));assert.equal(now('main').html().replace(/\r\n/g,'\n'),before('main').html().replace(/\r\n/g,'\n'),'Turkish content changed '+route);}
assert.equal(new Set(routes).size,routes.length);let localLinks=0,assets=0;
const parsed=new Map(),load=file=>{if(!parsed.has(file))parsed.set(file,c.load(fs.readFileSync(file,'utf8')));return parsed.get(file)};
function target(url,route){if(!url||/^(?:[a-z]+:|\/\/)/i.test(url))return;const u=new URL(url,'https://local.test'+route);let p=path.join(root,decodeURIComponent(u.pathname));if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.html');assert.ok(fs.existsSync(p),`Missing ${url} on ${route}`);if(u.hash&&p.endsWith('.html')){const $=load(p);assert.ok($('[id]').toArray().some(n=>$(n).attr('id')===decodeURIComponent(u.hash.slice(1))),`Missing anchor ${url} on ${route}`);}return p;}
for(const route of routes){const $=load(path.join(root,route,'index.html')),lang=route.split('/')[1]||'tr',locale=manifest.locales[lang];assert.equal($('html').attr('lang'),locale?lang:'tr');assert.equal($('h1').length,1,route);assert.equal($('link[rel=canonical]').attr('href'),'https://www.hurralingo.com'+route);assert.equal($('meta[name=robots]').attr('content'),'noindex, nofollow');assert.equal($('#hdr .hd-cta').length,0);assert.equal($('#hdr .nav .nav-a').length,8);assert.equal($('#drawer .dr-list a').length,8);assert.equal($('#hd-prog .dd-grid a').length,4);assert.ok(!$('title').text().includes('Jargon'),route);
 if(locale){assert.deepEqual($('#hdr .nav .nav-a').map((i,e)=>$(e).text().trim()).get(),config.locales[lang].menu);for(const a of $('link[rel=alternate][hreflang]').toArray()){const href=$(a).attr('href');assert.equal(new URL(href).origin,'https://www.hurralingo.com');target(new URL(href).pathname,route);}}
 $('a[href],link[href],[src],[poster],[data-video]').each((i,e)=>{for(const attr of ['href','src','poster','data-video']){const url=$(e).attr(attr);if(!url)continue;if(target(url,route)){if(attr==='href')localLinks++;else assets++;}}});
 const ids=$('[id]').map((i,e)=>$(e).attr('id')).get();assert.equal(new Set(ids).size,ids.length,'Duplicate IDs '+route);
}
const posts=JSON.parse(read('content/blog/posts.json'));
for(const [lang,l]of Object.entries(manifest.locales)){assert.equal(l.fixed.length,9);assert.equal(l.articles.filter(p=>p.sourceRoute).length,34);for(const p of posts.filter(p=>p.language===lang))assert.ok(l.articles.some(x=>x.route===`/${lang}/blog/${p.slug}/`),'Legacy article missing '+p.slug);
 const teachers=c.load(read(l.fixed[3].slice(1)+'index.html'));assert.equal(teachers('#teachers .teacher').length,38);assert.equal(teachers('[data-filter]').length,8);
 if(lang!=='az')for(const p of posts.filter(p=>p.language===lang)){const file=`${lang}/blog/${p.slug}/index.html`,now=c.load(read(file)),old=c.load(cp.execFileSync('git',['show',baseline.ref+':'+file],{encoding:'utf8',maxBuffer:3e6}));assert.equal(now('.blog-prose').text(),old('.blog-prose').text(),'Legacy article text changed '+file);}
 for(const file of [`assets/i18n/site-${lang}.js`,`assets/i18n/pricing-${lang}.js`])new vm.Script(read(file));
}
new vm.Script(read('assets/i18n/pricing-ui.js'));
const xml=c.load(read('sitemap.xml'),{xmlMode:true});assert.deepEqual(xml('loc').map((i,e)=>xml(e).text()).get(),routes.map(r=>'https://www.hurralingo.com'+r));
for(const [from,to]of Object.entries(JSON.parse(read('content/i18n/redirects.json')))){assert.notEqual(from,to,'Self redirect '+from);target(to,'/');}
fs.mkdirSync(path.join(root,'docs/localization'),{recursive:true});const result={pass:true,canonicalPages:routes.length,localLinks,assets,translatedTRArticlesPerLanguage:34,localeArticles:Object.fromEntries(Object.entries(manifest.locales).map(([l,x])=>[l,x.articles.length])),turkishCopyUnchanged:true,pricingAssetsUnchanged:true,legacyEnglishGermanArticleTextUnchanged:true};fs.writeFileSync(path.join(root,'docs/localization/static-verification.json'),JSON.stringify(result,null,2)+'\n');console.log(result);
