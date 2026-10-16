# HURRA LINGO — Faz 1A Uygulama Planı

İnceleme tarihi: **16 Ekim 2026 (Europe/Istanbul)**. Yalnızca Faz 1A analizi ve planı; hiçbir yönlendirme, sayfa, SEO ayarı veya canlı ortam değiştirilmedi. Uygulama için kullanıcı onayı beklenir.

## Sonuç ve kapsam

Mevcut statik altyapıyla Türkçe çok sayfalı dönüşüm mümkün. Blog ve ücretler yeniden yazılmamalı: 34 TR blog detayı ve `/ucretler/` zaten var. 6 yeni sabit Türkçe sayfa hazırlanacak; ana sayfa sonraki fazda onaylı vitrin planına göre sadeleştirilecek. 9 sabit TR URL + 34 detay toplam **43 TR sayfa** eder. Bu sayı yabancı dil sayfalarını kapsamaz. Depoda 58 ziyaretçi HTML sayfası, ayrıca 4 blog kaynak HTML snapshot’ı ve 1 ücret içerik şablonu dahil toplam 63 HTML dosyası bulunur.

Bu fazda yalnızca istenen beş Markdown raporu oluşturuldu. Import/build betikleri, sayfalar, medya, robots, ücret verileri, kaynak arşivler ve yayın ayarları değiştirilmedi; push/deploy yapılmadı. WordPress tema/eklenti/CSS/JS alınmadı. HTTP/REST üzerinden okunan içerik analiz için geçici dizinde işlendi.

## İncelenen yerel kaynaklar

| Kaynak | Bulgular / sonraki kullanım |
| --- | --- |
| index.html | Tasarım tokenları, inline stiller/JS, 11 bölüm, mobil drawer, videolar, SSS, öğretmen FLIP filtresi ve CTA akışları |
| en.html / de.html / az.html | Mevcut dil dosyaları ve menü hedefleri korunacak; yerel /en/ kökü ile canlı /en/ davranışı aynı değil |
| content/blog/posts.json ve docs/blog-source/ | 49 mevcut kayıt; 34 TR; arşiv kaynağı/dil/slug/görsel/body kayıtları mevcut |
| scripts/build-blog.cjs | 4 dilin tamamını üretir; dil kapsamı daraltılmadan çalıştırmak istenmeyen değişiklik riski |
| scripts/import-blog.cjs | Ağdan içerik alır, JSON ve img/blog varlıklarını değiştirir; bu fazda çalıştırılmadı |
| scripts/build-pricing.cjs | workbook-cells.json → pricing-data.js + ucretler/index.html; header/footer index.html’den kopyalanır |
| scripts/update-pricing-home.cjs | Ana sayfada fiyat özetini yeniler; kullanıcı onayı sonrası ve tek veri kaynağıyla |
| assets/pricing-engine.js / pricing-data.js / pricing-tr.js / pricing-ui.js | Saf hesaplama, Excel verisi, TR etiketler ve UI ayrı; korunarak kullanılabilir |
| content/pricing-page.html | Ücretler ana içerik şablonu; üretilen HTML yerine burada düzenleme gerekir |
| scripts/serve-local.cjs | Statik dosya sunumu, sadece dizin slash 301; noindex response başlığı; üretim redirect sistemi değil |
| robots.txt / README.md / PHASE raporları | Hazırlık indeks engeli, önceki kadro ve dil çalışmaları; bu görevde eski dört dili birlikte değiştirme yönergesi uygulanmaz: kullanıcının TR kapsamı öncelikli |

## Ücret modülü ve Excel incelemesi

Kaynak workbook `C:\Users\sbese\Desktop\HURRA PROJE\Hurra Lingo Kurs Ücretleri TL 2027.xlsx` dosyası mevcut (21.943 bayt). Doğrudan SHA256 okuması dosyanın başka işlemce kullanılması nedeniyle başarısız oldu; dosya kapatılmadı/değiştirilmedi. Bu fazda ham Excel tekrar açılmadı veya yeniden çıkarılmadı. Analiz dayanağı mevcut `docs/pricing-2027/workbook-cells.json`, üretilmiş veri, motor ve doğrulama kayıtlarıdır. Kaydedilmiş kaynak SHA256: `558FA000859FC693C711BC6232FBD0587776BFEA6C5A5DFAD09C4B09F1807517`; bugünkü kilitli Excel ile aynı olduğu yeniden doğrulanmış sayılmaz.

