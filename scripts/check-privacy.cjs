const fs=require('node:fs'),assert=require('node:assert/strict'),c=require('cheerio');
const read=file=>fs.readFileSync(file,'utf8');
const route='/en/privacy-policy/';
const $=c.load(read('en/privacy-policy/index.html'));
assert.equal($('html').attr('lang'),'en');
assert.equal($('h1').length,1);
assert.equal($('.privacy-policy h2').length,18);
assert.equal($('link[rel=canonical]').attr('href'),'https://www.hurralingo.com'+route);
const norm=text=>text.replace(/• /g,'').replace(/\s+/g,' ').trim();
// Check every paragraph and list item against the supplied policy in order.
const source=read('content/site/privacy-policy-en.txt').trim().split(/\r?\n\s*\r?\n/).map(norm);
// HTML list items and address line breaks need explicit separators for comparison.
$('.privacy-policy br').replaceWith(' ');
$('.privacy-policy li').append(' ');
assert.deepEqual($('.privacy-policy').children().map((i,node)=>norm($(node).text())).get(),source);
const labels={tr:'Gizlilik Politikası (İngilizce)',en:'Privacy Policy',de:'Datenschutzerklärung (Englisch)',az:'Məxfilik siyasəti (ingiliscə)',fr:'Politique de confidentialité (anglais)'};
let checked=0;
for(const page of JSON.parse(read('content/i18n/canonical-all.json'))){
 const doc=c.load(read(page.slice(1)+'index.html')),lang=doc('html').attr('lang');
 const link=doc(`footer a[href="${route}"]`);
 assert.equal(link.length,1,page);assert.equal(link.text(),labels[lang],page);
 assert.equal(link.attr('hreflang'),'en');
 assert.equal(doc('footer a[href*="Hurra-Lingo-Privacy-Policy"],footer a[href="/fr/confidentialite/"]').length,0,page);
 checked++;
}
console.log(`PASS: supplied policy preserved in full; 18 sections; ${checked} localized footers point to the English HTML policy.`);
