# UI SCREEN SPECIFICATIONS & AI GENERATION — Site Scraper

## 1. Spécification Écran SCR-001 : /
- **Route** : `/`
- **Objectif** : écran central pour l'expérience **Web Scraping & Extraction de Données** dans Site Scraper.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `JobList`, `JobEditor`, `LivePreviewTable`, `ExecutionLog`, `ExportButtons`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 2. Spécification Écran SCR-002 : /jobs
- **Route** : `/jobs`
- **Objectif** : écran central pour l'expérience **Web Scraping & Extraction de Données** dans Site Scraper.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `JobList`, `JobEditor`, `LivePreviewTable`, `ExecutionLog`, `ExportButtons`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 3. Spécification Écran SCR-003 : /jobs/:id
- **Route** : `/jobs/:id`
- **Objectif** : écran central pour l'expérience **Web Scraping & Extraction de Données** dans Site Scraper.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `JobList`, `JobEditor`, `LivePreviewTable`, `ExecutionLog`, `ExportButtons`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 4. Spécification Écran SCR-004 : /jobs/:id/edit
- **Route** : `/jobs/:id/edit`
- **Objectif** : écran central pour l'expérience **Web Scraping & Extraction de Données** dans Site Scraper.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `JobList`, `JobEditor`, `LivePreviewTable`, `ExecutionLog`, `ExportButtons`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).


---

## 5. Prompt Industriel Google Stitch
```text
# STITCH PROMPT — Site Scraper

Contexte produit :
Site Scraper - Scraper ciblé pour site web donné dans le domaine Web Scraping & Extraction de Données.

Objectif :
Offrir une interface complète, spécialisée et authentique permettant aux utilisateurs de réaliser leurs tâches métier.

Layout :
- Shell applicatif moderne avec navigation contextuelle.
- Section de statistiques ou de contenu principal selon l'écran.
- Grille de cartes réactives ou table moderne avec pagination.

Composants obligatoires :
JobList, JobEditor, LivePreviewTable, ExecutionLog, ExportButtons, SchedulePicker, DiffViewer.

Style visuel :
- Palette : Fond #0F1419, primaire #84CC16, accent #06B6D4.
- Typographie : Inter.
- Technique, terminal-inspired, data-dense. Sans-serif (Inter) avec mono (JetBrains Mono) pour les selectors et logs. Fond sombre (#0F1419), accents vert lime (#84CC16) évoquant le terminal. Tableaux denses, logs en mono. Statuts colorés (vert succès, rouge échec, jaune en cours).

Contraintes :
- Zéro lorem ipsum, libellés explicites en français.
- Conformité WCAG AA.
- Responsive mobile-first.
```

---

## 6. Prompt Industriel Gemini 3.1 (Nano Banana Pro / Imagen 4)
```text
Génère une illustration haute fidélité pour l'onboarding de Site Scraper.

Contexte produit :
Application Web Scraping & Extraction de Données moderne, élégante et professionnelle.

Sujet :
Métaphore visuelle représentant ScrapeJob et l'interaction utilisateur dans le domaine Web Scraping & Extraction de Données.

Style :
Rendu 3D isométrique épuré ou illustration vectorielle haut de gamme, sans surcharge.

Palette :
Dominante #84CC16, accents #06B6D4, reflets doux sur fond #0F1419.

Format :
16:9 pour intégration en bannière d'accueil.

Contraintes :
- Pas de texte incrusté, pas de watermark.
- Respect rigoureux des codes du design system.
- Cohérence avec l'un visuel du domaine Web Scraping & Extraction de Données.
```