Üç çalışma sayfası: TL Özel Ders Ücretleri, TL Mini Grup Ders Ücretleri, TL Grup Ders Ücretleri. 3 model × 2 öğretmen türü; aylık/6 ay/yıllık, haftada 1/2 ders, üyeliğe göre aylık/peşin/taksit: **60 geçerli seçim**. TL ve KDV hariç. Mevcut veri özel ders tabanlarını 1.099 / 1.549 TL; mini grup %30, grup %50 taban indirimi olarak tanımlıyor. 6 ay %5 üyelik + peşinde %5; yıllık %10 üyelik + peşinde %10. Bunlar yeni öneri değildir; mevcut modülün okunan kurallarıdır. `round` Excel ROUND davranışını izler; indirim adımları ayrı yuvarlanır. Aylık 4/8; 6 ay 24/48; yıllık 48/96 ders. Mevcut taksit sayısı aylık ders adedine göre hesaplanır. Başlangıç fiyatları grup 446, mini grup 623, özel 890 TL: Türk öğretmen + yıllık peşin + KDV hariç koşulu korunmalı.

Mevcut motor **salt okunur** şekilde çalıştırılarak geçmiş doğrulama JSON’undaki 60 seçimin ders ücreti ve seçili toplamı karşılaştırıldı: **60/60 eşleşti**. Geçmiş raporda 184 Excel formülünün bağımsız yeniden hesaplanması kaydı var; bu fazda 184 formül yeniden hesaplanmadı. Geçmiş tarayıcı kayıtları 320/390/768/1024/1440 genişliklerini, 60 seçimi ve hatasız yerel istekleri içeriyor; bunlar bugünkü tarayıcı testi olarak sunulmaz.

Yeni mimaride `/ucretler/` yerinde kalır. Mevcut motor ve veri dosyaları değiştirilmeden ortak Türkçe kabuğa bağlanır; ana sayfa özeti aynı veriden gelir. Üyelik/taksit alanlarının bağımlılığı, karşılaştırma özeti, KDV metni ve CTA davranışı korunmalı. WordPress fiyatları, euro/sterlin tabloları, eski 1–10 ay/3 ay üyelikleri ve eski kampanyalar yeni veri kaynağına karıştırılmaz. Bu faz yeni fiyat/ödeme politikası üretmez.

## Açık çelişkiler ve onay listesi

