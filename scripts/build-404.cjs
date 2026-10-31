// Branded not-found pages for a package. Cloudflare Pages serves the nearest 404.html,
// so each language root gets its own page, built from that language's contact page shell.
const fs=require('node:fs'),path=require('node:path'),c=require('cheerio');
const {read,esc}=require('./site-tr.cjs');
const text={
 tr:{title:'Sayfa bulunamadı',heading:'Bu sayfayı bulamadık.',lead:'Aradığınız sayfa taşınmış ya da kaldırılmış olabilir. Menüden devam edebilir ya da yazılarımızda arama yapabilirsiniz.',search:'Yazılarda ara',button:'Ara'},
 en:{title:'Page not found',heading:'We could not find this page.',lead:'The page you are looking for may have moved or been removed. You can continue from the menu or search our articles.',search:'Search articles',button:'Search'},
 de:{title:'Seite nicht gefunden',heading:'Diese Seite konnten wir nicht finden.',lead:'Die gesuchte Seite wurde möglicherweise verschoben oder entfernt. Nutzen Sie das Menü oder durchsuchen Sie unsere Beiträge.',search:'Beiträge durchsuchen',button:'Suchen'},
 az:{title:'Səhifə tapılmadı',heading:'Bu səhifəni tapa bilmədik.',lead:'Axtardığınız səhifə köçürülmüş və ya silinmiş ola bilər. Menyudan davam edə və ya yazılarımızda axtarış edə bilərsiniz.',search:'Yazılarda axtar',button:'Axtar'},
 fr:{title:'Page introuvable',heading:'Nous n’avons pas trouvé cette page.',lead:'La page que vous cherchez a peut-être été déplacée ou supprimée. Continuez depuis le menu ou recherchez dans nos articles.',search:'Rechercher dans les articles',button:'Rechercher'}
};
const fixedRoutes=['/','/egitimmodelimiz/','/derslerimiz/','/ogretmenlerimiz/','/blog/','/ucretler/','/referanslarimiz/','/kurumsal/','/iletisim/'];
module.exports=out=>{
 const locales=JSON.parse(read('content/i18n/routes.json')).locales;
 for(const [lang,t] of Object.entries(text)){
  const fixed=lang==='tr'?fixedRoutes:locales[lang].fixed,$=c.load(read(fixed[8].slice(1)+'index.html'));
  $('script[src="/assets/auto-language.js"],script[type="application/ld+json"],link[rel=canonical],link[rel=alternate],meta[property],meta[name^="twitter:"]').remove();
  $('title').text(t.title+' | Hurra Lingo');
  $('meta[name=description]').attr('content',t.lead);
  $('meta[name=robots]').attr('content','noindex, nofollow');
  $('#hd-lang a[lang],.dr-langs a[lang]').each((i,e)=>{const target=e.attribs.lang;e.attribs.href=target==='tr'?'/':`/${target}/`;});
  $('#hdr .nav .nav-a,#drawer .dr-list a').removeAttr('aria-current');
  const navigation=$('#hdr .nav .nav-a').map((i,e)=>({href:e.attribs.href,label:$(e).text().trim()})).get();
  const links=[1,4,3,7].map(i=>`<li><a class="link" href="${esc(navigation[i].href)}">${esc(navigation[i].label)}</a></li>`).join('');
  $('main').attr('class','').html(`<div class="wrap page-intro not-found" id="top"><div class="page-intro-grid"><div><h1>${esc(t.heading)}</h1><p class="lead">${esc(t.lead)}</p><form class="not-found-search" action="${fixed[4]}" method="get" role="search"><label for="not-found-q">${esc(t.search)}</label><div><input id="not-found-q" type="search" name="q" autocomplete="off"><button class="btn btn-line" type="submit">${esc(t.button)}</button></div></form><ul class="not-found-links">${links}</ul></div><img class="page-mascot" src="/img/maskot-merakli.svg" alt="" width="180" height="186"></div></div>`);
  const file=path.join(out,lang==='tr'?'':lang,'404.html');
  fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,$.html());
 }
};
