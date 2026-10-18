window.HurraLocaleLanguages = {"İngilizce":"Anglais","Almanca":"Allemand","Fransızca":"Français","İspanyolca":"Espagnol","Rusça":"Russe","Çince":"Chinois","Türkçe":"Turc"};
try{if(localStorage.getItem('hl-announce-v1'))document.getElementById('announce').hidden=true}catch(e){}
;

(function(){
  var doc = document.documentElement;
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var hdr = document.getElementById('hdr');
  var menuBtn = document.getElementById('hd-menu'), drawer = document.getElementById('drawer');
  var slice = function(l){ return Array.prototype.slice.call(l); };

  /* ── Duyuru: kapat ve hatırla ── */
  var an = document.getElementById('announce');
  if(an){
    an.querySelector('.an-x').addEventListener('click', function(){
      try{ localStorage.setItem('hl-announce-v1', '1'); }catch(_){}
      an.classList.add('is-leaving');
      var brand = hdr.querySelector('.brand'); if(brand) brand.focus({preventScroll:true});
      setTimeout(function(){ an.hidden = true; requestFrame(); }, reduce ? 0 : 150);
    });
  }

  /* ── Kaydırınca sıkışma: yapışkan konuma oturunca .scrolled ── */
  var stickTop = 0, ticking = false;
  function readTop(){ stickTop = parseFloat(getComputedStyle(hdr).top) || 0; }
  function update(){
    ticking = false;
    var stuck = window.scrollY > 0 && hdr.getBoundingClientRect().top <= stickTop + 0.5;
    hdr.classList.toggle('scrolled', stuck);
  }
  function requestFrame(){ if(!ticking){ ticking = true; requestAnimationFrame(update); } }
  readTop(); update();
  window.addEventListener('scroll', requestFrame, {passive:true});
  window.addEventListener('resize', function(){ readTop(); requestFrame(); if(drOpen) placeDrawer(); });

  /* ── Açılır menüler (Programlar: hover + focus + klavye; Dil: tıklama + klavye) ── */
  var dds = [];
  function focusEl(el){ if(!el) return; el.focus(); if(document.activeElement !== el) requestAnimationFrame(function(){ el.focus(); }); }
  slice(hdr.querySelectorAll('[data-dd]')).forEach(function(wrap){
    var trig = wrap.querySelector('.dd-trig'), panel = wrap.querySelector('.dd');
    var isLink = trig.tagName === 'A', open = false, t = null;
    var hovering = false, hoverLock = false, noFocusOpen = false, pType = '', pTime = 0, wasOpen = false;
    function items(){ return slice(panel.querySelectorAll('a[href]')); }
    function set(v){
      if(open === v) return; open = v;
      if(v) dds.forEach(function(d){ if(d.wrap !== wrap) d.set(false); });
      wrap.classList.toggle('is-open', v);
      trig.setAttribute('aria-expanded', String(v));
    }
    dds.push({wrap:wrap, set:set});

    if(wrap.hasAttribute('data-hover')){
      wrap.addEventListener('pointerenter', function(e){ if(e.pointerType !== 'mouse') return; hovering = true; clearTimeout(t); if(!hoverLock) set(true); });
      wrap.addEventListener('pointerleave', function(e){ if(e.pointerType !== 'mouse') return; hovering = false; hoverLock = false; clearTimeout(t); t = setTimeout(function(){ if(!hovering) set(false); }, 140); });
    }
    trig.addEventListener('pointerdown', function(e){ pType = e.pointerType; pTime = Date.now(); wasOpen = open; });
    if(wrap.hasAttribute('data-focus-open')){
      wrap.addEventListener('focusin', function(e){
        if(noFocusOpen){ noFocusOpen = false; return; }
        if(e.target === trig && Date.now() - pTime < 600) return; /* işaretçiyle gelen odak: hover/tıklama yönetir */
        set(true);
      });
    }
    wrap.addEventListener('focusout', function(e){ if(!hovering && !(e.relatedTarget && wrap.contains(e.relatedTarget))) set(false); });

    trig.addEventListener('click', function(e){
      var recent = Date.now() - pTime < 800;
      if(isLink){
        if(recent && pType === 'touch' && !wasOpen){ e.preventDefault(); set(true); } /* dokunmatik: ilk dokunuş açar */
        else { set(false); hoverLock = hovering; }
      } else {
        set(recent && pType === 'mouse' ? !wasOpen : !open);
      }
      pType = '';
    });
    panel.addEventListener('click', function(e){ if(e.target.closest('a')){ set(false); hoverLock = hovering; } });

    wrap.addEventListener('keydown', function(e){
      var its = items(), i = its.indexOf(document.activeElement);
      if(e.key === 'Escape' && open){ e.preventDefault(); e.stopPropagation(); if(document.activeElement !== trig) noFocusOpen = true; set(false); trig.focus(); return; }
      if(e.key === 'ArrowDown'){ e.preventDefault(); set(true); focusEl(its[i + 1] || its[0]); }
      else if(e.key === 'ArrowUp'){ e.preventDefault(); set(true); focusEl(i > 0 ? its[i - 1] : its[its.length - 1]); }
      else if(e.key === 'Home' && i > -1){ e.preventDefault(); its[0].focus(); }
      else if(e.key === 'End' && i > -1){ e.preventDefault(); its[its.length - 1].focus(); }
    });
  });
  document.addEventListener('pointerdown', function(e){ dds.forEach(function(d){ if(!d.wrap.contains(e.target)) d.set(false); }); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') dds.forEach(function(d){ d.set(false); }); });

  /* ── Scrollspy: görünürdeki bölümün menü öğesi vurgulanır.
        Bölümler bu script'ten sonra geldiği için kurulum DOM hazır olunca yapılır. ── */
  function initSpy(){
    var spy = slice(document.querySelectorAll('.header [data-spy], #drawer [data-spy]'));
    var secs = ['sorular','programlar','fiyatlar','ogretmenler','kurumlar'].map(function(id){ return document.getElementById(id); }).filter(Boolean)
      .sort(function(a, b){ return a.compareDocumentPosition(b) & 4 ? -1 : 1; });
    if(!('IntersectionObserver' in window) || !secs.length) return;
    var vis = {}, last;
    function setActive(id){
      if(id === last) return; last = id;
      spy.forEach(function(a){
        var on = !!id && a.getAttribute('href') === '#' + id;
        a.classList.toggle('is-active', on);
        if(on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ vis[en.target.id] = en.isIntersecting; });
      var cur = null; secs.forEach(function(s){ if(vis[s.id]) cur = s.id; });
      setActive(cur);
    }, {rootMargin:'-38% 0px -58% 0px'});
    secs.forEach(function(s){ io.observe(s); });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSpy); else initSpy();

  /* ── Mobil menü: panel, kaydırma kilidi, odak yönetimi ── */
  var drOpen = false, closeT = null;
  function placeDrawer(){ drawer.style.setProperty('--dr-top', Math.max(0, Math.round(hdr.getBoundingClientRect().bottom)) + 'px'); }
  function lock(on){
    doc.classList.toggle('hl-lock', on); /* base: html.hl-lock{overflow:hidden}; scrollbar-gutter:stable kaymayı önler */
  }
  function openDrawer(){
    if(drOpen) return; drOpen = true; clearTimeout(closeT);
    dds.forEach(function(d){ d.set(false); });
    placeDrawer();
    drawer.hidden = false; void drawer.offsetHeight;
    drawer.classList.add('is-open');
    menuBtn.setAttribute('aria-expanded', 'true'); menuBtn.setAttribute('aria-label', 'Fermer le menu');
    lock(true);
    drawer.scrollTop = 0;
    var first = drawer.querySelector('a[href], button'); if(first) first.focus({preventScroll:true});
  }
  function closeDrawer(restore){
    if(!drOpen) return; drOpen = false;
    drawer.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-label', 'Ouvrir le menu');
    lock(false);
    closeT = setTimeout(function(){ if(!drOpen) drawer.hidden = true; }, reduce ? 0 : 170);
    if(restore) menuBtn.focus({preventScroll:true});
  }
  menuBtn.addEventListener('click', function(){ if(drOpen) closeDrawer(true); else openDrawer(); });
  drawer.addEventListener('click', function(e){ if(e.target.closest('a[href]')) closeDrawer(false); });
  document.addEventListener('keydown', function(e){
    if(!drOpen) return;
    if(e.key === 'Escape'){ closeDrawer(true); return; }
    if(e.key !== 'Tab') return;
    var f = [menuBtn].concat(slice(drawer.querySelectorAll('a[href], button:not([disabled])')));
    var first = f[0], last = f[f.length - 1], cur = document.activeElement;
    if(f.indexOf(cur) === -1){ e.preventDefault(); first.focus(); }
    else if(e.shiftKey && cur === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && cur === last){ e.preventDefault(); first.focus(); }
  });
  if(window.matchMedia){
    var wide = matchMedia('(min-width:1440px)');
    var onWide = function(){ if(wide.matches) closeDrawer(false); };
    if(wide.addEventListener) wide.addEventListener('change', onWide); else if(wide.addListener) wide.addListener(onWide);
  }
})();

;

(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Video: reduced-motion'da oynamaz; duraklat/oynat düğmesi (WCAG 2.2.2); ekran dışında durur
  var v = document.getElementById('hero-video'), pb = document.querySelector('.hm-pause');
  if(v && pb){
    var userPaused = reduce;
    var sync = function(){ var p = v.paused; pb.classList.toggle('is-paused', p); pb.setAttribute('aria-label', p ? 'Lire la vidéo' : 'Mettre la vidéo en pause'); };
    var tryPlay = function(){ var r = v.play(); if(r && r.catch) r.catch(sync); };
    v.addEventListener('play', sync); v.addEventListener('pause', sync);
    pb.addEventListener('click', function(){ if(v.paused){ userPaused = false; tryPlay(); } else { userPaused = true; v.pause(); } });
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ if(!userPaused) tryPlay(); } else if(!v.paused){ v.pause(); } }); }, {threshold:.15}).observe(v);
    } else if(!userPaused){ tryPlay(); }
    sync();
  }

  // Güven şeridi: görünür olunca bir kez sayma (JS yoksa rakamlar zaten doğru)
  var pf = document.querySelector('.proof');
  if(pf && !reduce && 'IntersectionObserver' in window && window.requestAnimationFrame){
    var io = new IntersectionObserver(function(es){
      if(!es[0].isIntersecting) return; io.disconnect();
      pf.querySelectorAll('[data-count]').forEach(function(el){
        var n = +el.getAttribute('data-count'), t0 = null, d = n > 9 ? 1100 : 700;
        var step = function(t){ if(t0 === null) t0 = t; var k = Math.min(1, (t - t0) / d); el.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))); if(k < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      });
    }, {threshold:.6});
    io.observe(pf);
  }
})();

