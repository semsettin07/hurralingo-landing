// Shared mobile language row; desktop language menus are left intact.
const names={tr:'Türkçe',en:'English',de:'Deutsch',fr:'Français',az:'Azərbaycanca'};
function mobileLanguages($){
  const row=$('#drawer .dr-langs');
  if(!row.length)return;
  $('#drawer .dr-list').before(row);
  for(const [lang,name]of Object.entries(names)){
    const link=row.find(`a[lang="${lang}"]`);
    link.text(lang.toUpperCase()).attr('aria-label',name);
    row.append(link);
  }
}
module.exports=mobileLanguages;
