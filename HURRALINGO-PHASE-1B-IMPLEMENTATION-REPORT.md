# HURRA LINGO — Faz 1B Uygulama Raporu

Tarih: 16 Ekim 2026. Çalışma branch’i: `phase-1b-tr-multipage`.

## Güncel görsel revizyon — orijinal üst alan

Kullanıcının ekran görüntüleriyle verdiği son talimat üzerine orijinal Bett UK 2026 duyuru şeridi, sarı ödül etiketi, büyük logo, Programlar açılır menüsü ve eski mobil menü yapısı geri getirildi. Üst menü sırası yeniden **Programlar | Öğretmenler | Fiyatlar | Veli soruları | Kurumlar | Blog** oldu. Bu karar, aşağıdaki önceki Faz 1B kayıtlarındaki sekiz öğeli üst menü kararının yerine geçer. Sekiz detay sayfasına alt menüden erişim korunur.

Logo ve üst menü yeniden içerikle aynı `--wrap` genişliğinde ortalanır; 1500 px üst alan ve 160/140 px logo sınırları kaldırıldı. Eski menü bağlantıları yeni Türkçe sayfalara gider. Duyuru kapatma/hatırlama, Programlar klavye etkileşimi ve mobil menünün yaş grupları korunur. Bett duyurusunun geri alınması kullanıcının bu son talimatıyla açıkça onaylanmıştır; diğer bekleyen arşiv iddiaları eklenmedi.

Yerel kontrol: ana sayfa ve İletişim için 320, 390, 768, 1024, 1181, 1280, 1440, 1842 px olmak üzere 16 kombinasyonda yatay taşma yok, logo ve içerik sol çizgileri aynı. Açılır menü, mobil menü, Escape/odak dönüşü ve duyuru kapatma/sonraki sayfada hatırlama geçti. 43 Türkçe sayfanın kaynak doğrulaması ve 166 korunan dosya kontrolü geçti. Kanıt: [local-verification.json](docs/phase-1b-header/local-verification.json).

## Git referansı ve yayın sınırı

- Değişiklik öncesi `main` / Git referansı: `4750cad420a3d4215a3035c78aa4e2539857a033`.
- Faz 1A raporları ve başlangıç kaynaklarının saklandığı branch commit’i: `5c75b39`.
- Başlangıç dosya hash’leri: [baseline.json](docs/phase-1b/baseline.json). Fiyat dosyaları, yabancı dil dosyaları/blogları, mevcut görseller/videolar, blog verisi ve robots dahil **166 dosya** korunuyor.
- Eski ana sayfanın tamamı [home-template.html](content/site/home-template.html) içinde; önceki içerik Git referansında da bulunur. Kaynak şablonlar ve raporlar preview paketine dahil edilmez.
- Production branch’e merge veya push yapılmadı. Production deployment, DNS ve canlı indeksleme ayarları değiştirilmedi.

## Önizleme

Cloudflare Pages preview: **https://8817544b.hurralingo-landing.pages.dev**

Branch adresi: https://phase-1b-tr-multipage.hurralingo-landing.pages.dev

Cloudflare kayıtları dağıtımı **Preview**, branch’i `phase-1b-tr-multipage`, uygulama/paket commit’ini **`cef3f83d2b72123da5c8561d667a3fa29eb5e3b9`**, deployment kimliğini **`8817544b-1535-44a8-b2dc-190bd8ec944e`** olarak doğruladı. `dist/phase-1b-preview` paketinde 219 varlık ve `_headers`/`_redirects` dahil toplam 221 dosya var. Yalnızca `phase-1b-tr-multipage` Git branch’ine commit/push yapıldı; production branch’e merge/push yapılmadı. Daha sonraki rapor/test commit’leri yayımlanan site paketini değiştirmez.

**Uzak doğrulama tamamlandı.** Önceki TLS bağlantı sorunları, Chromium’da açık tutulan aynı preview bağlantısı ve sınırlı yeniden denemelerle aşıldı. Uzak ortam testlerinde iki bağlantı yeniden denemesi kaydedildi; tamamlanmamış eski denemeler başarılı gibi sayılmadı. Nihai kanıt: [remote-verification.json](docs/phase-1b-preview/remote-verification.json).

### Cloudflare proje kontrolü ve branch push

Git çalışma ağacı başlangıçta temizdi; branch `phase-1b-tr-multipage`, commit `2a0ea67` idi. Uzak `main`, `4750cad420a3d4215a3035c78aa4e2539857a033` olarak doğrulandı. Cloudflare projesi `hurralingo-landing`, GitHub kaynağı `semsettin07/hurralingo-landing`, production branch’i `main`. Build komutu/çıktı dizini boş ve otomatik preview ayarı tüm branch’lerdi. Proje yapılandırması değiştirilmedi.

