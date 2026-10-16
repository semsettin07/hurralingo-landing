# Hurra Lingo ücretler uygulama raporu

Tarih: 16 Ekim 2026. Durum: yerelde tamamlandı ve test edildi. Canlı siteye veya Cloudflare önizlemesine dağıtım yapılmadı.

## 1. Kaynak ve Excel analizi

İncelenen dosya: `C:\Users\sbese\Desktop\HURRA PROJE\Hurra Lingo Kurs Ücretleri TL 2027.xlsx`.

SHA256: `558FA000859FC693C711BC6232FBD0587776BFEA6C5A5DFAD09C4B09F1807517`.

Tüm çalışma sayfaları, kullanılan / boş biçimlendirilmiş hücreler, formüller, kayıtlı sonuçlar ve birleşimler `docs/pricing-2027/workbook-cells.json` içinde kayıtlıdır:

- TL Özel Ders Ücretleri
- TL Mini Grup Ders Ücretleri
- TL Grup Ders Ücretleri

Üç sayfanın her birinde Türk / native öğretmen tabloları vardır. Ek yapılandırılmış Excel tablosu, yorum veya dış bağlantı kaydı bulunmadı. Başlıklar açıkça TL ve KDV HARİÇ bilgisini içerir. Yalnızca bir Excel dosyası sağlandı; dosyalar arası fiyat çelişkisi yoktur. 184 formül bağımsız bir ayrıştırıcıyla yeniden hesaplandı ve tüm kayıtlı sonuçlarla eşleşti.

