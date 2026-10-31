// Start prices written into the HTML so crawlers see real amounts; pricing-ui.js refreshes them in the browser.
const data=require('../assets/pricing-data.js'),engine=require('../assets/pricing-engine.js');
const startPrice=(model,locale)=>new Intl.NumberFormat(locale,{style:'currency',currency:data.currency,maximumFractionDigits:0}).format(engine.calculate(data,{model,teacher:'turkish',membership:'annual',frequency:1,payment:'cash'}).selectedLesson);
module.exports={startPrice};