;

(function(){
  var sec = document.getElementById('sorular'); if(!sec) return;
  var track = document.getElementById('reels');
  var cards = [].slice.call(track.querySelectorAll('.reel'));
  var segs = [].slice.call(sec.querySelectorAll('.sq-seg'));
  var prev = sec.querySelector('.sq-arrow[data-dir="prev"]'), next = sec.querySelector('.sq-arrow[data-dir="next"]');
  var mqHover = matchMedia('(hover:hover) and (pointer:fine)');
  var mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  var conn = navigator.connection;
  function behavior(){ return mqReduce.matches ? 'auto' : 'smooth'; }
  sec.setAttribute('data-js', '');

  /* Kaydırma durumu: oklar, kenar maskesi */
  var raf = 0;
  function update(){
    raf = 0;
    var max = track.scrollWidth - track.clientWidth, x = track.scrollLeft;
    var atStart = x <= 2, atEnd = x >= max - 2;
    track.toggleAttribute('data-scrolled', !atStart);
    track.toggleAttribute('data-end', atEnd);
    prev.setAttribute('aria-disabled', String(atStart));
    next.setAttribute('aria-disabled', String(atEnd));
  }
  track.addEventListener('scroll', function(){ if(!raf) raf = requestAnimationFrame(update); }, {passive:true});
  if('ResizeObserver' in window) new ResizeObserver(update).observe(track); else addEventListener('resize', update);
  update();

  /* Oklar: görünen kart sayısı kadar ilerle */
  function metrics(){
    var pad = cards[0].offsetLeft, cw = cards[1].offsetLeft - cards[0].offsetLeft;
    return {pad: pad, cw: cw, per: Math.max(1, Math.floor((track.clientWidth - 2 * pad + (cw - cards[0].offsetWidth)) / cw))};
  }
  function go(dir){
    var m = metrics(), idx = Math.round(track.scrollLeft / m.cw);
    var j = Math.max(0, Math.min(cards.length - 1, idx + dir * m.per));
    track.scrollTo({left: cards[j].offsetLeft - m.pad, behavior: behavior()});
  }
  [prev, next].forEach(function(b){
    b.addEventListener('click', function(){ if(b.getAttribute('aria-disabled') !== 'true') go(b === next ? 1 : -1); });
  });

  /* Klavye: sol/sağ oklar kartlar arasında gezer, Home/End uçlara gider */
  track.addEventListener('keydown', function(e){
    var b = e.target.closest('.reel-btn'); if(!b) return;
    var i = cards.indexOf(b.closest('.reel')), j;
    if(e.key === 'ArrowRight') j = i + 1; else if(e.key === 'ArrowLeft') j = i - 1;
    else if(e.key === 'Home') j = 0; else if(e.key === 'End') j = cards.length - 1; else return;
    e.preventDefault();
    j = Math.max(0, Math.min(cards.length - 1, j)); if(j === i) return;
    cards[j].querySelector('.reel-btn').focus({preventScroll: true});
    cards[j].scrollIntoView({behavior: behavior(), block: 'nearest', inline: 'nearest'});
  });

  /* İlerleme: tamamen görünen kartların segmenti yanar */
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(en){
      en.forEach(function(x){ var k = cards.indexOf(x.target); if(segs[k]) segs[k].classList.toggle('on', x.intersectionRatio >= .9); });
    }, {root: track, threshold: [0, .5, .9, 1]});
    cards.forEach(function(c){ io.observe(c); });
  }

  /* Hover önizleme: yalnızca fare, hareket azaltılmamışsa; src ilk hover'da yüklenir, sessiz oynar */
  function start(li){
    var v = li.querySelector('.reel-vid'); li._want = true; clearTimeout(li._rt);
    if(!v.getAttribute('src')) v.src = v.dataset.src;
    v.muted = true;
    var p = v.play(); if(p && p.catch) p.catch(function(){});
  }
  function stop(li, now){
    var v = li.querySelector('.reel-vid'); li._want = false; clearTimeout(li._t);
    li.classList.remove('is-live');
    if(!v.getAttribute('src')) return;
    v.pause(); clearTimeout(li._rt);
    li._rt = setTimeout(function(){ try { v.currentTime = 0; } catch(_){} }, now ? 0 : 260);
  }
  cards.forEach(function(li){
    var v = li.querySelector('.reel-vid');
    v.addEventListener('playing', function(){ if(li._want) li.classList.add('is-live'); else v.pause(); });
    li.addEventListener('pointerenter', function(e){
      if(e.pointerType !== 'mouse' || !mqHover.matches || mqReduce.matches || (conn && conn.saveData)) return;
      clearTimeout(li._t); li._t = setTimeout(function(){ start(li); }, 120);
    });
    li.addEventListener('pointerleave', function(){ stop(li); });
  });
  document.addEventListener('visibilitychange', function(){ if(document.hidden) cards.forEach(function(li){ stop(li, true); }); });

  /* Tıklama / Enter / Space: sesli tam video */
  track.addEventListener('click', function(e){
    var li = e.target.closest('.reel'); if(!li) return;
    var b = li.querySelector('.reel-btn'), title = li.querySelector('.reel-qt').textContent;
    stop(li, true);
    if(window.HL && typeof window.HL.openVideo === 'function') window.HL.openVideo(b.dataset.video, title);
    else window.open(b.dataset.video, '_blank', 'noopener');
  });
})();

