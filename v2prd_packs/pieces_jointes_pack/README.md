> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Gestion de Fichiers, Uploads et Systèmes Cloud.
> Ce document est le PRD (Product Requirements Document) du **PACK PIÈCES JOINTES SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface de Transfert Impeccable (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 📎 PACK PIÈCES JOINTES (Upload & Fichiers)

Ce pack force la création d'interfaces de dépôt de fichiers sans friction (façon WeTransfer ou Dropbox). La robustesse, les feedbacks visuels de progression et la gestion des erreurs sont primordiaux.

---

## 🎯 1. Les Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici la brique (Mission) principale que tu peux générer :

### ☁️ 1. File Uploader Universel (`prd_attachments_uploader`)
**Mission :** Interface d'upload de fichiers (Drag & Drop, Preview).
**Design Requis :** Large zone pointillée (Dropzone) qui change de couleur (Highlight) lorsqu'un fichier survole l'écran. Liste des fichiers uploadés en dessous avec barres de progression individuelles.

---

## 🎨 2. Vision UI/UX & Design System Fichiers
* **Directives pour Stitch :** Le design d'un Uploader doit crier "Déposez vos fichiers ici". Utilise une icône massive (ex: un nuage ou une flèche vers le haut) et un texte incitatif.
* **Feedbacks Visuels :** Affiche la taille du fichier (ex: `2.4 MB`), l'extension formatée avec un badge coloré (PDF en rouge, DOCX en bleu), et un bouton "Annuler/Corbeille" toujours accessible.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Ajoute un système pour joindre des fichiers à mes tâches", tu dois utiliser `prd_attachments_uploader` et l'intégrer proprement sous le formulaire.*

[INSTRUCTION IA]
Génère une architecture de Gestion de Fichiers :
- Utilisation de `react-dropzone` pour gérer finement le glisser-déposer.
- Limite de taille de fichier côté client (File Size Validation).
- Prévisualisation (Blob URL) immédiate pour les images avant l'upload.
- États : Idle, DragActive, Uploading (avec pourcentages), Success, Error.

[STRUCTURE REQUISE]
- `src/shared/components/files/FileDropzone.tsx`
- `src/shared/components/files/FileProgressList.tsx`
- `src/shared/components/files/FilePreviewIcon.tsx`
- `src/shared/hooks/useFileUpload.ts`