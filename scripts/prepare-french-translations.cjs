// Explicit preparation only. Builds use the checked-in French dictionary offline.
const fs=require('node:fs'),path=require('node:path'),c=require('cheerio');
const {collect,legalBlocks,examples,foreignExamples}=require('./french-segments.cjs');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const inventory=JSON.parse(read('docs/french/inventory.json')),catalog={tr:new Set(),en:new Set(),de:new Set(),az:new Set()};
for(const group of inventory.groups){const html=read(group.sourceRoute.slice(1)+'index.html'),$=c.load(html);const markup=group.kind==='article'?$('main').prop('outerHTML'):html;for(const text of collect(markup,group.sourceLanguage))catalog[group.sourceLanguage].add(text)}
for(const doc of JSON.parse(read('content/i18n/french-legal-sources.json')))for(const page of doc.pages)for(const block of legalBlocks(page.text))catalog.en.add(block);
for(const text of ['Close menu','Open menu','Play video','Pause video','Copied','Selected','Number copied to clipboard.','Number selected; use Ctrl+C or Cmd+C to copy.','Copy','Save','Free Trial Lesson'])catalog.en.add(text);
const source=Object.fromEntries(Object.entries(catalog).map(([l,s])=>[l,[...s]]));
fs.writeFileSync(path.join(root,'content/i18n/french-catalog.json'),JSON.stringify(source,null,2)+'\n');
console.log('French catalog',Object.fromEntries(Object.entries(source).map(([l,s])=>[l,{segments:s.length,characters:s.join('').length}])));
if(!process.argv.includes('--translate'))return;
const file=path.join(root,'content/i18n/fr.json'),data=fs.existsSync(file)?JSON.parse(read('content/i18n/fr.json')):{};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const protectedTerms=['HURRA EDUCATION INTERNATIONAL LTD','Hurra Education International Ltd','Hurra Lingo','Hurra Türkiye',...examples,...foreignExamples];
function shield(text){const values=[];for(const term of protectedTerms)if(text.includes(term)){const token='ZXQPROTECT'+String(values.length).padStart(3,'0')+'QXZ';values.push({token,term});text=text.replaceAll(term,token)}return {text,values}}
async function request(text,language){for(let attempt=0;attempt<4;attempt++)try{
 const url=new URL('https://translate.googleapis.com/translate_a/single');for(const [k,v]of Object.entries({client:'gtx',sl:language,tl:'fr',dt:'t',q:text}))url.searchParams.set(k,v);
 const response=await fetch(url,{signal:AbortSignal.timeout(35000)});if(!response.ok)throw Error('Translation HTTP '+response.status);const json=await response.json();return json[0].map(p=>p[0]||'').join('');
 }catch(error){if(attempt===3)throw error;await sleep(1000*(attempt+1))}}
function restore(text,values){for(const {token,term}of values)text=text.replaceAll(token,term);if(/ZXQ\s*PROTECT/i.test(text))throw Error('A protected term was altered');return text.replace(/Hurrah Lingo|Hurray Lingo|Hurra Linqo/g,'Hurra Lingo').trim()}
(async()=>{for(const [language,strings]of Object.entries(source)){
 data[language]||={};const pending=strings.filter(s=>!data[language][s]),batches=[];let batch=[],length=0;
 for(const text of pending){if(batch.length&&length+text.length>3200){batches.push(batch);batch=[];length=0}batch.push(text);length+=text.length+25}if(batch.length)batches.push(batch);
 let next=0,done=0;await Promise.all(Array.from({length:2},async()=>{while(next<batches.length){const group=batches[next++],encoded=group.map(shield),input=encoded.map((v,i)=>`[HL${String(i).padStart(5,'0')}]\n${v.text}`).join('\n');const output=await request(input,language),markers=[...output.matchAll(/\[\s*HL\s*(\d{5})\s*\]/gi)];
  if(markers.length===group.length&&markers.every((m,i)=>Number(m[1])===i))for(let i=0;i<markers.length;i++)data[language][group[i]]=restore(output.slice(markers[i].index+markers[i][0].length,markers[i+1]?.index??output.length),encoded[i].values);
  else for(let i=0;i<group.length;i++)data[language][group[i]]=restore(await request(encoded[i].text,language),encoded[i].values);
  fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');done++;if(done%10===0||done===batches.length)console.log(language+' → fr: '+done+'/'+batches.length);await sleep(150);
 }}));
}fs.writeFileSync(path.join(root,'docs/french/translation-preparation.json'),JSON.stringify({preparedAt:new Date().toISOString(),provider:'Google Translate first draft with protected names and pedagogical examples',offlineBuild:true,review:'French UI vocabulary, titles, metadata and editorial corrections are maintained in french-content.cjs; legal translation is not certified.'},null,2)+'\n')})().catch(error=>{console.error(error.message);process.exitCode=1});
