# UI SCREEN SPECIFICATIONS & AI GENERATION — App Web Studio

## 1. Spécification Écran SCR-001 : /
- **Route** : `/`
- **Objectif** : écran central pour l'expérience **SaaS Dashboard & Analytics** dans App Web Studio.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `StatCard`, `DataTable`, `ChartPlaceholder`, `BillingCard`, `UserTable`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 2. Spécification Écran SCR-002 : /dashboard
- **Route** : `/dashboard`
- **Objectif** : écran central pour l'expérience **SaaS Dashboard & Analytics** dans App Web Studio.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `StatCard`, `DataTable`, `ChartPlaceholder`, `BillingCard`, `UserTable`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 3. Spécification Écran SCR-003 : /analytics
- **Route** : `/analytics`
- **Objectif** : écran central pour l'expérience **SaaS Dashboard & Analytics** dans App Web Studio.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `StatCard`, `DataTable`, `ChartPlaceholder`, `BillingCard`, `UserTable`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 4. Spécification Écran SCR-004 : /billing
- **Route** : `/billing`
- **Objectif** : écran central pour l'expérience **SaaS Dashboard & Analytics** dans App Web Studio.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `StatCard`, `DataTable`, `ChartPlaceholder`, `BillingCard`, `UserTable`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).


---

## 5. Prompt Industriel Google Stitch
```text
# STITCH PROMPT — App Web Studio

Contexte produit :
App Web Studio - Studio de construction d'applications web dans le domaine SaaS Dashboard & Analytics.

Objectif :
Offrir une interface complète, spécialisée et authentique permettant aux utilisateurs de réaliser leurs tâches métier.

Layout :
- Shell applicatif moderne avec navigation contextuelle.
- Section de statistiques ou de contenu principal selon l'écran.
- Grille de cartes réactives ou table moderne avec pagination.

Composants obligatoires :
StatCard, DataTable, ChartPlaceholder, BillingCard, UserTable, SettingsForm, ApiKeyManager.

Style visuel :
- Palette : Fond #F8FAFC, primaire #2563EB, accent #7C3AED.
- Typographie : Inter.
- Professionnel, dense en données. Police Inter, espacement compact, couleurs atténuées. Fond ardoise (#F8FAFC), bleu primaire (#2563EB). Tables avec hover states, badges colorés pour les statuts, sidebar fixe avec icônes et labels. Cards en bento-grid.

Contraintes :
- Zéro lorem ipsum, libellés explicites en français.
- Conformité WCAG AA.
- Responsive mobile-first.
```

---

## 6. Prompt Industriel Gemini 3.1 (Nano Banana Pro / Imagen 4)
```text
Génère une illustration haute fidélité pour l'onboarding de App Web Studio.

Contexte produit :
Application SaaS Dashboard & Analytics moderne, élégante et professionnelle.

Sujet :
Métaphore visuelle représentant Metric et l'interaction utilisateur dans le domaine SaaS Dashboard & Analytics.

Style :
Rendu 3D isométrique épuré ou illustration vectorielle haut de gamme, sans surcharge.

Palette :
Dominante #2563EB, accents #7C3AED, reflets doux sur fond #F8FAFC.

Format :
16:9 pour intégration en bannière d'accueil.

Contraintes :
- Pas de texte incrusté, pas de watermark.
- Respect rigoureux des codes du design system.
- Cohérence avec l'un visuel du domaine SaaS Dashboard & Analytics.
```
