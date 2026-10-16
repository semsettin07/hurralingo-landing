# HURRA LINGO — Faz 1B Uygulama Raporu

Tarih: 16 Ekim 2026. Çalışma branch’i: `phase-1b-tr-multipage`.

## Git referansı ve yayın sınırı

- Değişiklik öncesi `main` / Git referansı: `4750cad420a3d4215a3035c78aa4e2539857a033`.
- Faz 1A raporları ve başlangıç kaynaklarının saklandığı branch commit’i: `5c75b39`.
- Başlangıç dosya hash’leri: [baseline.json](docs/phase-1b/baseline.json). Fiyat dosyaları, yabancı dil dosyaları/blogları, mevcut görseller/videolar, blog verisi ve robots dahil **166 dosya** korunuyor.
- Eski ana sayfanın tamamı [home-template.html](content/site/home-template.html) içinde; önceki içerik Git referansında da bulunur. Kaynak şablonlar ve raporlar preview paketine dahil edilmez.
- Production branch’e merge veya push yapılmadı. Production deployment, DNS ve canlı indeksleme ayarları değiştirilmedi.

## Önizleme

Cloudflare Pages preview: **https://796bd34f.hurralingo-landing.pages.dev**

Branch adresi: https://phase-1b-tr-multipage.hurralingo-landing.pages.dev

Cloudflare kayıtları dağıtımı **Preview**, branch’i `phase-1b-tr-multipage`, kaynak commit’i **`cb8650e`**, deployment kimliğini **`796bd34f-4055-4a0a-acfa-e1dd4ca95856`** olarak doğruladı. Paket 219 dosya içeriyor. Doğrudan CLI ile yalnızca bu preview branch’ine yüklendi; Git remote’una push yapılmadı.

**Uzak doğrulama sınırı:** Bu çalışma ortamından `.pages.dev` bağlantıları sık sık `ECONNRESET` / `ERR_CONNECTION_RESET` veriyor. Bir başarılı HTTP HEAD kontrolünde ana sayfa 200 ve `X-Robots-Tag: noindex, nofollow`; bir başarılı Chromium ziyaretinde yeni Türkçe başlık ve H1 görüldü. Sonraki toplu uzak kontroller TLS bağlantı sıfırlamaları nedeniyle tamamlanamadı. Dolayısıyla 43 canonical ve 174 yönlendirme için aşağıdaki başarılı sonuçlar **yerel preview paketine** aittir; tüm uzak URL’lerin geçtiği iddia edilmez. [deployment-verification.json](docs/phase-1b/deployment-verification.json) bu başarısız uzak denemeyi açıkça saklar. Ağ erişimi düzeldiğinde `node scripts/check-preview-deployment.cjs https://796bd34f.hurralingo-landing.pages.dev` ile tekrar çalıştırılabilir.

Production deployment kimliği önce/sonra **`b61b1c9e-4744-4956-b9d0-441dac1d39f1`**, kaynak `4750cad`, branch `main` olarak aynı kaldı. Canlı Türkçe/EN/DE/AZ sayfaların ana içerikleri, canonical ve robots metaları başlangıç Git referansıyla; canlı `robots.txt` ise dağıtım öncesi yanıtıyla eşleşti. Cloudflare e-posta koruması her yanıtta farklı kod ürettiğinden ham HTML hash’i sabit değildir; içerik karşılaştırmasında bu e-posta kodları çözülür. Kanıtlar: [preview-deployment.json](docs/phase-1b/preview-deployment.json), [production-verification.json](docs/phase-1b/production-verification.json).

Yerel test origin’i: `http://127.0.0.1:8021`. Son teslimde süreç kapatılır; tekrar açmak için aşağıdaki komutlar kullanılabilir.

## Uygulanan sayfa yapısı

