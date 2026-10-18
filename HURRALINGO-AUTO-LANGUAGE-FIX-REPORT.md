# Hurra Lingo — Otomatik dil seçimi düzeltmesi

Tarih: 18 Ekim 2026 (Europe/Istanbul).

## Sonuç ve kapsam

Kod mevcut çalışma ağacında güncellendi. Yeni öncelik: **manuel seçim → Cloudflare ülkesi → tarayıcı dili → İngilizce**. Otomatik seçim yalnızca `/` girişinde çalışır. Diğer dil kökleri ve detay sayfaları otomatik yönlendirilmez.

Commit, push, sync, merge, production deployment veya preview deployment yapılmadı. Yerel Wrangler `pages dev --local` çalıştırılması yalnızca geliştirme sunucusudur; yayın değildir. Mevcut HTML sayfaları yeniden üretilmedi ve eski Git sürümleriyle değiştirilmedi.

## Sorunun kök nedeni

`assets/auto-language.js` önce `navigator.languages` listesini değerlendiriyordu. Desteklenen ilk dili bulunca yönlendirip dönüyordu. Bu nedenle İngilizce tarayıcı kullanan Almanya ziyaretçisi `/en/` adresine gidiyor ve `/api/country` hiç çağrılmıyordu. VPN ülkesini değiştirmek tarayıcı dilini değiştirmediğinden, bu kod bildirilen Almanya davranışını açıklıyor. Kullanıcının gerçek VPN oturumundaki storage ve ağ kayıtları bu çalışmada incelenmedi.

Ayrıca önceki eşleştirmede Fransa yoktu; desteklenmeyen tarayıcı dili ve eşleşmeyen ülke için varsayılan Türkçeydi. İstek hatasında da Türkçe sayfada kalınıyordu. Önceki otomatik testler bu eski öncelik sırasını bekliyordu; test beklentileri yeni gereksinime göre güncellendi.

## Değiştirilen ve eklenen dosyalar

| Dosya | İşlev |
| --- | --- |
| `assets/auto-language.js` | Ülkeyi tarayıcıdan önce değerlendirir; İngilizce varsayılanı ve hata/zaman aşımı dönüşünü uygular. |
| `functions/api/country.js` | Mevcut ülke endpoint'ine CDN ve Cloudflare CDN için açık `no-store` direktifleri ekler. |
| `scripts/check-auto-language.cjs` | Yeni öncelik, eşleştirmeler, hata yolları ve isteğe bağlı yerel runtime doğrulaması için testleri günceller. |
| `docs/auto-language/fix-verification.json` | Bu düzeltmenin yerel test kanıtı; önceki production/preview kanıtlarını ezmez. |
| `HURRALINGO-AUTO-LANGUAGE-FIX-REPORT.md` | Bu uygulama raporu. |

## Yeni algoritma

1. Masaüstü ve mobil dil menülerinin mevcut ortak olay yakalayıcısı her sayfada çalışmaya devam eder. Mevcut bağlantı hedefleri sayfanın diğer dildeki karşılığını korur.
2. Yol `/` değilse otomatik seçim durur; ülke isteği gönderilmez.
3. Açık menü seçimine ait kayıt varsa doğrudan uygulanır; ülke isteği gönderilmez. Her iki depolama yolu engelliyken köke açık dönüşü koruyan mevcut `hl_lang` parametresi de korunur.
4. Manuel seçim yoksa `/api/country` çağrılır; bu aşamada İngilizce dahil hiçbir tarayıcı dili ülke bilgisinin önüne geçmez.
5. Aşağıdaki eşleştirme varsa uygulanır. Diğer ülkeler veya bilinmeyen ülke, tarayıcı diline bırakılır.
6. Tarayıcının sıralı dil listesinde desteklenen ilk `tr`, `en`, `de`, `az` dili kullanılır. Bölge, yazı sistemi ve geçerli BCP 47 uzantıları desteklenir; geçersiz etiketler atlanır. Eşleşme yoksa `/en/` seçilir.

| Ülke | Hedef |
| --- | --- |
| TR | `/` |
| DE, AT | `/de/` |
| AZ | `/az/` |
| GB, FR, US | `/en/` |
| Diğer/bilinmeyen | Tarayıcı dili, ardından `/en/` |

