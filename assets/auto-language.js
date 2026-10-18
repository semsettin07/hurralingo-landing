/* Only an explicit menu choice is persisted. Static HTML remains usable without JS. */
(function () {
  'use strict';
  var key = 'hl-language-choice', chosen = false;
  var homes = {tr: '/', en: '/en/', de: '/de/', az: '/az/'};
  function supported(value) {
    return typeof value === 'string' && Object.prototype.hasOwnProperty.call(homes, value);
  }
  function record(value) {
    if (supported(value)) return {lang: value, time: 0};
    if (typeof value !== 'string') return null;
    var parts = value.split('.'), time = Number(parts[1]);
    return parts.length === 2 && supported(parts[0]) && Number.isSafeInteger(time) && time >= 0 ? {lang: parts[0], time: time} : null;
  }
  function latestChoice() {
    var latest = null;
    try { latest = record(localStorage.getItem(key)); } catch (_) {}
    try {
      var match = document.cookie.match(/(?:^|;\s*)hl-language-choice=([^;]*)(?:;|$)/);
      var cookie = match && record(match[1]);
      if (cookie && (!latest || cookie.time > latest.time)) latest = cookie;
    } catch (_) {}
    return latest;
  }
  function preference() {
    var latest = latestChoice();
    return latest && latest.lang;
  }
  function remember(lang) {
    var previous = latestChoice();
    var value = lang + '.' + Math.max(Date.now(), previous ? previous.time + 1 : 0);
    var saved = false;
    try { localStorage.setItem(key, value); saved = localStorage.getItem(key) === value; } catch (_) {}
    try {
      document.cookie = key + '=' + value + '; Path=/; Max-Age=31536000; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
      saved = saved || preference() === lang;
    } catch (_) {}
    return saved;
  }
  // Capture also covers keyboard activation and middle-click; retain the real route mapping.
  function menuChoice(event) {
    if (event.type === 'auxclick' && event.button !== 1) return;
    var link = event.target.closest && event.target.closest('#hd-lang a[lang], #drawer a[lang]');
    if (!link || event.defaultPrevented) return;
    var lang = link.getAttribute('lang');
    if (!supported(lang)) return;
    var url;
    try { url = new URL(link.href, location.href); } catch (_) { return; }
    if (url.origin !== location.origin) return;
    chosen = true;
    var saved = remember(lang);
    new URLSearchParams(location.search).forEach(function (value, name) {
      if (name !== 'hl_lang' && !url.searchParams.has(name)) url.searchParams.append(name, value);
    });
    // If both cookies and localStorage are blocked, an explicit TR click must still win.
    if (!saved && url.pathname === '/') url.searchParams.set('hl_lang', lang);
    link.href = url.pathname + url.search + url.hash;
  }
  document.addEventListener('click', menuChoice, true);
  document.addEventListener('auxclick', menuChoice, true);
  if (location.pathname !== '/') return;
  var explicit = new URLSearchParams(location.search).get('hl_lang');
  function redirect(lang) {
    if (chosen || !supported(lang) || lang === 'tr' || location.pathname !== '/') return;
    try { location.replace(homes[lang] + location.search + location.hash); } catch (_) {}
  }
  if (supported(explicit)) { redirect(explicit); return; }
  var saved = preference();
  if (saved) { redirect(saved); return; }
  function browserLanguage() {
    var languages = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
    for (var i = 0; i < languages.length; i++) {
      if (typeof languages[i] !== 'string') continue;
      var tag = languages[i].trim().replace(/_/g, '-');
      try {
        if (typeof Intl.getCanonicalLocales === 'function') tag = Intl.getCanonicalLocales(tag)[0];
        else if (!/^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/i.test(tag)) continue;
      } catch (_) { continue; }
      var lang = tag && tag.split('-')[0].toLowerCase();
      if (supported(lang)) return lang;
    }
    return 'tr';
  }
  // Country wins over browser language. Never block rendering or persist detection.
  if (!window.fetch || !window.AbortController) { redirect(browserLanguage()); return; }
  var countries = {TR: 'tr', DE: 'de', AT: 'de', AZ: 'az', GB: 'en', FR: 'en', US: 'en', CA: 'en', AU: 'en'};
  var controller = new AbortController();
  var settled = false;
  function finish(country) {
    if (settled) return;
    settled = true;
    clearTimeout(timeout);
    // A choice made while the request was in flight takes precedence.
    redirect(preference() || (Object.prototype.hasOwnProperty.call(countries, country) ? countries[country] : browserLanguage()));
  }
  var timeout = setTimeout(function () { finish(null); controller.abort(); }, 900);
  fetch('/api/country', {signal: controller.signal, cache: 'no-store', credentials: 'omit'})
    .then(function (response) { if (!response.ok) throw new Error('Country unavailable'); return response.json(); })
    .then(function (data) {
      finish(data && data.country);
    })
    .catch(function () { finish(null); });
})();
