> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en E-commerce et Parcours d'Achat (Funnel Retail).
> Ce document est le PRD (Product Requirements Document) du **PACK ECOM CATALOG SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface de Découverte de Produits (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 🛍️ PACK ECOM CATALOG (Découverte & Filtres)

Ce pack force la création de la vue la plus importante d'une boutique : le catalogue de produits (PLP - Product Listing Page). L'objectif est la recherche rapide, le filtrage avancé à facettes, et l'affichage fluide de milliers d'items.

---

## 🎯 La Mission Principale (Catalogue & Filtres)

**Mission :** Générer une vue d'exploration de produits (façon Amazon, Nike ou Zalando).
Le composant central doit permettre à l'utilisateur de trouver son produit sans rechargement de page.

### 🧩 Core Features Architecturaux Requis :
1. **Sidebar de Filtres à Facettes :** Panneau latéral gauche contenant des filtres (Prix, Tailles, Couleurs, Catégories) avec des compteurs dynamiques.
2. **Grille de Produits (Product Grid) :** Grille responsive (2 colonnes mobile, 4 colonnes desktop) affichant les cartes produits.
3. **Tri (Sorting) :** Menu déroulant (Prix croissant, Nouveautés, Pertinence).
4. **Pagination / Infinite Scroll :** Chargement de nouveaux produits au défilement ou via un bouton "Charger plus".

---

## 🎨 Vision UI/UX & Design System E-commerce
* **Directives pour Stitch :** Les cartes produits (Product Cards) doivent être épurées. Une image massive, le titre sur une ligne (tronqué si trop long), le prix en gras. 
* **Micro-interactions :** Le bouton "Ajouter au panier" apparaît au survol de l'image (Quick Add), ou l'image de la carte change (ex: Vue de face -> Vue portée) au survol.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée la page vitrine de ma boutique de vêtements", déploie ce système de catalogue avec filtrage instantané.*

[INSTRUCTION IA]
Génère une architecture E-commerce avancée (Product Listing) :
- État global des filtres stocké idéalement dans l'URL (URL State / SearchParams) pour que les recherches soient partageables.
- Squelettes de chargement (Skeletons) identiques aux cartes produits pendant le filtre.
- Composant `ProductCard` hyper-optimisé (Images carrées ou 4:3, Lazy loading).
- Gestion d'état local via `useFilters` et `useProducts`.

[STRUCTURE REQUISE]
- `src/features/catalog/pages/CatalogPage.tsx`
- `src/features/catalog/components/ProductGrid.tsx`
- `src/features/catalog/components/ProductCard.tsx`
- `src/features/catalog/components/FacetSidebar.tsx`
- `src/features/catalog/components/SortDropdown.tsx`
- `src/features/catalog/hooks/useCatalogFilters.ts`