| No | Bulgu / kaynak | Öncelik ve önerilen karar |
| --- | --- | --- |
| A1 | Arşiv ücretleri 459/656/925 TL; farklı ders+ paketleri, EN/AZ’de £/€ ve geçmiş %15 kampanya; güncel Excel 2027 ayrı | Mevcut Excel modülü esas. Üretimde 2027 etiketinin ne zaman gösterileceği sahibi tarafından onaylanmalı |
| A2 | TR ders arşivinde mini grup 1–10 ay, grup 3/6 ay; mevcut modül aylık/6/yıllık | Paket metinlerini modüle uyarlama onayı; eski metin saklanır |
| A3 | Arşivde artık mevcut 38 kişilik listede olmayan öğretmenler ve farklı diller/eksik isimler | Mevcut kadro esas; arşivden otomatik kişi ekleme/çıkarma yok |
| A4 | Bazı blog/WordPress metinlerinde yalnızca 6 dil var; Çince yok | Onaylı 7 dil korunur; eski yazı tarihsel bağlamını kaybetmeden editoryal kontrol |
| A5 | Sertifika metninde uluslararası akreditasyon, sınav/kabul iddiaları; DE Türkçe sertifikası, TR İngilizce sertifikası | Ankara Üniversitesi/TÖMER iş birliğinin güncel kapsamı ve kanıtı onaylanmalı |
| A6 | Kurumsal arşivinde Bett UK 2026 en iyi uygulama ödülü, TÜBİTAK desteği, fuar ziyaretleri | Kurum/etkinlik/ödül iddiaları ve görsel kullanım onayı; yeni iddia türetme yok |
| A7 | İletişim arşivinde ek +90 312 911 70 00, Gölbaşı şubesi, Londra adresi; mevcut footer daha kısa | Mevcut +90 539 516 70 70 / hello@hurralingo.com esas; ek adres/numara onayla |
| A8 | EN/DE eğitimde tartışma odası/ebeveyn katılımı ayrıntıları; EN/DE özgün blog adayları; AZ yazıları İngilizce | Ayrı değerlendirme listesi; otomatik çeviri ve TR ekleme yok |
| A9 | SSS aylık paketleri ayırmadan peşin/taksit diyor ve Stripe/iyzico adları içeriyor | Modülle tutarlı kapsam ve sağlayıcı güncelliği onayı; yeni ödeme politikası yok |
| A10 | Hero 7/24 canlı ders ve ödüllü teknoloji ifadesi; panel/AI örnek ekranları | Hizmet saatleri, mevcut ürün özellikleri ve örnek görünümler güncel mi doğrulanmalı |
| A11 | 57 medya API kaydı başlıklara rağmen dönmüyor; 17 görsel örneği dışı kalite incelenmedi | Arşiv sahibi tam medya listesi/dışa aktarımı ve uygunluk kontrolü |
| A12 | Canlı canonical hazırlık alanına gidiyor, /tr/ içerik sunuyor; üretim noindex/robots kararı açık | TR SEO düzeltmeleri ve indeksleme için ayrı yayın onayı; yabancı dil ayarları bu fazda değişmez |
| A13 | Soru videolarının taşınması, öğretmen/yorum seçkisi ve blog seçkisi öneri | Ana sayfa sadeleştirme kararları onaylanmadan içerik çıkarılmaz |
| A14 | Arşiv tema events/gallery/footer ve blog-grid örnekleri sitemap’te yer alıyor | Özgün içerik/tema ayrımı ve 301/404/410 kararları onaylanmalı; silme yok |

## Onaydan sonraki uygulama sırası

1. Beş rapor, sayfa mimarisi, ana sayfa kararları ve A1–A14 maddelerini içerik sahibiyle kesinleştir; yabancı içerik adaylarını ayrı iş listesinde bırak. Mevcut dosya/kadro/fiyat/dil yollarının sürümlü yedeğini ve karşılaştırma bazını al.
2. Mevcut statik mimariyi koru. Yalnız TR için ortak üst/alt menü, metadata, köke göre varlık yolları ve sayfa kabuğu üretimi tasarla. Framework, WordPress tema veya eski JS/CSS ithali gerekmiyor. Dil bayraklarını değil ders dillerini ve arayüz dillerini ayrı veri alanlarında tut.
3. Eğitim, Dersler, Öğretmenler, Referanslar, Kurumsal, İletişim sayfalarını onaylı mevcut içerik ve kabul edilen arşiv kayıtlarıyla oluştur. Sertifikasyon/SSS/içerik örneklerini Eğitim içinde koru; ders alt yolları için doğru anchor’ları oluştur.
4. Öğretmen verisini tek TR kaynaktan üret; 38 ad/dil/fotoğraf/kırpma aynen korunur. Mevcut FLIP/reduced-motion/boş sonuç davranışlarını sayfa kapsamına uygun taşı. Üç mevcut yorum ve mevcut yerel videolar önceliklidir. Arşiv medyasını ancak kalite/izin onayıyla ekle.
5. Blogda içerik/slug/tarih/gövde/arama/kategori ve 70 mevcut varlık korunur. `build-blog.cjs` tüm dilleri ürettiğinden önce TR’ye özgü üretim seçeneği veya ayrı TR kabuğu getir; diğer dil HTML’lerinin bayt farkı oluşmamalı. Kaynak importunu otomatik yeniden çalıştırma.
6. Ücret hesaplama dosyaları korunur; TR kabuğu mevcut sayfaya entegre edilir. Kaynak fiyat değişmedikçe veri yeniden çıkarılmaz. Fiyat ana sayfa özetleri tek veri kaynağından güncellenir; yanlış/eksik koşul gösterilmez.
7. Ana sayfa için onaylanan 1/2/3/4 kararlarını uygula; tüm özgün açıklamaların detay sayfalarında veya içerik arşivinde korunduğunu kaynak kimlikleriyle doğrula. Animasyonlar, video ses/modal davranışları, mobil menü ve CTA görünürlüğünü koru.
8. Sadece Türkçe iç bağlantılar, canonical ve birebir 301 planını uygula; üretim origin’i/host kural katmanını doğrula. Hazırlık noindex’i yerinde bırak. Üretim indeksleme ve deploy son kullanıcı onayından sonra ayrı adım olarak ele alınır.

