> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Vente de Produits Numériques (Gumroad-like).
> Ce document est le PRD (Product Requirements Document) du **PACK ECOM DIGITAL SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface de Vente Directe (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 💿 PACK ECOM DIGITAL PRODUCTS (Fichiers & Licences)

Ce pack force la création d'architectures dédiées à la vente de biens immatériels : E-books, Logiciels, Formations, Templates, ou Clés de Licence. 

---

## 🎯 La Mission Principale (Plateforme de Vente Digitale)

**Mission :** Générer une page de vente (Sales Page) suivie d'un portail client de téléchargement sécurisé.
À la différence de l'E-commerce physique, il n'y a pas de panier (généralement achat direct "Acheter maintenant") et pas d'adresse de livraison. L'accès est instantané.

### 🧩 Core Features Architecturaux Requis :
1. **Hero Section Produit Digital :** Mockup 3D du produit (Boîte de logiciel, iPad affichant l'E-book) ou vidéo de démonstration.
2. **Portail de Téléchargement (Post-Achat) :** Une page sécurisée "Vos Achats" où l'utilisateur peut télécharger ses fichiers (`.zip`, `.pdf`) ou copier sa clé de licence.
3. **Pay What You Want (PWYW) :** (Optionnel) Un input permettant à l'utilisateur de définir son propre prix au-dessus d'un minimum.
4. **Avis & Preuve Sociale :** Intégration massive d'étoiles (5/5) et d'avis textuels pour prouver la valeur immatérielle.

---

## 🎨 Vision UI/UX & Design System Digital Product
* **Directives pour Stitch :** Vendre du numérique demande de rassurer sur le "rendu réel". Le design doit être très "Creator Economy" (Boutons rebondissants, typos modernes type `Outfit` ou `Plus Jakarta Sans`).
* **Expérience Post-Achat :** L'animation de succès d'achat doit être très gratifiante (Confetti) suivie immédiatement du bouton magique "Télécharger votre fichier".

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi un clone de Gumroad pour vendre mes plugins", tu dois fusionner une Landing Page agressive avec un espace de téléchargement sécurisé post-paiement.*

[INSTRUCTION IA]
Génère une architecture E-commerce de Produits Digitaux :
- Bypass de la gestion des adresses de livraison dans le checkout.
- Page `SuccessPage.tsx` qui interroge l'API pour récupérer un lien de téléchargement signé (Presigned URL AWS S3 / R2).
- Dashboard Client listant l'historique des achats numériques avec boutons de retéléchargement.

[STRUCTURE REQUISE]
- `src/features/digital-products/pages/DigitalSalesPage.tsx`
- `src/features/digital-products/pages/DownloadPortal.tsx`
- `src/features/digital-products/components/PayWhatYouWantInput.tsx`
- `src/features/digital-products/components/LicenseKeyCard.tsx`
