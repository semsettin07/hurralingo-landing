(function() {
  'use strict';
  const data=window.HurraPricingData, engine=window.HurraPricingEngine, t=window.HurraPricingText;
  const form=document.getElementById('pricing-options');
  if(!form || !data || !engine || !t) return;
  const money=n=>new Intl.NumberFormat(t.locale,{style:'currency',currency:t.currency,maximumFractionDigits:0}).format(n);
  const percent=n=>new Intl.NumberFormat(t.locale,{style:'percent',maximumFractionDigits:2}).format(n/100);
  const field=name=>form.elements.namedItem(name);
  const el=id=>document.getElementById(id);
  const state=()=>Object.fromEntries(['model','teacher','membership','frequency','payment'].map(k=>[k,k==='frequency'?Number(field(k).value):field(k).value]));
  function options(name, entries, fallback) {
    const previous=field(name).value;
    field(name).replaceChildren(...entries.map(([value,label])=>new Option(label,String(value))));
    const preferred=entries.some(([key])=>String(key)===String(fallback))?fallback:entries[0][0];
    field(name).value=entries.some(([key])=>String(key)===previous)?previous:String(preferred);
  }
  function details(entries) {
    const dl=document.createElement('dl');
    entries.forEach(([label,value])=>{const div=document.createElement('div'), dt=document.createElement('dt'), dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;div.append(dt,dd);dl.append(div);});
    return dl;
  }
  options('model',Object.entries(t.models),'private');
  function render() {
    options('teacher',Object.keys(data.models[field('model').value].teachers).map(k=>[k,t.teachers[k]]),'turkish');
    const config=data.models[field('model').value].teachers[field('teacher').value];
    options('membership',Object.keys(config.plans).map(k=>[k,t.memberships[k]]),'six');
    const plan=config.plans[field('membership').value];
    options('frequency',Object.keys(plan.lessons).map(k=>[k,`${k} ${t.lessons}`]),1);
    options('payment',plan.payments.map(k=>[k,t.payments[k]]),'cash');
    const s=state(), r=engine.calculate(data,s), monthly=s.membership==='monthly';
    field('payment').disabled=plan.payments.length===1;
    el('payment-help').textContent=monthly?t.monthlyHelp:t.packageHelp;
    el('result-heading').textContent=t.models[s.model];
    el('result-description').textContent=`${t.teachers[s.teacher]} · ${t.memberships[s.membership]} · ${t.payments[s.payment]}`;
    el('selected-price').textContent=money(r.selectedLesson);
    el('selected-total').textContent=money(r.selectedTotal);
    const rows=[[t.labels.months,`${r.months} ${t.month}`],[t.labels.weekly,s.frequency],[t.labels.monthly,r.monthlyLessons],[t.labels.lessons,r.totalLessons]];
    if(monthly || s.payment==='installment')rows.push([t.labels.monthlyPayment,money(r.monthlyPayment)]);
    if(!monthly)rows.push([t.labels.cash,money(r.cashTotal)],[t.labels.installment,money(r.installmentTotal)],[t.labels.installmentCount,r.installmentCount],[t.labels.installmentAmount,money(r.installmentAmount)],[t.labels.discount,percent(r.discount*100)],[t.labels.cashDiscount,percent(r.cashDiscount*100)],[t.labels.saving,money(r.packageSaving)]);
    el('price-details').replaceChildren(...details(rows).children);
    document.querySelectorAll('[data-model]').forEach(card=>{
      const selected=card.dataset.model===s.model;
      card.classList.toggle('is-selected',selected);
      card.querySelector('button').setAttribute('aria-pressed',String(selected));
      card.querySelector('button').textContent=selected?t.selected:t.choose;
      const start=engine.calculate(data,{model:card.dataset.model,teacher:'turkish',membership:'annual',frequency:1,payment:'cash'});
      card.querySelector('[data-start-price]').textContent=money(start.selectedLesson);
    });
    const comparison=el('payment-comparison');
    comparison.replaceChildren();
    if(monthly) {const p=document.createElement('p');p.className='fee-notice';p.textContent=t.monthlyCompare;comparison.append(p);}
    else {
      const bars=document.createElement('div');bars.className='fee-bars';
      [[t.payments.cash,r.cashTotal,r.cashLesson],[t.payments.installment,r.installmentTotal,r.lesson]].forEach(([label,total,lesson])=>{
        const row=document.createElement('div');row.className='fee-bar';
        const name=document.createElement('span');name.textContent=label;
        const track=document.createElement('span');track.className='fee-track';track.setAttribute('aria-hidden','true');
        const fill=document.createElement('i');fill.style.width=(total/r.installmentTotal*100)+'%';track.append(fill);
        const amount=document.createElement('strong');amount.textContent=money(total);
        const per=document.createElement('small');per.textContent=`${money(lesson)} ${t.perLesson} · ${t.tax}`;
        row.append(name,track,amount,per);bars.append(row);
      });
      const saving=document.createElement('p');saving.className='fee-saving';saving.textContent=`${t.savings}: ${money(r.advantage)} (${percent(r.savingPercent)}). ${t.compared}.`;
      comparison.append(bars,saving);
    }
    el('comparison-description').textContent=`${t.teachers[s.teacher]} · ${t.memberships[s.membership]} · ${s.frequency} ${t.lessons} / ${t.week} · ${t.payments[s.payment]} · ${t.tax}`;
    const counts=[];
    el('comparison-cards').replaceChildren(...Object.keys(data.models).map(model=>{
      const article=document.createElement('article'), h3=document.createElement('h3');article.className='fee-compare-card';h3.textContent=t.models[model];article.append(h3);
      try {
        const other=engine.calculate(data,{...s,model});counts.push(other.totalLessons);
        article.append(details([[t.labels.lessons,`${other.totalLessons} ${t.lessons}`],[t.labels.lesson,money(other.selectedLesson)],[t.labels.total,money(other.selectedTotal)]]));
      } catch {const p=document.createElement('p');p.textContent=t.unavailable;article.append(p);}
      return article;
    }));
    el('comparison-help').textContent=new Set(counts).size>1?t.differentLessons:t.sameLessons;
    el('price-status').textContent=`${t.models[s.model]}, ${t.teachers[s.teacher]}, ${t.memberships[s.membership]}, ${s.frequency} ${t.lessons} / ${t.week}, ${r.totalLessons} ${t.lessons}. ${t.payments[s.payment]}: ${money(r.selectedTotal)}; ${money(r.selectedLesson)} ${t.perLesson}. ${t.tax}.`;
  }
  form.addEventListener('change',render);
  form.addEventListener('submit',e=>e.preventDefault());
  document.querySelectorAll('[data-model]').forEach(card=>card.querySelector('button').addEventListener('click',()=>{
    field('model').value=card.dataset.model;render();
    el('hesapla').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
    field('model').focus({preventScroll:true});
  }));
  render();el('calculator-body').hidden=false;
})();
