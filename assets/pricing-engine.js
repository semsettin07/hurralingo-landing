(function(root) {
  'use strict';
  // Adapted from the local Hurra Türkiye calculator; no currency factors or prices reused.
  function round(value, digits = 0) {
    const scale = 10 ** digits, scaled = Math.abs(value) * scale;
    return Math.sign(value) * Math.floor(scaled + 0.5 + Number.EPSILON * Math.max(1, scaled) * 4) / scale;
  }
  function calculate(data, selection) {
    const {model, teacher, membership, frequency, payment} = selection;
    const config = data.models[model]?.teachers[teacher], plan = config?.plans[membership];
    if (!plan || !Object.hasOwn(plan.lessons, frequency) || !plan.payments.includes(payment)) throw new Error('Invalid pricing selection');
    const base = model === 'private' ? config.base : round(data.models.private.teachers[teacher].base * (1 - data.models[model].baseDiscount));
    const lesson = round(base * (1 - plan.discount));
    const cashLesson = plan.cashDiscount === null ? null : round(lesson * (1 - plan.cashDiscount));
    const monthlyLessons = config.monthlyLessons[frequency], totalLessons = plan.lessons[frequency];
    const monthlyPayment = lesson * monthlyLessons, installmentTotal = membership === 'monthly' ? null : lesson * totalLessons;
    const cashTotal = cashLesson === null ? null : cashLesson * totalLessons;
    const selectedLesson = payment === 'cash' ? cashLesson : lesson;
    const selectedTotal = selectedLesson * totalLessons;
    const advantage = cashTotal === null ? null : installmentTotal - cashTotal;
    // User-confirmed: installments are charged monthly, with four teaching weeks per month.
    const installmentCount = membership === 'monthly' ? null : totalLessons / monthlyLessons;
    const installmentAmount = installmentCount === null ? null : installmentTotal / installmentCount;
    return {base, lesson, cashLesson, monthlyLessons, totalLessons, monthlyPayment, installmentTotal, cashTotal, selectedLesson, selectedTotal,
      months: plan.months, discount: plan.discount, cashDiscount: plan.cashDiscount, advantage, installmentCount, installmentAmount,
      savingPercent: advantage === null ? null : advantage / installmentTotal * 100,
      packageSaving: base * totalLessons - selectedTotal};
  }
  const api = {round, calculate};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HurraPricingEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
