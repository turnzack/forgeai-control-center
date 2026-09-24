# UI SCREEN SPECIFICATIONS & AI GENERATION — Video Pack

## 1. Spécification Écran SCR-001 : /
- **Route** : `/`
- **Objectif** : écran central pour l'expérience **Vidéo & Streaming** dans Video Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `VideoPlayer`, `ChapterList`, `LiveChat`, `CommentSection`, `QualitySelector`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 2. Spécification Écran SCR-002 : /watch/:id
- **Route** : `/watch/:id`
- **Objectif** : écran central pour l'expérience **Vidéo & Streaming** dans Video Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `VideoPlayer`, `ChapterList`, `LiveChat`, `CommentSection`, `QualitySelector`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 3. Spécification Écran SCR-003 : /channel/:username
- **Route** : `/channel/:username`
- **Objectif** : écran central pour l'expérience **Vidéo & Streaming** dans Video Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `VideoPlayer`, `ChapterList`, `LiveChat`, `CommentSection`, `QualitySelector`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 4. Spécification Écran SCR-004 : /upload
- **Route** : `/upload`
- **Objectif** : écran central pour l'expérience **Vidéo & Streaming** dans Video Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `VideoPlayer`, `ChapterList`, `LiveChat`, `CommentSection`, `QualitySelector`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).


---

## 5. Prompt Industriel Google Stitch
```text
# STITCH PROMPT — Video Pack

Contexte produit :
Video Pack - Plateforme vidéo avec chapitres et chat dans le domaine Vidéo & Streaming.

Objectif :
Offrir une interface complète, spécialisée et authentique permettant aux utilisateurs de réaliser leurs tâches métier.

Layout :
- Shell applicatif moderne avec navigation contextuelle.
- Section de statistiques ou de contenu principal selon l'écran.
- Grille de cartes réactives ou table moderne avec pagination.

Composants obligatoires :
VideoPlayer, ChapterList, LiveChat, CommentSection, QualitySelector, VideoCard, UpNextPanel.

Style visuel :
- Palette : Fond #0A0A0A, primaire #DC2626, accent #F59E0B.
- Typographie : Inter.
- Dark mode par défaut, focus sur la vidéo. Sans-serif (Inter), fond noir (#0A0A0A), accents rouge (#DC2626) pour le live et les CTAs. Lecteur cinématique en 16:9 avec contrôles qui fade-out après 3s. Sidebar chat à droite, commentaires en dessous. Cards vidéo avec hover preview animé.

Contraintes :
- Zéro lorem ipsum, libellés explicites en français.
- Conformité WCAG AA.
- Responsive mobile-first.
```

---

## 6. Prompt Industriel Gemini 3.1 (Nano Banana Pro / Imagen 4)
```text
Génère une illustration haute fidélité pour l'onboarding de Video Pack.

Contexte produit :
Application Vidéo & Streaming moderne, élégante et professionnelle.

Sujet :
Métaphore visuelle représentant Video et l'interaction utilisateur dans le domaine Vidéo & Streaming.

Style :
Rendu 3D isométrique épuré ou illustration vectorielle haut de gamme, sans surcharge.

Palette :
Dominante #DC2626, accents #F59E0B, reflets doux sur fond #0A0A0A.

Format :
16:9 pour intégration en bannière d'accueil.

Contraintes :
- Pas de texte incrusté, pas de watermark.
- Respect rigoureux des codes du design system.
- Cohérence avec l'un visuel du domaine Vidéo & Streaming.
```
