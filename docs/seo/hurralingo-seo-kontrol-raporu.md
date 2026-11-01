# Hurra Lingo SEO uygulama denetimi

## 1. Denetim künyesi

| Alan | Değer |
|---|---|
| Denetim tarihi | 1 Kasım 2026 |
| Referans belge | 23 Ekim 2026 tarihli SEO raporu (yalnızca iddia kaynağı) |
| İncelenen commit | `09e5e188d48b9b9e1efca2e48deb9ec638c2870f`, dal `main` |
| Çalışma ağacı | Başlangıçta temiz. Bitişte yalnızca bu rapor dosyası yeni |
| Canlı yayın | Bu commit için GitHub "Cloudflare Pages" kontrolü: `success` |
| Mevcut diller | TR, EN, DE, AZ, FR |
| Sayfa envanteri | 239 indekslenebilir sayfa (TR 45, EN 48, DE 48, AZ 45, FR 53) ve 5 dil için 404 sayfası |
| Blog yazısı | 188 (TR 34, EN 37, DE 39, AZ 36, FR 42) |
| Kapsam dışı | 1.1–1.4, 2.1, 2.2, 2.3 hesaba katılmadı. Payda 29 madde |

### Kanıt düzeyleri

| Düzey | Nasıl elde edildi |
|---|---|
| **Kod** | Repodaki kaynak ve üretim betikleri |
| **Build** | Geçici temiz klonda `node scripts/build-cf-local.cjs`. Build ve check betikleri izlenen dosyalara yazdığı için kullanıcı ağacında çalıştırılmadı |
| **Yerel tarayıcı** | Playwright 1.63 + Chromium, build paketi yerel sunucuda. GA testi için geçici klonda sahte `G-AUDITTEST01` kimliğiyle ayrı paket üretildi |
| **Canlı** | `https://www.hurralingo.com` üzerinde curl ve Playwright |
| **Dış** | Companies House, Bett sayfaları, web araması |

**Build ile canlının eşliği:** 239 sayfanın tamamı canlıdan indirildi. Cloudflare'in iki kenar dönüşümü (e-posta gizleme, Automatic HTTPS Rewrites) geri alındıktan sonra **239/239 sayfa build ile bayt düzeyinde aynı**. `sitemap.xml` ve `robots.txt` doğrudan aynı. Bu nedenle site geneli sayımlar canlı için de geçerlidir.

### Sınırlar ve yan etkiler

- Search Console, GA4, Cloudflare ve hosting hesaplarına girilmedi. Gerçek form gönderilmedi, kayıt oluşturulmadı, eski sunucu taranmadı.
- Portal için yalnızca iki CTA hedefinin HTTP durumu okundu (ikisi de 200). Tarayıcı testlerinde portal istekleri engellendi veya sahte yanıtla karşılandı.
- GA testinde gerçek `gtag.js` Google'dan indirildi. İlk iki turda ölçüm istekleri tarayıcı içinde kesildi, ancak ikinci turda bazı olaylar bu kesiciye düşmedi. Bu yüzden en fazla birkaç istek sahte kimlikle Google'a ulaşmış olabilir; böyle bir kimlik gerçek bir mülke bağlı değildir. Son turda Google ölçüm alanları ölü porta yönlendirildi, dışarı istek çıkamadı.
- Performans ölçümü için canlı siteye yaklaşık 100 sayfa yüklemesi yapıldı.
- Web aramaları ve Bett sayfaları kesin yokluk kanıtı değildir; "bulunamadı" anlamındadır.

## 2. Özet

| Durum | Sayı | Maddeler |
|---|---:|---|
| **Tamamlandı** | 12 | 2.4, 2.5, 2.6, 2.7, 5.1, 7.1, 7.2, 7.3, 7.5, 8.2, 9.2, 9.6 |
| **Kısmen tamamlandı** | 11 | 3.2, 4.2, 5.2, 5.3, 6.1, 7.4, 7.6, 7.7, 9.3, 9.4, 9.5 |
| **Yapılmadı** | 4 | 4.1, 4.3, 4.4, 9.1 |
| **Doğrulanamadı** | 2 | 3.1, 8.1 |
| **Toplam** | **29** | Kapsam dışı 7 madde paydada değil |

| Ayrı sayım | Sayı | Açıklama |
|---|---:|---|
| Kod tarafı hazır | 13 | 12 Tamamlandı + 3.1 (sitemap hazır, gönderim hesap işi). 3.2 sayılmadı: küçük bir kod boşluğu var ve kimlik girilmemiş |
| Yayında doğrulandı | 12 | Tamamlandı maddelerinin tamamı canlıda doğrulandı |
| Doğrulanamayan | 2 | 3.1 ve 8.1. Yapılmış ya da yapılmamış sayılmadı |

Puan veya trafik tahmini üretilmedi.

**31 Ekim notları hakkında:** Önceki çalışmanın notlarında 4.1, 4.3, 4.4, KDV oranı gösterimi, 9.3 ve 9.4 birleştirmesinin sizin kararınızla kapatıldığı, 9.1'in ertelendiği, 8.1'in kapsam dışı bırakıldığı yazıyor. Bunlar yönlendirici karardır, tamamlanma kanıtı değildir. Durumlar yalnızca bugünkü kanıta göre verildi, karar notu tabloda ayrıca belirtildi.

## 3. Madde tablosu

