// Measures the SEO report items on a built package. Run the local Cloudflare build first.
// Guards always fail the run; an item only fails the run once its id is in `locked`.
// Usage: node scripts/check-seo.cjs [packageDir] [--write-baseline]
const fs=require('node:fs'),path=require('node:path'),c=require('cheerio');
const root=path.resolve(__dirname,'..'),origin='https://www.hurralingo.com',languages=['en','de','az','fr'];
const args=process.argv.slice(2),writeBaseline=args.includes('--write-baseline');
const pkg=path.resolve(args.find(a=>!a.startsWith('--'))||path.join(root,'dist/cloudflare-pages'));
// Add an item id here once its stage is done so a later change cannot silently undo it.
const locked=['2.4','2.5','2.6','2.7','5.1','6.1','7.1','7.2','7.3','7.5','7.6','7.7','8.2','9.5','9.6'];
if(!fs.existsSync(path.join(pkg,'sitemap.xml')))throw Error('No package at '+pkg+'; run npm run site:build-cf');
const read=file=>fs.readFileSync(path.join(pkg,file),'utf8');
const sitemap=read('sitemap.xml'),routes=[...sitemap.matchAll(/<loc>https:\/\/www\.hurralingo\.com([^<]*)<\/loc>/g)].map(m=>m[1]);
const headers=read('_headers'),robots=read('robots.txt');
const redirects=read('_redirects').split('\n').filter(l=>l&&!l.startsWith('#')).map(l=>l.split(/\s+/)[0]);
const redirectSet=new Set(redirects.map(r=>r.replace(/\/$/,''))),redirectPrefixes=redirects.filter(r=>r.endsWith('*')).map(r=>r.slice(0,-1));
const isPost=r=>/^\/((en|de|az|fr)\/)?blog\/[^/]+\/$/.test(r);
const isHome=r=>r==='/'||languages.some(l=>r==='/'+l+'/');
const isPricing=r=>['/ucretler/','/en/fees/','/de/preise/','/az/qiymetler/','/fr/tarifs/'].includes(r);
const resolves=target=>{
 let p;try{p=decodeURIComponent(target)}catch{p=target}
 if(p.startsWith('/api/')||p.startsWith('/cdn-cgi/'))return true;
 const file=path.join(pkg,p);
 return fs.existsSync(file)&&(fs.statSync(file).isFile()||fs.existsSync(path.join(file,'index.html')))||fs.existsSync(file+'.html')||redirectSet.has(p.replace(/\/$/,''))||redirectPrefixes.some(r=>p.startsWith(r));
};
const m={indexHtml:0,oldSite:0,bodyTurkiye:0,wpAuthor:0,lazyHero:0,noCanonical:[],noIndexFollow:[],broken:new Map(),emptyAlt:0,emptyAltByKind:{},maxStyles:0,noDescription:[],multiH1:[],noOrgHomes:[],noSiteHomes:[],emptyPrices:0,noAnalytics:0};
const alternates=new Map();
for(const route of routes){
 const html=read(route.slice(1)+'index.html'),$=c.load(html);
 if($('link[rel=canonical]').attr('href')!==origin+route)m.noCanonical.push(route);
 if($('meta[name=robots]').attr('content')!=='index, follow')m.noIndexFollow.push(route);
 if(!($('meta[name=description]').attr('content')||'').trim())m.noDescription.push(route);
 if($('h1').length!==1)m.multiH1.push(route);
 alternates.set(route,new Map($('link[rel=alternate][hreflang]').map((i,e)=>[[e.attribs.hreflang,e.attribs.href]]).get()));
 m.maxStyles=Math.max(m.maxStyles,$('link[rel=stylesheet]').length);
 m.oldSite+=$('[src*="hurraegitim.com"],[srcset*="hurraegitim.com"],[href*="hurraegitim.com"]').length;
 m.bodyTurkiye+=$('main a[href*="hurraturkiye.com"]').length;
 if(/hurraturkiyewp/.test(html))m.wpAuthor++;
 if(!/googletagmanager\.com\/gtag/.test(html))m.noAnalytics++;
 for(const e of $('a[href],link[rel=stylesheet],img[src],script[src],source[src],video[poster]').get()){
  const value=e.attribs.href||e.attribs.src||e.attribs.poster;
  if(/^(mailto:|tel:|#|javascript:|data:)/.test(value))continue;
  let url;try{url=new URL(value,origin+route)}catch{continue}
  if(url.hostname==='www.hurralingo.com'||url.hostname==='hurralingo.com'){
   if(e.name==='a'&&/\/index\.html$/.test(url.pathname)&&!/^https?:/.test(value))m.indexHtml++;
   if(!resolves(url.pathname))m.broken.set(url.pathname,route);
  }
 }
 for(const e of $('img[srcset]').get())for(const part of e.attribs.srcset.split(',')){
  const target=part.trim().split(/\s+/)[0];
  if(!resolves(target))m.broken.set(target,route);
 }
 for(const e of $('img').get()){
  const hidden=e.attribs['aria-hidden']==='true'||e.attribs.role==='presentation'||$(e).closest('[aria-hidden=true]').length>0;
  const src=e.attribs.src||'';
  // Mascots are decorative, so an empty alt is correct for them.
  if(hidden||/maskot-/.test(src)||(e.attribs.alt||'').trim())continue;
  const kind=/\/img\/t-/.test(src)?'teacher':/\/img\/blog\//.test(src)?'blog':/\/img\/flags\//.test(src)?'flag':'other';
  m.emptyAlt++;m.emptyAltByKind[kind]=(m.emptyAltByKind[kind]||0)+1;
 }
 if(isPost(route)){
  if($('main img').first().attr('loading')==='lazy')m.lazyHero++;
 }
 if(isHome(route)){
  const types=$('script[type="application/ld+json"]').map((i,e)=>{try{const j=JSON.parse($(e).html());return [].concat(j['@graph']||j).map(x=>x['@type'])}catch{return []}}).get();
  if(!types.some(t=>['Organization','EducationalOrganization'].includes(t)))m.noOrgHomes.push(route);
  if(!types.includes('WebSite'))m.noSiteHomes.push(route);
 }
 if(isPricing(route))m.emptyPrices+=$('[data-start-price]').filter((i,e)=>/^[—-]?$/.test($(e).text().trim())).length;
}
const hreflangErrors=[];
for(const [route,alts] of alternates)for(const [lang,href] of alts){
 if(lang==='x-default')continue;
 const back=alternates.get(href.replace(origin,''));
 if(!back||![...back.values()].includes(origin+route))hreflangErrors.push(route+' -> '+href);
}
const logoSrc=(c.load(read('index.html'))('header img, #hdr img').first().attr('src')||'').split('?')[0];
// The video frame reserves its space with aspect-ratio; size attributes on the video would break that layout.
const homeDoc=c.load(read('index.html')),homeCss=homeDoc('link[rel=stylesheet]').map((i,e)=>read(e.attribs.href.split('?')[0].slice(1))).get().join('');
const heroFramed=homeDoc('.hm-frame #hero-video').length>0&&/\.hm-frame\{[^}]*aspect-ratio/.test(homeCss);
const missing404=['',...languages.map(l=>l+'/')].filter(l=>!fs.existsSync(path.join(pkg,l,'404.html'))||!c.load(read(l+'404.html'))('#hdr .nav').length).length;
const staticCached=['/assets/','/img/','/media/'].filter(p=>new RegExp('^'+p+'\\*\\n(?:[ \\t].*\\n)*?[ \\t]+Cache-Control:.*max-age=31536000','m').test(headers)).length;
const items=[
 ['2.4','index.html ile biten site içi bağlantı',m.indexHtml,0],
 ['2.5','hurraegitim.com bağlantısı',m.oldSite,0],
 ['2.6','Sitemap: lastmod olmayan adres',routes.length-(sitemap.match(/<lastmod>/g)||[]).length,0],
 ['2.7','Marka menüsü olmayan 404 sayfası',missing404,0],
 ['3.2','GA4 olmayan sayfa',m.noAnalytics,0],
 ['5.1','HTML içinde boş fiyat alanı',m.emptyPrices,0],
 ['6.1','Kurum/site kodu eksik ana sayfa',new Set([...m.noOrgHomes,...m.noSiteHomes]).size,0],
 ['7.1','Sayfa başına en fazla stil dosyası',m.maxStyles,3],
 ['7.2','Kapak görseli geç yüklenen yazı',m.lazyHero,0],
 ['7.3','Logo dosyası (KB)',Math.round(fs.statSync(path.join(pkg,logoSrc)).size/1024),30],
 ['7.5','Sabit oranlı çerçevesi olmayan hero video',heroFramed?0:1,0],
 ['7.6','1 yıl önbelleği olmayan statik klasör',3-staticCached,0],
 ['7.7','Alt metni boş görsel',m.emptyAlt,0],
 ['8.2','Eksik güvenlik başlığı',['Strict-Transport-Security','X-Frame-Options','Permissions-Policy'].filter(h=>!headers.includes(h)).length,0],
 ['9.5','Yazar olarak hurraturkiyewp görünen sayfa',m.wpAuthor,0],
 ['9.6','Metin içi hurraturkiye.com bağlantısı',m.bodyTurkiye,0]
].map(([id,label,value,target])=>({id,label,value,target,done:value<=target}));
const guards=[
 ['Sitemap adresleri dizine açık',!m.noIndexFollow.length,m.noIndexFollow],
 ['Canonical kendi adresini gösteriyor',!m.noCanonical.length,m.noCanonical],
 ['robots.txt tüm siteye açık, sitemap bildiriyor',/Allow: \//.test(robots)&&!/Disallow: \//.test(robots)&&robots.includes('Sitemap: '+origin+'/sitemap.xml'),[]],
 ['Genel noindex başlığı yok',!/^\/\*\n(?:[ \t].*\n)*?[ \t]+X-Robots-Tag/m.test(headers),[]],
 ['hreflang karşılıklı',!hreflangErrors.length,hreflangErrors],
 ['Site içi bağlantılar kırık değil',!m.broken.size,[...m.broken].map(([a,b])=>a+' <- '+b)],
 ['Her sayfada açıklama var',!m.noDescription.length,m.noDescription],
 ['Her sayfada tek H1 var',!m.multiH1.length,m.multiH1]
].map(([label,pass,detail])=>({label,pass,detail}));
for(const i of items)console.log(`${i.done?'OK  ':'TODO'} ${i.id.padEnd(5)}${i.label}: ${i.value} (hedef ${i.target})`);
console.log('Alt metni boş görsel türleri: '+JSON.stringify(m.emptyAltByKind));
for(const g of guards){console.log(`${g.pass?'PASS':'FAIL'} ${g.label}${g.pass?'':' ('+g.detail.length+'): '+g.detail.slice(0,5).join(', ')}`)}
const regressions=items.filter(i=>locked.includes(i.id)&&!i.done),failed=guards.filter(g=>!g.pass);
for(const i of regressions)console.log(`REGRESSION ${i.id}: ${i.label} = ${i.value}, hedef ${i.target}`);
if(writeBaseline){
 const out=path.join(root,'docs/seo/baseline.json');fs.mkdirSync(path.dirname(out),{recursive:true});
 const previous=fs.existsSync(out)?JSON.parse(fs.readFileSync(out,'utf8')):{};
 fs.writeFileSync(out,JSON.stringify({...previous,pages:routes.length,items,guards:guards.map(({label,pass,detail})=>({label,pass,count:detail.length,sample:detail.slice(0,8)})),emptyAltByKind:m.emptyAltByKind},null,2)+'\n');
}
console.log(`${routes.length} sayfa; ${items.filter(i=>i.done).length}/${items.length} madde hedefte; ${guards.length-failed.length}/${guards.length} koruma geçti.`);
if(failed.length||regressions.length)process.exitCode=1;
