> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en E-commerce et Optimisation du Tunnel de Conversion.
> Ce document est le PRD (Product Requirements Document) du **PACK ECOM CHECKOUT SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface de Paiement Sans Friction (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 💳 PACK ECOM CHECKOUT (Tunnel de Paiement)

Ce pack force la création de l'étape la plus critique d'un site E-commerce : le Checkout. Le moindre doute ou friction à cette étape détruit le taux de conversion. L'interface doit transpirer la sécurité, la rapidité et la clarté.

---

## 🎯 La Mission Principale (Checkout Sans Friction)

**Mission :** Générer une page de paiement complète, optimisée pour réduire l'abandon de panier.
Le système doit pouvoir gérer l'adresse de livraison, le choix du transporteur, et l'intégration d'un formulaire de carte bancaire sécurisé.

### 🧩 Core Features Architecturaux Requis :
1. **Order Summary (Résumé de commande) :** Un panneau latéral persistant (généralement à droite) montrant les articles, les sous-totaux, les taxes, et les frais de port mis à jour en direct.
2. **Step-by-Step ou One-Page Checkout :** Un formulaire fluide demandant séquentiellement : Email -> Livraison -> Paiement.
3. **Formulaire de Paiement Sécurisé :** UI de saisie de carte bleue avec formatage automatique (espaces tous les 4 chiffres) et détection du réseau (Visa, Mastercard, Amex).
4. **Boutons de Paiement Rapide (Express Checkout) :** Boutons Apple Pay / Google Pay au tout début du funnel.

---

## 🎨 Vision UI/UX & Design System Checkout
* **Directives pour Stitch :** Supprime toute distraction. Le Header doit disparaître (ou ne contenir que le logo et un lien retour "Sécurisé"). Pas de liens inutiles.
* **Confiance :** Affiche des badges de sécurité ("Paiement 100% sécurisé via Stripe"), des icônes de cadenas fermés, et gère parfaitement les messages d'erreur de carte refusée (en rouge clair, avec une explication humaine).

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée une page de paiement pour ma boutique", tu dois scinder l'écran en deux : Formulaire de livraison/paiement à gauche, Résumé de la commande sur fond gris clair à droite.*

[INSTRUCTION IA]
Génère une architecture Checkout E-commerce :
- Validation de formulaire ultra stricte (Zod / React Hook Form) pour s'assurer que l'adresse est valide avant de facturer.
- Intégration simulée (Mock) ou réelle de Stripe Elements (`@stripe/react-stripe-js`).
- Gestion des états asynchrones : Bouton "Payer" qui affiche un spinner et se désactive pendant le processing réseau.

[STRUCTURE REQUISE]
- `src/features/checkout/pages/CheckoutPage.tsx`
- `src/features/checkout/components/OrderSummaryPane.tsx`
- `src/features/checkout/components/ShippingForm.tsx`
- `src/features/checkout/components/PaymentForm.tsx`
- `src/features/checkout/components/ExpressPayButtons.tsx`