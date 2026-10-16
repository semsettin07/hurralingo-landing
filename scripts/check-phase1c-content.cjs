const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),cp=require('node:child_process'),c=require('cheerio');
const site=require('./site-tr.cjs');
(async()=>{
 const refs=c.load(site.read('referanslarimiz/index.html')),model=c.load(site.read('egitimmodelimiz/index.html'));
 assert.equal(refs('#yorumlar figure.rv').length,3);assert.equal(model('#sorular .reel-btn').length,6);
 assert.equal(refs('#yorumlar blockquote').text(),site.original('#yorumlar blockquote').text());
 const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
 const campaignMedia=['docs/hurra-lingo-emniyet-mensuplari-kampanya.pdf','img/emniyet-kampanya-masaustu.png','img/emniyet-kampanya-mobil.png'].map(file=>{
  const sha256=hash(fs.readFileSync(file));
  assert.equal(sha256,hash(cp.execFileSync('git',['show','1adc768:'+file],{maxBuffer:20e6})));
  return{file,sha256,unchanged:true};
 });
 const videos=[...new Set(model('#sorular [data-video]').map((i,e)=>model(e).attr('data-video')).get())];assert.equal(videos.length,6);
 const videoResponses=[];for(const file of videos){const r=await fetch('http://127.0.0.1:8021'+file,{method:'HEAD'});assert.equal(r.status,200);videoResponses.push({file,status:r.status});}
 const contacts=c.load(site.read('iletisim/index.html'));
 const contactLinks=[...new Set(contacts('a[href]').map((i,e)=>contacts(e).attr('href')).get().filter(h=>/^(tel:|mailto:|https:\/\/wa.me)/.test(h)))];
 let whatsapp;try{const r=await fetch('https://wa.me/905395167070',{signal:AbortSignal.timeout(15000)});whatsapp={status:r.status,url:r.url};}catch(e){whatsapp={error:e.message};}
 const result={pass:true,testimonials:3,testimonialTextUnchanged:true,questionVideos:6,videoResponses,campaignMedia,contactLinks,whatsapp};
 fs.writeFileSync('docs/phase-1c/content-preservation.json',JSON.stringify(result,null,2)+'\n');console.log(result);
})().catch(e=>{console.error(e);process.exitCode=1;});
