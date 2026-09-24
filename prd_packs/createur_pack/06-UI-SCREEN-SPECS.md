# UI SCREEN SPECIFICATIONS & AI GENERATION — Créateur Portfolio

## 1. Spécification Écran SCR-001 : /
- **Route** : `/`
- **Objectif** : écran central pour l'expérience **Portfolio Créatif & Showcase** dans Créateur Portfolio.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `ProjectCard`, `ProjectGrid`, `ProjectDetail`, `SkillBar`, `AboutSection`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 2. Spécification Écran SCR-002 : /projects
- **Route** : `/projects`
- **Objectif** : écran central pour l'expérience **Portfolio Créatif & Showcase** dans Créateur Portfolio.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `ProjectCard`, `ProjectGrid`, `ProjectDetail`, `SkillBar`, `AboutSection`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 3. Spécification Écran SCR-003 : /project/:slug
- **Route** : `/project/:slug`
- **Objectif** : écran central pour l'expérience **Portfolio Créatif & Showcase** dans Créateur Portfolio.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `ProjectCard`, `ProjectGrid`, `ProjectDetail`, `SkillBar`, `AboutSection`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 4. Spécification Écran SCR-004 : /about
- **Route** : `/about`
- **Objectif** : écran central pour l'expérience **Portfolio Créatif & Showcase** dans Créateur Portfolio.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `ProjectCard`, `ProjectGrid`, `ProjectDetail`, `SkillBar`, `AboutSection`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).


---

## 5. Prompt Industriel Google Stitch
```text
# STITCH PROMPT — Créateur Portfolio

Contexte produit :
Créateur Portfolio - Portfolio pour créatifs indépendants dans le domaine Portfolio Créatif & Showcase.

Objectif :
Offrir une interface complète, spécialisée et authentique permettant aux utilisateurs de réaliser leurs tâches métier.

Layout :
- Shell applicatif moderne avec navigation contextuelle.
- Section de statistiques ou de contenu principal selon l'écran.
- Grille de cartes réactives ou table moderne avec pagination.

Composants obligatoires :
ProjectCard, ProjectGrid, ProjectDetail, SkillBar, AboutSection, ContactForm, TestimonialSlider.

Style visuel :
- Palette : Fond #FAFAFA, primaire #0EA5E9, accent #8B5CF6.
- Typographie : Sora.
- Élégant, créatif, minimaliste. Sans-serif display (Sora) pour les titres, Inter pour le corps. Fond blanc cassé (#FAFAFA), accents cyan (#0EA5E9). Grille asymétrique type masonry, grandes typographies, hover sur les projets avec overlay dégradé. Mode sombre optionnel.

Contraintes :
- Zéro lorem ipsum, libellés explicites en français.
- Conformité WCAG AA.
- Responsive mobile-first.
```

---

## 6. Prompt Industriel Gemini 3.1 (Nano Banana Pro / Imagen 4)
```text
Génère une illustration haute fidélité pour l'onboarding de Créateur Portfolio.

Contexte produit :
Application Portfolio Créatif & Showcase moderne, élégante et professionnelle.

Sujet :
Métaphore visuelle représentant Project et l'interaction utilisateur dans le domaine Portfolio Créatif & Showcase.

Style :
Rendu 3D isométrique épuré ou illustration vectorielle haut de gamme, sans surcharge.

Palette :
Dominante #0EA5E9, accents #8B5CF6, reflets doux sur fond #FAFAFA.

Format :
16:9 pour intégration en bannière d'accueil.

Contraintes :
- Pas de texte incrusté, pas de watermark.
- Respect rigoureux des codes du design system.
- Cohérence avec l'un visuel du domaine Portfolio Créatif & Showcase.
```
