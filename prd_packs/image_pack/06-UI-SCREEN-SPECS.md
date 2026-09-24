# UI SCREEN SPECIFICATIONS & AI GENERATION — Image Pack

## 1. Spécification Écran SCR-001 : /
- **Route** : `/`
- **Objectif** : écran central pour l'expérience **Bibliothèque de Composants UI** dans Image Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `ComponentCatalog`, `Playground`, `PropsTable`, `TokenExplorer`, `ThemeSwitcher`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 2. Spécification Écran SCR-002 : /components
- **Route** : `/components`
- **Objectif** : écran central pour l'expérience **Bibliothèque de Composants UI** dans Image Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `ComponentCatalog`, `Playground`, `PropsTable`, `TokenExplorer`, `ThemeSwitcher`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 3. Spécification Écran SCR-003 : /components/:name
- **Route** : `/components/:name`
- **Objectif** : écran central pour l'expérience **Bibliothèque de Composants UI** dans Image Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `ComponentCatalog`, `Playground`, `PropsTable`, `TokenExplorer`, `ThemeSwitcher`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 4. Spécification Écran SCR-004 : /tokens
- **Route** : `/tokens`
- **Objectif** : écran central pour l'expérience **Bibliothèque de Composants UI** dans Image Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `ComponentCatalog`, `Playground`, `PropsTable`, `TokenExplorer`, `ThemeSwitcher`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).


---

## 5. Prompt Industriel Google Stitch
```text
# STITCH PROMPT — Image Pack

Contexte produit :
Image Pack - Galerie d'images avec lightbox dans le domaine Bibliothèque de Composants UI.

Objectif :
Offrir une interface complète, spécialisée et authentique permettant aux utilisateurs de réaliser leurs tâches métier.

Layout :
- Shell applicatif moderne avec navigation contextuelle.
- Section de statistiques ou de contenu principal selon l'écran.
- Grille de cartes réactives ou table moderne avec pagination.

Composants obligatoires :
ComponentCatalog, Playground, PropsTable, TokenExplorer, ThemeSwitcher, StateMatrix, CodeBlockWithCopy.

Style visuel :
- Palette : Fond #FFFFFF, primaire #71717A, accent #6366F1.
- Typographie : Inter.
- Minimaliste, neutre, mettant les composants en valeur. Sans-serif (Inter), fond blanc (#FFFFFF) et gris très clair (#FAFAFA) pour les zones de preview. Accents neutres (zinc #71717A) pour ne pas parasiter les composants montrés. Sidebar gauche par catégorie, contenu central preview, props droite.

Contraintes :
- Zéro lorem ipsum, libellés explicites en français.
- Conformité WCAG AA.
- Responsive mobile-first.
```

---

## 6. Prompt Industriel Gemini 3.1 (Nano Banana Pro / Imagen 4)
```text
Génère une illustration haute fidélité pour l'onboarding de Image Pack.

Contexte produit :
Application Bibliothèque de Composants UI moderne, élégante et professionnelle.

Sujet :
Métaphore visuelle représentant Component et l'interaction utilisateur dans le domaine Bibliothèque de Composants UI.

Style :
Rendu 3D isométrique épuré ou illustration vectorielle haut de gamme, sans surcharge.

Palette :
Dominante #71717A, accents #6366F1, reflets doux sur fond #FFFFFF.

Format :
16:9 pour intégration en bannière d'accueil.

Contraintes :
- Pas de texte incrusté, pas de watermark.
- Respect rigoureux des codes du design system.
- Cohérence avec l'un visuel du domaine Bibliothèque de Composants UI.
```
