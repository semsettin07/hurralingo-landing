# Blog içerikleri

Blog arşivleri: `/blog/` (TR), `/en/blog/`, `/de/blog/`, `/az/blog/`.
Ana sayfalardaki masaüstü, mobil menü ve footer bağlantıları ilgili dildeki arşive gider.

Referans: `semsettin07/hurraturkiye-landing`, GitHub HEAD
`fb3d76db97c2d255b67043e1e7c72f02db36ca2a`. Tarihli kartlar, üç sütunlu
masaüstü arşivi, arama ve kategori filtresi Hurra Lingo tasarımına uyarlandı.
Referans deponun kaydedilmemiş değişiklikleri kullanılmadı.

## Kaynak erişimi — 12 Ekim 2026

İlk denemede HTTP 401 döndüren dört kaynağın şifresi sahibi tarafından
kaldırıldı. Yeniden yapılan aktarımda hepsi HTTP 200 yanıtı verdi:

- https://hurraegitim.com/blog/
- https://hurraegitim.com/de/blog/
- https://hurraegitim.com/tr/blog/
- https://hurraegitim.com/az/blog/

WordPress REST API üzerinden tüm sayfalar ve toplam kayıt sayıları kontrol
edilerek **49 yazı** aktarıldı: TR 34, EN 6, DE 6, AZ 3. **70 görsel** yerel
olarak kaydedildi; WebP biçiminde en fazla 1600 piksel genişliğe optimize edildi.
AZ arşivindeki üç yazı kaynakta İngilizcedir; metinler değiştirilmedi ve içerik
dili `en` olarak işaretlendi. AZ sayfasının menüleri Azerbaycancadır.
Kaynak tarihleri ve geçmiş kampanya metinleri korundu. Alternatif alan adından
içerik alınmadı. Kaynak cevapları ve görsel eşleştirmeleri `docs/blog-source/`
altında, aktarım raporu `import-report.json` dosyasında tutulur.
Yazıların altındaki görünür “Kaynak” bağlantıları kaldırıldı; kaynak adresleri
yalnızca içerik kayıtlarında izlenebilirlik için tutulur. Blog kartları referans
projedeki gibi sırayla −1,25° / +1,25° eğilir ve gülen maskotu gösterir.
Klavye odağı ve dokunma da maskotu gösterir; azaltılmış hareket tercihinde
eğilme ve geçişler kapatılır.

## İçerik ve üretim

`posts.json` doğrulanmış yazı kayıtlarından oluşan bir JSON dizisidir. Alanlar:

- `language`: `tr`, `en`, `de` veya `az`.
- `slug`: küçük Latin harfleri, rakamlar ve tirelerden oluşan benzersiz adres.
- `title`, `summary`: kaynak başlığı ve özeti, düz metin.
- `date`: kaynak yayım tarihi, ISO biçiminde.
- `categories`: kaynak kategori adları dizisi.
- `source`: yazının özgün HTTPS adresi.
- `paragraphs`: yazının tam paragraf metinleri dizisi; HTML çalıştırılmaz.
- `author`: isteğe bağlı, doğrulanmış yazar adı.
- `image`: isteğe bağlı, `img/blog/` altındaki yerel görsel yolu.
- `imageAlt`: kaynak görselin alternatif metni.
- `contentLanguage`: yazı metninin dili; kaynak AZ yazıları için `en`.
- `body`: başlık, liste, bağlantı, görsel ve paragrafları koruyan güvenli düğüm ağacı.

Zengin içerik `body` alanından üretilir; eski düz metin kayıtlar için
`paragraphs` desteği sürer. Kaynak scriptleri, stilleri ve WordPress içindekiler
widget'ları taşınmaz. Kaynakta arşivlenen diğer yazılara giden bağlantılar yerel
detay sayfalarına yönlendirilir. İçe aktarım ve görsel optimizasyonu için geliştirme
bağımlılıkları gerekir; yayımlanan site tamamen statiktir.

```powershell
npm.cmd ci --ignore-scripts
node scripts/import-blog.cjs
```

```powershell
node scripts/build-blog.cjs
```

Arşivler ve yazı detayları statik HTML olarak üretilir; ziyaretçiler için
derleme veya API bağlantısı gerekmez. Üretici mevcut dört ana sayfanın diline
uygun üst menü, footer, stiller ve klavye etkileşimlerini korur. Üretilen HTML
dosyalarını doğrudan düzenlemek yerine üreticiyi veya kaynak kayıtları değiştirin.
Tüm sayfalar mevcut hazırlık alanının `noindex, nofollow` politikasını sürdürür.
Git push veya dağıtım yapılmadı.

## Doğrulama

```powershell
node scripts/check-blog.cjs
```

Kontrol betiği yan `hurralingo` projesinde kurulu Playwright'ı kullanır.
Dört dilde 320, 390, 768 ve 1440 piksel genişlikleri, dil bağlantıları ve mobil
menü kontrol edilir. 49 gerçek yazının tamamı 320 ve 1440 pikselde kontrol edilir;
görseller ve yerel bağlantıların HTTP durumları doğrulanır. Geçici kayıtlarla
arama, kategori kesişimi, boş sonuç,
sıfırlama ve detay sayfalarındaki HTML kaçışları kontrol edilir. Geçici kayıtlar
ve detaylar sonunda temizlenir; gerçek içerik dosyası geri yüklenir.
Masaüstü ve mobil ekran görüntüleri `docs/blog-preview/` altındadır.