| Yol | Sonuç |
| --- | --- |
| `/` | Mevcut animasyonlu hero korundu. Eğitim, dört yaş grubu/yedi dil, fiyat özeti, altı öğretmenlik vitrin, üç mevcut veli yorumu, üç blog kartı ve detay bağlantıları eklendi/düzenlendi. |
| `/egitimmodelimiz/` | Eğitim yaklaşımı, hedef/seviye analizi, öğretmen eşleşmesi, veli paneli, uygulama, gelişim takibi, içerik türleri, başlangıç adımları, altı mevcut soru videosu ve SSS. |
| `/derslerimiz/` | Yedi ders dili, bire bir/mini grup/grup, mevcut yaş/seviye tablosu ve ders sonrası pratik açıklaması. |
| `/ogretmenlerimiz/` | Mevcut **38 öğretmen**; ad, dil, fotoğraf/kırpma ve FLIP filtresi korunuyor. Yedi ders dili filtresi + Tümü; Türkçe için mevcut boş sonuç davranışı. |
| `/referanslarimiz/` | Mevcut Şebnem E., Merve A. ve Fatoş A. yorumları ve tanışma çağrısı. |
| `/kurumsal/` | Çalışanlar, aileler, okullar ve şirketler için mevcut program/teklif süreci; mevcut Emniyet kampanya görselleri ve PDF bağlantısı korundu. |
| `/iletisim/` | Mevcut WhatsApp/telefon, e-posta ve Teknokent merkez bilgisi; harita ve tanışma dersi bağlantısı. Ek şube/adres iddiaları eklenmedi. |
| `/blog/` + 34 detay | İçerik modeli, yazı gövdeleri, tarihler, sluglar, yerel görseller, arama/kategori ve kart etkileşimleri korundu. Ortak TR kabuk ve canonical uygulandı. |
| `/ucretler/` | Hesaplayıcının ana içeriği, alanları, verisi ve davranışı korundu; ortak TR kabuğa alındı. |

Her Türkçe sayfada aynı sekiz öğeli masaüstü/mobil menü bulunur: **Eğitim · Dersler · Öğretmenler · Blog · Ücretler · Referanslar · Kurumsal · İletişim**. Aktif öğe, mobil drawer, Escape/odak dönüşü, Tab döngüsü, dil seçici, sosyal medya ve resmî tanışma CTA’sı korunur.

Ana sayfanın uzun öğretmen listesi ve detay açıklamaları ilgili sayfalara taşındı. Soru videoları ve tam SSS Eğitim sayfasında. Mevcut SVG’ler, portreler, maskotlar, videolar, fiyat kartları, yorum tasarımı, çerez tercihleri, video diyaloğu ve hareket azaltma davranışları kullanılıyor. Kaynak şablonda tüm eski metinler saklanıyor.

## İçerik aktarımı ve onay bekleyenler

İzlenebilir kaynak/karar kaydı: [archive-content-tr.json](content/site/archive-content-tr.json).

- Türkçe WordPress kaynaklarından **7 açıklama bloğu** uyarlanarak aktarıldı: hedef/seviye analizi, öğretmen eşleşmesi, gelişim/öz değerlendirme, ders sonrası tekrar, eşleştirme, yazma ve interaktif içerik türleri.
- WordPress tema/eklenti/CSS/JS altyapısı taşınmadı. Diğer dillerden çeviri yapılmadı.
- Eski fiyatlar, üyelik süreleri, indirim oranları ve döviz tabloları kullanılmadı.
- Onaylanmamış Bett ödülü, TÜBİTAK hibesi, fuar/ziyaret, akreditasyon, sertifikanın akademik geçerliliği ve sınav koşulları yayımlanmadı. Eski ana sayfadaki ilgili iddialar yeni TR vitrininden de çıkarıldı; kaynak şablon ve Git geçmişinde saklandı.
- Londra/diğer şube adresleri ve ek sabit telefon eklenmedi.
- Arşiv öğretmenleriyle kadro değiştirilmedi; mevcut üç yorum dışındaki referans/video içerikleri kullanım ve güncellik onayına bırakıldı.
- Geçmiş blog yazılarının gövdeleri değiştirilmedi. Kampanya/indirim içeren yazılara tarihsel bilgi notu ve güncel Ücretler bağlantısı eklendi.
- Mevcut Emniyet kampanya varlıkları yeni kampanya olarak üretilmedi; Kurumsal sayfasında önceki proje içeriği olarak korundu. Kampanyanın ticari geçerliliği production yayını öncesinde sahibi tarafından teyit edilmelidir.

## Fiyatlar ve blog koruması

`assets/pricing-engine.js`, `pricing-data.js`, `pricing-tr.js`, `pricing-ui.js`, `pricing.css` ve Excel hücre kaynağı değişmedi. Yeni ücret veya ödeme politikası üretilmedi. Ana sayfa başlangıç fiyatları mevcut motor/veriden hesaplanıyor; Türk öğretmen/yıllık peşin/KDV hariç koşulları korunuyor.

`build-pricing.cjs` mevcut içerik/veri üretimini ortak kabukla birleştiriyor. Aynı veri yeniden üretildiğinde dosyayı yazmayarak orijinal baytlarını koruyor. `check-pricing.cjs` yalnızca yeni menü sözleşmesine uyarlandı. Eski tek seferlik ana sayfa göç betiği, yeni mimaride ortak üreticiye gider.

