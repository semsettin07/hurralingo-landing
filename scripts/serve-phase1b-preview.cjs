// Exercise the same preview bundle and redirect table locally before Cloudflare upload.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../dist/phase-1b-preview');
const rules=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../content/site/redirects-tr.json'),'utf8')).rules;
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.mp4':'video/mp4','.pdf':'application/pdf','.xml':'application/xml','.txt':'text/plain'};
http.createServer((req,res)=>{
 let url;try{url=new URL(req.url,'http://localhost')}catch{res.writeHead(400);return res.end()}
 let pathname;try{pathname=decodeURIComponent(url.pathname)}catch{res.writeHead(400);return res.end()}
 const headers={'X-Robots-Tag':'noindex, nofollow'};
 const redirect=rules[url.pathname]||rules[pathname];
 if(redirect){const dest=redirect,i=dest.indexOf('#'),base=i<0?dest:dest.slice(0,i),hash=i<0?'':dest.slice(i);res.writeHead(301,{...headers,Location:base+url.search+hash});return res.end();}
 if(pathname.split('/').some(p=>p.startsWith('.'))){res.writeHead(403,headers);return res.end()}
 let file=path.resolve(root,'.'+pathname);if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403,headers);return res.end()}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory()){
  if(!pathname.endsWith('/')){res.writeHead(301,{...headers,Location:pathname+'/'+url.search});return res.end()}
  file=path.join(file,'index.html');
 }
 fs.readFile(file,(e,b)=>{res.writeHead(e?404:200,{...headers,'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(req.method==='HEAD'?'':e?'Not found':b)});
}).listen(Number(process.env.HURRA_PREVIEW_PORT||8021),'127.0.0.1',()=>console.log('Phase 1B preview: http://127.0.0.1:'+(process.env.HURRA_PREVIEW_PORT||8021)));
