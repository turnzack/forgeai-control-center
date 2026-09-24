> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Éditeurs Texte, Parsers et Expériences Développeur (DX).
> Ce document est le PRD (Product Requirements Document) du **PACK MARKDOWN SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Technique, Propre et Typographiquement Parfaite (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# ✍️ PACK MARKDOWN (Éditeurs & Moteurs de Rendu)

Ce pack force la création d'interfaces centrées autour du langage Markdown (façon Obsidian, Github ou StackOverflow). La coloration syntaxique, les split-screens et la preview en direct sont les rois de ce domaine.

---

## 🎯 1. Les Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les briques (Missions) que tu peux générer :

### 📂 1. Explorateur MD (`prd_markdown_browser`)
**Mission :** Liste de fichiers .md avec preview.
**Design Requis :** Sidebar listant les fichiers (File Tree), volet droit affichant le contenu Markdown rendu.

### 👁️ 2. Live Preview Editor (`prd_markdown_live_editor`)
**Mission :** Éditeur Markdown + preview live.
**Design Requis :** Split screen (50/50). Éditeur brut (Monospace) à gauche, Rendu HTML parfait à droite. Scroll synchronisé entre les deux volets.

### ⚙️ 3. Éditeur Frontmatter (`prd_markdown_frontmatter`)
**Mission :** UI pour modifier frontmatter (YAML).
**Design Requis :** Formulaire visuel en haut (Titre, Auteur, Tags) qui met à jour le bloc `---` YAML du fichier Markdown.

### 🗺️ 4. Outline Généré (`prd_markdown_outline`)
**Mission :** Générer outline (H1-H6) pour navigation.
**Design Requis :** Sidebar latérale de navigation de page (Table of Contents). Les éléments se surlignent au scroll.

### ✂️ 5. Bibliothèque de Snippets (`prd_markdown_snippets`)
**Mission :** Bibliothèque de snippets MD (FAQ, callout…).
**Design Requis :** Modal flottante pour insérer rapidement des blocs complexes (Tableaux, Alertes).

### 📄 6. Export PDF (`prd_markdown_pdf_export`)
**Mission :** Export markdown → PDF stylé.
**Design Requis :** Outil de prévisualisation format "Print" (Page A4 blanche centree).

### 🤖 7. IA Rewriter (`prd_markdown_ai_rewrite`)
**Mission :** Réécriture IA (ton, longueur) de sections MD.
**Design Requis :** Bouton flottant apparaissant au-dessus d'une sélection de texte, avec un menu "Améliorer, Raccourcir, Allonger".

### 🔗 8. Link Checker (`prd_markdown_link_checker`)
**Mission :** Vérifier liens internes/externes.
**Design Requis :** Soulignement rouge des liens cassés dans l'éditeur.

### 📊 9. Support Mermaid (`prd_markdown_mermaid`)
**Mission :** Support Mermaid/diagrams intégrés.
**Design Requis :** Rendu SVG en direct des blocs de code de type `mermaid`.

### 📚 10. Templates Techniques (`prd_markdown_templates`)
**Mission :** Pack de templates MD (PRD, RFC, ADR).
**Design Requis :** Galerie de démarrage offrant des structures pré-remplies.

---

## 🎨 2. Vision UI/UX & Design System Markdown
* **Directives pour Stitch :** Les éditeurs Markdown sont des outils pour développeurs. Le Dark Mode (ex: Thème One Dark ou Dracula) est vital. 
* **Typographie :** Combine une police Monospace stricte (Fira Code, JetBrains Mono) pour l'édition, avec une police très lisible (Inter, Roboto) pour le rendu.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi un éditeur Markdown avec prévisualisation", utilise le module `prd_markdown_live_editor`.*

[INSTRUCTION IA]
Génère une architecture d'Édition Markdown :
- Utilisation de `react-markdown`, `remark`, et `rehype` pour un rendu sécurisé.
- Intégration de `react-syntax-highlighter` pour les blocs de code.
- Layout scindé (Split pane) permettant le redimensionnement par l'utilisateur.

[STRUCTURE REQUISE]
- `src/features/markdown/pages/MarkdownStudio.tsx`
- `src/features/markdown/components/RawEditor.tsx`
- `src/features/markdown/components/RichPreview.tsx`
- `src/features/markdown/components/TableOfContents.tsx`