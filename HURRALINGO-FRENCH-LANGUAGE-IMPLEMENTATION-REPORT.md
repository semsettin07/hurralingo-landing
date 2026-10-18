# Hurra Lingo — Fransızca dil entegrasyonu raporu

19 Ekim 2026 güncellemesi: Kanada `/en/` varsayılanını korur; Belçika ve İsviçre desteklenen tarayıcı dilini kullanır. Diğer 38 Fransızca ülke/bölge eşleştirmesi korunur. Aşağıdaki ilk uygulama ülke tablosunun yerine [güncel IP yönlendirme notu](docs/french/ip-country-routing.md) geçerlidir.

Tarih: 18 Ekim 2026. Çalışma dalı: main. HEAD: 64a00d50da34e8c0b32a1915d8d2d7d68c89bb63.

## Sonuç ve yayın durumu

Fransızca beşinci dil olarak çalışma ağacına eklendi. 53 yeni Fransızca HTML sayfa üretildi; toplam canonical URL sayısı 182’den 235’e çıktı. Fransızca sabit sayfalar, tüm farklı blog içerikleri, öğretmen listesi, fiyat hesaplayıcı arayüzü, dil menüleri, SEO ve Fransa ülke eşleştirmesi uygulanmıştır.

**Commit, push, sync, merge veya Cloudflare deployment yapılmadı.** Git ile yalnızca durum, geçmiş içerik ve fark okundu. Değişiklikler yerelde, stage edilmeden bırakıldı. Yerel önizleme ve üretim aday paketleri oluşturuldu; bunlar uzak ortama gönderilmedi. Önceki görevlerden kalan deployment raporları bu görevde yayın yapıldığı anlamına gelmez.

## Başlangıç envanteri ve yeni kapsam

| Dil | Başlangıç canonical | Sabit sayfa / blog listesi | Blog detayı |
|---|---:|---:|---:|
| Türkçe | 43 | 9 | 34 |
| İngilizce | 46 | 9 | 37 |
| Almanca | 48 | 9 | 39 |
| Azerbaycan Türkçesi | 45 | 9 | 36 |
| Toplam | 182 | 36 | 146 |

| Yeni Fransızca içerik | Sayı |
|---|---:|
| Sabit sayfa, blog listesi dahil | 9 |
| Tam blog yazısı | 42 |
| Mevcut iki PDF’nin tam yasal metin çevirisi | 2 |
| Toplam | 53 |

34 Türkçe blog ailesine ek olarak, yabancı dillerde yayımlanmış 10 ek URL bulundu. Bunlardan iki EN/AZ çifti aynı gövdeye sahip olduğundan 8 farklı ek yazı olarak çevrildi. Böylece 146 eski blog URL’sinin tamamı, 42 farklı Fransızca makaleye eşlendi. Hiçbir eski canonical URL envanterden çıkarılmadı.

Öğretmenler için bir Fransızca liste sayfası ve aynı 38 gerçek öğretmen kartı vardır. Kaynak projede ayrı öğretmen detay/biyografi sayfası bulunmadığından yeni detay sayfası veya biyografi uydurulmadı. İsimler, fotoğraflar ve öğretmen/dil eşleşmeleri korundu. Türkçe filtresinin mevcut kadroda sonuç vermemesi kaynak davranışıdır.

Kaynakta bağımsız KVKK HTML sayfası bulunmadı. Mevcut gizlilik ve kullanım koşulları PDF’lerinin her birinin altı sayfalık metni çevrildi; Fransızca HTML belgelere özgün İngilizce PDF bağlantıları eklendi. Yeni bir KVKK politikası oluşturulmadı.

Envanter ve koruma kanıtları: [inventory.json](docs/french/inventory.json), [baseline.json](docs/french/baseline.json).

## İçerik ve çeviri yöntemi

Mevcut statik HTML/Cheerio/JSON mimarisi kullanıldı. Yeni framework veya çalışma zamanı çeviri servisi eklenmedi. Normal site derlemesi tamamen çevrimdışıdır.

