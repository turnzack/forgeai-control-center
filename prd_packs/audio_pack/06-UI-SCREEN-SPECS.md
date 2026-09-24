# UI SCREEN SPECIFICATIONS & AI GENERATION — Audio Pack

## 1. Spécification Écran SCR-001 : /
- **Route** : `/`
- **Objectif** : écran central pour l'expérience **Audio & Podcast Player** dans Audio Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `AudioPlayer`, `WaveformView`, `QueueDrawer`, `PlaylistCard`, `TrackRow`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 2. Spécification Écran SCR-002 : /library
- **Route** : `/library`
- **Objectif** : écran central pour l'expérience **Audio & Podcast Player** dans Audio Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `AudioPlayer`, `WaveformView`, `QueueDrawer`, `PlaylistCard`, `TrackRow`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 3. Spécification Écran SCR-003 : /playlist/:id
- **Route** : `/playlist/:id`
- **Objectif** : écran central pour l'expérience **Audio & Podcast Player** dans Audio Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `AudioPlayer`, `WaveformView`, `QueueDrawer`, `PlaylistCard`, `TrackRow`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 4. Spécification Écran SCR-004 : /track/:id
- **Route** : `/track/:id`
- **Objectif** : écran central pour l'expérience **Audio & Podcast Player** dans Audio Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `AudioPlayer`, `WaveformView`, `QueueDrawer`, `PlaylistCard`, `TrackRow`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).


---

## 5. Prompt Industriel Google Stitch
```text
# STITCH PROMPT — Audio Pack

Contexte produit :
Audio Pack - Lecteur audio polyvalent avec playlists dans le domaine Audio & Podcast Player.

Objectif :
Offrir une interface complète, spécialisée et authentique permettant aux utilisateurs de réaliser leurs tâches métier.

Layout :
- Shell applicatif moderne avec navigation contextuelle.
- Section de statistiques ou de contenu principal selon l'écran.
- Grille de cartes réactives ou table moderne avec pagination.

Composants obligatoires :
AudioPlayer, WaveformView, QueueDrawer, PlaylistCard, TrackRow, Uploader, MiniPlayer.

Style visuel :
- Palette : Fond #0F0F0F, primaire #F97316, accent #EF4444.
- Typographie : Inter.
- Moderne, immersive, orange vibrante. Sans-serif (Inter), fond sombre préférable (#0F0F0F) pour la lecture nocturne, accents orange (#F97316). Waveform en gradient orange→rouge. Player en glassmorphism avec blur. Animations fluides sur les transitions de piste.

Contraintes :
- Zéro lorem ipsum, libellés explicites en français.
- Conformité WCAG AA.
- Responsive mobile-first.
```

---

## 6. Prompt Industriel Gemini 3.1 (Nano Banana Pro / Imagen 4)
```text
Génère une illustration haute fidélité pour l'onboarding de Audio Pack.

Contexte produit :
Application Audio & Podcast Player moderne, élégante et professionnelle.

Sujet :
Métaphore visuelle représentant Track et l'interaction utilisateur dans le domaine Audio & Podcast Player.

Style :
Rendu 3D isométrique épuré ou illustration vectorielle haut de gamme, sans surcharge.

Palette :
Dominante #F97316, accents #EF4444, reflets doux sur fond #0F0F0F.

Format :
16:9 pour intégration en bannière d'accueil.

Contraintes :
- Pas de texte incrusté, pas de watermark.
- Respect rigoureux des codes du design system.
- Cohérence avec l'un visuel du domaine Audio & Podcast Player.
```