`build-blog.cjs` varsayılan ve bu faz kapsamındaki üretimde yalnızca TR yazar. EN/DE/AZ üretimi atlanır. Blog kontrol betiğinin geçici kayıtları da TR ile sınırlandı. **34 yazının `.blog-prose` gövdesi başlangıç Git referansıyla birebir karşılaştırıldı.** `content/blog/posts.json` ve 70 blog görseli değişmedi. EN/DE/AZ ana dosyalarının ve blog dosyalarının hash’leri korunuyor.

## SEO ve yönlendirme

- **43 Türkçe URL** için üretim alan adına kendine canonical: 9 sabit sayfa + 34 yazı. [canonical-tr.json](content/site/canonical-tr.json), [sitemap.xml](sitemap.xml).
- Başlık, açıklama, H1 ve Open Graph Türkçe kabuk üzerinden üretiliyor. Yeni detay sayfalara doğrulanmamış dil eşdeğerleri eklenmedi; yabancı hreflang dosyaları değişmedi.
- TR kökte `tr` ve `x-default` kök canonical’a bağlanıyor. Karşılıklı yabancı hreflang üretimi sonraki dil fazına bırakıldı.
- **174 açık 301 kuralı**: 16 kaynak sayfa, 34 tarihli blog, 4 classes yolu ve kodlama varyantlarının slash/slashsız/index karşılıkları. Emoji içeren kaynak URL’ler için literal/percent-encoded varyantları desteklenir. `/tr/*` genel kuralı yok.
- `/tr/` → `/`; özel sayfalar, blog detayları ve sertifikasyon/SSS/içerik örnekleri gerçek hedef/anchor’larına gider. UTM sorguları korunur. Bilinmeyen sayfalar 404 kalır.
- Preview paketi `_redirects` içinde **göreli hedefler** kullanır; ziyaretçi canlı siteye yönlendirilmez. Yabancı dil yolları bu kurallara dahil değildir.
- Üretim yönlendirme adayı yalnızca [production-redirects.txt](docs/phase-1b/production-redirects.txt) olarak saklandı; etkinleştirilmedi. Arşiv alan adında hiçbir kural uygulanmadı.
- Preview sayfalarında `noindex, nofollow`, paket `_headers` içinde `X-Robots-Tag`, robots içinde `Disallow: /` var. Canlı robots ve indeksleme ayarlarına dokunulmadı; sitemap gönderilmedi.

## Yerel test sonuçları

| Kontrol | Sonuç / kanıt |
| --- | --- |
| 43 canonical sayfa, tek H1, TR dil etiketi, menüler | Geçti. [static-verification.json](docs/phase-1b/static-verification.json) |
| Kaynak koruması | 166 korunan dosya SHA256 ile aynı; 38 öğretmen, 34 TR yazı, yedi ders dili korunuyor. |
| Yerel bağlantı/varlıklar ve SVG referansları | 2.109 bağlantı ve 566 varlık kullanımı denetlendi; eksik hedef/anchor/sembol yok. Sayılar benzersiz dosya sayısı değildir. |
| Excel ve ücretler | 184 formül bağımsız hesaplandı; 60 geçerli senaryo, ROUND ve hatalı seçim kontrolleri geçti. |
| Tarayıcı ücret senaryoları | 60/60; ders ücreti/toplam, aylık ödeme seçimi, karşılaştırma ve model kartından odak aktarımı geçti. |
| Duyarlı tasarım | 43 sayfanın her biri **320, 390, 768, 1024, 1440 px**: **215 kombinasyon**, yatay taşma yok. |
| Etkileşimler | Sekiz öğeli drawer, Escape/odak/Tab, gerçek sayfa geçişi, öğretmen filtreleri/boş sonuç, video diyaloğu/odak dönüşü, SSS, blog arama/kategori/sıfırlama geçti. |
| JavaScript ve HTTP | Tarayıcı testinde JS hatası ve başarısız yerel HTTP yanıtı yok. |
| Yönlendirmeler | 174 kuralın tamamı 301 ve doğru hedefe 200; UTM koruması ve gerçek 404 kontrolü geçti. |
| JavaScript kapalı | 38 öğretmen statik HTML’de mevcut; ücret hesaplayıcısının noscript açıklaması görünür. |
| Görsel kanıt | 21 tam sayfa görüntüsü, 505 görsel kullanımında yükleme/decode başarılı. [screenshot-verification.json](docs/phase-1b/screenshot-verification.json), [browser-verification.json](docs/phase-1b/browser-verification.json) ve [screenshots/](docs/phase-1b/screenshots/). Tam sayfa görüntülerinde lazy görseller yüklenir ve okunaklı kanıt için hareket azaltma kullanılır. |

