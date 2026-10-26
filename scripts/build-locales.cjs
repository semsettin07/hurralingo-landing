// Offline, explicitly invoked EN/DE/AZ build. Never regenerates Turkish content.
const fs=require('node:fs'),path=require('node:path'),c=require('cheerio'),assert=require('node:assert/strict');
const {fixed,languages,locales,overrides,pricing,pageTitles,pageHeadings,extraOverrides}=require('./locale-content.cjs');
// Preserve the approved generators for the first four languages; FR is appended below.
const existingLocales=Object.fromEntries(Object.entries(locales).filter(([lang])=>lang!=='fr'));
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const write=(f,s)=>{fs.mkdirSync(path.dirname(path.join(root,f)),{recursive:true});fs.writeFileSync(path.join(root,f),s)};
const esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const posts=JSON.parse(read('content/blog/posts.json')),trPosts=posts.filter(p=>p.language==='tr');
const sourceRoutes=JSON.parse(read('content/site/canonical-tr.json'));
const dictionaries=Object.fromEntries(Object.keys(existingLocales).map(l=>[l,JSON.parse(read(`content/i18n/${l}.json`))]));
const missing=new Set();
function t(s,lang,sl='tr'){if(!s)return s;const value=sl==='tr'?(extraOverrides[lang][s]??overrides(lang)[s]):undefined;return (value??dictionaries[lang][sl]?.[s]??s).replace(/Hurra Jargon|HURRA JARGON|Hurray Linqo|Hurra Linqo|Hurrah Lingo/g,'Hurra Lingo');}
const fixedMap=Object.fromEntries(fixed.map((route,i)=>[route,Object.fromEntries(Object.entries(existingLocales).map(([l,v])=>[l,`/${l}/${v.slugs[i]?v.slugs[i]+'/':''}`]))]));
const existingMatches={
 en:{'karne-sonrasi-online-dil-kursu-cocuklar-icin-yabanci-dil-ogrenme-rehberi':'online-language-courses-after-report-cards-a-guide-to-foreign-language-learning-for-children','yogun-tempoda-yabanci-dil-ogrenme-icin-5-adim':'online-language-course-5-steps-to-learning-a-foreign-language-in-a-busy-schedule','sevgililer-gunune-ozel-love-languages-kampanyasi-cocuklar-ve-yetiskinler-icin-online-dil-egitimi':'valentines-day-special-love-languages-campaign-online-language-education-for-children-and-adults'},
 de:{'6-ayda-yeni-bir-dil-bir-seruvenin-anatomisi':'eine-neue-sprache-in-6-monaten-anatomie-eines-abenteuers'},
 az:{'sevgililer-gunune-ozel-love-languages-kampanyasi-cocuklar-ve-yetiskinler-icin-online-dil-egitimi':'valentines-day-special-love-languages-campaign-online-language-education-for-children-and-adults'}
};
function slug(s){return s.toLowerCase().replace(/ß/g,'ss').replace(/ə/g,'e').replace(/ı/g,'i').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,160).replace(/-$/,'');}
const routeMap={...fixedMap},articles={};
for(const [lang,l]of Object.entries(existingLocales)){
 const used=new Set(),list=[];
 for(const p of trPosts){const legacy=posts.find(x=>x.language===lang&&x.slug===existingMatches[lang][p.slug]);const title=legacy?(lang==='az'?t(legacy.title,lang,'en'):legacy.title):t(p.title,lang);const route=`/${lang}/blog/${legacy?.slug||slug(title)}/`;assert.ok(!used.has(route),'Duplicate '+route);used.add(route);routeMap['/blog/'+p.slug+'/']||={};routeMap['/blog/'+p.slug+'/'][lang]=route;list.push({route,title,summary:legacy?(lang==='az'?t(legacy.summary,lang,'en'):legacy.summary):t(p.summary,lang),source:legacy||p,legacy,sourceRoute:'/blog/'+p.slug+'/'});}
 for(const p of posts.filter(x=>x.language===lang&&!Object.values(existingMatches[lang]).includes(x.slug))){const route=`/${lang}/blog/${p.slug}/`;assert.ok(!used.has(route));used.add(route);list.push({route,title:lang==='az'?t(p.title,lang,'en'):p.title,summary:lang==='az'?t(p.summary,lang,'en'):p.summary,source:p,legacy:p});}
 articles[lang]=list.sort((a,b)=>b.source.date.localeCompare(a.source.date));
}
const manifest={routes:routeMap,locales:Object.fromEntries(Object.entries(existingLocales).map(([lang,l])=>[lang,{locale:l.locale,fixed:fixed.map(r=>routeMap[r][lang]),articles:articles[lang].map(p=>({route:p.route,sourceRoute:p.sourceRoute||null,title:p.title,legacySource:p.legacy?.source||null})),canonical:[...fixed.map(r=>routeMap[r][lang]),...articles[lang].map(p=>p.route)]}]))};
write('content/i18n/routes.json',JSON.stringify(manifest,null,2)+'\n');
function localUrl(href,lang,sourceRoute){if(!href)return href;let u;try{u=new URL(href,'https://www.hurralingo.com'+sourceRoute)}catch{return href}if(!['www.hurralingo.com','hurralingo.com'].includes(u.hostname))return href;const p=u.pathname.replace(/index\.html$/,'');if(routeMap[p]?.[lang])return routeMap[p][lang]+u.search+u.hash;if(p==='/'&&href.startsWith('#'))return href;return u.pathname+u.search+u.hash;}
function translate($,lang,sl='tr'){
 function visit(n){if(['script','style','svg'].includes(n.name)||n.attribs?.['data-content-ready'])return;if(n.type==='text'){const key=n.data.trim();if(key)n.data=n.data.replace(key,t(key,lang,sl));}for(const attr of ['alt','title','aria-label','placeholder','data-count-label'])if(n.attribs?.[attr])n.attribs[attr]=t(n.attribs[attr],lang,sl);if(n.name==='meta'&&['description','og:title','og:description'].includes(n.attribs?.name||n.attribs?.property))n.attribs.content=t(n.attribs.content,lang,sl);for(const ch of n.children||[])visit(ch)}visit($.root()[0]);
}
function hreflangs($,route,sourceRoute,lang){$('link[rel=alternate][hreflang]').remove();const siblings=sourceRoute?{tr:sourceRoute,...routeMap[sourceRoute]}:{[lang]:route};for(const [l,p]of Object.entries(siblings))$('head').append(`<link rel="alternate" hreflang="${l}" href="https://www.hurralingo.com${p}">`);if(siblings.tr)$('head').append(`<link rel="alternate" hreflang="x-default" href="https://www.hurralingo.com${siblings.tr}">`);return siblings;}
function page(html,lang,route,sourceRoute,options={}){
 const l=locales[lang],$=c.load(html);translate($,lang);
 $('html').attr('lang',lang);$('body').addClass('locale-'+lang).attr('data-locale',lang);
 $('[lang=tr]').not('a[hreflang]').attr('lang',lang);
 $('a[href]').each((i,e)=>{const a=$(e);a.attr('href',localUrl(a.attr('href'),lang,sourceRoute||'/'));if(a.attr('href')?.includes('/login?lng=tr'))a.attr('href',a.attr('href').replace('lng=tr','lng='+lang));});
 $('[src],[poster],[data-src],[data-video]').each((i,e)=>{for(const attr of ['src','poster','data-src','data-video']){const value=$(e).attr(attr);if(value&&!/^(?:[a-z]+:|\/\/|#)/i.test(value))$(e).attr(attr,new URL(value,'https://www.hurralingo.com'+(sourceRoute||'/')).pathname);}});
 $('link[rel=canonical]').attr('href','https://www.hurralingo.com'+route);$('meta[property="og:url"]').attr('content','https://www.hurralingo.com'+route);
 const siblings=hreflangs($,route,sourceRoute,lang);
 $('#hd-lang a[lang],.dr-langs a[lang]').each((i,e)=>{const a=$(e),target=a.attr('lang'),label={tr:'Türkçe',en:'English',de:'Deutsch',az:'Azərbaycanca',fr:'Français'}[target];a.attr('href',siblings[target]||(target==='tr'?'/':`/${target}/`)).removeAttr('aria-current');a.find('.dd-chk').remove();if(target===lang)a.attr('aria-current','page');if(a.find('.dd-code').length){a.find('.dd-code').text(target.toUpperCase());a.find('span').eq(1).text(label);}else a.text(label).attr('aria-label',label);});
 require('./mobile-languages.cjs')($);
 $('#hdr .lang-txt').text(lang.toUpperCase());$('#hdr .lang-dd > button').attr('aria-label',`${lang.toUpperCase()}, ${l.name}`);
 $('#announce .an-txt').first().html('<strong>Bett UK 2026</strong>'+({en:' — we won the “Best Language App” award',de:' – ausgezeichnet als „Beste Sprachlern-App“',az:' – “Ən yaxşı dil tətbiqi” mükafatını qazandıq'}[lang]));
 $('#announce .an-sm .an-txt').html('<strong>Bett UK 2026</strong> '+({en:'award winner',de:'ausgezeichnet',az:'mükafatlı'}[lang]));
 $('#announce .an-lg .stamp').contents().filter((i,n)=>n.type==='text').first().replaceWith({en:'New award!',de:'Ausgezeichnet!',az:'Yeni mükafat!'}[lang]);
 $('#announce .an-sm .stamp').text({en:'Award!',de:'Preis!',az:'Mükafat!'}[lang]);
 $('#announce .an-lg > span').last().text({en:'Your first trial lesson is free',de:'Die erste Probestunde ist kostenlos',az:'İlk tanışlıq dərsi ödənişsizdir'}[lang]);
 $('#hdr .nav .nav-a,#drawer .dr-list a').removeAttr('aria-current').each((i,e)=>{const a=$(e),href=a.attr('href');if(href===route||(href===fixedMap['/blog/'][lang]&&route.startsWith(href)))a.attr('aria-current','page');});
 const menu=['Eğitim','Dersler','Öğretmenler','Blog','Ücretler','Referanslar','Kurumsal','İletişim'];
 $('#hdr .nav .nav-a').each((i,e)=>{$(e).contents().filter((i,n)=>n.type==='text').first().replaceWith(l.menu[i]);});
 $('#drawer .dr-list a span').each((i,e)=>$(e).text(l.menu[i]));
 $('script[src="/assets/site-tr.js"]').attr('src',`/assets/i18n/site-${lang}.js`);
 $('script[src="/assets/pricing-tr.js"]').attr('src',`/assets/i18n/pricing-${lang}.js`);
 $('script[src="/assets/pricing-ui.js"]').attr('src','/assets/i18n/pricing-ui.js');
 $('head').append('<link rel="stylesheet" href="/assets/site-locales.css">');
 const fixedIndex=fixed.indexOf(sourceRoute);
 if(fixedIndex>=0&&!options.title){$('title').text(pageTitles[lang][fixedIndex]+' | Hurra Lingo');$('meta[property="og:title"]').attr('content',pageTitles[lang][fixedIndex]);if(pageHeadings[lang][fixedIndex])$('h1').html(pageHeadings[lang][fixedIndex]);}
 if(sourceRoute==='/'){
  const text={en:['The Most Enjoyable Way to Learn a New ','Language!'],de:['Mit Freude eine neue ','Sprache lernen!'],az:['Yeni dil öyrənməyin ən əyləncəli ','yolu!']}[lang];
  $('#h1').contents().filter((i,n)=>n.type==='text').first().replaceWith(text[0]);$('#h1 .hero-smile').contents().filter((i,n)=>n.type==='text').first().replaceWith(text[1]);
  const latest=articles[lang].slice(0,3);$('.home-blog .site-card').each((i,e)=>{const p=latest[i];if(!p)return;const a=$(e);a.find('h3').text(p.title);a.find('time').attr('datetime',p.source.date.slice(0,10)).text(new Intl.DateTimeFormat(l.locale,{dateStyle:'long',timeZone:'UTC'}).format(new Date(p.source.date)));a.find('a').attr('href',p.route);a.find('img').attr('src',p.source.image?'/'+p.source.image:'/img/maskot-merakli.svg').attr('alt',p.title);});
 }
 if(sourceRoute==='/egitimmodelimiz/')$('#sorular .sec-head').after(`<p class="locale-media-note">${esc(l.videoNote)}</p>`);
 $('.campaign-banner').each((i,e)=>{const title={en:'Language learning for police personnel and their families',de:'Sprachunterricht für Polizeiangehörige und ihre Familien',az:'Polis əməkdaşları və ailələri üçün dil təhsili'}[lang],benefits={en:'10% off online lessons · Free access to the AI-supported app until the end of the year',de:'10 % Rabatt auf Online-Unterricht · Kostenloser Zugang zur KI-gestützten App bis zum Jahresende',az:'Onlayn dərslərdə 10% endirim · İlin sonunadək süni intellekt dəstəkli tətbiqə ödənişsiz giriş'}[lang];$(e).addClass('locale-campaign').html(`<div><h2>${esc(title)}</h2><p>${esc(benefits)}</p><p class="locale-media-note">${esc(l.campaignNote)}</p><a class="btn btn-line" href="/docs/hurra-lingo-emniyet-mensuplari-kampanya.pdf" hreflang="tr" target="_blank" rel="noopener noreferrer">${lang==='de'?'Originalbroschüre (PDF, Türkisch)':lang==='az'?'Orijinal broşür (PDF, türkcə)':'Original brochure (PDF, Turkish)'}</a></div><img src="/img/maskot-mutlu.svg" width="150" height="155" alt="">`);});
 if(options.title){$('title').text(options.title+' | Hurra Lingo');$('meta[property="og:title"]').attr('content',options.title);$('h1').text(options.title);}
 if(options.description)$('meta[name=description],meta[property="og:description"]').attr('content',options.description);
 return $.html();
}
function render(nodes,lang){return nodes.map(n=>{if(typeof n.text==='string')return esc(n.text);if(['br','hr'].includes(n.tag))return `<${n.tag}>`;if(n.tag==='img')return `<img src="/${n.src}" alt="${esc(n.alt||'')}" loading="lazy">`;let attr='';if(n.tag==='a'&&n.href){let href=n.href;try{const url=new URL(href);const match=posts.find(p=>new URL(p.source).pathname===url.pathname&&p.language===lang);if(match)href=`/${lang}/blog/${match.slug}/`;}catch{}attr=` href="${esc(href)}"${/^https?:/.test(href)?' target="_blank" rel="noopener noreferrer"':''}`;}return `<${n.tag}${attr}>${render(n.children||[],lang)}</${n.tag}>`}).join('');}
function cover(p,lang){return `<img class="blog-cover" src="/${p.source.image||'img/maskot-merakli.svg'}" alt="${esc(p.title)}" width="640" height="400" loading="lazy">`;}
for(const [lang,l]of Object.entries(existingLocales)){
 for(const sourceRoute of fixed.filter(r=>r!=='/blog/')){const route=routeMap[sourceRoute][lang];write(route.slice(1)+'index.html',page(read(sourceRoute.slice(1)+'index.html'),lang,route,sourceRoute));}
 // Backwards-compatible file aliases remain usable; deployment redirects are explicit.
 write(lang+'.html',read(lang+'/index.html'));
 const cards=articles[lang].map(p=>`<article class="blog-card" data-post-card data-search="${esc(p.title+' '+p.summary+' '+(p.source.categories||[]).map(s=>t(s,lang)).join(' '))}" data-category="${esc(JSON.stringify((p.source.categories||[]).map(s=>t(s,lang))))}">${cover(p,lang)}<div class="blog-card-body"><time datetime="${p.source.date.slice(0,10)}">${new Intl.DateTimeFormat(l.locale,{dateStyle:'long',timeZone:'UTC'}).format(new Date(p.source.date))}</time><h2><a href="${p.route}">${esc(p.title)}</a></h2><p>${esc(p.summary)}</p><a class="link" href="${p.route}">${l.read} →</a></div></article>`).join('');
 const cats=[...new Set(articles[lang].flatMap(p=>(p.source.categories||[]).map(s=>t(s,lang))))];
 const archive=c.load(page(read('blog/index.html'),lang,routeMap['/blog/'][lang],'/blog/'));
 archive('.blog-archive').html(`<form class="blog-search" data-blog-search><label>${l.search}<input type="search" name="q" placeholder="${l.placeholder}" autocomplete="off"></label><label>${l.category}<select name="category"><option value="">${l.allCategories}</option>${cats.map(s=>`<option>${esc(s)}</option>`).join('')}</select></label><button class="btn btn-line" type="reset">${l.clear}</button></form><p id="blog-result" class="blog-result" role="status" aria-live="polite" data-count-label="${l.articleCount}">${articles[lang].length} ${l.articleCount}</p><div class="blog-grid">${cards}</div><p class="blog-empty" id="blog-empty" hidden>${l.noResults}</p>`);
 write(lang+'/blog/index.html',archive.html());
 for(const p of articles[lang]){
  const template=p.sourceRoute?read(p.sourceRoute.slice(1)+'index.html'):read('/blog/'+trPosts[0].slug+'/index.html');
  const $=c.load(page(template,lang,p.route,p.sourceRoute,{title:p.title,description:p.summary}));
  if(p.legacy){let body=p.legacy.body?render(p.legacy.body,lang):p.legacy.paragraphs.map(s=>`<p>${esc(s)}</p>`).join('');if(lang==='az'){const prose=c.load(body,null,false);translate(prose,lang,'en');body=prose.html();}$('.blog-prose').html(body).attr('lang',lang);}
  $('.blog-article > .blog-meta').html(`<time datetime="${p.source.date.slice(0,10)}">${new Intl.DateTimeFormat(l.locale,{dateStyle:'long',timeZone:'UTC'}).format(new Date(p.source.date))}</time>${p.source.author?'<span>'+esc(p.source.author)+'</span>':''}`);
  $('.blog-article > .link').attr('href',routeMap['/blog/'][lang]).text('← '+l.back);
  $('.blog-article > .blog-cover').replaceWith(cover(p,lang));
  if(p.legacy&&!p.sourceRoute)$('.editorial-note').remove();
  if(/campaign|kampanya|kampagne|indirim|discount|rabatt/i.test(p.source.title+' '+p.source.paragraphs.join(' '))){$('.editorial-note').remove();$('.blog-article h1').after(`<p class="editorial-note">${esc(l.historic)} <a href="${routeMap['/ucretler/'][lang]}">${l.menu[4]} →</a></p>`);}
  write(p.route.slice(1)+'index.html',$.html());
 }
 const terms={...pricing[lang],locale:l.locale,currency:'TRY',week:l.week};write(`assets/i18n/pricing-${lang}.js`,'window.HurraPricingText = '+JSON.stringify(terms,null,2)+';\n');
 let runtime=read('assets/site-tr.js');
 for(const s of ['Ücretsiz Tanışma Dersi','Menüyü kapat','Menüyü aç','Videoyu oynat','Videoyu duraklat','Kopyalandı','Seçildi','Numara panoya kopyalandı.','Numara seçildi; kopyalamak için Ctrl+C ya da Cmd+C kullanın.','Kopyala','Kaydet'])runtime=runtime.replaceAll(s,t(s,lang).replace(/'/g,"\\'"));
 runtime=runtime.replace("'<p class=\"t-lang\"><i aria-hidden=\"true\"></i>'+t[1]+'</p>'","'<p class=\"t-lang\"><i aria-hidden=\"true\"></i>'+window.HurraLocaleLanguages[t[1]]+'</p>'");
 runtime=runtime.replace(/return '<b>'\+n\+'<\/b> ' \+ \(f === 'all' \? 'öğretmen' : f \+ ' öğretmeni'\) \+ ' gösteriliyor';/,`return '<b>'+n+'</b> '+${JSON.stringify(l.teacherCount)}+(f==='all'?'':' · '+window.HurraLocaleLanguages[f]);`);
 runtime=runtime.replaceAll('https://www.hurralingo.app/login?lng=tr','https://www.hurralingo.app/login?lng='+lang);
 write(`assets/i18n/site-${lang}.js`,'window.HurraLocaleLanguages = '+JSON.stringify(Object.fromEntries(languages.map((s,i)=>[s,l.languageNames[i]])))+';\n'+runtime);
}
write('assets/i18n/pricing-ui.js',read('assets/pricing-ui.js').replace(' / hafta ·',' / ${t.week} ·'));
// Add reciprocal language navigation/metadata to TR without rewriting its content.
for(const sourceRoute of sourceRoutes){const file=sourceRoute.slice(1)+'index.html',$=c.load(read(file));hreflangs($,sourceRoute,sourceRoute,'tr');$('#hd-lang a[lang],.dr-langs a[lang]').each((i,e)=>{const a=$(e),lang=a.attr('lang');a.attr('href',lang==='tr'?sourceRoute:routeMap[sourceRoute][lang]);});write(file,$.html());}
const allRoutes=[...sourceRoutes,...Object.values(manifest.locales).flatMap(l=>l.canonical)];
write('content/i18n/canonical-all.json',JSON.stringify(allRoutes,null,2)+'\n');
write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+allRoutes.map(r=>`<url><loc>https://www.hurralingo.com${r}</loc></url>`).join('\n')+'\n</urlset>\n');
const redirects={};for(const lang of Object.keys(existingLocales)){redirects[`/${lang}.html`]=`/${lang}/`;for(const r of fixed.slice(1))if(r!=='/blog/')redirects[`/${lang}${r}`]=routeMap[r][lang];for(const p of posts.filter(x=>x.language===lang)){const target=`/${lang}/blog/${p.slug}/`;const from=new URL(p.source).pathname;if(from!==target){redirects[from]=target;if(from.endsWith('/'))redirects[from+'index.html']=target;}}}
write('content/i18n/redirects.json',JSON.stringify(redirects,null,2)+'\n');
// Remove only stale, generated article files within the three explicit locale roots.
for(const lang of Object.keys(existingLocales)){const base=path.resolve(root,lang,'blog'),keep=new Set(manifest.locales[lang].articles.map(p=>path.resolve(root,p.route.slice(1),'index.html')));for(const f of fs.readdirSync(base,{recursive:true})){const file=path.resolve(base,f);if(path.basename(file)!=='index.html'||file===path.join(base,'index.html')||!fs.statSync(file).isFile()||keep.has(file))continue;assert.ok(file.startsWith(base+path.sep));const legacy=posts.some(p=>p.language===lang&&file===path.join(base,p.slug,'index.html'));assert.ok(!legacy,'Refusing to delete legacy article');fs.unlinkSync(file);}}
require('./build-french.cjs');
require('./install-auto-language.cjs');
console.log('Built EN/DE/AZ and French extension. Existing TR copy and pricing engine/data preserved; reciprocal language metadata updated.');

require('./build-privacy.cjs');
