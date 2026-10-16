const {read,write}=require('./site-tr.cjs');
const posts=JSON.parse(read('content/blog/posts.json')).filter(p=>p.language==='tr');
const fixed=['/','/egitimmodelimiz/','/derslerimiz/','/ogretmenlerimiz/','/blog/','/ucretler/','/referanslarimiz/','/kurumsal/','/iletisim/'];
const canonical=[...fixed,...posts.map(p=>'/blog/'+p.slug+'/')];
const map={
 '/tr/':'/', '/tr/egitimmodelimiz/':'/egitimmodelimiz/', '/tr/derslerimiz/':'/derslerimiz/', '/tr/ogretmenlerimiz/':'/ogretmenlerimiz/', '/tr/blog/':'/blog/', '/tr/ucretler/':'/ucretler/', '/tr/referanslarimiz/':'/referanslarimiz/', '/tr/kurumsal/':'/kurumsal/', '/tr/iletisim/':'/iletisim/',
 '/tr/takipvesertifikasyon/':'/egitimmodelimiz/#sertifikasyon', '/tr/sikcasorulansorular/':'/egitimmodelimiz/#sss', '/tr/icerik-ornekleri/':'/egitimmodelimiz/#icerik-ornekleri',
 '/tr/blog-grid/':'/blog/', '/tr/blog-grid-4-columns/':'/blog/', '/tr/blog-grid-2-columns-right-sidebar/':'/blog/', '/tr/blog-grid-2-columns-sdb/':'/blog/',
 '/tr/classes/':'/derslerimiz/', '/tr/classes/bireysel-derslerimiz/':'/derslerimiz/#bire-bir', '/tr/classes/mini-grup-derslerimiz/':'/derslerimiz/#mini-grup', '/tr/classes/grup-derslerimiz/':'/derslerimiz/#grup'
};
for(const p of posts)map[new URL(p.source).pathname]='/blog/'+p.slug+'/';
// WordPress also emitted percent-encoded emoji in one source URL. Keep literal,
// lower-case source encoding and browser-normalized upper-case encoding aliases.
for(const [from,to] of Object.entries({...map})){
  const decoded=decodeURI(from);map[decoded]=to;map[encodeURI(decoded)]=to;
}
// Explicit known variants only. No /tr/* catch-all and no foreign redirect.
for(const [from,to] of Object.entries({...map})){map[from.slice(0,-1)]=to;map[from+'index.html']=to;}
write('content/site/redirects-tr.json',JSON.stringify({status:301,hostPolicy:'Preview uses relative targets. Production activation requires separate approval.',rules:map},null,2)+'\n');
write('content/site/canonical-tr.json',JSON.stringify(canonical,null,2)+'\n');
write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+canonical.map(p=>`  <url><loc>https://www.hurralingo.com${p}</loc></url>`).join('\n')+'\n</urlset>\n');
// Production candidate is documentation only; deployment packager uses preview-only config.
write('docs/phase-1b/production-redirects.txt','# NOT ACTIVE. Requires explicit production approval. Turkish routes only.\n'+Object.entries(map).map(([a,b])=>`${a} https://www.hurralingo.com${b} 301`).join('\n')+'\n');