| Madde | Gereksinim | Durum | Kod/build kanıtı | Davranış/canlı kanıtı | Eksik alt gereksinim | Sonraki adım ve bağımlılık |
|---|---|---|---|---|---|---|
| **2.4** | Bloglarda `/index.html` bağlantıları | **Tamamlandı** | 244 HTML dosyasındaki tüm `<a>` tarandı: `/index.html` 0, `.html` 0, yönlendirmeli 0, kırık 0, eğik çizgisiz 0. Kaynakta `href="…index.html` 0 | Canlı eşlik 239/239. `/ucretler/index.html` → 308 → temiz adres | Yok. `http://www.hurralingo.com/` biçimindeki 8 TR bağlantı `/index.html` sorunu değil; bkz. 9.5 | Yok |
| **2.5** | Bloglarda hurraegitim.com bağımlılığı | **Tamamlandı** | Pakette HTML, CSS, JS, JSON, `_redirects` dahil tüm metin dosyalarında 0 eşleşme. Kaynakta `content/blog/posts.json` içinde 119 işlevsiz kayıt: `source` 49, `imageSource` 40, `href` 30. `href`'ler `scripts/build-blog.cjs:42-46` ile derlemede atılıyor veya yerele çevriliyor. `routes.json` (15) ve `archive-content-tr.json` (13) çıktıya yansımıyor | 299/299 blog görseli `12413f0` ile aynı dosya adıyla korunmuş, kırık varlık 0. Yazı metni 183/188 birebir aynı; farklı 5'i bilinçli yaz tatili düzenlemesi (9.4) | Görseller dosya adıyla eşleştirildi, tek tek gözle karşılaştırılmadı. Eski sunucu kapalı olduğundan özgün kaynakla kıyas yapılamadı | Yok |
| **2.6** | Sitemap güncelleme tarihleri | **Tamamlandı** | `scripts/build-sitemap.cjs:13-15` tarihi ana metin karmasına bağlıyor. Çıktı: 239 URL, tekrar 0, geçersiz tarih 0, indekslenebilir olup listede olmayan 0, gelecek tarih 0, yazı tarihinden eski 0. 1 Kasım derlemesinde hiçbir tarih değişmedi (`git status` temiz) | Canlı `sitemap.xml` ve `robots.txt` build ile aynı; `robots.txt` sitemap'i gösteriyor | 183 yazıda lastmod = yayın tarihi (WordPress değişiklik tarihi saklanmamış, tarih uydurulmamış). Yazı dışı 24 URL `2026-10-27` başlangıç tarihini taşıyor; bu sayfa bazlı kanıt değil, son içerik sürümü varsayımı | İçerik değiştiren commit `content/site/lastmod.json` dosyasını da içermeli; yoksa her Cloudflare derlemesi o sayfaya derleme gününü yazar |
| **2.7** | Markalı 404 sayfası | **Tamamlandı** | `scripts/build-404.cjs:25`, `assets/blog.js:27-29`. 5 dilde ayrı `404.html`, `noindex` | Canlı: `/yok-boyle-bir-sayfa-denetim/`, `/en/not-a-real-page/`, `/de/keine-seite/`, `/az/yoxdur/`, `/fr/inexistant/`, `/blog/yok-boyle-yazi/`, `/en/blog/nope/` hepsi gerçek **HTTP 404**, doğru dilde içerik, menü, 4 geri dönüş bağlantısı. Arama 6 sayfada denendi ve hepsinde doğru yazıyı süzdü (ör. "rusça" → 1 sonuç) | Arama yalnızca bloglarda. `lang` hatası için bkz. Ek bulgu 1 | Yok |
| **3.1** | Sitemap'in Search Console'a gönderimi | **Doğrulanamadı** | Sitemap hazır ve geçerli | Harici hesap kanıtı yok; hesaba girilmedi | Gönderim durumu | **Doğrulanamadı — harici hesap kontrolü gerekiyor.** `https://www.hurralingo.com/sitemap.xml` için durum "Başarılı", keşfedilen URL sayısı 239 olmalı |
| **3.2** | Onaya bağlı GA4 ve tıklama olayları | **Kısmen tamamlandı** | `content/site/analytics.json:2` **boş**, bu yüzden `scripts/optimize-package.cjs:49-52` hiçbir sayfaya GA eklemiyor (239/239 sayfada yok). `assets/analytics.js` hazır. `assets/analytics.js:7` yalnızca `trial-request` arıyor; 14 bağlantı `/tanisma-dersi-istek-formu` adresine gidiyor ve sayılmıyor | **Canlı: GA çalışmıyor, ölçüm yok.** Sahte kimlikli yerel test: onay öncesi ve ret sonrası Google isteği 0, GA çerezi 0; kabulde `_ga` + `page_view`; yenilemede tercih kalıcı; geri çekmede `_ga` silindi, `ga-disable` açıldı, tıklama isteği 0, yenileme sonrası istek 0. Tıklamalar: `trial_click`, `whatsapp_click`, `phone_click` ayrı ve **tıklama başına 1 istek**. Parametre yalnızca `link_url`; kişisel veri veya form verisi yok | Ölçüm kimliği; alternatif başvuru adresi; `tel:` bağlantısı yalnızca 5 iletişim sayfasında; ayar bağlantısı `data-ck-open` kimlik girilmeden yayına çıkmıyor | Kimlik girilince yeniden derleme ve yayın. GA4 Realtime'da olay ve dönüşüm ayarı kontrolü. **Tıklama sayısı başvuru sayısı değildir.** Enhanced Measurement açıksa dış bağlantı `click` olayı ayrıca oluşabilir. Bağımlılık: GA4 hesabı |
| **4.1** | Bett ödülünün kanıtı | **Yapılmadı** | Üst şeritte iddia: `content/site/home-template.html:669,676`, `scripts/build-locales.cjs:49`. Belge veya kanıt bağlantısı yok. Repo notu "kazanan kaydı doğrulanmadı" diyor: `docs/phase-1c/release-blockers.json` (`award`) | Canlı: iddia 244 sayfanın tamamında; şerit bağlantısı deneme formuna gidiyor. [Bett Awards](https://uk.bettshow.com/awards) ve [Kids Judge Bett](https://uk.bettshow.com/kids-judge-bett) sayfalarında "Hurra" veya "Best Language App" bulunamadı. Kids Judge sayfasında 2026 kazanan listesi de yok | Marka + yıl + kategoriyi destekleyen kaynak. İddianın doğruluğu ayrıca **doğrulanamadı** | Belge veya organizatör bağlantısı sağlanıp şeride eklenmeli; sağlanamazsa ifade gözden geçirilmeli. Karar notu: 31 Ekim'de kapatıldı. Bağımlılık: şirket belgesi |
| **4.2** | Hakkımızda sayfası | **Kısmen tamamlandı** | `scripts/build-landing.cjs:26-30`, `content/site/landing-pages.json:15-22` | Canlı `/hakkimizda/` 200, `index, follow`, canonical doğru. 46 TR sayfasının footer'ından bağlantı var; üst menüde yok. Unvan ve numara [Companies House](https://find-and-update.company-information.service.gov.uk/company/14126405) ile uyumlu: aktif, kuruluş 24 Mayıs 2022 | **Kuruluş yılı yok.** EN, DE, AZ, FR'de eşdeğer sayfa yok ve `/en/corporate/` gibi kurumsal sayfalarda unvan ve adres yok. Ankara ve Londra yalnızca adres satırı, ilişkileri açıklanmıyor. Kayıtlı adres farkı: site ve Şartlar "152–160 … Kemp House, City Road", Companies House "124 City Road" | Kuruluş yılı ve şirket yapısı için onay, adres farkının açıklanması, sonra metin ekleme. Bağımlılık: sizden bilgi |
| **4.3** | Öğretmen deneyim, sertifika, anadili | **Yapılmadı** | `assets/site-tr.js:286` model: ad, dil, fotoğraf, görsel konumu. Deneyim, sertifika, anadili alanı yok | Canlı: 38 öğretmen. **Deneyim 0/38, sertifika 0/38, anadili 0/38.** Bu yazılım kusurundan çok veri yokluğu; ama alanlar da yok | Üç alan, veri ve görünür kart | Doğrulanmış veri gelirse alanlar eklenir. Karar notu: 31 Ekim'de kapatıldı. Bağımlılık: İK verisi |
| **4.4** | Yorum tarihi, kaynağı, Google bağlantısı | **Yapılmadı** | `referanslarimiz/index.html:137,147,155` yalnızca alıntı, kısaltılmış ad, öğretmen veya süre bilgisi | Canlı: 3 yorum; `<time>` 0, kaynak bağlantısı 0, Google yorum bağlantısı 0. Sitedeki tek Google bağlantısı genel harita araması (`iletisim/index.html:132`, 5 dil) | Tarih, kaynak, işletme profili. Yorumların özgün metin olup olmadığı kanıtlanamadı | Gerçek kaynak verisi ve işletme profili bağlantısı gerekir. Karar notu: 31 Ekim'de kapatıldı. Bağımlılık: sizden bilgi |
| **5.1** | İlk HTML'de fiyatlar | **Tamamlandı** | `scripts/pricing-static.cjs:3`, `content/site/pricing-main.html:3`. 5 dilde boş fiyat 0 | Canlı JS kapalı: `₺890 / ₺623 / ₺446` veya `TRY` biçimi 5 dilde görünür. JS sonrası aynı tutarlar, hesaplayıcı çalışıyor, sayfa hatası 0. Motorun 60 kombinasyonu içinde kart tutarları gerçekten en düşük ders ücreti. `check-pricing` geçti | Yok. Küçük kusur: AZ'de kart JS sonrası `890 TRY` → `₺890` değişiyor (tutar aynı) | Yok. AZ biçimi P3. Fiyatlar TL kalıyor |
| **5.2** | KDV ve ödenecek tutar | **Kısmen tamamlandı** | `content/site/pricing-main.html:3,6,7,10`, `scripts/build-landing.cjs:22`, Şartlar `:164` | Canlı: 5 dilde kart, hesaplayıcı, notlar tutarlı biçimde **KDV hariç**; "dahil" ifadesi 0. Hesaplayıcı toplamı da KDV hariç | KDV oranı için yetkili kaynak yok; kullanıcı son ödenecek tutarı sitede göremiyor. "Sipariş öncesinde gösterilir" sözü portal kapsam dışı olduğu için doğrulanmadı | Çelişki yok. Karar: oran gösterilecek mi, hangi kaynakla? Karar notu: oran gösterimi 31 Ekim'de kapatıldı. Bağımlılık: mali müşavir |
| **5.3** | Ders süresi ve iptal/iade | **Kısmen tamamlandı** | Kaynak: Şartlar `content/site/terms-and-conditions-en.txt:53-54,78,200`. `scripts/build-pricing.cjs:26`, `scripts/build-landing.cjs:23` | Canlı: `/ucretler/` kartları 5 dilde "4–9 yaş 30 dk · 10 yaş ve üzeri 40 dk" ve 24 saat iptal bilgisi taşıyor, 30 gün iade notu var. Şartlarla uyumlu; **30/40 çelişkisi giderilmiş**. Kalan "30 dk" ifadesi tanıtım kartındaki örnek, çelişki değil | Ana sayfadaki **Özel ders** kartında süre yok (5 dil); ana sayfa kartlarında iptal bilgisi yok. "Ayrıntılar Şartlar ve Koşullar'dadır" düz metin, bağlantı değil; Şartlar yalnızca İngilizce. 30 gün sonrası %15 kesinti notu sayfada yok | Metin onayı sonrası ana sayfa kartı ve Şartlar bağlantısı. Kod işi |
| **6.1** | Çok dilli kurum/site verisi | **Kısmen tamamlandı** | `scripts/build-structured-data.cjs:7-15,18`. Build: 5 ana sayfada EducationalOrganization + WebSite, JSON hatası 0, tek `#organization`, sahte puan/yorum 0 | Canlı eşlik. Logo ve görsel adresleri 200. 5 sosyal profilin hepsi başlık veya kullanıcı adıyla Hurra Lingo'ya ait | Aynı `#website` kimliği 5 sayfada farklı `inLanguage` ile tanımlı. Londra adresi Companies House kaydından farklı (4.2). EN, DE, AZ, FR sayfalarında çalışma anında `lang` hatası (Ek bulgu 1). Rich result beklentisi bu denetimin kapsamında değil | `WebSite` dil değeri sadeleştirilmeli. Adres doğrulanmalı. Bağımlılık: şirket adresi onayı |
| **7.1** | Stil ve font yükü | **Tamamlandı** | Sayfa başına 1 CSS bundle, Google Fonts 0, 6 WOFF2 kendi sunucuda, `font-display:swap` 6/6, 2 preload (`scripts/optimize-package.cjs:43-45`) | Canlı: engelleyici dosya 2 (42 KB CSS, 2 KB dil betiği). Görünüm 360, 390, 1440 px'te düzgün, Türkçe harfler doğru. Ölçümler Bölüm 4'te | Kullanılmayan CSS: ana sayfada %71, blogda %88 (P3). Saha verisi yok | Yok. İyileştirme P3 |
| **7.2** | Blog kapağı önceliği ve boyutu | **Tamamlandı** | 188 yazıda lazy kapak 0; `fetchpriority=high` 180; 162 fotoğraf kapakta `srcset`, `sizes`, preload; boyut 188/188 (`scripts/optimize-package.cjs:57-64`) | Canlı `/blog/cocuklar-icin-rusca/`: mobilde LCP öğesi kapak, `w800` dosyası iniyor; masaüstünde tam dosya. Dosyalar: w480 medyan 23 KB, w800 medyan 42 KB, tam medyan 123 KB, en büyük 286 KB | 26 yazıda fotoğraf yok, maskot gösteriliyor (kayıp değil, temel sürümde de yok) | Yok |
| **7.3** | Logo optimizasyonu | **Tamamlandı** | Tüm 244 şablon `img/logo-hurra-lingo-540.webp` kullanıyor: 540×91, 15 KB, gerçek WebP. Eski dosya sayfalarda kullanılmıyor | Canlı: 1440 px'te 255 CSS px, 2x ekranda net (540 px kaynak), renkler doğru. Header logosu lazy değil | Yok. JSON-LD `logo` alanı hâlâ 312 KB'lık büyük dosyayı gösteriyor; kullanıcı yükü yok | Yok |
| **7.4** | Mobil çerez bildirimi ve CTA | **Kısmen tamamlandı** | `assets/site-tr.js:527-548`, `:560-572`, `content/site/home-template.html:3467-3473` | Canlı 20 ölçüm (5 dil × 4 ekran). Bildirim alanı 360–390 px'te %12–13, üç seçenek erişilebilir, yatay taşma yok. **390×844'te EN, DE, FR ana sayfada hero CTA çerez kartının altında kalıyor ve mobil CTA çubuğu da gizleniyor.** Üst şeritteki küçük bağlantı açık kalıyor. Diğer 17 ölçümde büyük CTA görünür | Mobil çubuk, CTA'nın kart altında kaldığını hesaba katmıyor. Düğmeler 40 px; EN etiketleri küçük harf ("reject", "accept") | Çubuk görünürlük mantığı çerez kartını da değerlendirmeli. Portal hedefi değişmez. Kod işi |
| **7.5** | Video alanı ve layout shift | **Tamamlandı** | `.hm-frame` en-boy oranı, `poster` mevcut, `preload=metadata` | Canlı: oran masaüstünde 4/5, mobil ve tablette 4/3. CLS 0, kaydırma sonrası da 0 (1440, 768, 390 px) | Yerel laboratuvar sonucu; saha CLS verisi yok | Yok |
| **7.6** | Statik varlık önbelleği | **Kısmen tamamlandı** | `scripts/package-production.cjs:22` | Canlı: HTML ve `sitemap.xml` `max-age=0`, `robots.txt` 4 saat: doğru. CSS bundle ve `?v=` JS bir yıl immutable: doğru. **Sürümsüz 63 `/img` dosyası, 15 `/media` dosyası, 6 font da bir yıl immutable** (ör. `/img/logo-hurra-lingo-540.webp`, `/media/hero-ders.jpg`) | Aynı adla değiştirilen dosya, tarayıcılarda bir yıla kadar eski kalabilir | Sürümsüz dosyalara sürüm eklenmeli veya `immutable` kaldırılmalı. Kod işi |
| **7.7** | Görsel alt metinleri | **Kısmen tamamlandı** | `scripts/optimize-package.cjs:53` boş alt metinleri başlıkla dolduruyor. 4.047 görselde `alt` özelliği eksik 0. Maskot ve bayrak boş alt: bilinçli, hata değil | Blog görsellerinin **411/453'ünde alt, yanındaki başlığın birebir kopyası**: kapak 174/180, gövde 81/111, kart 156/162. Öğretmen 38/38 alt = ad; yerinde. Anahtar kelime doldurma görülmedi | Görseli anlatan alt metin. Yazı içi 81 görsel için tekrar özellikle anlamsız | Görsel başına gerçek açıklama gerekir, otomatik tekrar değil. Bağımlılık: içerik emeği |
| **8.1** | Eski cPanel ve WordPress girişleri | **Doğrulanamadı** | Web reposu bu konuda kanıt olamaz | Eski sunucu taranmadı. 31 Ekim notundaki "cpanel./webmail. 200 döndü" ifadesi eski bir iddiadır, bugün yeniden ölçülmedi | Güncel hosting kanıtı | **Doğrulanamadı — hosting kontrolü gerekiyor.** Bkz. Bölüm 7 |
| **8.2** | Tarayıcı güvenlik başlıkları | **Tamamlandı** | `scripts/package-production.cjs:22`. `includeSubDomains` bilinçli olarak yok | Canlı HTML, CSS, JS, görsel, 404: HSTS 1 yıl, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`, `nosniff`. `http://` → 301 `https://`. Sitede iframe 0, video kendi sunucudan; engellenen bir işlev yok | Yok. Önbellekteki `robots.txt`, `/media/hero-ders.jpg` yanıtlarında bu başlıklar eksik; HTML'de var, risk düşük. CSP istenmemişti | HSTS genişletilmemeli |
| **9.1** | Çocuklar için online İngilizce sayfası | **Yapılmadı** | Rota yok. `content/site/landing-pages.json` yalnızca Almanca ve Hakkımızda içeriyor | Canlı: menüdeki 4 yaş grubu bağlantısının hepsi aynı `/derslerimiz/#programlar` adresine gidiyor. Eşdeğer güçlü içerik yok, yalnızca tablo satırı | Sayfa, yaş hedefli bağlantılar, çocuklara özgü içerik | Karar notu: 31 Ekim'de ertelendi. Altyapı `build-landing.cjs` ile hazır. Bağımlılık: içerik onayı |
| **9.2** | Online Almanca kursu sayfası | **Tamamlandı** | `content/site/landing-pages.json:4`, `scripts/build-landing.cjs:16-25,58` | Canlı `/online-almanca-kursu/` 200, canonical ve indekslenebilir. 5 Almanca öğretmeni, 4 yaş grubu, doğrulanmış başlangıç fiyatları, SSS, ilgili yazılar, Course verisi. Blogdaki "Almanca Dersleri" bağlantıları bu sayfaya gidiyor. `/de/` arayüz sayfasıyla karışmıyor | Yok. Sayfa Türkçe; diğer dillerdeki Almanca yazılar ana sayfaya bağlanıyor (bkz. 9.5). İç bağlantı 3 sayfadan | Yok |
| **9.3** | Diğer diller ve yaş grupları | **Kısmen tamamlandı** | `assets/site-tr.js:286`, `scripts/build-landing.cjs:10,57` | Bölüm 5 tablosu. Yaş grupları tek ortak tabloda. Yalnızca Almanca'nın özel sayfası var. **Türkçe filtresi 0 öğretmen gösteriyor** ama site yedi dil söylüyor | İspanyolca, Rusça, Fransızca, Çince için program içeriği ve bağlantı yok; bu dillerde 1–2 öğretmen var | Her kombinasyon için sayfa önerilmez. Karar notu: 31 Ekim'de kapatıldı. Türkçe tutarsızlığı için bilgi gerekli |
| **9.4** | Benzer blogların birleştirilmesi | **Kısmen tamamlandı** | Yaz tatili yazısında Duolingo, Rosetta, Babbel, Preply kaldırılmış (5 dil, yaklaşık %30 kısalmış), lastmod güncel | Birleştirme yok, 34 TR URL duruyor, 301 yok. En yüksek metin benzerliği Jaccard 0,024: **yinelenen içerik kanıtı yok**. Yazıda Quizlet ve genel üçüncü taraf platformlar kalıyor (PenPal Schools, Epic!, YouTube Kids); bunlar destek önerisi, rakip dil kursu değil | Arama niyeti çakışması ölçülmedi; sorgu verisi gerekiyor | Otomatik birleştirme önerilmez. Aday kümeler Bölüm 10, iş 19'da. Karar notu: 31 Ekim'de kapatıldı. Bağımlılık: Search Console |
| **9.5** | Yazar ve ilgili iç bağlantılar | **Kısmen tamamlandı** | `scripts/blog-content.cjs:2-5`, `scripts/build-blog-links.cjs:5-12,29,37`, `scripts/build-french.cjs:93` | 188/188 yazı kurumsal editör kimliği taşıyor, `hurraturkiyewp` 0, sahte öğretmen yazar 0. 170 yazıda konuya göre 3 ilgili yazı + ders bağlantısı | **Metin içi bağlantı zayıf:** TR yazıların 23/34'ünde metin içinde iç bağlantı yok; hiçbir yazıda metinden fiyata veya başka yazıya bağlantı yok. 18 yazıda ilgili yazı yok. Her yazıdaki ders düğmesi aynı. 48 metin içi bağlantı yeni sekmede ana sayfaya gidiyor (8'i TR'de `http://`, 40'ı diğer dillerde). `BlogPosting` yalnızca FR'de ve yazar alanı yok | Bağlam doğrulanarak metin içi bağlantılar eklenmeli. Kod ve içerik işi |
| **9.6** | Yanlış hurraturkiye.com bağlantıları | **Tamamlandı** | `scripts/blog-content.cjs:8`, `scripts/build-blog.cjs:43` | 0 metin içi bağlantı. Footer'daki 244 kardeş marka bağlantısı meşru. 10 TR kaynak bağlantı `/derslerimiz/` adresine dönmüş; 5 dilin tamamında dil içi hedefe gidiyor | Yok | Yok |

