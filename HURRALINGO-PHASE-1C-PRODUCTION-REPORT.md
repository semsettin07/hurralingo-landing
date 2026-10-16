# Hurra Lingo — Faz 1C production raporu

16 Ekim 2026. **Canlı yayın tamamlandı ve production testleri geçti.**

- Canlı adres: https://www.hurralingo.com/
- İlk Faz 1C production uygulama commit SHA: `3c33eb2cd55118c040397f32232c0abfa852cce4`.
- İlk Faz 1C Cloudflare production deployment ID: `7aa0d6e6-b5b6-40cf-90c4-494e2868f511`.
- Deployment adresi: https://7aa0d6e6.hurralingo-landing.pages.dev.
- Ortam/branch: Production / main. Main birleştirildi ve origin/main'e pushlandı. Sonraki rapor commit'i uygulama deployment'ını değiştirmez.
- Son önizleme: https://5dbe68c1.hurralingo-landing.pages.dev/; preview engelleri korunuyor.

## Onay ve açık kalan kaynaklar

Kullanıcı önce yasal alanı yalnızca gönderdiği Privacy Policy ve Terms and Conditions PDF'leriyle sınırlandırdı. Ardından açıkça “Production ve Main de güncelleyelim canlıya alalım güncellemeleri” talimatını verdi. Mevcut içerikle yayın bu talimat kapsamında yapıldı. Önceki koşullu yayın durumu bu son talimatla güncellendi; kayıt: `docs/phase-1c/release-authorization.json`.

Bett iddiasının şirket kaynağı Kids Judge Bett / Best Language App 2026 kapsamını belirtiyor; organizatörün kazananlar duyurusu bulundu, ancak Hurra Lingo'yu gösteren kazanan kaydı ayrıca doğrulanmadı. Emniyet medyasındaki %10 indirim ve yıl sonuna kadar AI erişiminin uygulanacağı yıl/koşullar ayrıca doğrulanmalı. Bu maddeler doğrulanmış kabul edilmedi, mevcut metinler değiştirilmedi. Kayıt: `docs/phase-1c/release-blockers.json` içindeki `acceptedUnverifiedItems`.

Şirket ödül kaynağı: https://tr.linkedin.com/posts/hurraglobal_hurra-lingo-olarak-bett-uk-2026da-en-activity-7422171756485873664-bvKS
Organizatör kapsamı: https://uk.bettshow.com/visit
Organizatör duyurusu: https://www.linkedin.com/posts/bettshow_kidsjudgebett2026-activity-7427755054872580097-mEfI

## Yayındaki değişiklikler

- Büyük logo ve ortalanmış üst alan, Bett şeridi/sarı rozet ve mevcut animasyonlar korundu. Sekiz ana bağlantı istenen sırada; Dersler altında dört yaş grubu. 1440 px altında mobil menüde sekiz bağlantı ve programlar var. Dil seçimi, giriş ve tanışma CTA korundu.
- Sade ana sayfa korundu; öğretmen boş sonuç mesajı yalnızca sonuçsuz filtrede görünür. Kapanış CTA çocuklar/gençler/yetişkinleri kapsar.
- 43 Türkçe sayfa, 34 blog gövdesi, 38 öğretmen, yedi dil, üç mevcut yorum ve altı soru videosu korundu. 2027 TL ücret motoru/verisi/ödeme politikası değiştirilmedi; fiyatlarda KDV hariç koşulu korunur.
- Footer'da yalnızca kullanıcının verdiği iki İngilizce PDF var; tür/dil bağlantı etiketlerinde belirtilir. Dosyalar eski WordPress URL yollarında gerçek PDF olarak sunulur. Canlı PDF'ler gönderilen eklerle SHA256 eşleşir. KVKK/mesafeli satış başlığı veya yeni yasal metin üretilmedi.
- EN/DE/AZ kaynakları değiştirilmedi; kampanya PDF ve iki banner görseli Faz 1C öncesi referansla SHA256 eşleşir.

## Test sonuçları

- Statik: 43 canonical, 34 blog, 38 öğretmen, 166 korunan dosya SHA256; 2625 yerel bağlantı ve 609 medya referansı geçti.
- Bağımsız hesaplama: 184 Excel formülü ve 60 ücret senaryosu geçti.
- Yerel tarayıcı: 43 sayfa × 320/390/768/1024/1440/1842 px = 258 kombinasyon; taşma yok. Video, FAQ, blog arama/sıfırlama/kategori, öğretmen filtreleri ve boş sonuç, mobil Escape/odak/Tab tuzağı geçti. 22 ekran görüntüsü; JS, yerel HTTP veya bozuk görsel hatası yok. Üst alan için ayrıca iki sayfa × sekiz genişlik ve klavye açılır menüsü geçti.
- **Canlı production:** 43 Türkçe URL HTTP 200; canonical'lar www alanında doğru, meta index/follow ve HTTP başlıklarında yanlış noindex yok. Sitemap 43 URL; robots Allow: / ve doğru sitemap içeriyor.
- **Canlı işlevler:** 60 hesaplama senaryosu, 38 öğretmen/sekiz filtre, blog arama/sıfırlama, altı ekran genişliğinde ana sayfa ve mobil menü geçti. 174 eski URL ve altı yardımcı 301 kuralı aynı canlı origin'de HTTP 200 hedeflere gidiyor. Bilinmeyen URL gerçek 404. JS/HTTP hata listeleri boş.
- **Canlı medya/yasal:** 149 çalışma/medya dosyası HTTP 200. İki yasal dosya application/pdf HTTP 200 ve orijinal eklerle aynı SHA256. Eksik medya bulunmadı.
- **Yabancı diller:** /en/, /de/, /az/ HTTP 200; canonical/noindex değerleri önceki dosyalarla aynı. Mevcut pages.dev canonical'ları ve noindex bu fazın kapsamı gereği korunmuştur; ayrı SEO çalışması gerektirir.
- Harici uygulama/Instagram/YouTube/TikTok/kurumsal site ve WhatsApp kontrolleri geçti. Facebook otomatik istekte 400, LinkedIn 999 verdi; hesaplar elle doğrulanmalı. E-posta/telefon hedefleri doğru biçimde korundu; ileti gönderilmedi.