İlk çeviri taslakları açık bir hazırlık adımında Google Translate ile oluşturuldu. Ardından Fransızca menüler, CTA’lar, fiyat açıklamaları, tüm sayfa/makale başlıkları ve meta açıklamalar ile sorunlu gövde paragrafları editoryal olarak düzeltildi. Bu çalışma bağımsız bir ana dili Fransızca editörün bütün içerikleri onayladığı veya yeminli çeviri yapıldığı anlamına gelmez.

Blog gövdeleri yalnızca özetlenmedi: 1051 farklı tam metin bloğu, makalelerdeki 1059 kullanımını karşılıyor. Paragraf, alt başlık, liste, tablo, bağlantı ve görsel yapıları kaynaklarla karşılaştırıldı. Satır içi bağlantı/vurgu etiketlerinin sırası korunur; eksik çeviri veya bozuk işaretçi derlemeyi durdurur. 316 arayüz/metin düzeltmesi ayrı editoryal sözlükte, 67 gövde düzeltmesi blok verisinde kayıtlıdır.

Düzeltilen örnekler: Bett UK adının çevrilmesi, ebeveyn paneli, ders kaydı/rattrapage, öğretmen ücreti/maaş ayrımı, peşin ödeme, abonelik, CECRL, ay/lune karışıklığı, bayram/Yeni Yıl karışıklığı ve Almanca kaynaklı Babalar Günü yazısında kalan karışık dil. Profesyonel hitapta vous kullanıldı; çocukların babalarına yazdığı örnek mesajlardaki tu korundu.

Markalar, kişi/öğretmen adları, ürün adları, özgün pedagojik yabancı dil örnekleri ve iletişim adresleri korunur. 25 ve üzeri karakterli, kaynakla aynen kalan metinlerde yalnızca 5 izinli özel ad/öğretim örneği bulundu. Bu kontrol dilbilimsel son okumanın yerine geçmez. Sayısal kaynak örnekleri ayrıca tarandı; binlik ayraç, sözcük sırası ve poisson d’avril gibi doğal tarih ifadeleri dışında yeni sayısal iddia eklenmedi.

## URL eşleştirmesi ve dil menüleri

Fransızca URL’ler doğal, aksansız Fransızca slug’larla /fr/ altında üretildi. Kaydedilen french-routes.json eşleştirmesi sonraki derlemelerde slug’ların kararlı kalmasını sağlar.

235 canonical sayfanın masaüstü ve mobil menüsünde beş dil bulunur. Eski 182 URL’nin tamamında Fransızca karşılık vardır. Ortak 43 içerik ailesinde TR/EN/DE/AZ/FR eşleştirmeleri karşılıklıdır. Yalnızca bazı yabancı dillerde bulunan ek yazılara, bulunmayan diğer diller için ilgisiz makaleler atanmadı: menü ilgili dilin ana sayfasına gider, hreflang yalnızca gerçek karşılıkları içerir. Yasal HTML sayfalarında da mevcut olmayan dört dilde HTML eşleri üretilmedi.

Manuel seçim mevcut localStorage/cookie mekanizmasıyla korunur. Masaüstü ve mobilde EN ana sayfa, ücret ve makaleden doğru FR karşılığına geçiş ve sonraki kök ziyaretinde tercihin korunması gerçek tarayıcı tıklamalarıyla doğrulandı.

## IP ve tarayıcı dili yönlendirmesi

Öncelik: manuel tercih → Cloudflare IP ülkesi → desteklenen tarayıcı dili → Türkçe.

| Ülke | Hedef |
|---|---|
| TR | / |
| DE, AT | /de/ |
| AZ | /az/ |
| FR | /fr/ |
| GB, US, CA, AU | /en/ |
| Diğer / bilinmeyen | Desteklenen tarayıcı dili, sonra / |

fr ve fr-* tarayıcı kodları desteklenir. Otomatik seçim yalnızca kökte çalışır; doğrudan /fr/ ve diğer içerik URL’leri başka dile gönderilmez. Query/hash korunur. Otomatik karar manuel tercihi kendiliğinden yazmaz.

/api/country işlevi değiştirilmedi: yalnızca request.cf ülke metadatası, isteğe özel yanıt ve mevcut no-store başlıkları korunur. Yeni IP servisi yoktur. Yerel testte ülke yanıtları taklit edildi; gerçek Cloudflare/VPN testi yeni kod yayınlanmadığından yapılmadı.

## Ücret hesaplama ve etkileşimler

