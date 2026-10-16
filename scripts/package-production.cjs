// Offline production candidate only. This script never deploys or modifies source SEO.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),c=require('cheerio');
const {root,read}=require('./site-tr.cjs');
const source=path.join(root,'dist/phase-1b-preview');
const out=path.resolve(root,'dist/phase-1c-production');
assert.ok(out.startsWith(path.resolve(root,'dist')+path.sep));
assert.ok(fs.existsSync(source),'Build the preview package first');
fs.rmSync(out,{recursive:true,force:true});fs.cpSync(source,out,{recursive:true});
const localized=fs.existsSync(path.join(root,'content/i18n/routes.json'));
const routes=JSON.parse(read(localized?'content/i18n/canonical-all.json':'content/site/canonical-tr.json'));
for(const route of routes){
 const file=path.join(out,route,'index.html');
 let html=fs.readFileSync(file,'utf8');
 assert.equal(c.load(html)('meta[name=robots]').attr('content'),'noindex, nofollow');
 html=html.replace('<meta name="robots" content="noindex, nofollow">','<meta name="robots" content="index, follow">');
 fs.writeFileSync(file,html);
 const $=c.load(html);assert.equal($('meta[name=robots]').attr('content'),'index, follow');
 assert.equal($('link[rel=canonical]').attr('href'),'https://www.hurralingo.com'+route);
}
fs.writeFileSync(path.join(out,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: https://www.hurralingo.com/sitemap.xml\n');
fs.writeFileSync(path.join(out,'_headers'),'/*\n  X-Content-Type-Options: nosniff\n/404.html\n  X-Robots-Tag: noindex, nofollow\n');
const redirectFile=path.join(out,'_redirects');fs.writeFileSync(redirectFile,fs.readFileSync(redirectFile,'utf8').replace('Preview-only relative','Production relative'));
const protectedFiles=JSON.parse(read('docs/phase-1b/baseline.json')).protectedFiles;
for(const [file,digest] of Object.entries(protectedFiles)){
 if(file==='robots.txt')continue; // Deliberate package-only production SEO difference.
 if(localized&&/^(en|de|az)(\.html|\/)/.test(file))continue; // Explicitly superseded by the new localization scope.
 const copied=path.join(out,file);if(fs.existsSync(copied))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(copied)).digest('hex'),digest,file);
}
const foreign=[];
for(const file of localized?['en/index.html','de/index.html','az/index.html']:['en.html','de.html','az.html']){
 const $=c.load(fs.readFileSync(path.join(out,file),'utf8'));
 foreign.push({file,canonical:$('link[rel=canonical]').attr('href'),robots:$('meta[name=robots]').attr('content'),byteIdentical:fs.readFileSync(path.join(root,file)).equals(fs.readFileSync(path.join(out,file)))});
}
const release=JSON.parse(read('docs/phase-1c/release-blockers.json'));
const result={pass:true,productionCandidateOnly:true,sourceSeoUnchanged:true,canonicalPages:routes.length,sitemapPages:c.load(read('sitemap.xml'),{xmlMode:true})('loc').length,preview:{meta:'noindex, nofollow',header:'noindex, nofollow',robots:'Disallow: /'},production:{meta:'index, follow',header:'No global X-Robots-Tag; 404 remains noindex',robots:'Allow: /'},foreign,releaseBlocked:!release.releaseAllowed||release.blocking.length>0,blockers:release.blocking.map(x=>x.detail),acceptedUnverifiedItems:release.acceptedUnverifiedItems||[]};
fs.mkdirSync(path.join(root,'docs/phase-1c'),{recursive:true});
fs.writeFileSync(path.join(root,'docs/phase-1c/production-package-verification.json'),JSON.stringify(result,null,2)+'\n');
console.log('PASS: separate production candidate, '+routes.length+' indexable pages; protected pricing/media assets unchanged. '+(result.releaseBlocked?'RELEASE BLOCKED.':'Release authorized; this script does not deploy.'));
