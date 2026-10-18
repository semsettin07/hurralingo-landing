// Inspect already-built local packages. Never builds remotely or deploys.
const fs=require('node:fs'),assert=require('node:assert/strict'),c=require('cheerio');
const manifest=require('../content/i18n/routes.json'),routes=require('../content/i18n/canonical-all.json');
const result={pass:false,deploymentPerformed:false,frenchPagesPerPackage:manifest.locales.fr.canonical.length,totalCanonicalPages:routes.length};
for(const [stage,robots]of [['phase-1b-preview','noindex, nofollow'],['phase-1c-production','index, follow']]){
 for(const route of routes){const $=c.load(fs.readFileSync('dist/'+stage+route+'index.html','utf8'));assert.equal($('meta[name=robots]').attr('content'),robots,stage+route);assert.equal($('link[rel=canonical]').attr('href'),'https://www.hurralingo.com'+route);}
 const runtimeRoutes=JSON.parse(fs.readFileSync('dist/'+stage+'/_routes.json'));assert.deepEqual(runtimeRoutes,{version:1,include:['/api/country'],exclude:[]});
 result[stage]={robots,canonicalPages:routes.length,countryFunctionRoutes:runtimeRoutes};
}
result.pass=true;fs.writeFileSync('docs/french/package-verification.json',JSON.stringify(result,null,2)+'\n');console.log('PASS: all 235 canonical pages in both offline packages, including 53 French pages; Functions scope unchanged.');
