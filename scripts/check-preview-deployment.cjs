// Read-only checks against an explicitly supplied Cloudflare preview origin.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const cheerio=require('cheerio');
const origin=process.argv[2];
assert.ok(/^https:\/\/[a-z0-9-]+\.hurralingo-landing\.pages\.dev$/.test(origin),'Expected isolated project preview URL');
const canonical=JSON.parse(fs.readFileSync('content/site/canonical-tr.json','utf8'));
const rules=JSON.parse(fs.readFileSync('content/site/redirects-tr.json','utf8')).rules;
const baseline=JSON.parse(fs.readFileSync('docs/phase-1b/baseline.json','utf8'));
async function pool(items,fn){let n=0;await Promise.all(Array.from({length:6},async()=>{while(n<items.length)await fn(items[n++])}));}
(async()=>{
 const result={origin,canonical:[],redirects:[],foreign:[],pass:false};
 await pool(canonical,async route=>{const r=await fetch(origin+route);assert.equal(r.status,200,route);assert.ok((r.headers.get('x-robots-tag')||'').includes('noindex'),'Header noindex '+route);const $=cheerio.load(await r.text());assert.equal($('meta[name=robots]').attr('content'),'noindex, nofollow');assert.equal($('link[rel=canonical]').attr('href'),'https://www.hurralingo.com'+route);result.canonical.push(route);});
 await pool(Object.entries(rules),async ([from,to])=>{const r=await fetch(origin+from,{redirect:'manual'});assert.equal(r.status,301,from);const actual=new URL(r.headers.get('location'),origin);assert.equal(actual.origin,origin,'Preview escapes to another origin');assert.equal(decodeURI(actual.pathname+actual.hash),decodeURI(to),from);result.redirects.push({from,to});});
 for(const file of ['en.html','de.html','az.html','en/blog/index.html','de/blog/index.html','az/blog/index.html']){const r=await fetch(origin+'/'+file);assert.equal(r.status,200,file);const bytes=Buffer.from(await r.arrayBuffer());assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),baseline.protectedFiles[file],'Foreign bytes changed '+file);result.foreign.push(file);}
 for(const route of ['/en/','/de/','/az/'])assert.equal((await fetch(origin+route)).status,200,route);
 assert.equal((await fetch(origin+'/unknown-phase1b-page/')).status,404);
 assert.ok((await(await fetch(origin+'/robots.txt')).text()).includes('Disallow: /'));
 const sm=cheerio.load(await(await fetch(origin+'/sitemap.xml')).text(),{xmlMode:true});assert.equal(sm('loc').length,43);
 const query=await fetch(origin+'/tr/derslerimiz/?utm_source=phase1b',{redirect:'manual'});assert.equal(query.status,301);assert.equal(new URL(query.headers.get('location'),origin).search,'?utm_source=phase1b');
 result.pass=true;fs.writeFileSync('docs/phase-1b/deployment-verification.json',JSON.stringify(result,null,2)+'\n');console.log('PASS: preview 43 canonical pages, '+result.redirects.length+' redirects, unchanged foreign files, aliases, query, robots and true 404.');
})().catch(e=>{console.error(e);process.exitCode=1});
