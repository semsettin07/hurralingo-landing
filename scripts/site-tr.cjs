// Shared Turkish shell. Foreign-language sources and pricing logic are never written here.
const fs = require('node:fs');
const path = require('node:path');
const cheerio = require('cheerio');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, s) => { fs.mkdirSync(path.dirname(path.join(root,p)), {recursive:true}); fs.writeFileSync(path.join(root,p),s); };
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const source = read('content/site/home-template.html');
const original = cheerio.load(source);
const menu = [ ['Eğitim','/egitimmodelimiz/'], ['Dersler','/derslerimiz/'], ['Öğretmenler','/ogretmenlerimiz/'], ['Blog','/blog/'], ['Ücretler','/ucretler/'], ['Referanslar','/referanslarimiz/'], ['Kurumsal','/kurumsal/'], ['İletişim','/iletisim/'] ];
const headerMenu=menu;
const trial = 'https://www.hurralingo.app/trial-request';
const teachers = JSON.parse(source.match(/var T = (\[\[.*?\]\]);/)[1]);
function absolute(markup) {
  return markup.replace(/((?:src|srcset|poster|href|data-src|data-video)=")(img\/|media\/|docs\/)/g,'$1/$2');
}
function fragment(selector) { return absolute(original(selector).first().prop('outerHTML') || ''); }
function clean(markup) {
  const $ = cheerio.load(markup,null,false);
  $('style,script,link,svg[width="0"]').remove();
  $('[href]').each((i,e)=>{
    const a=$(e), href=a.attr('href');
    const anchors={top:'/',programlar:'/derslerimiz/#programlar',ogretmenler:'/ogretmenlerimiz/',fiyatlar:'/ucretler/',kurumlar:'/kurumsal/',sorular:'/egitimmodelimiz/#sorular',sss:'/egitimmodelimiz/#sss'};
    if(href?.startsWith('#') && anchors[href.slice(1)] && !$('[id]').toArray().some(n=>$(n).attr('id')===href.slice(1))) a.attr('href',anchors[href.slice(1)]);
  });
  return absolute($.html()).replace(/[\t ]+$/gm,'');
}
function header(route) {
  // User-approved original header: announcement, larger logo, Programs dropdown
  // and original desktop/mobile composition. Only adapt links to the new pages.
  const $=cheerio.load(fragment('#announce')+fragment('#hdr')+fragment('#drawer'),null,false);
  $('#hdr .hd-cta').remove();
  require('./mobile-languages.cjs')($);
  const anchors={top:'/',programlar:'/derslerimiz/#programlar',ogretmenler:'/ogretmenlerimiz/',fiyatlar:'/ucretler/',sorular:'/egitimmodelimiz/#sorular',kurumlar:'/kurumsal/'};
  $('.brand').attr('href','/');
  $('a[href]').each((i,e)=>{const a=$(e),href=a.attr('href');if(href?.startsWith('#')&&anchors[href.slice(1)])a.attr('href',anchors[href.slice(1)]);else if(href==='blog/')a.attr('href','/blog/');});
  const programs=$('.nav > .nav-dd').first().clone();
  programs.find('> .dd-trig').attr('href','/derslerimiz/').contents().filter((i,n)=>n.type==='text').first().replaceWith('Dersler');
  $('.nav').empty();
  for(const [label,href] of headerMenu){
    if(label==='Dersler')$('.nav').append(programs);
    else $('.nav').append(`<a class="nav-a" href="${href}">${label}</a>`);
  }
  $('#drawer .dr-list').html(headerMenu.map(([label,href])=>`<li><a href="${href}"><span>${label}</span><svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></a></li>`).join(''));
  $('#drawer .dr-sub-links a[href="/blog/"]').remove();
  $('.nav .nav-a,#drawer .dr-list a').each((i,e)=>{const a=$(e),href=a.attr('href').split('#')[0];if(route===href||(href==='/blog/'&&route.startsWith('/blog/')))a.attr('aria-current','page');});
  $('[data-spy]').removeAttr('data-spy');
  return $.html().replace(/[\t ]+$/gm,'');
}
function footer() {
  const $=cheerio.load(fragment('footer'),null,false);
  $('#kap-fh-1').next('ul').find('a').attr('href','/derslerimiz/#programlar');
  $('#kap-fh-2').next('ul').html(menu.map(([label,href])=>`<li><a href="${href}">${label}</a></li>`).join(''));
  // User-approved original PDFs, served unchanged at their former WordPress paths.
  $('#kap-fh-3').next('ul').html('<li><a href="/wp-content/uploads/2026/03/Hurra-Lingo-Privacy-Policy-2026-02.pdf" target="_blank" rel="noopener noreferrer" hreflang="en">Gizlilik Politikası (PDF, İngilizce)</a></li><li><a href="/wp-content/uploads/2026/03/Hurra-Lingo-Terms-and-Conditions-2026-02.pdf" target="_blank" rel="noopener noreferrer" hreflang="en">Şartlar ve Koşullar (PDF, İngilizce)</a></li>');
  $('.kap-top').attr('href','#top');
  return clean($.html());
}
function shell(route,title,description,content,options={}) {
  const canonical='https://www.hurralingo.com'+route;
  const icons=original('svg[width="0"]').map((i,e)=>original(e).prop('outerHTML')).get().join('');
  const support=fragment('.mbar')+fragment('#cookie')+fragment('#vdlg');
  const extra=[...(route==='/'?['assets/republic-day-20261027-v2.css']:[]),...(options.styles||[])].map(p=>`<link rel="stylesheet" href="/${p}">`).join('');
  const scripts=(options.scripts||[]).map(p=>`<script src="/${p}" defer></script>`).join('');
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>${esc(title)} | Hurra Lingo</title><meta name="description" content="${esc(description)}"><meta name="robots" content="noindex, nofollow"><link rel="canonical" href="${canonical}">${route==='/'?'<link rel="alternate" hreflang="tr" href="https://www.hurralingo.com/"><link rel="alternate" hreflang="x-default" href="https://www.hurralingo.com/">':''}<meta property="og:type" content="${options.article?'article':'website'}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://www.hurralingo.com/img/hurralingo-og.jpg"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/img/favicon.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Figtree:wght@400;500;600;700&family=Poetsen+One&display=swap" rel="stylesheet"><link rel="stylesheet" href="/assets/site-theme-tr.css"><link rel="stylesheet" href="/desktop-density.css"><link rel="stylesheet" href="/localization.css">${extra}<link rel="stylesheet" href="/assets/site-tr.css"></head><body class="site-tr ${options.bodyClass||''}">${icons}<a class="skip" href="#main">İçeriğe geç</a>${header(route)}<main id="main" class="${options.mainClass||''}">${content}</main>${footer()}${support}<script src="/assets/site-tr.js" defer></script>${scripts}</body></html>\n`;
}
function assets() {
  write('assets/site-theme-tr.css',original('style').map((i,e)=>original(e).text()).get().join('\n'));
  // Preserve existing drawer, language dropdown, video controls, FAQ, FLIP and motion preferences.
  let js=original('script').map((i,e)=>original(e).text()).get().join('\n;\n');
  js=js.replace(/(["'])img\//g,'$1/img/').replace(/(["'])media\//g,'$1/media/');
  js=js.replace('if(!grid) return;','if(!grid) return;\n  if(sec.dataset.limit) T=T.slice(0,Number(sec.dataset.limit));');
  js=js.replace("matchMedia('(min-width:1181px)')","matchMedia('(min-width:1440px)')");
  write('assets/site-tr.js',js);
}
function hero(kicker,title,description,mascot='maskot-mutlu.svg') {
  return `<div class="wrap page-intro" id="top"><nav class="site-crumb" aria-label="Sayfa yolu"><a href="/">Ana sayfa</a><span aria-hidden="true">/</span><span aria-current="page">${esc(kicker)}</span></nav><div class="page-intro-grid"><div><p class="eyebrow">HURRA LINGO · ${esc(kicker.toLocaleUpperCase('tr-TR'))}</p><h1>${title}</h1><p class="lead">${description}</p><a class="btn btn-primary" href="${trial}" target="_blank" rel="noopener noreferrer">Ücretsiz Tanışma Dersi <svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></a></div><img class="page-mascot" src="/img/${mascot}" alt="" width="180" height="186"></div></div>`;
}
function teacherSection(limit) {
  const $=cheerio.load(fragment('#ogretmenler'),null,false);
  const list=limit?teachers.slice(0,limit):teachers;
  if(limit){$('#ogretmenler').attr('data-limit',limit);$('.t-filters').remove();$('.lead').text('Kadrodan birkaç öğretmenimizle tanışın. Tüm öğretmenleri detay sayfasında dile göre keşfedebilirsiniz.');}
  else $('.t-filters').append('<button class="chip" type="button" data-filter="Türkçe" data-tone="tr" aria-pressed="false"><span class="c-dot" aria-hidden="true"></span>Türkçe</button>');
  $('#t-count').html(`<b>${list.length}</b> öğretmen gösteriliyor`);
  $('#teachers').html(list.map(t=>`<article class="teacher" data-lang="${esc(t[1])}"><div class="t-in"><div class="t-media"><span class="t-back" aria-hidden="true"></span><div class="t-ph"><img src="/${t[2]}" alt="${esc(t[0])}" width="480" height="480" loading="lazy" style="--oy:${t[3]}"></div></div><h3 class="t-name">${esc(t[0])}</h3><p class="t-lang">${esc(t[1])}</p><a class="t-cta" href="${trial}" target="_blank" rel="noopener noreferrer">Ücretsiz Tanışma Dersi</a></div></article>`).join(''));
  if(limit)$('#ogretmenler').append('<p class="section-link"><a class="btn btn-line" href="/ogretmenlerimiz/">Tüm öğretmenlerimizle tanışın →</a></p>');
  return clean($.html());
}
module.exports={root,read,write,esc,source,original,menu,headerMenu,teachers,trial,absolute,fragment,clean,shell,assets,hero,teacherSection};
