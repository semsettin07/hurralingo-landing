# Hurra Lingo — otomatik dil seçimi

Tarih: 17 Ekim 2026. **Yalnızca preview yayımlandı; production değiştirilmedi.**

## Teslim

- Preview: https://a74f8ff1.hurralingo-landing.pages.dev/
- Dal önizlemesi: https://work-auto-language.hurralingo-landing.pages.dev/
- Preview deployment: `a74f8ff1-8f70-4646-a7b9-8c324b4bca7d`; Cloudflare API durumu `success`, ortam `preview`.
- Git dalı: `work/auto-language`; başlangıç HEAD: `ecd78919e3b2a27ecb19c975f5ce64b9525002ee`.
- Commit, push, merge veya production deployment yapılmadı. Preview, test edilen çalışma ağacından doğrudan yüklendi (`commit-dirty=true`); başlangıç SHA'sı yeni değişikliklerin commit edildiği anlamına gelmez.

## Mimari ve davranış

`assets/auto-language.js`, belge başında küçük bir ortak betik olarak yüklenir. Yalnızca `location.pathname === '/'` durumunda otomatik seçim yapar. İçerik gizlenmez; HTML Türkçe olarak HTTP 200 ile sunulur. JavaScript devre dışıyken Türkçe ana sayfa ve dil bağlantıları kullanılabilir.

Öncelik: açık tercih → `navigator.languages` sırasındaki ilk desteklenen dil → Cloudflare ülkesi → Türkçe. `navigator.languages` yoksa/boşsa `navigator.language` kullanılır. Etiketler `Intl.getCanonicalLocales` ile normalize edilerek ana dil alt etiketi üzerinden eşlenir; bölge, yazı sistemi ve Unicode uzantıları desteklenir. Geçersiz etiketler atlanır. Eski alt çizgili etiketler de normalleştirilir. BCP 47 örnekleriyle sınırlı sabit bir liste kullanılmaz.

Desteklenen diller `tr`, `en`, `de`, `az`; hedefler `/`, `/en/`, `/de/`, `/az/`. `/en/`, `/de/`, `/az/`, bloglar ve diğer alt sayfalarda otomatik seçim yapılmaz. Otomatik geçiş `location.replace` kullanır; sorgu parametreleri ve hash korunur. Hedef dil kökleri yeniden otomatik seçim çalıştırmadığından döngü oluşmaz.

Tarayıcı dilinde eşleşme veya kayıtlı tercih varsa ülke endpoint'i hiç çağrılmaz. Aksi durumda `/api/country` için tek istek yapılır; 900 ms sonra iptal edilir. Ağ hatası, bozuk yanıt veya ülke eksikliği Türkçe sayfayı kullanılabilir bırakır. Bekleyen istek sırasında menüden yapılan seçim üstün tutulur.

### Cloudflare

`functions/api/country.js`, Pages Functions `request.cf.country` alanını kullanır. Ülke eşleştirmesi: TR→tr, AZ→az, DE/AT→de, GB/US/CA/AU→en, diğerleri→tr. `XX`, `T1` ve geçersiz değerler bilinmeyen ülke sayılır. Bu bilgi yaklaşık IP coğrafyasıdır.

Endpoint yalnızca `{ "country": "TR" }` veya `{ "country": null }` döndürür. IP/şehir bilgisi, uygulama logu, veritabanı, harici IP servisi ve ek sunucu yoktur. Yanıt `private, no-store, max-age=0`, `noindex, nofollow` ve `nosniff` taşır. İstemci isteği `cache: no-store`, `credentials: omit` kullanır. Ülke bilgisi tarayıcı depolamasına kaydedilmez.

Paketleyici `_routes.json` üretir; yalnızca `/api/country` Function çalıştırır. Statik sayfalar ve dosyalar mevcut Pages sunumunu sürdürür. Mevcut Cloudflare build komutu değiştirilmedi: `build-locales.cjs` sonundaki kurulum adımı ve preview paketleyicisindeki route dosyası, mevcut `dist/cloudflare-pages` akışına dahildir. Pages Functions kaynakları proje kökündeki `functions/` dizininden derlenir. Wrangler preview yüklemesinde Function derlemesi ve bundle yüklemesi başarılı oldu.

### Açık tercihin saklanması