;

(function(){
  // [ad, dil, görsel, fotoğrafın dikey kaydırması (üst boşluk)]
  // Verified names/languages: official English and Turkish tutor pages; see PHASE-1-REPORT.md.
  var T = [["Adam Büyükbiçer","İngilizce","/img/t-adam.webp","7%"],["Bengü Kesen","İngilizce","/img/t-bengu.webp","5%"],["Adeniyi Peace","İngilizce","/img/t-adeniyi.webp","0%"],["Alexandra Çavuş","İspanyolca","/img/t-alexandra.webp","5%"],["Nesrin Yılmaz","Almanca","/img/t-nesrin.webp","5%"],["Ayzade Kahya","Rusça","/img/t-ayzade.webp","6%"],["Ayşegül Eskikurt","İngilizce","/img/t-aysegul-eskikurt.jpg","0%"],["Ayşegül Santur","İngilizce","/img/t-aysegul-santur.png","0%"],["Ayşın Yaşa","İngilizce","/img/t-aysin-yasa.jpg","0%"],["Betül Beyza","İngilizce","/img/t-betul-beyza.png","0%"],["Büşra Sürekçi","İngilizce","/img/t-busra-surekci.png","0%"],["Ghazaleh Ghazalifard","İngilizce","/img/t-ghazaleh-ghazalifard.png","0%"],["Burak Santur","İngilizce","/img/t-burak-santur.png","0%"],["Deniz Özlü","İngilizce","/img/t-deniz-ozlu.jpg","0%"],["J. Luis Fernandez Salazar","İspanyolca","/img/t-j-luis-fernandez-salazar.png","0%"],["Gizem Kenez","İngilizce","/img/t-gizem-kenez.jpg","0%"],["Kayra Ağır","İngilizce","/img/t-kayra-agir.jpg","0%"],["Mustafa Hakan","İngilizce","/img/t-mustafa-hakan.png","0%"],["Neslihan Kızılbayır","İngilizce","/img/t-neslihan-kizilbayir.jpg","0%"],["Parisa Khalegni","İngilizce","/img/t-parisa-khalegni.jpg","0%"],["Saskia Douglas","İngilizce","/img/t-saskia-douglas.png","0%"],["Sedef Şen","İngilizce","/img/t-sedef-sen.jpg","0%"],["Sibel Bulut","Almanca","/img/t-sibel-bulut.jpg","0%"],["Yağmur Irmak Özarslan","İngilizce","/img/t-yagmur-irmak-ozarslan.jpg","0%"],["Yasemin Ürer","İngilizce","/img/t-yasemin-urer.jpg","0%"],["Yolandi Bezuidenhout","İngilizce","/img/t-yolandi-bezuidenhout.jpg","0%"],["Zeynep Akgül","İngilizce","/img/t-zeynep-akgul.png","0%"],["Zeynep Sarıibrahimoğlu","İngilizce","/img/t-zeynep-sariibrahimoglu.jpg","0%"],["Deniz Okumuş","İngilizce","/img/t-deniz-okumus.jpg","0%"],["Elif Gizem Kaya","Almanca","/img/t-elif-gizem-kaya.jpg","0%"],["Müge Tınaz","İngilizce","/img/t-muge-tinaz.jpg","0%"],["Sultan Ecem Kolluoğlu","İngilizce","/img/t-sultan-ecem-kolluoglu.jpg","0%"],["Ezgi Dinç","İngilizce","/img/t-ezgi-dinc.jpg","0%"],["Hatice Onar","Almanca","/img/t-hatice-onar.jpg","0%"],["Ceyda Sönmez","Almanca","/img/t-ceyda-sonmez.jpg","0%"],["Duru Melek","İngilizce","/img/t-duru-melek.jpg","0%"],["Yanshan Lin","Çince","/img/t-yanshan-lin.jpg","0%"],["Füsun Köse","Fransızca","/img/t-fusun-kose.jpg","0%"]];
  var TONE = {"İngilizce":"en","Almanca":"de","Fransızca":"fr","İspanyolca":"es","Rusça":"ru","Çince":"zh","Türkçe":"tr"};
  var HI = {en:'Hello!', de:'Hallo!', fr:'Bonjour !', es:'¡Hola!', ru:'Привет!', zh:'你好!', tr:'Merhaba!'};
  var TAIL = '<svg viewBox="20 76 46 40" aria-hidden="true"><path d="M34,80 C33,93 29,103 23,110 C20.5,112.8 22.5,115.4 25.5,113.8 C40,106 54,95 64,80 Z"/></svg>';
  var grid = document.getElementById('teachers'), count = document.getElementById('t-count'), empty = document.getElementById('t-empty');
  var sec = document.getElementById('ogretmenler');
  if(!grid) return;
  if(sec.dataset.limit) T=T.slice(0,Number(sec.dataset.limit));

  grid.innerHTML = T.map(function(t){
    var k = TONE[t[1]] || 'tr';
    return '<article class="teacher" data-lang="'+t[1]+'" data-tone="'+k+'"><div class="t-in">' +
      '<div class="t-media"><span class="t-back" aria-hidden="true"></span>' +
        '<div class="t-ph"><img src="'+t[2]+'" alt="'+t[0]+'" width="480" height="480" loading="lazy" style="--oy:'+t[3]+'"></div>' +
        '<span class="t-hi" lang="'+k+'" aria-hidden="true">'+HI[k]+TAIL+'</span></div>' +
      '<h3 class="t-name">'+t[0]+'</h3>' +
      '<p class="t-lang"><i aria-hidden="true"></i>'+window.HurraLocaleLanguages[t[1]]+'</p>' +
      '<a class="t-cta" aria-label="Cours d’essai gratuit" href="https://www.hurralingo.app/trial-request" target="_blank" rel="noopener noreferrer">' +
        '<span class="t-roll"><span>Cours d’essai gratuit</span><span aria-hidden="true">Cours d’essai gratuit</span></span>' +
        '<span class="t-arrow" aria-hidden="true"><svg class="icon"><use href="#i-arrow"/></svg></span></a>' +
    '</div></article>';
  }).join('');

  // Filtre: çıkanlar hızlıca söner, kalanlar yeni yerlerine kayar (FLIP), girenler yumuşakça belirir
  var reduce = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : {matches:false};
  var EASE = 'cubic-bezier(.2,.8,.2,1)', run = 0;
  function label(f, n){
    return '<b>'+n+'</b> enseignants affichés'+(f==='all'?'':' · '+window.HurraLocaleLanguages[f]);
  }
  function apply(f){
    var cards = [].slice.call(grid.children);
    var match = function(c){ return f === 'all' || c.dataset.lang === f; };
    var n = cards.filter(match).length;
    count.innerHTML = label(f, n);
    empty.hidden = n > 0;
    var canAnim = !reduce.matches && typeof grid.animate === 'function';
    cards.forEach(function(c){ if(c.getAnimations) c.getAnimations().forEach(function(a){ a.cancel(); }); });
    if(!canAnim){ cards.forEach(function(c){ c.hidden = !match(c); }); return; }
    var id = ++run;
    var first = new Map();
    cards.forEach(function(c){ if(!c.hidden) first.set(c, c.getBoundingClientRect()); });
    var leaving = cards.filter(function(c){ return !c.hidden && !match(c); });
    var entering = cards.filter(function(c){ return c.hidden && match(c); });
    var staying = cards.filter(function(c){ return !c.hidden && match(c); });
    var outs = leaving.map(function(c){
      return c.animate([{opacity:1, transform:'none'}, {opacity:0, transform:'scale(.94)'}], {duration:150, easing:'cubic-bezier(.4,0,1,1)', fill:'forwards'}).finished;
    });
    Promise.all(outs).then(function(){
      if(id !== run) return;
      leaving.forEach(function(c){ c.hidden = true; c.getAnimations().forEach(function(a){ a.cancel(); }); });
      entering.forEach(function(c){ c.hidden = false; });
      staying.forEach(function(c){
        var a = first.get(c), b = c.getBoundingClientRect(), dx = a.left - b.left, dy = a.top - b.top;
        if(Math.abs(dx) > .5 || Math.abs(dy) > .5) c.animate([{transform:'translate('+dx+'px,'+dy+'px)'}, {transform:'none'}], {duration:340, easing:EASE});
      });
      entering.forEach(function(c, i){
        c.animate([{opacity:0, transform:'translateY(10px) scale(.94)'}, {opacity:1, transform:'none'}], {duration:300, delay:(staying.length ? 90 : 0) + i*45, easing:EASE, fill:'backwards'});
      });
    }).catch(function(){});
  }
  var chips = [].slice.call(sec.querySelectorAll('[data-filter]'));
  chips.forEach(function(b){
    b.addEventListener('click', function(){
      if(b.getAttribute('aria-pressed') === 'true') return;
      chips.forEach(function(x){ x.setAttribute('aria-pressed', String(x === b)); });
      apply(b.dataset.filter);
    });
  });

  // Başlıktaki dalga: bölüm görünür olunca bir kez çizilir (JS yoksa zaten çizili durur)
  var mark = sec.querySelector('.o7-mark');
  if(mark && 'IntersectionObserver' in window && !reduce.matches){
    var r = mark.getBoundingClientRect();
    if(r.top > innerHeight * .9){
      mark.classList.add('is-pending');
      var io = new IntersectionObserver(function(es){
        es.forEach(function(e){ if(e.isIntersecting){ mark.classList.remove('is-pending'); io.disconnect(); } });
      }, {rootMargin:'0px 0px -12% 0px'});
      io.observe(mark);
    }
  }
})();

