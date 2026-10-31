// Writes sitemap.xml. A page's lastmod only moves when its visible content changes,
// so site-wide header, footer or banner edits do not touch every date.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),c=require('cheerio');
const {root,read,write}=require('./site-tr.cjs');
const store='content/site/lastmod.json';
const seedDate='2026-10-27'; // Last content release before lastmod tracking started.
const today=new Date().toISOString().slice(0,10);
const previous=fs.existsSync(path.join(root,store))?JSON.parse(read(store)):null,next={};
for(const route of JSON.parse(read('content/i18n/canonical-all.json'))){
 const $=c.load(read(route.slice(1)+'index.html'));
 // Article meta holds the author, so only the title and prose count for posts.
 const prose=$('.blog-article .blog-prose'),text=(prose.length?$('.blog-article h1').text()+prose.text():$('main').text()).replace(/\s+/g,' ').trim();
 const hash=crypto.createHash('sha256').update(text).digest('hex').slice(0,16),known=previous?.[route];
 const first=previous?today:$('.blog-article > .blog-meta time').attr('datetime')||seedDate;
 next[route]={hash,date:known?(known.hash===hash?known.date:today):first};
}
write(store,JSON.stringify(next,null,2)+'\n');
write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+Object.entries(next).map(([route,{date}])=>`<url><loc>https://www.hurralingo.com${route}</loc><lastmod>${date}</lastmod></url>`).join('\n')+'\n</urlset>\n');