Fransızca UI mevcut fiyat motorunu/verisini kullanır. TL tutarlar, Excel formülleri, indirimler, model/paket/ödeme koşulları ve yuvarlama değiştirilmedi. Para birimi TRY olarak kaldı; fr-FR sayı/tarih biçimi kullanıldı, EUR dönüşümü yapılmadı.

184 Excel formülü bağımsız değerlendirildi. 60 referans seçim, beş dilin gerçek hesaplayıcı arayüzünde toplam 300 kez doğrulandı. Ders başına ve toplam ücret her dilde aynı referans sayısal sonuca karşılık geliyor; yalnızca gösterim biçimi değişiyor.

Fransızca blog araması, sonuçsuz durum, sıfırlama ve kategori filtresi; 38 öğretmen kartı ve 8 filtre; video açma/kapatma; çerez özelleştirme/kaydetme ve Fransızca kopyalama bildirimi doğrulandı. Kaynak depoda yerel başvuru formu yok: gerçek dış başvuru, giriş, WhatsApp, telefon/e-posta ve harita hedefleri korundu. Dış uygulamanın login?lng=en hedefini veya o uygulamanın dillerini bu depo değiştirmez. Gerçek başvuru/mesaj gönderilmedi.

## SEO, bağlantılar ve paketleme

Her Fransızca sayfada html lang=fr, kendine canonical, Fransızca title/description, OG/Twitter başlık-açıklamaları, fr_FR, Fransızca breadcrumb ve inLanguage=fr JSON-LD bulunur. BlogPosting metadatasında yayın tarihi ve özgün kapak görseli kullanılır. Eski dillerin hreflang kümelerine FR eklendi; Türkçe karşılığı bulunan ailelerde x-default Türkçe olarak korundu.

1119 gerçek karşılıklı alternate bağlantısı ve Fransızca sayfalardaki 4140 yerel hedef kontrolü geçti. Bütün sitede 15.092 yerel bağlantı ve 3.433 varlık başvurusu kontrol edildi. Sitemap 235 canonical URL içeriyor; bunlardan 53’ü Fransızca.

Kaynak ve önizleme politikasındaki noindex, nofollow / Disallow: / korundu. Mevcut üretim paketleyicisi yerel üretim adayında 235 sayfayı index, follow / Allow: / olarak hazırlıyor; Fransızca blog listesi ve bütün makaleler buna dahil. Her iki pakette tüm canonical’lar ve sadece /api/country için Functions kapsamı doğrulandı. Canlı SEO durumu bu görevde değiştirilmedi.

Önceki görevden kaydedilmiş Cloudflare build komutu build-locales.cjs ve paketleyicileri çağırıyor. Fransızca bu üretim zincirine eklendi. Uzak Cloudflare ayarı bu görevde okunup değiştirilmedi; canlı ayarların kayıttan sonra değişmediği doğrulanmış değildir.

## Responsive ve doğrulama sonuçları

| Kontrol | Sonuç | Kanıt |
|---|---|---|
| npm.cmd run site:build | Geçti; FR dahil kalıcı üretim | Üretim çıktıları, build-verification.json |
| npm.cmd run site:check | Geçti; 235 URL, eski içerik koruması, hedefler | docs/localization/static-verification.json; docs/french/static-verification.json |
| npm.cmd run pricing:check | Geçti; 184 formül / 60 seçim | docs/pricing-2027/calculation-verification.json |
| npm.cmd run language:check | Geçti; 63 senaryo, 6 gerçek eski dil menüsü geçişi | docs/french/language-verification.json |
| npm.cmd run french:check | Geçti; 53 FR, tüm kaynak kapsamı, tam makale yapıları, SEO | docs/french/static-verification.json |
| French browser: responsive | Geçti; 53 × 5 = 265 sayfa/genişlik | docs/french/browser-verification.json |
| French browser: etkileşimler | Geçti; 300 fiyat, 6 FR menü geçişi, filtreler, video, çerez, kopyalama | docs/french/browser-verification.json |
| Son editoryal düzeltme | Değişen Babalar Günü makalesi 5 genişlikte tekrar geçti | docs/french/editorial-recheck.json |
| Yerel preview/production paketleri | Geçti; 235 URL / paket, FR 53 / paket | docs/french/package-verification.json |
| git diff --check | Geçti; boşluk hatası yok | Yerel komut çıkış kodu 0 |