Masaüstündeki `#hd-lang a[lang]` ve mobildeki `#drawer a[lang]` bağlantıları ortak olay dinleyicisiyle izlenir. Klavye aktivasyonu ve orta tıklama da kapsanır. Mevcut gerçek sayfa eşleştirmesi, etiketler, bayraklar ve menü tasarımı korunur. Mevcut sorgu parametreleri hedefin parametrelerini ezmeden taşınır.

Yalnızca açık seçim `hl-language-choice` anahtarıyla localStorage'a ve yedek olarak bir yıllık, Path=/, SameSite=Lax, HTTPS üzerinde Secure cookie'ye yazılır. Değer `dil.zaman` biçimindedir; iki kayıt arasında en yeni açık seçim kullanılır. Böylece localStorage kotası dolduğunda eski kayıt yeni cookie tercihini, cookie yazılamadığında da eski cookie yeni localStorage tercihini ezmez. Önceki düz dil değerleri de okunabilir. Zaman yalnızca tercih sıralaması içindir; sunucuya analitik olarak gönderilmez. Otomatik tespit hiçbir zaman açık tercih olarak saklanmaz. Depolama işlemleri hata yakalama içindedir. Her iki depolama türü de engelliyse Türkçe köke açık geçişte `hl_lang=tr` parametresi kullanılır; böylece aynı tıklama tarayıcı dili tarafından geri alınmaz. Bu parametre canonical adresi değiştirmez. Bütün depolama yolları engelliyken yeni ve parametresiz bir ziyarette tercihi kalıcı hatırlamak mümkün değildir.

## Git, canlı sürüm ve geri dönüş

Başlangıç çalışma ağacı temizdi; dal `work/en-de-az-localization`, HEAD `ecd7891` idi. Önceki raporda commit edilmediği belirtilen çok dilli dosyalar mevcut Git sürümünde bulunuyor.

Canlı 182 HTML sayfası, 18 mevcut varlık ve robots/sitemap olmak üzere 202 yanıt eski production paketiyle karşılaştırıldı. 18 varlık ve robots/sitemap birebir eşleşti. HTML farkları yalnızca Cloudflare e-posta gizlemesi ve `http://www.hurralingo.com/` bağlantılarının HTTPS'e dönüştürülmesidir. Bu dönüşümler çözüldükten sonra 182 HTML'nin tamamı paketle eşleşti; açıklanamayan içerik farkı kalmadı. Kaynakların 182 sayfasında `main` içeriği, canonical/hreflang/robots ve sitemap hash'i değişiklik öncesiyle ayrıca karşılaştırıldı.

Korunan yerel yedekler:

- `dist/auto-language-baseline/production/`: değişiklik öncesi production paketinin tamamı.
- `dist/auto-language-baseline/live/`: canlıdan alınan 182 HTML yanıtı.
- `dist/auto-language-baseline/source.bundle`: değişiklik öncesi Git geçmişi.
- `docs/auto-language/baseline.json`: hash/SEO/içerik karşılaştırma kanıtı.
- `docs/auto-language/cloudflare-before.json`: Cloudflare deployment/build kaydı; kimlik bilgileri içermez.

**Geri dönüş referansı:** `446b4a60-e40d-4d51-a597-e298118d992a`, https://446b4a60.hurralingo-landing.pages.dev/ . Bu deployment hâlâ aktif production'dır. İleride onaylı bir yayından sonra geri dönüş gerekirse Cloudflare Pages deployment ekranından bu ID seçilir. Mevcut eski paket yerel yedekte ayrıca korunur; eski Git SHA'sını yeniden build etmek bu paketin birebir karşılığı sayılmaz.

Production dalı `main`; build çıktı dizini `dist/cloudflare-pages`. Production deployment ID'sinin ve build ayarlarının preview sonrasında değişmediği API ile doğrulandı (`docs/auto-language/deployment.json`). `hurralingo.com/` mevcut durumda HTTP 200 döndürüyor; mevcut olmayan bir www yönlendirmesi eklenmedi, www canonical korundu. DNS/alan adı/production build ayarları değiştirilmedi.

## Değiştirilen dosyalar