HTTP hatası, ağ hatası, bozuk JSON veya 900 ms zaman aşımında tarayıcı dili/İngilizce uygulanır. `fetch` veya `AbortController` bulunmuyorsa da aynı dönüş kullanılır. Zaman aşımından sonraki yanıt yeni karar oluşturamaz. İstek beklerken yapılan manuel seçim, `chosen` koruması ve yeniden tercih okuma sayesinde otomatik sonuç tarafından geri alınmaz.

Türkçe için kökte kalınır; diğer diller için `location.replace` kullanılır. Sorgu parametreleri ve hash korunur. Hedef dil köklerinde otomatik seçim tekrar çalışmadığından döngü oluşmaz.

## Cloudflare ülke bilgisi, gizlilik ve cache

Mevcut Pages Function `functions/api/country.js`, Cloudflare'ın sağladığı `request.cf.country` alanını okur. Yeni Worker veya harici IP konum servisi eklenmedi. Yalnızca iki büyük harften oluşan geçerli ülke kodu döner; `XX`, `T1`, eksik veya geçersiz değer `null` olur. Yanıt yalnızca `{ "country": "DE" }` benzeri bir ülke nesnesidir.

Uygulama IP adresi okumaz, depolamaz veya loglamaz; veritabanı, KV, analitik veya coğrafya geçmişi yazımı yoktur. Ülke isteği `credentials: 'omit'` ile gönderilir. Cloudflare'ın kendi ağ işletimi/log politikaları bu kodun yönettiği kapsamın dışındadır ve değiştirilmemiştir.

Tarayıcı isteğinde `cache: 'no-store'`; Function yanıtında `Cache-Control: private, no-store, max-age=0`, `CDN-Cache-Control: no-store` ve `Cloudflare-CDN-Cache-Control: no-store` bulunur. Uygulama Cache API kullanmaz. Kök HTML herkes için aynı Türkçe statik dosyadır; ülkeye göre HTML ya da HTTP yönlendirmesi cache'lenmez. Mevcut paketleme yalnızca `/api/country` için Functions çalıştıracak `_routes.json` üretmektedir; bu yapı değiştirilmedi.

