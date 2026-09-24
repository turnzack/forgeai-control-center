(function() {
    'use strict';
    
    const PRDS = {
        prd_layout_bento: `[CONTEXTE CACHÉ - PRD PRD_LAYOUT_BENTO]
MISSION: Générer une grille asymétrique parfaitement responsive (Bento Box).
STYLE & DESIGN: Design Apple-like, tuiles hétérogènes, border-radius prononcé (rounded-3xl), gaps parfaits.
MAPPING VFS: \`BentoGrid.tsx\`, \`BentoCard.tsx\`, \`BentoDashboardPage.tsx\`
[FIN DU CONTEXTE CACHÉ]`
    };

    function injectText(text, name) {
        const input = document.querySelector('textarea') || document.querySelector('[contenteditable="true"]');
        if (input) {
            input.value = text + "\\n\\n" + input.value;
            const badge = document.createElement('div');
            badge.style = "position:fixed; top:60px; right:20px; background:#FF0055; color:black; padding:5px 10px; border-radius:5px; font-weight:bold; z-index:9999;";
            badge.innerText = "✅ PRD Injecté : " + name;
            document.body.appendChild(badge);
            setTimeout(() => badge.remove(), 4000);
        } else {
            alert("Veuillez cliquer dans la zone de texte de l'IA d'abord !");
        }
    }

    function createMenu() {
        if(document.getElementById('prd_layout_bento-menu')) return;
        
        const menu = document.createElement('div');
        menu.id = 'prd_layout_bento-menu';
        menu.style = "position:fixed; bottom:20px; right:20px; background:rgba(10,15,25,0.9); border:1px solid #FF0055; padding:15px; border-radius:10px; z-index:999999; color:white; font-family:sans-serif; width: 250px; max-height: 400px; overflow-y: auto;";
        
        menu.innerHTML = \`
            <h3 style="margin-top:0; font-size:14px; color:#FF0055;">📦 Layout Bento</h3>
            <button id="btn-prd-prd_layout_bento-0" style="display:block; width:100%; margin-bottom:5px; padding:8px; background:#112; border:1px solid #FF0055; color:#FF0055; cursor:pointer; border-radius:5px;">🚀 prd_layout_bento</button>
        \`;
        
        document.body.appendChild(menu);
        document.getElementById('btn-prd-prd_layout_bento-0').onclick = () => injectText(PRDS.prd_layout_bento, 'prd_layout_bento');
    }

    setTimeout(createMenu, 3000);
})();
