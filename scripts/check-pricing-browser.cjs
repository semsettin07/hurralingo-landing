const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const {chromium}=require(process.env.HURRA_PLAYWRIGHT_PATH||path.resolve('../hurralingo/node_modules/playwright-core'));
const data=require('../assets/pricing-data.js'),api=require('../assets/pricing-engine.js');
const origin=process.env.HURRA_PREVIEW_URL||'http://127.0.0.1:8017';
const money=n=>new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:0}).format(n);
(async()=>{
 const browser=await chromium.launch({headless:true});
 const results={viewports:[],selections:0,pageErrors:[],failedLocalRequests:[],checks:[]};
 try {
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  page.on('pageerror',e=>results.pageErrors.push(e.message));
  page.on('response',r=>{if(r.url().startsWith(origin)&&r.status()>=400)results.failedLocalRequests.push(r.url());});
  const response=await page.goto(origin+'/ucretler/');assert.equal(response.status(),200);
  await page.locator('#calculator-body:not([hidden])').waitFor();
  const verified=JSON.parse(fs.readFileSync('docs/pricing-2027/calculation-verification.json','utf8')).verified;
  for(const row of verified){
   for(const field of ['model','teacher','membership','frequency'])await page.locator('#fee-'+field).selectOption(String(row[field]));
   if(row.membership!=='monthly')await page.locator('#fee-payment').selectOption(row.payment);
   const r=api.calculate(data,row);
   assert.equal(await page.locator('#selected-price').textContent(),money(r.selectedLesson));
   assert.equal(await page.locator('#selected-total').textContent(),money(r.selectedTotal));
   assert.equal(await page.locator('#comparison-cards article').count(),3);
   assert.equal(await page.locator('.fee-bar').count(),row.membership==='monthly'?0:2);
   assert.equal(await page.locator('#fee-payment').isDisabled(),row.membership==='monthly');
   if(row.membership==='monthly')assert.equal(await page.locator('#fee-payment option').count(),1);
   else {const details=await page.locator('#price-details').textContent();assert.ok(details.includes('Aylık taksit sayısı'+r.installmentCount));assert.ok(details.includes('Her ay çekilecek taksit'+money(r.installmentAmount)));}
   results.selections++;
  }
  for(const width of [320,390,768,1024,1440]){
   await page.setViewportSize({width,height:1000});
   const dimensions=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
   assert.ok(dimensions.scroll<=dimensions.client,`Overflow ${width}: ${JSON.stringify(dimensions)}`);
   const controls=await page.locator('#pricing-options select').evaluateAll(nodes=>nodes.map(n=>({width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height})));
   assert.ok(controls.every(c=>c.height>=44&&c.width>150));
   const screenshot=`docs/pricing-2027/preview-${width}.png`;
   await page.evaluate(()=>{document.activeElement.blur();scrollTo(0,0);});
   await page.screenshot({path:screenshot,fullPage:true});results.viewports.push({width,overflow:false,screenshot});
  }
  await page.locator('[data-model="mini"] button').click();assert.equal(await page.locator('#fee-model').inputValue(),'mini');
  assert.equal(await page.locator('[data-model="mini"] button').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('#fee-model').evaluate(n=>n===document.activeElement),true);
  await page.locator('#fee-membership').selectOption('six');await page.locator('#fee-payment').selectOption('installment');
  await page.locator('#fee-membership').selectOption('monthly');assert.equal(await page.locator('#fee-payment').inputValue(),'monthly');
  await page.locator('#fee-membership').selectOption('annual');assert.equal(await page.locator('#fee-payment').inputValue(),'cash');
  await page.locator('#fee-model').focus();await page.keyboard.press('Tab');assert.equal(await page.locator('#fee-teacher').evaluate(n=>n===document.activeElement),true);
  results.checks.push('Model buttons update selection and transfer focus','Monthly/annual transitions stay valid','Keyboard Tab follows form labels');
  await page.setViewportSize({width:390,height:844});
  await page.locator('#menuToggle').count().then(async count=>{
   // Header keeps its existing drawer behavior and controls.
   const toggle=page.locator('[aria-controls="drawer"]');assert.equal(await toggle.count(),1);
   await toggle.click();await page.locator('#drawer').waitFor({state:'visible'});
   assert.equal(await page.locator('#drawer .dr-list a[href="/ucretler/"]').count(),1);
   await page.keyboard.press('Escape');await page.locator('#drawer').waitFor({state:'hidden'});
  });
  results.checks.push('Mobile menu opens, contains fees link, closes with Escape');
  const trial=page.locator('.fee-cta a');assert.equal(await trial.getAttribute('href'),'https://www.hurralingo.app/trial-request');assert.equal(await trial.getAttribute('target'),'_blank');
  await page.goto(origin+'/');
  await page.locator('main a[href="/ucretler/"]').first().click();await page.waitForURL(origin+'/ucretler/');await page.locator('#selected-total').waitFor();
  results.checks.push('Homepage CTA navigates to direct /ucretler/ route','Trial CTA opens official URL in new tab');
  const nojs=await browser.newContext({javaScriptEnabled:false});const plain=await nojs.newPage();await plain.goto(origin+'/ucretler/');assert.ok(await plain.locator('noscript').isVisible());await nojs.close();results.checks.push('No-JavaScript fallback visible');
  assert.deepEqual(results.pageErrors,[]);assert.deepEqual(results.failedLocalRequests,[]);
  fs.writeFileSync('docs/pricing-2027/browser-verification.json',JSON.stringify(results,null,2)+'\n');
  console.log('PASS: '+results.selections+' browser selections; five responsive viewports; keyboard, mobile drawer, homepage CTA, direct route and no-JS fallback.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
