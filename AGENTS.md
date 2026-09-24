# 🏛️ FORGEAI AGENTS — RÈGLES DE FABRICATION GRAVÉES DANS LE MARBRE

Pour toute création, refactorisation, assemblage ou montage de projet dans ForgeAI Control Center, les directives suivantes sont **strictes, immuables et d'application universelle**.

---

## 1. 🎨 Sources GitHub Réelles (Téléchargées, Découpées & Tracées)
- Tout projet s'appuie sur des dépôts GitHub ouverts réels (SPDX certifiés : MIT, Apache 2.0, BSD) téléchargés dans `github-sources/` avec leur manifeste `sources.github.json`.
- Les dépôts sont découpés pour n'extraire que les pépites logicielles réutilisables (composants, hooks, utilitaires) dans `src/integrations/github-adapted/`.
- Chaque fichier adapté possède son en-tête `@provenance` mentionnant le dépôt, le chemin d'origine, la licence et la date.
- Les rapports légaux `PROVENANCE_REPORT.md` et `THIRD_PARTY_NOTICES.md` sont systématiquement maintenus à la racine du projet.

---

## 2. 🎛️ Design Tokens & Règles Métier PRD
- Chaque projet doit appliquer les Design Tokens de son domaine (palette contrastée forte, typographie Inter ou équivalent moderne, mode sombre élégant).
- L'architecture à 4 étages est obligatoire :
  1. `src/types/index.ts` : Modèles stricts TypeScript.
  2. `src/services/` : Services métiers autonomes avec persistance locale (`localStorage`) pour préserver l'état réel.
  3. `src/components/` : Briques UI modulaires et réactives (Hero, Grilles, Formulaires, Tableaux, FAQ, Modales).
  4. `src/features/` : Pages fonctionnelles complètes.
  5. `src/App.tsx` : Shell applicatif fluide, propre, zéro pollution visuelle, zéro bouton de debug parasite.

---

## 3. 🛡️ Matrice Standard par Archétype
- **Landing Page & Conversion** (`landing`) : Entité `Lead` | Palette `#7C3AED` / `#EC4899` | `leadService.ts` | Composants : `HeroSection.tsx`, `FeatureGrid.tsx`, `PricingTable.tsx`, `TestimonialsSection.tsx`, `FaqAccordion.tsx`, `WaitlistForm.tsx`.
- **E-Commerce** (`ecommerce`) : Entité `Product`/`Order` | Palette `#10B981` / `#06B6D4` | `cartService.ts` | `Storefront.tsx`, `CartDrawer.tsx`, `CheckoutWizard.tsx`.
- **Chat & Messagerie** (`chat`) : Entité `Message` | Palette `#3B82F6` / `#0EA5E9` | `chatService.ts` | `ConversationSidebar.tsx`, `MessageBubble.tsx`, `MessageInputBar.tsx`.
- **CRM & ERP** (`crm`) : Entité `Contact`/`Deal` | Palette `#F59E0B` / `#10B981` | `crmService.ts` | `CrmKanban.tsx`, `ClientsDirectory.tsx`, `InvoicesErp.tsx`.
- **SaaS & Abonnements** (`saas`) : Entité `Subscription` | Palette `#6366F1` / `#8B5CF6` | `saasService.ts` | `SaasDashboard.tsx`, `MetricsGrid.tsx`.
- **UI Kit & Design System** (`ui_kit`) : Entité `Component` | Palette `#EC4899` / `#8B5CF6` | `componentService.ts` | `ComponentCatalog.tsx`, `TokenExplorer.tsx`.

---

## 4. ⚡ Validation Automatique Obligatoire
Tout projet doit valider `tsc --noEmit` avec **0 erreur (Exit 0)** lors de son assemblage.
