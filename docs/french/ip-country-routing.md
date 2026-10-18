# Çok dilli ülkelerde IP yönlendirmesi — kısa rapor

19 Ekim 2026. Bu düzenleme, önceki Kanada/Belçika/İsviçre → `/fr/` politikasının yerine geçer.

Son netleştirilen kural: manuel seçim yokken **Fransa IP’si, tarayıcı dili İngilizce, Almanca veya başka bir dil olsa da `/fr/` açar**. Tarayıcıdaki Fransızca desteği kaldırılmadı; mevcut öncelik manuel seçim → IP ülkesi → tarayıcı dili → Türkçe olarak korunur. Bu öncelik zaten uygulamada bulunduğu için son netleştirmede uygulama kodunu değiştirmek gerekmedi; regresyon testleri genişletildi.

| Ülke | Manuel tercih yoksa |
|---|---|
| Kanada (CA) | Tarayıcı Fransızca olsa bile `/en/` |
| Belçika (BE), İsviçre (CH) | Desteklenen ilk tarayıcı dili; yoksa Türkçe `/` |
| Fransa dahil korunan 38 Fransızca ülke/bölge kodu | `/fr/` |
| TR; DE/AT; AZ; GB/US/AU | Sırasıyla `/`; `/de/`; `/az/`; `/en/` — değişmedi |

BE/CH için `fr-*` → `/fr/`, `de-*` → `/de/`, `en-*` → `/en/`; yalnızca Hollandaca veya İtalyanca gibi desteklenmeyen tercih varsa `/` açılır. Mevcut Türkçe ve Azerbaycanca tarayıcı desteği korunur. Kanada/Belçika/İsviçre, Fransızca ülke varsayılan listesinden çıkarıldı; diğer 38 kod değişmedi. Tam liste ve istisnalar: [ip-country-policy.json](ip-country-policy.json).

Manuel localStorage/cookie tercihi her zaman önceliklidir. Otomatik yönlendirme yalnızca kök `/` için çalışır; doğrudan dil ve içerik URL’leri korunur. Cloudflare `/api/country` işlevi, güvenilir metadata ve `no-store` kuralları değiştirilmedi.

Değişen uygulama: `assets/auto-language.js`. Test: `scripts/check-auto-language.cjs`; çalışma zamanı ülke tablosunun tamamı bağımsız politika listesiyle karşılaştırılır. Ayrıca tüm Fransızca kodlar, CA/BE/CH tarayıcı dilleri, manuel tercihler, cookie ve doğrudan URL senaryoları tarayıcıda kontrol edilir.

Kontroller geçti:

- `npm.cmd run language:check`: 165 senaryo ve 6 gerçek menü geçişi; Fransa IP’sinin farklı tarayıcı dillerine üstünlüğü, ülke tablosunun tamamı, 38 Fransızca kod, CA/BE/CH istisnaları, beş manuel dil tercihi, cookie, doğrudan dil/makale URL’leri ve mevcut regresyon kontrolleri.
- `npm.cmd run french:check`: 182 mevcut sayfa ve korunan varlıklar, 53 Fransızca sayfa, SEO ve yerel bağlantılar.
- `git diff --check`: boşluk hatası yok.

Kanıt: [ip-country-verification.json](ip-country-verification.json). Ülke yanıtları yerel testte taklit edildi; gerçek VPN testi yapılmadı.

Commit, push, sync veya deployment yapılmadı. Değişiklikler yereldedir.