- `assets/auto-language.js`: dil seçimi, tercihi saklama ve menü olayları.
- `functions/api/country.js`: sınırlı ülke endpoint'i.
- `scripts/install-auto-language.cjs`, `scripts/build-locales.cjs`: yeniden build sırasında betiği idempotent ekleme.
- 182 canonical HTML ve üç eski dil HTML alias'ı: yalnızca ortak head betiği eklendi; ana içerikler korundu.
- `scripts/package-preview.cjs`: dar kapsamlı Function route dosyasını pakete ekleme.
- `package.json`: `language:check` komutu.
- `scripts/check-auto-language.cjs`, `check-auto-language-package.cjs`: tarayıcı/Function/paket doğrulaması.
- `scripts/audit-auto-language-baseline.cjs`, `compare-language-baseline.cjs`, `check-auto-language-deployment.cjs`: canlı karşılaştırması ve deployment denetimi. Baseline denetimi mevcut snapshot'ı ezmeye karşı korumalıdır.
- `scripts/check-pricing-browser.cjs`: çok dilli menüden sonra iki eşleşme veren eski ücret bağlantısı seçicisi `.dr-list` ile daraltıldı; artık olmayan ana sayfa anchor'ı yerine mevcut ücret bağlantısı test ediliyor.
- `.gitignore`: Wrangler'ın yerel çalışma dosyaları dışlandı.
- `docs/auto-language/` ve bu rapor: kanıtlar. Mevcut statik doğrulama JSON'ları yeni betik referansının sayımını içerir. Fiyat motoru, fiyat verileri ve diğer mevcut varlıkların hash'leri değişmedi.

## Test sonuçları

`npm.cmd run site:build`, `site:check`, `language:check`, `pricing:browser` ve `locales:browser -- --interactions-only` çalıştırıldı. Windows PowerShell yürütme politikası nedeniyle npm'nin `.cmd` girişi kullanıldı.

| Senaryo | Sonuç |
| --- | --- |
| Almanya + Almanca | `/de/` — geçti |
| Almanya + Türkçe | `/` — geçti |
| Azerbaycan + Azerbaycan Türkçesi | `/az/` — geçti |
| ABD + İngilizce | `/en/` — geçti |
| Fransa + Fransızca | `/` — geçti |
| Fransa + İngilizce | `/en/` — geçti |
| Almanya + Fransızca | `/de/` — geçti |
| ABD + Türkçe | `/` — geçti |
| Açık Almanca tercihi, sonraki giriş | `/de/` — geçti |
| Açık Türkçe tercihi, sonraki giriş | `/` — geçti |
| Doğrudan Almanca blog / Türkçe ücretler | Dil/URL korundu — geçti |
| JavaScript kapalı | Türkçe kök ve canonical çalışıyor — geçti |
| Ülke yok / ağ hatası / zaman aşımı | Tarayıcı dili veya Türkçe — geçti |
| localStorage engelli | Cookie yedeği ve tarayıcı dili çalışıyor — geçti |
| Her iki depolama yolu engelli | Açık Türkçe menü seçimi çalışıyor — geçti |

Ek kontroller: sıralı dil listesi, BCP 47 yazı sistemi/uzantıları, geçersiz etiket, tüm ülke eşleştirmeleri, doğrudan üç dil kökü ve İngilizce ücretler, sorgu/hash korunması ve yönlendirme sayısı. Toplam **34 ana senaryo**; ayrıca masaüstü/mobil ana sayfa, ücret ve eşlenmiş blogdan **6 gerçek Türkçe menü geçişi**, gerçek Almanca/İngilizce seçimi, cookie yedeği, tüm depolamanın engellenmesi, salt okunur cookie/eski kayıt, dolu localStorage kotası/eski kayıt ve bekleyen ülke isteği sırasında açık seçim doğrulandı.

- `site:check`: 182 canonical, 11.275 yerel bağlantı, 2.709 varlık referansı; Türkçe içerik ve fiyat varlıkları korunuyor. 184 Excel formülü ve 60 ücret senaryosu geçti.
- Türkçe ücret tarayıcı testi: 60 hesaplama, beş genişlik, klavye, mobil menü, CTA ve JavaScript kapalı durum geçti.
- EN/DE/AZ etkileşim testi: 180 hesaplama, öğretmen filtreleri, blog arama, mobil/masaüstü menüler ve videolar geçti; JavaScript hatası/bozuk görsel yok. `--interactions-only` önceki 834 sayfa/genişlik sonucunu yeniden kullanır; 834 görsel kontrolün tamamı bu görevde yeniden çalıştırıldığı iddia edilmez.
- Gerçek Wrangler/Cloudflare yerel runtime: paketlenmiş 182 sayfada HTTP 200/canonical/hreflang/preview noindex, ülke endpoint'inde yalnızca ülke alanı ve no-store, robots/sitemap ve 234 yönlendirme → HTTP 200 geçti. Bilinmeyen URL 404.
- `git diff --check` geçti.

