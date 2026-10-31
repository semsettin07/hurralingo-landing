// Blog rules shared by the TR, EN/DE/AZ and FR builds.
const teamAuthor={tr:'Hurra Lingo Ekibi',en:'Hurra Lingo Team',de:'Hurra-Lingo-Team',az:'Hurra Lingo Komandası',fr:'Équipe Hurra Lingo'};
// The WordPress account and the bare brand name are not real authors.
const placeholders=new Set(['hurraturkiyewp','Hurra Lingo']);
const authorName=(author,lang)=>!author||placeholders.has(author)?teamAuthor[lang]:author;
// Retired domains: a string is the local route, null drops the link, undefined keeps it.
function retiredLink(url){
 if(/^(www\.)?hurraturkiye\.com$/.test(url.hostname))return '/derslerimiz/';
 if(url.hostname==='hurraegitim.com'){
  if(url.pathname==='/')return '/';
  // These uploads are gone from the old site; the images themselves are served locally.
  if(url.pathname.includes('/wp-content/'))return null;
 }
}
module.exports={authorName,retiredLink};
