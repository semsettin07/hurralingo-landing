# Hurra Lingo — çok dilli uygulama ve yayın raporu

Tarih: 16 Ekim 2026. Proje: hurralingo-landing. Hedef: **hurralingo.com**. Hurra Türkiye sitesinde değişiklik yapılmadı.

## Yayın

- İngilizce: https://www.hurralingo.com/en/
- Almanca: https://www.hurralingo.com/de/
- Azerbaycan Türkçesi: https://www.hurralingo.com/az/
- Cloudflare production deployment: `446b4a60-e40d-4d51-a597-e298118d992a`.
- Son önizleme: https://01418119.hurralingo-landing.pages.dev/
- Çalışma ağacı production paketi doğrudan yüklendi (commit-dirty=true). Referans SHA: `5937cb39153ea04ac810f5667e8a21164ab088ae`. Canlı içerik bu SHA'daki dosyalarla birebir aynı olduğu iddia edilmez; tamamlanan yerel değişiklikleri de içerir.
- Kullanıcının son canlı yayın talimatı uygulandı. Bu aşamada asistan commit, push, merge veya sync yapmadı. Git işlemleri kullanıcıya aittir.

## İçerik ve URL kapsamı

| Dil | Ana/bölüm sayfası | Blog detay | Toplam |
| --- | ---: | ---: | ---: |
| Türkçe | 9 | 34 | 43 |
| İngilizce | 9 | 37 | 46 |
| Almanca | 9 | 39 | 48 |
| Azerbaycan Türkçesi | 9 | 36 | 45 |
| Toplam | 36 | 146 | 182 |

34 Türkçe yazının her dilde karşılığı bulunuyor. Daha önce yayımlanmış karşılıklar uygun olduğunda yeniden kullanıldı; mevcut 6 İngilizce, 6 Almanca ve 3 Azerbaycan bölümü URL'si korundu. Önceden İngilizce olan Azerbaycan bölümü yazıları Azerbaycan Türkçesine çevrildi. Ek yazılar korunduğu için dil başına blog sayısı 34'ün üzerindedir. Eşleştirmeler: `content/i18n/routes.json`.

Yeni yapı: eğitim, dersler, öğretmenler, blog, ücretler, referanslar, kurumsal, iletişim ve sade ana sayfa. Büyük logo/içerik hizası, sekiz bağlantı, Dersler altında dört yaş grubu, mobil menü ve üst kırmızı CTA'nın kaldırılması üç dile uygulandı. Çerez, video, FAQ, kopyalama ve öğretmen etkileşimlerinin metinleri de yerelleştirildi.

Fiyat motoru, veriler, 2027 TL tutarları ve ödeme koşulları korunur; kur dönüşümü yapılmadı. Her dilde vergi hariç koşulu belirtilir. Türkçe sayfa gövdeleri korunup yalnızca karşılıklı dil bağlantıları ve hreflang meta verileri tamamlandı.

## Çeviri ve medya sınırları

Çeviri taslakları Google Translate ile hazırlanıp JSON'da saklandı; üretim çevrimdışıdır. Menü, temel arayüz terimleri, hesaplayıcı, sayfa başlıkları ve marka/ödül ifadeleri editoryal karşılıklarla düzeltildi. Bu rapor bütün blog paragraflarının bağımsız bir ana dil editörü tarafından onaylandığı iddiasını içermez.

Altı soru videosunun özgün Türkçe sesi ve mevcut görüntüler/animasyonlar korunur; ilgili sayfalarda ses dili belirtilir. Yeni dublaj veya altyazı üretilmedi. Yasal PDF'ler kullanıcı onayıyla özgün İngilizce dosyalarıdır; içerikleri değiştirilmedi, bağlantılarda dil/tür belirtilir. Emniyet kampanyası yeni dillerde HTML metinle sunulur; özgün Türkçe broşür bağlantısı ve dili belirtilir. Kampanya yılı/uygunluk koşulları veya Bett kapsamı hakkında yeni iddia üretilmedi; önceki ticari kaynak doğrulama açıkları geçerlidir.

## Kontroller

