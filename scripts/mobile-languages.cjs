// Shared mobile language row; desktop language menus are left intact.
const names={tr:'Türkçe',en:'English',de:'Deutsch',fr:'Français',az:'Azərbaycanca'};
function mobileLanguages($){
  const row=$('#drawer .dr-langs');
  if(!row.length)return;
  $('#drawer .dr-list').before(row);
  for(const [lang,name]of Object.entries(names)){
    const link=row.find(`a[lang="${lang}"]`);
    const country=lang==='en'?'gb':lang;
    link.html(`<span class="language-flag"><img src="/img/flags/${country}.svg" alt="" width="24" height="16" aria-hidden="true"></span>`).attr('aria-label',name);
    row.append(link);
  }
}
module.exports=mobileLanguages;
