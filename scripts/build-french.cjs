// Fifth-language extension of the existing static Cheerio/JSON pipeline. Fully offline.
const fs=require('node:fs'),path=require('node:path'),c=require('cheerio'),assert=require('node:assert/strict');
const {collect,shouldTranslate,attrs,legalBlocks}=require('./french-segments.cjs');
const config=require('./french-content.cjs'),l=config.locale;
const fullBlocks=require('./french-blocks.cjs');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const write=(file,text)=>{const full=path.join(root,file);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,text)};
const esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const inventory=JSON.parse(read('docs/french/inventory.json')),dictionary=JSON.parse(read('content/i18n/fr.json'));
const reviewed=JSON.parse(read('content/i18n/fr-editorial.json'));
const blockDictionary=JSON.parse(read('content/i18n/fr-blocks.json'));
const manifest=JSON.parse(read('content/i18n/routes.json')),posts=JSON.parse(read('content/blog/posts.json'));
const groups=structuredClone(inventory.groups),sourceDocs=new Map(groups.map(g=>[g.id,c.load(read(g.sourceRoute.slice(1)+'index.html'))]));
const fixed=require('./locale-content.cjs').fixed;
const saved=fs.existsSync(path.join(root,'content/i18n/french-routes.json'))?JSON.parse(read('content/i18n/french-routes.json')).groups:[];
const titleOverrides={};let articleIndex=0;
const slug=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/œ/g,'oe').replace(/æ/g,'ae').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
for(const group of groups){const $=sourceDocs.get(group.id);if(group.kind==='fixed'){
 const index=fixed.indexOf(group.id);assert.ok(index>=0);group.route='/fr/'+(l.slugs[index]?l.slugs[index]+'/':'');group.title=config.pageTitles[index];group.description=config.descriptions[index];
 }else{
 const meta=config.articles[articleIndex++];assert.ok(meta,'Missing reviewed French metadata');[group.title,group.description]=meta;
 group.route=saved.find(g=>g.id===group.id)?.route||'/fr/blog/'+slug(group.title)+'/';
 titleOverrides[group.sourceLanguage+'\0'+$('h1').text().trim()]=group.title;
 }
 group.siblings.fr=group.route;
}
assert.equal(articleIndex,42);assert.equal(new Set(groups.map(g=>g.route)).size,groups.length);
const legal=[{route:'/fr/confidentialite/',title:'Politique de confidentialité',description:'Traduction française de la politique de confidentialité Hurra Lingo du 16 février 2026, avec accès au document anglais original.',source:0},{route:'/fr/conditions-generales/',title:'Conditions générales',description:'Traduction française des conditions générales Hurra Lingo du 16 février 2026, avec accès au document anglais original.',source:1}];
const routeLookup=new Map();for(const group of groups)for(const route of Object.values(group.siblings))routeLookup.set(route,group);
const redirects={...JSON.parse(read('content/site/redirects-tr.json')).rules,...JSON.parse(read('content/i18n/redirects.json'))};
const missing=new Set(),deExamples={'Alles Gute zum Vatertag, Papa!':'Bonne fête des Pères, papa !','Ich liebe dich, Papa.':'Je t’aime, papa.','Lieber Papa,':'Cher papa,','alles Gute zum Vatertag!':'Bonne fête des Pères !','Ich liebe dich sehr.':'Je t’aime très fort.','Du bist mein Held.':'Tu es mon héros.'};
function t(text,language='en'){
 if(!text)return text;
 if(language==='de'&&deExamples[text])return deExamples[text];
 if(titleOverrides[language+'\0'+text])return titleOverrides[language+'\0'+text];
 if(Object.hasOwn(config.overrides,text))return config.overrides[text];
 if(reviewed[language]?.[text])return reviewed[language][text];
 if(!shouldTranslate(text,language))return text;
 const translated=dictionary[language]?.[text];if(!translated){missing.add(language+': '+text);return text}
 return translated.replace(/Hurrah Lingo|Hurray Lingo|Hurra Linqo/g,'Hurra Lingo');
}
function translate($,language){function visit(node){
 if(['script','style','svg'].includes(node.name)||node.attribs?.['data-fr-ready']!==undefined)return;
 if(node.attribs?.lang&&/(?:^|\s)(?:kap-hi|t-hi|t-l)(?:\s|$)/.test(node.attribs.class||''))return;
 if(node.type==='text'){const key=node.data.trim();if(key)node.data=node.data.replace(key,t(key,language))}
 for(const attr of attrs){const value=node.attribs?.[attr];if(value)node.attribs[attr]=t(value,language)}
 if(node.name==='meta'&&/^(description|og:title|og:description|twitter:title|twitter:description)$/.test(node.attribs?.name||node.attribs?.property))node.attribs.content=t(node.attribs.content,language);
 for(const child of node.children||[])visit(child);
 }visit($.root()[0]);return $}
