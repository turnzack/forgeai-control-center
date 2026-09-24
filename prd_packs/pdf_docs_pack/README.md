> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Traitement Documentaire et Interfaces de Lecture.
> Ce document est le PRD (Product Requirements Document) du **PACK PDF & DOCS SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Fluide et Axée sur la Lecture (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 📄 PACK PDF & DOCS (Viewer & Traitement)

Ce pack force la création d'outils de manipulation et de visualisation de documents lourds (PDFs). L'objectif est d'éviter de faire planter le navigateur tout en offrant des fonctionnalités dignes d'Adobe Acrobat (Zoom, Annotation, Formulaires).

---

## 🎯 1. Les Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les briques (Missions) que tu peux générer :

### 📖 1. Viewer Multipage (`prd_pdf_viewer`)
**Mission :** Viewer PDF multipage (zoom, search).
**Design Requis :** Barre d'outils (Toolbar) en haut avec des boutons Zoom In/Out. Navigation par vignettes latérales (Thumbnails).

### ✍️ 2. Annotateur PDF (`prd_pdf_annotator`)
**Mission :** Annoter PDF (highlights, notes).
**Design Requis :** Mode "Surlignage" (Curseur personnalisé). Sidebar affichant la liste de toutes les annotations avec leur page.

### 📝 3. Formulaires PDF (`prd_pdf_forms`)
**Mission :** Remplir formulaires PDF (AcroForm).
**Design Requis :** Inputs HTML superposés exactement sur les champs du canvas PDF.

### ✂️ 4. Split & Merge (`prd_pdf_split_merge`)
**Mission :** Scinder ou fusionner PDFs.
**Design Requis :** Interface de Glisser-Déposer (Drag and Drop) avec les pages visualisables.

### 🖼️ 5. Export Image (`prd_pdf_export_img`)
**Mission :** Exporter pages → images.
**Design Requis :** Aperçu avec sélecteur de résolution/DPI.

### 🧠 6. Résumé IA PDF (`prd_pdf_ai_summary`)
**Mission :** Résumé IA d’un PDF long.
**Design Requis :** Interface "Chat avec ce PDF". Texte à gauche, Chat à droite.

### ✒️ 7. Signature Numérique (`prd_pdf_signature`)
**Mission :** Signer PDF (signature dessinée ou image).
**Design Requis :** Modale de dessin HTML5 Canvas pour signer avec la souris/doigt.

### ⬛ 8. Caviardage (Redaction) (`prd_pdf_redaction`)
**Mission :** Rendre des zones illisibles (redaction).
**Design Requis :** Outil de sélection rectangulaire dessinant un bloc noir indélébile.

### ⚖️ 9. Comparateur de Versions (`prd_pdf_compare`)
**Mission :** Comparer versions de docs (PDF→texte diff).
**Design Requis :** Vue Split-screen avec surbrillance des ajouts (Vert) et suppressions (Rouge).

### 📑 10. Gestion des Bookmarks (`prd_pdf_bookmarks`)
**Mission :** Gérer bookmarks PDF (chapitres).
**Design Requis :** Sidebar rétractable avec hiérarchie en arbre (Tree view).

---

## 🎨 2. Vision UI/UX & Design System PDF
* **Directives pour Stitch :** Les documents PDF ont généralement un fond blanc. L'interface logicielle (les barres d'outils, la sidebar) DOIT être d'une couleur grise contrastante (ex: `#f3f4f6` ou `#1f2937` en mode sombre) pour que la "feuille de papier" se détache bien au centre.
* **Canvas :** Le rendu PDF se fait généralement via `pdf.js` sur un Canvas. Gérer un squelette de chargement pendant le parsing du binaire.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi un logiciel pour signer des PDFs", fusionne `prd_pdf_viewer` et `prd_pdf_signature`.*

[INSTRUCTION IA]
Génère une architecture de Document Viewer :
- Rendu basé sur `react-pdf` ou l'API native de `pdf.js`.
- Mise en cache (Memoization) des pages rendues pour éviter les re-renders lourds au scroll.
- Virtualisation (ex: `react-window`) si le PDF fait plus de 50 pages.

[STRUCTURE REQUISE]
- `src/features/documents/pages/PdfWorkspace.tsx`
- `src/features/documents/components/PdfCanvas.tsx`
- `src/features/documents/components/Toolbar.tsx`
- `src/features/documents/components/ThumbnailSidebar.tsx`