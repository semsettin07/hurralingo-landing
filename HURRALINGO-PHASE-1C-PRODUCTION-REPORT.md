# Hurra Lingo — Faz 1C uygulama ve yayın raporu

Tarih: 16 Ekim 2026. Branch: `phase-1b-tr-multipage`.

Son preview: **https://a9226113.hurralingo-landing.pages.dev/**. Preview deployment ID: `a9226113-b39c-45e3-a60f-a4b0ce19f3f5`; uygulama commit'i: `282e92a` (sonraki kayıt commit'i test/rapor içindir). Cloudflare ortamı `Preview`, branch `phase-1b-tr-multipage` olarak doğrulandı.

**Production yayını yapılmadı.** Talimatın 4 ve 8. maddelerine göre eksik yasal kaynaklar, kampanya geçerliliği ve ödül kapsamının tamamlanmamış doğrulaması yayın engelidir. Main merge, production deployment, canlı DNS/SEO/robots değişikliği yapılmadı. Mevcut koşullu canlı yayın onayı kaydedildi; eksikler çözülmeden kullanılamaz.

## Tasarım ve içerik

- Büyük logo küçültülmedi. Ortalanmış, en fazla 1360 px üst alan; sekiz ana bağlantı istenen sırada. Dersler altında dört yaş grubu açılır menüsü korundu. 1440 px altında mobil menü; sekiz bağlantı ve yaş grupları mevcut. Dil seçimi, giriş, tanışma CTA, Bett şeridi, sarı rozet ve duyuru kapatma davranışı korundu.
- Ana sayfa mimarisi korundu. Boş öğretmen mesajı `hidden` olduğunda kesin olarak gizleniyor. Kapanış çağrısı çocuklar, gençler ve yetişkinleri kapsıyor.
- Şartlar ve Koşullar, uygulamanın giriş ve tanışma ekranlarında yayımlanan mevcut Türkçe PDF'ye bağlandı. Diğer üç başlık için uygun kaynak bulunmadığından hayali URL/metin eklenmedi.
- 34 blog gövdesi, 38 öğretmen, yedi dil, 2027 fiyat motoru/verisi, 184 Excel formülü, mevcut medya ve yabancı dil dosyaları korundu. Değişen 43 HTML dosyasında ortak navigasyon/footer güncellendi; blog içerikleri yeniden yazılmadı.

## Testler ve kanıtlar

- Statik: 43 canonical, 34 blog, 38 öğretmen, 166 korunan dosya SHA256, 2539 yerel bağlantı ve 609 medya referansı geçti. 184 formül ve 60 hesaplama senaryosu bağımsız doğrulandı.
- Tarayıcı: 43 sayfa × 320/390/768/1024/1440/1842 px = 258 kombinasyon; taşma yok. 60 ücret senaryosu, filtre/boş sonuç, blog arama/sıfırlama, mobil Escape/odak döndürme/Tab tuzağı, FAQ ve video diyalogu geçti. 22 ekran görüntüsü; JS hatası, bozuk görsel veya yerel HTTP hatası yok.
- Üst alan: iki sayfa × sekiz genişlik = 16 kontrol; büyük logo, duyuru sürekliliği, klavye açılır menüsü ve dört yaş grubu geçti.
- Fiyatlar mevcut 2027 TL değerleri ve “KDV hariç” koşuluyla gösteriliyor; fiyat/veri/ödeme politikası değiştirilmedi.
- Yerel 174 eski URL yönlendirmesi geçti. Uzak preview'da 43 Türkçe URL HTTP 200; tüm canonical/meta noindex/HTTP X-Robots-Tag, robots engeli ve 43 URL sitemap doğrulandı. `/en/`, `/de/`, `/az/` HTTP 200. 60 hesaplama senaryosu, 38 öğretmen/sekiz filtre, blog arama/sıfırlama, altı ekran genişliği ve mobil menü geçti. 174 eski URL ve altı yardımcı kuralın tamamı 301 → aynı preview origin'inde HTTP 200; bilinmeyen URL 404. Uzak JS/HTTP hata listeleri boş. Üst alan için aynı 16 kombinasyon ve klavye testleri uzak ortamda da geçti.
- Uzak paketteki 149 çalışma/medya dosyasının tamamı HTTP 200 (HEAD). Üç veli yorumu ve metinleri aynı; altı soru videosu erişilebilir. Kampanya PDF'si ve iki banner görseli Faz 1C öncesi Git referansıyla SHA256 eşleşiyor. WhatsApp HTTP 200 ile doğru numaraya yönleniyor; telefon/e-posta hedefleri kaydedildi.
- Kanıtlar: `docs/phase-1c/static-verification.json`, `browser-verification.json`, `header/`, `screenshots/`, `remote/remote-verification.json`, `remote/media-verification.json`, `content-preservation.json`, `external-links.json`, `preflight.json`, `preview-deployment.json`, `production-unchanged.json`, `production-package-verification.json`, `release-blockers.json`.

## Yayın öncesi engeller ve kaynaklar

