// Final production-only pass over a built package: one stylesheet per page, self-hosted fonts,
// versioned CSS and JS for the one-year cache, and responsive blog images. Source pages stay as they are.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),c=require('cheerio');
const origin='https://www.hurralingo.com',skip=new Set(['assets','img','media','docs','wp-content','functions']);
const fonts=['/assets/fonts/figtree-latin.woff2','/assets/fonts/bricolage-latin.woff2'];
const coverSizes='(max-width: 920px) 100vw, 880px',cardSizes='(max-width: 720px) 100vw, (max-width: 960px) 50vw, 400px';
const cookieLabels={tr:'Çerez tercihleri',en:'Cookie preferences',de:'Cookie-Einstellungen',az:'Kuki tərcihləri',fr:'Préférences de cookies'};
const hash=data=>crypto.createHash('sha256').update(data).digest('hex').slice(0,12);
const pages=(dir,base=dir)=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
 const file=path.join(dir,e.name);
 if(e.isDirectory())return dir===base&&skip.has(e.name)?[]:pages(file,base);
 return e.name.endsWith('.html')?[file]:[];
});
module.exports=(out,{measurementId}={})=>{
 const widths=JSON.parse(fs.readFileSync(path.join(out,'img/blog/widths.json'),'utf8'));
 const versions=new Map(),bundles=new Map();
 const version=pathname=>{if(!versions.has(pathname))versions.set(pathname,hash(fs.readFileSync(path.join(out,pathname))));return pathname+'?v='+versions.get(pathname);};
 const bundle=list=>{
  const key=list.join('|');
  if(!bundles.has(key)){
   // A byte order mark in the middle of a bundle would invalidate that file's first rule.
   const css=['/assets/fonts.css',...list].map(p=>fs.readFileSync(path.join(out,p),'utf8').replace(/^﻿/,'')).join('\n'),name=`/assets/bundle-${hash(css)}.css`;
   fs.writeFileSync(path.join(out,name),css);bundles.set(key,name);
  }
  return bundles.get(key);
 };
 const responsive=($,img,sizes)=>{
  const src=new URL(img.attr('src'),'https://x.invalid'+img.data('route')).pathname,name=path.posix.basename(src),size=widths[name];
  if(!src.startsWith('/img/blog/')||!size)return null;
  const [full,height]=size,set=[480,800].filter(w=>w<full).map(w=>`/img/blog/w${w}/${name} ${w}w`);
  set.push(`${src} ${full}w`);
  // Without its own dimensions an image would take its layout width from sizes and grow.
  if(!img.attr('width'))img.attr('width',full).attr('height',height);
  img.attr('src',src).attr('srcset',set.join(', ')).attr('sizes',sizes);
  return {srcset:set.join(', '),sizes};
 };
 for(const file of pages(out)){
  const $=c.load(fs.readFileSync(file,'utf8')),route='/'+path.relative(out,file).split(path.sep).join('/').replace(/(index|404)\.html$/,'');
  const resolve=value=>new URL(value,origin+route).pathname;
  // Everything the page styled with stays in the same order, so the cascade does not change.
  const sheets=$('link[rel=stylesheet]'),local=sheets.map((i,e)=>e.attribs.href).get().filter(h=>!h.startsWith('https://fonts.')).map(resolve);
  if(sheets.length){
   sheets.first().before(`<link rel="stylesheet" href="${bundle(local)}">`);sheets.remove();
   $('link[rel=preconnect]').remove();
   $('head').prepend(fonts.map(f=>`<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>`).join(''));
  }
  $('script[src]').each((i,e)=>{const p=resolve(e.attribs.src);if(p.startsWith('/assets/'))e.attribs.src=version(p);});
  // Measurement stays off, and pages stay unchanged, until an id is configured.
  if(measurementId&&$('#cookie').length){
   $('body').append(`<script src="${version('/assets/analytics.js')}" data-measurement-id="${measurementId}" defer></script>`);
   $('.footer .kap-links').last().append(`<li><button class="ck-open" type="button" data-ck-open>${cookieLabels[$('html').attr('lang')]}</button></li>`);
  }
  $('main img').each((i,e)=>{if(!/maskot-/.test(e.attribs.src||'')&&!(e.attribs.alt||'').trim()&&!$(e).closest('[aria-hidden=true]').length)e.attribs.alt=$(e).closest('.blog-card').find('h2').first().text()||$('h1').first().text();});
  $('main img').each((i,e)=>{$(e).data('route',route);});
  $('.blog-card .blog-cover,.site-card img').each((i,e)=>{responsive($,$(e),cardSizes);});
  $('.blog-prose img').each((i,e)=>{responsive($,$(e),coverSizes);});
  // The article cover is the largest element of a post, so it must not wait for lazy loading.
  const hero=$('.blog-article > .blog-cover').first();
  const lead=hero.length?hero:$('.blog-article img').first();
  if(lead.length){
   lead.removeAttr('loading').attr('fetchpriority','high');
   const image=responsive($,lead.data('route',route),coverSizes);
   if(image)$('head').append(`<link rel="preload" as="image" imagesrcset="${image.srcset}" imagesizes="${image.sizes}" fetchpriority="high">`);
  }
  fs.writeFileSync(file,$.html());
 }
 console.log(`Optimized package: ${bundles.size} stylesheet bundles, ${versions.size} versioned scripts.`);
};
