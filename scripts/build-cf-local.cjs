// Local copy of the Cloudflare Pages production build command. Never deploys.
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist/cloudflare-pages');
for(const script of ['build-site-tr','build-locales','package-preview','package-production'])execFileSync(process.execPath,[path.join('scripts',script+'.cjs')],{cwd:root,stdio:'inherit'});
fs.rmSync(out,{recursive:true,force:true});
fs.cpSync(path.join(root,'dist/phase-1c-production'),out,{recursive:true});
console.log('Local Cloudflare package: '+out);
