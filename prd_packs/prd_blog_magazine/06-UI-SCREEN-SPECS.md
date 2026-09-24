# UI SCREEN SPECIFICATIONS & AI GENERATION — Magazine Éditorial

## 1. Spécification Écran SCR-001 : /
- **Route** : `/`
- **Objectif** : écran central pour l'expérience **Blog & Contenu Éditorial** dans Magazine Éditorial.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `ArticleCard`, `ArticleList`, `ArticleDetail`, `CategorySidebar`, `SearchBar`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 2. Spécification Écran SCR-002 : /blog
- **Route** : `/blog`
- **Objectif** : écran central pour l'expérience **Blog & Contenu Éditorial** dans Magazine Éditorial.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `ArticleCard`, `ArticleList`, `ArticleDetail`, `CategorySidebar`, `SearchBar`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 3. Spécification Écran SCR-003 : /article/:slug
- **Route** : `/article/:slug`
- **Objectif** : écran central pour l'expérience **Blog & Contenu Éditorial** dans Magazine Éditorial.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `ArticleCard`, `ArticleList`, `ArticleDetail`, `CategorySidebar`, `SearchBar`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 4. Spécification Écran SCR-004 : /category/:cat
- **Route** : `/category/:cat`
- **Objectif** : écran central pour l'expérience **Blog & Contenu Éditorial** dans Magazine Éditorial.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `ArticleCard`, `ArticleList`, `ArticleDetail`, `CategorySidebar`, `SearchBar`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).


---

## 5. Prompt Industriel Google Stitch
```text
# STITCH PROMPT — Magazine Éditorial

Contexte produit :
Magazine Éditorial - Magazine en ligne avec une une éditoriale premium dans le domaine Blog & Contenu Éditorial.

Objectif :
Offrir une interface complète, spécialisée et authentique permettant aux utilisateurs de réaliser leurs tâches métier.

Layout :
- Shell applicatif moderne avec navigation contextuelle.
- Section de statistiques ou de contenu principal selon l'écran.
- Grille de cartes réactives ou table moderne avec pagination.

Composants obligatoires :
ArticleCard, ArticleList, ArticleDetail, CategorySidebar, SearchBar, TagCloud, ReadingProgressBar.

Style visuel :
- Palette : Fond #FDFBF7, primaire #D97706, accent #059669.
- Typographie : Lora.
- Lecture chaleureuse et confortable. Titres serif (Lora/Georgia), interligne généreux (1.75), largeur max-w-2xl pour le corps de l'article. Fond clair #FDFBF7 (ivoire), accents ambre #D97706. Cartes éditoriales avec ombres subtiles et hover lift, typographie soignée, drop cap optionnelle.

Contraintes :
- Zéro lorem ipsum, libellés explicites en français.
- Conformité WCAG AA.
- Responsive mobile-first.
```

---

## 6. Prompt Industriel Gemini 3.1 (Nano Banana Pro / Imagen 4)
```text
Génère une illustration haute fidélité pour l'onboarding de Magazine Éditorial.

Contexte produit :
Application Blog & Contenu Éditorial moderne, élégante et professionnelle.

Sujet :
Métaphore visuelle représentant Article et l'interaction utilisateur dans le domaine Blog & Contenu Éditorial.

Style :
Rendu 3D isométrique épuré ou illustration vectorielle haut de gamme, sans surcharge.

Palette :
Dominante #D97706, accents #059669, reflets doux sur fond #FDFBF7.

Format :
16:9 pour intégration en bannière d'accueil.

Contraintes :
- Pas de texte incrusté, pas de watermark.
- Respect rigoureux des codes du design system.
- Cohérence avec l'un visuel du domaine Blog & Contenu Éditorial.
```
