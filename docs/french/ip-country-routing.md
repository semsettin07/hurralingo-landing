# Fransızca IP yönlendirmesinin genişletilmesi

19 Ekim 2026 tarihli kullanıcı talebiyle, yalnızca Fransa yerine 29 ülke ve 12 Fransız bölgesi için varsayılan `/fr/` eklendi. Tam isim/kod listesi [ip-country-policy.json](ip-country-policy.json) dosyasındadır. Bu dosya aynı zamanda bağımsız tarayıcı test girdisidir.

## Yeni kapsam

- Avrupa: Fransa, Belçika, İsviçre, Lüksemburg, Monako.
- Amerika: Kanada, Haiti.
- Afrika: Benin, Burkina Faso, Burundi, Kamerun, Orta Afrika Cumhuriyeti, Çad, Komorlar, Kongo Cumhuriyeti, Kongo Demokratik Cumhuriyeti, Fildişi Sahili, Cibuti, Ekvator Ginesi, Gabon, Gine, Madagaskar, Mali, Nijer, Ruanda, Senegal, Seyşeller, Togo.
- Okyanusya: Vanuatu.
- Ayrı ülke/bölge koduyla gelebilen Fransız bölgeleri: Fransız Guyanası, Guadeloupe, Martinik, Réunion, Mayotte, Saint-Pierre ve Miquelon, Saint-Barthélemy, Saint-Martin’in Fransız bölümü, Yeni Kaledonya, Fransız Polinezyası, Wallis ve Futuna, Fransız Güney Toprakları.

Bu, Fransızca için belirlenmiş ürün yönlendirme listesidir; her ziyaretçinin Fransızca konuştuğu veya bu ülkelerin hepsinde Fransızcanın hukuki statüsünün aynı olduğu iddia edilmez. Fransızcanın dünyadaki farklı kullanımları için [OIF’nin 2026 raporu](https://observatoire.francophonie.org/rapport-2026) incelendi. Liste, bütün OIF üyelerini veya Fransızca konuşan herhangi bir topluluğu bulunan bütün ülkeleri kapsamaz.

## Davranış

- Manuel localStorage/cookie tercihi ülke bilgisinden önce gelir.
- Yalnızca kök `/` ziyaretinde otomatik seçim yapılır.
- Listedeki ülke/bölge IP’si, tarayıcı İngilizce veya Almanca olsa bile `/fr/` açar.
- Kanada artık `/en/` yerine `/fr/` varsayılanını kullanır. Bu karar Kanada’nın tamamı içindir; Québec ayrımı yapılmaz. Belçika ve İsviçre için de bölgesel ayrım yoktur.
- TR → `/`; DE/AT → `/de/`; AZ → `/az/`; GB/US/AU → `/en/` eşleştirmeleri korunur.
- Liste dışındaki ülkelerde desteklenen tarayıcı dili, ardından Türkçe kullanılır. `fr` ve `fr-*` tarayıcı kodları Fransızca açmaya devam eder.
- Doğrudan `/fr/`, `/en/`, `/de/`, `/az/` veya içerik URL’si açıldığında otomatik ülke yönlendirmesi uygulanmaz.
- `/api/country`, güvenilir Cloudflare metadatası ve `no-store` önbellek kuralları değiştirilmedi. Yeni ülke tespit servisi eklenmedi.

## Değişiklikler ve doğrulama

- `assets/auto-language.js`: açık ülke/bölge eşleştirmeleri.
- `scripts/check-auto-language.cjs`: 41 kodun her biri için İngilizce tarayıcıyla `/fr/` kontrolü; Kanada/Belçika/İsviçre’de manuel İngilizce tercihi; Kanada IP’sinde doğrudan İngilizce URL kontrolü; mevcut regresyon senaryoları.
- `npm.cmd run french:check`: içerik, fiyat varlıkları ve SEO koruma kontrolü geçti.
- `npm.cmd run language:check`: 108 senaryo ve 6 gerçek dil menüsü geçişi geçti; 41 Fransızca ülke/bölge kodunun tamamı dahil. Sonuç: [ip-country-verification.json](ip-country-verification.json).

Test ülke yanıtları yerel tarayıcıda taklit edilir; yeni kodun gerçek Cloudflare/VPN doğrulaması yapılmadı. Commit, push, sync veya deployment yapılmadı; değişiklikler çalışma ağacında bırakıldı. Önceki 18 Ekim raporundaki tek-FR/CA→EN ülke tablosu bu güncellemeyle geçersizdir.