## 4. Performans ölçümleri

**Araç ve koşul:** Playwright 1.63 Chromium, canlı site, 1 Kasım 2026, sayfa başına 3 ölçümün medyanı, önbellek kapalı, çerez kartı açık. Mobil: 390×844, 2x, 150 ms RTT, 1,6 Mbit/s, CPU×4. Masaüstü: 1440×900, kısıtsız. TBT uzun görevlerden yaklaşık hesaplandı.

**Bunlar laboratuvar değeridir, saha Core Web Vitals verisi değildir. Lighthouse değildir.** `docs/seo/baseline.json` Lighthouse ile ölçüldüğünden yüzde iyileşme hesaplanmadı. Rapordaki "sayfa açılması" süreleri LCP ile karşılaştırılmadı.

| Sayfa | Ortam | LCP ms | FCP ms | CLS | TBT ms | KB | LCP öğesi |
|---|---|---:|---:|---:|---:|---:|---|
| `/` | Mobil | 2024 | 2024 | 0 | 5 | 357 | Hero metni |
| `/ucretler/` | Mobil | 1808 | 1808 | 0,0001 | 166 | 304 | Giriş metni |
| `/blog/cocuklar-icin-rusca/` | Mobil | 1784 | 1776 | 0 | 0 | 325 | Kapak görseli |
| `/online-almanca-kursu/` | Mobil | 1688 | 1688 | 0 | 143 | 860 | Giriş metni |
| `/blog/` | Mobil | 1760 | 1760 | 0 | 183 | 424 | H1 |
| `/en/` | Mobil | 1976 | 1976 | 0 | 29 | 335 | Hero metni |
| `/` | Masaüstü | 1760 | 1276 | 0,0001 | 0 | 986 | Hero videosu |
| `/ucretler/` | Masaüstü | 628 | 628 | 0 | 0 | 304 | Giriş metni |
| `/blog/cocuklar-icin-rusca/` | Masaüstü | 860 | 780 | 0 | 0 | 468 | Kapak görseli |
| `/online-almanca-kursu/` | Masaüstü | 1052 | 1052 | 0 | 0 | 860 | H1 |
| `/blog/` | Masaüstü | 688 | 688 | 0 | 0 | 564 | H1 |
| `/en/` | Masaüstü | 676 | 652 | 0 | 0 | 1039 | H1 |