Referans [Hurra Türkiye canlı ücretler sayfası](https://www.hurraturkiye.com/ucretler/) incelendi. Yereldeki `../hurraturkiye-landing/assets/overseas-pricing-data.js` ve `overseas-pricing.js` kaynaklarının model seçimi, bağımlı alanlar ve karşılaştırma yaklaşımı kullanıldı; Excel ROUND yardımcısı tam lira hassasiyetine uyarlandı. Türkiye fiyatları veya para birimi katsayıları aktarılmadı. [Hurra Lingo canlı sitesi](https://www.hurralingo.com/) ve mevcut yerel tasarım sistemi incelendi.

İlk analiz / plan: `docs/pricing-2027/ANALYSIS-AND-PLAN.md`.

## 2. Fiyat ve hesaplama kuralları

- Özel ders aylık tabanı: Türk öğretmen 1.099 TL, native öğretmen 1.549 TL.
- Mini grup tabanı: özel ders tabanının %30 indirimli değeri, ROUND(...,0).
- Grup tabanı: özel ders tabanının %50 indirimli değeri, ROUND(...,0).
- Aylık üyelik: haftada 1 / 2 ders için 4 / 8 ders. Ayrı peşin / taksitli seçenek sunulmaz.
- 6 aylık üyelik: 24 / 48 toplam ders; ders ücretinde %5 üyelik indirimi, peşinde yuvarlanmış ders ücretine %5 ilave indirim.
- Yıllık üyelik: 48 / 96 toplam ders; ders ücretinde %10 üyelik indirimi, peşinde yuvarlanmış ders ücretine %10 ilave indirim.
- Her indirim aşamasında ücret tam liraya yuvarlanır; paket toplamları bu ücretle çarpılır. İndirim yüzdeleri doğrudan toplanmaz.
- Kullanıcı açıklamasıyla netleşen taksit kuralı: eğitim haftası / 4; taksitler aylık çekilir. 6 aylık paket 6, yıllık paket 12 taksittir. Haftada 2 ders seçmek taksit sayısını artırmaz. Taksit tutarı = taksitli toplam / taksit sayısı; Excel'in aylık ödeme hücreleriyle eşleşir.
- Peşin avantajı = taksitli toplam − peşin toplam. Gerçek tasarruf yüzdesi bu farkın taksitli toplama oranıdır; yuvarlama nedeniyle nominal ilave indirimden küçük farklılık gösterebilir.
- KDV oranı veya başka para birimi eklenmedi. Fiyatlar KDV hariç olarak işaretlendi.

## 3. Oluşturulan / değiştirilen dosyalar

| Dosya | İşlev |
| --- | --- |
| `scripts/extract-pricing-workbook.ps1` | Excel ZIP/XML hücre, formül ve kaynak özeti çıkarımı; Excel kurulumuna bağımlı değil |
| `docs/pricing-2027/workbook-cells.json` | Denetlenebilir kaynak dökümü |
| `scripts/build-pricing.cjs` | Excel sayısal girdilerinden veri ve mevcut site kabuğundan statik sayfa üretimi |
| `assets/pricing-data.js` | Üretilmiş, yalnızca TL fiyat girdileri ve desteklenen seçenekler |
| `assets/pricing-engine.js` | Arayüzden bağımsız hesaplama ve geçersiz seçim kontrolü |
| `assets/pricing-tr.js` | Ayrı Türkçe arayüz sözlüğü ve sayı biçimlendirme yereli |
| `assets/pricing-ui.js` | Bağımlı seçimler, sonuçlar, kart etkileşimi ve karşılaştırmalar |
| `assets/pricing.css` | Marka renkleri ve mevcut tipografiyle responsive düzen |
| `content/pricing-page.html` | Sayfa bölümleri ve metin kaynağı |
| `ucretler/index.html` | Doğrudan açılabilen statik Türkçe sayfa |
| `index.html` | Fiyatlar açıklaması, başlangıç koşulları, menüler ve hesaplayıcı CTA'sı |
| `blog/**/index.html`, `blog/index.html` | Türkçe blog sayfalarında ortak header / mobil menü / footer fiyat bağlantıları |
| `scripts/update-pricing-home.cjs` | Tek seferlik ana sayfa geçişinin yeniden çalıştırılabilir kaydı |
| `scripts/check-pricing.cjs` | Bağımsız Excel formül ve paket testleri; yerel bağlantı kontrolleri |
| `scripts/check-pricing-browser.cjs` | Tarayıcı etkileşimi, ekran boyutları ve erişilebilir kullanım kontrolleri |
| `scripts/serve-local.cjs` | Yerel statik önizleme sunucusu; üretimde sunucu gerekmez |
| `package.json` | Fiyat üretimi / testleri ve yerel önizleme komutları |
| `README.md` | Yeni ücretler sayfasının yerel kullanım bilgisi |
| `docs/pricing-2027/*verification.json`, `preview-*.png` | Test sonuçları ve beş ekran genişliğinin görüntüleri |

Üretim bağımlılığı eklenmedi. İngilizce / Almanca / Azerbaycanca sayfalara veya bloglarına ücretler sayfası eklenmedi; bu dillerin mevcut dosyaları korundu. Türkçe blog gövdeleri değişmedi; ortak navigasyon ve kullanılmayan eski fiyat stili güncellendi.

## 4. Ana sayfa ve bağlantılar

Üç ders modeli kartı, genel düzen ve “Ders başı fiyatı baştan görün” başlığı korundu. 446 / 623 / 890 TL başlangıçları Excel'deki Türk öğretmen, yıllık peşin ders ücretleriyle eşleşir. Kartlara bu koşul ve KDV hariç bilgisi eklendi; üstteki kısa fiyat tanıtımının koşulu da açıklandı.

Eski 24.792 / 28.752 TL örneği ve JavaScript'i kaldırıldı. Yerine `/ucretler/` bağlantılı **Ders Ücretinizi Hesaplayın** CTA'sı eklendi. Açıklama istenen metinle değiştirildi. Masaüstü / mobil menü ve footer'daki Fiyatlar bağlantıları yeni sayfaya gider. Ana sayfadaki bölüm tanıtım bağlantısı `#fiyatlar` olarak korundu. Türkçe blog sayfaları da aynı yeni fiyat bağlantısını kullanır.

## 5. Hesaplayıcı özellikleri

Üç model, iki öğretmen türü, üç üyelik süresi, iki ders sıklığı ve desteklenen ödeme seçenekleri bulunur. Her seçim sayfa yenilenmeden güncellenir. Aylık üyeliğe geçişte geçersiz peşin / taksitli seçimleri kaldırılır. Kart düğmeleri modeli seçer, hesaplayıcıya kaydırır ve klavye odağını seçim alanına taşır.

Sonuçlarda toplam ders, aylık ders, üyelik süresi, ders başı tutar, seçili paket toplamı, peşin / taksitli toplam, aylık taksit sayısı ve tutarı, üyelik indirimi, peşin ek indirim ve tasarruf gösterilir. Peşin / taksitli karşılaştırması toplam, ders başı maliyet, parasal fark, tasarruf yüzdesi ve çubuklar içerir. Üç model aynı öğretmen, üyelik, sıklık ve ödeme seçimiyle karşılaştırılır. Farklı ders sayısı oluşursa açık uyarı desteklenir.

Mevcut header / drawer / footer ve klavye davranışları tekrar kullanıldı. Form etiketleri, odak göstergeleri, canlı sonuç özeti ve JavaScript kapalıyken başvuru yönlendirmesi bulunur. Yeni sayfada mevcut önizleme noindex politikası korundu; canonical ve sosyal paylaşım metaverileri eklendi. Başvuru bağlantısı istenen resmî adrese yeni sekmede açılır.

## 6. Excel karşılaştırmalı test sonuçları

**184 / 184 Excel formülü ve 60 / 60 geçerli ödeme seçimi geçti.** 36 ayrı model / öğretmen / üyelik / sıklık paketi vardır; uzun üyeliklerin iki ödeme biçimiyle 60 sonuç doğrulanmıştır. Taban, indirimli / peşin ders ücreti, aylık ve toplam ders sayısı, aylık ödeme, taksitli / peşin toplam, fark, indirim oranları ve yuvarlama kontrol edildi. Taksit sayısı ayrıca kullanıcı kuralına, taksit tutarı Excel aylık ödeme hücresine karşı doğrulandı. Geçersiz seçimler hata verir.

Aşağıda 12 farklı paketin örnek özeti yer alır. Tutarlar TL, KDV hariçtir; beklenen değerler Excel hücrelerinden okunmuştur.

| Model | Öğretmen | Üyelik / haftalık ders / ödeme | Ders | Ders başı Excel = araç | Toplam Excel = araç | Taksit planı | Sonuç |
| --- | --- | --- | ---: | ---: | ---: | --- | --- |
| Özel | Türk | Aylık / 1 / aylık | 4 | 1.099 | 4.396 | — | PASS |
| Özel | Türk | 6 ay / 2 / peşin | 48 | 992 | 47.616 | 6 × 8.352; taksitli toplam 50.112 | PASS |
| Özel | Native | Aylık / 1 / aylık | 4 | 1.549 | 6.196 | — | PASS |
| Özel | Native | Yıllık / 2 / peşin | 96 | 1.255 | 120.480 | 12 × 11.152; taksitli toplam 133.824 | PASS |
| Mini grup | Türk | Aylık / 1 / aylık | 4 | 769 | 3.076 | — | PASS |
| Mini grup | Türk | 6 ay / 2 / peşin | 48 | 694 | 33.312 | 6 × 5.848; taksitli toplam 35.088 | PASS |
| Mini grup | Native | Aylık / 1 / aylık | 4 | 1.084 | 4.336 | — | PASS |
| Mini grup | Native | Yıllık / 2 / peşin | 96 | 878 | 84.288 | 12 × 7.808; taksitli toplam 93.696 | PASS |
| Grup | Türk | Aylık / 1 / aylık | 4 | 550 | 2.200 | — | PASS |
| Grup | Türk | 6 ay / 2 / peşin | 48 | 497 | 23.856 | 6 × 4.184; taksitli toplam 25.104 | PASS |
| Grup | Native | Aylık / 1 / aylık | 4 | 775 | 3.100 | — | PASS |
| Grup | Native | Yıllık / 2 / peşin | 96 | 628 | 60.288 | 12 × 5.584; taksitli toplam 67.008 | PASS |

Tam 60 satır: `docs/pricing-2027/calculation-verification.json`. Formüller yalnızca tarayıcı motoruyla değil, ayrıca sınırlı ve bağımsız Excel formül ayrıştırıcısıyla hesaplanmıştır; eval kullanılmaz.

## 7. Mobil / masaüstü kontrolleri

Chromium'da 320, 390, 768, 1024 ve 1440 piksel genişliklerinde yatay taşma yok. Mobil ve masaüstü ekran görüntüleri görsel olarak incelendi. Form alanları en az 44 piksel yüksekliğinde. Tüm 60 seçim tarayıcıda da Excel değerleriyle eşleşti. Kart seçimi, aylık / yıllık geçişleri, Tab sırası, mobil menü açma ve Escape ile kapatma, doğrudan URL, ana sayfa CTA'sı ve JavaScript kapalı durum testleri geçti. Yerel HTTP hatası veya JavaScript sayfa hatası görülmedi.

Sonuç: `docs/pricing-2027/browser-verification.json`. Görüntüler: aynı klasörde `preview-320.png`, `preview-390.png`, `preview-768.png`, `preview-1024.png`, `preview-1440.png`.

Mevcut `blog:check` testi de geçti: dört dil, 49 makale, arşiv / makale ekranları, görseller, bağlantılar, dil menüsü, mobil menü, arama / kategori / sıfırlama ve içerik kaçış kontrolleri. Bu testin yeniden ürettiği diğer dil blog dosyaları ve eski blog ekran görüntüleri teslim kapsamı dışında tutularak başlangıç hâline döndürüldü. Fiziksel iOS / Android cihaz veya Safari testi yapılmadı.

## 8. Eksik veri ve belirsizlikler

KDV oranı Excel'de yok; oran eklenmedi. Taksit sayısı başlangıçta Excel'de açık değildi; kullanıcı tarafından aylık çekim ve hafta / 4 kuralıyla çözüldü. Kişi sayıları ve 30 dakikalık grup / mini grup süresi Excel'den değil, mevcut Hurra Lingo model kartlarından korunmuştur. Özel ders süresi uydurulmadı. Döviz dönüşümü, ek indirim veya ücret koşulu eklenmedi.

## 9. Build, önizleme ve dağıtım

Başarılı komutlar (PowerShell yürütme politikası nedeniyle npm.cmd kullanıldı):

```powershell
npm.cmd run pricing:build
npm.cmd run pricing:check
npm.cmd run pricing:browser
npm.cmd run blog:check
```

Site statiktir; `pricing:build` veri ve `/ucretler/index.html` üretir. Hesaplama için sunucu / veritabanı veya dağıtımda Excel dosyası gerekmez. Kaynak Excel değişirse önce `scripts/extract-pricing-workbook.ps1 -WorkbookPath 'DOSYA'`, ardından üretim ve testler çalıştırılmalıdır. Tarayıcı testi, mevcut komşu projedeki Playwright kurulumunu kullanır; başka ortamda `HURRA_PLAYWRIGHT_PATH` ile kurulum yolu verilebilir.

Yerel önizleme komutu: `npm.cmd run preview`.

Önizleme adresleri: http://127.0.0.1:8017/ucretler/ ve http://127.0.0.1:8017/#fiyatlar . Sunucu kapalıysa yukarıdaki komutla açılabilir.

Cloudflare Pages veya canlı siteye dağıtım yapılmadı; uzak önizleme bağlantısı oluşturulmadı. Git commit / push yapılmadı. Canlıya geçiş, kullanıcının önizleme incelemesi ve onayı sonrasındadır.