360, 390, 768, 1024 ve 1440 piksel genişliklerin her birinde bütün 53 FR sayfa HTTP 200, tek h1, çalışma sonrasında html.lang=fr, yatay taşma ve görseller açısından kontrol edildi. 1440 pikselde menü alanlarının üst üste binmediği de ölçüldü. 360 pikselde pedagojideki uzun başlığın nowrap taşması FR’ye özel CSS ile düzeltildi.

Tam 265 responsive kontrol yeniden çalıştırılarak geçti. Son etkileşim tekrarında değişmeyen responsive kanıtı korundu (responsiveFromPreviousRun=true); daha sonra değişen tek makale beş genişlikte ayrıca tekrar kontrol edildi. Önceki 834 ekran kanıtı bu görevin yeni responsive ölçümü gibi sayılmadı. Önceki locale tarayıcı kontrolünün 240 fiyat/filtre etkileşimi de geçti.

Son tarayıcı sonucunda uygulama JavaScript hatası ve kırık görsel yoktur. İlk denemelerde yakalanan göreli görsel yolu ve mobil başlık sorunları giderildi. Test hazırlığının about:blank localStorage erişimi ve yanlış sayfadaki kopyalama düğmesi seçicisi de düzeltildi; son koşum başarılıdır. JavaScript kapalı kök Türkçe sayfa erişimi ayrıca geçti.

Tarayıcı testleri Chromium ile yerelde çalıştı; font CDN değişkenliğini azaltmak için Google Fonts isteği testte boş CSS ile karşılandı. Diğer tarayıcılar, gerçek cihazlar ve dış fontların farklı yüklenme durumları bu sonuçların kapsamına dahil değildir. Temsilî ekran görüntüleri docs/french/screenshots/ altında bulunur.

## Kaynak ve üretim dosyaları

