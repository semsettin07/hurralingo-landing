/* GA4 starts only after measurement consent. Trial, WhatsApp and phone clicks are counted separately.
   Added to pages by scripts/optimize-package.cjs when a measurement id is configured. */
(function () {
  'use strict';
  var id = document.currentScript.dataset.measurementId, started = false;
  var card = document.getElementById('cookie'), prefs = document.getElementById('ck-prefs');
  var events = [[/trial-request/, 'trial_click'], [/wa\.me/, 'whatsapp_click'], [/^tel:/, 'phone_click']];
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  function choice() {
    try {
      var value = localStorage.getItem('hl-ck');
      return value && value.charAt(0) === '{' ? JSON.parse(value) : {olcum: value === 'accept', reklam: value === 'accept'};
    } catch (_) { return {olcum: false, reklam: false}; }
  }
  function start() {
    window['ga-disable-' + id] = false;
    if (started) return;
    started = true;
    gtag('js', new Date());
    gtag('config', id);
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(script);
  }
  function stop() {
    window['ga-disable-' + id] = true;
    document.cookie.split(';').forEach(function (entry) {
      var name = entry.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0) ['', '; domain=.hurralingo.com'].forEach(function (scope) {
        document.cookie = name + '=; Max-Age=0; path=/' + scope;
      });
    });
  }
  function reopen() {
    var stored = choice(), settings = card.querySelector('[data-ck="settings"]');
    card.hidden = false;
    if (settings) settings.click();
    if (prefs) prefs.hidden = false;
    document.getElementById('ck-olcum').checked = !!stored.olcum;
    document.getElementById('ck-reklam').checked = !!stored.reklam;
  }
  if (choice().olcum) start();
  document.addEventListener('click', function (event) {
    if (event.target.closest('[data-ck-open]')) return reopen();
    // site-tr.js has already saved the choice by the time the click reaches the document.
    if (event.target.closest('[data-ck]')) return choice().olcum ? start() : started && stop();
    var link = event.target.closest('a[href]');
    if (!link || !started) return;
    var href = link.getAttribute('href');
    events.forEach(function (rule) {
      if (rule[0].test(href)) gtag('event', rule[1], {link_url: href, transport_type: 'beacon'});
    });
  });
})();
