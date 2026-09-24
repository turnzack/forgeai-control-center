# UI SCREEN SPECIFICATIONS & AI GENERATION — Local Maps Pack

## 1. Spécification Écran SCR-001 : /
- **Route** : `/`
- **Objectif** : écran central pour l'expérience **Cartographie & Géolocalisation** dans Local Maps Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `MapView`, `MarkerPopup`, `SearchBar`, `RoutePanel`, `FavoritesSidebar`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 2. Spécification Écran SCR-002 : /map
- **Route** : `/map`
- **Objectif** : écran central pour l'expérience **Cartographie & Géolocalisation** dans Local Maps Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `MapView`, `MarkerPopup`, `SearchBar`, `RoutePanel`, `FavoritesSidebar`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 3. Spécification Écran SCR-003 : /place/:id
- **Route** : `/place/:id`
- **Objectif** : écran central pour l'expérience **Cartographie & Géolocalisation** dans Local Maps Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `MapView`, `MarkerPopup`, `SearchBar`, `RoutePanel`, `FavoritesSidebar`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 4. Spécification Écran SCR-004 : /route
- **Route** : `/route`
- **Objectif** : écran central pour l'expérience **Cartographie & Géolocalisation** dans Local Maps Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `MapView`, `MarkerPopup`, `SearchBar`, `RoutePanel`, `FavoritesSidebar`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).


---

## 5. Prompt Industriel Google Stitch
```text
# STITCH PROMPT — Local Maps Pack

Contexte produit :
Local Maps Pack - Carte locale interactive avec POIs dans le domaine Cartographie & Géolocalisation.

Objectif :
Offrir une interface complète, spécialisée et authentique permettant aux utilisateurs de réaliser leurs tâches métier.

Layout :
- Shell applicatif moderne avec navigation contextuelle.
- Section de statistiques ou de contenu principal selon l'écran.
- Grille de cartes réactives ou table moderne avec pagination.

Composants obligatoires :
MapView, MarkerPopup, SearchBar, RoutePanel, FavoritesSidebar, LayerToggle, PlaceDetailDrawer.

Style visuel :
- Palette : Fond #F0FDF4, primaire #16A34A, accent #0EA5E9.
- Typographie : Inter.
- Épuré, fonctionnel, vert nature. Sans-serif (Inter), carte en plein écran, sidebars blanches flottantes avec ombres. Accents vert (#16A34A) pour les marqueurs et itinéraires. Mode satellite avec overlay labels. Bottom drawer mobile pour les détails du lieu.

Contraintes :
- Zéro lorem ipsum, libellés explicites en français.
- Conformité WCAG AA.
- Responsive mobile-first.
```

---

## 6. Prompt Industriel Gemini 3.1 (Nano Banana Pro / Imagen 4)
```text
Génère une illustration haute fidélité pour l'onboarding de Local Maps Pack.

Contexte produit :
Application Cartographie & Géolocalisation moderne, élégante et professionnelle.

Sujet :
Métaphore visuelle représentant Place et l'interaction utilisateur dans le domaine Cartographie & Géolocalisation.

Style :
Rendu 3D isométrique épuré ou illustration vectorielle haut de gamme, sans surcharge.

Palette :
Dominante #16A34A, accents #0EA5E9, reflets doux sur fond #F0FDF4.

Format :
16:9 pour intégration en bannière d'accueil.

Contraintes :
- Pas de texte incrusté, pas de watermark.
- Respect rigoureux des codes du design system.
- Cohérence avec l'un visuel du domaine Cartographie & Géolocalisation.
```
