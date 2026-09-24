# UI SCREEN SPECIFICATIONS & AI GENERATION — Mobile Social

## 1. Spécification Écran SCR-001 : /
- **Route** : `/`
- **Objectif** : écran central pour l'expérience **Réseau Social & Feed** dans Mobile Social.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `PostCard`, `FeedList`, `PostComposer`, `NotificationDropdown`, `ProfileHeader`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 2. Spécification Écran SCR-002 : /feed
- **Route** : `/feed`
- **Objectif** : écran central pour l'expérience **Réseau Social & Feed** dans Mobile Social.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `PostCard`, `FeedList`, `PostComposer`, `NotificationDropdown`, `ProfileHeader`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 3. Spécification Écran SCR-003 : /profile/:username
- **Route** : `/profile/:username`
- **Objectif** : écran central pour l'expérience **Réseau Social & Feed** dans Mobile Social.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `PostCard`, `FeedList`, `PostComposer`, `NotificationDropdown`, `ProfileHeader`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 4. Spécification Écran SCR-004 : /post/:id
- **Route** : `/post/:id`
- **Objectif** : écran central pour l'expérience **Réseau Social & Feed** dans Mobile Social.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `PostCard`, `FeedList`, `PostComposer`, `NotificationDropdown`, `ProfileHeader`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).


---

## 5. Prompt Industriel Google Stitch
```text
# STITCH PROMPT — Mobile Social

Contexte produit :
Mobile Social - Réseau social mobile-first avec stories dans le domaine Réseau Social & Feed.

Objectif :
Offrir une interface complète, spécialisée et authentique permettant aux utilisateurs de réaliser leurs tâches métier.

Layout :
- Shell applicatif moderne avec navigation contextuelle.
- Section de statistiques ou de contenu principal selon l'écran.
- Grille de cartes réactives ou table moderne avec pagination.

Composants obligatoires :
PostCard, FeedList, PostComposer, NotificationDropdown, ProfileHeader, CommentThread, TrendingSidebar.

Style visuel :
- Palette : Fond #FAFAFA, primaire #8B5CF6, accent #EC4899.
- Typographie : Inter.
- Moderne, social, vivant. Sans-serif (Inter), fond blanc avec sidebar gauche et droite (#FAFAFA). Posts en cartes blanches avec ombres subtiles, accents violet (#8B5CF6). Animations de like (cœur qui pulse), transitions fluides. Avatars ronds avec border gradient pour les comptes vérifiés.

Contraintes :
- Zéro lorem ipsum, libellés explicites en français.
- Conformité WCAG AA.
- Responsive mobile-first.
```

---

## 6. Prompt Industriel Gemini 3.1 (Nano Banana Pro / Imagen 4)
```text
Génère une illustration haute fidélité pour l'onboarding de Mobile Social.

Contexte produit :
Application Réseau Social & Feed moderne, élégante et professionnelle.

Sujet :
Métaphore visuelle représentant Post et l'interaction utilisateur dans le domaine Réseau Social & Feed.

Style :
Rendu 3D isométrique épuré ou illustration vectorielle haut de gamme, sans surcharge.

Palette :
Dominante #8B5CF6, accents #EC4899, reflets doux sur fond #FAFAFA.

Format :
16:9 pour intégration en bannière d'accueil.

Contraintes :
- Pas de texte incrusté, pas de watermark.
- Respect rigoureux des codes du design system.
- Cohérence avec l'un visuel du domaine Réseau Social & Feed.
```
