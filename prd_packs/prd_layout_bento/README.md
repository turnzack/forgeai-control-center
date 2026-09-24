> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en UI/UX Apple-like et Architectures CSS Grid Asymétriques.
> Ce document est le PRD (Product Requirements Document) du **PACK LAYOUT BENTO SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Apple Bento Visionnaire**, tout en respectant strictement les règles métier ci-dessous.

# 🍱 PACK LAYOUT BENTO (Grille Apple)

Ce pack ne génère pas de métier complexe, mais force la création d'un squelette visuel très précis, devenu le standard du web premium en 2024+ : La Bento Box (inspirée d'Apple).

---

## 🎯 La Mission Principale (Architecture Bento)

**Mission :** Générer une grille asymétrique parfaitement responsive.
Le design doit donner l'impression de "Tuiles" ou de "Widgets" de différentes tailles emboîtés ensemble comme un puzzle parfait.

### 🧩 Core Features Architecturaux Requis :
1. **Grille Maîtresse (CSS Grid) :** Un conteneur parent utilisant `display: grid` avec des colonnes fractionnées (ex: `grid-cols-4` ou `grid-cols-12`).
2. **Cartes Hétérogènes (Bento Cards) :** Différents composants enfants qui s'étendent sur plusieurs lignes ou colonnes (`col-span-2`, `row-span-2`).
3. **Comportement Mobile-First :** En version mobile, la grille doit "casser" élégamment en une seule colonne (`grid-cols-1`) avec toutes les cartes empilées.

---

## 🎨 Vision UI/UX & Design System Bento
* **Directives pour Stitch :** Une grille Bento exige la perfection géométrique. 
    - L'espacement entre les cartes (Gap) doit être rigoureusement identique partout (`gap-4` ou `gap-6`).
    - Le rayon de courbure (Border Radius) doit être très prononcé (`rounded-2xl` ou `rounded-3xl`).
    - L'intérieur des cartes doit utiliser un padding consistant.
* **Fonds de Carte :** Utiliser des fonds clairs (ex: `bg-slate-50` avec une subtile bordure `border-slate-200`) ou des effets de Glassmorphism.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi un Dashboard ou un Portfolio façon Apple", tu DOIS structurer tout le layout avec cette philosophie.*

[INSTRUCTION IA]
Génère une architecture de Layout Bento UI :
- Squelette purement en Tailwind CSS Grid.
- Cartes mockées représentant : Un gros graphique (Large widget), un texte court (Small square), une liste déroulante (Vertical rectangle).
- Utilisation des classes `hover:scale-[1.02] transition-transform` pour donner de la vie au survol.

[STRUCTURE REQUISE]
- `src/shared/layouts/BentoGrid.tsx`
- `src/shared/layouts/BentoCard.tsx`
- `src/features/dashboard/pages/BentoDashboardPage.tsx`