;

/* Ajan 8: SSS kopyala düğmesi, akordeon (yedek yükseklik animasyonu), maskot tepkisi, başa dön */
(function(){
  var rm = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : {matches:false};

  // Numara kopyalama
  var live = document.getElementById('kap-live');
  document.querySelectorAll('#sss [data-kap-copy]').forEach(function(btn){
    var label = btn.querySelector('.kap-copy-l'), src = document.getElementById(btn.getAttribute('data-kap-copy')), timer;
    function show(ok){
      btn.setAttribute('data-state', ok ? 'ok' : 'sel');
      label.textContent = ok ? 'Copié' : 'Sélectionné';
      if(live) live.textContent = ok ? 'Numéro copié dans le presse-papiers.' : 'Numéro sélectionné ; utilisez Ctrl+C ou Cmd+C pour le copier.';
      clearTimeout(timer);
      timer = setTimeout(function(){ btn.removeAttribute('data-state'); label.textContent = 'Copier'; }, 2400);
    }
    function selectAndTry(){
      var ok = false;
      try { var r = document.createRange(); r.selectNodeContents(src); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); ok = document.execCommand && document.execCommand('copy'); } catch(_) { ok = false; }
      show(!!ok);
    }
    btn.addEventListener('click', function(){
      var text = src.textContent.trim();
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(function(){ show(true); }, selectAndTry);
      } else selectAndTry();
    });
  });

  // Akordeon: interpolate-size desteklenmiyorsa küçük WAAPI yedeği (tek soru açık)
  var faq = document.querySelector('#sss .kap-faq');
  var mascot = document.querySelector('#sss .kap-mascot');
  if(faq){
    var items = [].slice.call(faq.querySelectorAll('details'));
    var acted = false;
    faq.addEventListener('click', function(){ acted = true; }, true);
    items.forEach(function(d){
      d.addEventListener('toggle', function(){
        if(!d.open || !acted || !mascot || d.classList.contains('kap-closing')) return;
        mascot.classList.remove('is-asking'); void mascot.offsetWidth; mascot.classList.add('is-asking');
      });
    });
    var nativeSmooth = window.CSS && CSS.supports && CSS.supports('interpolate-size', 'allow-keywords');
    if(!nativeSmooth && typeof Element.prototype.animate === 'function'){
      items.forEach(function(d){ d.removeAttribute('name'); });
      var ease = 'cubic-bezier(.2,.8,.2,1)';
      var run = function(d, opening){
        var a = d.querySelector('.kap-a');
        if(d._kapAnim){ d._kapAnim.onfinish = null; d._kapAnim.cancel(); }
        if(opening){ d.classList.remove('kap-closing'); d.open = true; } else d.classList.add('kap-closing');
        var h = a.scrollHeight;
        a.style.overflow = 'hidden';
        var an = d._kapAnim = a.animate(opening ? [{height:'0px'},{height:h+'px'}] : [{height:h+'px'},{height:'0px'}], {duration: opening ? 320 : 220, easing: ease});
        an.onfinish = function(){ a.style.overflow = ''; d._kapAnim = null; if(!opening){ d.open = false; d.classList.remove('kap-closing'); } };
      };
      items.forEach(function(d){
        d.querySelector('summary').addEventListener('click', function(e){
          e.preventDefault();
          var opening = !d.open || d.classList.contains('kap-closing');
          if(rm.matches){
            items.forEach(function(o){ if(o !== d) o.open = false; });
            d.open = opening; return;
          }
          if(opening) items.forEach(function(o){ if(o !== d && o.open && !o.classList.contains('kap-closing')) run(o, false); });
          run(d, opening);
        });
      });
    }
  }

  // Başa dön: sayfanın en üstüne yumuşak (azaltılmış harekette anında) kaydır, odağı başa taşı
  document.querySelectorAll('.footer [data-kap-top]').forEach(function(a){
    a.addEventListener('click', function(e){
      e.preventDefault();
      window.scrollTo({top: 0, behavior: rm.matches ? 'instant' : 'smooth'});
      var f = document.querySelector('#hdr a[href], #hdr button');
      if(f && f !== a) try { f.focus({preventScroll: true}); } catch(_){}
    });
  });
})();

