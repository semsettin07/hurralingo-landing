const fs=require('node:fs'),assert=require('node:assert/strict'),c=require('cheerio');
const read=file=>fs.readFileSync(file,'utf8');
const route='/en/terms-and-conditions/';
const $=c.load(read('en/terms-and-conditions/index.html'));
assert.equal($('html').attr('lang'),'en');
assert.equal($('h1').length,1);
assert.equal($('.privacy-policy h2').length,24);
assert.equal($('link[rel=canonical]').attr('href'),'https://www.hurralingo.com'+route);
const norm=text=>text.replace(/• /g,'').replace(/\s+/g,' ').trim();
const source=read('content/site/terms-and-conditions-en.txt').trim().split(/\r?\n\s*\r?\n/).map(norm);
$('.privacy-policy br').replaceWith(' ');$('.privacy-policy li').append(' ');
assert.deepEqual($('.privacy-policy').children().map((i,node)=>norm($(node).text())).get(),source);
const labels={tr:'Şartlar ve Koşullar (İngilizce)',en:'Terms and Conditions',de:'Allgemeine Geschäftsbedingungen (Englisch)',az:'Şərtlər və qaydalar (ingiliscə)',fr:'Conditions générales (anglais)'};
const config=require('./locale-content.cjs');
for(const lang of ['en','de','az'])assert.equal(config.overrides(lang)[labels.tr],labels[lang]);
assert.equal(require('./french-content.cjs').overrides[labels.en],labels.fr);
let checked=0;
for(const page of JSON.parse(read('content/i18n/canonical-all.json'))){
 const doc=c.load(read(page.slice(1)+'index.html')),lang=doc('html').attr('lang'),link=doc(`footer a[href="${route}"]`);
 assert.equal(link.length,1,page);assert.equal(link.text(),labels[lang],page);assert.equal(link.attr('hreflang'),'en');
 assert.equal(doc('footer a[href*="Hurra-Lingo-Terms-and-Conditions"],footer a[href="/fr/conditions-generales/"]').length,0,page);
 checked++;
}
console.log(`PASS: supplied terms preserved in full; 24 sections; ${checked} localized footers point to the English HTML terms.`);
