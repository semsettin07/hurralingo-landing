// Explicit translation preparation. The normal site build never accesses the network.
const fs=require('node:fs'),path=require('node:path'),c=require('cheerio');
const {encode,decode,blocks}=require('./french-blocks.cjs');
const inventory=require('../docs/french/inventory.json'),config=require('./french-content.cjs');
const terms=['Hurra Lingo','Hurra Türkiye','Bett UK 2026','Bett UK','Bett','Love Languages','CEFR',...require('./site-tr.cjs').teachers.map(t=>t[0]),...require('./french-segments.cjs').examples,...require('./french-segments.cjs').foreignExamples,'How are you?','Panic!','Hello!','Hello','Hallo!'];
const file='content/i18n/fr-blocks.json',data=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{};
const corpus=new Map();for(const group of inventory.groups.filter(g=>g.kind==='article')){const $=c.load(fs.readFileSync('.'+group.sourceRoute+'index.html','utf8'));for(const node of blocks($)){const item=encode($,node);if(!corpus.has(item.key))corpus.set(item.key,{...item,route:group.sourceRoute})}}
function shield(text){const saved=[];for(const term of [...terms,...(text.match(/[\u0400-\u04FF]+(?:[ \t]+[\u0400-\u04FF]+)*[!?]?/g)||[])])if(text.includes(term)){const token='ZXQSAFE'+String(saved.length).padStart(4,'0')+'QXZ';saved.push({token,term});text=text.replaceAll(term,token)}return {text,saved}}
async function request(text){for(let attempt=0;attempt<4;attempt++)try{const url=new URL('https://translate.googleapis.com/translate_a/single');for(const [key,value]of Object.entries({client:'gtx',sl:'auto',tl:'fr',dt:'t',q:text}))url.searchParams.set(key,value);const response=await fetch(url,{signal:AbortSignal.timeout(35000)});if(!response.ok)throw Error('Translation HTTP '+response.status);return(await response.json())[0].map(v=>v[0]||'').join('')}catch(error){if(attempt===3)throw error;await new Promise(r=>setTimeout(r,(attempt+1)*1000))}}
function restore(text,values){for(const {token,term}of values)text=text.replaceAll(token,term);if(/ZXQ\s*SAFE/.test(text))throw Error('Protected example/brand changed');return text.trim()}
const pending=[...corpus.values()].filter(item=>!data[item.key]),batches=[],issues=[];let batch=[],length=0;
for(const item of pending){if(batch.length&&length+item.text.length>3000){batches.push(batch);batch=[];length=0}batch.push(item);length+=item.text.length+25}if(batch.length)batches.push(batch);
console.log({completeArticleBlocks:corpus.size,pending:pending.length,batches:batches.length});
(async()=>{let next=0,done=0;await Promise.all(Array.from({length:2},async()=>{while(next<batches.length){const group=batches[next++],protectedGroup=group.map(item=>shield(item.text)),input=protectedGroup.map((item,i)=>`[HL${String(i).padStart(5,'0')}]\n${item.text}`).join('\n');
 const output=await request(input),markers=[...output.matchAll(/\[\s*HL\s*(\d{5})\s*\]/gi)];
 for(let i=0;i<group.length;i++){
  let translated=markers.length===group.length&&markers.every((m,i)=>Number(m[1])===i)?output.slice(markers[i].index+markers[i][0].length,markers[i+1]?.index??output.length):await request(protectedGroup[i].text);
  translated=restore(translated,protectedGroup[i].saved);
  try{decode(translated,group[i].markup)}catch(_){
   translated=restore(await request(protectedGroup[i].text),protectedGroup[i].saved);
   try{decode(translated,group[i].markup)}catch(_){issues.push({key:group[i].key,source:group[i].text,fr:translated,markup:group[i].markup,route:group[i].route});continue;}
  }
  data[group[i].key]={source:group[i].text,fr:translated};
 }
 fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');done++;if(done%10===0||done===batches.length)console.log('Full French article blocks: '+done+'/'+batches.length);
 }}));
 fs.writeFileSync('docs/french/translation-block-issues.json',JSON.stringify(issues,null,2)+'\n');
 if(issues.length)throw Error('Manual French inline-markup review required for '+issues.length+' blocks');
})().catch(error=>{console.error(error.message);process.exitCode=1});
