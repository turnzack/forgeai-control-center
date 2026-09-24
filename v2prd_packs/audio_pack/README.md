> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé dans les applications et interfaces Médias/Audio. 
> Ce document est le PRD (Product Requirements Document) du **PACK AUDIO SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Visionnaire, Moderne et Ultra-Optimisée (UI/UX)** pour manipuler, écouter et éditer de l'audio dans le navigateur, tout en respectant strictement les règles métier ci-dessous.

# 🎵 PACK AUDIO (L'Écosystème Sonore Avancé)

Ce pack force la création de composants audio complexes, allant du simple lecteur de podcast à un éditeur de formes d'ondes (waveform) professionnel directement dans le navigateur. L'application générée ne doit pas être un simple prototype, mais un produit prêt pour la production (Production-Ready), pensé pour la fluidité (Zéro latence) et l'ergonomie.

---

## 🎯 1. Les 10 Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les 10 briques métiers (Missions) que tu peux câbler et générer :

### 🎧 1. Librairie Audio (`prd_audio_file_library`)
**Mission :** Créer un gestionnaire de bibliothèque audio (pistes musicales, podcasts).
**Design Requis :** Liste épurée avec mini-visualisation des formes d'ondes (waveform mini) par piste.
**Composants à générer :** `AudioLibrary.tsx`, `TrackRow.tsx`

### 🎙️ 2. Lecteur de Podcast (`prd_audio_player_podcast`)
**Mission :** Lecteur audio avancé de type Apple Podcasts ou Spotify.
**Design Requis :** Contrôle de vitesse (1x, 1.5x, 2x), boutons de saut (+15s, -15s), et gestion des chapitres.
**Composants à générer :** `PodcastPlayer.tsx`, `ChapterMarkers.tsx`

### ✂️ 3. Éditeur Waveform (`prd_audio_waveform_editor`)
**Mission :** Outil de découpe et d'annotation de fichiers audio.
**Design Requis :** Forme d'onde interactive de grande taille permettant la sélection précise (drag to select) et l'ajout de marqueurs visuels.
**Composants à générer :** `WaveformEditor.tsx`, `WaveMarker.tsx`

### 🔴 4. Enregistreur Audio (`prd_audio_recording_widget`)
**Mission :** Enregistrement vocal via le microphone depuis le navigateur (MediaRecorder API).
**Design Requis :** Un "Big record button" façon dictaphone iOS, avec retour visuel du statut d'enregistrement.
**Composants à générer :** `AudioRecorder.tsx`, `RecordingStatus.tsx`

### 📝 5. Visionneuse de Transcription (`prd_audio_transcript_viewer`)
**Mission :** Afficher et éditer du texte synchronisé avec l'audio (façon YouTube Transcript ou Descript).
**Design Requis :** Texte avec liens temporels (time links) qui clignotent ou se surlignent pendant la lecture.
**Composants à générer :** `TranscriptView.tsx`, `WordHighlight.tsx`

### 🤖 6. Transcription IA (`prd_audio_ai_transcribe`)
**Mission :** Interface de traitement pour convertir un fichier audio en texte via l'intelligence artificielle (ex: Whisper).
**Design Requis :** Suivi de l'état des tâches (Job status) avec barres de progression, et éditeur de segments de texte.
**Composants à générer :** `TranscriptionJobList.tsx`, `SegmentEditor.tsx`

### 🎛️ 7. Soundboard (`prd_audio_soundboard_pack`)
**Mission :** Pack de sons interactif (Boîte à sons).
**Design Requis :** Grille de gros boutons tactiles avec animations au clic (Buttons grid).
**Composants à générer :** `SoundboardGrid.tsx`, `SoundButton.tsx`

### 🏷️ 8. Éditeur de Métadonnées (ID3) (`prd_audio_metadata_editor`)
**Mission :** Modifier les tags des fichiers audio (Titre, Artiste, Album, Pochette).
**Design Requis :** Formulaire épuré avec prévisualisation en temps réel de la pochette (Cover preview).
**Composants à générer :** `AudioMetaForm.tsx`, `CoverPreview.tsx`

### 🎶 9. Créateur de Playlist Mixte (`prd_audio_mix_playlist`)
**Mission :** Construire des listes de lecture multi-fichiers.
**Design Requis :** Liste avec fonction "Drag and Drop" (List reorder drag) pour réorganiser facilement les morceaux.
**Composants à générer :** `AudioPlaylistEditor.tsx`

### 💬 10. Snippets Audio Commentables (`prd_audio_commentable_snippets`)
**Mission :** Partager un extrait précis d'un fichier audio (ex: de 1:20 à 1:45) et permettre aux utilisateurs de laisser des commentaires.
**Design Requis :** Aperçu Waveform réduit avec des points de discussion superposés sur le temps.
**Composants à générer :** `AudioSnippet.tsx`, `SnippetCommentList.tsx`

---

## 🎨 2. Vision UI/UX & Design System Global pour l'Audio
* **Directives pour Stitch :** Le design d'une application audio doit être vivant. Utilise des micro-animations (Framer Motion) sur les boutons play/pause, des effets de brillance ou de néon (Glassmorphism sur les contrôleurs de volume), et assure-toi que l'interface crie "Premium" (à l'image des interfaces de Teenage Engineering ou Spotify).
* **Navigation :** Si l'application regroupe plusieurs modules, prévois toujours un *Bottom Audio Player* persistant en bas de l'écran qui ne s'interrompt pas pendant la navigation.

## ⚙️ 3. Directives de Câblage (VFS)
*Chacun des composants listés plus haut doit être modulaire, typé (TypeScript), et utiliser TailwindCSS pour le style. Utilise les API Web standard (`AudioContext`, `HTMLAudioElement`, `MediaRecorder`) pour garantir les meilleures performances sans bibliothèques externes lourdes si possible.*

---
### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Lorsque l'utilisateur sélectionnera ce pack "Audio" dans l'interface de Tiger IA, tu dois fusionner ces 10 capacités avec la demande précise du chat. Par exemple, si l'utilisateur demande "Crée moi un clone de Spotify", tu dois immédiatement mobiliser les modules `prd_audio_file_library`, `prd_audio_player_podcast` et `prd_audio_mix_playlist` pour générer une architecture complète en un seul shot.*