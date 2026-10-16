// Read-only: compare the active production deployment and original page semantics.
const fs=require('node:fs'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto'),c=require('cheerio');
const before=JSON.parse(fs.readFileSync('docs/phase-1b/production-before.json','utf8'));
const baseline=JSON.parse(fs.readFileSync('docs/phase-1b/baseline.json','utf8'));
const cli=process.env.HURRA_WRANGLER_PATH;
if(!cli)throw Error('Set HURRA_WRANGLER_PATH to an already installed Wrangler CLI.');
function norm(body){const $=c.load(body);$('a.__cf_email__,span.__cf_email__').each((i,e)=>{const s=$(e).attr('data-cfemail'),key=parseInt(s.slice(0,2),16);$(e).replaceWith(s.slice(2).match(/../g).map(x=>String.fromCharCode(parseInt(x,16)^key)).join(''))});$('script').remove();return{title:$('title').text(),h1:$('h1').text(),canonical:$('link[rel=canonical]').attr('href'),robots:$('meta[name=robots]').attr('content'),main:$('main').text().replace(/\s+/g,' ').trim()};}
(async()=>{
 const rows=JSON.parse(cp.execFileSync(process.execPath,[cli,'pages','deployment','list','--project-name','hurralingo-landing','--environment','production','--json'],{encoding:'utf8',maxBuffer:3e6}));
 const after=rows[0];assert.equal(after.Id,before.Id);assert.equal(after.Source,before.Source);assert.equal(after.Branch,'main');fs.writeFileSync('docs/phase-1b/production-after.json',JSON.stringify(after,null,2)+'\n');
 const results=[];for(const [route,file]of [['/','index.html'],['/en/','en.html'],['/de/','de.html'],['/az/','az.html']]){const response=await fetch('https://www.hurralingo.com'+route);assert.equal(response.status,200);const body=await response.text(),source=cp.execFileSync('git',['show',baseline.originalRef+':'+file],{encoding:'utf8',maxBuffer:2e6});assert.deepEqual(norm(body),norm(source),'Live semantic content changed '+route);results.push({route,status:200,originalContentMatches:true});}
 const robots=await(await fetch('https://www.hurralingo.com/robots.txt')).text();const old=JSON.parse(fs.readFileSync('docs/phase-1b/production-http-before.json','utf8')).find(x=>x.path==='/robots.txt');assert.equal(crypto.createHash('sha256').update(robots).digest('hex'),old.sha256);
 fs.writeFileSync('docs/phase-1b/production-verification.json',JSON.stringify({pass:true,deploymentId:after.Id,productionBranch:after.Branch,source:after.Source,canonicalAndRobotsAndMainUnchanged:results,robotsBodyUnchanged:true,note:'Cloudflare email obfuscation generates per-response data-cfemail values; these are decoded for semantic comparison. Raw HTML hashes are not stable.'},null,2)+'\n');console.log('PASS: production deployment, root/EN/DE/AZ content, canonical/noindex and robots unchanged.');
})().catch(e=>{console.error(e);process.exitCode=1});
