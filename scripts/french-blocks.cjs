// Preserve inline markup while translating complete sentences/paragraphs in context.
const c=require('cheerio'),crypto=require('node:crypto');
const blockTags='p,h2,h3,h4,h5,h6,li,td,th,blockquote';
const esc=s=>s.replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
function encode($,node){const markup=[];function visit(n){
 if(n.type==='text')return n.data;
 if(n.type!=='tag')return '';
 const html=$(n).prop('outerHTML'),end=html.indexOf('>')+1,opening=html.slice(0,end);
 const index=markup.push(opening)-1;let result=' [FT'+String(index).padStart(5,'0')+'] ';
 if(!['img','br','hr','wbr','input'].includes(n.name)){
  result+=(n.children||[]).map(visit).join('');
  const close=markup.push('</'+n.name+'>')-1;result+=' [FT'+String(close).padStart(5,'0')+'] ';
 }return result;
 }
 const text=(node.children||[]).map(visit).join('').replace(/\s+/g,' ').trim();
 return {text,markup,key:crypto.createHash('sha256').update(text).digest('hex')};
}
function decode(text,markup){
 const ids=[...text.matchAll(/\[\s*FT\s*(\d{5})\s*\]/gi)].map(m=>Number(m[1]));
 if(ids.length!==markup.length||ids.some((id,index)=>id!==index))throw Error('French inline markup markers changed order');
 return esc(text).replace(/\[\s*FT\s*(\d{5})\s*\]/gi,(_,index)=>markup[Number(index)]).replace(/\s+([,.])/g,'$1');
}
function blocks($){return $('.blog-prose').find(blockTags).toArray().filter(node=>!$(node).find(blockTags).length&&/\p{L}/u.test($(node).text()))}
module.exports={encode,decode,blocks};
