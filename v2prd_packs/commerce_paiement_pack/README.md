> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en E-commerce et Solutions de Paiement.
> Ce document est le PRD (Product Requirements Document) du **PACK COMMERCE & PAIEMENT SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface de Checkout Ultra-Sécurisée (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 💳 PACK COMMERCE & PAIEMENT (Tunnels & Transactions)

Ce pack force la création des pages liées à l'argent : Paniers, Checkouts, et Processus de paiement.

---

## 🎯 La Mission Principale (Transaction)

**Mission :** Gérer le processus de prise de commande de bout en bout (Cart -> Checkout -> Success).

### 🧩 Core Features Architecturaux Requis :
1. **Tiroir Panier (Cart Drawer) :** Panneau latéral glissant listant les articles avec modification des quantités.
2. **Page de Paiement (Checkout) :** Saisie d'adresse, sélection du transporteur, formulaire de carte (Stripe/PayPal).
3. **Page de Succès (Order Success) :** Confirmation de commande, numéro de suivi, et actions post-achat.

---

## 🎨 Vision UI/UX & Design System Paiement
* **Directives pour Stitch :** Isolation totale (Enclosing) : La page de paiement ne doit avoir aucun menu pour éviter les fuites. Rassurer avec des icônes de cadenas et de cartes de crédit.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*À utiliser pour tout ce qui implique une transaction monétaire.*

[INSTRUCTION IA]
Génère une architecture de Paiement :
- État du panier global (React Context).
- Validation stricte des adresses (Zod).
- Composants de paiement factices mais structurellement prêts pour Stripe Elements.

[STRUCTURE REQUISE]
- `src/features/commerce/components/CartDrawer.tsx`
- `src/features/commerce/pages/CheckoutPage.tsx`
- `src/features/commerce/pages/SuccessPage.tsx`