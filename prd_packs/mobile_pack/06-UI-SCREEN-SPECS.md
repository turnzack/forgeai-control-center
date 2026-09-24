# UI SCREEN SPECIFICATIONS & AI GENERATION — Mobile Pack

## 1. Spécification Écran SCR-001 : /onboarding
- **Route** : `/onboarding`
- **Objectif** : écran central pour l'expérience **Application Mobile & PWA** dans Mobile Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `BottomNav`, `TopAppBar`, `SwipeableListItem`, `PullToRefresh`, `OnboardingCarousel`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 2. Spécification Écran SCR-002 : /home
- **Route** : `/home`
- **Objectif** : écran central pour l'expérience **Application Mobile & PWA** dans Mobile Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `BottomNav`, `TopAppBar`, `SwipeableListItem`, `PullToRefresh`, `OnboardingCarousel`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 3. Spécification Écran SCR-003 : /search
- **Route** : `/search`
- **Objectif** : écran central pour l'expérience **Application Mobile & PWA** dans Mobile Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `BottomNav`, `TopAppBar`, `SwipeableListItem`, `PullToRefresh`, `OnboardingCarousel`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 4. Spécification Écran SCR-004 : /notifications
- **Route** : `/notifications`
- **Objectif** : écran central pour l'expérience **Application Mobile & PWA** dans Mobile Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `BottomNav`, `TopAppBar`, `SwipeableListItem`, `PullToRefresh`, `OnboardingCarousel`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).


---

## 5. Prompt Industriel Google Stitch
```text
# STITCH PROMPT — Mobile Pack

Contexte produit :
Mobile Pack - Pack mobile PWA complet dans le domaine Application Mobile & PWA.

Objectif :
Offrir une interface complète, spécialisée et authentique permettant aux utilisateurs de réaliser leurs tâches métier.

Layout :
- Shell applicatif moderne avec navigation contextuelle.
- Section de statistiques ou de contenu principal selon l'écran.
- Grille de cartes réactives ou table moderne avec pagination.

Composants obligatoires :
BottomNav, TopAppBar, SwipeableListItem, PullToRefresh, OnboardingCarousel, PushPermissionPrompt, OfflineBanner.

Style visuel :
- Palette : Fond #FFFFFF, primaire #06B6D4, accent #8B5CF6.
- Typographie : Inter.
- Mobile-first, natif, fluide. Sans-serif (Inter), fond blanc (#FFFFFF), accents teal (#06B6D4). Bottom nav fixe avec blur backdrop. Transitions entre écrans en slide horizontal. Tap targets minimum 44×44px. Safe areas iOS (notch) gérées via env(safe-area-inset-*).

Contraintes :
- Zéro lorem ipsum, libellés explicites en français.
- Conformité WCAG AA.
- Responsive mobile-first.
```

---

## 6. Prompt Industriel Gemini 3.1 (Nano Banana Pro / Imagen 4)
```text
Génère une illustration haute fidélité pour l'onboarding de Mobile Pack.

Contexte produit :
Application Application Mobile & PWA moderne, élégante et professionnelle.

Sujet :
Métaphore visuelle représentant Screen et l'interaction utilisateur dans le domaine Application Mobile & PWA.

Style :
Rendu 3D isométrique épuré ou illustration vectorielle haut de gamme, sans surcharge.

Palette :
Dominante #06B6D4, accents #8B5CF6, reflets doux sur fond #FFFFFF.

Format :
16:9 pour intégration en bannière d'accueil.

Contraintes :
- Pas de texte incrusté, pas de watermark.
- Respect rigoureux des codes du design system.
- Cohérence avec l'un visuel du domaine Application Mobile & PWA.
```