1. **Yasal belgeler:** KVKK aydınlatma, Çerez Politikası ve Mesafeli Satış Sözleşmesi için onaylı uygun URL/metin gerekiyor. [Mevcut şartlar PDF](https://www.hurralingo.app/img/Hurra_Lingo_Terms_and_Conditions_tr.pdf) ve [Gizlilik PDF](https://www.hurralingo.app/img/Hurra_Lingo_privacy_tr.pdf) HTTP 200. Gizlilik belgesinin diğer üç başlığı karşıladığı varsayılmadı. Şartlar PDF'sindeki yaş ifadesi “On sekiz (12)” gibi mevcut tutarsızlıklar içerik sahibince gözden geçirilmeli; belge düzenlenmedi.
2. **Emniyet kampanyası:** Mevcut görseller/PDF korundu. Görsel %10 indirim ve yıl sonuna kadar ücretsiz AI erişimi vaat ediyor; hangi yıl, başvuru/geçerlilik süresi ve güncel koşullar onaylanmalı. Yeni tarih/koşul türetilmedi.
3. **Bett:** [Şirketin açıklaması](https://tr.linkedin.com/posts/hurraglobal_hurra-lingo-olarak-bett-uk-2026da-en-activity-7422171756485873664-bvKS) kapsamı Kids Judge Bett / Best Language App olarak belirtiyor. [Organizatör](https://uk.bettshow.com/visit), Kids Judge Bett ile Bett Awards etkinliklerini ayrı tanımlıyor. [Organizatörün 2026 kazananlar duyurusu](https://www.linkedin.com/posts/bettshow_kidsjudgebett2026-activity-7427755054872580097-mEfI) bulundu; erişilen metin şirket bazlı kazanan listesini göstermiyor. Hurra Lingo'yu ve kategoriyi açıkça gösteren organizatör kaydı/sertifika veya mevcut kısa banner ifadesinin kapsam onayı bekleniyor. Banner birebir korundu; yeni iddia eklenmedi.
4. Sosyal bağlantılar: Instagram/YouTube/TikTok/uygulama/kurumsal site HTTP 200; Facebook otomatik istekte 400, LinkedIn 999 döndü. Bu iki hesap elle doğrulanmalı; engelleme nedeniyle kırık oldukları kesinleştirilemedi. Telefon, e-posta ve WhatsApp hedefleri yerel bağlantı envanterinde korunuyor; ileti gönderilmedi.

## SEO ve ayrı paketler

- Preview: `dist/phase-1b-preview`; 43 Türkçe meta `noindex, nofollow`, genel `X-Robots-Tag: noindex, nofollow`, `robots.txt Disallow: /`.
- Production adayı: `dist/phase-1c-production`; yalnızca kopyalanan 43 Türkçe dosyada `index, follow`, doğru www canonical/OG adresleri; 43 URL sitemap; genel noindex başlığı yok; robots `Allow: /` ve sitemap. 404 sayfası noindex. 174 açık kural ve altı dar Unicode yardımcı 301 kuralı; `/tr/ → /` mevcut. Kaynak robots dosyası değiştirilmedi.
- EN/DE/AZ HTML/verileri bayt düzeyinde aynı. Bu sayfaların mevcut canonical'ları `hurralingo-landing.pages.dev/{en,de,az}.html`, meta robots değerleri `noindex, nofollow`. Kullanıcının talimatı gereği düzeltilmedi; ayrı onay/kapsam gerekir.
- Paket üretimi deployment yapmaz. Production adayı engeller çözülene kadar yayımlanmamalı; yayın öncesi yeniden build/test gerekir.

## Git, production ve rollback

- Değişiklik öncesi referans: `1adc7683919c7184561b8b844076ee584af215ae`.
- Main / origin main: `4750cad420a3d4215a3035c78aa4e2539857a033`.
- Son çalışan production ID: `b61b1c9e-4744-4956-b9d0-441dac1d39f1`; kaynak SHA yukarıdaki main. Faz 1C production commit/deployment ID: **yok**.
- Salt okunur canlı kontrollerde `/`, `/en/`, `/de/`, `/az/` HTTP 200; ana içerik, canonical, meta robots, robots gövdesi ve aktif deployment önceki main ile aynı.
- Gelecekte yayın sorunu olursa Cloudflare Pages → hurralingo-landing → Deployments içinden yukarıdaki başarılı production sürümüne rollback; canlı ana/alt sayfa, hesaplama, blog, 301 ve SEO smoke testleri tekrar. Gerekirse yayımlanan merge commit'i main üzerinde `git revert` ile geri alınır; force push yapılmaz. Bu fazda rollback gerekmedi ve çalıştırılmadı.
- Cloudflare build/root/output alanları boş; Git otomatik build repo kökünü kullanıyor. Geliştirme commit'leri `[CF-Pages-Skip]` ile gönderilip yalnızca hazırlanmış preview paketi açıkça feature branch'e yüklenir. Production proje yapılandırması değiştirilmedi.

## Değişen dosyalar

43 Türkçe HTML; `assets/site-tr.css`, `assets/site-tr.js`; `scripts/site-tr.cjs`, `build-site-tr.cjs`, `check-site-tr.cjs`, `check-site-browser-tr.cjs`, `check-header-tr.cjs`, `check-preview-remote.cjs`; yeni `scripts/package-production.cjs`, `check-phase1c-content.cjs`; `package.json`; bu rapor ve `docs/phase-1c/` test/ekran görüntüsü kayıtları. Tam liste `docs/phase-1c/changed-files.txt` içinde.
