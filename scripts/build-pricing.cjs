const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root,p),'utf8').replace(/^\uFEFF/,'');
const write = (p,s) => {fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),s);};
const source = JSON.parse(read('docs/pricing-2027/workbook-cells.json'));
const data = {source:source.source, sha256:source.sha256, currency:'TRY', models:{}};
for (const [i,model] of ['private','mini','group'].entries()) {
  const cells = Object.fromEntries(source.sheets[i].cells.map(c=>[c.cell,c]));
  const literal = ref => {const c=cells[ref];if(!c || c.formula || !c.value || !Number.isFinite(Number(c.value))) throw Error('Expected numeric literal '+ref);return Number(c.value);};
  const config = {sheet:source.sheets[i].name, baseDiscount:model==='private'?0:literal('A29'), teachers:{}};
  for (const [teacher,b,s,a,f1,f2] of [['turkish','B','B','E','B','C'],['native','I','I','L','I','J']]) {
    const monthlyLessons = {1:literal(f1+'6'),2:literal(f2+'6')};
    config.teachers[teacher] = {base:model==='private'?literal(b+'4'):null, monthlyLessons, plans:{
      monthly:{months:1,discount:0,cashDiscount:null,lessons:monthlyLessons,payments:['monthly']},
      six:{months:6,discount:literal(s+'12'),cashDiscount:literal(s+'22'),lessons:{1:literal(s+'19'),2:literal((s==='B'?'C':'J')+'19')},payments:['cash','installment']},
      annual:{months:12,discount:literal(a+'12'),cashDiscount:literal(a+'22'),lessons:{1:literal(a+'19'),2:literal((a==='E'?'F':'M')+'19')},payments:['cash','installment']}
    }};
  }
  data.models[model]=config;
}
write('assets/pricing-data.js',`// Generated from ${source.source}; run npm run pricing:build after workbook extraction.\n(function(root){const data=${JSON.stringify(data,null,2)};if(typeof module!=='undefined'&&module.exports)module.exports=data;else root.HurraPricingData=data;})(typeof window!=='undefined'?window:globalThis);\n`);
const home=read('index.html');
// Reuse the site's shared typography, tokens, header/drawer and footer, as the blog builder does.
const styles=[...home.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m=>m[1]).join('\n');
let header=home.slice(home.indexOf('<div class="announce"'),home.indexOf('<!-- SECTION 02-hero:'));
let footer=home.match(/<footer class="footer">[\s\S]*?<\/footer>/)[0];
function rewrite(s) {return s.replace(/(src|poster|href)="((?:img|media)\/[^"#]+)"/g,'$1="/$2"')
  .replace(/href="#(top|programlar|ogretmenler|fiyatlar|sorular|kurumlar|sss)"/g,(_,id)=>`href="/${id==='top'?'':'#'+id}"`)
  .replace(/href="blog\/"/g,'href="/blog/"').replace(/ data-spy/g,'')
  .replace(/href="\/ucretler\/"/g,'href="/ucretler/" aria-current="page"');}
header=rewrite(header);footer=rewrite(footer);
const icons=[...home.matchAll(/<svg width="0"[\s\S]*?<\/svg>/g)].map(m=>m[0]).join('');
const cards=[['group','Grup Dersi','5–8 kişi','30 dk','Birlikte konuşun, birlikte ilerleyin.'],['mini','Mini Grup Dersi','2–4 kişi','30 dk','Küçük grupta daha çok konuşma fırsatı.'],['private','Özel Ders (Bire Bir)','1 kişi',null,'Hedeflerinize göre kişisel bir öğrenme planı.']].map(([model,name,people,duration,desc])=>`<article class="fee-model" data-model="${model}"><div class="fee-model-top"><span class="stamp">${people}${duration?' · '+duration:''}</span><h2>${name}</h2><p>${desc}</p></div><p class="fee-start"><strong data-start-price>—</strong><span> / ders</span></p><p class="fee-condition">Türk öğretmen · yıllık üyelik · peşin ödeme<br>KDV hariç</p><button class="btn btn-line" type="button" aria-pressed="false">Bu modeli seç</button></article>`).join('');
const content=read('content/pricing-page.html').replace('<!-- MODEL_CARDS -->',cards);
write('ucretler/index.html',`<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>Hurra Lingo Ders Ücretleri 2027</title><meta name="description" content="Ders modelinizi, öğretmeninizi ve üyelik sürenizi seçin. Hurra Lingo 2027 ders ücretlerini, peşin ve taksitli paketleri karşılaştırın."><meta name="robots" content="noindex, nofollow"><link rel="canonical" href="https://www.hurralingo.com/ucretler/"><meta property="og:type" content="website"><meta property="og:title" content="Hurra Lingo Ders Ücretleri 2027"><meta property="og:description" content="Ders ücretinizi hesaplayın; paketleri ve ödeme seçeneklerini karşılaştırın."><meta property="og:url" content="https://www.hurralingo.com/ucretler/"><meta property="og:image" content="https://www.hurralingo.com/og.jpg"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/img/favicon.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Figtree:wght@400;500;600;700&family=Poetsen+One&display=swap"><style>${styles}</style><link rel="stylesheet" href="/desktop-density.css"><link rel="stylesheet" href="/localization.css"><link rel="stylesheet" href="/assets/pricing.css"></head><body class="fees-page" id="top">${icons}<a class="fee-skip" href="#main">İçeriğe geç</a>${header}<main id="main" class="fee-main wrap">${content}</main>${footer}<script src="/assets/pricing-data.js" defer></script><script src="/assets/pricing-engine.js" defer></script><script src="/assets/pricing-tr.js" defer></script><script src="/assets/pricing-ui.js" defer></script></body></html>`);
console.log('Generated TRY pricing data and /ucretler/index.html from all three workbook sheets.');
