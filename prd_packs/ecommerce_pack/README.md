> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en E-commerce, Conversion et Retail Digital.
> Ce document est le PRD (Product Requirements Document) du **PACK E-COMMERCE SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Visionnaire, Moderne et Ultra-Optimisée (UI/UX)** pour vendre des produits (physiques ou digitaux), tout en respectant strictement les règles métier ci-dessous.

# 🛒 PACK E-COMMERCE (Architecture Retail & Vente)

Ce pack force la création d'une architecture e-commerce de pointe (façon Shopify Plus, Nike ou Apple Store). L'application générée doit sublimer le produit, maximiser le taux d'ajout au panier, et fluidifier le parcours d'achat grâce à des interfaces visuelles à fort impact.

---

## 🎯 1. Les 10 Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les 10 briques métiers (Missions) que tu peux câbler et générer :

### 🏬 1. Home E-Commerce Moderne (`tmpl_shop_home_modern`)
**Mission :** Page d'accueil généraliste pour une boutique en ligne.
**Design Requis :** Bannière "Hero" promotionnelle en haut (Hero promo), suivie d'une grille de produits asymétrique (Grid produits).
**Composants à générer :** `ShopHero.tsx`, `FeaturedGrid.tsx`

### 📖 2. Histoire de Marque (`tmpl_shop_brand_story`)
**Mission :** Page "Qui sommes-nous" ou "Notre Histoire" pour créer du lien.
**Design Requis :** Défilement narratif (Storytelling) avec des photos lifestyle grand format et une frise chronologique (Timeline Strip).
**Composants à générer :** `StorySection.tsx`, `TimelineStrip.tsx`

### 🎁 3. Guide Cadeaux (`tmpl_shop_gift_guide`)
**Mission :** Landing page saisonnière (Noël, St Valentin) pour guider les achats.
**Design Requis :** Cartes thématiques par prix ("À moins de 50€") ou cibles ("Pour lui"), avec des tags visuels.
**Composants à générer :** `GiftGuideGrid.tsx`, `CategoryTag.tsx`

### 👗 4. Landing de Collection (`tmpl_shop_collection_landing`)
**Mission :** Page dédiée au lancement d'une ligne de produits ou d'une collection estivale.
**Design Requis :** "Hero Collection" immersif, suivi d'un Lookbook (images cliquables où l'on peut acheter les articles portés sur la photo).
**Composants à générer :** `CollectionHero.tsx`, `LookbookStrip.tsx`

### 🚨 5. Événement Soldes / Black Friday (`tmpl_shop_sale_event`)
**Mission :** Landing agressive pour des promotions massives.
**Design Requis :** Couleurs fortes (Rouge/Noir), typographie d'urgence (Urgency UI avec Countdown), bannières promotionnelles omniprésentes.
**Composants à générer :** `SaleBanner.tsx`, `DealGrid.tsx`

### 🤝 6. Collaboration de Marques (`tmpl_shop_brand_collab`)
**Mission :** Page spéciale pour une collaboration (ex: Nike x Off-White).
**Design Requis :** "Dual branding" (Mise en avant des deux logos), mise en page divisée (Split layout) pour raconter la fusion des deux identités.
**Composants à générer :** `CollabHero.tsx`, `CollabProductGrid.tsx`

### 🌿 7. Impact & Éco-responsabilité (`tmpl_shop_sustainability`)
**Mission :** Page "Engagements" ou "Développement Durable".
**Design Requis :** Sections mettant en avant des chiffres clés (Impact Stats) et grille des initiatives écologiques.
**Composants à générer :** `ImpactStats.tsx`, `InitiativeGrid.tsx`

### 💎 8. Programme de Fidélité (`tmpl_shop_loyalty_program`)
**Mission :** Landing pour encourager l'inscription au club VIP.
**Design Requis :** Affichage des paliers (Tiers : Gold, Silver, Bronze), résumé des points, et liste des avantages (perks).
**Composants à générer :** `LoyaltyTiers.tsx`, `PointSummary.tsx`

### ⏳ 9. Page de Précommande (`tmpl_shop_preorder_page`)
**Mission :** Lancement d'un produit pas encore disponible.
**Design Requis :** Compte à rebours géant, barre de progression des objectifs de financement/production (Progress bar).
**Composants à générer :** `PreorderHero.tsx`, `PreorderProgress.tsx`

### 🔥 10. Page "Drops" & Éditions Limitées (`tmpl_shop_drops_page`)
**Mission :** Affichage des lancements limités façon Sneaker Release.
**Design Requis :** Cartes de "Drop" avec états temporels ("À venir", "Live", "Sold-Out" rayé).
**Composants à générer :** `DropList.tsx`, `DropCard.tsx`

---

## 🎨 2. Vision UI/UX & Design System Global pour l'E-Commerce
* **Directives pour Stitch :** Le produit doit respirer. Utilise des fonds neutres (blanc, gris perle, noir mat) pour faire ressortir les photos des produits. 
* **Typographie :** Minimaliste. Typographie sans-serif de type `Inter` ou `Helvetica`. 
* **Micro-interactions :** Animations de survol (Hover) essentielles sur les grilles produits : afficher un deuxième visuel au survol, ou faire apparaître le bouton "Ajouter au panier" en glissement vers le haut.

## ⚙️ 3. Directives de Câblage (VFS)
*L'architecture doit être prête pour se connecter à un Headless CMS (Shopify, Swell, Medusa). Utilise des composants statiques optimisés pour le SEO et prépare des squelettes de chargement (Skeletons) pour les images lourdes. TypeScript OBLIGATOIRE.*

---
### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée une boutique de vêtements streetwear avec un système de Drops en série limitée", tu dois immédiatement mobiliser `tmpl_shop_home_modern` et `tmpl_shop_drops_page`. Ton architecture doit être taillée pour supporter l'ajout au panier rapide et gérer les états visuels "Sold-Out".*

Boutique en ligne, fiches produits et gestion de panier.

[INSTRUCTION IA]
Génère l'interface d'une boutique e-commerce complète :
- Grille de produits avec image, nom, prix, bouton "Ajouter au panier"
- Composant Panier (Sidebar Drawer) listant les articles sélectionnés avec quantité, sous-total et bouton commander
- Page de fiche produit détaillée (images, description, sélecteur de variante, CTA)
- Gestion d'état du panier via React Context (CartContext.tsx)
- Hooks personnalisés : useCart(), useProducts()
- Données mock réalistes de produits (10 minimum)

[STRUCTURE REQUISE]
- src/features/shop/pages/ShopPage.tsx
- src/features/shop/pages/ProductDetailPage.tsx
- src/features/shop/components/ProductCard.tsx
- src/features/shop/components/CartDrawer.tsx
- src/features/shop/components/CartItem.tsx
- src/features/shop/contexts/CartContext.tsx
- src/features/shop/hooks/useCart.ts
- src/shared/types/shop.ts (interfaces Product, CartItem)
- src/shared/constants/products.ts (données mock)