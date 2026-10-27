// Reviewed October 2026 article and homepage excerpt, shared by every locale build.
const data={...require('../content/blog/republic-day.json'),...require('../content/blog/republic-day-translations.json')};
const slug='29-ekim-cumhuriyet-bayrami-egitim-ozgurluk-ve-yeni-diller-ogrenme-ruhu';
const route='/blog/'+slug+'/';
const image='img/blog/29-ekim-cumhuriyet-bayrami.webp';
const labels={tr:'Devamını okuyun',en:'Read more',de:'Weiterlesen',az:'Davamını oxuyun',fr:'Lire la suite'};
const alts={tr:'Atatürk, Türk bayrağı ve çocuklarla 29 Ekim Cumhuriyet Bayramı kutlama görseli',en:'29 October Republic Day celebration with Atatürk, the Turkish flag and children',de:'Motiv zum Tag der Republik am 29. Oktober mit Atatürk, der türkischen Flagge und Kindern',az:'Atatürk, Türkiyə bayrağı və uşaqlarla 29 Oktyabr Respublika Günü təbrik təsviri',fr:'Visuel de la fête de la République du 29 octobre avec Atatürk, le drapeau turc et des enfants'};
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function title(lang){const text=data[lang][0],end=text.indexOf(':');return `<span class="republic-title-accent">${esc(text.slice(0,end))}</span>${esc(text.slice(end))}`;}
function translate(text,lang,source='tr'){
 const index=data[source]?.findIndex(s=>s.replace(/\s+/g,' ').trim()===text.replace(/\s+/g,' ').trim());if(index>=0)return data[lang][index];
 if(text===labels[source])return labels[lang];if(text===alts[source])return alts[lang];
}
function body(lang){return data[lang].slice(1).map((text,i)=>({tag:[3,7,15,24].includes(i+1)?'h2':(i+1>=10&&i+1<=13)||(i+1>=18&&i+1<=22)?'li':'p',children:[{text}]})).reduce((nodes,node)=>{if(node.tag==='li'){if(nodes.at(-1)?.tag!=='ul')nodes.push({tag:'ul',children:[]});nodes.at(-1).children.push(node);}else nodes.push(node);return nodes;},[]);}
function update(posts){const p=posts.find(p=>p.language==='tr'&&p.slug===slug);if(!p)throw Error('Missing Republic Day article');Object.assign(p,{title:data.tr[0],summary:data.tr[1],date:'2026-10-27T09:00:00+03:00',author:'Hurra Lingo',image,imageAlt:alts.tr,paragraphs:data.tr.slice(1),body:body('tr')});delete p.imageSource;return posts;}
function feature(){return `<section class="republic-feature" aria-labelledby="republic-title"><div class="wrap republic-feature-grid"><div class="republic-feature-copy"><h2 id="republic-title">${title('tr')}</h2><p>${esc(data.tr[1])}</p><p>${esc(data.tr[2])}</p><a class="btn btn-dark" href="${route}">${labels.tr} <span aria-hidden="true">→</span></a></div><a class="republic-feature-image" href="${route}" aria-labelledby="republic-title"><img src="/${image}" alt="${alts.tr}" width="1080" height="1350" fetchpriority="high" decoding="async"></a></div></section>`;}
module.exports={data,slug,route,image,labels,alts,translate,body,update,feature,title};
