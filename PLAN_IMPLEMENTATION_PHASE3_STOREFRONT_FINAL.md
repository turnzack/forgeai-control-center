# Plan d'Implémentation Technique : Phase 3 — Générateur Universel de Vitrine Finale & Preuves de Validation

> **Statut :** ✅ **Opérationnel et validé de bout en bout** avec le projet pilote `prodgit/ecommerce-pack` sur `http://localhost:5175/`.
> **Objectif :** Standardiser la transformation d'un projet brut monté (squelette + pépites isolées) en une **application finale interactive, complète et prête pour la production** pour n'importe lequel des 113 Packs PRD.

---

## 1. Vue d'ensemble du Cycle de Vie d'un Projet ForgeAI

```
[0. Pack PRD (113)] ──► [1. Sources GitHub] ──► [2. Montage Pépites] ──► [3. Assemblage Vitrine Finale]
  (Bible & Archétype)     (Recherche ⌘ K & ZIP)   (Isolation src/adapted)   (Storefront / Dashboard Live)
```

| Étape | Rôle | Sortie sur disque |
|---|---|---|
| **Phase 1 : Sources GitHub** | Recherche ciblée, filtrage SPDX et téléchargement des archives `.zip` | `prodgit/<projet>/github-sources/*.zip` |
| **Phase 2 : Montage des Pépites** | Décompression mémoire, audit, extraction chirurgicale des composants `use-code` | `src/integrations/github-adapted/`, `MOUNTED_MANIFEST` |
| **Phase 3 : Vitrine Finale (Storefront)** | **Assemblage métier interactif** connectant les briques du PRD aux composants adaptés | `src/features/Storefront.tsx`, `src/components/*`, `src/services/mockData.ts`, `src/App.tsx` (Dual-Mode) |

---

## 2. Architecture par Archétypes de Packs PRD

Pour que la Phase 3 fonctionne de manière universelle sur tous les futurs projets, le moteur d'assemblage applique un template selon l'**archétype** spécifié dans `pack.json` :

