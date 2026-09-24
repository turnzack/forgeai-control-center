# UI SCREEN SPECIFICATIONS & AI GENERATION — Kanban Layout

## 1. Spécification Écran SCR-001 : /
- **Route** : `/`
- **Objectif** : écran central pour l'expérience **Gestion de Tâches & Kanban** dans Kanban Layout.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `KanbanBoard`, `TaskCard`, `TaskDetailModal`, `FilterBar`, `CalendarView`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 2. Spécification Écran SCR-002 : /board/:id
- **Route** : `/board/:id`
- **Objectif** : écran central pour l'expérience **Gestion de Tâches & Kanban** dans Kanban Layout.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `KanbanBoard`, `TaskCard`, `TaskDetailModal`, `FilterBar`, `CalendarView`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 3. Spécification Écran SCR-003 : /tasks
- **Route** : `/tasks`
- **Objectif** : écran central pour l'expérience **Gestion de Tâches & Kanban** dans Kanban Layout.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `KanbanBoard`, `TaskCard`, `TaskDetailModal`, `FilterBar`, `CalendarView`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 4. Spécification Écran SCR-004 : /calendar
- **Route** : `/calendar`
- **Objectif** : écran central pour l'expérience **Gestion de Tâches & Kanban** dans Kanban Layout.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `KanbanBoard`, `TaskCard`, `TaskDetailModal`, `FilterBar`, `CalendarView`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).


---

## 5. Prompt Industriel Google Stitch
```text
# STITCH PROMPT — Kanban Layout

Contexte produit :
Kanban Layout - Layout Kanban spécialisé gestion de projets dans le domaine Gestion de Tâches & Kanban.

Objectif :
Offrir une interface complète, spécialisée et authentique permettant aux utilisateurs de réaliser leurs tâches métier.

Layout :
- Shell applicatif moderne avec navigation contextuelle.
- Section de statistiques ou de contenu principal selon l'écran.
- Grille de cartes réactives ou table moderne avec pagination.

Composants obligatoires :
KanbanBoard, TaskCard, TaskDetailModal, FilterBar, CalendarView, QuickAddBar, AvatarStack.

Style visuel :
- Palette : Fond #F1F5F9, primaire #F59E0B, accent #E11D48.
- Typographie : Inter.
- Productif, ergonomique, coloré. Sans-serif (Inter), fond gris très clair (#F1F5F9), accents ambre/rose (#F59E0B / #E11D48). Cartes blanches avec border-l coloré par priorité. Drag-and-drop avec placeholder bleu. Densité d'information optimisée, raccourcis clavier partout.

Contraintes :
- Zéro lorem ipsum, libellés explicites en français.
- Conformité WCAG AA.
- Responsive mobile-first.
```

---

## 6. Prompt Industriel Gemini 3.1 (Nano Banana Pro / Imagen 4)
```text
Génère une illustration haute fidélité pour l'onboarding de Kanban Layout.

Contexte produit :
Application Gestion de Tâches & Kanban moderne, élégante et professionnelle.

Sujet :
Métaphore visuelle représentant Task et l'interaction utilisateur dans le domaine Gestion de Tâches & Kanban.

Style :
Rendu 3D isométrique épuré ou illustration vectorielle haut de gamme, sans surcharge.

Palette :
Dominante #F59E0B, accents #E11D48, reflets doux sur fond #F1F5F9.

Format :
16:9 pour intégration en bannière d'accueil.

Contraintes :
- Pas de texte incrusté, pas de watermark.
- Respect rigoureux des codes du design system.
- Cohérence avec l'un visuel du domaine Gestion de Tâches & Kanban.
```