Kanıtlar: `verification.json`, `runtime-browser-verification.json`, `package-verification.json`, `deployment.json`, `preview-verification.json` (`docs/auto-language/` altında). Son dosya uzak bağlantı hatasını kaydeder; başarılı uzak tarayıcı doğrulaması sayılmaz. Ülke/tarayıcı kombinasyonları Playwright'ta kontrollü ülke yanıtıyla sınanmıştır; farklı ülkelerde fiziksel VPN denemesi yapılmamıştır. Endpoint ayrıca Cloudflare yerel runtime'ında gerçek `request.cf` ile çalıştırılmıştır.

## SEO değerlendirmesi ve açık sınırlar

182 canonical URL, karşılıklı hreflang, x-default ve sitemap içeriği aynıdır. Türkçe kök canonical'ı `https://www.hurralingo.com/` olarak korunur. Ülkeye bağlı HTTP 301/302 ve User-Agent bot ayrımı yoktur; sunucunun Türkçe kök HTML'si herkes için aynıdır. Preview, önceki düzen gibi meta/header noindex ve robots Disallow ile kapalıdır. Production paketleyicisinin index/follow ve robots Allow düzeni değiştirilmedi; bu görevde yeni production paketi yayımlanmadı.

Google JavaScript yönlendirmelerini işleyebilir. Bu nedenle otomatik yönlendirilen `/` adresinin Türkçe olarak indeksleneceği kesin garanti edilemez; statik canonical/hreflang korunması bu riski tek başına ortadan kaldırmaz. Google dil tahminine göre zorunlu yönlendirme yerine erişilebilir ayrı dil URL'lerini önerir. İstenen otomatik kök davranışı uygulandı; farklı dil URL'leri doğrudan erişilebilir, Türkçe HTML ve JavaScript kapalı erişim korundu. Production öncesi bu SEO sınırlaması dikkate alınmalı; sonrasında Search Console URL Inspection ile render edilen kök ve canonical izlenmelidir. Kaynaklar: [Google çok bölgeli/dilli siteler](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites), [Google locale-adaptive sayfalar](https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages), [Cloudflare Function routing](https://developers.cloudflare.com/pages/functions/routing/).

**Uzak preview doğrulama sınırı:** Cloudflare API deployment'ı başarılı doğruluyor, ancak bu çalışma ortamından yeni preview, dal alias'ı ve önceki preview adresine HTTPS bağlantıları `ERR_CONNECTION_RESET` / curl 35 ile kesildi. Tekrar denemeler ve bağımsız web erişimi de sonuç vermedi. Bu nedenle kamuya açık preview üzerinde uçtan uca test tamamlandı denemez. Aynı yüklenen paketin yerel Cloudflare runtime testleri bu sınırlamayı açıkça ayırır. Uzak doğrulama erişim sağlandığında şu komutla tekrarlanabilir: PowerShell'de `$env:HURRA_AUTO_ORIGIN='https://a74f8ff1.hurralingo-landing.pages.dev'; npm.cmd run language:check`. İlave production yayını yapılmadı.

Ülke beklemesi en fazla 900 ms'dir; desteklenmeyen tarayıcı dilinde bu süre içinde Türkçe içerik görünebilir. İçeriği gizleyen bir yükleme ekranı eklenmedi. Her iki depolama yolunun engellenmesinde kalıcı hatırlama sınırlaması yukarıda açıklanmıştır. Wrangler yerel testinde önceki Unicode/encoded yönlendirmelerden altısı duplicate uyarısı verdi; 234 mevcut yönlendirme senaryosunun tamamı geçti ve yönlendirme listesi değiştirilmedi.

Mevcut route manifest'inde 34 Türkçe blogun üç dilde gerçek karşılığı vardır; bunların dil geçişleri korunmuştur. Ek olarak yalnızca kendi dilinde bulunan 10 eski yazının (EN 3, DE 5, AZ 2) diğer dillerde gerçek karşılığı yoktur. Bu yazılardaki mevcut dil ana sayfasına dönüş davranışı korunmuştur; 182 canonical kapsamını değiştirecek yeni çeviri sayfaları eklenmemiştir.
