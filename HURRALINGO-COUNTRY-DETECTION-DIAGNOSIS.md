# Hurra Lingo — Canlı ülke tespiti incelemesi

## Güncel karar: Fransızca içerik hazırlanana kadar Fransa → İngilizce

18 Ekim 2026: Kullanıcı, sitede henüz Fransızca dil seçeneği olmadığını belirterek Fransa IP'sinin `/en/` yönlendirmesinde kalmasını istedi. Bu nedenle kısa süreli `FR: 'tr'` değişikliği geri alındı; güncel eşleştirme `FR: 'en'` biçimindedir. IP önceliği, açık menü tercihlerinin üstünlüğü ve diğer ülkelerin eşleştirmeleri korunur. Fransızca sayfa veya yeni dil URL'si oluşturulmadı; Fransızca içerik ayrıca hazırlanıp yayımlandığında eşleştirme yeniden ele alınacaktır. Aşağıdaki FR→TR bölümü önceki ve geçersiz kılınmış kararın tarihsel kaydıdır.

## Önceki Fransa IP değişikliği — geri alındı

Fransa'dan `/en/` yönlendirmesinin kaynaktaki açık nedeni `FR: 'en'` eşleştirmesiydi. Fransa `FR: 'tr'` olarak düzeltildi. Kullanıcının bu turdaki onayıyla IP ülkesi önceliklidir: açık menü tercihi → bilinen ülke eşleştirmesi → desteklenen tarayıcı dili → Türkçe. Fransa artık tarayıcı dili Fransızca, İngilizce, Almanca veya Türkçe olduğunda `/` açar; kayıtlı İngilizce/Almanca tercihi ve doğrudan `/en/` bağlantısı korunur. Diğer ülke eşleştirmeleri değişmedi.

Regresyon testinde Fransa'nın üç eski İngilizce beklentisi Türkçeye çevrildi; Türkçe tarayıcı, Fransa'da kayıtlı İngilizce/Almanca, cookie üzerinden İngilizce ve doğrudan İngilizce URL senaryoları eklendi. Yeni beklenti eski kodla başarısız oldu; düzeltilen kodun doğrulama sonucu `docs/auto-language/fix-verification.json` dosyasındadır. Fransa yanıtları testte kontrollü olarak üretilir; bu ortamdan fiziksel Fransa VPN testi yapıldığı iddia edilmez.

Yerel doğrulama başarılı: 58 ana senaryo, altı gerçek masaüstü/mobil menü geçişi, 182 sayfada içerik/canonical/hreflang koruması; beklenmeyen konsol veya JavaScript hatası yok. Ülke endpoint'i ve diğer ülke eşleştirmeleri değiştirilmedi. Yayın öncesi geri dönüş sürümü `02681798-d70f-488d-8658-8a2047cc429b`, kaynak `a69757200827e95b86435f3b661668138f207eef` olarak Cloudflare API'sinden kaydedildi. Eski bölümlerdeki yalnızca yerel çalışma ve FR→EN ifadeleri tarihsel kayıttır; bu bölümdeki FR→TR kuralı günceldir.

## Güncel uygulama: ilk ziyaret ülke önceliği ve Türkçe fallback

18 Ekim 2026 tarihli son kullanıcı talebi uygulanmıştır. Bu bölüm aşağıdaki önceki incelemenin üzerine gelen güncel durumdur; önceki İngilizce fallback beklentileri artık geçerli değildir. Bu çalışmanın başlangıcında Git çalışma ağacı temizdi, HEAD `fe6cae8bec8c4a4c8fb3932279844d8ca28df152` idi.

### Uygulanan davranış

`assets/auto-language.js` güncellendi. Manuel tercih yoksa ülke, tarayıcı dilinden önce değerlendirilir:

| Ülke | Hedef |
| --- | --- |
| TR | `/` |
| DE, AT | `/de/` |
| AZ | `/az/` |
| GB, FR, US, CA, AU | `/en/` |
| Diğer/bilinmeyen ülke | Desteklenen ilk tarayıcı dili; eşleşme yoksa `/` |