Tarayıcı araçları mevcut komşu projedeki Playwright kurulumunu kullanır; yeni browser/paket kurulmadı. Eski tüm dillerdeki kontrol betiği çalıştırılmadı; Faz 1B kapsamındaki TR testleri çalıştırıldı.

## Medya durumu ve sınırlar

Mevcut **139 medya varlığı** korundu; yeni arşiv dosyası indirilip yayımlanmadı. Yerel dosya/anchor kontrolleri ve tarayıcı istekleri başarısız medya bağlantısı göstermedi. Video diyaloğu açma/kapatma test edildi; tüm videoların baştan sona içerik/codec incelemesi yapılmış değildir. Haricî sosyal ağlar, harita ve başvuru formunun gönderim işlemleri test edilmedi.

Faz 1A’daki medya API toplamı/dönen kayıt farkı olan **57 arşiv kaydı** halen doğrulanmamış olarak kalır. Bu kayıtlar yeni sayfaların medya bağımlılığı değildir. Arşivdeki ek referans/videolar ve ürün ekranları, kalite/kullanım/güncellik onayı olmadan yayımlanmadı.

## Değişen dosyalar ve tekrar üretim

- Üretilen TR HTML: `index.html`, altı yeni sayfanın `index.html` dosyaları, `ucretler/index.html`, `blog/index.html` ve 34 TR detay. Blog gövdesi/hesaplayıcı ana içeriği korunur; değişiklik ortak kabuk ve SEO katmanındadır.
- Ortak tasarım/etkileşim: `assets/site-theme-tr.css`, `assets/site-tr.css`, `assets/site-tr.js`. Önceki Türkçe stiller ve etkileşimler ortak varlıklara çıkarıldı; mevcut yabancı sayfaların kullandığı stiller değiştirilmedi.
- Kaynaklar: `content/site/home-template.html`, `pricing-main.html`, `archive-content-tr.json`, `canonical-tr.json`, `redirects-tr.json`.
- Üretim: `scripts/site-tr.cjs`, `build-site-tr.cjs`, `build-seo-tr.cjs`, `package-preview.cjs`; TR kapsamı ve ortak kabuk için `build-blog.cjs`, `build-pricing.cjs`, `update-pricing-home.cjs` güncellendi.
- Kontroller: `check-site-tr.cjs`, `check-site-browser-tr.cjs`, `capture-site-tr.cjs`, `check-preview-deployment.cjs`, `check-production-unchanged.cjs`; yeni menü/TR kapsamı için `check-pricing.cjs` ve `check-blog.cjs` güncellendi.
- Yerel preview sunucusu: `serve-phase1b-preview.cjs`; mevcut sunucu dosyası değiştirilmedi.
- `package.json`: site build/check/browser/package komutları. Bağımlılık ve lockfile değişikliği yok.
- Kanıtlar/raporlar: `docs/phase-1b/`, `sitemap.xml`, Faz 1A raporlarının baseline commit’i ve bu rapor.

Başlangıç referansına göre tam dosya listesi: [changed-files.txt](docs/phase-1b/changed-files.txt). Preview’a giren uygulama commit’i `cb8650e`; sonraki rapor/test-transport düzenlemeleri site paketinin içeriğini değiştirmez.

```powershell
npm.cmd run site:build
npm.cmd run site:check
npm.cmd run pricing:check
npm.cmd run site:package-preview
node scripts/serve-phase1b-preview.cjs
# Ayrı terminalde:
npm.cmd run site:browser
node scripts/capture-site-tr.cjs
```

Preview paketi `dist/phase-1b-preview` altındadır; kaynak şablon, envanter, çalışma kitabı ve raporlar yayımlanmaz. Bu paket üretim için kullanılmamalıdır; indeks engeli preview için zorunlu ve 301 hedefleri göreli tutulmuştur.

## Production için ayrıca onay gerekenler

Canlı yayın, production merge/deployment ve indeksleme değişikliği bu faza dahil değildir. Önce içerik iddiaları/kampanya güncelliği, mevcut 2027 ücretlerinin yayın takvimi, sertifika kapsamı, ek adresler, arşiv referansları ve yabancı dil SEO eşdeğerleri onaylanmalıdır. Üretim yayınında alan adı/kural katmanı ve canonical/robots/header birleşimi ayrıca kontrol edilmelidir.