### 2.1. Archétype `ecommerce` (ex: `ecommerce_pack`)
- **Briques assemblées obligatoires :**
  - `StorefrontHeader` : barre de recherche temps réel, filtres rapides et déclencheur panier avec badge live.
  - `FilterSidebar` : catégories, budget range slider, marques et tri multi-critères.
  - `ProductGrid` & `ProductCard` : zoom image au survol, étiquette promo, notation étoiles, prix comparatif et bouton panier.
  - `CartDrawer` : tiroir latéral persistant avec calcul de sous-total, livraison offerte dès 100 €, incrémentation des quantités.
  - `CheckoutWizard` : tunnel de commande en 3 étapes (*1. Livraison*, *2. Paiement sécurisé*, *3. Confirmation avec numéro de commande #ECOM-2026*).
  - `ProductDetailModal` : modale fiche produit avec galerie d'images et caractéristiques.

### 2.2. Archétype `saas` / `billing` (ex: `prd_saas_billing_pro`)
- **Briques assemblées obligatoires :**
  - `PricingMatrix` : grille des abonnements (Starter, Pro, Enterprise) avec bascule mensuel / annuel.
  - `SubscriptionCheckout` : tunnel de souscription avec calcul TVA et confirmation immédiate.
  - `UsageDashboard` : graphiques de consommation d'API, quotas de requêtes et métriques clés.
  - `TeamAccessModal` : invitation de membres, gestion des rôles (Admin, Membre, Lecture seule).

### 2.3. Archétype `ai-agent` / `voice` (ex: `prd_ai_voice_agent`)
- **Briques assemblées obligatoires :**
  - `AgentPlayground` : console d'interaction avec streaming audio et textuel en temps réel.
  - `PromptEditor` : ajustement des consignes système et hyper-paramètres (température, top_p).
  - `RunsHistory` : journal d'exécution avec latence, tokens consommés et traçabilité.

### 2.4. Archétype `crm` / `erp` (ex: `prd_crm_erp_pack`)
- **Briques assemblées obligatoires :**
  - `DataTable` : grille de données avec pagination, recherche plein texte et export CSV/JSON.
  - `MetricsOverview` : 4 indicateurs clés (KPIs) avec variations en pourcentage.
  - `EntityDrawer` : tiroir d'édition rapide des fiches clients ou leads.

---

## 3. Déclenchement de la Phase 3 dans l'Application Web

L'utilisateur et les agents peuvent lancer la Phase 3 de 3 manières différentes :

### Option A : Déclenchement automatique post-orchestration
Dans l'onglet **Orchestration** (`http://localhost:3000`), lors du franchissement de l'étape de validation humaine (« Valider et générer le code »), le pipeline assemble automatiquement la vitrine finale.

### Option B : Bouton d'action directe « 🏪 GÉNÉRER LA VITRINE FINALE »
Dans l'écran **Fichiers & artefacts** (`PROJECT OUTPUT / PROVENANCE`), un bouton d'action dédié permet de déclencher à tout moment la transformation du projet actif en vitrine complète sans réécraser les configurations personnalisées.

### Option C : API Bridge Local
```http
POST /v1/projects/:id/assemble-final-app
Content-Type: application/json

{
  "packSlug": "ecommerce_pack",
  "archetype": "ecommerce"
}
```

---

## 4. Garde-Fous Techniques & Règles Anti-Régression

Pour que chaque futur projet généré soit certifié Grade Gold :
1. **Compilation Stricte 0 Erreur :**
   - L'assemblage final doit immédiatement compiler avec `tsc -b && vite build` (validé en **4.66s** sur `ecommerce-pack`).
2. **Bascule Dual-Mode Systématique (`src/App.tsx`) :**
   - Tout projet assemblé intègre un bandeau supérieur permettant de basculer en un clic entre :
     - **🏪 Vitrine E-Commerce (Storefront Final)** : l'expérience produit finale pour les utilisateurs.
     - **🔬 Studio des Pépites & Provenance** : l'inventaire technique de tous les composants GitHub adaptés avec licences et en-têtes `@provenance`.
3. **Persistance et Zéro Dépendance Orpheline :**
   - Toutes les dépendances requises (`lucide-react`, `clsx`, `react`, `react-dom`) sont déclarées dans `package.json`.
   - Les données mockées réalistes sont isolées dans `src/services/mockData.ts` et typées selon `src/types/index.ts`.

---

## 5. Preuves de Validation & Rapport d'Exécution (Projet Pilote `ecommerce-pack`)

### 5.1. Métriques de Compilation & Build
```text
> ecommerce-pack@0.1.0 build
> tsc -b && vite build

vite v6.4.3 building for production...
transforming...
✓ 1586 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.71 kB │ gzip:  0.40 kB
dist/assets/index-DcviSakq.css   14.43 kB │ gzip:  3.35 kB
dist/assets/index-DJawRPH1.js   192.19 kB │ gzip: 56.94 kB
✓ built in 4.66s
```

### 5.2. Preuves Visuelles Certifiées

| Écran Validé | Fichier de Preuve | Description |
|---|---|---|
| **Vitrine E-Commerce (Catalogue & Filtres)** | [`vitrine_ecommerce_storefront_1790048232822.png`](file:///C:/Users/patri/.gemini/antigravity-ide/brain/1e5a63c2-848c-4c04-a28e-67793a186e27/vitrine_ecommerce_storefront_1790048232822.png) | Grille responsive avec 6 produits haute résolution, filtres catégories, budget slider et barre de recherche |
| **Tiroir Panier avec Calcul Sous-Total** | [`cart_drawer_opened_1790048242686.png`](file:///C:/Users/patri/.gemini/antigravity-ide/brain/1e5a63c2-848c-4c04-a28e-67793a186e27/cart_drawer_opened_1790048242686.png) | Panier dynamique avec gestion incrément/décrément, calcul TVA et livraison offerte |
| **Tunnel de Commande (Étape 1 Livraison)** | [`checkout_tunnel_step1_1790048254334.png`](file:///C:/Users/patri/.gemini/antigravity-ide/brain/1e5a63c2-848c-4c04-a28e-67793a186e27/checkout_tunnel_step1_1790048254334.png) | Formulaire d'adresse, récapitulatif du total et transition vers le paiement sécurisé |
| **Studio des Pépites & Provenance** | [`studio_pepites_cockpit_1790048275385.png`](file:///C:/Users/patri/.gemini/antigravity-ide/brain/1e5a63c2-848c-4c04-a28e-67793a186e27/studio_pepites_cockpit_1790048275385.png) | Cockpit listant les 40 composants dérivés du dépôt GitHub avec licence MIT |
| **Enregistrement Vidéo de la Démo** | [`ecommerce_storefront_demo_1790048220986.webp`](file:///C:/Users/patri/.gemini/antigravity-ide/brain/1e5a63c2-848c-4c04-a28e-67793a186e27/ecommerce_storefront_demo_1790048220986.webp) | Session interactive complète : navigation, ajout panier, checkout, bascule studio |

---

## 6. Protocole de Test pour les Futurs Projets

Pour chaque nouveau projet créé à partir d'un Pack PRD :
1. **Étape 1 :** Créer le projet et monter les pépites GitHub.
2. **Étape 2 :** Lancer la Phase 3 via l'action « Assembler la Vitrine Finale ».
3. **Étape 3 :** Exécuter la commande de validation :
   ```bash
   cd prodgit/<nom-du-projet>
   pnpm build
   ```
4. **Étape 4 :** Démarrer le serveur dev (`pnpm dev`) et valider les parcours critiques dans le navigateur.
