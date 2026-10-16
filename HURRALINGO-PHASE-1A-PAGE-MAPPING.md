# HURRA LINGO — Faz 1A Sayfa Eşleştirme

İnceleme tarihi: **16 Ekim 2026 (Europe/Istanbul)**. Kapsam: Faz 1A, yalnızca analiz ve planlama. Kod, mevcut sayfalar, kaynak içerikler ve canlı ortam değiştirilmedi. Bu belgede yer alan taşıma ve 301 kararları öneridir; uygulanmadı.

## Mevcut mimari ve yol çakışmaları

Framework/router yok; statik HTML projesi. `index.html`, `en.html`, `de.html`, `az.html`; 4 blog listesi + 49 detay (TR 34); `ucretler/index.html` mevcut. **58 ziyaretçi HTML sayfası**: 4 ana sayfa + 53 blog HTML + 1 ücretler. Talep 9 sabit Türkçe yol ve 1 blog detay şablonu içerir. Bunların `/`, `/blog/`, `/ucretler/` yolları ve 34 Türkçe detay zaten var; 6 sabit sayfa yeni olacaktır. Mevcut detaylar yeniden ithal edilmez.

Ders dili sayısı 7’dir; arayüz dili sayısı 4’tür. `/en/`, `/de/`, `/az/` canlıda erişilebilir; yerel kök dosyaları `.html` uzantılıdır. Bunlar birbirinin yerine varsayılamaz. Dil yolları/ana dosyaları/blogları ve var olan barındırma davranışı korunmalıdır.

| Hedef | Mevcut karşılık | Kaynak / kapsam | Plan |
| --- | --- | --- | --- |
| / | index.html | #top, #neden, #programlar ve detay özetleri | Kimlik ve etkileşimleri koruyarak sonraki fazda sadeleştir |
| /egitimmodelimiz/ | Yeni | P-tr-12, P-tr-28, P-tr-6846, P-tr-1480 | Model, seviye, uygulama, takip, sertifikasyon, içerik örnekleri, SSS |
| /derslerimiz/ | Yeni | P-tr-14 ve TR classes alt kayıtları; #programlar | Yaşlar, 7 dil, üç sınıf tipi ve onaylı süre/kapasite |
| /ogretmenlerimiz/ | Yeni | #ogretmenler; mevcut var T | 38 kişi, filtre, fotoğraf/kırpma/CTA korunur |
| /blog/ | blog/index.html | 34 TR yazı ve mevcut filtre/arama | Mevcut üretici ve içerik korunur |
| /blog/[slug]/ | blog/<slug>/index.html | 34 mevcut TR detay | Slug, içerik, tarih ve yerel görseller korunur |
| /ucretler/ | ucretler/index.html | content/pricing-page.html ve Excel verisi | Mevcut modül yerinde, yalnızca ortak kabuk entegrasyonu |
| /referanslarimiz/ | Yeni | #yorumlar + P-tr-1268 | 3 mevcut yorum; ek videolar/yazılar onayla |
| /kurumsal/ | Yeni | #kurumlar + P-tr-6043 | B2B teklif süreci ve doğrulanmış iş birlikleri/etkinlikler |
| /iletisim/ | Yeni | Footer, #sss iletişim + P-tr-20 | Mevcut telefon/e-posta/WhatsApp; ek adresler onayla |

## Menü sözleşmesi