## 5. 9.3 kapsam tablosu

Yerelleştirilmiş arayüz sayfaları (`/en/`, `/de/`, `/az/`, `/fr/`) öğretilen dil programı sayılmadı.

| Öğretilen dil | Öğretmen | Özel program sayfası | `/derslerimiz/` bağlantısı | TR blog içeriği | Fiyat |
|---|---:|---|---|---|---|
| İngilizce | 28 | Yok | Yok | 3 yazı başlıkta geçiyor | Ortak hesaplayıcı |
| Almanca | 5 | **Var** | Var | 2 yazı | Ortak hesaplayıcı, sayfada başlangıç fiyatı |
| Fransızca | 1 | Yok | Yok | Başlıkta yok | Ortak hesaplayıcı |
| İspanyolca | 2 | Yok | Yok | 1 karşılaştırma yazısı | Ortak hesaplayıcı |
| Rusça | 1 | Yok | Yok | 1 yazı | Ortak hesaplayıcı |
| Çince | 1 | Yok | Yok | Başlıkta yok | Ortak hesaplayıcı |
| Türkçe | **0** | Yok | Yok | Başlıkta yok | Ortak hesaplayıcı |

| Yaş grubu | Program içeriği | Özel sayfa | Menü hedefi |
|---|---|---|---|
| 4–6 Minikler | Ön A1, oyunla dinleme ve konuşma | Yok | `/derslerimiz/#programlar` |
| 7–12 Çocuklar | A1–B1, dört beceri | Yok | Aynı adres |
| 13–18 Gençler | A1–B2, okul ve sınav | Yok | Aynı adres |
| 18+ Yetişkinler | A1–C1, kariyer ve seyahat | Yok | Aynı adres |

