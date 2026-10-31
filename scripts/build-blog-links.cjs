// Adds a "keep reading" block and a lessons link to each article in all five languages.
// Posts are grouped by topic on their Turkish slug; a new Turkish post must join a group or the build stops.
const assert=require('node:assert/strict'),c=require('cheerio');
const {read,write,esc}=require('./site-tr.cjs');
const groups=[
 ['yaz-tatilinde-online-yabanci-dil','yariyil-tatilini-bosa-gecirmeyin-cocuklar-icin-online-dil-dersi-ile-simdi-baslayin','ara-tatilde-kucuk-dokunuslarla-buyuk-gelisim-saglamanin-yollari','karne-sonrasi-online-dil-kursu-cocuklar-icin-yabanci-dil-ogrenme-rehberi','kurban-bayrami-tatilinde-cocuklarin-ingilizce-gelisimi-nasil-desteklenebilir'],
 ['oyunla-yabanci-dil-ogrenmenin-gucu-online-egitim-neden-cocuklar-icin-en-etkili-yontem','cocuklarin-dil-egitiminde-oyun','cocuklarda-dil-ogrenimi-korkusuz-ve-eglenceli-yontemler','dijital-cag-cocuklarinin-yabanci-dil-konforu','kis-masallariyla-dil-ogrenmek-kar-taneleri-hangi-dili-konusur','gelecegi-kesfetmek-bilim-kurgu-hikayeleri-dil-gelisimini-nasil-destekler'],
 ['cocuklarda-erken-yasta-ikinci-dil-edinimi','erken-yasta-dil-ogrenimi-her-dil-cocugunuzda-farkli-bir-yetenegi-parlatir','ispanyolca-mi-almanca-mi','almanca-ogrenmek-neden-onemli','cocuklar-icin-rusca'],
 ['online-dil-dersleri','online-dil-derslerinde-asil-kazanim-ne-zaman-baslar','dil-egitimi-teorileri','dil-ogrenmede-motivasyon-ve-hedef','6-ayda-yeni-bir-dil-bir-seruvenin-anatomisi'],
 ['yetiskinler-icin-dil-egitimi-yabanci-dil-ogrenmek-icin-hicbir-zaman-gec-degil','yogun-tempoda-yabanci-dil-ogrenme-icin-5-adim','3-dakikada-ingilizce-konusmak-mumkun-mu-1-nisan-sakasi-ama-icinde-gercek-var','dil-egitiminde-film-ve-dizi','evde-pratik-ingilizce','evde-yabanci-dil-ogrenimini-desteklemenin-7-etkili-yolu'],
 ['29-ekim-cumhuriyet-bayrami-egitim-ozgurluk-ve-yeni-diller-ogrenme-ruhu','23-nisan-ulusal-egemenlik-ve-cocuk-bayrami-cocuklarin-dunyasi-ve-dil-ogrenmenin-gucu','19-mayis-ataturku-anma-genclik-ve-spor-bayrami-ve-dil-ogrenmenin-onemi','egitimin-kalbindeki-ilk-durak-bir-anne-bir-ogretmen','sevgililer-gununun-hikayesi-14-subat-sevginin-gunu-nasil-oldu','sevgililer-gunune-ozel-love-languages-kampanyasi-cocuklar-ve-yetiskinler-icin-online-dil-egitimi','dunyadan-yilbasi-gelenekleri']
];
const labels={tr:['Bunları da okuyun','Derslerimizi inceleyin'],en:['Keep reading','Explore our lessons'],de:['Weiterlesen','Unsere Kurse ansehen'],az:['Bunları da oxuyun','Dərslərimizə baxın'],fr:['À lire aussi','Découvrir nos cours']};
const lessons={tr:'/derslerimiz/',en:'/en/lessons/',de:'/de/kurse/',az:'/az/dersler/',fr:'/fr/cours/'};
const trSlugs=JSON.parse(read('content/blog/posts.json')).filter(p=>p.language==='tr').map(p=>p.slug);
assert.deepEqual(groups.flat().sort(),[...trSlugs].sort(),'Every Turkish post needs exactly one topic group');
const routes=JSON.parse(read('content/i18n/routes.json')).routes;
const route=(slug,lang)=>lang==='tr'?`/blog/${slug}/`:routes[`/blog/${slug}/`]?.[lang];
const file=r=>r.slice(1)+'index.html';
const title=r=>c.load(read(file(r)))('.blog-article h1').first().text().trim();
let written=0;
for(const group of groups)group.forEach((slug,i)=>{
 const related=[1,2,3].map(n=>group[(i+n)%group.length]);
 for(const lang of Object.keys(labels)){
  const own=route(slug,lang);
  if(!own)continue;
  const links=related.map(s=>route(s,lang)).filter(Boolean).map(r=>`<li><a href="${r}">${esc(title(r))}</a></li>`).join('');
  const $=c.load(read(file(own)));
  $('.blog-article .blog-prose').first().after(`<aside class="blog-next" aria-label="${labels[lang][0]}"><h2>${labels[lang][0]}</h2><ul>${links}</ul><a class="btn btn-line" href="${lessons[lang]}">${labels[lang][1]} →</a></aside>`);
  write(file(own),$.html());written++;
 }
});
// Articles that only exist in other languages have no topic group but still lead to the lessons.
for(const r of JSON.parse(read('content/i18n/canonical-all.json')).filter(x=>/^\/(en|de|az|fr)\/blog\/[^/]+\/$/.test(x))){
 const $=c.load(read(file(r))),lang=r.slice(1,3);
 if($('.blog-next').length)continue;
 $('.blog-article .blog-prose').first().after(`<aside class="blog-next" aria-label="${labels[lang][1]}"><a class="btn btn-line" href="${lessons[lang]}">${labels[lang][1]} →</a></aside>`);
 write(file(r),$.html());written++;
}
console.log('Added reading links to '+written+' articles.');
