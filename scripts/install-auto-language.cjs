// Idempotent build hook: add one early shared script without reserializing HTML.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const routes=require('../content/i18n/canonical-all.json');
const tag='<script src="/assets/auto-language.js"></script>';
for(const file of [...routes.map(r=>r.slice(1)+'index.html'),'en.html','de.html','az.html']){
 const full=path.join(root,file),html=fs.readFileSync(full,'utf8');
 if(!html.includes(tag))fs.writeFileSync(full,html.replace(/<head>/i,'<head>'+tag));
}
console.log('Installed early language selection on '+routes.length+' canonical pages and three legacy aliases.');
