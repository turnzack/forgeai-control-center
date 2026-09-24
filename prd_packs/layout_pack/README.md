> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Design d'Interface et CSS Avancé.
> Ce document est le PRD (Product Requirements Document) du **PACK LAYOUT SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Visionnaire aux fondations CSS indestructibles (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 📐 PACK LAYOUT (Architectures Visuelles Pures)

Ce pack ne génère pas de fonctionnalité métier, mais force la création des **Squelettes Visuels** (Layouts) les plus complexes et demandés du web moderne.

---

## 🎯 1. Les Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les briques (Missions) que tu peux câbler et générer :

### 🌓 1. Split Screen (`prd_layout_split_screen`)
**Mission :** Écran coupé en deux (ex: Login à gauche, Image à droite).
**Design Requis :** 50/50 parfait sur Desktop, qui s'empile verticalement sur Mobile.

### 🍱 2. Bento Box (`prd_layout_bento`)
**Mission :** Grille "Bento Box" (Style Apple/iOS).
**Design Requis :** Grille CSS (CSS Grid) asymétrique imbriquée, avec des cartes (Cards) aux coins très arrondis. Parfait pour les Dashboards ou les Landing Pages modernes.

### 📋 3. Kanban Board (`prd_layout_kanban`)
**Mission :** Tableau de gestion de projet type Trello/Jira.
**Design Requis :** Flexbox horizontale infinie avec défilement (Scroll X) contenant des colonnes verticales.

### 🗄️ 4. Dashboard avec Sidebar (`prd_layout_dashboard_sidebar`)
**Mission :** Tableau de bord avec menu latéral rétractable.
**Design Requis :** CSS Grid ou Flexbox pour séparer une Sidebar fixe (250px) et une zone de contenu fluide (`flex-1`) qui prend tout l'espace restant.

---

## 🎨 2. Vision UI/UX & Design System Layouts
* **Directives pour Stitch :** Les Layouts doivent être "Bullet-proof" (Indestructibles). Gérer parfaitement l'overflow, les redimensionnements d'écran, et les Safe Areas sur mobile.
* **Responsive Design :** Tous ces layouts doivent avoir un comportement Mobile-First parfaitement réfléchi (ex: la Sidebar devient un menu "Hamburger" ou un "Drawer" glissant sur mobile).

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi une interface façon Apple pour présenter mes compétences", tu DOIS utiliser `prd_layout_bento`. La grille asymétrique dictera la structure de tout le composant généré.*

[INSTRUCTION IA]
Génère une architecture de Layout CSS pur :
- Utilisation experte de TailwindCSS (`grid-cols-`, `span-`, `flex`).
- Gestion parfaite du défilement intérieur sans faire scroller toute la page (quand requis, ex: Kanban).
- Squelette réutilisable (Le composant principal prend un `{children}`).

[STRUCTURE REQUISE]
- `src/shared/layouts/BentoLayout.tsx`
- `src/shared/layouts/SplitLayout.tsx`
- `src/shared/layouts/DashboardLayout.tsx`
- `src/shared/layouts/KanbanLayout.tsx`