Depo kökünün otomatik preview olarak yayımlanmasını önlemek için feature branch push commit’leri `[CF-Pages-Skip]` önekiyle yapıldı; istenen paket Wrangler CLI ile açıkça aynı preview branch’ine yüklendi. Bu işaret Cloudflare’ın [resmî GitHub entegrasyonu belgesindeki](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/) mekanizmadır. Eski veya yeni hiçbir commit production branch’e taşınmadı.

Kanıtlar: [project-before.json](docs/phase-1b-preview/project-before.json), [project-after.json](docs/phase-1b-preview/project-after.json), [deployment.json](docs/phase-1b-preview/deployment.json), [package-manifest.json](docs/phase-1b-preview/package-manifest.json).

### Uzak önizleme test sonuçları

| Kontrol | Uzak sonuç |
| --- | --- |
| 43 Türkçe canonical URL | 43/43 HTTP 200; canonical hedefleri doğru. |
| İndeks engeli | 43/43 sayfada `noindex, nofollow` meta ve `X-Robots-Tag`; robots `Disallow: /`. |
| Sitemap | 43 canonical URL. |
| Yabancı diller | `/en/`, `/de/`, `/az/` HTTP 200; dil etiketleri ve H1 içerikleri doğru. Yabancı kaynak dosyaları değiştirilmedi. |
| Ücret hesaplama | 60/60 tarayıcı senaryosu; ders ücreti, toplam ve aylık ödeme seçimi eşleşti. |
| Öğretmenler | 38 kişi; yedi ders dili + Tümü filtresi, Çince/Yanshan Lin ve Türkçe boş sonuç dahil sekiz seçim geçti. |
| Blog | 34 yazı, arama, boş sonuç ve sıfırlama geçti. |
| Mobil menü | Sekiz öğe, aç/kapat, Escape/odak dönüşü ve Dersler sayfasına gerçek geçiş geçti. |
| Ekran genişlikleri | 320, 390, 768, 1024, 1440 px ana sayfa; yatay taşma yok. |
| 301 yönlendirmeleri | 174/174 eski URL varyantı HTTP 301; doğru preview hedefi HTTP 200. Canlı domaine kaçış yok. |
| Hata kontrolü | Uzak etkileşim testlerinde sıfır JavaScript hatası ve sıfır beklenmeyen HTTP hatası. Bilinmeyen URL gerçek 404. |

Uzak testte, iki eski blog başlığındaki emojilerin statik Cloudflare kurallarında eşleşmediği görüldü. Yalnızca bu iki tarih/başlık segmentine özel altı `:legacyemoji` eşleştirmesi eklendi; genel `/tr/*` kuralı kullanılmadı. Toplam 174 açık kural + altı dar kapsamlı yardımcı kural, **180 satır**. İlgili 174 gerçek URL varyantının tamamı yeni preview üzerinde yeniden test edilip geçti. Fiyat motoru, içerik ve yabancı dil dosyaları bu düzeltmede değişmedi.

Uzak görseller: [masaüstü](docs/phase-1b-preview/remote-home-1440.png), [mobil](docs/phase-1b-preview/remote-home-390.png). Tekrar test: `node scripts/check-preview-remote.cjs https://8817544b.hurralingo-landing.pages.dev`.

Production deployment kimliği önce/sonra **`b61b1c9e-4744-4956-b9d0-441dac1d39f1`**, kaynak `4750cad`, branch `main` olarak aynı kaldı. Canlı Türkçe/EN/DE/AZ sayfaların ana içerikleri, canonical ve robots metaları başlangıç Git referansıyla; canlı `robots.txt` ise dağıtım öncesi yanıtıyla eşleşti. Cloudflare e-posta koruması her yanıtta farklı kod ürettiğinden ham HTML hash’i sabit değildir; içerik karşılaştırmasında bu e-posta kodları çözülür. Cloudflare build/branch/domain ayarları da önce/sonra aynı. Kanıtlar: [project-after.json](docs/phase-1b-preview/project-after.json), [production-verification.json](docs/phase-1b/production-verification.json).

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
- **174 açık 301 kuralı + altı dar kapsamlı Unicode yardımcı kuralı**: 16 kaynak sayfa, 34 tarihli blog, 4 classes yolu ve kodlama varyantlarının slash/slashsız/index karşılıkları. Emoji içeren kaynak URL’ler için literal/percent-encoded varyantları uzak Cloudflare üzerinde doğrulandı. `/tr/*` genel kuralı yok.
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

Başlangıç referansına göre tam dosya listesi: [changed-files.txt](docs/phase-1b/changed-files.txt). Güncel preview paketinin kaynağı `cef3f83`; sonraki rapor/test düzenlemeleri site paketinin içeriğini değiştirmez. Uzak test betiği `scripts/check-preview-remote.cjs`, son kanıtlar `docs/phase-1b-preview/` içindedir.

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

**Uzak preview hazırdır; görsel ve içerik onayı bekleniyor. Production’a geçiş yapılmadı.**
