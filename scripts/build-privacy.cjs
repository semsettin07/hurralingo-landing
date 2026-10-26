// One authoritative English policy, shared by footer links in every locale.
const fs = require('node:fs');
const path = require('node:path');
const c = require('cheerio');
const root = path.resolve(__dirname, '..');
const route = '/en/privacy-policy/';
const labels = {tr:'Gizlilik Politikası (İngilizce)', en:'Privacy Policy', de:'Datenschutzerklärung (Englisch)', az:'Məxfilik siyasəti (ingiliscə)', fr:'Politique de confidentialité (anglais)'};
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const write = (file, text) => {fs.mkdirSync(path.dirname(path.join(root,file)), {recursive:true});fs.writeFileSync(path.join(root,file),text);};
const esc = text => text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const blocks = read('content/site/privacy-policy-en.txt').trim().split(/\r?\n\s*\r?\n/);
const linked = text => esc(text).replace(/hello@hurralingo\.com/g,'<a href="mailto:hello@hurralingo.com">hello@hurralingo.com</a>').replace(/https:\/\/www\.hurralingo\.com\/iletisim\//g,'<a href="/iletisim/">https://www.hurralingo.com/iletisim/</a>');
const body = blocks.map((block,i) => {
  if(i===0)return `<h1>${esc(block)}</h1>`;
  if(/^\d+\. /.test(block))return `<h2 id="section-${block.match(/^\d+/)[0]}">${esc(block)}</h2>`;
  if(block.startsWith('• '))return `<ul>${block.split(/\r?\n/).map(line=>`<li>${linked(line.replace(/^• /,''))}</li>`).join('')}</ul>`;
  if(i===1)return `<p class="privacy-updated">${esc(block)}</p>`;
  if(!/[.?:]$/.test(block)&&!block.includes('\n')&&!block.includes('@')&&block.length<65)return `<h3>${esc(block)}</h3>`;
  return `<p>${linked(block).replace(/\r?\n/g,'<br>')}</p>`;
}).join('\n');
let template=read('en/contact/index.html');
template=template.replace(/(<main\b[^>]*>)[\s\S]*?<\/main>/,`$1<div class="wrap privacy-wrap" id="top"><article class="privacy-policy" lang="en">${body}</article></div></main>`);
const $=c.load(template);
$('title').text('Privacy Policy | Hurra Lingo');
$('link[rel=canonical]').attr('href','https://www.hurralingo.com'+route);
$('link[rel=alternate][hreflang]').remove();
$('meta[property="og:url"]').attr('content','https://www.hurralingo.com'+route);
$('meta[property="og:title"],meta[name="twitter:title"]').attr('content','Privacy Policy | Hurra Lingo');
$('meta[name=description],meta[property="og:description"],meta[name="twitter:description"]').attr('content','How Hurra Lingo collects, uses, stores, shares and protects personal information. Last updated October 26, 2026.');
$('head').append('<link rel="stylesheet" href="/assets/privacy-policy.css">');
$('header a[aria-current="page"],#drawer a[aria-current="page"]').not('[lang]').removeAttr('aria-current');
$('script[type="application/ld+json"]').remove();
$('body').append('<script src="/assets/privacy-policy.js" defer></script>');
write('en/privacy-policy/index.html',$.html());
let changed=0;
function visit(dir){for(const entry of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(entry.isDirectory()){if(!['.git','node_modules','dist','docs','.wrangler','content','scripts','assets','img','media','functions','wp-content'].includes(entry.name))visit(file);continue;}
  if(!entry.name.endsWith('.html'))continue;
  const html=read(file),lang=html.match(/<html[^>]*lang="([a-z]+)"/)?.[1]||'tr';
  // Keep unrelated content, including archived policy translations, byte-for-byte.
  const next=html.replace(/<footer\b[\s\S]*?<\/footer>/g,footer=>footer.replace(/<a\b[^>]*href="(?:[^"\s]*Hurra-Lingo-Privacy-Policy[^"\s]*|\/fr\/confidentialite\/|\/(?:en\/)?privacy-policy\/)"[^>]*>[\s\S]*?<\/a>/g,`<a href="${route}" hreflang="en">${labels[lang]||labels.en}</a>`));
  if(next!==html){write(file,next);changed++;}
}}
visit('');
const canonicalFile='content/i18n/canonical-all.json';
if(fs.existsSync(path.join(root,canonicalFile))){const routes=JSON.parse(read(canonicalFile));if(!routes.includes(route)){routes.push(route);write(canonicalFile,JSON.stringify(routes,null,2)+'\n');}}
let sitemap=read('sitemap.xml');
if(!sitemap.includes('https://www.hurralingo.com'+route))write('sitemap.xml',sitemap.replace('</urlset>',`<url><loc>https://www.hurralingo.com${route}</loc></url>\n</urlset>`));
console.log(`Built English privacy policy; updated ${changed} footer links.`);
