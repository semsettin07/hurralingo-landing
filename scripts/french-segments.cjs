const fs=require('node:fs'),path=require('node:path'),c=require('cheerio');
const root=path.resolve(__dirname,'..');
const teachers=require('./site-tr.cjs').teachers.map(t=>t[0]);
const preserve=new Set([...teachers,'Hurra Lingo','HURRA LINGO','Hurra Türkiye','Hurra Education International Ltd','HURRA EDUCATION INTERNATIONAL LTD','TR','EN','DE','AZ','FR','Türkçe','English','Deutsch','Azərbaycanca','Français','A1','A2','B1','B2','C1','C2','CEFR','PDF','WhatsApp','Instagram','Facebook','YouTube','TikTok','LinkedIn','Şebnem E.','Merve A.','Fatoş A.','Bengü Kesen','Mustafa Hakan Yanar','Hurra Lingo Editorial Team','Hurra Lingo Redaktion','Hurra Lingo Redaksiyası','Hurra Lingo Editör Ekibi']);
const examples=['Happy Father’s Day, Dad!','I love you, Dad.','Dear Dad,','Happy Father’s Day!','I love you.','You are my hero.','Thank you for everything.','You are the best dad.','You make me smile.','I love you so much.'];
const foreignExamples=['Alles Gute zum Vatertag, Papa!','Ich liebe dich, Papa.','¡Feliz Día del Padre, papá!','Bonne fête papa !','Je t’aime papa.'];
function shouldTranslate(text,language='en'){
 return !!text&&/\p{L}/u.test(text)&&!preserve.has(text)&&!/^https?:|^[\w.+-]+@[\w.-]+$/.test(text)&&!examples.includes(text)&&!(language==='en'&&foreignExamples.includes(text));
}
const attrs=['alt','title','aria-label','placeholder','data-count-label'];
function collect(markup,language){const $=c.load(markup),found=new Set();function visit(node){
 if(['script','style','svg'].includes(node.name)||node.attribs?.['data-fr-ready']!==undefined)return;
 if(node.type==='text'){const value=node.data.trim();if(shouldTranslate(value,language))found.add(value)}
 for(const attr of attrs){const value=node.attribs?.[attr]?.trim();if(shouldTranslate(value,language))found.add(value)}
 if(node.name==='meta'&&/^(description|og:title|og:description|twitter:title|twitter:description)$/.test(node.attribs?.name||node.attribs?.property)){const value=node.attribs.content;if(shouldTranslate(value,language))found.add(value)}
 for(const child of node.children||[])visit(child);
}visit($.root()[0]);return [...found]}
function legalBlocks(text){
 const output=[];let current='';function flush(){if(current.trim())output.push(current.trim());current=''}
 for(const raw of text.split('\n')){const line=raw.trim();if(!line)continue;
 const start=/^(?:\d+(?:\.\d+)*\.?\s|[•]\s|Effective Date:|Previous Versions:|HURRA EDUCATION|Hurra Education|Purpose Legal Basis|Email:|This Privacy Policy|These Terms)/.test(line);
 if(start||/[.;:!?]$/.test(current))flush();
 current+=(current?' ':'')+line;
 }flush();return output;
}
module.exports={collect,shouldTranslate,attrs,preserve,examples,foreignExamples,legalBlocks};
