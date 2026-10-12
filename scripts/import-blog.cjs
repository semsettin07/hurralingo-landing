// Read-only import of the four public WordPress blogs requested by the owner.
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const cheerio=require('cheerio');
const sharp=require('sharp');
const root=path.resolve(__dirname,'..');
const sources={en:'https://hurraegitim.com/',tr:'https://hurraegitim.com/tr/',de:'https://hurraegitim.com/de/',az:'https://hurraegitim.com/az/'};
const write=(p,data)=>{const target=path.join(root,p);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,data);};
const text=html=>cheerio.load(html||'',null,false).text().replace(/\s+/g,' ').trim();
const assets=new Map(),metadata=[],records=[];
const priorReport=path.join(root,'docs/blog-source/import-report.json');
const priorImages=fs.existsSync(priorReport)?JSON.parse(fs.readFileSync(priorReport,'utf8')).images||[]:[];
const slug=s=>decodeURIComponent(s).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
async function request(url){let last;for(let i=0;i<3;i++)try{const r=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error(r.status+' '+url);return r;}catch(e){last=e;}throw last;}
function addImage(url,base){if(!url)return null;const source=new URL(url,base).href;if(!/^https:\/\//.test(source))return null;if(!assets.has(source)){assets.set(source,{source,local:'img/blog/'+crypto.createHash('sha256').update(source).digest('hex').slice(0,16)+'.webp'});}return source;}
function nodes(input,base){
  const doc=cheerio.load(input||'',null,false);
  // WordPress TOC widgets duplicate headings and rely on source-only scripts.
  doc('script,style,iframe,object,embed,form,button,svg,nav,.ez-toc-container,#ez-toc-container').remove();
  const allowed=new Set(['p','h2','h3','h4','h5','h6','strong','b','em','i','ul','ol','li','blockquote','br','hr','figure','figcaption','table','thead','tbody','tr','th','td','a','img']);
  function walk(n){
    if(n.type==='text')return {text:n.data};
    if(!n.name)return null;
    const tag=n.name==='h1'?'h2':n.name;
    const children=(n.children||[]).map(walk).flat().filter(Boolean);
    if(!allowed.has(tag))return children;
    const out={tag,children};
    if(tag==='img'){const image=addImage(n.attribs.src||n.attribs['data-src'],base);if(!image)return null;out.imageSource=image;out.alt=n.attribs.alt||'';}
    if(tag==='a'&&n.attribs.href){try{const href=new URL(n.attribs.href,base);if(['https:','http:','mailto:','tel:'].includes(href.protocol))out.href=href.href;}catch{}}
    return out;
  }
  return doc.root().contents().toArray().map(walk).flat().filter(Boolean);
}
(async()=>{
  await Promise.all(Object.entries(sources).map(async([language,base])=>{
    const archive=await request(base+'blog/');write('docs/blog-source/'+language+'-archive.html',await archive.text());
    const all=[];let pages=1,total=0;
    for(let page=1;page<=pages;page++){
      const url=base+'wp-json/wp/v2/posts?per_page=100&_embed&page='+page;
      const res=await request(url);pages=Number(res.headers.get('x-wp-totalpages')||1);total=Number(res.headers.get('x-wp-total')||0);
      const data=await res.json();if(!Array.isArray(data))throw Error('Invalid REST response '+url);all.push(...data);
    }
    if(all.length!==total)throw Error('Incomplete archive '+language);
    write('docs/blog-source/'+language+'-posts.json',JSON.stringify(all,null,2));
    metadata.push({language,archive:base+'blog/',endpoint:base+'wp-json/wp/v2/posts',status:200,total,pages});
    for(const p of all){
      const media=p._embedded?.['wp:featuredmedia']?.[0];
      const title=text(p.title.rendered),body=nodes(p.content.rendered,p.link);
      const doc=cheerio.load(p.content.rendered,null,false);doc('script,style,nav,.ez-toc-container,#ez-toc-container').remove();
      const paragraphs=doc('p,li,h2,h3,h4').toArray().map(n=>text(doc.html(n))).filter(Boolean);
      const feature=media?.source_url||doc('img').first().attr('src');
      records.push({id:p.id,language,contentLanguage:language==='az'?'en':language,slug:slug(p.slug)||'post-'+p.id,title,summary:text(p.excerpt.rendered)||paragraphs[0]||title,date:p.date,source:p.link,categories:(p._embedded?.['wp:term']||[]).flat().filter(t=>t.taxonomy==='category').map(t=>text(t.name)),author:p._embedded?.author?.[0]?.name||'',imageSource:addImage(feature,p.link),imageAlt:media?.alt_text||'',paragraphs,body});
    }
    console.log(language+': '+all.length+' source articles');
  }));
  const list=[...assets.values()];let next=0;
  await Promise.all(Array.from({length:5},async()=>{while(next<list.length){const a=list[next++];const r=await request(a.source);if(!r.headers.get('content-type')?.startsWith('image/'))throw Error('Not an image '+a.source);const original=Buffer.from(await r.arrayBuffer());const {data,info}=await sharp(original).rotate().resize({width:1600,withoutEnlargement:true}).webp({quality:82}).toBuffer({resolveWithObject:true});write(a.local,data);a.sourceBytes=original.length;a.bytes=data.length;a.width=info.width;a.height=info.height;a.status=r.status;}}));
  const local=source=>assets.get(source)?.local;
  function update(ns){for(const n of ns){if(n.imageSource){n.src=local(n.imageSource);delete n.imageSource;}if(n.children)update(n.children);}}
  for(const p of records){p.image=local(p.imageSource)||'';update(p.body);}
  records.sort((a,b)=>a.language.localeCompare(b.language)||b.date.localeCompare(a.date));
  write('content/blog/posts.json',JSON.stringify(records,null,2)+'\n');
  write('docs/blog-source/import-report.json',JSON.stringify({retrievedAt:new Date().toISOString(),sources:metadata.sort((a,b)=>a.language.localeCompare(b.language)),total:records.length,images:list,notes:['AZ source articles are in English; preserved verbatim with English content language.','Original publication dates and historical campaign text are preserved.']},null,2)+'\n');
  // Remove only importer-owned assets superseded by the successful import.
  const current=new Set(list.map(a=>a.local)),assetRoot=path.resolve(root,'img/blog')+path.sep;
  for(const a of priorImages)if(!current.has(a.local)){const target=path.resolve(root,a.local);if(!target.startsWith(assetRoot)||!/^img\/blog\/[a-f0-9]{16}\.(?:jpe?g|png|webp|gif|avif)$/.test(a.local))throw Error('Unsafe stale asset path');fs.rmSync(target,{force:true});}
  console.log('Imported '+records.length+' articles and '+list.length+' local images.');
})().catch(e=>{console.error(e);process.exitCode=1;});
