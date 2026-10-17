// Poll the authorized Git deployment without creating another deployment.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
(async()=>{
 const token=fs.readFileSync(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8').match(/oauth_token\s*=\s*"([^"]+)"/)[1];
 const base='https://api.cloudflare.com/client/v4/accounts/b21fdd3b8f630cbc1856d29e70af7ea1/pages/projects/hurralingo-landing';
 const head=process.argv[2]||execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
 const get=async suffix=>{const r=await fetch(base+suffix,{headers:{Authorization:'Bearer '+token}}),j=await r.json();assert.ok(j.success,JSON.stringify(j.errors));return j.result};
 let previous='';
 for(let attempt=0;attempt<120;attempt++){
  const deployments=await get('/deployments'),d=deployments.find(d=>d.environment==='production'&&d.deployment_trigger.metadata.commit_hash===head);
  if(d){const state=d.latest_stage.name+': '+d.latest_stage.status;if(state!==previous){console.log(state);previous=state}
   assert.ok(!['failure','canceled'].includes(d.latest_stage.status),'Production build '+d.latest_stage.status);
   if(d.latest_stage.name==='deploy'&&d.latest_stage.status==='success'){
    const project=await get('');assert.equal(project.canonical_deployment.id,d.id);assert.equal(d.deployment_trigger.metadata.branch,'main');
    const response=await fetch('https://www.hurralingo.com/api/country'),country=await response.json();assert.equal(response.status,200);assert.deepEqual(Object.keys(country),['country']);assert.match(response.headers.get('cache-control'),/no-store/);
    const asset=await fetch('https://www.hurralingo.com/assets/auto-language.js');assert.equal(asset.status,200);assert.equal((await asset.text()).replace(/\r\n/g,'\n'),fs.readFileSync('assets/auto-language.js','utf8').replace(/\r\n/g,'\n'));
    const result={pass:true,id:d.id,url:d.url,publicUrl:'https://www.hurralingo.com/',source:head,branch:'main',status:'success',previousId:'446b4a60-e40d-4d51-a597-e298118d992a',checkedAt:new Date().toISOString(),build:project.build_config,endpoint:{status:response.status,body:country,cache:response.headers.get('cache-control')},languageAssetMatches:true};
    fs.writeFileSync('docs/auto-language/production-deployment.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));return;
   }
  }
  await new Promise(r=>setTimeout(r,5000));
 }
 throw new Error('Production deployment did not complete within the polling window');
})().catch(e=>{console.error(e.message);process.exitCode=1});
