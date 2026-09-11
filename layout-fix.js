(function(){
'use strict';
var d=document;
function fire(el){['input','change'].forEach(function(t){el.dispatchEvent(new Event(t,{bubbles:true}));});}
function sizeCtl(){return d.getElementById('sizeCm')||d.querySelector('input[type=range][id*=size i]');}
function pagesCtl(){return d.getElementById('pages')||d.querySelector('select');}
function addDimensions(){
 if(d.getElementById('sokal91-dimensions'))return;
 var anchor=d.getElementById('pages')||d.querySelector('select');if(!anchor)return;
 var box=d.createElement('div');box.id='sokal91-dimensions';
 box.innerHTML='<div class="s91-title">MESURE RÉELLE DU DESSIN</div><div class="s91-row"><label>Largeur <input id="s91w" type="number" min="0.1" step="0.1" value="10"> cm</label><label>Hauteur <input id="s91h" type="number" min="0.1" step="0.1" value="15"> cm</label><label class="s91-lock"><input id="s91lock" type="checkbox" checked> proportions</label></div><div class="s91-info">La feuille reste à sa vraie dimension. Le dessin peut être plus petit ou dépasser largement la feuille.</div>';
 anchor.parentElement.appendChild(box);
 var w=box.querySelector('#s91w'),h=box.querySelector('#s91h'),lock=box.querySelector('#s91lock');
 function update(from){var a=parseFloat(w.value),b=parseFloat(h.value);if(!(a>0&&b>0))return;var r=sizeCtl();if(r){var val=from==='h'?b:a;r.value=String(Math.max(0.1,Math.min(300,val)));fire(r);}}
 w.addEventListener('change',function(){if(lock.checked){var old=parseFloat(w.dataset.old||w.value),oldh=parseFloat(h.dataset.old||h.value);if(old>0&&oldh>0)h.value=(parseFloat(w.value)*oldh/old).toFixed(1);}update('w');w.dataset.old=w.value;h.dataset.old=h.value;});
 h.addEventListener('change',function(){if(lock.checked){var old=parseFloat(h.dataset.old||h.value),oldw=parseFloat(w.dataset.old||w.value);if(old>0&&oldw>0)w.value=(parseFloat(h.value)*oldw/old).toFixed(1);}update('h');w.dataset.old=w.value;h.dataset.old=h.value;});
 w.dataset.old=w.value;h.dataset.old=h.value;
}
function applyPaper(){
 var pages=pagesCtl();if(!pages)return;
 var n=parseInt(pages.value,10)||1,map={1:[1,1],2:[2,1],4:[2,2],6:[3,2],9:[3,3],12:[4,3]},m=map[n]||map[1];
 var frames=d.querySelectorAll('.page-frame');for(var i=0;i<frames.length;i++){frames[i].style.boxSizing='border-box';frames[i].style.overflow='visible';}
 var outs=d.querySelectorAll('.page-output');for(var j=0;j<outs.length;j++){outs[j].style.boxSizing='border-box';outs[j].style.aspectRatio='8.5 / 11';outs[j].style.width='100%';outs[j].style.height='auto';outs[j].style.maxWidth='none';outs[j].style.flex='0 0 auto';}
 var grids=d.querySelectorAll('.grid-view');for(var k=0;k<grids.length;k++){grids[k].style.gridTemplateColumns='repeat('+m[0]+',minmax(0,1fr))';grids[k].style.gridAutoRows='auto';grids[k].style.overflow='visible';grids[k].style.alignItems='start';}
}
function moveButtonsToBottom(){
 if(window.innerWidth>700)return;
 var dock=d.getElementById('sokal91-bottom-buttons');
 if(!dock){dock=d.createElement('div');dock.id='sokal91-bottom-buttons';dock.setAttribute('aria-label','Boutons d’ajustement');d.body.appendChild(dock);}
 var buttons=d.querySelectorAll('.b-step');
 for(var i=0;i<buttons.length;i++){var b=buttons[i];if(b.parentElement!==dock)dock.appendChild(b);}
}
function applyMobileLayout(){
 if(window.innerWidth>700)return;
 var main=d.querySelector('.app-main'),preview=d.querySelector('.preview-zone'),controls=d.querySelector('.controls-zone');
 if(main){main.style.display='flex';main.style.flexDirection='column';main.style.flex='1';main.style.minHeight='0';main.style.width='100%';}
 if(preview){preview.style.order='0';preview.style.flex='0 0 46vh';preview.style.height='46vh';preview.style.minHeight='240px';preview.style.maxHeight='55vh';preview.style.width='100%';preview.style.minWidth='0';preview.style.overflow='hidden';}
 if(controls){controls.style.order='1';controls.style.flex='1 1 auto';controls.style.width='100%';controls.style.minHeight='0';controls.style.overflowY='auto';controls.style.overflowX='hidden';controls.style.paddingBottom='100px';}
 var cards=d.querySelectorAll('.controls');for(var i=0;i<cards.length;i++){cards[i].style.display='grid';cards[i].style.gridTemplateColumns='1fr';cards[i].style.width='100%';}
 var gv=d.getElementById('gv');if(gv){gv.style.width='100%';gv.style.minHeight='100%';}
 moveButtonsToBottom();
}
var st=d.createElement('style');st.textContent='#sokal91-bottom-buttons{display:none}@media(max-width:700px){body{display:flex!important;flex-direction:column!important;overflow:hidden!important;width:100%!important;height:100%!important}.preview-zone{display:flex!important;flex-direction:column!important;flex:0 0 46vh!important;height:46vh!important;min-height:240px!important;max-height:55vh!important}.preview-scroll{display:block!important;flex:1 1 auto!important;min-height:0!important;overflow:auto!important;-webkit-overflow-scrolling:touch!important}.grid-view{display:grid!important;width:100%!important;justify-items:center!important}.controls-zone{display:block!important;flex:1 1 auto!important;min-height:0!important;overflow-y:auto!important;overflow-x:hidden!important;padding-bottom:100px!important}.controls{display:grid!important;grid-template-columns:1fr!important;width:100%!important}.card-full{grid-column:span 1!important}.action-bar{flex-shrink:0!important}.import-zone{flex-shrink:0!important}#sokal91-bottom-buttons{position:fixed!important;left:0!important;right:0!important;bottom:0!important;z-index:99999!important;display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:6px!important;padding:8px max(8px,env(safe-area-inset-left)) calc(8px + env(safe-area-inset-bottom)) max(8px,env(safe-area-inset-right))!important;background:rgba(17,17,24,.97)!important;border-top:1px solid #2d2d35!important;box-sizing:border-box!important;max-height:24vh!important;overflow-y:auto!important}.b-step{position:static!important;display:block!important;width:100%!important;height:42px!important;margin:0!important;border-radius:9px!important;font-size:22px!important;touch-action:manipulation!important}.adj .b-step{flex:initial!important}}@media print{@page{size:Letter portrait;margin:0}.grid-view{display:block!important}.page-frame{width:8.5in!important;height:11in!important;padding:0!important;margin:0!important;break-after:page;page-break-after:always}.page-output{width:8.5in!important;height:11in!important;aspect-ratio:auto!important;max-width:none!important}.page-frame:last-child{break-after:auto;page-break-after:auto}}';d.head.appendChild(st);
function install(){var pages=pagesCtl(),size=sizeCtl();if(pages){pages.style.pointerEvents='auto';pages.style.touchAction='manipulation';pages.setAttribute('aria-label','Nombre de pages');}if(size){size.min='0.1';size.max='300';size.step='0.1';size.style.touchAction='pan-x';size.style.position='relative';size.style.zIndex='5';size.style.boxSizing='border-box';}addDimensions();applyPaper();applyMobileLayout();}
install();
var mo=new MutationObserver(function(){install();});mo.observe(d.body,{subtree:true,childList:true});
setTimeout(install,250);setTimeout(install,1000);
})();
