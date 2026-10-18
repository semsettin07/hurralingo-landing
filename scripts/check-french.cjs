// Verify the fifth language against the captured, unmodified four-language corpus.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict'),c=require('cheerio');
const root=path.resolve(__dirname,'..');process.chdir(root);
const read=f=>fs.readFileSync(f,'utf8'),json=f=>JSON.parse(read(f));
const hash=v=>crypto.createHash('sha256').update(v).digest('hex');
const baseline=json('docs/french/baseline.json'),manifest=json('content/i18n/routes.json'),catalog=json('content/i18n/french-routes.json'),routes=json('content/i18n/canonical-all.json');
const docs=new Map(routes.map(route=>[route,c.load(read(route.slice(1)+'index.html'))]));
const result={pass:false,existingPages:baseline.canonical.length,frenchPages:0,articleBlocks:0,reciprocalAlternates:0,internalLinks:0,assetsPreserved:0};
try{
 assert.equal(routes.length,235);assert.equal(new Set(routes).size,routes.length);
 assert.deepEqual(routes.filter(r=>!r.startsWith('/fr/')),baseline.canonical);
 assert.equal(hash(fs.readFileSync('content/blog/posts.json')),baseline.sourcePostHash);
 for(const route of baseline.canonical){const $=docs.get(route),before=baseline.pages[route];
  assert.equal(hash($('main').html()),before.mainHash,'Existing content changed: '+route);
  assert.equal($('link[rel=canonical]').attr('href'),before.canonical);
  assert.equal($('meta[name=robots]').attr('content'),before.robots);
  assert.ok(manifest.translations[route].fr,'No French counterpart: '+route);
 }
 for(const [file,digest]of Object.entries(baseline.assets)){
  if(file==='assets/auto-language.js')continue;
  const bytes=fs.readFileSync(file),lf=bytes.toString('utf8').replace(/\r\n/g,'\n');assert.ok(hash(bytes)===digest||hash(lf)===digest||hash(lf.replace(/\n/g,'\r\n'))===digest,'Protected asset changed: '+file);result.assetsPreserved++;
 }
 for(const route of routes){const $=docs.get(route),isFrench=route.startsWith('/fr/');
  assert.equal($('#hd-lang a[lang]').length,5,'Desktop language count '+route);assert.equal($('#drawer a[lang]').length,5,'Mobile language count '+route);
  const siblings=manifest.translations[route]||{fr:route};
  for(const [lang,target]of Object.entries(siblings)){
   assert.ok(docs.has(target),'Missing counterpart '+target);
   assert.equal($(`link[rel=alternate][hreflang=${lang}]`).attr('href'),'https://www.hurralingo.com'+target);
   const peer=docs.get(target);const language=isFrench?'fr':(route.match(/^\/(en|de|az)\//)?.[1]||'tr');
   assert.equal(peer(`link[rel=alternate][hreflang=${language}]`).attr('href'),'https://www.hurralingo.com'+route,'Nonreciprocal '+route+' '+target);result.reciprocalAlternates++;
  }
  if(!isFrench)continue;result.frenchPages++;
  assert.equal($('html').attr('lang'),'fr');assert.equal($('h1').length,1);
  assert.equal($('link[rel=canonical]').attr('href'),'https://www.hurralingo.com'+route);
  assert.ok($('title').text().includes('Hurra Lingo'));assert.ok($('meta[name=description]').attr('content')?.length>40);
  assert.equal($('meta[property="og:locale"]').attr('content'),'fr_FR');
  for(const field of ['og:title','og:description','og:url'])assert.ok($(`meta[property="${field}"]`).attr('content'));
  for(const field of ['twitter:title','twitter:description'])assert.ok($(`meta[name="${field}"]`).attr('content'));
  $('script[type="application/ld+json"]').each((i,n)=>{for(const item of [JSON.parse($(n).text())].flat())assert.equal(item.inLanguage,'fr')});
  assert.ok(!/\[FT\d+\]|data-fr-ready|\ufffd|&(?:amp;)?(?:nbsp|quot);/u.test($('main').text()),'Translation marker/entity '+route);
  $('[href],[src]').each((i,n)=>{const href=$(n).attr('href')||$(n).attr('src');if(!href||!href.startsWith('/')||href.startsWith('//'))return;const u=new URL(href,'https://www.hurralingo.com'),file='.'+decodeURI(u.pathname);assert.ok(fs.existsSync(file),'Missing target '+route+' '+href);if(u.hash&&u.pathname.endsWith('/')){const target=docs.get(u.pathname);if(target)assert.ok(target('[id]').toArray().some(n=>target(n).attr('id')===decodeURIComponent(u.hash.slice(1))),'Missing anchor '+route+' '+href)}result.internalLinks++});
 }
 const full=require('./french-blocks.cjs'),dictionary=json('content/i18n/fr-blocks.json');
 const {preserve,examples,foreignExamples}=require('./french-segments.cjs');
 const allowed=new Set([...preserve,...examples,...foreignExamples,'Johann Wolfgang von Goethe']);result.preservedSourceText=[];
 for(const group of catalog.groups){const source=docs.get(group.sourceRoute),target=docs.get(group.route),original=new Set();
  source('main *').contents().each((i,n)=>{if(n.type==='text'&&n.data.trim().length>=25)original.add(n.data.trim())});
  target('main *').contents().each((i,n)=>{if(n.type==='text'&&original.has(n.data.trim())){assert.ok(allowed.has(n.data.trim()),'Untranslated source text '+group.route+' '+n.data.trim());result.preservedSourceText.push({route:group.route,text:n.data.trim()})}});
  assert.ok(!/\b(?:ihrem|Gelegenheit|Kinder|Vatertagsgrüße)\b/.test(target('.blog-prose').text()),'German prose remains '+group.route);
 }
 for(const group of catalog.groups.filter(g=>g.kind==='article')){
  const source=docs.get(group.sourceRoute),target=docs.get(group.route);
  assert.equal(target('.blog-prose p').length,source('.blog-prose p').length,'Lost paragraphs '+group.route);
  for(const selector of ['li','table','img','a','h2','h3','h4'])assert.equal(target('.blog-prose '+selector).length,source('.blog-prose '+selector).length,'Lost '+selector+' '+group.route);
  for(const node of full.blocks(source)){const block=full.encode(source,node),translated=dictionary[block.key];assert.ok(translated&&translated.source===block.text);full.decode(translated.fr,block.markup);result.articleBlocks++;}
 }
 for(const legal of catalog.legal){const $=docs.get(legal.route);assert.equal($('.legal-page').length,6);assert.equal($('[data-original-legal]').length,1);assert.equal($('[data-original-legal]').attr('hreflang'),'en');}
 assert.equal(result.frenchPages,53);
 assert.deepEqual(c.load(read('sitemap.xml'),{xmlMode:true})('loc').map((i,n)=>c.load(n).text()).get(),routes.map(r=>'https://www.hurralingo.com'+r));
 result.pass=true;console.log('PASS: French coverage, complete article structures, protected corpus/assets, internal links, five-language menus and reciprocal SEO.',result);
}catch(error){result.failure=error.stack;throw error}finally{fs.writeFileSync('docs/french/static-verification.json',JSON.stringify(result,null,2)+'\n')}
