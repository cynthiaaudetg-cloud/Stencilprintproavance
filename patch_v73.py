from pathlib import Path
import re
p=Path('index.html')
s=p.read_text()
assert 'STENCIL PRINT PRO v68' in s
s=s.replace('STENCIL PRINT PRO v68','STENCIL PRINT PRO v73')
s=s.replace('          <option value="coloring">MODE LIVRE À COLORIER</option>\n','')
s=re.sub(r'\n\s*<div class="card card-full" id="cardColoring".*?</div>\n\n<div class="card card-full" id="cardOriginal"', '\n\n<div class="card card-full" id="cardOriginal"', s, flags=re.S)
s=s.replace('<div class="card card-full">\n        <label>MODE DE RENDU</label>', '<div class="card card-full" id="modeCard" style="display:none">\n        <label>MODE DE RENDU</label>',1)
s=s.replace('<style>\n', '<style>\n#modeCard,#cardReinforce,#cardOriginal,#cardDot,#cardDotSize,#cardDotContrast{display:none !important}\n',1)
action=re.search(r'<div class="action-bar">.*?</div>\n\n<div class="app-main">',s,flags=re.S)
assert action
s=s[:action.start()]+'<div class="app-main">'+s[action.end():]
needle='''    <div class="preview-header">✦ PRÉVISUALISATION — STENCIL PRINT PRO ✦</div>'''
insert='''    <div class="preview-header">✦ PRÉVISUALISATION — STENCIL PRINT PRO ✦</div>
    <div class="quick-rail quick-left">
      <button class="quick-btn stencil" onclick="setMode('stencil')">STENCIL</button>
      <button class="quick-btn dot" onclick="setMode('dotwork')">DOT</button>
      <button class="quick-btn original" onclick="quickOriginal()">ORIGINAL</button>
    </div>
    <div class="quick-rail quick-right">
      <button class="quick-btn print" onclick="openPrintZone()">A4</button>
      <button class="quick-btn compare" onclick="toggleCompare()">AVANT<br>APRÈS</button>
    </div>'''
assert needle in s
s=s.replace(needle,insert,1)
css='''
.preview-zone{position:relative}
.quick-rail{position:absolute;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:10px;z-index:30}
.quick-left{left:7px}.quick-right{right:7px}
.quick-btn{width:52px;min-height:52px;border-radius:15px;background:#111118;color:#fff;font-weight:900;font-size:.58rem;line-height:1.05;padding:4px;border:2px solid;box-shadow:0 5px 16px rgba(0,0,0,.55);cursor:pointer}
.quick-btn.stencil{border-color:#19e6ff;background:#19e6ff;color:#061014}
.quick-btn.dot{border-color:#b77cff;color:#b77cff}
.quick-btn.original{border-color:#ffe14a;color:#ffe14a}
.quick-btn.print{border-color:#63ff4f;color:#63ff4f}
.quick-btn.compare{border-color:#b77cff;color:#b77cff}
@media(max-width:700px){.quick-rail{gap:7px}.quick-btn{width:46px;min-height:48px;font-size:.52rem;border-radius:13px}.quick-left{left:5px}.quick-right{right:5px}.preview-scroll{padding-left:60px;padding-right:60px}}
'''
s=s.replace('</style>',css+'</style>',1)
s=s.replace('--pink:#ff007f; --cyan:#00e5ff; --green:#39ff14; --line:#2d2d35;','--pink:#b77cff; --cyan:#19e6ff; --green:#63ff4f; --yellow:#ffe14a; --line:#2d2d35;')
s=s.replace('header{\n  background:#000; border-bottom:2px solid var(--pink);','header{\n  background:#000; border-bottom:2px solid var(--cyan);',1)
s=s.replace('.brand{color:var(--pink);','.brand{color:var(--yellow);',1)
s=s.replace("if(mode==='stencil'){ $('sSeuil').value=82; $('sClean').value=240; $('sWidth').value=1; $('sReinforce').value=20; $('sDetail').value=38; }","if(mode==='stencil'){ $('sSeuil').value=82; $('sClean').value=240; $('sWidth').value=0; $('sReinforce').value=20; $('sDetail').value=38; }")
s=s.replace('id="sWidth" min="0" max="4" value="1"','id="sWidth" min="0" max="2" value="0"')
s=s.replace('<span class="val" id="vWidth">1</span>','<span class="val" id="vWidth">0</span>',1)
s=s.replace('<div class="mini">0 = fin · 4 = plus épais</div>','<div class="mini">0 = ultra-fin · 2 = légèrement plus épais</div>',1)
s=s.replace("if(mode==='coloring'){ $('sCBContrast').value=130; $('sCBSharp').value=70; $('sCBWhite').value=80; $('sCBWidth').value=4; }","if(mode==='coloring'){}")
p.write_text(s)
print('v73 patch ready',len(s))
