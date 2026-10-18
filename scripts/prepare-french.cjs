// Read-only inventory of the existing four-language corpus; no network or Git mutations.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),c=require('cheerio');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const hash=data=>crypto.createHash('sha256').update(data).digest('hex');
const canonical=JSON.parse(read('content/i18n/canonical-all.json')).filter(r=>!r.startsWith('/fr/'));
const manifest=JSON.parse(read('content/i18n/routes.json')),posts=JSON.parse(read('content/blog/posts.json'));
const out=path.join(root,'docs/french');fs.mkdirSync(out,{recursive:true});
const baselineFile=path.join(out,'baseline.json');
if(!fs.existsSync(baselineFile)){
 const baseline={canonical,sourcePostHash:hash(fs.readFileSync(path.join(root,'content/blog/posts.json'))),pages:{},assets:{}};
 for(const route of canonical){const $=c.load(read(route.slice(1)+'index.html'));baseline.pages[route]={mainHash:hash($('main').html()),bodyText:$('main').text().replace(/\s+/g,' ').trim(),canonical:$('link[rel=canonical]').attr('href'),robots:$('meta[name=robots]').attr('content'),hreflang:$('link[rel=alternate][hreflang]').map((i,e)=>[$(e).attr('hreflang')+' '+$(e).attr('href')]).get()};}
 for(const dir of ['assets','img','media','wp-content'])for(const f of fs.readdirSync(path.join(root,dir),{recursive:true})){const name=dir+'/'+f.replaceAll('\\','/');if(fs.statSync(path.join(root,name)).isFile())baseline.assets[name]=hash(fs.readFileSync(path.join(root,name)));}
 fs.writeFileSync(baselineFile,JSON.stringify(baseline,null,2)+'\n');
}
const groups=[];
for(const [tr,siblings]of Object.entries(manifest.routes).filter(([r])=>!r.startsWith('/fr/'))){
 const routes={tr,...Object.fromEntries(Object.entries(siblings).filter(([l])=>l!=='fr'))};
 const article=tr.startsWith('/blog/')&&tr!=='/blog/';
 groups.push({id:tr,kind:article?'article':'fixed',sourceRoute:article?tr:routes.en,sourceLanguage:article?'tr':'en',siblings:routes});
}
const unmatched=new Map();
for(const [lang,locale]of Object.entries(manifest.locales).filter(([lang])=>lang!=='fr'))for(const article of locale.articles.filter(a=>!a.sourceRoute)){
 const post=posts.find(p=>p.language===lang&&article.route===`/${lang}/blog/${p.slug}/`);
 const identity=hash(JSON.stringify(post.body||post.paragraphs));
 if(unmatched.has(identity)){unmatched.get(identity).siblings[lang]=article.route;continue;}
 const group={id:article.route,kind:'article',sourceRoute:article.route,sourceLanguage:lang,siblings:{[lang]:article.route}};
 unmatched.set(identity,group);groups.push(group);
}
const result={existingCanonicalPages:canonical.length,byLanguage:{tr:canonical.filter(r=>!/^\/(en|de|az)\//.test(r)).length,...Object.fromEntries(Object.entries(manifest.locales).filter(([l])=>l!=='fr').map(([l,x])=>[l,x.canonical.length]))},groups,articles:groups.filter(g=>g.kind==='article').length,fixed:groups.filter(g=>g.kind==='fixed').length,teacherDetailPages:canonical.filter(r=>/teachers\/.+|ogretmenlerimiz\/.+|lehrkraefte\/.+|muellimler\/.+/.test(r)),legalSources:['wp-content/uploads/2026/03/Hurra-Lingo-Privacy-Policy-2026-02.pdf','wp-content/uploads/2026/03/Hurra-Lingo-Terms-and-Conditions-2026-02.pdf']};
fs.writeFileSync(path.join(out,'inventory.json'),JSON.stringify(result,null,2)+'\n');
console.log({existingCanonicalPages:result.existingCanonicalPages,byLanguage:result.byLanguage,frenchArticles:result.articles,frenchFixed:result.fixed,teacherDetailPages:result.teacherDetailPages.length,legalPdfs:result.legalSources.length});
