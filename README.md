# Hurra Lingo — Ana Sayfa Tasarım Önerisi

Bu depo, **Hurra Lingo** için **İnfomedya** tarafından hazırlanan ana sayfa tasarım önerisini içerir. Sayfanın **Türkçe, İngilizce, Almanca ve Azerbaycanca** dört sürümü vardır. Proje derleme adımı gerektirmeyen statik bir web sitesidir. Mevcut hazırlık önizlemesi Cloudflare Pages üzerindedir; Phase 5 değişiklikleri yereldir ve otomatik dağıtım yapılmamıştır.

> ⚠️ **Önemli:** Bu çalışma bir **tasarım önerisidir**. Güncel fiyatlar önceki aşamalarda onaylanmıştır ve tüm dillerde Türk lirası (TRY) olarak korunur. Paket hesaplama alanı örnek bir ders planını gösterir. Phase 1 sonrasında deneme dersi başvuruları **[resmî başvuru sayfasına](https://www.hurralingo.app/trial-request)** yönlendirilir; bu depoda başvuru formu bulunmaz. Canlı bir ürün olarak kullanılmamalıdır.

---

## 🔗 Canlı Önizleme

| Dil | Bağlantı |
|-----|----------|
| 🇹🇷 Türkçe | https://hurralingo-landing.pages.dev/ |
| 🇬🇧 English | https://hurralingo-landing.pages.dev/en.html |
| 🇩🇪 Deutsch | https://hurralingo-landing.pages.dev/de.html |
| 🇦🇿 Azərbaycanca | https://hurralingo-landing.pages.dev/az.html |

DE/AZ dosyaları Phase 5 kapsamında oluşturulmuştur. Yukarıdaki yeni dil adresleri, ayrıca onaylanıp dağıtım yapılana kadar mevcut uzak önizlemede bulunmayabilir. Dört sayfa yerel sunucuda kullanılabilir.

---

## 📌 Proje Hakkında

Bu proje, Hurra Lingo markasının yeni ana sayfasının nasıl görünebileceğini ve nasıl çalışabileceğini göstermek için hazırlandı. Amacı, müşteriye ve ekibe çalışan bir tarayıcı prototipi sunmaktır. Böylece tasarım statik görseller yerine gerçek bir sayfa üzerinde değerlendirilebilir.

Sayfanın öne çıkan unsurları şunlardır:

- Ders ortamını gösteren **videolu bir giriş (hero) alanı**
- Kısa **soru videoları** ile ilgi çeken içerik blokları
- **Öğretmen tanıtımları** (fotoğraflı)
- Markaya kişilik katan **maskot** çizimleri
- Mevcut örnek **fiyat** bilgileri ve haricî **deneme dersi bağlantıları**

---

## ✨ Başlıca Özellikler

- **Dört dilli yapı:** Türkçe `index.html` (`/`), İngilizce `en.html`, Almanca `de.html`, Azerbaycanca `az.html`. Masaüstü ve mobil dil seçiciler aynı dört yerel hedefe gider. Almanca iletişimde resmî “Sie”, Azerbaycancada Azerbaycan Latin alfabesi kullanılır.
- **Derleme adımı yok:** Paket yöneticisi, framework ya da build aracı gerekmez. Dosyalar olduğu gibi sunulur.
- **Video ağırlıklı anlatım:**
  - `hero-ders.mp4`: giriş alanındaki ders videosu
  - `soru-1` … `soru-6`: altı adet kısa soru videosu
  - Her videonun aynı adlı bir `.jpg` kapak (poster) görseli vardır. Bu görsel, video yüklenene kadar ekranda görünür.
- **Öğretmen kadrosu tanıtımı:** Dört sayfada aynı 38 öğretmen gösterilir. Phase 4’te çıkarılan dört öğretmen yeni dillere eklenmez; Yanshan Lin ve Çince filtresi korunur. 42 fotoğraf varlığı tutulur; gösterilen kadro ile varlık sayısı farklıdır. Bu sayı platformun toplam aktif öğretmen sayısı iddiası değildir.
- **Maskot sistemi:** Farklı duyguları ifade eden 5 SVG maskot varyasyonu vardır. SVG oldukları için her ekranda net görünürler.
- **Sosyal medya önizlemesi:** Bağlantı WhatsApp, LinkedIn, X gibi platformlarda paylaşıldığında `og.jpg` görseli gösterilir.
- **Arama motorlarından gizli:** `robots.txt` tüm botları engeller. Bu sayede öneri sayfası Google'da indekslenmez ve gerçek siteyle karışmaz.
- **GitHub Pages uyumu:** `.nojekyll` dosyası, GitHub Pages'in Jekyll işlemesini kapatır. Böylece tüm dosyalar olduğu gibi yayınlanır.

---

## 🗂️ Dizin ve Dosya Yapısı

```
hurralingo-oneri/
├── index.html               # Ana sayfa — Türkçe sürüm
├── en.html                  # Ana sayfa — İngilizce sürüm
├── de.html                  # Ana sayfa — Almanca sürüm
├── az.html                  # Ana sayfa — Azerbaycanca sürüm
├── desktop-density.css      # Onaylı masaüstü yoğunluk ayarları
├── localization.css         # Uzun çeviriler ve dar ekranlar için metin sığdırma
├── PHASE-5-REPORT.md         # Yerelleştirme ve QA raporu
├── og.jpg                   # Sosyal medya paylaşım görseli (Open Graph)
├── robots.txt               # Tüm arama motoru botlarını engeller
├── .nojekyll                # GitHub Pages'te Jekyll işlemesini kapatır
├── .gitignore               # Git'e eklenmeyecek dosyalar
├── README.md                # Bu dosya
│
├── img/                     # Görseller ve marka varlıkları
│   ├── favicon.png          # Tarayıcı sekmesi simgesi
│   ├── logo-clay.webp       # "Clay" (kil / 3B) stilindeki Hurra Lingo logosu
│   │
│   ├── maskot-mutlu.svg         # Maskot — mutlu
│   ├── maskot-mutlu-beyaz.svg   # Maskot — mutlu, beyaz (koyu zeminler için)
│   ├── maskot-sevinc.svg        # Maskot — sevinçli
│   ├── maskot-goz-kirp.svg      # Maskot — göz kırpan
│   ├── maskot-merakli.svg       # Maskot — meraklı
│   │
│   ├── t-adam.webp          # Öğretmen fotoğrafları
│   ├── t-adeniyi.webp       #   (adlandırma kuralı: t-<isim>.webp)
│   ├── t-alexandra.webp
│   ├── t-ayzade.webp
│   ├── t-bengu.webp
│   ├── t-busra.webp
│   ├── t-mehtap.webp
│   └── t-nesrin.webp
│
└── media/                   # Videolar ve video kapak görselleri
    ├── hero-ders.mp4        # Giriş (hero) alanı ders videosu
    ├── hero-ders.jpg        #   └─ kapak görseli
    ├── neden-ogretmen.jpg   # "Neden öğretmen?" bölümü görseli
    ├── soru-1.mp4 / .jpg    # Soru videoları ve kapak görselleri
    ├── soru-2.mp4 / .jpg
    ├── soru-3.mp4 / .jpg
    ├── soru-4.mp4 / .jpg
    ├── soru-5.mp4 / .jpg
    └── soru-6.mp4 / .jpg
```

### Varlık Özeti

| Klasör | İçerik | Biçim | Adet |
|--------|--------|-------|------|
| `img/` | Maskot varyasyonları | SVG | 5 |
| `img/` | Öğretmen fotoğrafları | WebP / JPG / PNG | 42 |
| `img/` | Logo ve favicon | WebP / PNG | 2 |
| `media/` | Videolar (hero + sorular) | MP4 | 7 |
| `media/` | Video kapakları ve bölüm görselleri | JPG | 8 |

---

## 🚀 Kurulum ve Yerel Çalıştırma

Proje tamamen statiktir. Herhangi bir bağımlılık kurmanıza gerek yoktur.

### 1. Depoyu klonlayın

```bash
git clone https://github.com/polat/hurralingo-oneri.git
cd hurralingo-oneri
```

### 2. Sayfayı açın

**En hızlı yol:** `index.html` dosyasını çift tıklayarak tarayıcıda açın.

**Önerilen yol:** Yerel bir sunucu kullanın. Bazı tarayıcılar `file://` üzerinden açılan sayfalarda video oynatmayı ve bazı özellikleri kısıtlayabilir. Yerel sunucu, sayfanın canlı ortamdaki davranışını daha doğru yansıtır.

```bash
# Python 3 ile
python3 -m http.server 8000

# veya Node.js ile
npx serve .
```

Ardından tarayıcıda şu adresleri açın:

- Türkçe: http://localhost:8000/
- İngilizce: http://localhost:8000/en.html
- Almanca: http://localhost:8000/de.html
- Azerbaycanca: http://localhost:8000/az.html

---

## 🌐 Yayınlama (isteğe bağlı GitHub Pages)

Mevcut önizleme Cloudflare Pages üzerindedir. Aşağıdaki GitHub Pages adımları yalnızca alternatif barındırma için eski proje notlarıdır. Phase 5 kapsamında push, dağıtım, Cloudflare veya DNS değişikliği yapılmaz.

Alternatif GitHub Pages kurulumu:

1. GitHub'da depo sayfasını açın ve **Settings → Pages** bölümüne gidin.
2. **Source** olarak **Deploy from a branch** seçeneğini seçin.
3. Dal olarak `main`, klasör olarak `/ (root)` seçin ve kaydedin.
4. Birkaç dakika içinde site `https://<kullanıcı-adı>.github.io/hurralingo-oneri/` adresinde yayında olur.

`main` dalına gönderilen (push) her değişiklik otomatik olarak yeniden yayınlanır.

---

## 🛠️ Düzenleme İpuçları

- **Dört dili birlikte güncelleyin:** Yapısal değişiklikleri `index.html`, `en.html`, `de.html` ve `az.html` dosyalarında birlikte ele alın. Dil etiketleri, erişilebilirlik metinleri ve dinamik JavaScript mesajları da yerelleştirilmelidir.
- **Yeni öğretmen eklemek:** Fotoğrafı `img/t-<isim>.webp` adıyla kaydedin. Türkçe karakter ve boşluk kullanmayın (ör. `t-bengu.webp`). Ardından dört HTML dosyasındaki kadroya aynı kayıt ve dil atamasını ekleyin.
- **Yeni video eklemek:**
  - Videoyu web uyumlu **MP4 (H.264)** biçiminde `media/` klasörüne koyun.
  - Aynı adla bir `.jpg` kapak görseli oluşturun (ör. `soru-7.mp4` + `soru-7.jpg`).
  - Otomatik oynatılacak videoların sessiz (`muted`) olması gerekir. Aksi halde tarayıcılar otomatik oynatmayı engeller.
- **Görsel optimizasyonu:** Fotoğrafları WebP, ikon ve çizimleri SVG olarak kullanmaya devam edin. Sayfanın hızlı yüklenmesi için video boyutlarını mümkün olduğunca küçük tutun.
- **Dosya boyutu sınırı:** GitHub, 100 MB'tan büyük dosyaları kabul etmez. Büyük videoları eklemeden önce sıkıştırın.

---

## ⚠️ Bilinen Sınırlamalar

- Fiyatlar onaylanan TRY değerlerini korur; kur dönüşümü yapılmaz. Üretime geçiş öncesinde teklif ve yasal metinler sahibince doğrulanmalıdır.
- Deneme dersi CTA’ları resmî uygulamanın başvuru sayfasını yeni sekmede açar. Kurumsal teklif CTA’sı resmî WhatsApp numarasına gider.
- `robots.txt` nedeniyle sayfa **arama motorlarında görünmez**. Bu bilinçli bir tercihtir.
- Proje bir **tasarım prototipidir**. Canlıya alınmadan önce içerik, analitik ve KVKK/çerez gibi yasal metinlerin eklenmesi gerekir.

---

## Phase 1

Değişiklikler, kaynak karşılaştırmaları, doğrulama sonuçları ve açık maddeler için [PHASE-1-REPORT.md](PHASE-1-REPORT.md) dosyasına bakın. Önizleme bağlantıları mevcut dağıtımı gösterir; bu aşamada dağıtım yapılmamıştır.

## Phase 5

Yerelleştirme, kadro/fiyat eşliği, dil seçici, SEO ve doğrulama sonuçları için [PHASE-5-REPORT.md](PHASE-5-REPORT.md) dosyasına bakın. Dört sayfada `noindex, nofollow`, hazırlık alanına ait canonical ve karşılıklı TR/EN/DE/AZ `hreflang` bağlantıları bulunur. `x-default` Türkçe ana sayfayı gösterir; `robots.txt` botları engellemeye devam eder. Üretim alan adına geçiş yapılmamıştır.

Production TODO: Integrate approved Hurra Lingo chatbots after provider, embed script, consent/privacy requirements and deployment scope are confirmed.

## 👥 Hazırlayan

**İnfomedya** — Hurra Lingo için ana sayfa tasarım önerisi.
