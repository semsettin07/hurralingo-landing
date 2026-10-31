// Writes the smaller logo and the blog image widths used for srcset. Run after adding images; results are committed.
const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const root=path.resolve(__dirname,'..'),source=path.join(root,'img/blog');
const widths=[480,800];
(async()=>{
 await sharp(path.join(root,'img/logo-hurra-lingo.webp')).resize({width:540}).webp({quality:82,alphaQuality:90,effort:6}).toFile(path.join(root,'img/logo-hurra-lingo-540.webp'));
 let written=0;const sizes={};
 for(const name of fs.readdirSync(source).filter(f=>f.endsWith('.webp'))){
  const file=path.join(source,name),{width,height}=await sharp(file).metadata();
  sizes[name]=[width,height];
  for(const w of widths.filter(w=>w<width)){
   const dir=path.join(source,'w'+w);fs.mkdirSync(dir,{recursive:true});
   await sharp(file).resize({width:w}).webp({quality:76,effort:6}).toFile(path.join(dir,name));written++;
  }
 }
 fs.writeFileSync(path.join(source,'widths.json'),JSON.stringify(sizes)+'\n');
 console.log('Wrote the logo and '+written+' blog image widths.');
})();
