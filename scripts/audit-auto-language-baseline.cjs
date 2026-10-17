// Read-only Cloudflare/live audit. Never prints or persists credentials.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const {chromium}=require(process.env.HURRA_PLAYWRIGHT_PATH||path.resolve(__dirname,'../../hurralingo/node_modules/playwright-core'));
const c=require('cheerio'),out='docs/auto-language';fs.mkdirSync(out,{recursive:true});
if(fs.existsSync(out+'/baseline.json'))throw new Error('Baseline already exists. Use compare-language-baseline.cjs to verify the preserved snapshot without replacing it.');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const routes=require('../content/i18n/canonical-all.json');
const seo=html=>{const $=c.load(html);return {canonical:$('link[rel=canonical]').attr('href'),alternates:$('link[rel=alternate][hreflang]').map((i,e)=>[$(e).attr('hreflang')+' '+$(e).attr('href')]).get(),robots:$('meta[name=robots]').attr('content'),mainHash:hash($('main').html())}};
(async()=>{
 const config=fs.readFileSync(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8');
 const token=config.match(/oauth_token\s*=\s*"([^"]+)"/)[1];
 const api=async suffix=>{const r=await fetch('https://api.cloudflare.com/client/v4/accounts/b21fdd3b8f630cbc1856d29e70af7ea1/pages/projects/hurralingo-landing'+suffix,{headers:{Authorization:'Bearer '+token}});const j=await r.json();assert.ok(j.success,JSON.stringify(j.errors));return j.result};
 const project=await api(''),deployments=await api('/deployments');
 const state={timestamp:new Date().toISOString(),gitHead:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),branch:execFileSync('git',['branch','--show-current'],{encoding:'utf8'}).trim(),build:project.build_config,productionBranch:project.production_branch,production:project.canonical_deployment,deployments:deployments.map(d=>({id:d.id,environment:d.environment,url:d.url,status:d.latest_stage.status}))};
 fs.writeFileSync(out+'/cloudflare-before.json',JSON.stringify(state,null,2)+'\n');
 fs.mkdirSync('dist/auto-language-baseline',{recursive:true});
 if(!fs.existsSync('dist/auto-language-baseline/production'))fs.cpSync('dist/phase-1c-production','dist/auto-language-baseline/production',{recursive:true});
 if(!fs.existsSync('dist/auto-language-baseline/source.bundle'))execFileSync('git',['bundle','create','dist/auto-language-baseline/source.bundle','--all']);
 const baseline={source:{},assets:{},sitemapHash:hash(fs.readFileSync('sitemap.xml')),productionId:state.production.id,live:[],differences:[]};
 for(const route of routes)baseline.source[route]=seo(fs.readFileSync(path.join('.',route,'index.html'),'utf8'));
 const files=fs.readdirSync('dist/auto-language-baseline/production/assets',{recursive:true}).map(f=>'assets/'+f.replaceAll('\\','/')).filter(f=>fs.statSync('dist/auto-language-baseline/production/'+f).isFile());
 for(const file of files)baseline.assets[file]=hash(fs.readFileSync(file));
 const browser=await chromium.launch();try{
 const page=await browser.newPage();await page.goto('https://www.hurralingo.com/',{waitUntil:'domcontentloaded'});
 const compare=[...routes.map(r=>r+'index.html'),...files,'sitemap.xml','robots.txt'];let next=0;
 await Promise.all(Array.from({length:4},async()=>{while(next<compare.length){const file=compare[next++];const url='/'+file.replace(/^\//,'');const row=await page.evaluate(async url=>{for(let i=0;i<3;i++)try{const r=await fetch(url);const bytes=await r.arrayBuffer();return {status:r.status,hash:Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(x=>x.toString(16).padStart(2,'0')).join('')}}catch(e){if(i===2)throw e}},url);const local='dist/auto-language-baseline/production/'+file;const expected=hash(fs.readFileSync(local));baseline.live.push({file,...row,expected,match:row.status===200&&row.hash===expected});if(row.status!==200||row.hash!==expected)baseline.differences.push(file);}}));
 const p=await browser.newPage();await p.goto('https://www.hurralingo.com/',{waitUntil:'domcontentloaded'});
 baseline.htmlDifferences=[];
 let diffNext=0;const htmlFiles=baseline.differences.filter(f=>f.endsWith('.html'));
 await Promise.all(Array.from({length:4},async()=>{while(diffNext<htmlFiles.length){const file=htmlFiles[diffNext++];
   const text=await p.evaluate(async url=>(await fetch(url)).text(),'/'+file.replace(/^\//,''));
   const dest=path.join('dist/auto-language-baseline/live',file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,text);
   const route=file.replace(/index\.html$/,'');const local=fs.readFileSync('dist/auto-language-baseline/production/'+file,'utf8');
   // Cloudflare injects email obfuscation at response time; compare document semantics.
   const normalize=require('./compare-language-baseline.cjs');
   const same=normalize(text)===normalize(local);baseline.htmlDifferences.push({file,equivalent:same,liveSeo:seo(text),localSeo:seo(local)});
 }}));
 }finally{await browser.close()}
 fs.writeFileSync(out+'/baseline.json',JSON.stringify(baseline,null,2)+'\n');
 console.log(JSON.stringify({productionId:state.production.id,productionBranch:state.productionBranch,compared:baseline.live.length,byteDifferences:baseline.differences.length,unexplained:baseline.htmlDifferences.filter(x=>!x.equivalent).map(x=>x.file)}));
 assert.ok(baseline.htmlDifferences.every(x=>x.equivalent)&&baseline.differences.every(x=>x.endsWith('.html')),'Inspect unexplained production differences before continuing');
})().catch(e=>{console.error(e.message);process.exitCode=1});
