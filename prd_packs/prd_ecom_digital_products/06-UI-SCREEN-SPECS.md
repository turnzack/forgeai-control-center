# UI SCREEN SPECIFICATIONS & AI GENERATION — Digital Store

## 1. Spécification Écran SCR-001 : /
- **Route** : `/`
- **Objectif** : écran central pour l'expérience **E-commerce & Boutique en Ligne** dans Digital Store.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `ProductCard`, `ProductGrid`, `ProductDetail`, `CartDrawer`, `CheckoutWizard`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 2. Spécification Écran SCR-002 : /shop
- **Route** : `/shop`
- **Objectif** : écran central pour l'expérience **E-commerce & Boutique en Ligne** dans Digital Store.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `ProductCard`, `ProductGrid`, `ProductDetail`, `CartDrawer`, `CheckoutWizard`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 3. Spécification Écran SCR-003 : /product/:slug
- **Route** : `/product/:slug`
- **Objectif** : écran central pour l'expérience **E-commerce & Boutique en Ligne** dans Digital Store.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `ProductCard`, `ProductGrid`, `ProductDetail`, `CartDrawer`, `CheckoutWizard`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 4. Spécification Écran SCR-004 : /cart
- **Route** : `/cart`
- **Objectif** : écran central pour l'expérience **E-commerce & Boutique en Ligne** dans Digital Store.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `ProductCard`, `ProductGrid`, `ProductDetail`, `CartDrawer`, `CheckoutWizard`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).


---

## 5. Prompt Industriel Google Stitch
```text
# STITCH PROMPT — Digital Store

Contexte produit :
Digital Store - Vente de produits numériques (ebooks, logiciels) dans le domaine E-commerce & Boutique en Ligne.

Objectif :
Offrir une interface complète, spécialisée et authentique permettant aux utilisateurs de réaliser leurs tâches métier.

Layout :
- Shell applicatif moderne avec navigation contextuelle.
- Section de statistiques ou de contenu principal selon l'écran.
- Grille de cartes réactives ou table moderne avec pagination.

Composants obligatoires :
ProductCard, ProductGrid, ProductDetail, CartDrawer, CheckoutWizard, FilterSidebar, ReviewList.

Style visuel :
- Palette : Fond #FFFFFF, primaire #10B981, accent #F59E0B.
- Typographie : Inter.
- Boutique premium, nette et persuasive. Sans-serif (Inter), espacement aéré, blanc dominant (#FFFFFF), accents emerald (#10B981) pour les CTAs. Cartes produit avec hover zoom sur l'image, badges promo rouges. Tunnel de checkout minimaliste, sans distraction.

Contraintes :
- Zéro lorem ipsum, libellés explicites en français.
- Conformité WCAG AA.
- Responsive mobile-first.
```

---

## 6. Prompt Industriel Gemini 3.1 (Nano Banana Pro / Imagen 4)
```text
Génère une illustration haute fidélité pour l'onboarding de Digital Store.

Contexte produit :
Application E-commerce & Boutique en Ligne moderne, élégante et professionnelle.

Sujet :
Métaphore visuelle représentant Product et l'interaction utilisateur dans le domaine E-commerce & Boutique en Ligne.

Style :
Rendu 3D isométrique épuré ou illustration vectorielle haut de gamme, sans surcharge.

Palette :
Dominante #10B981, accents #F59E0B, reflets doux sur fond #FFFFFF.

Format :
16:9 pour intégration en bannière d'accueil.

Contraintes :
- Pas de texte incrusté, pas de watermark.
- Respect rigoureux des codes du design system.
- Cohérence avec l'un visuel du domaine E-commerce & Boutique en Ligne.
```