function localUrl(href,source){let u;try{u=new URL(href,'https://www.hurralingo.com'+source)}catch{return href}
 if(!['www.hurralingo.com','hurralingo.com'].includes(u.hostname))return href;
 let pathname=u.pathname.replace(/index\.html$/,'');
 if(redirects[pathname]){const target=new URL(redirects[pathname],'https://www.hurralingo.com');pathname=target.pathname;if(!u.hash)u.hash=target.hash}
 const group=routeLookup.get(pathname);if(group)pathname=group.route;
 return pathname+u.search+u.hash;
}
function menus($,siblings,lang){
 const labels={tr:'Türkçe',en:'English',de:'Deutsch',az:'Azərbaycanca',fr:'Français'};
 if(!$('#hd-lang a[lang=fr]').length)$('#hd-lang ul').append('<li><a class="dd-l" lang="fr" hreflang="fr"><span class="dd-code">FR</span><span>Français</span></a></li>');
 if(!$('.dr-langs a[lang=fr]').length)$('.dr-langs').append('<a lang="fr" hreflang="fr" aria-label="Français">FR</a>');
 $('#hd-lang a[lang],.dr-langs a[lang]').each((i,node)=>{const a=$(node),language=a.attr('lang');a.attr('href',siblings[language]||(language==='tr'?'/':`/${language}/`));
  if(lang==='fr'){a.removeAttr('aria-current');a.find('.dd-chk').remove();if(language==='fr')a.attr('aria-current','page');if(a.find('.dd-code').length){a.find('.dd-code').text(language.toUpperCase());a.find('span').eq(1).text(labels[language])}else{a.text(labels[language]).attr('aria-label',labels[language])}}
 });
 require('./mobile-languages.cjs')($);
 if(lang==='fr'){$('#hdr .lang-txt').text('FR');$('#hdr .lang-dd > button').attr('aria-label','FR, choisir la langue');$('.dr-langs').attr('aria-label','Choisir la langue')}
}
function alternates($,siblings){$('link[rel=alternate][hreflang]').remove();for(const [lang,route]of Object.entries(siblings))$('head').append(`<link rel="alternate" hreflang="${lang}" href="https://www.hurralingo.com${route}">`);if(siblings.tr)$('head').append(`<link rel="alternate" hreflang="x-default" href="https://www.hurralingo.com${siblings.tr}">`)}
function finish($,group,source){
 $('html').attr('lang','fr');$('body').removeClass('locale-en locale-de locale-az').addClass('locale-fr').attr('data-locale','fr');
 $('head title').text(group.title+' | Hurra Lingo');$('meta[name=description],meta[property="og:description"]').attr('content',group.description);$('meta[property="og:title"]').attr('content',group.title);
 $('link[rel=canonical]').attr('href','https://www.hurralingo.com'+group.route);$('meta[property="og:type"]').attr('content',group.kind==='article'?'article':'website');$('meta[property="og:url"]').attr('content','https://www.hurralingo.com'+group.route);
 for(const [key,value]of Object.entries({'og:locale':'fr_FR','twitter:title':group.title,'twitter:description':group.description})){
  const property=key.startsWith('og:')?'property':'name',selector=`meta[${property}="${key}"]`;if($(selector).length)$(selector).attr('content',value);else $('head').append(`<meta ${property}="${key}" content="${esc(value)}">`);
 }
 $('a[href]').each((i,node)=>{const a=$(node);if(a.closest('#hd-lang,.dr-langs').length)return;a.attr('href',localUrl(a.attr('href'),source))});
 $('[src]').each((i,node)=>{const value=$(node).attr('src');if(value&&!/^(?:[a-z]+:|\/)/i.test(value))$(node).attr('src',new URL(value,'https://www.hurralingo.com'+source).pathname)});
 $('time[datetime]').each((i,node)=>{const value=$(node).attr('datetime');if(!Number.isNaN(Date.parse(value)))$(node).text(new Intl.DateTimeFormat('fr-FR',{dateStyle:'long',timeZone:'UTC'}).format(new Date(value)))});
 $('script[src="/assets/site-tr.js"],script[src="/assets/i18n/site-en.js"],script[src="/assets/i18n/site-de.js"],script[src="/assets/i18n/site-az.js"]').attr('src','/assets/i18n/site-fr.js');
 $('script[src="/assets/i18n/pricing-en.js"]').attr('src','/assets/i18n/pricing-fr.js');$('script[src="/assets/i18n/pricing-ui.js"]').attr('src','/assets/i18n/pricing-ui-fr.js');
 if(!$('link[href="/assets/site-locales.css"]').length)$('head').append('<link rel="stylesheet" href="/assets/site-locales.css">');
 if(!$('link[href="/assets/site-fr.css"]').length)$('head').append('<link rel="stylesheet" href="/assets/site-fr.css">');
 $('a[href*="Hurra-Lingo-Privacy-Policy"]').attr('href','/fr/confidentialite/').removeAttr('target rel').attr('hreflang','fr').text('Politique de confidentialité');
 $('a[href*="Hurra-Lingo-Terms-and-Conditions"]').attr('href','/fr/conditions-generales/').removeAttr('target rel').attr('hreflang','fr').text('Conditions générales');
 menus($,group.siblings||{fr:group.route},'fr');alternates($,group.siblings||{fr:group.route});
 $('script[type="application/ld+json"]').remove();
 const crumbs=[{name:'Accueil',url:'/fr/'}];if(group.kind==='article')crumbs.push({name:'Blog',url:'/fr/blog/'});if(group.route!=='/fr/')crumbs.push({name:group.title,url:group.route});
 const data=[{'@context':'https://schema.org','@type':group.kind==='article'?'BlogPosting':'WebPage',inLanguage:'fr',url:'https://www.hurralingo.com'+group.route,name:group.title,headline:group.title,description:group.description},
 {'@context':'https://schema.org','@type':'BreadcrumbList',inLanguage:'fr',itemListElement:crumbs.map((item,i)=>({'@type':'ListItem',position:i+1,name:item.name,item:'https://www.hurralingo.com'+item.url}))}];
 const time=$('main time[datetime]').first().attr('datetime');if(group.kind==='article'&&time)data[0].datePublished=time;
 const cover=$('main .blog-cover').first().attr('src');if(group.kind==='article'&&cover){const url=new URL(cover,'https://www.hurralingo.com'+group.route).href;data[0].image=url;$('meta[property="og:image"]').attr('content',url);$('head').append(`<meta name="twitter:image" content="${esc(url)}">`)}
 $('head').append('<script type="application/ld+json">'+JSON.stringify(data).replace(/</g,'\\u003c')+'</script>');
 return $;
}
// Fixed pages use their existing English counterpart, sharing the established design.
const pages=new Map();
for(const group of groups.filter(g=>g.kind==='fixed')){
 const $=translate(c.load(read(group.sourceRoute.slice(1)+'index.html')),'en'),index=fixed.indexOf(group.id);
 if(config.headings[index])$('h1').html(config.headings[index]);
 if(group.id==='/ucretler/')$('h1').text('Tarifs des cours Hurra Lingo');
 if(group.id==='/'){
  $('#h1').contents().filter((i,n)=>n.type==='text').first().replaceWith('Le plaisir d’apprendre une nouvelle ');$('#h1 .hero-smile').contents().filter((i,n)=>n.type==='text').first().replaceWith('langue !');
 }
 finish($,group,group.sourceRoute);pages.set(group.route,$);
}
// Full article mains retain their original paragraph/list/table/image structure.
const articleGroups=groups.filter(g=>g.kind==='article');
for(const group of articleGroups){
 const source=sourceDocs.get(group.id),main=c.load(source('main').prop('outerHTML'),null,false);
 for(const node of fullBlocks.blocks(main)){
  const item=fullBlocks.encode(main,node),translated=blockDictionary[item.key];
  assert.ok(translated&&translated.source===item.text,'Missing complete French paragraph: '+group.id+' '+item.key);
  let text=translated.fr;
  if(main(node).text().trim()===source('h1').text().trim()&&item.markup.length===2)text='[FT00000] '+group.title+' [FT00001]';
  if(config.overrides[item.text])text=config.overrides[item.text];
  main(node).html(fullBlocks.decode(text,item.markup)).attr('data-fr-ready','');
 }
 translate(main,group.sourceLanguage);
 main('[data-fr-ready] [alt],[data-fr-ready] [title]').each((i,node)=>{for(const attr of ['alt','title'])if(main(node).attr(attr))main(node).attr(attr,t(main(node).attr(attr),group.sourceLanguage))});
 main('[data-fr-ready]').removeAttr('data-fr-ready');
 main('.blog-cover').attr('alt',group.title);
 const $=c.load(pages.get('/fr/contact/').html());$('main').replaceWith(main.html());$('main h1').text(group.title);
 if(!$('link[href="/assets/blog.css"]').length)$('head').append('<link rel="stylesheet" href="/assets/blog.css">');
 $('.blog-prose').attr('lang','fr');$('.blog-article > .link').attr('href','/fr/blog/').text('← Tous les articles');
 $('.editorial-note').each((i,node)=>{$(node).html(esc(l.historic)+' <a href="/fr/tarifs/">Tarifs →</a>')});
 finish($,group,group.sourceRoute);pages.set(group.route,$);
}
// Rebuild the French archive from all 42 distinct articles, including foreign-only originals.
const archive=pages.get('/fr/blog/'),ordered=[...articleGroups].sort((a,b)=>(sourceDocs.get(b.id)('time').first().attr('datetime')||'').localeCompare(sourceDocs.get(a.id)('time').first().attr('datetime')||''));
archive('.blog-grid').html(ordered.map(group=>{
 const source=sourceDocs.get(group.id),date=source('time').first().attr('datetime')||'',image=source('.blog-cover').first().attr('src')||'/img/maskot-merakli.svg';
 return `<article class="blog-card" data-post-card data-search="${esc(group.title+' '+group.description)}" data-category="${esc(JSON.stringify(['La parade de l’alphabet']))}"><img class="blog-cover" src="${esc(image)}" alt="${esc(group.title)}" width="640" height="400" loading="lazy"><div class="blog-card-body"><time datetime="${date}">${new Intl.DateTimeFormat('fr-FR',{dateStyle:'long',timeZone:'UTC'}).format(new Date(date))}</time><h2><a href="${group.route}">${esc(group.title)}</a></h2><p>${esc(group.description)}</p><a class="link" href="${group.route}">Lire l’article →</a></div></article>`;
}).join(''));
archive('#blog-result').attr('data-count-label',l.articleCount).text(articleGroups.length+' '+l.articleCount);archive('select[name=category]').html('<option value="">Toutes les catégories</option><option>La parade de l’alphabet</option>');
// The homepage points at the latest French articles without changing its card layout.
const home=pages.get('/fr/');home('.home-blog .site-card').each((i,node)=>{const group=ordered[i];if(!group)return;const card=home(node);card.find('h3').text(group.title);card.find('a').attr('href',group.route);const source=sourceDocs.get(group.id),date=source('time').first().attr('datetime');card.find('time').attr('datetime',date).text(new Intl.DateTimeFormat('fr-FR',{dateStyle:'long',timeZone:'UTC'}).format(new Date(date)))});
// Complete translations of the two existing legal PDFs; no invented KVKK policy.
const documents=JSON.parse(read('content/i18n/french-legal-sources.json'));
for(const group of legal){const doc=documents[group.source],$=c.load(pages.get('/fr/contact/').html());
 const body=doc.pages.map(page=>`<section class="legal-page" data-source-page="${page.number}">${legalBlocks(page.text).map(block=>{
  const text=esc(t(block,'en').replace(/\uf0b7/g,'•'));return /^\d+\.\s/.test(block)?`<h2>${text}</h2>`:/^\d+\.\d+\s/.test(block)&&block.length<90?`<h3>${text}</h3>`:`<p>${text}</p>`;
 }).join('')}</section>`).join('');
 $('main').attr('class','blog-main').html(`<div class="wrap"><nav class="blog-breadcrumb" aria-label="Fil d’Ariane"><a href="/fr/">Accueil</a><span aria-hidden="true"> / </span><span>${group.title}</span></nav><article class="blog-article legal-article"><h1>${group.title}</h1><p class="locale-media-note">Traduction française du document anglais original du 16 février 2026. <a data-original-legal href="/${doc.file}" hreflang="en" target="_blank" rel="noopener noreferrer">Consulter le document original en anglais (PDF)</a>.</p><div class="blog-prose" lang="fr">${body}</div></article></div>`);
 $('head').append('<link rel="stylesheet" href="/assets/blog.css">');finish($,group,'/fr/contact/');
 // finish localizes footer legal links; the authoritative PDF must remain available here.
 $('[data-original-legal]').attr('href','/'+doc.file).attr('hreflang','en').attr('target','_blank').attr('rel','noopener noreferrer').text('Consulter le document original en anglais (PDF)');pages.set(group.route,$);
}
if(missing.size){write('docs/french/missing-translations.json',JSON.stringify([...missing],null,2)+'\n');throw new Error('Missing French translations: '+missing.size)}
write('docs/french/missing-translations.json','[]\n');
// Emit French runtime strings while keeping the established pricing engine/data untouched.
let runtime=read('assets/site-tr.js');
const runtimeWords={'Ücretsiz Tanışma Dersi':l.trial,'Menüyü kapat':'Fermer le menu','Menüyü aç':'Ouvrir le menu','Videoyu oynat':'Lire la vidéo','Videoyu duraklat':'Mettre la vidéo en pause','Kopyalandı':'Copié','Seçildi':'Sélectionné','Numara panoya kopyalandı.':'Numéro copié dans le presse-papiers.','Numara seçildi; kopyalamak için Ctrl+C ya da Cmd+C kullanın.':'Numéro sélectionné ; utilisez Ctrl+C ou Cmd+C pour le copier.','Kopyala':'Copier','Kaydet':'Enregistrer'};
for(const [source,target]of Object.entries(runtimeWords))runtime=runtime.replaceAll(source,target.replace(/'/g,"\\'"));
runtime=runtime.replace("root.lang = 'tr'","root.lang = 'fr'");
runtime=runtime.replaceAll("'Video'","'Vidéo'");
runtime=runtime.replace("'<p class=\"t-lang\"><i aria-hidden=\"true\"></i>'+t[1]+'</p>'","'<p class=\"t-lang\"><i aria-hidden=\"true\"></i>'+window.HurraLocaleLanguages[t[1]]+'</p>'");
runtime=runtime.replace(/return '<b>'\+n\+'<\/b> ' \+ \(f === 'all' \? 'öğretmen' : f \+ ' öğretmeni'\) \+ ' gösteriliyor';/,`return '<b>'+n+'</b> enseignants affichés'+(f==='all'?'':' · '+window.HurraLocaleLanguages[f]);`);
write('assets/i18n/site-fr.js','window.HurraLocaleLanguages = '+JSON.stringify(Object.fromEntries(require('./locale-content.cjs').languages.map((name,i)=>[name,l.languageNames[i]])))+';\n'+runtime);
write('assets/i18n/pricing-fr.js','window.HurraPricingText = '+JSON.stringify(config.pricing,null,2)+';\n');
write('assets/i18n/pricing-ui-fr.js',read('assets/i18n/pricing-ui.js').replaceAll(' / hafta',' / ${t.week}'));
// Only the language navigation and alternate links are updated in the four approved languages.
for(const group of groups)for(const [lang,route]of Object.entries(group.siblings).filter(([lang])=>lang!=='fr')){
 const file=route.slice(1)+'index.html',$=c.load(read(file));menus($,group.siblings,lang);alternates($,group.siblings);write(file,$.html());
}
for(const [route,$]of pages)write(route.slice(1)+'index.html',$.html());
// Keep legacy file aliases consistent without adding new canonical URL aliases.
for(const lang of ['en','de','az'])write(lang+'.html',read(lang+'/index.html'));
const oldRoutes=JSON.parse(read('content/i18n/canonical-all.json')).filter(r=>!r.startsWith('/fr/'));const all=[...oldRoutes,...groups.map(g=>g.route),...legal.map(g=>g.route)];
manifest.locales.fr={locale:'fr-FR',fixed:fixed.map(route=>groups.find(g=>g.id===route).route),legal:legal.map(g=>g.route),articles:articleGroups.map(g=>({route:g.route,sourceRoute:g.id.startsWith('/blog/')?g.id:null,title:g.title,legacySource:g.id.startsWith('/blog/')?null:g.sourceRoute})),canonical:[...groups.map(g=>g.route),...legal.map(g=>g.route)]};
for(const group of groups)if(manifest.routes[group.id])manifest.routes[group.id].fr=group.route;
manifest.translations=Object.fromEntries(groups.flatMap(g=>Object.values(g.siblings).map(route=>[route,g.siblings])));
write('content/i18n/routes.json',JSON.stringify(manifest,null,2)+'\n');write('content/i18n/french-routes.json',JSON.stringify({groups,legal},null,2)+'\n');write('content/i18n/canonical-all.json',JSON.stringify(all,null,2)+'\n');
write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+all.map(route=>`<url><loc>https://www.hurralingo.com${route}</loc></url>`).join('\n')+'\n</urlset>\n');

write('docs/french/build-verification.json',JSON.stringify({pass:true,existing:oldRoutes.length,french:pages.size,articles:articleGroups.length,fixed:9,legal:2,totalCanonical:all.length,sourceRouteCoverage:Object.keys(manifest.translations).filter(r=>!r.startsWith('/fr/')).length},null,2)+'\n');
console.log('Built French: 9 fixed, 42 full articles, 2 legal translations; '+all.length+' canonical URLs. Existing mains/pricing sources preserved.');

require('./build-privacy.cjs');
