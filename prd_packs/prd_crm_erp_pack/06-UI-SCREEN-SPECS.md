# UI SCREEN SPECIFICATIONS & AI GENERATION — CRM/ERP Pack

## 1. Spécification Écran SCR-001 : /
- **Route** : `/`
- **Objectif** : écran central pour l'expérience **CRM & ERP Commercial** dans CRM/ERP Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `PipelineBoard`, `DealCard`, `ContactDetail`, `ActivityTimeline`, `ForecastChart`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 2. Spécification Écran SCR-002 : /pipeline
- **Route** : `/pipeline`
- **Objectif** : écran central pour l'expérience **CRM & ERP Commercial** dans CRM/ERP Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `PipelineBoard`, `DealCard`, `ContactDetail`, `ActivityTimeline`, `ForecastChart`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 3. Spécification Écran SCR-003 : /contacts
- **Route** : `/contacts`
- **Objectif** : écran central pour l'expérience **CRM & ERP Commercial** dans CRM/ERP Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `PipelineBoard`, `DealCard`, `ContactDetail`, `ActivityTimeline`, `ForecastChart`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 4. Spécification Écran SCR-004 : /contacts/:id
- **Route** : `/contacts/:id`
- **Objectif** : écran central pour l'expérience **CRM & ERP Commercial** dans CRM/ERP Pack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `PipelineBoard`, `DealCard`, `ContactDetail`, `ActivityTimeline`, `ForecastChart`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).


---

## 5. Prompt Industriel Google Stitch
```text
# STITCH PROMPT — CRM/ERP Pack

Contexte produit :
CRM/ERP Pack - Suite CRM + ERP pour PME dans le domaine CRM & ERP Commercial.

Objectif :
Offrir une interface complète, spécialisée et authentique permettant aux utilisateurs de réaliser leurs tâches métier.

Layout :
- Shell applicatif moderne avec navigation contextuelle.
- Section de statistiques ou de contenu principal selon l'écran.
- Grille de cartes réactives ou table moderne avec pagination.

Composants obligatoires :
PipelineBoard, DealCard, ContactDetail, ActivityTimeline, ForecastChart, AutomationBuilder, CustomFieldEditor.

Style visuel :
- Palette : Fond #F8FAFC, primaire #4F46E5, accent #0EA5E9.
- Typographie : Inter.
- Professionnel, dense, orienté métier. Sans-serif (Inter), fond gris clair (#F8FAFC), accents indigo (#4F46E5). Pipeline en Kanban avec border-l coloré par étape. Cards sobres, hover lift. Sidebar navigation par module (Contacts, Deals, Activités, Rapports). Tableaux avec groupement.

Contraintes :
- Zéro lorem ipsum, libellés explicites en français.
- Conformité WCAG AA.
- Responsive mobile-first.
```

---

## 6. Prompt Industriel Gemini 3.1 (Nano Banana Pro / Imagen 4)
```text
Génère une illustration haute fidélité pour l'onboarding de CRM/ERP Pack.

Contexte produit :
Application CRM & ERP Commercial moderne, élégante et professionnelle.

Sujet :
Métaphore visuelle représentant Deal et l'interaction utilisateur dans le domaine CRM & ERP Commercial.

Style :
Rendu 3D isométrique épuré ou illustration vectorielle haut de gamme, sans surcharge.

Palette :
Dominante #4F46E5, accents #0EA5E9, reflets doux sur fond #F8FAFC.

Format :
16:9 pour intégration en bannière d'accueil.

Contraintes :
- Pas de texte incrusté, pas de watermark.
- Respect rigoureux des codes du design system.
- Cohérence avec l'un visuel du domaine CRM & ERP Commercial.
```
