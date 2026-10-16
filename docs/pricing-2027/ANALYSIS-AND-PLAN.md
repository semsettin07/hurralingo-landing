# Excel analizi ve uygulama planı

Kaynak: Hurra Lingo Kurs Ücretleri TL 2027.xlsx. Üç sayfa: TL Özel Ders Ücretleri, TL Mini Grup Ders Ücretleri, TL Grup Ders Ücretleri. Her sayfada Türk / native öğretmen tabloları vardır. Para birimi TL, başlıklarda KDV HARİÇ yazmaktadır. Aylık, 6 aylık ve yıllık üyelik; haftada 1 / 2 ders desteklenir. Aylık ders sayısı 4 / 8, altı aylık toplam 24 / 48, yıllık toplam 48 / 96'dır.

Özel ders aylık tabanı Türk öğretmen 1099 TL, native öğretmen 1549 TL. Mini grup tabanı özel ders tabanından %30, grup tabanı %50 indirimle ROUND(...,0) kullanılarak türetilir. Bunlar ek müşteri kampanyası değildir. Altı aylık üyelikte %5, yıllık üyelikte %10 indirim uygulanır; peşin ödemede yuvarlanmış ders ücretine sırasıyla %5 / %10 ilave indirim uygulanır ve tekrar tam liraya yuvarlanır. Toplamlar yuvarlanmış ders ücreti ile ders sayısının çarpımıdır.

Belirsizlik / sınırlar: KDV oranı yoktur, eklenmeyecektir. Taksit sayısı açıkça yazılmamıştır; aylık ödeme ve taksitli toplam gösterilecek, taksit sayısı varsayılmayacaktır. Aylık üyelikte ayrıca peşin / taksitli ayrımı yoktur. Katılımcı sayısı ve süre Excel'de yoktur; mevcut sitenin 5–8 / 2–4 / bire bir bilgileri kullanılacak, bunların kaynağı raporda ayrılacaktır. Eski 24.792 / 28.752 TL örneği güncel Excel ile uyuşmuyor; yerini hesaplayıcıya yönlendiren CTA alacaktır.

Plan:

Kullanıcının analiz sonrasındaki açıklamasıyla taksit kuralı netleşti: taksitler aylık çekilir ve taksit sayısı eğitim haftası / 4'tür. Buna göre 6 aylık paket 6, yıllık paket 12 taksittir; haftada 2 ders taksit sayısını değiştirmez. Nihai uygulamada bu bilgi kullanılır ve test edilir. Yukarıdaki başlangıç belirsizliği çözülmüştür.

1. Tüm hücre, formül, birleşim ve ek tablo/açıklama kayıtlarını yerel denetim JSON'una çıkar.
2. Hurra Türkiye'nin yerel hesaplayıcısındaki seçim / karşılaştırma yaklaşımını ve Excel ROUND yardımcısını uyarlayarak yalnızca bu çalışma kitabından fiyat verisi üret.
3. Hesaplamayı, Türkçe arayüz metinlerini ve DOM etkileşimini ayrı dosyalara ayır. Sunucu veya yeni üretim bağımlılığı ekleme.
4. Mevcut header, mobil menü, footer ve tasarım stilleriyle /ucretler/ sayfasını üret. Türkçe ana sayfa kartlarını koru, fiyat koşullarını açıkla, eski örnek yerine CTA koy. Diğer dilleri yayımlama.
5. Tüm Excel formüllerini bağımsız hesaplayıp önbellek sonuçlarıyla karşılaştır. Tüm geçerli paketleri ve ödeme seçeneklerini test et; mobil / tablet / masaüstü görünümü, klavye, doğrudan sayfa açılışı ve bağlantıları denetle.
6. Statik üretim ve mevcut blog kontrolünü çalıştır; test sonuçlarını uygulama raporuna ekle. Canlıya dağıtım yapma.

Referanslar: https://www.hurraturkiye.com/ucretler/ (canlı sayfa), ../hurraturkiye-landing/assets/overseas-pricing*.js (yerel güncel hesaplayıcı), https://www.hurralingo.com/ ve mevcut index.html. Canlı Türkiye sayfası yerel güncel hesaplayıcıdan farklı bir eski tasarım sunuyor; fiyatları aktarılmayacak.