## Kabul ve doğrulama planı

| Alan | Kabul ölçütü | Bu fazın doğrulaması |
| --- | --- | --- |
| Kapsam | Yalnız 5 rapor eklenir, uygulama dosyası değişmez | Git çalışma ağacı ve diff kontrolü; yalnızca beş yeni rapor var |
| Kaynak erişimi | 4 kök + tüm API listeleri, sayfalama ve eksikler raporlanır | 58 sayfa, 49 yazı, 1.517 medya; eksik 57 açıklandı |
| İçerik | Her kaynak kayıt için dil/URL/hedef/medya/karar/onay | 107 sayfa/yazı + 165 ek URL; 893 benzersiz bağlantı hedefi |
| Yerel medya | Eksik/bozuk varlık ve birebir mükerrer kontrolü | 139 dosya mevcut, 132 görsel decode başarılı; 58 ziyaretçi HTML sayfasının 160 benzersiz yerel dosya hedefinde eksik yok; SHA256 mükerrer raporu |
| Arşiv medyası | Dosya erişimi ile görsel kalite birbirinden ayrılır | 1.764 HEAD=200; 17 görsel örnek; 179 video referansı oynatılmadı |
| Fiyat | Motor/veri/Excel kuralları ve yeni sayfa kullanımı açıklanır | 60 eski seçim ders ücreti/toplam eşleşti; workbook kilidi ve geçmiş 184 formül kaydı ayrıldı |
| Sonraki faz UI | 320,390,768,1024,1440; drawer/odak/Escape/reduced-motion/video/CTA | Bu faz tarayıcı QA yapılmadı; sayfalar değiştirilmedi |
| Sonraki faz kadro | 38 kayıt/fotoğraf ve 7 ders dili; yabancı dosyalar aynı | Mevcut var T okundu; geçiş sonrası yeniden karşılaştırılacak |
| Sonraki faz SEO | 43 TR canonical, 301→200, sitemap ve noindex ortam ayrımı | Şu an yalnız plan; yönlendirmeler etkinleştirilmedi |

## Teslim edilen dosyalar

- [İçerik envanteri](HURRALINGO-PHASE-1A-CONTENT-INVENTORY.md): kaynak/menü/sayfa/blog/kadro/referans/bağlantılar ve ayrı yabancı içerik değerlendirmesi.
- [Sayfa eşleştirme](HURRALINGO-PHASE-1A-PAGE-MAPPING.md): 10 rota türü, mevcut çakışmalar, 15 bölüm için vitrin kararı.
- [Medya envanteri](HURRALINGO-PHASE-1A-MEDIA-INVENTORY.md): mevcut 139 varlık, 1.517 API kaydı, 70 blog eşlemesi, mükerrer adayları, videolar ve kalite sınırı.
- [SEO ve yönlendirmeler](HURRALINGO-PHASE-1A-SEO-REDIRECTS.md): 16 TR sayfa ve 34 yazı için birebir tablo, ek yollar, canonical/hreflang/sitemap planı.
- Bu uygulama planı: koruma sözleşmesi, ücret analizi, çelişkiler, sıra ve kabul ölçütleri.

**Faz 1A tamamlandı. Uygulamaya geçilmedi; sonraki faz için kullanıcının açık onayı bekleniyor.** Eksik 57 medya kaydı, sınırlı görsel kalite kontrolü, test edilmemiş haricî video/bağlantılar ve kilitli Excel bu teslimde gizlenmemiş doğrulama sınırlarıdır.
