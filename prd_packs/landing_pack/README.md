> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Acquisition Client et Optimisation du Taux de Conversion (CRO).
> Ce document est le PRD (Product Requirements Document) du **PACK LANDING SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface de Vente Agressive (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 🛬 PACK LANDING (Pages de Vente Génériques)

Ce pack force la création de "One-Pagers". L'objectif unique est de transformer le visiteur en prospect (Email) ou en client (Paiement) dès les premières secondes.

---

## 🎯 1. Les Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les briques (Missions) que tu peux générer :

### ⏳ 1. Coming Soon (Waitlist) (`prd_landing_coming_soon`)
**Mission :** Capturer des emails avant un lancement (Coming Soon).
**Design Requis :** Visuel central très flou/mystérieux. Titre gigantesque. Champ Email massif collé au bouton "Rejoindre la liste d'attente".

### 🏢 2. B2B Corporate (`prd_landing_b2b_corp`)
**Mission :** Convertir des visiteurs B2B.
**Design Requis :** Bannière des "Logos de confiance" (Trust logos : Stripe, Google, etc.) affichée juste sous la première section (Above the fold).

### 👤 3. Créateur Linktree (`prd_landing_creator_linktree`)
**Mission :** Linktree/Portfolio pour créateur de contenu.
**Design Requis :** Page centrée, très étroite (Mobile design sur Desktop), pile de boutons.

---

## 🎨 2. Vision UI/UX & Design System Landing
* **Directives pour Stitch :** Les Landing Pages doivent être sectionnées de manière très contrastée (Exemple: Section 1 fond Blanc, Section 2 fond Noir, Section 3 fond Gris clair). Cela maintient l'attention lors du défilement.
* **Le Hero Banner :** Le premier écran doit avoir un H1 explosif, un sous-titre rassurant, et un CTA (Call to Action) principal.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*À utiliser quand la demande est générique, ex: "Crée une page de présentation de mon activité".*

[INSTRUCTION IA]
Génère une architecture de Landing Page :
- Composants Section avec padding généreux (ex: `py-24`).
- Boutons CTA utilisant des gradients et des ombres portées intenses (Shadow-xl) pour inciter au clic.
- Animation Fade-In Up au défilement (Scroll reveal) via Framer Motion.

[STRUCTURE REQUISE]
- `src/features/landing/pages/GenericLanding.tsx`
- `src/features/landing/components/HeroSection.tsx`
- `src/features/landing/components/FeatureGrid.tsx`
- `src/features/landing/components/FooterCTA.tsx`