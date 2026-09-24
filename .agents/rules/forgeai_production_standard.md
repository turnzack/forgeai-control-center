# RÈGLE D'OR FORGEAI : STANDARD INDUSTRIEL DE PRODUCTION POUR TOUS LES PACKS ET PROJETS

Ce document grave dans le marbre la méthodologie obligatoire et universelle appliquée à chaque création, assemblage ou extension de projet généré dans ForgeAI Control Center.

---

## 1. 🎨 Sources GitHub Réelles (Téléchargées, Découpées & Tracées)

Pour chaque création de projet à partir d'un pack PRD ou d'une intention utilisateur :
1. **Sélection & Téléchargement automatique** :
   - L'orchestrateur sélectionne et télécharge les dépôts GitHub ouverts les plus pertinents (licences permissives MIT, Apache 2.0, BSD).
   - Les archives sources sont stockées dans `github-sources/` avec leur manifeste d'intégrité `sources.github.json`.
2. **Découpage chirurgical des Pépites** :
   - Les dépôts sont analysés pour extraire uniquement les briques logicielles utiles (composants `.tsx`, hooks réutilisables, utilitaires de thème et de calcul).
   - Ces pépites adaptées sont placées dans `src/integrations/github-adapted/<nom-du-depot>/`.
   - Zéro fichier inutile (pas de fichiers de test orphelins, pas de configs Webpack/Jest obsolètes).
3. **Traçabilité Légale & SPDX** :
   - Chaque fichier adapté comporte l'en-tête officiel `@provenance` mentionnant le dépôt d'origine, le chemin source, la licence et la date.
   - Les rapports `PROVENANCE_REPORT.md` et `THIRD_PARTY_NOTICES.md` sont systématiquement générés et maintenus à jour à la racine du projet.

---

## 2. 🎛️ Design Tokens & Règles Métier PRD

L'apparence visuelle et l'expérience utilisateur doivent être irréprochables et calibrées selon le domaine du pack :
1. **Design Tokens Explicites** :
   - **Palette Principale** : Deux couleurs phares fortes et harmonieuses (ex: `#7C3AED` Violet Électrique & `#EC4899` Fuchsia Vibrant pour les Landing Pages & Conversion ; `#10B981` & `#06B6D4` pour l'E-Commerce ; `#3B82F6` & `#0EA5E9` pour le Chat & SaaS).
   - **Typographie** : Police moderne (ex: `Inter`, `Plus Jakarta Sans`, ou police système moderne) avec hiérarchie claire (titres gras 800/900 pour la conversion).
   - **Fonds & Surfaces** : Mode sombre élégant (`#0B0F19`) ou clair doux avec contrastes validés WCAG AA et glassmorphism subtil.
2. **Architecture en 4 Étages Obligatoire** :
   - `src/types/index.ts` : Modèles de données et interfaces TypeScript stricts.
   - `src/services/` : Services autonomes avec persistance locale (`localStorage`) pour conserver les données (Leads, Paniers, Messages, Factures) entre les rechargements.
   - `src/components/` : Briques d'interface modulaires, réutilisables et interactives (ex: `HeroSection.tsx`, `FeatureGrid.tsx`, `PricingTable.tsx`, `TestimonialsSection.tsx`, `FaqAccordion.tsx`, `WaitlistForm.tsx`).
   - `src/features/` : Pages et vues métier complètes assemblant les composants.
   - `src/App.tsx` : Shell applicatif fluide, réactif et épuré. **Zéro pollution visuelle**, zéro bouton flottant inutile de debug en production.

---

## 3. 🛡️ Matrice de Conformité par Archétype

| Archétype | Entité Clé | Palette Référence | Composants UI Obligatoires | Service Persistant |
| :--- | :---: | :---: | :--- | :--- |
| **`landing`** *(Landing & Conversion)* | `Lead` | `#7C3AED` / `#EC4899` | `HeroSection`, `FeatureGrid`, `PricingTable`, `TestimonialsSection`, `FaqAccordion`, `WaitlistForm` | `leadService.ts` |
| **`ecommerce`** *(Boutique & Paiement)* | `Product` / `Order` | `#10B981` / `#06B6D4` | `Storefront`, `ProductCard`, `CartDrawer`, `CheckoutWizard`, `OrdersTracking` | `cartService.ts` / `productService.ts` |
| **`chat`** *(Messagerie Temps Réel)* | `Message` | `#3B82F6` / `#0EA5E9` | `ConversationSidebar`, `MessageBubble`, `MessageInputBar`, `ChatFiles`, `ChatMembers` | `chatService.ts` |
| **`crm`** *(CRM & Gestion ERP)* | `Contact` / `Deal` | `#F59E0B` / `#10B981` | `CrmKanban`, `ClientsDirectory`, `InvoicesErp`, `AnalyticsDashboard` | `crmService.ts` |
| **`saas`** *(Abonnements & Métriques)* | `Subscription` | `#6366F1` / `#8B5CF6` | `SaasDashboard`, `MetricsGrid`, `PlanSwitcher`, `UsageGraph` | `saasService.ts` |
| **`ui_kit`** *(Design System & Tokens)* | `Component` | `#EC4899` / `#8B5CF6` | `ComponentCatalog`, `TokenExplorer`, `PreviewSandbox` | `componentService.ts` |

---

## 4. ⚡ Règle d'Exécution Absolue

Chaque projet créé ou assemblé via le Control Center doit impérativement compiler avec **0 erreur TypeScript** (`tsc --noEmit` : Exit 0) et être immédiatement visualisable sur son port local de développement.
