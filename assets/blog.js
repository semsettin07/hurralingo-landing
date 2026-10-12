(() => {
  'use strict';
  const form = document.querySelector('[data-blog-search]');
  if (!form) return;
  const input = form.querySelector('input');
  const select = form.querySelector('select');
  const cards = [...document.querySelectorAll('[data-post-card]')];
  const status = document.getElementById('blog-result');
  const empty = document.getElementById('blog-empty');
  const locale = document.documentElement.lang;
  const normalize = s => s.toLocaleLowerCase(locale).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
  function filter() {
    const query = normalize(input.value.trim());
    let count = 0;
    for (const card of cards) {
      const matches = (!query || normalize(card.dataset.search).includes(query)) && (!select.value || JSON.parse(card.dataset.category).includes(select.value));
      card.hidden = !matches;
      if (matches) count++;
    }
    status.textContent = count + ' ' + status.dataset.countLabel;
    empty.hidden = count > 0;
  }
  form.addEventListener('submit', e => { e.preventDefault(); filter(); });
  input.addEventListener('input', filter);
  select.addEventListener('change', filter);
  form.addEventListener('reset', () => setTimeout(filter, 0));
  filter();
  cards.forEach(card => {
    let timer;
    const smile = () => {
      clearTimeout(timer);
      card.classList.add('is-smiling');
      timer = setTimeout(() => card.classList.remove('is-smiling'), 1400);
    };
    card.addEventListener('pointerdown', smile);
    card.addEventListener('click', smile);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') smile();
    });
  });
})();