Kanıtlar: `docs/phase-1c/static-verification.json`, `browser-verification.json`, `header/`, `content-preservation.json`, `legal-documents-verification.json`, `legal-preview-remote.json`, `production-package-verification.json`, `production/deployment.json`, `production/remote-verification.json`, `production/media-legal-foreign.json` ve ekran görüntüleri.

## Paketler ve SEO

- Preview: `dist/phase-1b-preview`; meta noindex/nofollow, genel X-Robots-Tag noindex/nofollow, robots Disallow: /.
- Production: `dist/phase-1c-production`; yalnızca kopyalanan 43 Türkçe sayfa index/follow; doğru canonical/OG/meta açıklamaları, 43 URL sitemap, robots Allow: /; genel noindex başlığı yok, 404 noindex. 174 açık + altı dar Unicode yardımcı yönlendirme; /tr/ → / mevcut.
- Yabancı dil dosyaları iki pakette aynı; kaynak robots/noindex önizleme için korunur. Canlıya yalnızca ayrı production paketi yüklenmiştir.
- Cloudflare Git build/output/root yapılandırması değiştirilmedi (boş). Kaynak kök dizini preview SEO içerdiğinden gelecekte repo kökünü doğrudan production'a yayımlamayın: önce site:build, site:check, site:package-preview, site:package-production; release durumu ve paket SEO'sunu doğrulayıp dist/phase-1c-production yükleyin. Bu yayında main merge/rapor commit'lerinde [CF-Pages-Skip] kullanılarak otomatik kök build önlendi.
- DNS değişmedi. Türkçe production indeksleme ayarları kullanıcının canlı yayın talimatıyla etkinleştirildi.

## Önceki sürüm ve rollback

- Faz 1C öncesi geliştirme referansı: `1adc7683919c7184561b8b844076ee584af215ae`.
- Yayın öncesi main SHA: `4750cad420a3d4215a3035c78aa4e2539857a033`.
- Önceki çalışan production ID: `b61b1c9e-4744-4956-b9d0-441dac1d39f1`.
- Gerekirse Cloudflare Pages → hurralingo-landing → Deployments → bu önceki başarılı production sürümüne rollback. Ardından ana/alt sayfalar, hesaplama, blog, 301, canonical/robots için smoke test tekrarlanır. Git geri dönüşü gerekirse yayın merge'i main üzerinde git revert ile geri alınır; force push yapılmaz.
- Yayın ve testler başarılı; rollback yapılmadı.

## Değişen dosyalar

43 Türkçe HTML; assets/site-tr.css ve site-tr.js; Türkçe shell/build ve QA script'leri; preview/production paketleyiciler; package.json; iki wp-content/uploads/2026/03 PDF; production smoke script'i, raporlar ve docs/phase-1c kanıtları. Fiyat motoru/verisi ve yabancı dil kaynakları değiştirilmedi. Tam liste: `docs/phase-1c/changed-files.txt`.

## Son revizyon — logo ve menü içerik hizası

16 Ekim 2026: Üst alanın 1360 px sınırı ana içerikle ortak `--wrap` (masaüstü 1120 px) sınırına alındı. Büyük logo korunarak navigasyon aralıkları düzenlendi. Sol logo ve sağ aksiyonlar içerik kenarlarıyla 1 px altında farkla hizalı; menü/aksiyon çakışması yok. Yerel, preview ve canlı ortamda ikişer sayfa × sekiz genişlik = 16 kontrol geçti; Bett, dört yaş grubu, sekiz ana bağlantı, Escape/odak ve duyuru kapatma davranışı korundu. Statik 43 canonical / 166 korunan dosya ve 184 formül / 60 hesaplama kontrolleri tekrar geçti. Windows checkout CRLF farkını normalize eden kontrol düzeltmesi fiyat motorunu/verisini değiştirmez.

**Güncel production deployment:** `6b357eff-941b-45d6-a443-def52b8e4cb5`; uygulama commit: `385dc83dbf21b410e72cb32bf053a70dacec9a21`. Önceki sürüm/rollback hedefi: `7aa0d6e6-b5b6-40cf-90c4-494e2868f511`. Main güncellendi; canlı CSS kaynakla SHA256 eşleşir. Kanıtlar: `docs/header-content-alignment/production-verification.json`, `production-deployment.json` ve ekran görüntüleri. Önizleme: https://7f484ade.hurralingo-landing.pages.dev/
