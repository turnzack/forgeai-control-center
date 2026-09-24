# UI SCREEN SPECIFICATIONS & AI GENERATION — Markdown Studio

## 1. Spécification Écran SCR-001 : /
- **Route** : `/`
- **Objectif** : écran central pour l'expérience **Documentation & PDF** dans Markdown Studio.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `DocsSidebar`, `MarkdownContent`, `TableOfContents`, `SearchModal`, `CodeBlock`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 2. Spécification Écran SCR-002 : /docs
- **Route** : `/docs`
- **Objectif** : écran central pour l'expérience **Documentation & PDF** dans Markdown Studio.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `DocsSidebar`, `MarkdownContent`, `TableOfContents`, `SearchModal`, `CodeBlock`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 3. Spécification Écran SCR-003 : /docs/:section/:page
- **Route** : `/docs/:section/:page`
- **Objectif** : écran central pour l'expérience **Documentation & PDF** dans Markdown Studio.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `DocsSidebar`, `MarkdownContent`, `TableOfContents`, `SearchModal`, `CodeBlock`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 4. Spécification Écran SCR-004 : /search
- **Route** : `/search`
- **Objectif** : écran central pour l'expérience **Documentation & PDF** dans Markdown Studio.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `DocsSidebar`, `MarkdownContent`, `TableOfContents`, `SearchModal`, `CodeBlock`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).


---

## 5. Prompt Industriel Google Stitch
```text
# STITCH PROMPT — Markdown Studio

Contexte produit :
Markdown Studio - Atelier markdown avec preview live et export dans le domaine Documentation & PDF.

Objectif :
Offrir une interface complète, spécialisée et authentique permettant aux utilisateurs de réaliser leurs tâches métier.

Layout :
- Shell applicatif moderne avec navigation contextuelle.
- Section de statistiques ou de contenu principal selon l'écran.
- Grille de cartes réactives ou table moderne avec pagination.

Composants obligatoires :
DocsSidebar, MarkdownContent, TableOfContents, SearchModal, CodeBlock, VersionSwitcher, PageFooter.

Style visuel :
- Palette : Fond #FFFFFF, primaire #475569, accent #0EA5E9.
- Typographie : Inter.
- Épuré, lisible, technique. Sans-serif (Inter), serif optionnel pour le corps (Lora) en mode lecture. Fond blanc (#FFFFFF), accents ardoise (#475569). Sidebar gauche fixe, sommaire droite, contenu central max-w-3xl. Code blocks en fond #1E293B avec syntaxe colorée. Mode sombre par défaut.

Contraintes :
- Zéro lorem ipsum, libellés explicites en français.
- Conformité WCAG AA.
- Responsive mobile-first.
```

---

## 6. Prompt Industriel Gemini 3.1 (Nano Banana Pro / Imagen 4)
```text
Génère une illustration haute fidélité pour l'onboarding de Markdown Studio.

Contexte produit :
Application Documentation & PDF moderne, élégante et professionnelle.

Sujet :
Métaphore visuelle représentant Document et l'interaction utilisateur dans le domaine Documentation & PDF.

Style :
Rendu 3D isométrique épuré ou illustration vectorielle haut de gamme, sans surcharge.

Palette :
Dominante #475569, accents #0EA5E9, reflets doux sur fond #FFFFFF.

Format :
16:9 pour intégration en bannière d'accueil.

Contraintes :
- Pas de texte incrusté, pas de watermark.
- Respect rigoureux des codes du design system.
- Cohérence avec l'un visuel du domaine Documentation & PDF.
```
