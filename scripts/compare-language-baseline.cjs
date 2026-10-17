const fs=require('node:fs'),assert=require('node:assert/strict');
// Undo only Cloudflare's reversible email protection, preserving every other byte.
function decode(encoded){const bytes=Buffer.from(encoded,'hex');return Buffer.from(bytes.subarray(1).map(x=>x^bytes[0])).toString('utf8')}
function normalize(s){return s.replace(/<script[^>]*src="\/cdn-cgi\/scripts\/[^\"]*\/cloudflare-static\/email-decode.min.js"[^>]*><\/script>/g,'').replace(/<(a|span)\b[^>]*data-cfemail="([a-f0-9]+)"[^>]*>.*?<\/\1>/g,(_,tag,encoded)=>decode(encoded)).replace(/href="\/cdn-cgi\/l\/email-protection#([a-f0-9]+)"/g,(_,encoded)=>'href="mailto:'+decode(encoded)+'"').replace(/href="http:\/\/www\.hurralingo\.com\//g,'href="https://www.hurralingo.com/');}
module.exports=normalize;
if(require.main===module){
 const file='docs/auto-language/baseline.json',baseline=JSON.parse(fs.readFileSync(file,'utf8'));const unexplained=[];
 for(const row of baseline.htmlDifferences){
  const a=normalize(fs.readFileSync('dist/auto-language-baseline/live/'+row.file,'utf8')),b=normalize(fs.readFileSync('dist/auto-language-baseline/production/'+row.file,'utf8'));row.equivalent=a===b;
  if(!row.equivalent){unexplained.push(row.file);let i=0;while(a[i]===b[i]&&i<a.length)i++;console.log(row.file,JSON.stringify(a.slice(i-50,i+250)),JSON.stringify(b.slice(i-50,i+250)));}
 }
 fs.writeFileSync(file,JSON.stringify(baseline,null,2)+'\n');console.log('Unexplained differences: '+unexplained.length);assert.deepEqual(unexplained,[]);
}
