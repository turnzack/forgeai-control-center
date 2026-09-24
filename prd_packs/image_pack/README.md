> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Traitement d'Images, Asset Management et UIs Visuelles.
> Ce document est le PRD (Product Requirements Document) du **PACK IMAGE SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Magnifique, Visuelle et Performante (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 📸 PACK IMAGE (Traitement & Galerie)

Ce pack force la création d'outils de gestion et d'édition d'images (façon Google Photos, Pinterest ou Figma). La performance du chargement des images (Lazy loading, WebP) est la priorité absolue.

---

## 🎯 1. Les Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les briques (Missions) que tu peux générer :

### 🖼️ 1. Image Browser (`prd_img_browser`)
**Mission :** Browser d’images (thumbnails, lightbox).
**Design Requis :** Grille Masonry, clic pour ouvrir en plein écran (Lightbox immersive avec fond noir).

### ✂️ 2. Upload & Crop (`prd_img_cropper`)
**Mission :** Upload avec crop/resize ratio (avatar, cover).
**Design Requis :** Fenêtre modale avec zone de sélection ajustable pour recadrer la photo.

### ℹ️ 3. Afficheur EXIF (`prd_img_exif_viewer`)
**Mission :** Affiche EXIF, taille, format, couleur dominante.
**Design Requis :** Sidebar détaillée listant les métadonnées (Appareil photo, Ouverture, GPS).

### 📉 4. Optimiseur d'Images (`prd_img_optimizer`)
**Mission :** Optimiser poids/format (webp, jpeg) avec preview.
**Design Requis :** Comparatif "Avant/Après" avec slider.

### ♿ 5. Générateur Alt-Text (`prd_img_a11y`)
**Mission :** Générer alt-text IA pour accessibilité.
**Design Requis :** Interface d'audit affichant un "Warning" si l'image n'a pas d'attribut `alt`.

### 🕹️ 6. Sprite Sheets (`prd_img_sprite_sheet`)
**Mission :** Construire sprite sheets à partir d’images.
**Design Requis :** Grille d'assemblage technique (GameDev).

### 🎨 7. Extracteur de Palette (`prd_img_color_palette`)
**Mission :** Extraire palette de couleurs d’une image.
**Design Requis :** Affichage de l'image avec 5 à 10 ronds de couleurs prédominantes (Hex/RGB).

### 🏷️ 8. Annotation d'Images (`prd_img_annotator`)
**Mission :** Annoter images (rectangles, labels).
**Design Requis :** Outil de dessin basique (Bounding boxes) sur l'image Canvas.

### 📦 9. Asset Packs (`prd_img_asset_manager`)
**Mission :** Créer "asset packs" (icônes, UI kit).
**Design Requis :** Gestionnaire de fichiers (Dossiers) pour designers.

### ⚖️ 10. Comparateur A/B (`prd_img_compare_slider`)
**Mission :** Comparer deux images (A/B, slider).
**Design Requis :** Un slider vertical ou horizontal qu'on glisse pour voir l'image A ou B.

---

## 🎨 2. Vision UI/UX & Design System Image
* **Directives pour Stitch :** Les interfaces de gestion d'image doivent utiliser des thèmes neutres (Gris clair ou Noir pur) pour ne pas fausser la perception des couleurs des photos.
* **Performances :** Toujours utiliser des balises `<img>` avec `loading="lazy"` et préparer des Skeletons (Boiîtes grises pulsantes) pendant le chargement.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi un Pinterest-like", utilise `prd_img_browser` avec un layout Masonry.*

[INSTRUCTION IA]
Génère une architecture logicielle d'Image Management :
- Composants de "Lazy Loading" (ex: Intersection Observer) pour les grilles d'images.
- Outils d'édition basés sur HTML5 Canvas.
- Utilisation de `FileReader` pour la prévisualisation immédiate des uploads côté client.

[STRUCTURE REQUISE]
- `src/features/images/pages/GalleryPage.tsx`
- `src/features/images/components/MasonryGrid.tsx`
- `src/features/images/components/ImageLightbox.tsx`
- `src/features/images/components/ImageCropper.tsx`
- `src/features/images/hooks/useImageUpload.ts`