Bu değişiklikte CA/AU İngilizce ülke grubuna eklendi; son fallback İngilizceden Türkçeye çevrildi. Örneğin CA + Almanca tarayıcı artık `/en/`; bilinmeyen ülke + Fransızca tarayıcı artık `/` seçer. İngilizce desteklenen bir tarayıcı dili olduğu için ülke bilinmiyorsa İngilizce tarayıcı yine `/en/` seçer.

Kayıtlı menü seçimi localStorage ve cookie'den okunur, en yeni kayıt kazanır ve ülke isteği yapılmaz. Otomatik sonuçlar kaydedilmez. Menü bağlantılarının mevcut sayfanın dil karşılığına geçişi, masaüstü/mobil ortak davranış, yalnızca `/` üzerinde otomatik seçim, query/hash koruması ve döngü önlemleri korunmuştur. JS kapalıyken Türkçe HTML erişilebilir.

`functions/api/country.js` incelendi ve değiştirilmedi: yalnızca Cloudflare'ın `request.cf.country` metadata'sı okunur. Metadata geçersiz/yoksa `country: null` döner; endpoint Türkiye varsaymaz. Bu durumda istemci desteklenen tarayıcı dilini, ardından Türkçeyi kullanır. Ağ/HTTP/JSON hatası veya mevcut 900 ms sınırının aşılması da aynı fallback'i kullanır. Bekleyen istek sırasında manuel seçim otomatik sonuç tarafından geri alınmaz. Başlık, environment veya query'den ülke uydurma yolu eklenmedi; IP okunmaz/loglanmaz/saklanmaz.

### Canlı ortamı yeniden inceleme

Cloudflare API'sinden salt okunur olarak yeniden doğrulandı:

- Production deployment: `a9447e8c-4924-4b0b-8e79-1c59075fda96`, durum `success`, `uses_functions: true`.
- Yayındaki commit: `fe6cae8bec8c4a4c8fb3932279844d8ca28df152`; bu çalışmanın başlangıç HEAD'iyle eşleşiyor.
- Build loglarında `HEAD is now at fe6cae8`, `/functions` yüklemesi, başarılı Worker derlemesi ve `_routes.json` yüklemesi var.
- Build destination `dist/cloudflare-pages`; kaynak paketleme akışı önceki incelemeyle aynı. Production/preview environment değişkenleri boş.
- Zone Worker route listesi boş. Page Rules, Rulesets (Cache/Redirect/Transform ayrıntıları) ve DNS ayrıntılarına erişim yine HTTP 403; bunların bulunmadığı iddia edilmiyor.
- Bu ortamdan **hem apex hem www** kök isteği HTTP 200 verdi; aralarında HTTP yönlendirmesi gözlenmedi. Her iki hostname'in kendi `/cdn-cgi/trace` yanıtı `TR`, `/api/country` yanıtı `TR`; endpoint `DYNAMIC`.

`docs/auto-language/country-diagnosis-live.json` bu çalışmanın www ölçümüyle yenilendi. Kaydın `asset.matchesStartingHead: true` olması yayındaki JavaScript'in başlangıç commit'iyle eşleştiğini gösterir. `asset.matchesWorkingTree: false` ise **bu görevde yapılan yeni CA/AU ve Türkçe fallback değişiklikleri yayımlanmadığı için beklenir**; eski/yanlış bir production sürümünün kanıtı değildir. Tanı komutunun bu karşılaştırma nedeniyle çıkış kodu 1 vermesi raporlanmıştır.

**Almanya VPN'inde Cloudflare trace DE iken endpoint'in TR dönmesinin kesin nedeni hâlâ kanıtlanamadı.** Bu ortamdan gerçek Almanya VPN'iyle test yapılmadı; TR/TR canlı ölçümü DE davranışının doğrulaması değildir. Function doğru ülke kaynağını kullanıyor, fakat kullanıcının Almanya isteğine ulaşan gerçek metadata bu ortamdan gözlenemedi. İstemci güvenilir endpoint'ten TR alırsa bunu DE diye düzeltemez; yeni ülke eşleştirmesi bu ayrı problemi çözmüş sayılmaz.