;

/* Shared video, cookie preferences, mobile CTA visibility and entrance animations. */
(function(){
  'use strict';
  var doc = document, root = doc.documentElement;
  root.lang = 'fr';
  root.classList.add('js');
  var HL = window.HL = window.HL || {};
  var mqReduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  HL.reduced = function(){ return !!(mqReduce && mqReduce.matches); };
  function $(id){ return doc.getElementById(id); }

  // iOS Safari'de :active durumunun çalışması için
  doc.addEventListener('touchstart', function(){}, {passive:true});

  /* ---------- Diyalog yardımcıları: kaydırma kilidi + odağı geri verme ---------- */
  var lastPointer = null;
  doc.addEventListener('pointerdown', function(e){
    var t = e.target && e.target.closest ? e.target.closest('a[href], button, input, select, textarea, summary, [tabindex]') : null;
    if(t) lastPointer = t;
  }, true);
  function remember(d, explicit){
    var a = explicit || doc.activeElement;
    if(!a || a === doc.body || a === root || d.contains(a)) a = lastPointer;
    if(a && d.contains(a)) a = null;
    d._ret = a;
  }
  function restore(d){
    var t = d._ret; d._ret = null;
    if(t && t.isConnected && typeof t.focus === 'function'){
      try { t.focus({preventScroll:true}); } catch(_){ t.focus(); }
    }
  }
  function anyOpen(){ return !!doc.querySelector('dialog[open]'); }
  function openModal(d){
    if(typeof d.showModal === 'function'){ if(!d.open) d.showModal(); }
    else d.setAttribute('open', '');
    root.classList.add('hl-lock');
  }
  function closeModal(d){
    if(typeof d.close === 'function'){ if(d.open) d.close(); }
    else if(d.hasAttribute('open')){ d.removeAttribute('open'); d.dispatchEvent(new Event('close')); }
  }
  function afterClose(d){ if(!anyOpen()) root.classList.remove('hl-lock'); restore(d); }

  /* ---------- Video ışık kutusu ---------- */
  var vdlg = $('vdlg'), vp = $('vplayer'), vframe = vdlg && vdlg.querySelector('.v-frame'), vcap = $('vcap');
  HL.openVideo = function(src, title, poster){
    if(!vdlg || !vp) return;
    remember(vdlg);
    var p = poster || (/\.mp4(\?.*)?$/i.test(src) ? src.replace(/\.mp4(\?.*)?$/i, '.jpg') : '');
    if(p) vp.setAttribute('poster', p); else vp.removeAttribute('poster');
    vp.src = src;
    vp.setAttribute('aria-label', title || 'Vidéo');
    vdlg.setAttribute('aria-label', title || 'Vidéo');
    if(vcap){ vcap.textContent = title || ''; vcap.hidden = !title; }
    if(vframe) vframe.classList.add('is-loading');
    openModal(vdlg);
    var pr = vp.play();
    if(pr && pr.catch) pr.catch(function(){ if(vframe) vframe.classList.remove('is-loading'); });
  };
  if(vdlg && vp){
    var stopLoad = function(){ if(vframe) vframe.classList.remove('is-loading'); };
    vp.addEventListener('playing', stopLoad);
    vp.addEventListener('pause', stopLoad);
    vp.addEventListener('error', stopLoad);
    vp.addEventListener('waiting', function(){ if(vdlg.open && vframe) vframe.classList.add('is-loading'); });
    vdlg.addEventListener('click', function(e){ if(e.target === vdlg || e.target.closest('[data-vclose]')) closeModal(vdlg); });
    vdlg.addEventListener('close', function(){
      vp.pause(); vp.removeAttribute('src'); try { vp.load(); } catch(_){}
      stopLoad(); afterClose(vdlg);
    });
  }

  /* ---------- Çerez kartı ---------- */
  var ck = $('cookie'), prefs = $('ck-prefs');
  function ckDismiss(){
    if(HL.reduced()){ ck.hidden = true; return; }
    ck.classList.add('is-leaving');
    setTimeout(function(){ ck.hidden = true; ck.classList.remove('is-leaving'); }, 240);
  }
  if(ck){
    try { if(localStorage.getItem('hl-ck')) ck.hidden = true; } catch(_){}
    ck.addEventListener('click', function(e){
      var b = e.target.closest('[data-ck]'); if(!b) return;
      var act = b.dataset.ck, val = act;
      if(act === 'settings'){
        if(prefs){ prefs.hidden = false; var first = prefs.querySelector('input:not([disabled])'); if(first) first.focus(); }
        b.textContent = 'Enregistrer'; b.dataset.ck = 'save';
        return;
      }
      if(act === 'save'){
        val = JSON.stringify({olcum: !!($('ck-olcum') || {}).checked, reklam: !!($('ck-reklam') || {}).checked});
      }
      try { localStorage.setItem('hl-ck', val); } catch(_){}
      ckDismiss();
    });
  }

  /* ---------- Mobil sabit çubuk: sayfadaki CTA ekrandayken gizlen ---------- */
  var mbar = doc.querySelector('.mbar');
  function setAway(a){
    if(!mbar) return;
    mbar.classList.toggle('is-away', a);
    root.classList.toggle('mbar-away', a);
    if('inert' in mbar) mbar.inert = a; else mbar.setAttribute('aria-hidden', String(a));
  }
  if(mbar && 'IntersectionObserver' in window){
    var zones = doc.querySelectorAll('#lead .hc-go, [data-mbar-hide]');
    if(!zones.length) zones = doc.querySelectorAll('#lead');
    if(zones.length){
      var seen = [];
      var RATIO = 0.6;
      var vis = function(el){
        var r = el.getBoundingClientRect(), h = window.innerHeight || root.clientHeight;
        var shown = Math.min(r.bottom, h) - Math.max(r.top, 0);
        return r.height > 0 && shown / Math.min(r.height, h) >= RATIO;
      };
      // İlk boyamada titreme olmasın diye eşzamanlı ilk kontrol
      zones.forEach(function(z){ if(vis(z)) seen.push(z); });
      setAway(seen.length > 0);
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          var i = seen.indexOf(en.target);
          var on = en.isIntersecting && vis(en.target);
          if(on && i < 0) seen.push(en.target);
          if(!on && i > -1) seen.splice(i, 1);
        });
        setAway(seen.length > 0);
      }, {threshold:[0, 0.3, RATIO, 0.9, 1]});
      zones.forEach(function(z){ io.observe(z); });
    }
  }

  /* ---------- .pop-in: ekrana ilk girişte pop ---------- */
  var pops = doc.querySelectorAll('.pop-in');
  if(pops.length){
    if(!('IntersectionObserver' in window)){ pops.forEach(function(p){ p.classList.add('is-in'); }); }
    else {
      var h0 = window.innerHeight || root.clientHeight;
      var pio = new IntersectionObserver(function(entries){
        entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('is-in'); pio.unobserve(en.target); } });
      }, {rootMargin:'0px 0px -6% 0px'});
      pops.forEach(function(p){
        var r = p.getBoundingClientRect();
        if(r.top < h0 && r.bottom > 0) p.classList.add('is-in');
        else pio.observe(p);
      });
    }
  }
})();

