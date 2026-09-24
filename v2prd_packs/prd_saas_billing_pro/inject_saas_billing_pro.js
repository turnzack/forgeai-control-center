(function() {
    'use strict';
    
    const PRDS = {
        prd_saas_billing_pro: `[CONTEXTE CACHÉ - PRD PRD_SAAS_BILLING_PRO]
MISSION: Générer un portail client sécurisé pour la gestion financière B2B (Abonnements, Factures, Quotas).
STYLE & DESIGN: Transparente et sécurisée. Nuances de gris, textes noirs, icônes de confiance (cadenas, Stripe).
MAPPING VFS: \`BillingPortal.tsx\`, \`CurrentPlanCard.tsx\`, \`InvoiceTable.tsx\`
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
        if(document.getElementById('prd_saas_billing_pro-menu')) return;
        
        const menu = document.createElement('div');
        menu.id = 'prd_saas_billing_pro-menu';
        menu.style = "position:fixed; bottom:20px; right:20px; background:rgba(10,15,25,0.9); border:1px solid #FF0055; padding:15px; border-radius:10px; z-index:999999; color:white; font-family:sans-serif; width: 250px; max-height: 400px; overflow-y: auto;";
        
        menu.innerHTML = \`
            <h3 style="margin-top:0; font-size:14px; color:#FF0055;">📦 SaaS Billing Pro</h3>
            <button id="btn-prd-prd_saas_billing_pro-0" style="display:block; width:100%; margin-bottom:5px; padding:8px; background:#112; border:1px solid #FF0055; color:#FF0055; cursor:pointer; border-radius:5px;">🚀 prd_saas_billing_pro</button>
        \`;
        
        document.body.appendChild(menu);
        document.getElementById('btn-prd-prd_saas_billing_pro-0').onclick = () => injectText(PRDS.prd_saas_billing_pro, 'prd_saas_billing_pro');
    }

    setTimeout(createMenu, 3000);
})();
