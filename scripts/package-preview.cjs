// Deliberately preview-only. There is no production packaging/activation switch.
const fs=require('node:fs'),path=require('node:path');
const {root,read}=require('./site-tr.cjs');
const out=path.resolve(root,'dist/phase-1b-preview');
if(!out.startsWith(path.resolve(root,'dist')+path.sep))throw Error('Unsafe preview output path');
if(fs.existsSync(out))fs.rmSync(out,{recursive:true});
fs.mkdirSync(out,{recursive:true});
const dirs=['assets','img','media','blog','en','de','az','ucretler','egitimmodelimiz','derslerimiz','ogretmenlerimiz','referanslarimiz','kurumsal','iletisim'];
for(const p of [...dirs,'index.html','en.html','de.html','az.html','desktop-density.css','localization.css','og.jpg','sitemap.xml','robots.txt'])fs.cpSync(path.join(root,p),path.join(out,p),{recursive:true});
fs.mkdirSync(path.join(out,'docs'),{recursive:true});
fs.copyFileSync(path.join(root,'docs/hurra-lingo-emniyet-mensuplari-kampanya.pdf'),path.join(out,'docs/hurra-lingo-emniyet-mensuplari-kampanya.pdf'));
const redirects=JSON.parse(read('content/site/redirects-tr.json')).rules;
fs.writeFileSync(path.join(out,'_redirects'),'# Preview-only relative Turkish redirects. Foreign paths untouched.\n'+Object.entries(redirects).map(([a,b])=>`${a} ${b} 301`).join('\n')+'\n');
fs.writeFileSync(path.join(out,'_headers'),'/*\n  X-Robots-Tag: noindex, nofollow\n  X-Content-Type-Options: nosniff\n');
fs.writeFileSync(path.join(out,'404.html'),'<!doctype html><html lang="tr"><meta charset="utf-8"><meta name="robots" content="noindex, nofollow"><title>Sayfa bulunamadı | Hurra Lingo</title><h1>Bu sayfayı bulamadık.</h1><p><a href="/">Ana sayfaya dönün</a></p></html>');
console.log('Preview package: '+out+'; '+Object.keys(redirects).length+' explicit TR redirect rules. No production config written.');
