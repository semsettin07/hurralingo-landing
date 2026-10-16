const site=require('./site-tr.cjs');
const {read,write,esc,original,fragment,clean,shell,hero,teacherSection,trial}=site;
const cheerio=require('cheerio');
const archive=JSON.parse(read('content/site/archive-content-tr.json'));
const pricing=require('../assets/pricing-data.js');
const engine=require('../assets/pricing-engine.js');
site.assets();
function section(id){return clean(fragment('#'+id));}
function safeClaims(markup){return markup.replaceAll('CEFR uyumlu sertifika','Seviyeye göre eğitim planı').replaceAll('Ankara Üniversitesi TÖMER iş birliğiyle.','Hedeflerinize göre birlikte planlayalım.').replaceAll('Ankara Üniversitesi TÖMER iş birliğiyle','Hedeflerinize göre birlikte planlayalım');}
function cards(items){return `<div class="site-grid">${items.map((x,i)=>`<article class="site-card"><span class="site-number" aria-hidden="true">0${i+1}</span><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></article>`).join('')}</div>`;}
function band(title,text,href,label){return `<section class="site-strip"><div><h2>${title}</h2><p>${text}</p></div><a class="btn btn-dark" href="${href}">${label} →</a></section>`;}
const languages=['İngilizce','Almanca','Fransızca','İspanyolca','Rusça','Çince','Türkçe'];
const languageList=`<ul class="language-list" aria-label="Ders dilleri">${languages.map(l=>`<li>${l}</li>`).join('')}</ul>`;
const close=section('son');
const intro=(k,t,d,m)=>hero(k,t,d,m);
const educational=archive.items.filter(x=>x.id.startsWith('education-'));
const examples=archive.items.filter(x=>x.id.startsWith('example-'));
let model=cheerio.load(section('neden'),null,false);
model('.nd-cert h3').text('Seviyenize göre ilerleyin');
model('.nd-cert p').text('Başlangıç seviyeniz tanışma dersinde belirlenir. Öğrenme hedeflerinize adım adım ilerleyin.');
let faq=cheerio.load(section('sss'),null,false);
faq('details').filter((i,e)=>faq(e).find('summary').text().includes('Ödeme seçenekleri')).find('.kap-a-in').html('Üyeliğinize uygun ödeme seçeneklerini <a href="/ucretler/">Ücretler sayfasında</a> karşılaştırabilirsiniz. Aylık üyelikte ayrı peşin veya taksitli ödeme seçimi bulunmaz.');
const pages={
  '/egitimmodelimiz/':{
    title:'Eğitim Modelimiz',description:'Canlı ders, günlük pratik ve gelişim takibiyle yaşınıza ve hedefinize uygun bir dil öğrenme yolculuğu.',
    content:intro('Eğitim','Konuşarak öğrenin.<br>Her gün bir adım ilerleyin.','Canlı dersleri, kısa günlük pratikleri ve öğretmen geri bildirimlerini bir araya getiren bir öğrenme yolculuğu.','maskot-merakli.svg')+
      `<div class="wrap"><section class="site-section" id="egitim-yolculugu"><h2>Size uygun bir başlangıç</h2>${cards(educational)}</section></div>`+model.html()+section('baslangic')+
      `<div class="wrap"><section class="site-section" id="icerik-ornekleri"><p class="eyebrow">DERSİN ÖTESİNDE</p><h2>Pratik yaparken keşfedin</h2><p class="lead">Canlı derste öğrendiklerinizi farklı etkinliklerle pekiştirin.</p>${cards(examples)}</section><section class="site-section" id="sertifikasyon"><h2>Seviyenizi ve gelişiminizi takip edin</h2><p class="lead">Tanışma dersinde başlangıç seviyeniz belirlenir. Öğretmeninizin geri bildirimleriyle gelişiminizi ve bir sonraki hedefinizi birlikte değerlendirin.</p>${band('Bir sonraki adımınız ne?','Yaşa göre programları ve seviye aralıklarını inceleyin.','/derslerimiz/','Dersleri keşfedin')}</section></div>`+section('sorular')+faq.html()+close
  },
  '/derslerimiz/':{
    title:'Derslerimiz',description:'Yedi dilde, dört yaş grubuna uygun bire bir, mini grup ve grup derslerini keşfedin.',
    content:intro('Dersler','Yaşınıza, hedefinize<br>ve ritminize uygun.','Çocuklardan yetişkinlere; bire bir, mini grup ya da grup dersleriyle dil öğrenmenin size uygun yolunu bulun.')+
      `<div class="wrap"><section class="site-section"><h2>Bir okul, yedi dil</h2><p class="lead">Hangi dili öğrenmek istersiniz? Başlangıç seviyeniz tanışma dersinde birlikte belirlenir.</p>${languageList}</section><section class="site-section" id="ders-modelleri"><h2>Nasıl öğrenmek istersiniz?</h2><div class="site-grid">${[
      ['bire-bir','Bire bir ders','1 kişi','Hedeflerinize ve öğrenme hızınıza göre kişisel bir program. Ders planınızı öğretmeninizle birlikte oluşturun.'],
      ['mini-grup','Mini grup dersi','2–4 kişi · 30 dk','Küçük bir grupta karşılıklı konuşun, etkinliklere katılın ve birlikte ilerleyin.'],
      ['grup','Grup dersi','5–8 kişi · 30 dk','Sosyal bir öğrenme ortamında farklı bakış açılarıyla pratik yapın.']
      ].map(([id,t,b,p])=>`<article class="site-card" id="${id}"><span class="stamp">${b}</span><h3>${t}</h3><p>${p}</p><p class="section-link"><a href="/ucretler/">Ücretleri karşılaştırın →</a></p></article>`).join('')}</div></section></div>`+section('programlar')+
      `<div class="wrap"><section class="site-section"><h2>${esc(archive.items.find(x=>x.id==='lessons-recordings').title)}</h2><p class="lead">${esc(archive.items.find(x=>x.id==='lessons-recordings').text)}</p>${band('Dersler arasında küçük tekrarlar','Uygulama, öğretmen geri bildirimleri ve etkinliklerle öğrenmeye devam edin.','/egitimmodelimiz/','Eğitim modelimizi inceleyin')}</section></div>`+close
  },
  '/ogretmenlerimiz/':{
    title:'Öğretmenlerimiz',description:'38 öğretmenimizle tanışın; dil filtresiyle size uygun öğretmenleri keşfedin ve ücretsiz tanışma dersinizi planlayın.',
    content:intro('Öğretmenler','Yeni dilinizde<br>ilk “merhaba”.','Öğretmenlerimizi dile göre keşfedin. Size uygun ders planı için ücretsiz tanışma dersine başvurun.','maskot-goz-kirp.svg')+teacherSection()+close
  },
  '/referanslarimiz/':{
    title:'Referanslarımız',description:'Hurra Lingo velilerinin deneyimlerini okuyun; öğretmenlerimiz ve derslerimizle tanışın.',
    content:intro('Referanslar','Birlikte öğrenenlerin<br>anlattıkları.','Her öğrencinin yolculuğu farklı. Hurra Lingo ailesinden velilerimizin deneyimlerine kulak verin.','maskot-sevinc.svg')+section('yorumlar')+
      `<div class="wrap">${band('Siz de öğretmeninizle tanışın','İlk adımı ücretsiz bir tanışma dersiyle atın. Yaşınızı, seviyenizi ve hedeflerinizi birlikte konuşalım.',trial,'Ücretsiz Tanışma Dersi')}</div>`+close
  },
  '/kurumsal/':{
    title:'Kurumsal Eğitim',description:'Kamu kurumları, okullar, şirketler, çalışanlar ve aileleri için hedefe uygun online dil eğitim programları.',
    content:intro('Kurumsal','Ekibinizin gelişimi için<br>ortak bir dil.','Kurumunuzun, çalışanlarınızın ve ailelerinin ihtiyaçlarına uygun online dil eğitimini birlikte planlayalım.','maskot-mutlu-beyaz.svg').replace('maskot-mutlu-beyaz.svg','maskot-mutlu.svg')+
      safeClaims(section('kurumlar'))+`<div class="wrap"><section class="site-section"><h2>Birlikte planlayalım</h2>${cards([
        {title:'Kurumunuza uygun',text:'Katılımcı sayısı, dil tercihleri ve hedefleriniz üzerinden programınızı birlikte şekillendirelim.'},
        {title:'Yaşa ve seviyeye göre',text:'Yetişkin çalışanlar, çocuklar ve aileler için uygun yaş grubu ve ders modelini belirleyelim.'},
        {title:'Takviminize uygun',text:'Ders sıklığını ve saatlerini ekibinizin ihtiyacına göre birlikte planlayalım.'}
      ])}</section>${clean(fragment('.campaign-banner'))}${band('Kurumsal programınızı konuşalım','Katılımcı sayısını, tercih ettiğiniz dilleri ve eğitim hedeflerinizi paylaşın.','/iletisim/','İletişime geçin')}</div>`+close
  },
  '/iletisim/':{
    title:'İletişim',description:'Hurra Lingo’ya WhatsApp, telefon veya e-posta ile ulaşın. Ücretsiz tanışma dersi ve kurumsal eğitim için iletişime geçin.',
    content:intro('İletişim','Bir “merhaba” ile<br>başlayalım.','Dersler, programlar veya kurumsal eğitim hakkında konuşmak isterseniz buradayız.','maskot-goz-kirp.svg')+
      `<div class="wrap"><section class="site-section contact-layout"><div class="contact-main"><h2>Size nasıl yardımcı olabiliriz?</h2><p>Sorularınız için bize yazın. Tanışma dersinizi başvuru sayfasından planlayabilirsiniz.</p><a class="contact-line" href="https://wa.me/905395167070" target="_blank" rel="noopener noreferrer">WhatsApp’tan yazın ↗</a><a class="contact-line" href="tel:+905395167070">+90 539 516 70 70</a><a class="contact-line" href="mailto:hello@hurralingo.com">hello@hurralingo.com</a></div><div class="site-card"><span class="stamp">HURRA LINGO</span><h2>Ankara’dan<br>dünyaya.</h2><p>Ankara Üniversitesi Teknokent<br>Gölbaşı / Ankara</p><p class="section-link"><a class="btn btn-line" href="https://www.google.com/maps/search/?api=1&query=Ankara+Universitesi+Teknokent+Golbasi" target="_blank" rel="noopener noreferrer">Haritada görüntüleyin ↗</a></p><p class="contact-note">Adres, merkez konumumuzu gösterir. Derslerimiz online yapılır.</p></div></section>${band('İlk ders için doğru yerdesiniz','Öğretmeninizle tanışın, seviyenizi ve öğrenme hedeflerinizi birlikte belirleyin.',trial,'Ücretsiz Tanışma Dersi')}</div>`
  }
};
for(const [route,p] of Object.entries(pages))write(route.slice(1)+'index.html',shell(route,p.title,p.description,p.content));