| Dosya / grup | Değişiklik |
|---|---|
| scripts/build-french.cjs | FR HTML, makale arşivi, yasal sayfalar, menü/SEO, runtime ve manifest üretimi |
| scripts/french-content.cjs | Fransızca söz varlığı, fiyat UI metinleri ve elle düzenlenen metadata |
| scripts/french-blocks.cjs; french-segments.cjs | Tam bağlamlı çeviri blokları, HTML işaretçileri ve korunacak ad/örnekler |
| scripts/prepare-french*.cjs | Envanter/başlangıç koruması ve açık ilk çeviri hazırlığı |
| content/i18n/fr*.json; french-*.json | Çeviri sözlükleri, editoryal düzeltmeler, yasal kaynak metni, kaynak/FR rota eşleşmeleri |
| scripts/locale-content.cjs; build-locales.cjs | Var olan dil üretimine FR uzantısının eklenmesi |
| assets/i18n/site-fr.js; pricing-fr.js; pricing-ui-fr.js | FR dinamik UI; ortak fiyat motoru korunur |
| assets/site-fr.css | FR uzun metin/dar ekran düzenlemeleri ve yasal metin görünümü |
| assets/auto-language.js | /fr/ desteği ve FR ülke eşleştirmesi |
| fr/**/index.html | 53 oluşturulan Fransızca HTML |
| Mevcut 182 HTML ve 3 eski .html alias | Beşinci dil menüsü ve gerçek karşılıklı alternate bağlantıları |
| content/i18n/routes.json; canonical-all.json; sitemap.xml | 235 canonical ve tüm kaynak/FR eşleşmeleri |
| scripts/package-preview.cjs | FR dizininin paketlenmesi |
| scripts/check-french*.cjs | İçerik koruma, bağlantı/SEO, tarayıcı ve yerel paket kontrolleri |
| scripts/check-auto-language.cjs; check-pricing.cjs | Beşinci dil ve izin verilen menü değişiklikleri için mevcut koruma testlerinin genişletilmesi |
| package.json | FR build/check/browser/package-check komutları; site:check içine FR kontrolü |
| docs/french/** | Envanter, koruma kaydı, test kanıtları, ekran görüntüleri ve durum dökümü |

Yeni root bağımlılığı veya package-lock değişikliği yoktur. PDF çıkarımı için kullanılan geçici araçlar ve derleme paketleri ignore edilen dist/ altındadır. Normal üretim bu geçici PDF aracına ihtiyaç duymaz.

### Tekrar çalıştırma

PowerShell’de npm.cmd run site:build ve npm.cmd run site:check komutları bütün siteyi üretip doğrular. Sadece FR için npm.cmd run french:build / french:check kullanılabilir. Browser kontrolü için önce yerel sunucuyu başlatın; varsayılan FR test origin’i http://127.0.0.1:8031, HURRA_FRENCH_ORIGIN ile değiştirilebilir. language:check için aynı sunucuyu HURRA_AUTO_ORIGIN ile belirtin. Playwright mevcut kardeş hurralingo deposundan kullanıldı; farklı kurulumda HURRA_PLAYWRIGHT_PATH verilebilir.

İlk taslak hazırlık betikleri normal build’in parçası değildir. Yeni kaynak içerik eklenirse envanter, çeviri ve editoryal gözden geçirme birlikte güncellenmelidir. Eksik çevirinin sessizce eski dilde yayımlanmasına izin verilmez.

## Korunanlar ve Git çalışma ağacı

182 eski sayfanın main HTML hash’leri görev öncesi kayıtla aynı. Kaynak blog verisi aynı; fiyat motoru/verisi, mevcut dil runtime varlıkları, öğretmen fotoğrafları, diğer görsel/medya ve yasal PDF’ler olmak üzere 158 eski dosya koruma kontrolünden geçti. assets/auto-language.js yalnızca FR ekleme amacıyla değiştirildi. Windows LF/CRLF farkları metin normalizasyonuyla ayrılır; içerik değişikliği olarak kabul edilmez.

Dal main; HEAD 64a00d50da34e8c0b32a1915d8d2d7d68c89bb63 olarak kaldı. Stage edilmiş dosya yok. Bütün değişiklikler çalışma ağacındadır. Dosya bazında tam durum: [working-tree-status.txt](docs/french/working-tree-status.txt). HTML dosyalarının çok sayıda değişmesi beşinci dil menüsü/SEO eklenmesinden kaynaklanır. Testler ayrıca mevcut raporları ve temsilî ekran görüntülerini güncelledi; eski rapor klasörlerinde geçmiş deployment kayıtları değiştirilmedi.

## Açık sınırlamalar ve commit/sync öncesi inceleme

- Son zorunlu kontrollerde başarısız test veya eksik sözlük girdisi yok. Bu sonuçlar yerel entegrasyonu doğrular; yeni kod canlıda çalıştırılmadı.
- Çevirilerin tamamına bağımsız, ana dili Fransızca bir editör tarafından son okuma yapılmadı. İlk taslak otomatik çeviridir ve burada hedefli editoryal düzeltmeler uygulanmıştır; özellikle 42 makalenin üslubu ve yasal terminoloji için bağımsız son okuma uygundur. Yasal çeviriler onaylı/yeminli çeviri olarak sunulmuyor; İngilizce asıllar erişilebilir.
- Özgün videoların Türkçe sesi ve görsellerin içine gömülmüş kaynak dil yazıları, medya dosyalarını değiştirmeme koşulu gereği korundu. HTML açıklamalar/alt metinler Fransızcadır; video ve kampanya belgesinin kaynak dili sayfada belirtilir.
- Dış başvuru ve giriş uygulamasının dili bu depoda değiştirilemez. Gerçek form gönderimi veya WhatsApp mesajı testi yapılmadı; hedefler korundu.
- Bazı ek yazıların dört dilin tamamında karşılığı yok. Gerçek karşılıklar bağlanır; olmayanları menü dil köküne taşır ve SEO eşleştirmesi uydurulmaz.
- Kaynak yazılardaki tarihli kampanya, istatistik, araştırma ve ödül iddiaları yeni iddialar eklenmeden korundu; bağımsız güncellik/doğruluk araştırması yapılmadı. Mevcut tarihli kampanya uyarıları Fransızcaya taşındı.
- Gerçek Cloudflare IP/önbellek davranışı, gerçek mobil cihazlar ve Chromium dışındaki tarayıcılar yayın sonrası ayrı doğrulama gerektirir. Bu görev yayın yetkisi kullanmaz.
- Kaynak HTML’leri doğrudan üretime yüklemek yerine mevcut üretim paketleme akışı korunmalıdır; kaynak/preview noindex kuralı bilinçlidir. Yerel aday paketin hazırlanması yayın onayı veya deployment değildir.

## Yeni Fransızca URL listesi

### Sabit sayfalar

- `/fr/` — École de langues en ligne
- `/fr/pedagogie/` — Notre pédagogie
- `/fr/cours/` — Nos cours de langues
- `/fr/enseignants/` — Nos enseignants
- `/fr/blog/` — Le blog Hurra Lingo
- `/fr/tarifs/` — Tarifs des cours 2027
- `/fr/temoignages/` — Témoignages des familles
- `/fr/entreprises/` — Formations linguistiques en entreprise
- `/fr/contact/` — Nous contacter

### Blog yazıları

- `/fr/blog/cours-de-langues-apres-les-bulletins-un-guide-pour-accompagner-votre-enfant/` — Cours de langues après les bulletins : un guide pour accompagner votre enfant
- `/fr/blog/apprendre-une-langue-avec-un-emploi-du-temps-charge-5-etapes/` — Apprendre une langue avec un emploi du temps chargé : 5 étapes
- `/fr/blog/aid-al-adha-comment-entretenir-l-anglais-de-votre-enfant-pendant-les-vacances/` — Aïd al-Adha : comment entretenir l’anglais de votre enfant pendant les vacances ?
- `/fr/blog/le-19-mai-la-jeunesse-et-l-importance-de-l-apprentissage-des-langues/` — Le 19 mai, la jeunesse et l’importance de l’apprentissage des langues
- `/fr/blog/au-coeur-de-l-education-une-mere-une-premiere-enseignante/` — Au cœur de l’éducation : une mère, une première enseignante ✨
- `/fr/blog/une-nouvelle-langue-en-6-mois-les-etapes-d-une-aventure/` — Une nouvelle langue en 6 mois : les étapes d’une aventure
- `/fr/blog/le-23-avril-celebrer-les-enfants-et-leur-ouverture-aux-langues/` — Le 23 avril : célébrer les enfants et leur ouverture aux langues
- `/fr/blog/peut-on-vraiment-parler-anglais-en-3-minutes/` — Peut-on vraiment parler anglais en 3 minutes ?
- `/fr/blog/apprendre-une-langue-a-l-age-adulte-il-n-est-jamais-trop-tard/` — Apprendre une langue à l’âge adulte : il n’est jamais trop tard
- `/fr/blog/l-histoire-de-la-saint-valentin-pourquoi-le-14-fevrier-celebre-t-il-l-amour/` — L’histoire de la Saint-Valentin : pourquoi le 14 février célèbre-t-il l’amour ?
- `/fr/blog/love-languages-une-campagne-de-la-saint-valentin-pour-petits-et-grands/` — « Love Languages » : une campagne de la Saint-Valentin pour petits et grands
- `/fr/blog/apprendre-tot-chaque-langue-revele-de-nouvelles-aptitudes/` — Apprendre tôt : chaque langue révèle de nouvelles aptitudes
- `/fr/blog/imaginer-l-avenir-la-science-fiction-au-service-des-langues/` — Imaginer l’avenir : la science-fiction au service des langues
- `/fr/blog/vacances-de-mi-annee-accompagner-votre-enfant-dans-une-nouvelle-langue/` — Vacances de mi-année : accompagner votre enfant dans une nouvelle langue
- `/fr/blog/apprendre-avec-les-contes-d-hiver-quelle-langue-parlent-les-flocons/` — Apprendre avec les contes d’hiver : quelle langue parlent les flocons ?
- `/fr/blog/cours-de-langues-en-ligne-quand-les-progres-deviennent-ils-visibles/` — Cours de langues en ligne : quand les progrès deviennent-ils visibles ?
- `/fr/blog/les-traditions-du-nouvel-an-a-travers-le-monde/` — Les traditions du Nouvel An à travers le monde
- `/fr/blog/7-facons-d-accompagner-l-apprentissage-des-langues-a-la-maison/` — 7 façons d’accompagner l’apprentissage des langues à la maison
- `/fr/blog/apprendre-en-jouant-la-place-du-jeu-dans-les-cours-en-ligne/` — Apprendre en jouant : la place du jeu dans les cours en ligne
- `/fr/blog/grandir-a-l-ere-numerique-et-prendre-confiance-dans-une-autre-langue/` — Grandir à l’ère numérique et prendre confiance dans une autre langue
- `/fr/blog/pourquoi-apprendre-l-allemand/` — Pourquoi apprendre l’allemand ?
- `/fr/blog/petites-habitudes-grands-progres-pendant-les-vacances-scolaires/` — Petites habitudes, grands progrès pendant les vacances scolaires
- `/fr/blog/le-29-octobre-education-liberte-et-envie-d-apprendre-des-langues/` — 🇹🇷 Le 29 octobre : éducation, liberté et envie d’apprendre des langues
- `/fr/blog/hurra-lingo-apprendre-une-langue-sans-crainte-et-avec-plaisir/` — Hurra Lingo : apprendre une langue sans crainte et avec plaisir
- `/fr/blog/le-russe-pour-les-enfants-une-langue-un-nouvel-univers/` — Le russe pour les enfants : une langue, un nouvel univers
- `/fr/blog/pratiquer-l-anglais-a-la-maison-des-jeux-pour-apprendre-autrement/` — Pratiquer l’anglais à la maison : des jeux pour apprendre autrement
- `/fr/blog/comment-les-cours-de-langues-en-ligne-peuvent-ils-soutenir-la-reussite-scolaire/` — Comment les cours de langues en ligne peuvent-ils soutenir la réussite scolaire ?
- `/fr/blog/espagnol-ou-allemand-quelle-langue-choisir-pour-votre-enfant/` — Espagnol ou allemand : quelle langue choisir pour votre enfant ?
- `/fr/blog/apprendre-une-deuxieme-langue-des-l-enfance-5-benefices/` — Apprendre une deuxième langue dès l’enfance : 5 bénéfices
- `/fr/blog/le-role-du-jeu-dans-l-apprentissage-des-langues-chez-l-enfant/` — Le rôle du jeu dans l’apprentissage des langues chez l’enfant
- `/fr/blog/comprendre-les-theories-de-l-apprentissage-des-langues/` — Comprendre les théories de l’apprentissage des langues
- `/fr/blog/apprendre-une-langue-motivation-et-objectifs/` — Apprendre une langue : motivation et objectifs
- `/fr/blog/vacances-d-ete-apprendre-une-langue-en-ligne-quand-on-est-enfant/` — Vacances d’été : apprendre une langue en ligne quand on est enfant
- `/fr/blog/films-et-series-quelle-place-dans-l-apprentissage-des-langues/` — Films et séries : quelle place dans l’apprentissage des langues ?
- `/fr/blog/fete-des-peres-de-petits-messages-dans-differentes-langues/` — Fête des Pères : de petits messages dans différentes langues
- `/fr/blog/apprendre-une-langue-les-difficultes-courantes-et-comment-les-surmonter/` — Apprendre une langue : les difficultés courantes et comment les surmonter
- `/fr/blog/apprendre-activement-une-langue-motivation-et-objectifs/` — Apprendre activement une langue : motivation et objectifs
- `/fr/blog/fete-des-peres-de-petits-messages-en-anglais-pour-de-grands-souvenirs/` — Fête des Pères : de petits messages en anglais pour de grands souvenirs
- `/fr/blog/cours-de-langues-pendant-les-vacances-un-guide-pour-les-familles/` — Cours de langues pendant les vacances : un guide pour les familles
- `/fr/blog/une-routine-linguistique-en-5-etapes-pour-les-professionnels-tres-occupes/` — Une routine linguistique en 5 étapes pour les professionnels très occupés
- `/fr/blog/des-ponts-entre-les-cultures-comment-les-langues-elargissent-notre-horizon/` — Des ponts entre les cultures : comment les langues élargissent notre horizon
- `/fr/blog/pour-la-fete-des-meres-ouvrir-a-votre-enfant-le-monde-des-langues/` — Pour la fête des Mères, ouvrir à votre enfant le monde des langues

### Yasal metinler

- `/fr/confidentialite/` — Politique de confidentialité
- `/fr/conditions-generales/` — Conditions générales
