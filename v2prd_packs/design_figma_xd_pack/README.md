> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Design Systems et Design Tooling.
> Ce document est le PRD (Product Requirements Document) du **PACK DESIGN FIGMA SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Technique pour Designers (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 📐 PACK DESIGN & FIGMA (Design Tooling)

Ce pack force la création d'outils internes pour les designers ou de ponts entre le Design et le Code (Handoff). L'interface doit être ultra-technique, pixel-perfect, et rappeler les interfaces de Figma ou de Storybook.

---

## 🎯 1. Les Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les briques (Missions) que tu peux générer :

### 🔌 1. Figma Explorer (`prd_design_figma_explorer`)
**Mission :** Connecter un fichier Figma et lister frames.
**Design Requis :** Barre latérale gauche avec l'arbre des calques (Layers), zone centrale affichant les miniatures des frames.

### 🎨 2. Synchronisation Tokens (`prd_design_tokens_sync`)
**Mission :** Synchroniser design tokens Figma ↔ DS.
**Design Requis :** Tableaux comparatifs (Valeur Figma vs Valeur CSS). Grilles de couleurs Hexadécimales.

### 📦 3. Asset Exporter (`prd_design_asset_export`)
**Mission :** Exporter assets (icons, images) depuis Figma.
**Design Requis :** Grille d'icônes avec cases à cocher et un gros bouton "Télécharger ZIP (SVG/PNG)".

### 📐 4. Viewer de Spécifications (`prd_design_specs_viewer`)
**Mission :** Viewer specs design → dev (spacing, sizes).
**Design Requis :** Composant au centre avec des lignes de cotes rouges (Redlines) affichant les marges et paddings (ex: `16px`).

### 🗺️ 5. Flow Viewer (`prd_design_flow_viewer`)
**Mission :** Représenter le flow (frames reliées).
**Design Requis :** Vue macro (Node-based) avec des flèches connectant les écrans.

### 🧩 6. Component Matcher (`prd_design_component_match`)
**Mission :** Matcher composants DS ↔ composants design.
**Design Requis :** Split screen : À gauche l'image statique Figma, à droite le composant React interactif pour trouver les différences (Visual Regression).

### 🖍️ 7. Annotations (Redlines) (`prd_design_annotations`)
**Mission :** Annoter maquettes (redlines).
**Design Requis :** Outil de pose de "Pins" (Marqueurs) sur l'image pour laisser des commentaires.

### 🗃️ 8. Dev Handoff Pack (`prd_design_handoff`)
**Mission :** Pack "hand-off" dev (zips, docs, liens).
**Design Requis :** Dashboard listant les ressources prêtes pour l'intégration, avec les variables CSS générées prêtes à être copiées.

### ⏳ 9. Historique de Design (`prd_design_history`)
**Mission :** Historique changements design.
**Design Requis :** Timeline verticale listant les versions (V1, V2) avec les notes de publication (Release notes) du designer.

---

## 🎨 2. Vision UI/UX & Design System Design Tools
* **Directives pour Stitch :** Les outils pour designers doivent être sombres (Dark Mode) avec des touches de couleurs néon (Bleu Figma, Rose). Les bordures doivent être très fines (`border-zinc-800`), et les icônes doivent être des icônes filaires (Outline).

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi un outil pour inspecter mes designs", déploie l'architecture Handoff.*

[INSTRUCTION IA]
Génère une architecture de Design Tooling :
- Panneaux redimensionnables et rétractables (Split-panes).
- Vues techniques (Affichage brut des valeurs CSS, couleurs, ombres).
- Composants de Zoom/Pan (Pan & Zoom) pour naviguer dans des toiles infinies (Canvas).

[STRUCTURE REQUISE]
- `src/features/handoff/pages/DesignInspector.tsx`
- `src/features/handoff/components/TokenTable.tsx`
- `src/features/handoff/components/RedlineViewer.tsx`