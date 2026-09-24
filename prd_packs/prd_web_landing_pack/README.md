> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Conversion, Marketing et SEO.
> Ce document est le PRD (Product Requirements Document) du **PACK WEB LANDING (GOLD)**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Visionnaire, Moderne et Ultra-Optimisée (UI/UX)** capable de maximiser le taux de conversion, tout en respectant strictement les règles métier ci-dessous.

# 🚀 PACK WEB LANDING (Édition Gold)

Ce pack force la création de "Landing Pages" (Pages d'atterrissage) de très haute volée, pensées pour lancer un produit SaaS, une application ou un service. L'objectif est simple : Convaincre l'utilisateur en moins de 10 secondes grâce à un impact visuel massif.

---

## 🎯 1. La Mission Principale (Landing Gold)

**Mission :** Créer une landing page à fort impact visuel, optimisée pour la conversion et le SEO.
L'application générée ne doit pas ressembler à un template gratuit, mais au site web d'une startup californienne (type Stripe, Vercel ou Linear).

### 🧩 Sections Architecturales Requises :
L'interface doit être segmentée de haut en bas avec ces sections :
1. **Hero Section :** Un titre massif, un sous-titre clair, et un CTA (Call to Action) principal avec un effet visuel fort (ex: bouton néon ou gradient).
2. **Social Proof (Trusted By) :** Une ligne de logos d'entreprises clientes en nuances de gris ou avec une faible opacité.
3. **Features Grid (Bento Box) :** Une grille asymétrique ou des cartes modernes présentant les fonctionnalités clés avec des icônes.
4. **Testimonials (Avis) :** Un carrousel ou une grille d'avis clients pour asseoir la légitimité.
5. **Pricing (Tarifs) :** Des cartes de prix claires avec la carte "Pro" mise en valeur (mise en avant, ombre portée).
6. **FAQ :** Un accordéon propre et fluide pour répondre aux dernières objections avant l'achat.

---

## 🎨 2. Vision UI/UX & Design System Global
* **Directives pour Stitch :** Les Landing Pages modernes respirent l'espace. Utilise des marges généreuses (`py-24` ou `py-32` entre les sections). 
* **Animations :** Implémente obligatoirement `framer-motion` pour que les sections apparaissent doucement au scroll (Fade-in up).
* **Typographie :** Utilise `Inter` pour le texte courant et `Space Grotesk` (ou équivalent géométrique/moderne) pour les très gros titres (H1).
* **Performances & Responsive :** L'approche **Mobile-First** est OBLIGATOIRE. Toutes les images doivent être optimisées et les grilles doivent passer proprement sur une seule colonne sur smartphone.

## ⚙️ 3. Directives de Câblage (VFS)
**Composants React obligatoires à implémenter :**
- `Hero.tsx`
- `Features.tsx`
- `Pricing.tsx`
- `NeonButton.tsx`
- `GlassCard.tsx` (pour un effet Glassmorphism subtil sur les cartes)

*Chacun de ces composants doit être modulaire, typé (TypeScript), et utiliser TailwindCSS pour le style.*

---
### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Lorsque l'utilisateur demandera "Crée moi la landing page pour mon nouveau service d'audit de code IA", tu devras utiliser ce PRD "Gold" comme base structurelle inébranlable. Tu adapteras les textes (copywriting), les couleurs, et les icônes au domaine de l'IA, mais tu conserveras scrupuleusement la structure Hero > Social Proof > Features > Pricing pour garantir le succès du site.*