Fiyat motorunda dil girdisi yok; ayrım öğretmen türü (Türk veya native), ders modeli, üyelik ve ödeme üzerinden yapılıyor.

## 6. Öncelikli gerçek eksikler

Aynı kök neden tek satırda toplandı.

| Öncelik | Eksik | Kullanıcıya etkisi | Kanıt |
|---|---|---|---|
| **P1** | GA4 canlıda çalışmıyor | Deneme, WhatsApp ve telefon tıklamaları hiç ölçülmüyor; kod hazır olsa da veri yok | `analytics.json` boş; 239/239 sayfada GA yok |
| **P1** | Bett iddiası kanıtsız | 244 sayfada kanıtsız bir ödül ifadesi güven ve hukuki risk oluşturur | Kanıt bağlantısı yok; organizatör sayfalarında bulunamadı; repo notu da doğrulanmadığını söylüyor |
| **P1** | 390 px'te 3 dilde büyük CTA kapanıyor | Yaygın telefon boyutunda ilk ekranda ana CTA çerez kartının altında | 390×844 EN, DE, FR ölçümü, `assets/site-tr.js:560-572` |
| **P1** | Search Console ve eski panel durumu bilinmiyor | Sitemap gönderimi ve eski giriş yüzeyleri belirsiz | 3.1, 8.1 hesap kanıtı gerekli |
| **P2** | EN, DE, AZ sayfaları JS sonrası kendini Türkçe ilan ediyor | Ekran okuyucu ve tarayıcı dil algısı yanlış çalışır | Ek bulgu 1 |
| **P2** | Sürümsüz dosyalarda bir yıllık immutable | Logo, öğretmen fotoğrafı veya video aynı adla değişirse ziyaretçiler eskisini görür | 84 dosya, canlı başlıklar |
| **P2** | Blog alt metinleri başlık kopyası | Görme engelli kullanıcıya bilgi eklemiyor, başlığı tekrarlıyor | 411/453 |
| **P2** | Blog metinleri içinde bağlamsal bağlantı az | Okuyucu ilgili program veya fiyata metin içinden ulaşamıyor | TR 23/34 metin içi iç bağlantı yok; fiyat bağlantısı 0 |
| **P2** | Güven verileri eksik | Öğretmen ve yorum güvenilirliği kanıtlanamıyor | 4.3 0/38; 4.4 tarih ve kaynak 0 |
| **P2** | Kurumsal kimlik yalnızca Türkçe ve eksik | Dört dilde Hakkımızda yok, kuruluş yılı yok, Londra adresi kayıtla farklı | 4.2, 6.1 |
| **P2** | Son ödenecek tutar görünmüyor | Kullanıcı KDV sonrası toplamı sitede hesaplayamıyor | 5.2 |
| **P3** | Fiyat kartı ve Şartlar bağlantısı boşlukları | Ana sayfa Özel ders kartında süre yok; Şartlar'a sayfa içi bağlantı yok | 5.3 |
| **P3** | Küçük tutarlılık kusurları | Görünür etkisi düşük | Yeni sekmede ana sayfaya giden 48 bağlantı (8'i `http://`), FR H1 `lang` hatası (42), AZ fiyat simgesi, EN çerez etiketleri |
| **P3** | Kullanılmayan CSS | Ana sayfada %71, blogda %88; ölçülen LCP yine de 2,5 sn altında | Coverage ölçümü |
| **P3** | Kontrol betiklerinin baseline'ı eski | Site geneli otomatik kontrol kırmızı | Bölüm 8 |

### Ek bulgu 1: Çalışma anında yanlış `lang`

Bu sorun 29 maddeden birine tam oturmuyor ama gerçek bir kusur. HTML doğru gelse de `assets/i18n/site-en.js:458`, `site-de.js:458`, `site-az.js:458` satırlarındaki `root.lang = 'tr'` JS çalışınca sayfayı Türkçe ilan ediyor. Sebep: `scripts/build-french.cjs:164` bu satırı FR için çeviriyor, `scripts/build-locales.cjs` çevirmiyor.

Canlı ölçüm: `/en/`, `/en/fees/`, `/en/blog/`, `/de/`, `/de/preise/`, `/az/`, `/az/qiymetler/`, yazı ve 404 örneklerinde HTML `en/de/az`, DOM `tr`. FR doğru. Etki 141 sayfa ve 3 dil 404 sayfası.

Ayrıca FR yazılarının 42/42'sinde H1 `lang` değeri içerikle uyuşmuyor (`tr` 34, `de` 5, `en` 3).

## 7. Kullanıcıdan gerekenler ve harici doğrulamalar

### Sizden gereken bilgiler

1. GA4 ölçüm kimliği.
2. Bett için belge veya resmî bağlantı: tam ödül adı, kategori, yıl. Repo notu "Kids Judge Bett" diyor, sitedeki ifade "En İyi Dil Uygulaması".
3. Kuruluş yılı ve Ankara–Londra şirket yapısı. Companies House kuruluş tarihi 24 Mayıs 2022, ama marka başlangıcı farklı olabilir.
4. Londra adresi: Kemp House mı, 124 City Road mu? İkisi farklı amaçla da doğru olabilir.
5. KDV oranı ve uygulaması için mali müşavir görüşü.
6. Doğrulanmış öğretmen verileri ve yorumların gerçek kaynağı, tarihi, Google işletme profili bağlantısı.
7. Türkçe dersi öğretmen listesinde 0 görünüyor. Bu ders veriliyor mu?
8. 9.1 ve 9.4 için güncel karar.

### Harici doğrulamalar

| Yer | Kontrol |
|---|---|
| Search Console | `https://www.hurralingo.com/sitemap.xml` gönderildi mi, durum "Başarılı" mı, 239 URL keşfedildi mi? Sayfa dizine ekleme raporunda hata var mı? |
| Search Console | Tatil, oyunla öğrenme ve online ders yazılarında aynı sorguda birden çok URL gösteriliyor mu? (9.4) |
| GA4 | Kimlik girildikten sonra Realtime'da `page_view`, `trial_click`, `whatsapp_click`, `phone_click` geliyor mu? Bir test tıklamasında çift `click` oluşuyor mu? Dönüşüm ayarı tanımlandı mı? |
| Hosting firması | Eski sunucu, cPanel, WHM, webmail ve WordPress girişleri kapatıldı mı? Kapatılmadıysa eski IP, panel portları ve `wp-login` erişimi ne durumda? Yedek ve süre sonu tarihi nedir? |
| Cloudflare | Eski alt alan DNS kayıtları ne durumda? Kapatma öncesi posta kaydı Google MX olarak korunmalı. |
| Saha verisi | Search Console Core Web Vitals raporu yeterli veri topladı mı? |

## 8. Çalıştırılan kontroller

Tümü geçici klonda, temiz HEAD üzerinde çalıştı. Başarısızlıklar bu denetimin neden olduğu sorunlar değildir.

| Komut | Sonuç | Yorum |
|---|---|---|
| `build-cf-local.cjs` | Geçti | 239 sayfa |
| `check-seo.cjs` | Geçti, 17/18 madde, 8/8 koruma | Tek açık 3.2. Ölçütleri dar: 7.7'de yalnızca boşluğa, 2.4'te göreli bağlantıya bakıyor |
| `check-pricing.cjs` | Geçti | 184 formül, 60 seçim |
| `check-privacy.cjs`, `check-terms.cjs` | Geçti | |
| `check-site-tr.cjs` | Başarısız | Korumalı dosya karması eski (`posts.json`). SEO kusuru değil |
| `check-locales.cjs` | Başarısız | Korumalı varlık karması eski (`assets/site-tr.js`). SEO kusuru değil |
| `check-french.cjs` | Başarısız | Beklenen sayfa sayısı 235, gerçek 239. Ayrıca izlenen `docs/french/static-verification.json` dosyasına yazıyor |
| `check-blog.cjs` | Çalışmadı | `playwright` modülü yok |
| `check-production-unchanged.cjs` | Çalışmadı | Wrangler yolu gerekiyor |

Mobil 360 ve 390 px ile masaüstü 1440 px davranışı gerçek tarayıcıda incelendi. Ek olarak 375 ve 412 px ölçüldü.

## 9. Git karşılaştırması

| | Başlangıç | Bitiş |
|---|---|---|
| Commit | `09e5e18` | `09e5e18` |
| Dal | `main` | `main` |
| Değişen dosya | 0 | 1 yeni: `docs/seo/hurralingo-seo-kontrol-raporu.md` |

Commit, push, deploy, reset veya checkout yapılmadı. Kullanıcı ağacındaki `dist/` ve `node_modules/` değiştirilmedi.

## 10. Sonraki uygulama turu için iş listesi

Yalnızca gerçekten eksik bulunan işler. Bu turda hiçbiri uygulanmadı.

### Hemen yapılabilir, kod işi

1. **7.4:** Mobil CTA çubuğu mantığını, hero CTA çerez kartının altındayken de gösterecek şekilde düzelt. EN, DE, FR'de 390×844'te doğrula.
2. **Ek bulgu 1:** `build-locales.cjs` çalışma anı `lang` değerini dile göre yazsın. FR H1 `lang` değerlerini düzelt.
3. **3.2:** `assets/analytics.js:7` kuralına `tanisma-dersi-istek-formu` adresini ekle.
4. **7.6:** `/img/*`, `/media/*` ve fontlar için sürümleme veya `immutable`'ı kaldırma kararını uygula.
5. **6.1:** `WebSite` dil değerini sadeleştir.
6. **9.5:** 8 `http://` bağlantıyı düzelt. Ana sayfaya giden 48 bağlantıdan `target="_blank"` kaldır.
7. **5.3:** Ana sayfa Özel ders kartına süre, Ücretler sayfasına Şartlar bağlantısı ekle.
8. **Bakım:** `site:check` baseline'larını güncelle. `check-seo` ölçütlerini alt metin kalitesi ve mutlak iç bağlantıları kapsayacak şekilde genişlet.

### Sizden bilgi gelince

9. **3.2:** Ölçüm kimliğini gir, yayına al, GA4'te doğrula.
10. **4.1:** Bett kanıtını ekle veya ifadeyi güncelle.
11. **4.2:** Kuruluş yılı ve şirket yapısını ekle; EN, DE, AZ, FR Hakkımızda sayfalarını üret.
12. **6.1:** Adres onayına göre JSON-LD, Hakkımızda ve gerekiyorsa Şartlar'ı güncelle.
13. **5.2:** Karar çıkarsa KDV açıklamasını ve toplam gösterimini uygula.
14. **4.3, 4.4:** Doğrulanmış veriyle öğretmen alanlarını ve yorum kaynaklarını ekle.

### İçerik emeği ve karar gerektiren

15. **7.7:** Yazı içi görsellerden başlayarak gerçek alt metin yaz; `optimize-package.cjs:53` kopyalama davranışını kaldır.
16. **9.5:** Doğrulanmış program ve fiyat bağlantılarını metne bağlama uygun ekle; 18 yazıya ilgili yazı grubu oluştur.
17. **9.1:** Karar alınırsa çocuklar için İngilizce sayfası üret; 4 yaş bağlantısını ayrıştır.
18. **9.3:** Türkçe dersi tutarsızlığını gider. Yeni sayfa yalnızca talep kanıtı varsa açılmalı.
19. **9.4:** Search Console verisi çakışma gösterirse tatil (5 yazı), oyunla öğrenme (6) veya online ders (5) kümelerini tek tek değerlendir. Veri yoksa dokunma.
