// One-time migration. Re-running preserves the already migrated homepage.
const fs=require('node:fs');
let home=fs.readFileSync('index.html','utf8');
home=home.replace('Çocuğunuza uyan sınıf büyüklüğünü seçin. Ders başı ücreti, toplam tutarı ve taksit farkını burada açıkça görün.','Size uygun ders modelini seçin. Üyelik sürenize ve haftalık ders sayınıza göre ders başı ücretleri, toplam paket tutarını ve ödeme seçeneklerini hesaplayın.');
home=home.replace(/  <!-- Örnek hesap -->[\s\S]*?(?=<!-- SECTION 07-ogretmenler)/,`  <div class="calc" style="display:block;text-align:center">
    <h3 class="calc-t" style="padding:0">Size uygun ders planı ne kadar?</h3>
    <p class="calc-s" style="margin:16px auto 24px;max-width:760px">Öğretmen seçiminize, üyelik sürenize ve haftalık ders sayınıza göre peşin ve taksitli ödeme seçeneklerini karşılaştırın.</p>
    <a class="btn btn-primary" href="/ucretler/">Ders Ücretinizi Hesaplayın <svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></a>
  </div>
</section>

`);
home=home.replace('#fiyatlar{--fy-pesin-w:86.227045%; /* 24.792 / 28.752 */ position:relative}', '#fiyatlar{position:relative}');
const start=home.indexOf('<section class="sec" id="fiyatlar"'), end=home.indexOf('<!-- SECTION 07-ogretmenler',start);
let section=home.slice(start,end).replace(/<p class="price-note">[\s\S]*?<\/p>/g,'<p class="price-note">ders başı · Türk öğretmen<br>Yıllık üyelik, peşin ödeme · KDV hariç</p>');
home=home.slice(0,start)+section+home.slice(end);
home=home.replace('Ders başı, örnek fiyat','Ders başı · yıllık peşin · Türk öğretmen · KDV hariç');
fs.writeFileSync('index.html',home);