// Homepage: retain the existing animated hero and a short route into each topic.
const h=cheerio.load(section('top'),null,false);
h('#top p').filter((i,e)=>h(e).text().includes('ödüllü eğitim teknolojilerini')).text('Hurra Lingo; uzman öğretmenler, canlı online dersler ve interaktif içeriklerle çocuklardan yetişkinlere dil öğrenmeyi günlük hayatın bir parçası haline getirir. Yedi dilde, yaşınıza ve hedeflerinize uygun bir programla başlayın.');
let fees=cheerio.load(section('fiyatlar'),null,false);
fees('.plan').each((i,e)=>{const model=['group','mini','private'][i];const amount=engine.calculate(pricing,{model,teacher:'turkish',membership:'annual',frequency:1,payment:'cash'}).selectedLesson;const price=fees(e).find('.price');if(price.length)price.html(price.html().replace(/446|623|890/g,String(amount)));});
fees('.plan ul').remove();
const reviews=cheerio.load(section('yorumlar'),null,false);reviews('#yorumlar').append('<p class="section-link"><a class="btn btn-line" href="/referanslarimiz/">Tüm deneyimler →</a></p>');
const recent=JSON.parse(read('content/blog/posts.json')).filter(p=>p.language==='tr').sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3);
let home=h.html()+`<div class="wrap"><section class="site-section home-models" id="neden"><p class="eyebrow">BİRLİKTE, ADIM ADIM</p><h2>Dil öğrenmek hayatın içinde.</h2>${cards([{title:'Canlı dersle başlayın',text:'Öğretmeninizle konuşun, sorularınızı sorun ve öğrendiklerinizi hemen kullanın.'},{title:'Her gün biraz pratik',text:'Kısa uygulama etkinlikleri ve interaktif içeriklerle dersler arasında tekrar yapın.'},{title:'Gelişiminizi takip edin',text:'Öğretmen geri bildirimleri ve veli paneliyle öğrenme yolculuğunuzu izleyin.'}])}<p class="section-link"><a class="btn btn-line" href="/egitimmodelimiz/">Eğitim modelimizi keşfedin →</a></p></section><section class="site-section home-ages" id="programlar"><p class="eyebrow">SİZE UYGUN BİR YOL VAR</p><h2>Dört yaş grubu, yedi dil.</h2><div class="site-grid">${[['4–6 yaş','Minikler','Oyun ve şarkılarla ilk kelimeler.'],['7–12 yaş','Çocuklar','Keşfederek ve konuşarak öğrenme.'],['13–18 yaş','Gençler','Okul ve kişisel hedeflere uygun pratik.'],['18+ yaş','Yetişkinler','Günlük yaşam ve kariyer için yeni bir dil.']].map(([age,t,p])=>`<article class="site-card"><span class="stamp">${age}</span><h3>${t}</h3><p>${p}</p><p class="section-link"><a href="/derslerimiz/#programlar">Programları keşfedin →</a></p></article>`).join('')}</div>${languageList}</section></div>`+
  fees.html()+teacherSection(6)+reviews.html()+`<div class="wrap"><section class="site-section home-blog" id="blog-yazilari"><p class="eyebrow">HURRA LINGO BLOG</p><h2>Dil öğrenirken yeni dünyalar.</h2><div class="site-grid">${recent.map(p=>`<article class="site-card"><a href="/blog/${p.slug}/"><img class="site-photo" src="/${p.image}" alt="${esc(p.imageAlt||'')}" width="640" height="400" loading="lazy"></a><time datetime="${p.date.slice(0,10)}">${new Intl.DateTimeFormat('tr-TR',{dateStyle:'long',timeZone:'UTC'}).format(new Date(p.date))}</time><h3><a href="/blog/${p.slug}/">${esc(p.title)}</a></h3></article>`).join('')}</div><p class="section-link"><a class="btn btn-line" href="/blog/">Tüm yazıları keşfedin →</a></p></section>${band('Ekibiniz için ortak bir dil','Çalışanlar, aileler ve okullar için hedefe uygun programlar.','/kurumsal/','Kurumsal eğitim')}${band('Aklınızda sorular mı var?','Dersleri, yaş gruplarını ve tanışma sürecini öğretmenlerimizden dinleyin.','/egitimmodelimiz/#sss','Soruların yanıtları')}</div>`+close;
home=home.replace('id="ogretmenler"','class="sec home-teachers" id="ogretmenler"').replace('class="sec" class="sec home-teachers"','class="sec home-teachers"');
write('index.html',shell('/','Online Dil Okulu','Yedi dilde, çocuklardan yetişkinlere canlı online dersler. Hurra Lingo öğretmenleriyle ücretsiz tanışma dersinizi planlayın.',home));
// Preserve the entire calculator main, existing assets, fields and behavioral contract.
require('./build-pricing.cjs');
require('./build-blog.cjs');
require('./build-seo-tr.cjs');
console.log('Built 43 Turkish pages; foreign files and pricing assets were not written.');
