# UI SCREEN SPECIFICATIONS & AI GENERATION — Formulaire Pack

## 1. Spécification Écran SCR-001 : /
- **Route** : `/`
- **Objectif** : écran central pour l'expérience **Formulaires & Sondages** dans Formulaire Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `FormBuilderCanvas`, `FieldPalette`, `FieldSettingsPanel`, `FormPreview`, `MultiStepProgress`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 2. Spécification Écran SCR-002 : /forms
- **Route** : `/forms`
- **Objectif** : écran central pour l'expérience **Formulaires & Sondages** dans Formulaire Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `FormBuilderCanvas`, `FieldPalette`, `FieldSettingsPanel`, `FormPreview`, `MultiStepProgress`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 3. Spécification Écran SCR-003 : /forms/:id/edit
- **Route** : `/forms/:id/edit`
- **Objectif** : écran central pour l'expérience **Formulaires & Sondages** dans Formulaire Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `FormBuilderCanvas`, `FieldPalette`, `FieldSettingsPanel`, `FormPreview`, `MultiStepProgress`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 4. Spécification Écran SCR-004 : /forms/:id/preview
- **Route** : `/forms/:id/preview`
- **Objectif** : écran central pour l'expérience **Formulaires & Sondages** dans Formulaire Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `FormBuilderCanvas`, `FieldPalette`, `FieldSettingsPanel`, `FormPreview`, `MultiStepProgress`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).


---

## 5. Prompt Industriel Google Stitch
```text
# STITCH PROMPT — Formulaire Pack

Contexte produit :
Formulaire Pack - Constructeur de formulaires multi-étapes dans le domaine Formulaires & Sondages.

Objectif :
Offrir une interface complète, spécialisée et authentique permettant aux utilisateurs de réaliser leurs tâches métier.

Layout :
- Shell applicatif moderne avec navigation contextuelle.
- Section de statistiques ou de contenu principal selon l'écran.
- Grille de cartes réactives ou table moderne avec pagination.

Composants obligatoires :
FormBuilderCanvas, FieldPalette, FieldSettingsPanel, FormPreview, MultiStepProgress, SubmissionsTable, AnalyticsDashboard.

Style visuel :
- Palette : Fond #F8FAFC, primaire #0891B2, accent #6366F1.
- Typographie : Inter.
- Net, structuré, data-driven. Sans-serif (Inter), fond gris très clair (#F8FAFC), accents cyan (#0891B2). Builder en 3 colonnes (palette, canvas, settings). Champs avec bordures arrondies, focus ring cyan. Cards de statistiques en bento-grid. Tableaux denses avec hover states.

Contraintes :
- Zéro lorem ipsum, libellés explicites en français.
- Conformité WCAG AA.
- Responsive mobile-first.
```

---

## 6. Prompt Industriel Gemini 3.1 (Nano Banana Pro / Imagen 4)
```text
Génère une illustration haute fidélité pour l'onboarding de Formulaire Pack.

Contexte produit :
Application Formulaires & Sondages moderne, élégante et professionnelle.

Sujet :
Métaphore visuelle représentant Form et l'interaction utilisateur dans le domaine Formulaires & Sondages.

Style :
Rendu 3D isométrique épuré ou illustration vectorielle haut de gamme, sans surcharge.

Palette :
Dominante #0891B2, accents #6366F1, reflets doux sur fond #F8FAFC.

Format :
16:9 pour intégration en bannière d'accueil.

Contraintes :
- Pas de texte incrusté, pas de watermark.
- Respect rigoureux des codes du design system.
- Cohérence avec l'un visuel du domaine Formulaires & Sondages.
```
