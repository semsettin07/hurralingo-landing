// Build static blog pages from verified, language-specific source records.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, s) => { fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true }); fs.writeFileSync(path.join(root, p), s); };
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const locales = {
  tr: { home:'index.html', route:'blog/', name:'Blog', homeLabel:'Ana sayfa', title:'Dil öğrenirken yeni dünyalar keşfedin.', intro:'Dil öğrenimi, çocuklar ve günlük hayatta dil pratiği üzerine yazılar.', search:'Yazılarda ara', placeholder:'Bir konu veya kelime yazın', category:'Kategori', all:'Tüm kategoriler', reset:'Temizle', count:'yazı gösteriliyor', empty:'Aramanıza uygun yazı bulunamadı.', pending:'Blog yazılarımız hazırlanıyor.', read:'Yazıyı oku', back:'Tüm yazılara dön', skip:'İçeriğe geç', source:'Kaynak', locale:'tr-TR' },
  en: { home:'en.html', route:'en/blog/', name:'Blog', homeLabel:'Home', title:'Discover new worlds as you learn.', intro:'Stories about language learning, children and everyday language practice.', search:'Search articles', placeholder:'Enter a topic or keyword', category:'Category', all:'All categories', reset:'Clear', count:'articles shown', empty:'No articles match your search.', pending:'Our blog articles are coming soon.', read:'Read article', back:'Back to all articles', skip:'Skip to content', source:'Source', locale:'en-GB' },
  de: { home:'de.html', route:'de/blog/', name:'Blog', homeLabel:'Startseite', title:'Entdecken Sie neue Welten beim Sprachenlernen.', intro:'Beiträge über Sprachenlernen, Kinder und Sprachpraxis im Alltag.', search:'Beiträge durchsuchen', placeholder:'Thema oder Suchbegriff eingeben', category:'Kategorie', all:'Alle Kategorien', reset:'Zurücksetzen', count:'Beiträge angezeigt', empty:'Keine Beiträge für Ihre Suche gefunden.', pending:'Unsere Blogbeiträge sind in Vorbereitung.', read:'Beitrag lesen', back:'Zurück zu allen Beiträgen', skip:'Zum Inhalt springen', source:'Quelle', locale:'de-DE' },
  az: { home:'az.html', route:'az/blog/', name:'Bloq', homeLabel:'Ana səhifə', title:'Dil öyrənərkən yeni dünyalar kəşf edin.', intro:'Dil öyrənmə, uşaqlar və gündəlik dil praktikası haqqında yazılar.', search:'Yazılarda axtar', placeholder:'Mövzu və ya açar söz yazın', category:'Kateqoriya', all:'Bütün kateqoriyalar', reset:'Təmizlə', count:'yazı göstərilir', empty:'Axtarışınıza uyğun yazı tapılmadı.', pending:'Bloq yazılarımız hazırlanır.', read:'Yazını oxu', back:'Bütün yazılara qayıt', skip:'Məzmuna keç', source:'Mənbə', locale:'az-Latn-AZ' }
};
const posts = JSON.parse(read('content/blog/posts.json'));
if (!Array.isArray(posts)) throw Error('Blog records must be an array');
const keys = new Set();
for (const p of posts) {
  if (!locales[p.language] || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) || !p.title || !p.source || !Array.isArray(p.paragraphs) || !p.paragraphs.length || !/^https:\/\//.test(p.source) || !/^\d{4}-\d{2}-\d{2}/.test(p.date) || !Number.isFinite(Date.parse(p.date))) throw Error('Invalid blog record: '+p.slug);
  if (p.image && (!/^img\/blog\/[a-zA-Z0-9._-]+$/.test(p.image) || !fs.existsSync(path.join(root, p.image)))) throw Error('Missing local blog image: '+p.image);
  const key=p.language+'/'+p.slug; if(keys.has(key)) throw Error('Duplicate blog route: '+key); keys.add(key);
}
const relative = (route, target) => path.posix.relative(route, target) || './';
const arrow='<svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg>';
const pageUrl = route => 'https://hurralingo-landing.pages.dev/'+route;
const safeTags=new Set(['p','h2','h3','h4','h5','h6','strong','b','em','i','ul','ol','li','blockquote','br','hr','figure','figcaption','table','thead','tbody','tr','th','td','a','img']);
const sourcePaths=new Map(posts.map(p=>[new URL(p.source).pathname,locales[p.language].route+p.slug+'/index.html']));
function renderNodes(nodes,route) {
  return nodes.map(n=>{
    if(typeof n.text==='string')return esc(n.text);
    if(!safeTags.has(n.tag))throw Error('Unsupported content tag: '+n.tag);
    const children=renderNodes(n.children||[],route);
    if(n.tag==='img'){
      if(!/^img\/blog\/[a-zA-Z0-9._-]+$/.test(n.src)||!fs.existsSync(path.join(root,n.src)))throw Error('Missing content image');
      return `<img src="${relative(route,n.src)}" alt="${esc(n.alt||'')}" loading="lazy">`;
    }
    if(['br','hr'].includes(n.tag))return `<${n.tag}>`;
    if(n.tag==='a'){
      if(!n.href)return children;
      const url=new URL(n.href);if(!['https:','http:','mailto:','tel:'].includes(url.protocol))return children;
      const local=url.hostname==='hurraegitim.com'?sourcePaths.get(url.pathname):null;
      const href=local?relative(route,local):n.href;
      return `<a href="${esc(href)}"${local?'':' target="_blank" rel="noopener noreferrer"'}>${children}</a>`;
    }
    return `<${n.tag}>${children}</${n.tag}>`;
  }).join('');
}
function shell(lang, route, title, description, content, alternateRoutes) {
  if(lang==='tr')return require('./site-tr.cjs').shell('/'+route,title,description,content,{bodyClass:'blog-page',mainClass:'blog-main',styles:['assets/blog.css'],scripts:['assets/blog.js'],article:route!=='blog/'});
  const l=locales[lang], home=read(l.home);
  const styles=[...home.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m=>m[1]).join('\n');
  // Retain the existing language-specific header, drawer and its keyboard behavior.
  let header=home.slice(home.indexOf('<div class="announce"'),home.indexOf('<!-- SECTION 02-hero:'));
  let footer=home.match(/<footer class="footer">[\s\S]*?<\/footer>/)[0];
  const rewrite=s=>s.replace(/(src|poster|href)="(img\/[^"#]+|media\/[^"#]+)"/g,(_,a,b)=>`${a}="${relative(route,b)}"`)
    .replace(/href="#(top|programlar|ogretmenler|fiyatlar|sorular|kurumlar|sss)"/g,(_,id)=>lang==='tr'&&id==='fiyatlar'?'href="/ucretler/"':`href="${relative(route,l.home)}${id==='top'?'':'#'+id}"`)
    .replace(/href="\/(?:en\.html|de\.html|az\.html)?"(?= lang=)/g, m=>{ const code=m.includes('en.html')?'en':m.includes('de.html')?'de':m.includes('az.html')?'az':'tr';return `href="${relative(route,(alternateRoutes[code]||locales[code].route)+'index.html')}"`; })
    .replace(/href="(?:blog\/|en\/blog\/|de\/blog\/|az\/blog\/)"/g,`href="${relative(route,l.route+'index.html')}"`)
    .replace(/ data-spy/g,'');
  header=rewrite(header).replace('class="nav-a nav-blog"','class="nav-a nav-blog" aria-current="page"');
  footer=rewrite(footer);
  const icons=[...home.matchAll(/<svg width="0"[\s\S]*?<\/svg>/g)].map(m=>m[0]).join('');
  const hreflang=Object.entries(alternateRoutes).map(([code,r])=>`<link rel="alternate" hreflang="${code}" href="${pageUrl(r)}">`).join('');
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>${esc(title)} | Hurra Lingo</title><meta name="description" content="${esc(description)}"><meta name="robots" content="noindex, nofollow"><link rel="canonical" href="${pageUrl(route)}">${hreflang}<meta property="og:title" content="${esc(title)} | Hurra Lingo"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="website"><meta property="og:url" content="${pageUrl(route)}"><meta property="og:image" content="https://hurralingo-landing.pages.dev/img/hurralingo-og.jpg"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="${relative(route,'img/favicon.png')}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Figtree:wght@400;500;600;700&family=Poetsen+One&display=swap"><style>${styles}</style><link rel="stylesheet" href="${relative(route,'desktop-density.css')}"><link rel="stylesheet" href="${relative(route,'localization.css')}"><link rel="stylesheet" href="${relative(route,'assets/blog.css')}"></head><body class="blog-page">${icons}<a class="blog-skip" href="#main">${l.skip}</a>${header}<main id="main" class="blog-main">${content}</main>${footer}<script src="${relative(route,'assets/blog.js')}" defer></script></body></html>`;
}
for(const [lang,l] of Object.entries(locales)) {
  // Phase 1B is strictly TR-only. Never regenerate EN/DE/AZ, including via npm blog:build.
  if(lang!=='tr')continue;
  const route=l.route, articles=posts.filter(p=>p.language===lang).sort((a,b)=>b.date.localeCompare(a.date));
  const cats=[...new Set(articles.flatMap(p=>p.categories||[]))].sort((a,b)=>a.localeCompare(b,l.locale));
  const date=p=>new Intl.DateTimeFormat(l.locale,{dateStyle:'long',timeZone:'UTC'}).format(new Date(p.date));
  const cover=(p,r)=>p.image?`<img class="blog-cover" src="${relative(r,p.image)}" alt="${esc(p.imageAlt||'')}" width="640" height="400" loading="lazy">`:`<div class="blog-cover blog-cover-empty" aria-hidden="true"><img src="${relative(r,'img/maskot-merakli.svg')}" width="120" height="124" alt=""></div>`;
  const cards=articles.map(p=>`<article class="blog-card" data-post-card data-search="${esc(p.title+' '+p.summary+' '+(p.categories||[]).join(' '))}" data-category="${esc(JSON.stringify(p.categories||[]))}">${cover(p,route)}<div class="blog-card-body"><div class="blog-meta"><time datetime="${esc(p.date.slice(0,10))}">${date(p)}</time>${(p.categories||[]).map(c=>`<span>${esc(c)}</span>`).join('')}</div><h2 lang="${esc(p.contentLanguage||lang)}"><a href="${p.slug}/index.html">${esc(p.title)}</a></h2><p lang="${esc(p.contentLanguage||lang)}">${esc(p.summary)}</p><a class="link" href="${p.slug}/index.html">${l.read}${arrow}</a></div></article>`).join('');
  const content=`<nav class="blog-breadcrumb" aria-label="${l.homeLabel}"><a href="${relative(route,l.home)}">${l.homeLabel}</a><span aria-hidden="true">›</span><span aria-current="page">${l.name}</span></nav><section class="blog-hero"><div class="wrap"><div><p class="eyebrow">HURRA LINGO · ${l.name.toLocaleUpperCase(l.locale)}</p><h1>${l.title}</h1><p class="lead">${l.intro}</p></div><img src="${relative(route,'img/maskot-merakli.svg')}" alt="" width="180" height="186"></div></section><section class="blog-archive wrap" aria-label="${l.name}">${articles.length?`<form class="blog-search" data-blog-search><label>${l.search}<input type="search" name="q" placeholder="${l.placeholder}" autocomplete="off"></label><label>${l.category}<select name="category"><option value="">${l.all}</option>${cats.map(c=>`<option>${esc(c)}</option>`).join('')}</select></label><button class="btn btn-line" type="reset">${l.reset}</button></form><p class="blog-result" id="blog-result" role="status" aria-live="polite" data-count-label="${l.count}">${articles.length} ${l.count}</p><div class="blog-grid">${cards}</div><p class="blog-empty" id="blog-empty" hidden>${l.empty}</p>`:`<div class="blog-empty"><img src="${relative(route,'img/maskot-mutlu.svg')}" alt="" width="90" height="93"><p>${l.pending}</p></div>`}</section>`;
  const alternates=Object.fromEntries(Object.entries(locales).map(([k,v])=>[k,v.route]));
  write(route+'index.html',shell(lang,route,l.name,l.intro,content,alternates));
  for(const p of articles) {
    const r=route+p.slug+'/';
    const historical=/kampanya|indirim/i.test(p.paragraphs.join(' '))?'<p class="editorial-note">Bu yazı yayımlandığı dönemin bilgilerini içerir. Tarihli kampanya ve indirimler güncel teklif değildir. Güncel seçenekler için <a href="/ucretler/">Ücretler sayfamızı</a> inceleyin.</p>':'';
    const body=`<article class="blog-article"><a class="link" href="${relative(r,route+'index.html')}">← ${l.back}</a><div class="blog-meta"><time datetime="${esc(p.date.slice(0,10))}">${date(p)}</time>${p.author?`<span>${esc(p.author)}</span>`:''}</div><h1 lang="${esc(p.contentLanguage||lang)}">${esc(p.title)}</h1>${historical}${cover(p,r)}<div class="blog-prose" lang="${esc(p.contentLanguage||lang)}">${p.body?renderNodes(p.body,r):p.paragraphs.map(t=>`<p>${esc(t)}</p>`).join('')}</div><a class="link" href="${relative(r,route+'index.html')}">← ${l.back}</a></article>`;
    write(r+'index.html',shell(lang,r,p.title,p.summary,body,{[lang]:r}));
  }
  console.log(lang+': '+articles.length+' articles → '+route);
}
