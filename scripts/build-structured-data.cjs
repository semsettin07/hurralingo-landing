// Adds Organization and WebSite structured data to each language home page.
// Company facts come from the Terms and Privacy documents and the site footer; unverified fields stay out.
const c=require('cheerio');
const {read,write}=require('./site-tr.cjs');
const origin='https://www.hurralingo.com';
const existing=/<script type="application\/ld\+json" data-site-schema>[\s\S]*?<\/script>/;
const organization={
 '@type':'EducationalOrganization','@id':origin+'/#organization',name:'Hurra Lingo',legalName:'Hurra Education International Ltd',url:origin+'/',
 logo:origin+'/img/logo-hurra-lingo.webp',image:origin+'/img/hurralingo-og.jpg',email:'hello@hurralingo.com',telephone:'+90 539 516 70 70',
 address:[
  {'@type':'PostalAddress',streetAddress:'Ankara Üniversitesi Teknokent',addressLocality:'Gölbaşı',addressRegion:'Ankara',addressCountry:'TR'},
  {'@type':'PostalAddress',streetAddress:'152–160 Capital Office Ltd, Kemp House, City Road',addressLocality:'London',postalCode:'EC1V 2NX',addressCountry:'GB'}
 ],
 sameAs:['https://www.instagram.com/HurraLingo/','https://www.facebook.com/HurraLingo/','https://www.youtube.com/@hurralingo1796','https://www.tiktok.com/@hurra_lingo','https://www.linkedin.com/company/hurraglobal']
};
for(const lang of ['tr','en','de','az','fr']){
 const file=lang==='tr'?'index.html':lang+'/index.html',html=read(file).replace(existing,'');
 const graph=[{...organization,description:c.load(html)('meta[name=description]').attr('content')},{'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:'Hurra Lingo',inLanguage:lang,publisher:{'@id':organization['@id']}}];
 const tag=`<script type="application/ld+json" data-site-schema>${JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c')}</script>`;
 write(file,html.replace('</head>',tag+'</head>'));
 // Legacy file aliases mirror the language home page.
 if(['en','de','az'].includes(lang))write(lang+'.html',read(file));
}
