// Read-only deployment verification; keeps tokens solely in process memory.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const config=fs.readFileSync(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8'),token=config.match(/oauth_token\s*=\s*"([^"]+)"/)[1];
 const base='https://api.cloudflare.com/client/v4/accounts/b21fdd3b8f630cbc1856d29e70af7ea1/pages/projects/hurralingo-landing';
 const get=async suffix=>{const r=await fetch(base+suffix,{headers:{Authorization:'Bearer '+token}}),j=await r.json();assert.ok(j.success);return j.result};
 const target=process.argv[2]||'https://a74f8ff1.hurralingo-landing.pages.dev';assert.match(target,/^https:\/\/[a-z0-9-]+\.hurralingo-landing\.pages\.dev$/);
 const project=await get(''),deployments=await get('/deployments');const preview=deployments.find(d=>d.url===target);assert.ok(preview,'Preview deployment not found');
 const before=require('../docs/auto-language/cloudflare-before.json');assert.equal(project.canonical_deployment.id,before.production.id);assert.deepEqual(project.build_config,before.build);assert.equal(preview.environment,'preview');assert.equal(preview.latest_stage.status,'success');
 const result={pass:true,preview:{id:preview.id,url:preview.url,environment:preview.environment,status:preview.latest_stage.status,aliases:preview.aliases,branch:preview.deployment_trigger.metadata.branch},productionId:project.canonical_deployment.id,productionUnchanged:true,buildUnchanged:true,checkedAt:new Date().toISOString()};
 fs.writeFileSync('docs/auto-language/deployment.json',JSON.stringify(result,null,2)+'\n');console.log(result);
})().catch(e=>{console.error(e.message);process.exitCode=1});
