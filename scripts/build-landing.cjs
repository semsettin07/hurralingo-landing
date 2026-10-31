// Turkish-only landing pages from content/site/landing-pages.json, built on the contact page shell.
// Facts come from the site's programme table, teacher list, pricing engine and Terms; add a course by adding an entry.
const fs=require('node:fs'),path=require('node:path'),c=require('cheerio');
const {root,read,write,esc,trial}=require('./site-tr.cjs');
const {startPrice}=require('./pricing-static.cjs');
const origin='https://www.hurralingo.com';
const pages=JSON.parse(read('content/site/landing-pages.json'));
const teachers=JSON.parse(read('assets/site-tr.js').match(/var T = (\[\[[\s\S]*?\]\]);/)[1]);
const posts=JSON.parse(read('content/blog/posts.json')).filter(p=>p.language==='tr');
const programmes=[['4–6 yaş','Minikler','Oyunla dinleme ve konuşma','Ön A1'],['7–12 yaş','Çocuklar','Dört beceri ve günlük kullanım','A1 ile B1 arası'],['13–18 yaş','Gençler','Okul müfredatı ve sınav hedefleri','A1 ile B2 arası'],['18+ yaş','Yetişkinler','Kariyer, seyahat ve akıcı konuşma','A1 ile C1 arası']];
const models=[['private','Özel ders','1 kişi','Hedeflerinize göre kişisel bir öğrenme planı.'],['mini','Mini grup','2–4 kişi','Küçük grupta daha çok konuşma fırsatı.'],['group','Grup dersi','5–8 kişi','Birlikte konuşun, birlikte ilerleyin.']];
const crumb=title=>`<nav class="site-crumb" aria-label="Sayfa yolu"><a href="/">Ana sayfa</a><span aria-hidden="true">/</span><span aria-current="page">${esc(title)}</span></nav>`;
const intro=p=>`<div class="wrap page-intro" id="top">${crumb(p.title)}<div class="page-intro-grid"><div><h1>${esc(p.heading)}</h1><p class="lead">${esc(p.lead)}</p><a class="btn btn-primary" href="${trial}" target="_blank" rel="noopener noreferrer">Ücretsiz Tanışma Dersi →</a></div><img class="page-mascot" src="/img/${p.mascot}" alt="" width="180" height="186"></div></div>`;
const band=(title,text,href,label)=>`<section class="site-strip"><div><h2>${esc(title)}</h2><p>${esc(text)}</p></div><a class="btn btn-dark" href="${href}">${esc(label)} →</a></section>`;
const faq=items=>`<section class="site-section"><h2>Sık sorulan sorular</h2><div class="landing-faq">${items.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></section>`;
function course(p){
 const team=teachers.filter(t=>t[1]===p.language);
 if(!team.length)throw Error('No teachers for '+p.language);
 const reading=p.posts.map(slug=>{const post=posts.find(x=>x.slug===slug);if(!post)throw Error('Missing post '+slug);return `<li><a class="link" href="/blog/${slug}/">${esc(post.title)}</a></li>`;}).join('');
 return intro(p)+`<div class="wrap"><section class="site-section"><h2>Yaşa göre ${esc(p.language)} programları</h2><p class="lead">Başlangıç seviyeniz yaşa göre değil, ücretsiz tanışma dersinde öğretmeniniz tarafından belirlenir.</p><div class="site-grid landing-grid-4">${programmes.map(([age,name,focus,level])=>`<article class="site-card"><span class="stamp">${age}</span><h3>${name}</h3><p>${focus}</p><p class="fee-condition">Seviye: ${level}</p></article>`).join('')}</div></section>`+
 `<section class="site-section"><h2>${esc(p.teachersTitle)}</h2><ul class="landing-teachers">${team.map(t=>`<li><img src="${t[2]}" alt="${esc(t[0])}" width="96" height="96" loading="lazy"><span>${esc(t[0])}</span></li>`).join('')}</ul><p class="section-link"><a class="btn btn-line" href="/ogretmenlerimiz/">Tüm öğretmenlerimiz →</a></p></section>`+
 `<section class="site-section"><h2>Ders seçenekleri ve ücretler</h2><div class="site-grid">${models.map(([model,name,people,text])=>`<article class="site-card"><span class="stamp">${people}</span><h3>${name}</h3><p>${text}</p><p class="landing-price"><strong>${startPrice(model,'tr-TR')}</strong><span> / ders</span></p></article>`).join('')}</div><p class="fee-condition">Türk öğretmen · yıllık üyelik · peşin ödeme · KDV hariç başlangıç ücretleridir.</p><p class="section-link"><a class="btn btn-line" href="/ucretler/">Ücretinizi hesaplayın →</a></p></section>`+
 faq([['Almanca seviyem nasıl belirlenir?','Başlangıç seviyeniz ücretsiz tanışma dersinde öğretmeninizle birlikte belirlenir.'],['Bir ders kaç dakika sürer?','Standart ders süresi 4–9 yaş için 30 dakika, 10 yaş ve üzeri için 40 dakikadır.'],['Dersi iptal edebilir veya erteleyebilir miyim?','Dersi başlamadan en az 24 saat önce iptal edebilir veya ertelenmesini isteyebilirsiniz.'],['Paketimi iptal edebilir miyim?','Paketi etkinleşmesinden sonraki 30 gün içinde iptal edebilir, kullanılmayan derslerin ücretini geri alabilirsiniz. Ayrıntılar Şartlar ve Koşullar’dadır.']])+
 `<section class="site-section"><h2>Almanca hakkında okuyun</h2><ul class="not-found-links">${reading}</ul></section>`+band('Öğretmeninizle tanışın','İlk adımı ücretsiz bir tanışma dersiyle atın. Yaşınızı, seviyenizi ve hedeflerinizi birlikte konuşalım.',trial,'Ücretsiz Tanışma Dersi')+`</div>`;
}
function about(p){
 const facts=[['Şirket unvanı','Hurra Education International Ltd'],['Şirket numarası','14126405'],['Türkiye ofisi','Ankara Üniversitesi Teknokent, Gölbaşı / Ankara'],['Londra ofisi','152–160 Capital Office Ltd, Kemp House, City Road, London EC1V 2NX'],['Telefon ve WhatsApp','+90 539 516 70 70'],['E-posta','hello@hurralingo.com']];
 return intro(p)+`<div class="wrap"><section class="site-section"><h2>Ne yapıyoruz?</h2><div class="site-grid">${[['Canlı online dersler','Dersler öğretmenlerimizle canlı olarak yapılır. Eğitim hizmetini doğrudan biz sunarız; öğretmenle öğrenciyi yalnızca buluşturan bir pazar yeri değiliz.'],['Yedi dil, dört yaş grubu','İngilizce, Almanca, Fransızca, İspanyolca, Rusça, Çince ve Türkçe derslerimiz 4 yaştan yetişkine kadar her yaşa uygun programlarla ilerler.'],['Seviyenize göre plan','Başlangıç seviyeniz tanışma dersinde belirlenir. Bire bir, mini grup veya grup derslerinden size uyanı seçersiniz.']].map(([t,x])=>`<article class="site-card"><h3>${t}</h3><p>${x}</p></article>`).join('')}</div></section>`+
 `<section class="site-section"><h2>Kurumsal bilgiler</h2><dl class="landing-facts">${facts.map(([k,v])=>`<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></section>`+band('Bize ulaşın','Sorularınız için bize yazın ya da ücretsiz tanışma dersinizi planlayın.','/iletisim/','İletişime geçin')+`</div>`;
}
function schema(p){
 const list=[{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Ana sayfa',item:origin+'/'},{'@type':'ListItem',position:2,name:p.title,item:origin+p.route}]}];
 if(p.kind==='course')list.push({'@type':'Course',name:p.title,description:p.description,inLanguage:'tr',url:origin+p.route,provider:{'@id':origin+'/#organization'}});
 return `<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':list}).replace(/</g,'\\u003c')}</script>`;
}
for(const p of pages){
 const $=c.load(read('iletisim/index.html'));
 $('link[rel=canonical]').attr('href',origin+p.route);
 $('link[rel=alternate]').remove();
 $('script[src="/assets/auto-language.js"]').remove();
 $('title').text(p.title+' | Hurra Lingo');
 $('meta[name=description],meta[property="og:description"]').attr('content',p.description);
 $('meta[property="og:title"]').attr('content',p.title);
 $('meta[property="og:url"]').attr('content',origin+p.route);
 $('#hd-lang a[lang],.dr-langs a[lang]').each((i,e)=>{const lang=e.attribs.lang;e.attribs.href=lang==='tr'?'/':`/${lang}/`;});
 $('#hdr .nav .nav-a,#drawer .dr-list a').removeAttr('aria-current');
 $('main').attr('class','').html(p.kind==='course'?course(p):about(p));
 $('head').append(schema(p));
 write(p.route.slice(1)+'index.html',$.html());
}
const routes=pages.map(p=>p.route),canonical=JSON.parse(read('content/i18n/canonical-all.json')).filter(r=>!routes.includes(r));
write('content/i18n/canonical-all.json',JSON.stringify([...canonical,...routes],null,2)+'\n');
// Links into the new pages stay on Turkish pages; other languages have no counterpart.
for(const route of [...JSON.parse(read('content/site/canonical-tr.json')),...routes]){
 const file=route.slice(1)+'index.html',$=c.load(read(file));
 $('.footer .kap-links').first().closest('nav').parent().find('.kap-links').each((i,e)=>{if(/Keşfet/.test($(e).prev().text())&&!$(e).find('a[href="/hakkimizda/"]').length)$(e).append('<li><a href="/hakkimizda/">Hakkımızda</a></li>');});
 $('.language-list li').each((i,e)=>{if($(e).text().trim()==='Almanca'&&!$(e).find('a').length)$(e).html('<a href="/online-almanca-kursu/">Almanca</a>');});
 $('.blog-prose a').each((i,e)=>{if(/Almanca Dersleri/.test($(e).text())){e.attribs.href='/online-almanca-kursu/';delete e.attribs.target;delete e.attribs.rel;}});
 write(file,$.html());
}
console.log('Built '+pages.length+' landing pages.');
