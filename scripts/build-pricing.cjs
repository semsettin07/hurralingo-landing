const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root,p),'utf8').replace(/^\uFEFF/,'');
const write = (p,s) => {fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});const target=path.join(root,p); if(fs.existsSync(target) && fs.readFileSync(target,'utf8').replace(/\r\n/g,'\n')===s.replace(/\r\n/g,'\n')) return; fs.writeFileSync(target,s);};
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
// Keep the calculator content and data generation; use the shared Turkish shell.
const site=require('./site-tr.cjs');
const cards=[['private','Özel Ders (Bire Bir)','1 kişi',null,'Hedeflerinize göre kişisel bir öğrenme planı.'],['mini','Mini Grup Dersi','2–4 kişi','30 dk','Küçük grupta daha çok konuşma fırsatı.'],['group','Grup Dersi','5–8 kişi','30 dk','Birlikte konuşun, birlikte ilerleyin.']].map(([model,name,people,duration,desc])=>`<article class="fee-model" data-model="${model}"><div class="fee-model-top"><span class="stamp">${people}${duration?' · '+duration:''}</span><h2>${name}</h2><p>${desc}</p></div><p class="fee-start"><strong data-start-price>—</strong><span> / ders</span></p><p class="fee-condition">Türk öğretmen · yıllık üyelik · peşin ödeme<br>KDV hariç</p><button class="btn btn-line" type="button" aria-pressed="false">Bu modeli seç</button></article>`).join('');
const content=read('content/pricing-page.html').replace('<!-- MODEL_CARDS -->',cards);
write('ucretler/index.html',site.shell('/ucretler/','Hurra Lingo Ders Ücretleri 2027','Ders modelinizi, öğretmeninizi ve üyeliğinizi seçin; mevcut 2027 ders ücretleri ve ödeme seçeneklerini karşılaştırın.',content,{bodyClass:'fees-page',mainClass:'fee-main wrap',styles:['assets/pricing.css'],scripts:['assets/pricing-data.js','assets/pricing-engine.js','assets/pricing-tr.js','assets/pricing-ui.js']}));
console.log('Generated /ucretler/ with the original calculator and shared TR shell.');