- Statik: 182 canonical URL, 11275 yerel bağlantı, 2527 medya referansı; 34 Türkçe yazı × 3 dil eşleşmesi geçti. Türkçe gövdeler, fiyat varlıkları ve mevcut İngilizce/Almanca blog gövdeleri korundu.
- 184 Excel formülü ve 60 temel ücret senaryosu yeniden doğrulandı.
- Yeni dil sayfalarında 834 sayfa/genişlik kombinasyonu: 320, 390, 768, 1024, 1440, 1842 px. Taşmalar düzeltildi; son kontroller geçti.
- Yerel üç dilde 180 hesaplayıcı senaryosu, 38 öğretmen/filtreler, boş sonuç, blog arama/sıfırlama, masaüstü açılır menü, mobil Escape/odak ve video diyalogu geçti. JavaScript hatası veya bozuk görsel bulunmadı.
- Önizleme: 182 sayfa HTTP 200; canonical/sitemap/noindex/X-Robots-Tag/robots engeli, 180 hesaplayıcı senaryosu, dil menüleri ve filtreler geçti. 159 medya/çalışma dosyası HTTP 200; 234 yönlendirme 301 → HTTP 200. Bilinmeyen URL 404.
- **Canlı son kontroller geçti:** 182 URL HTTP 200/canonical/indexleme; üç dilde 180 ve Türkçede 60 olmak üzere toplam 240 hesaplayıcı senaryosu; öğretmen filtreleri, blog araması, masaüstü/mobil menüler ve altı genişlik; 159 medya/çalışma dosyası; 234 yönlendirme 301 → 200; bilinmeyen URL 404. JavaScript hatası yok. Kanıt: `docs/localization/production/remote-verification.json`.

Kanıtlar: `docs/localization/static-verification.json`, `browser-verification.json`, `preview/remote-verification.json`, `production/remote-verification.json`, `deployment.json`, ekran görüntüleri ve `content/i18n/baseline.json`.

## SEO ve Cloudflare

182 URL www canonical ve doğru belge dili kullanır. Karşılığı olan sayfalarda dört dile ait karşılıklı hreflang ve dil menüsü bulunur. Eski dosya URL'leri /en.html, /de.html, /az.html doğru dil köklerine 301 yönlenir. 174 Türkçe kural, altı Unicode yardımcısı ve 54 ek dil kuralı toplam 234 yönlendirme olarak doğrulanır.

Production paketi: `dist/phase-1c-production`; index/follow, genel noindex başlığı yok, robots Allow: / ve 182 URL sitemap. Preview paketi: `dist/phase-1b-preview`; noindex/nofollow + X-Robots-Tag + robots Disallow: /. 404 noindex kalır.

Önceki canlı site son Git yayını sonrası noindex ve Disallow: / durumundaydı. Cloudflare'ın boş build komutu/kök dizin çıktısı yerine, test edilmiş çevrimdışı build komutu ve `dist/cloudflare-pages` çıktı dizini tanımlandı. Komut önce sayfaları üretir, main için production paketini; diğer dallar için engellenmiş preview paketini seçer. Henüz yeni locale üreticisi bulunmayan eski Git sürümleriyle de uyumludur. İki mod yerelde test edildi. Bu ayar değişikliği Git commit/sync gerektirmez ve DNS'i değiştirmez. Kayıt: `docs/localization/cloudflare-build-config.json`, `cloudflare-build-command.json`, `cloudflare-build-verification.json`.

## Geri dönüş ve yerel değişiklikler

Önceki aktif production ID: `adaff618-84b1-4bbc-9354-50d8b536961e`. Gerektiğinde Cloudflare Pages deployment ekranından geri dönülebilir; önceki sürümün indeksleme engeli bulunduğu not edilmelidir. Güncel sürümün testleri başarılıysa geri dönüş gerekmez. Eski build ayarları JSON kaydında tutuldu.

Güncellenenler: EN/DE/AZ sayfaları ve blogları; Türkçe dil geçişi/hreflang; `assets/site-locales.css`, `assets/i18n/`; locale üretimi ve doğrulama script'leri; sitemap/yönlendirme listeleri; paketleyiciler ve npm komutları. Fiyat motoru/verisi ve içerik kaynağı blog JSON'u değiştirilmedi. Git işlemleri kullanıcıya bırakıldı; canlı yayına giren yerel değişikliklerin kullanıcı tarafından commit/sync edilmesi gerekir.

Son editoryal kontrol: yaş etiketleri ve yetişkin seçenekleri dile uygun hale getirildi; üç dilde altı genişlik (18 ek kontrol) geçti. Son production: `446b4a60-e40d-4d51-a597-e298118d992a`. Son paket, commit/sync yapılmadan doğrudan yayımlanan çalışma ağacıdır.
