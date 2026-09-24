> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en SaaS B2B, Pricing Logic et Product Marketing.
> Ce document est le PRD (Product Requirements Document) du **PACK LANDING SAAS SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface de Vente B2B Technologique (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 🚀 PACK LANDING SAAS (Produits B2B)

Ce pack force la création des pages complexes nécessaires à la vente d'un logiciel par abonnement (SaaS). Contrairement au pack Landing générique, ici on explique de la technologie, de la tarification et de la sécurité.

---

## 🎯 1. Les Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les briques (Missions) que tu peux générer :

### 💎 1. Early SaaS (`prd_landing_saas_early`)
**Mission :** Landing SaaS ultra épurée pour early B2B.
**Design Requis :** Screenshot massif du logiciel (App Mockup) incliné en perspective 3D au centre de l'écran.

### 🏢 2. Enterprise SaaS (`prd_landing_saas_enterprise`)
**Mission :** Landing SaaS orientée grands comptes/enterprise.
**Design Requis :** Design très sérieux, beaucoup de blanc, bouton "Contacter les Ventes" (Contact Sales) plutôt que "S'inscrire".

### 🏥 3. Vertical SaaS (`prd_landing_saas_vertical`)
**Mission :** Landing SaaS pour un vertical (santé, éducation, finance).
**Design Requis :** Utilisation de l'iconographie et des couleurs propres à l'industrie cible.

### 🧭 4. Product Tour (`prd_landing_saas_product_tour`)
**Mission :** Landing centrée sur un “product tour” guidé.
**Design Requis :** Stepper vertical sur le côté, l'image centrale change (vidéo ou gif) lorsqu'on scrolle (Scroll-spy).

### 🛡️ 5. Page Sécurité (`prd_landing_saas_security`)
**Mission :** Page “Sécurité” dédiée (SOC2, RGPD, pratiques).
**Design Requis :** Boucliers géants, liste des certifications de conformité, logos des Data Centers.

### 💳 6. Page Pricing (`prd_landing_saas_pricing`)
**Mission :** Page Pricing complète avec FAQ et modales.
**Design Requis :** Switcher (Mensuel / Annuel avec badge "Économisez 20%"). 3 colonnes de prix, celle du milieu (Pro) est mise en valeur (Bordure brillante).

### 🗣️ 7. Customer Stories (`prd_landing_saas_customers`)
**Mission :** Page “Customer Stories” / études de cas.
**Design Requis :** Cartes de citations (Quotes) avec le logo de l'entreprise cliente et le visage du CEO.

### 🔌 8. Intégrations (`prd_landing_saas_integrations`)
**Mission :** Page listant toutes les intégrations.
**Design Requis :** Grille infinie de logos (Slack, Jira, Github) connectés par des lignes au logo du SaaS.

### 💻 9. Landing API (Dev-first) (`prd_landing_saas_api`)
**Mission :** Landing pour l’API (dev-first).
**Design Requis :** Mode sombre, bloc de code (Syntax highlighting) montrant un `curl` facile à copier.

### 🤝 10. Partenaires (`prd_landing_saas_partners`)
**Mission :** Landing “Partenaires / Resellers”.
**Design Requis :** Formulaire de candidature pour les agences, calculatrice de commissions.

---

## 🎨 2. Vision UI/UX & Design System SaaS
* **Directives pour Stitch :** Les Landing Pages SaaS doivent respirer la modernité (Linear, Vercel, Stripe). Utilise des "Glows" subtils, des bordures semi-transparentes (`border-white/10`) et des fonds radiaux (Radial Gradients).

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi un site pour mon logiciel B2B", fusionne `prd_landing_saas_early` et `prd_landing_saas_pricing`.*

[INSTRUCTION IA]
Génère une architecture Marketing SaaS :
- Composants "Pricing Table" interactifs.
- Animation de l'interface du logiciel (App Mockup) pour la rendre vivante.
- Call to Action stricts avec double choix (S'inscrire / Voir la démo).

[STRUCTURE REQUISE]
- `src/features/saas-landing/pages/HomeSaaS.tsx`
- `src/features/saas-landing/pages/PricingPage.tsx`
- `src/features/saas-landing/components/PricingToggle.tsx`
- `src/features/saas-landing/components/ProductMockup.tsx`