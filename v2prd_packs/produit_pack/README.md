> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Product Management et Stratégie Go-To-Market.
> Ce document est le PRD (Product Requirements Document) du **PACK PRODUIT SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Visionnaire, Orientée Marketing Produit (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 💡 PACK PRODUIT (Pages Produit & Fonctionnalités)

Ce pack force la création de Landing Pages très spécifiques au cycle de vie d'un produit logiciel SaaS : Roadmaps, Changelogs, Comparatifs, Lancement de Features. 

---

## 🎯 1. Les Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les briques métiers (Missions) que tu peux câbler et générer :

### 🚀 1. Feature "Hero" (`prd_prod_single_feature`)
**Mission :** Page centrée sur une seule feature "hero".
**Design Requis :** Visuel géant au centre, description détaillée.

### ⚖️ 2. Comparatif Concurrents (`prd_prod_compare_competitors`)
**Mission :** Comparatif produit vs concurrents.
**Design Requis :** Tableau de comparaison (Checkmarks verts, Croix rouges) clair et partial.

### 🎉 3. Lancement de Grosse Feature (`prd_prod_feature_launch`)
**Mission :** Page pour le lancement d'une grosse feature.
**Design Requis :** Vidéo d'introduction, appel à l'action massif.

### 📝 4. Changelogs Publics (`prd_prod_public_changelogs`)
**Mission :** Page publique des changelogs.
**Design Requis :** Frise chronologique épurée par version.

### 🗺️ 5. Roadmap Publique (`prd_prod_public_roadmap`)
**Mission :** Roadmap publique (public roadmap).
**Design Requis :** Colonnes Kanban (Now, Next, Later) ou frise temporelle.

### 🧪 6. Programme Beta (`prd_prod_beta_program`)
**Mission :** Landing pour un programme beta.
**Design Requis :** Accès exclusif, Formulaire d'inscription rapide.

### 🔄 7. Guide de Migration (`prd_prod_migration_guide`)
**Mission :** Page guidant une migration (v1 → v2, ou depuis un autre outil).
**Design Requis :** Étapes pas-à-pas (Stepper UI) rassurantes.

### 💰 8. Comparatif des Plans (`prd_prod_plan_comparison`)
**Mission :** Page comparant en détail les plans.
**Design Requis :** Très long tableau croisant toutes les fonctionnalités par plan tarifaire.

### 👥 9. Solutions par Persona (`prd_prod_solutions_hub`)
**Mission :** Page hub "Solutions par segment/persona" (ex: "Pour les Startups", "Pour les Agences").
**Design Requis :** Grille de cartes thématiques orientant l'utilisateur.

### 🧩 10. Store d'Extensions (`prd_prod_addons_store`)
**Mission :** Mini-store pour add-ons/extensions du produit.
**Design Requis :** Grille façon "App Store" avec icônes et descriptions courtes.

---

## 🎨 2. Vision UI/UX & Design System Produit
* **Directives pour Stitch :** Les pages de présentation produit doivent rassurer. Utilise des gradients subtils, des images de produit (Product mockups) en haute qualité, et des ombres douces. 
* **Animations :** Le défilement de ces pages doit raconter une histoire (Scroll-triggered animations). Utilise des effets de parallaxe légers.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi la page qui annonce les nouveautés de notre logiciel", fusionne `prd_prod_public_changelogs` avec `prd_prod_single_feature`.*

[INSTRUCTION IA]
Génère une interface de Marketing Produit de classe mondiale :
- Typographie percutante (Hero sections).
- Tableaux de comparaison ultra lisibles et responsives.
- Structure sémantique forte pour le SEO.
- Animations de Scroll (Framer Motion : `whileInView`).

[STRUCTURE REQUISE]
- `src/features/marketing/pages/FeatureLaunchPage.tsx`
- `src/features/marketing/pages/ChangelogPage.tsx`
- `src/features/marketing/components/CompareTable.tsx`
- `src/features/marketing/components/RoadmapBoard.tsx`