Teknik dayanak: [Cloudflare Request API](https://developers.cloudflare.com/workers/runtime-apis/request/) ve [Cloudflare CDN-Cache-Control](https://developers.cloudflare.com/cache/concepts/cdn-cache-control/). Canlı hesaptaki özel Cache Rules bu görevde incelenmedi; yayın sonrası endpoint'in ülkeye göre doğru yanıt verdiği ve cache HIT üretmediği ayrıca kontrol edilmelidir.

## Manuel tercih saklama

Mevcut `hl-language-choice` anahtarı korunur. Yalnızca dil menüsü seçimi `dil.zaman` biçiminde localStorage'a ve bir yıllık cookie'ye yazılır. Cookie `Path=/; SameSite=Lax`, HTTPS altında ayrıca `Secure` kullanır. İki depodaki kaydın daha yenisi kazanır; eski düz dil değerleri de okunur.

Otomatik ülke/tarayıcı seçimi hiçbir tercihi kaydetmez. localStorage veya cookie engellendiğinde mevcut yedek davranışlar korunmuştur. İkisi de tamamen engelliyse Türkçe köke açık menü geçişinde `hl_lang=tr` parametresi seçimi korur; sonraki parametresiz ziyaret için kalıcı tercih saklanamaz.

## Yerel testler

### Simüle edilmiş ülke senaryoları

Chromium/Playwright, gerçek yerel HTML ve JavaScript dosyaları üzerinde çalıştırıldı. Bu tablodaki ülkeler `/api/country` yanıtı test tarafından sağlanarak simüle edildi; gerçek VPN/IP testi değildir.

| Senaryo | Beklenen ve doğrulanan sonuç |
| --- | --- |
| DE, tercih yok, İngilizce/Almanca/Türkçe/Fransızca tarayıcı | `/de/` |
| FR, tercih yok, Fransızca/Almanca/İngilizce tarayıcı | `/en/` |
| GB, tercih yok | `/en/` |
| TR, tercih yok, İngilizce tarayıcı | `/` |
| AZ, tercih yok, İngilizce tarayıcı | `/az/` |
| AT, tercih yok | `/de/` |
| DE, manuel Türkçe | `/`; ülke isteği yok |
| DE, manuel İngilizce | `/en/`; ülke isteği yok |
| Ülke bilinmiyor, Almanca tarayıcı | `/de/` |
| Ülke bilinmiyor, Fransızca tarayıcı | `/en/` |
| Doğrudan dil kökü/blog/ücret/öğretmen sayfası | Otomatik yönlendirme ve ülke isteği yok |
| JavaScript kapalı | Türkçe kök HTTP 200, içerik ve canonical erişilebilir |

Test paketi toplam **47 ana senaryo**, **6 gerçek masaüstü/mobil menü geçişi** ve **182 sayfanın içerik/SEO doğrulamasını** kapsar. Menü geçişleri Almanca ana sayfa, ücret ve eşlenmiş blogdan Türkçe karşılığına 1440 ve 390 piksel genişliklerde sınanır. Ayrıca İngilizce/Almanca manuel seçim, cookie yedeği, dolu localStorage, salt okunur cookie, iki depolamanın engellenmesi, bekleyen ülke isteği sırasında seçim, query/hash, otomatik tercihin kaydedilmemesi ve yönlendirme sayısı kontrol edilir.

### Komutlar ve sonuçlar

- `node scripts/serve-local.cjs`: kaynak çalışma ağacını `127.0.0.1:8017` üzerinde sundu.
- `npm.cmd run language:check`: ilk çalıştırmada 46 senaryo geçti. Öğretmen detay rotası ve yerel runtime kontrolü eklendikten sonra son çalıştırma 47 senaryodur; nihai makine çıktısı `docs/auto-language/fix-verification.json` dosyasındadır.
- `npm.cmd run site:check`: geçti. 182 canonical sayfa, 11.275 yerel bağlantı, 2.709 varlık, 38 öğretmen, korunan yazı içerikleri ve sitemap kontrolleri başarılı. Aynı komut fiyat hesaplarını bağımsız olarak 184 Excel formülü ve 60 senaryoyla doğruladı.
- `npm.cmd run pricing:check`: eski menü varsayımında başarısız (`scripts/check-pricing.cjs:45`, gerçek 2 bağlantı, beklenen 1). Aynı ücret sayfasının başlangıç `HEAD` sürümünde de `#drawer a[href="/ucretler/"]` sayısı 2 olarak doğrulandı. Bu önceden mevcut test uyumsuzluğudur; fiyat motoru hatası değildir. Güncel `site:check` zaten bu eski menü varsayımlarını dışarıda bırakıp bağımsız hesap kontrollerini çalıştırmaktadır. Kapsam dışındaki fiyat/menü dosyaları değiştirilmedi.
- İlk `npm run ...` denemeleri PowerShell'in `npm.ps1` çalıştırma kısıtına takıldı; sistem politikası değiştirilmeden `npm.cmd` kullanıldı.
- `git diff --check`: geçti.

### Yerel Cloudflare runtime

Önbellekte kurulu Wrangler 4.145.0 ile `pages dev dist/cloudflare-pages --ip 127.0.0.1 --port 8018 --local` çalıştırıldı. Function başarıyla derlendi. Son dil testi `HURRA_COUNTRY_RUNTIME_ORIGIN=http://127.0.0.1:8018` ortam değişkeniyle endpoint'i gerçek yerel runtime üzerinden HTTP ile de denetler: HTTP 200, yalnızca ülke alanı, `private/no-store`, CDN `no-store` ve noindex doğrulanır.

Bu runtime kontrolünde mevcut `dist/cloudflare-pages` yalnızca statik sunucu girdisidir; eski paket güncellenmedi veya yayımlanmadı. Tarayıcı regresyonları güncel kaynakları sunan 8017 portunda yapılır. Yerel runtime ülke değeri gerçek bir Almanya/Fransa VPN kanıtı sayılmaz. Derlemede mevcut paketin 6 mükerrer Unicode yönlendirme kuralı ve belirtilmemiş compatibility date uyarısı görüldü; bunlar bu düzeltmenin kapsamı dışında bırakıldı.

## Gerçek IP/VPN ile doğrulanması gerekenler

Bu çalışmada **gerçek VPN testi yapılmadı** ve canlı siteye yeni kod gönderilmedi. Kullanıcının başlangıçta bildirdiği VPN sonuçları önceki sürüme aittir. Simülasyon veya yerel runtime sonuçları canlı coğrafya doğrulaması olarak sunulmamaktadır.

Kullanıcı yayın kararını verdikten sonra temiz tarayıcı profiliyle DE, FR, GB, TR ve AZ çıkışları denenmeli. Önceki manuel tercihi kaldırmak için hem localStorage hem cookie temizlenmeli; yalnızca birini temizlemek yeterli değildir. Her çıkışta `/api/country` yanıtının beklenen ülkeyi taşıdığı, Cache-Control/CDN davranışı ve kök hedefi kontrol edilmeli. DE'de Türkçe ve İngilizce manuel seçimden sonra kök yeniden açılıp tercihin korunduğu da doğrulanmalı. VPN sağlayıcısının çıkış ülkesinin Cloudflare tarafından farklı sınıflandırılması ayrıca mümkündür.

## SEO, içerik ve performans etkisi

182 HTML sayfası, bloglar, öğretmen bilgileri, ücret motoru/verileri, canonical/hreflang, sitemap, robots, tasarım ve animasyon dosyaları değiştirilmedi. Testler tüm sayfalarda `main` içerik hash'ini ve canonical/hreflang/robots değerlerini mevcut baseline ile karşılaştırır. Satır sonu dönüşümleri içerik farkı sayılmadan normalize edilir.

HTTP tarafında kök Türkçe içerik sunmayı sürdürür; JavaScript kapalı erişim korunur. Otomatik yönlendirme mevcut istemci tarafı yaklaşımında kalır. Ülkeye göre tarayıcı yönlendirmesi kökün arama motorları tarafından render edilmesini etkileyebilir; canonical/hreflang korunması tek başına indeksleme garantisi sağlamaz. Yayın sonrası Search Console'da kök render'ının izlenmesi uygundur.

Manuel tercihi olmayan kök ziyaretinde artık desteklenen tarayıcı dillerinde de bir ülke isteği gerekir. HTML render'ı bekletilmez; yönlendirme ülke yanıtını en fazla 900 ms bekler. Bu sırada kısa süre Türkçe içerik görülebilir. Manuel tercihli girişlerde ve doğrudan detay/dil URL'lerinde ek ülke isteği yoktur. Otomatik tespit saklanmadığı için tercihsiz sonraki kök ziyaretinde tekrar tespit yapılır.

## Git çalışma ağacı ve commit/sync öncesi

Başlangıç `git status --short` çıktısı boştu. `HEAD`: `7802fb2` (`[CF-Pages-Skip] docs: record verified automatic language production release`). Önceki raporda söz edilen kaydedilmemiş değişiklik bu çalışma ağacında görülmedi; uzak production ile yeni bir birebir karşılaştırma yapılmadı.

Son durumda yalnızca aşağıdaki görev dosyaları değişmiş/eklenmiş olmalıdır:

```text
 M assets/auto-language.js
 M functions/api/country.js
 M scripts/check-auto-language.cjs
?? HURRALINGO-AUTO-LANGUAGE-FIX-REPORT.md
?? docs/auto-language/fix-verification.json
```

Genel site testlerinin yeniden yazdığı mevcut doğrulama JSON'larında yalnızca satır sonu farkları oluştu; bunlar özgün CRLF biçimine döndürülerek görev dışı farklar kaldırıldı. Hiçbir kaynak dosya Git'teki eski içerikle değiştirilmedi.

Commit/sync kararından önce diff ve bu rapor birlikte değerlendirilmeli; son test JSON'unda `pass: true` görülmeli. `dist` altındaki eski paketler bu düzeltmenin yayın adayı değildir; kullanıcı yayınlayacağı zaman mevcut build akışı güncel `assets/auto-language.js` dosyasını ve `functions/api/country.js` Function'ını içermelidir. Canlı cache kuralları ve gerçek VPN kontrolleri yerel testlerden ayrı tamamlanmalıdır. Tüm değişiklikler commit edilmeden ve stage edilmeden mevcut çalışma ağacında bırakılmıştır.
