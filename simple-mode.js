(function(){
'use strict';
var d=document;
var HIDE=['cardStencil','cardClean','cardWidth','cardReinforce','cardDetail','cardDot','cardDotSize','cardDotContrast','cardOriginal'];
function fire(el){['input','change'].forEach(function(t){el.dispatchEvent(new Event(t,{bubbles:true}));});}
function range(id){return d.getElementById(id);}
function setVal(id,v){var el=range(id);if(!el)return;el.value=String(v);fire(el);}
function findText(s){var els=d.querySelectorAll('button,a,[role="button"],label,div,span');for(var i=0;i<els.length;i++){var t=(els[i].textContent||'').trim().toLowerCase();if(t===s||t.indexOf(s)>=0)return els[i];}return null;}
function chooseStencil(){
 var els=d.querySelectorAll('button,a,[role="button"]');
 for(var i=0;i<els.length;i++){
  var t=(els[i].textContent||'').trim().toLowerCase();
  if(t==='pochoir'||t.indexOf('pochoir')>=0){try{els[i].click();}catch(e){}return true;}
 }
 return false;
}
function hideAdvanced(){for(var i=0;i<HIDE.length;i++){var el=d.getElementById(HIDE[i]);if(el)el.style.display='none';}}
function simpleBox(){
 if(d.getElementById('sokal-simple-adjust'))return;
 var zone=d.querySelector('.controls-zone');if(!zone)return;
 var box=d.createElement('div');box.id='sokal-simple-adjust';
 box.innerHTML='<div class="ss-title">AJUSTEMENTS</div><div class="ss-note">Rendu pochoir automatique</div>'+
 '<div class="ss-row"><div class="ss-head"><b>Netteté</b><span id="ssv-detail">45</span></div><button class="ss-minus" data-id="sDetail">−</button><input id="ss-detail" type="range" min="0" max="100" step="1" value="45"><button class="ss-plus" data-id="sDetail">+</button></div>'+
 '<div class="ss-row"><div class="ss-head"><b>Intensité</b><span id="ssv-reinforce">25</span></div><button class="ss-minus" data-id="sReinforce">−</button><input id="ss-reinforce" type="range" min="0" max="100" step="1" value="25"><button class="ss-plus" data-id="sReinforce">+</button></div>'+
 '<div class="ss-row"><div class="ss-head"><b>Contraste</b><span id="ssv-contrast">0.98</span></div><button class="ss-minus" data-id="sContrast">−</button><input id="ss-contrast" type="range" min="0.50" max="1.50" step="0.01" value="0.98"><button class="ss-plus" data-id="sContrast">+</button></div>';
 zone.insertBefore(box,zone.firstChild);
 var map=[['ss-detail','sDetail','ssv-detail'],['ss-reinforce','sReinforce','ssv-reinforce'],['ss-contrast','sContrast','ssv-contrast']];
 for(var j=0;j<map.length;j++)(function(m){
  var ui=d.getElementById(m[0]),real=range(m[1]),val=d.getElementById(m[2]);
  if(!ui)return;
  ui.addEventListener('input',function(){if(real){real.value=ui.value;fire(real);}val.textContent=ui.value;});
  ui.addEventListener('change',function(){if(real){real.value=ui.value;fire(real);}val.textContent=ui.value;});
 })(map[j]);
 var btns=box.querySelectorAll('button');
 for(var k=0;k<btns.length;k++)btns[k].addEventListener('click',function(){var real=range(this.getAttribute('data-id'));if(!real)return;var step=parseFloat(real.step)||1,v=parseFloat(real.value)||0,min=parseFloat(real.min),max=parseFloat(real.max);v+=this.classList.contains('ss-minus')?-step:step;v=Math.max(min,Math.min(max,v));real.value=String(v);fire(real);var ui=d.getElementById(this.getAttribute('data-id')==='sDetail'?'ss-detail':this.getAttribute('data-id')==='sReinforce'?'ss-reinforce':'ss-contrast');var out=d.getElementById(this.getAttribute('data-id')==='sDetail'?'ssv-detail':this.getAttribute('data-id')==='sReinforce'?'ssv-reinforce':'ssv-contrast');if(ui)ui.value=real.value;if(out)out.textContent=real.value;});
}
function syncFromReal(){var pairs=[['sDetail','ss-detail','ssv-detail'],['sReinforce','ss-reinforce','ssv-reinforce'],['sContrast','ss-contrast','ssv-contrast']];for(var i=0;i<pairs.length;i++){var r=range(pairs[i][0]),u=d.getElementById(pairs[i][1]),o=d.getElementById(pairs[i][2]);if(r&&u){u.value=r.value;if(o)o.textContent=r.value;}}}
function autoRender(){
 var fi=d.querySelector('input[type=file]');
 if(!fi||!fi.files||!fi.files.length)return;
 if(!d.body.dataset.sokalSimpleImage){d.body.dataset.sokalSimpleImage=String(fi.files.length)+':'+(fi.files[0].name||'');
  chooseStencil();
  setTimeout(function(){setVal('sSeuil',80);setVal('sClean',200);setVal('sWidth',1);setVal('sReinforce',25);setVal('sDetail',45);setVal('sContrast',0.98);syncFromReal();},180);
 }
}
var css=d.createElement('style');css.textContent='#sokal-simple-adjust{background:#111118;border:1px solid #2d2d35;border-radius:12px;padding:12px;margin:0 0 12px;box-sizing:border-box;width:100%}.ss-title{font-weight:800;font-size:17px;letter-spacing:.5px}.ss-note{font-size:12px;opacity:.65;margin:3px 0 12px}.ss-row{display:grid;grid-template-columns:36px 1fr 36px;gap:6px;align-items:center;margin:10px 0}.ss-head{grid-column:1/-1;display:flex;justify-content:space-between;font-size:14px}.ss-head span{opacity:.8;font-variant-numeric:tabular-nums}.ss-row input[type=range]{width:100%;accent-color:#ff007f}.ss-row button{height:36px;border:1px solid #2d2d35;background:#0a0a0c;color:#fff;border-radius:8px;font-size:22px;font-weight:700;touch-action:manipulation}.ss-row button:active{transform:scale(.97)}@media(min-width:701px){#sokal-simple-adjust{max-width:720px}}';d.head.appendChild(css);
function install(){hideAdvanced();simpleBox();syncFromReal();autoRender();}
install();
var mo=new MutationObserver(function(){install();});
mo.observe(d.body,{subtree:true,childList:true});
var fiObserver=setInterval(autoRender,500);
setTimeout(function(){clearInterval(fiObserver);},120000);
})();