Apex ve www ayrı origin'lerdir. Mevcut cookie host bazlıdır, localStorage da origin bazlıdır; bir hostname'deki manuel kayıt diğerinde otomatik olarak görünmeyebilir. Bu görevde hostname yönlendirmesi veya cookie domain kapsamı değiştirilmedi. Kullanıcının testlerinde kullanılan tam hostname ve aynı hostname'in trace'i karşılaştırılmalıdır.

### Build/paket doğrulaması

`node scripts/package-preview.cjs` yalnızca **yerel disk üzerinde** çalıştırıldı. Deployment oluşturulmadı. Yeniden oluşturulan `dist/phase-1b-preview` üzerinde şu kontroller geçti:

- Paketlenmiş `assets/auto-language.js`, güncel çalışma dosyasıyla byte düzeyinde aynı.
- `_routes.json`: `version: 1`, `include: ["/api/country"]`, `exclude: []`.
- Functions'ı devre dışı bırakan `_worker.js` veya statik `/api/country` override'ı yok.
- Git tabanlı Pages build'inde Function repo kökündeki `functions` dizininden derlenir; canlı build logları bu adımı doğruluyor. Function'ın statik assets içine kopyalanmaması hata değildir.

Kaynak HTML sayfaları yeniden üretilmedi. Yerel paket oluşturmak preview yayını değildir. Function metadata/routing dayanakları: [Cloudflare Request API](https://developers.cloudflare.com/workers/runtime-apis/request/#incomingrequestcfproperties), [Pages Functions routing](https://developers.cloudflare.com/pages/functions/routing/).

### Son yerel testler

`scripts/check-auto-language.cjs` yeni kurallara göre güncellendi. Chromium üzerinde `/api/country` yanıtları **simüle edilerek** şu istenen senaryolar kontrol edildi:

| Senaryo | Sonuç |
| --- | --- |
| DE + İngilizce tarayıcı + temiz tercih | `/de/` |
| DE + Türkçe tarayıcı + temiz tercih | `/de/` |
| TR + İngilizce tarayıcı + temiz tercih | `/` |
| AZ + Türkçe tarayıcı + temiz tercih | `/az/` |
| FR + Fransızca tarayıcı + temiz tercih | `/en/` |
| DE + manuel İngilizce | `/en/` |
| DE + manuel Türkçe | `/` |
| Ülke yok + Fransızca tarayıcı | `/` |

Cookie'de tek başına saklı Türkçe/İngilizce tercihler, CA/AU'nun tarayıcıdan bağımsız İngilizce seçmesi, diğer ülkelerde tarayıcıya dönüş ve hata durumunda desteklenen İngilizcenin korunması da kapsanır. İlk test denemesinde yeni cookie fixture'ı `about:blank` belgeye yazmaya çalıştığı için test hatası verdi; kurulum Playwright'ın `context.addCookies` API'sine taşındı. Uygulama cookie kodu değiştirilmedi.

Son çalıştırmalar:

- `npm.cmd run language:check`: başarılı, çıkış kodu 0; 53 ana senaryo, 6 masaüstü/mobil menü geçişi, 182 sayfanın içerik/SEO kontrolü; ayrıca 8 metadata/başlık/environment, 7 istek izolasyonu ve 8 tanı komutu fixture'ı. Nihai sonuç `docs/auto-language/fix-verification.json` içinde `pass: true`; sayfa/konsol hatası yok.
- `npm.cmd run site:check`: başarılı; 182 sayfa, 11.275 bağlantı, 2.709 varlık ve korunmuş içerik/fiyat kontrolleri.
- `npm.cmd run pricing:check`: başarılı; 184 bağımsız Excel formülü ve 60 fiyat senaryosu.
- Yerel paket bütünlüğü/routing kontrolleri: başarılı.
- `git diff --check`: başarılı, çıkış kodu 0; son diff üzerinde whitespace hatası yok.

### Korunan dosyalar ve yayın sınırı

182 sayfa, dört dilde içerik, canonical/hreflang, sitemap/robots, bloglar, öğretmenler, görseller, fiyat motoru/verileri/ödeme koşulları ve tasarım değiştirilmedi. Görev değişiklikleri `assets/auto-language.js`, `scripts/check-auto-language.cjs`, iki mevcut test/tanı JSON'u ve bu raporla sınırlıdır. Genel testlerin içerik değişikliği üretmediği doğrulama JSON'larında özgün satır sonları korunur.

Yeni davranış şu anda **yalnızca çalışma ağacındadır**. Commit, push, sync, merge veya Cloudflare production/preview deployment yapılmadı. Gerçek DE/AT/AZ/TR/FR/GB/US/CA/AU çıkışları, yeni kod kullanıcı tarafından yayımlandıktan sonra aynı hostname'de temiz tercihle ayrıca denenmelidir. Almanya endpoint çelişkisi için önceki bölümdeki aynı-origin tanı ve yetkili Cloudflare kural incelemesi gerekliliği devam eder.

---

## Önceki inceleme kaydı

Tarih: 18 Ekim 2026, Europe/Istanbul. İncelenen başlangıç Git sürümü: `615be4864a839fcb92e91a84424d7eea333a46a7`. Başlangıç çalışma ağacı temizdi.

## Sonuç ve kesinlik sınırı

**Almanya VPN'inde görülen `DE`/`TR` çelişkisinin kesin kök nedeni bu incelemede belirlenemedi.** Kullanıcının gerçek VPN bulgusu geçerli bir hata bildirimi olarak ele alındı; benim bağlantımdaki Türkiye sonucu, Almanya sorununun çözüldüğünün kanıtı değildir.

Kaynak Function'da sabit Türkiye değeri, Türkiye fallback'i, ortam değişkeninden ülke okuma, test mock'u veya başlığa güvenme bulunmadı. Canlı JavaScript mevcut kaynakla eşleşiyor. Cloudflare API'sinden production'ın mevcut commit'i kullandığı ve Functions/routing yüklemesinin başarılı olduğu doğrulandı. İncelenen canlı endpoint yanıtları cache HIT değil, `DYNAMIC` idi.

Bu kanıtlarla ülke algoritmasını değiştirmek veya `CF-IPCountry` başlığını alternatif kaynak yapmak gerekçelendirilemedi. **`functions/api/country.js` ve `assets/auto-language.js` değiştirilmedi.** Bunun yerine aynı ağdan güvenilir karşılaştırma sağlayan bir tanı komutu eklendi; metadata güven sınırı, istekler arası izolasyon ve tanı aracının özel verileri dışarı çıkarmaması test edildi. Canlı sorunun giderildiği iddia edilmemektedir.

## 1. Kullanıcının bulgusu ve kendi canlı gözlemlerim

Kullanıcı Windscribe Almanya çıkışında harici ülke kontrolü ve Cloudflare trace için `DE`, Hurra Lingo endpoint'i için hem düz hem farklı sorgulu URL'de `TR`, kök girişte `/en/` bildirdi. Kullanıcının IP adresi bu rapora veya yeni test/kanıt dosyalarına kopyalanmadı.

Cloudflare trace'in hangi alan adında açıldığı başlangıç bildiriminde belirtilmiyordu; bu bilgi ayrıca soruldu. `www.cloudflare.com/cdn-cgi/trace` sonucu, `www.hurralingo.com` isteğinin aynı VPN çıkışından gittiğini tek başına kanıtlamaz. Bölünmüş tünelleme, alan adına göre ağ/proxy yolu veya bağlantı değişimi olasılıkları ancak aynı tarayıcı/ağda aynı alan adı ölçümüyle ayrıştırılabilir. Bunlar **kanıtlanmış nedenler değildir**. `colo=FRA` da tek başına ziyaretçi ülkesini göstermez; veri merkezidir.

Bu ortamdan canlı `www.hurralingo.com` üzerinde ölçülenler:

| Kontrol | Gözlenen |
| --- | --- |
| `/cdn-cgi/trace` | `loc=TR`, `colo=LHR` |
| `/api/country` | HTTP 200, `{"country":"TR"}` |
| `/api/country?test=20261018de` | HTTP 200, `{"country":"TR"}` |
| Benzersiz `?diagnosis=...` sorgusu | HTTP 200, `{"country":"TR"}` |
| Endpoint cache başlıkları | `Cache-Control: private, no-store, max-age=0`, `CDN-Cache-Control: no-store`, `CF-Cache-Status: DYNAMIC`; `Age` yok |
| `/assets/auto-language.js` | HTTP 200; LF normalize edilince çalışma dosyasıyla birebir aynı |
| `/` HTTP isteği | HTTP 200; bu ölçümde sunucu tarafı `/en/` yönlendirmesi yok |

Canlı betiğin normalize SHA-256 özeti:

```text
74f7ab0f69332ea87924b2eb19d26131606fb045663759628cb4424dfe3e2503
```

Tekrarlanabilir son HTTP ölçümünün kanıtı: `docs/auto-language/country-diagnosis-live.json`. Kaydın zamanı `2026-10-18T12:56:28.293Z` (İstanbul 15:56). Bu kayıt yalnızca ülke/veri merkezi, zamanlama, cache ve asset bilgisi içerir; trace'in IP alanı veya ham trace yanıtı saklanmaz.

Canlı Chromium'da iki yeni profil de denendi. `en-US` tarayıcıda endpoint yanıtı yaklaşık 547 ms, `de-DE` tarayıcıda yaklaşık 359 ms içinde HTTP 200 geldi. İki profil de `/` üzerinde kaldı; `hl-language-choice` localStorage kaydı ve tercih cookie'si yoktu. Bu denemeler bu ortamın canlı Türkiye bağlantısıdır; Almanya VPN testi değildir.

## 2. Function ve ülke bilgisinin güven kaynağı

`functions/api/country.js`, doğrudan `onRequestGet({request})` içindeki `request.cf.country` değerini okur. `request.cf` Cloudflare'ın gelen isteğe eklediği runtime metadata'sıdır; istemcinin gönderdiği normal bir JSON alanı veya query parametresi değildir. Teknik kaynak: [Cloudflare Request API — IncomingRequestCfProperties](https://developers.cloudflare.com/workers/runtime-apis/request/#incomingrequestcfproperties).

Mevcut kod:

- Yalnızca iki büyük harfli ülke kodunu kabul eder; `XX` ve `T1` geçersiz sayılır.
- Metadata yoksa/geçersizse `country: null` döner; `TR` varsaymaz.
- `CF-IPCountry` veya başka bir istemci başlığını okumaz.
- Environment binding, localStorage, cookie, sorgu parametresi veya uzak konum servisi kullanmaz.
- IP, şehir veya tam metadata nesnesini okumaz/loglamaz/saklamaz.
- Module seviyesinde ülke veya Response saklamaz; her istekte yeni yanıt üretir.
- Cache API kullanmaz; tarayıcı ve CDN için no-store direktifleri üretir.

Dolayısıyla bu **kaynak kodun** `TR` üretmesi, kendisine ulaşan `request.cf.country` değerinin `TR` olmasını gerektirir. Bunun Almanya isteğinde neden gerçekleştiği, yalnızca kaynak kod incelemesinden çıkarılamaz. Canlı derlenmiş Function'ın byte düzeyinde kaynakla eşitliği de ayrıca doğrulanamadı.

## 3. Production, Functions ve build incelemesi

Yerel Wrangler kimliği doğrulandıktan sonra Cloudflare API'sine salt okunur GET erişimi sağlandı. Proje/dağıtım yapılandırması değiştirilmedi.

| Alan | API ile doğrulanan |
| --- | --- |
| Proje | `hurralingo-landing` |
| Production dalı | `main` |
| Aktif canonical deployment | `f0c1f073-dfe2-4142-9bc8-8341619de073` |
| Dağıtım commit'i | `615be4864a839fcb92e91a84424d7eea333a46a7` — inceleme başlangıcındaki HEAD ile aynı |
| Dağıtım sonucu | `deploy: success`, `uses_functions: true` |
| Oluşturulma | `2026-10-18T12:27:58.078224Z` |
| Yayının tamamlanması | `2026-10-18T12:28:23.845363Z` |
| Çıktı dizini | `dist/cloudflare-pages` |
| Root directory | Boş; repo kökü |
| Production/preview environment değişkenleri | İkisinin de `env_vars` alanı boş |
| Compatibility date | `2026-10-04` |

Build loglarından ilgili kanıtlar:

```text
HEAD is now at 615be48 Fix pricing navigation checks and update verification reports
Found Functions directory at /functions. Uploading.
wrangler 3.114.17
Compiled Worker successfully
Found _routes.json in output directory. Uploading.
Success: Assets published!
Success: Your site was deployed!
```

Canlı build komutu kaynak Türkçe/diğer dil üretimini, `scripts/package-preview.cjs`, main dalında `scripts/package-production.cjs` ve seçilen paketin `dist/cloudflare-pages` dizinine temiz kopyalanmasını içeriyor. Mevcut paketleyici `assets` dizinini kaynaklardan kopyalar. Canlı asset karşılaştırması da güncel dil betiğinin gerçekten servis edildiğini doğruladı.

`scripts/package-preview.cjs`, `_routes.json` dosyasını şu kapsamla üretir; production paketleyicisi de bunu kopyalar:

```json
{"version":1,"include":["/api/country"],"exclude":[]}
```

Bu, ülke endpoint'inin Functions kapsamına alınmasıyla uyumludur. Query string yeni bir route oluşturmaz. Kaynakta yalnızca `functions/api/country.js` bulunuyor; middleware veya alternatif ülke Function'ı yok. Kaynakta `_worker.js` ile `/functions` dizinini geçersiz kılan bir advanced-mode giriş bulunmadı. Yerel eski `.wrangler/tmp` derlemelerinde de aynı metadata okuması görüldü; bunlar canlı sürümün kanıtı olarak kullanılmadı.

Yerelde mevcut, Git dışındaki `dist/cloudflare-pages` eski paketinde `_routes.json` bulunmuyordu; ara preview/production paketlerinde bulunuyordu. Bu eski yerel çıktı mevcut production'ın birebir kopyası değildir. Canlı build logu `_routes.json` yüklemesini doğruladığı için yerel eski dosyanın eksikliği production hatasının nedeni olarak gösterilemez. Eski `dist` içeriği yeniden yayımlanmamalıdır.

Normal Workers script/content API uçlarından Pages'in `pages-worker--20456158-production` içeriğini indirme denemeleri 404 döndü. Bu sonuç Function'ın yokluğunu kanıtlamaz: Pages API'si Functions kullanımını ve başarılı dağıtımı gösteriyor, canlı endpoint de yanıt veriyor. Ancak derlenmiş canlı Function kodunu indirip karşılaştırma bu erişim yoluyla tamamlanamadı.

Doğrudan `*.pages.dev` adreslerine bu ortamdan HTTP bağlantısı kurulamadı; deployment URL'si ile custom domain'in HTTP yanıtlarını karşılaştırma bu nedenle eksik kaldı. Eski rapordaki 17 Ekim deployment kaydı güncel production kanıtı olarak kullanılmadı.

## 4. Cache, özel kurallar ve erişim sınırları

- Zone Worker route listesi API'den başarıyla alındı: boş liste. Bu kontrolde alan adına eklenmiş klasik Worker route görülmedi.
- Page Rules API: HTTP 403, yetki yok.
- Rulesets API (Cache Rules, Redirect/Transform Rules ayrıntılarına erişim için): HTTP 403, yetki yok.
- `ip_geolocation` zone ayarı: HTTP 403, yetki yok.
- `www` DNS kaydı ayrıntıları: HTTP 403, yetki yok.
- Pages proje API'sinde apex ve `www` alan adları projenin domain listesinde bulunuyor.

Bu sınırlar nedeniyle hesapta özel bir kuralın kesinlikle bulunmadığı söylenemez. Benim canlı ölçümlerimde hem düz hem benzersiz sorgulu endpoint `DYNAMIC`, no-store ve Age olmadan döndü. Bu, **ölçülen yanıtların normal ortak CDN cache HIT'i olmadığını** gösterir; kullanıcının Almanya isteğindeki tüm yol ve kuralları kanıtlamaz. Kaynakta `Cloudflare-CDN-Cache-Control: no-store` da var; bu direktif Cloudflare tarafından tüketilebildiği için istemci yanıtında görünmesi şart değildir. Teknik kaynak: [Cloudflare CDN-Cache-Control](https://developers.cloudflare.com/cache/concepts/cdn-cache-control/).

## 5. `/en/` sonucunu endpoint hatasından ayrı değerlendirme

Güncel algoritmada tercih yok, istek başarılı ve 900 ms içinde `TR` geldiyse sonuç `/` olmalıdır. Benim temiz canlı profillerimde de bu davranış görüldü. Kullanıcının `/en/` sonucunu açıklayabilecek fakat henüz doğrulanmamış yollar:

1. `hl-language-choice` içinde İngilizce manuel tercih: localStorage **veya** cookie yeterlidir. İki kaydın daha yenisi kazanır. Yalnızca bir depoyu temizlemek yeterli olmayabilir. Bu durumda ülke isteği atlanır ve `/en/` seçilir; bu istenen davranıştır.
2. Ülke isteğinin 900 ms içinde tamamlanmaması, HTTP/ağ/JSON hatası: İngilizce tarayıcı `/en/` sonucuna döner. Sonradan endpoint'i ayrı sekmede açıp `TR` görmek, ilk isteğin zamanında tamamlandığını kanıtlamaz.
3. Tarayıcının eski betiği kullanması: sunucudan bu incelemede alınan dosya günceldir, fakat kullanıcının tarayıcı cache'i bu ortamdan incelenemedi. Yanıtta betik için `max-age=14400, must-revalidate` görüldü; daha önce cache'lenmiş sürüm ayrıca kontrol edilmeli.
4. Açık `hl_lang=en` query parametresi veya istemci tarafında isteği değiştiren başka bir katman: kullanıcının gerçek adresi/Network kaydı incelenmediği için elenmedi.

Bu nedenler `/api/country` yanıtının Almanya isteğinde neden `TR` olduğu sorusunu tek başına çözmez. Otomatik sonuç manuel tercih olarak saklanmadığından sırf önceki otomatik `/en/` ziyareti yeni bir manuel kayıt oluşturmaz.

## 6. Dosya değişiklikleri ve testler

| Dosya | Değişiklik |
| --- | --- |
| `scripts/diagnose-country.cjs` | Yeni, salt okunur, aynı origin üzerinde ülke/trace/query/asset tanı komutu. IP/cookie/token veya ham yanıt yazmaz. |
| `scripts/check-auto-language.cjs` | Metadata yokken sahte başlık/environment'a düşülmediğini, metadata'nın önceliğini, istekler arası ülke izolasyonunu ve tanı komutunu doğrulayan testler. |
| `docs/auto-language/fix-verification.json` | Son yerel dil testinin güncel kanıtı. |
| `docs/auto-language/country-diagnosis-live.json` | Bu ortamın aynı-origin canlı ölçümü; Almanya VPN kanıtı değildir. |
| `HURRALINGO-COUNTRY-DETECTION-DIAGNOSIS.md` | Bu rapor. |

Yeni güven sınırı testleri: 8 başlık/environment kombinasyonu ve aynı modül içinde art arda 7 farklı/eksik ülke isteği. Güvenilir metadata yokken `TR` döndürülmediği; sahte `CF-IPCountry` değerinin metadata'yı geçersiz kılamadığı kontrol edildi.

Tanı komutu için 8 ağsız fixture: uyumlu DE, bildirilen DE/TR çelişkisi, yalnızca query yanıtının farklı olması, trace eksikliği, metadata yokluğu, geçersiz endpoint içeriği, eski asset ve ağ hatası. Çelişkide başarısız çıkış kodu ve ham trace içindeki özel alanın hiçbir çıktıya sızmaması doğrulanır. Bu fixture'lar gerçek ülke testi değildir.

Çalıştırılan kontroller:

| Komut | Sonuç |
| --- | --- |
| `node scripts/diagnose-country.cjs` | Canlı ölçüm başarılı; bu ortamdan TR/TR/TR ve güncel asset. |
| `npm.cmd run language:check` | Başarılı, çıkış kodu 0; 47 ana senaryo, 6 menü geçişi, 182 içerik/SEO sayfası ve yeni güven/tanı testleri. Nihai sonuç `fix-verification.json` içinde `pass: true`. |
| `npm.cmd run site:check` | Başarılı; 182 sayfa, 11.275 yerel bağlantı, 2.709 varlık; korunmuş içerik/fiyat kontrolleri. |
| `npm.cmd run pricing:check` | Başarılı; 184 Excel formülü, 60 fiyat seçimi ve navigasyon/varlık kontrolleri. |
| `git diff --check` | Başarılı, çıkış kodu 0; son çalışma ağacında whitespace hatası yok. |

Fiyat motoru/verileri, ödeme koşulları, bloglar, diğer sayfalar, canonical/hreflang, sitemap/robots, tasarım ve onaylı dil algoritması değiştirilmedi. Genel testlerin aynı içerikle yeniden yazdığı görev dışı doğrulama dosyalarında özgün satır sonları korunarak gereksiz fark bırakılmadı.

## 7. Almanya VPN'inde sonraki somut kontrol

Almanya VPN açıkken, sitenin kendisiyle aynı origin üzerinde aşağıdaki adres yan yana kontrol edilmeli:

```text
https://www.hurralingo.com/cdn-cgi/trace
https://www.hurralingo.com/api/country
```

Trace'in ham içeriği IP içerdiğinden rapora veya konuşmaya kopyalanmamalı. Yalnızca `loc`, `colo` ve endpoint'in ülke/cache bilgisi yeterlidir. Proje klasöründe şu komut da aynı ölçümü IP kaydetmeden yapar:

```powershell
node scripts/diagnose-country.cjs
```

Komut `country-mismatch`, ağ/yanıt eksikliği veya eski asset saptarsa çıkış kodu 1 üretir. Tek bir process içindeki sıralı HTTP isteklerini karşılaştırır; VPN'in process bazlı istisnası varsa tarayıcıyla aynı ağ yolundan gitmesi ayrıca sağlanmalıdır. Tam browser storage'ını veya aynı bağlantı üzerindeki eşzamanlı istek kimliğini doğrulamaz.

Gerçek tarayıcı testinde yeni gizli profil açılmalı veya iki tercih deposu da temizlenmeli; DevTools Network'te cache devre dışı bırakılarak kök ve `/api/country` isteğinin sonucu/süresi görülmeli. Tercih testi bunun ardından ayrı yapılmalı: DE'de manuel Türkçe → `/`, manuel İngilizce → `/en/`. FR/GB → `/en/`, TR → `/`, AZ → `/az/` gerçek çıkışlardan ayrıca doğrulanmalı.

**Aynı `www.hurralingo.com` origin'i, aynı ağ/tarayıcı ve yakın zaman aralığında trace DE iken endpoint TR kalırsa**, yetkili Cloudflare hesabında Cache Rules, Page Rules, Redirect/Transform/Origin Rules, proxy/Worker zinciri ve Pages domain bağlantısı incelenmeli. Deployment'ın Functions paketi doğrudan incelenmeli veya Cloudflare desteğine deployment ID ve yalnızca ülke/sürüm/zaman bulgularıyla başvurulmalı. İstek IP'lerinin loglanması bu inceleme için gerekli değildir. Gerekirse ayrı bir sonraki değişiklikte ülke kaynağı/sürümü gibi IP içermeyen tanı başlıkları eklenebilir; bu görevde kanıtsız bir runtime değişikliği yapılmadı.

## 8. Git ve yayın durumu

Bu inceleme salt okunur Cloudflare API ve canlı HTTP kontrolleriyle yapıldı; proje/zone ayarı değiştirilmedi. Commit, push, sync, merge, production veya preview deployment yapılmadı. Değişiklikler stage edilmeden mevcut çalışma ağacında bırakıldı. Başlangıçtan itibaren production'a yeni kod gönderilmediği için bu rapor canlı bir düzeltme/yayın onayı değildir.

Son çalışma ağacı:

```text
 M docs/auto-language/fix-verification.json
 M scripts/check-auto-language.cjs
?? HURRALINGO-COUNTRY-DETECTION-DIAGNOSIS.md
?? docs/auto-language/country-diagnosis-live.json
?? scripts/diagnose-country.cjs
```
