const fs=require('node:fs'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const cheerio=require('cheerio');
const data=require('../assets/pricing-data.js'),api=require('../assets/pricing-engine.js');
const source=JSON.parse(fs.readFileSync('docs/pricing-2027/workbook-cells.json','utf8').replace(/^\uFEFF/,''));
const sheets=source.sheets.map(s=>Object.fromEntries(s.cells.map(c=>[c.cell,c])));
// Independent, restricted Excel formula parser: no eval, and no browser calculation code.
function evaluateFormula(formula,sheetIndex) {
 const tokens=formula.match(/'[^']+'!\$?[A-Z]+\$?\d+|\$?[A-Z]+\$?\d+|ROUND|\d+(?:\.\d+)?|[()+*,\-]/g)||[];
 assert.equal(tokens.join('').replace(/\s/g,''),formula.replace(/\s/g,''),'Unsupported Excel formula '+formula);
 let at=0;
 const take=expected=>{assert.equal(tokens[at++],expected);};
 function atom(){const token=tokens[at++];if(token==='('){const v=sum();take(')');return v;}if(token==='ROUND'){take('(');const value=sum();take(',');const digits=sum();take(')');const scale=10**digits;return Math.sign(value)*Math.floor(Math.abs(value)*scale+0.5000000001)/scale;}if(/^\d/.test(token))return Number(token);
  let index=sheetIndex,ref=token;if(token.startsWith("'")){const split=token.indexOf("'!");index=source.sheets.findIndex(s=>s.name===token.slice(1,split));ref=token.slice(split+2);}return evaluateCell(index,ref.replace(/\$/g,''));}
 function product(){let v=atom();while(tokens[at]==='*'){at++;v*=atom();}return v;}
 function sum(){let v=product();while(['+','-'].includes(tokens[at])){const op=tokens[at++],n=product();v=op==='+'?v+n:v-n;}return v;}
 const result=sum();assert.equal(at,tokens.length);return result;
}
const cache=new Map();
function evaluateCell(index,ref){const key=index+':'+ref;if(cache.has(key))return cache.get(key);const cell=sheets[index][ref];assert.ok(cell,key);const v=cell.formula?evaluateFormula(cell.formula,index):Number(cell.value);cache.set(key,v);return v;}
let formulas=0;
for(const [i,sheet] of sheets.entries())for(const c of Object.values(sheet))if(c.formula){assert.equal(evaluateCell(i,c.cell),Number(c.value),`Formula/cache ${source.sheets[i].name}!${c.cell}`);formulas++;}
const verified=[];
for(const [modelIndex,model] of ['private','mini','group'].entries())for(const teacher of ['turkish','native'])for(const membership of ['monthly','six','annual'])for(const frequency of [1,2]){
 const cells=sheets[modelIndex], native=teacher==='native';
 const col=membership==='annual'?(native?(frequency===1?'L':'M'):(frequency===1?'E':'F')):(native?(frequency===1?'I':'J'):(frequency===1?'B':'C'));
 const baseCol=native?'I':'B',priceCol=membership==='annual'?(native?'L':'E'):baseCol;
 const num=ref=>Number(cells[ref].value);
 for(const payment of membership==='monthly'?['monthly']:['cash','installment']){
  const s={model,teacher,membership,frequency,payment},r=api.calculate(data,s),monthly=membership==='monthly';
  const expected={base:num(baseCol+'4'),lesson:num(priceCol+(monthly?'4':'13')),totalLessons:num(col+(monthly?'6':'19')),monthlyLessons:num((native?(frequency===1?'I':'J'):(frequency===1?'B':'C'))+'6'),monthlyPayment:num(col+(monthly?'7':'16'))};
  for(const [key,value]of Object.entries(expected))assert.equal(r[key],value,`${JSON.stringify(s)} ${key}`);
  assert.equal(r.selectedLesson,num(priceCol+(payment==='cash'?'23':monthly?'4':'13')));
  assert.equal(r.selectedTotal,num(col+(payment==='cash'?'24':monthly?'7':'20')));
  if(!monthly){assert.equal(r.cashTotal,num(col+'24'));assert.equal(r.installmentTotal,num(col+'20'));assert.equal(r.advantage,num(col+'25'));assert.equal(r.cashLesson,num(priceCol+'23'));assert.equal(r.discount,num(priceCol+'12'));assert.equal(r.cashDiscount,num(priceCol+'22'));assert.equal(r.packageSaving,r.base*r.totalLessons-r.selectedTotal);assert.equal(r.installmentCount,membership==='six'?6:12);assert.equal(r.installmentAmount,num(col+'16'));assert.equal(r.installmentAmount*r.installmentCount,r.installmentTotal);}
  else {assert.equal(r.cashTotal,null);assert.equal(r.installmentTotal,null);assert.equal(r.cashDiscount,null);assert.equal(r.installmentCount,null);assert.equal(r.installmentAmount,null);}
  verified.push({...s,source:source.sheets[modelIndex].name+'!'+col+(monthly?'7':payment==='cash'?'24':'20'),expectedLesson:num(priceCol+(payment==='cash'?'23':monthly?'4':'13')),actualLesson:r.selectedLesson,lessons:r.totalLessons,expectedTotal:num(col+(payment==='cash'?'24':monthly?'7':'20')),actualTotal:r.selectedTotal,monthlyPayment:r.monthlyPayment,installmentTotal:r.installmentTotal,cashTotal:r.cashTotal,installmentCount:r.installmentCount,installmentAmount:r.installmentAmount,advantage:r.advantage,result:'PASS'});
 }
}
for(const change of [{model:'invalid'},{teacher:'unknown'},{membership:'ten'},{frequency:3},{payment:'cash',membership:'monthly'},{payment:'monthly',membership:'six'}])assert.throws(()=>api.calculate(data,{model:'private',teacher:'turkish',membership:'six',frequency:1,payment:'cash',...change}));
assert.equal(api.round(549.5),550);assert.equal(api.round(697.5),698);assert.equal(api.round(-1.5),-2);
const home=fs.readFileSync('index.html','utf8'),page=fs.readFileSync('ucretler/index.html','utf8'),$=cheerio.load(page),h=cheerio.load(home);
assert.equal(h('#fiyatlar .plan').length,3);assert.ok(h('#fiyatlar a[href="/ucretler/"]').text().includes('Ders Ücretinizi Hesaplayın'));
assert.equal(h('.header a[href="/ucretler/"]').length,1);assert.equal(h('#drawer a[href="/ucretler/"]').length,1);assert.equal(h('footer a[href="/ucretler/"]').length,1);
assert.equal(h('#fiyatlar [data-pay]').length,0);assert.ok(!home.includes('24.792'));assert.ok(!home.includes('28.752'));
assert.equal($('h1').text(),'Hurra Lingo Ders Ücretleri');assert.equal($('.fee-model').length,3);assert.equal($('.fee-cta a').attr('target'),'_blank');
for(const file of ['en.html','de.html','az.html'])assert.equal(fs.readFileSync(file,'utf8'),execFileSync('git',['show','HEAD:'+file],{encoding:'utf8',maxBuffer:2e6}),file+' unchanged');
const ids=new Set();$('[id]').each((_,node)=>{const id=$(node).attr('id');assert.ok(!ids.has(id),'Duplicate id '+id);ids.add(id);});
$('[src],link[href],a[href]').each((_,node)=>{const url=$(node).attr('src')||$(node).attr('href');if(url.startsWith('/')&&!url.startsWith('//')){const file=url.split('#')[0].split('?')[0]||'/';assert.ok(fs.existsSync('.'+file),'Missing local target '+url);}else if(url.startsWith('#'))assert.ok(ids.has(url.slice(1)),'Missing anchor '+url);});
fs.writeFileSync('docs/pricing-2027/calculation-verification.json',JSON.stringify({formulaCount:formulas,selectionCount:verified.length,verified},null,2)+'\n');
console.log(`PASS: ${formulas} independently evaluated Excel formulas; ${verified.length} selections match Excel cells; invalid selections, rounding, navigation, assets and preserved languages checked.`);
