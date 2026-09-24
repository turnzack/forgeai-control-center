> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Streaming Multimédia, Codecs et Interfaces Vidéo.
> Ce document est le PRD (Product Requirements Document) du **PACK VIDÉO SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Fluide, Performante et Immersive (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 🎬 PACK VIDÉO (Traitement & Streaming)

Ce pack force la création d'architectures multimédias (type YouTube, Vimeo, ou Twitch). L'objectif est de gérer la complexité du rendu vidéo (Timeline, Chapters, Upload) sans bloquer le Main Thread du navigateur.

---

## 🎯 1. Les Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les briques (Missions) que tu peux générer :

### 📼 1. Galerie Vidéo (`prd_video_gallery`)
**Mission :** Liste de vidéos avec miniatures.
**Design Requis :** Grille Masonry ou carrousel horizontal. Prévisualisation (Hover-to-play) au survol.

### ▶️ 2. Lecteur Vidéo Avancé (`prd_video_player`)
**Mission :** Lecteur vidéo (chapters, vitesse, subtitles).
**Design Requis :** UI personnalisée par-dessus la balise `<video>`. Barre de progression découpée (Chapters), menu de paramètres pour la qualité (1080p, 4K).

### ☁️ 3. Upload & Transcodage (`prd_video_upload`)
**Mission :** Upload + choix de profil transcodage.
**Design Requis :** Jauge de progression massive (Progress bar), indication du temps restant, et sélection de profil (H.264, WebM).

### 🖼️ 4. Générateur de Miniatures (`prd_video_thumbnails`)
**Mission :** Choisir miniature vidéo (auto + frames).
**Design Requis :** Slider (Timeline) pour choisir une frame spécifique extraite de la vidéo.

### 📝 5. Éditeur de Sous-Titres (`prd_video_subtitles`)
**Mission :** Gérer sous-titres (import/export .srt, edit).
**Design Requis :** Liste des timestamps avec inputs texte synchronisés avec le lecteur vidéo.

### ✂️ 6. Découpeur Vidéo (Trimmer) (`prd_video_trimmer`)
**Mission :** Découper clips vidéo depuis un fichier.
**Design Requis :** Double poignée (Range slider) sur la timeline vidéo.

### 🎥 7. Storyboard (`prd_video_storyboard`)
**Mission :** Storyboard (séquence d’images clés).
**Design Requis :** Grille chronologique d'images extraites automatiquement.

### 🧠 8. Résumé IA Vidéo (`prd_video_ai_summary`)
**Mission :** Résumé IA du contenu d’une vidéo.
**Design Requis :** Accordéon (Collapsible) ou Sidebar affichant les points clés générés.

### 💬 9. Commentaires par Timestamp (`prd_video_timestamp_comments`)
**Mission :** Commentaires liés à des timestamps.
**Design Requis :** Fil de discussion latéral. Un clic sur le timestamp `01:24` fait sauter la vidéo au bon moment.

### 📂 10. Playlists (`prd_video_playlists`)
**Mission :** Créer playlists et ordonner vidéos.
**Design Requis :** Liste verticale avec poignées (Drag and Drop) pour réorganiser.

---

## 🎨 2. Vision UI/UX & Design System Vidéo
* **Directives pour Stitch :** Une interface vidéo doit s'effacer au profit du contenu. Utilise un **Dark Mode strict** (Fonds noirs ou gris très foncés) pour augmenter le contraste de la vidéo.
* **Performances :** Ne jamais utiliser de lourdes animations CSS pendant la lecture vidéo pour éviter la perte de frames (Frame drops).

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi un clone de YouTube pour ma boîte", fusionne `prd_video_gallery`, `prd_video_player` et `prd_video_timestamp_comments`.*

[INSTRUCTION IA]
Génère une architecture d'application Vidéo :
- API HTML5 `<video>` surchargée par des composants React natifs (Custom Controls).
- Utilisation des API `requestAnimationFrame` pour la synchronisation précise de la Timeline.
- Layout de type "Théâtre" (Lecteur massif au centre, liste à droite).

[STRUCTURE REQUISE]
- `src/features/video/components/CustomVideoPlayer.tsx`
- `src/features/video/components/VideoTimeline.tsx`
- `src/features/video/components/TimestampComments.tsx`
- `src/features/video/hooks/useVideoPlayer.ts`