Masaüstü ve mobil tek Türkçe veri kaynağından aynı sırayla üretilmeli: **Eğitim | Dersler | Öğretmenler | Blog | Ücretler | Referanslar | Kurumsal | İletişim**. Hedefler sırasıyla `/egitimmodelimiz/`, `/derslerimiz/`, `/ogretmenlerimiz/`, `/blog/`, `/ucretler/`, `/referanslarimiz/`, `/kurumsal/`, `/iletisim/`. Logo `/` hedefine gider. Aktif öğe `aria-current=page`; drawer klavye/odak/Escape/scroll kilidi korunur. Tanışma CTA’sı [https://www.hurralingo.app/trial-request](https://www.hurralingo.app/trial-request) olur. Giriş ve sosyal medya bağlantıları ayrı işlevlerdir.

Mevcut desktop/mobile menüler bölüm anchor’ları kullanıyor. Üst menüde fiyat linki hâlâ `#fiyatlar`; footer `/ucretler/`. Yeni menü yalnızca TR sayfalarına uygulanmalı. Header/footer’ı ana sayfalardan kopyalayan blog üreticisinin diğer dillere yan etkisi önlenmeli.

## Ana sayfa sadeleştirme kararları

1 = kısa özet ana sayfada; 2 = detay sayfasına; 3 = ana sayfa özeti + detay; 4 = onay bekler. Bunlar öneridir; mevcut özgün içerik silinmedi.

| Bölüm | Mevcut kaynak | Karar | Ana sayfada önerilen kapsam | Detay / korunacak içerik |
| --- | --- | --- | --- | --- |
| Hero / değer önerisi | #top | 1 | Mevcut slogan, kısa açıklama, video, tek tanışma CTA’sı | Ürün iddiaları ayrı onayla; 7/24 ifadesinin kapsamı |
| 7 dil | #top, #neden, #sss | 3 | 7 dilin tamamı görünür | /derslerimiz/; Çince ve Türkçe çıkarılmaz |
| Yaş grupları | #programlar | 3 | 4–6 / 7–12 / 13–18 / yetişkin kısa kartları | Seviye ve hedef tabloları /derslerimiz/ |
| Eğitim modeli | #neden, #baslangic, #sss | 3 | Canlı ders + pratik + takip kısa özeti | /egitimmodelimiz/; mevcut fayda ve açıklamalar |
| Ders seçenekleri | #neden, #fiyatlar | 3 | Bire bir, 2–4 mini grup, 5–8 grup | /derslerimiz/; süre ve içerik açıklaması |
| Öğretmenler | #ogretmenler | 3 | Küçük vitrin + tüm kadro bağlantısı | 38 kayıt ve filtre /ogretmenlerimiz/; ana sayfa seçkisi onayı |
| AI / uygulama | #neden, #baslangic | 3 | Kısa günlük pratik vurgusu | /egitimmodelimiz/; demolar onaylı bağlantılarla |
| Ücretler | #fiyatlar | 3 | Mevcut veriyle başlangıç fiyatı/koşulu + hesaplayıcı linki | /ucretler/; veriyi iki yerde ayrı sabit sayılarla üretme |
| Referanslar | #yorumlar ve hero alıntısı | 3 | Mevcut 3 yorum veya onaylı seçki | /referanslarimiz/; aynı veliyi tekilleştir |
| Blog | Ana sayfada menü/footer var, yazı kartı bölümü yok | 3 | Mevcut 34 yazıdan küçük güncel seçki önerisi | /blog/ ve mevcut detaylar; yeni içerik uydurma |
| Başvuru alanları | #top, #baslangic, #son ve CTA’lar | 1 | Hero ve kapanıştan resmî uygulamaya link | Yerel başvuru formu/ödeme akışı oluşturma |
| Kurumsal | #kurumlar | 3 | Kısa kurumsal teklif çağrısı | /kurumsal/; 4 adım, okul/kurum/çalışan aileleri |
| Soru videoları | #sorular | 2 | İhtiyaç varsa tek özet bağlantısı | 6 video /egitimmodelimiz/#sss; poster ve erişim etkileşimleri korunur |
| SSS | #sss | 3 | Az sayıda temel soru + detay linki | Tam soru/yanıt /egitimmodelimiz/#sss |
| Eski fiyat/paket/ödül/adres | WordPress ve güncel SSS | 4 | Onaysız yeni iddia gösterilmez | Kaynak metin korunur, çelişki listesi uygulanır |

## Özgün arşiv içeriğinin kaybolmaması

Sertifikasyon ve içerik örnekleri Eğitim içinde adlandırılmış bölümler olarak ele alınır; SSS aynı sayfada desteklenir. Ders alt sayfalarının metni Dersler sayfasında uygun başlıklara eşlenir. Kurumsal arşivindeki fuar/ödül/hibe kayıtları, çalışanlara eğitim teklifiyle aynı şey değildir; ayrı alt bölüm olarak korunmalı ve kanıtı onaylanmalıdır. Ek adresler İletişim onay listesinde tutulur. Blog-grid tekrarları tek listeye yönlendirme adayıdır; tema örnekleri otomatik silinmez.

Kaynak kayıtlarının tümünün URL, medya ve karar eşleştirmesi [içerik envanterindedir](HURRALINGO-PHASE-1A-CONTENT-INVENTORY.md). Onaydan sonra taşıma öncesi mevcut dosyaların ve içerik modelinin sürümlü yedeği alınmalı; vitrine alınmayan metinler detay sayfasında veya arşiv verisinde korunmalı.
