const http=require('http'), fs=require('fs'), path=require('path');
const root=path.resolve(__dirname,'..'),port=Number(process.env.HURRA_PREVIEW_PORT||8017);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.mp4':'video/mp4','.pdf':'application/pdf','.md':'text/plain; charset=utf-8','.json':'application/json'};
http.createServer((req,res)=>{
 let url;try{url=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);return res.end()}
 if(url.split('/').some(part=>part.startsWith('.'))){res.writeHead(403);return res.end()}
 let file=path.resolve(root,'.'+url);if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);return res.end()}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory()){
  if(!url.endsWith('/')){res.writeHead(301,{Location:encodeURI(url+'/')});return res.end()}
  file=path.join(file,'index.html');
 }
 fs.readFile(file,(error,data)=>{if(error){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Robots-Tag':'noindex, nofollow'});res.end(req.method==='HEAD'?'':data)})
}).listen(port,'127.0.0.1',()=>console.log('Hurra yerel önizleme: http://127.0.0.1:'+port));
