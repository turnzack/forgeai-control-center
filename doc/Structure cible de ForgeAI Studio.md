# Structure cible de ForgeAI Studio

## Décision principale

Votre système doit être séparé en deux produits :

1. **ForgeAI Control Center** : moteur qui reçoit les archives, inventorie, audite, score, extrait et valide.
2. **Projet généré standalone** : application autonome, copiable, zippable et déployable sans le Control Center ni le bridge.

Le projet généré ne doit jamais importer un module depuis le Control Center. Le Control Center produit un artefact final, puis cet artefact vit indépendamment.

## Architecture globale

```text
forgeai-platform/
├── control-center/
│   ├── apps/
│   │   ├── dashboard/              # Interface de pilotage
│   │   └── api/                    # API du pipeline
│   ├── packages/
│   │   ├── archive-inspector/      # ZIP/RAR, inventaire, hash
│   │   ├── source-analyzer/        # AST, imports, exports, scoring
│   │   ├── pollution-filter/       # secrets, .env, dist, node_modules
│   │   ├── license-auditor/        # SPDX et notices
│   │   ├── scaffold-engine/        # génération du squelette
│   │   ├── component-adapter/      # adaptation des pépites
│   │   ├── manifest-generator/     # manifest et provenance
│   │   ├── quality-runner/         # typecheck, build, smoke tests
│   │   └── contracts/              # contrats du pipeline
│   ├── storage/
│   │   ├── incoming/
│   │   ├── workspaces/
│   │   ├── reports/
│   │   └── outputs/
│   └── docs/
├── templates/
│   ├── react-vite-standalone/
│   ├── react-vite-saas/
│   ├── react-vite-ecommerce/
│   ├── react-vite-chat/
│   ├── react-vite-crm/
│   └── react-vite-ai-voice/
└── generated-projects/
    └── <project-id>/
```

`generated-projects` est une sortie du moteur, pas un package du moteur.

## Pipeline de fabrication

### 1. Décompression et inventaire

Entrée : archive. Sortie : inventaire immuable contenant chemin, taille, hash, extension, nombre de lignes, imports, exports, rôle détecté et statut de sécurité.

Exclusions immédiates : `node_modules`, `dist`, `out`, `.next`, `coverage`, caches, binaires inutiles, `.env`, tokens et clés privées.

```text
ArchiveInput -> ArchiveManifest -> FileInventory[]
```

### 2. Audit et scoring

Le score reste explicable : TypeScript/TSX `+10`, taille atomique `+10`, tests associés `+5`, correspondance avec le PRD `+15`, composant découplé `+10`, imports résolubles `+10`.

Un secret entraîne `-50` et une exclusion immédiate. Une règle de sécurité ne doit jamais être annulée par un bon score fonctionnel.

```ts
interface CandidateComponent {
  sourcePath: string;
  role: "ui" | "hook" | "service" | "model" | "store";
  score: number;
  imports: string[];
  exports: string[];
  decision: "keep" | "adapt" | "exclude";
  reasons: string[];
}
```

### 3. Scaffold standalone

Chaque sortie doit contenir son propre manifeste, lockfile, configuration TypeScript, Vite, variables d’environnement, README et rapports légaux.

```text
project/
├── package.json
├── package-lock.json ou pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
├── index.html
├── .env.example
├── .gitignore
├── README.md
├── 00_PROJECT_META.md
├── 01_PRD.md
├── 02_ARCHITECTURE.md
├── PROVENANCE_REPORT.md
├── THIRD_PARTY_NOTICES.md
└── src/
```

Les fonts doivent avoir des fallbacks locaux ou système pour préserver l’autonomie hors ligne.

### 4. Extraction et provenance

Les composants retenus vont dans une zone dédiée :

```text
src/integrations/
├── index.ts
├── manifest.ts
├── provenance.ts
└── github-adapted/
    ├── <source-repo-a>/
    └── <source-repo-b>/
```

Chaque fichier adapté reçoit un cartouche indiquant dépôt, commit ou tag, chemin original, licence, date et modifications. `PROVENANCE_REPORT.md`, `THIRD_PARTY_NOTICES.md` et le manifest doivent provenir des mêmes métadonnées.

La limite de 100 composants est un garde-fou, pas un objectif. La priorité est la compatibilité, la qualité et l’utilisation réelle.

### 5. Services métier et UI

Le projet généré doit séparer shell, UI, animation, fonctionnalités et persistance :

```text
src/
├── app/                            # App, routes, providers
├── components/
│   ├── ui/                         # Button, Card, Input, Tabs, cn
│   ├── layout/                     # Shell, Sidebar, Header
│   └── motion/                     # Gradient, Particles, Logo, Cube
├── features/
│   ├── dashboard/
│   ├── billing/
│   ├── team/
│   ├── usage/
│   ├── cart/
│   ├── chat/
│   ├── crm/
│   └── ai-voice/
├── services/
│   ├── adapters/
│   ├── local-storage/
│   └── mock/
├── stores/
├── integrations/
├── lib/
├── types/
├── styles/
│   ├── tokens.css
│   ├── globals.css
│   └── motion.css
└── main.tsx
```

Les features sont activées selon l’archétype et le PRD. Un projet SaaS ne doit pas embarquer automatiquement panier, chat, CRM et audio.

`localStorage` doit implémenter une interface remplaçable :

```ts
interface BillingRepository {
  getPlans(): Promise<Plan[]>;
  getInvoices(): Promise<Invoice[]>;
  changePlan(input: ChangePlanInput): Promise<Subscription>;
}
```

### 6. Contrôle qualité et livraison

Le projet ne sort que si ces contrôles terminent avec Exit 0 :

```text
pollution scan
provenance/license validation
install lockfile
npm run typecheck
npm run lint
npm run test
npm run build
smoke test Vite
imports orphelins
archive finale
```

Le port 5173 peut rester le défaut local, mais doit être configurable pour les exécutions concurrentes.

## Structure d’une feature

```text
features/billing/
├── api.ts
├── contracts.ts
├── hooks.ts
├── components/
│   ├── plan-card.tsx
│   └── invoice-table.tsx
├── pages/
│   └── billing-page.tsx
└── index.ts
```

`src/app/App.tsx` reste un orchestrateur léger. Il assemble layout, providers et routes. Il ne contient ni règles de facturation ni accès direct à `localStorage`.

## Règles pour l’animation et la 3D

`AnimatedGradient`, `ParticleField`, `AnimatedLogo`, `AnimatedCube` et `AnimatedContainer` restent dans `components/motion`. Ils ne doivent jamais être importés par les services métier. Ils doivent respecter `prefers-reduced-motion` et être désactivables par pack.

## Recommandations d’amélioration de votre plan

Votre plan est solide sur l’inventaire, la provenance et l’autonomie. Je recommande quatre ajustements :

- séparer Control Center et projets générés en dépôts ou packages distincts ;
- traiter LocalStorage comme adaptateur de démo, jamais comme cœur métier ;
- sélectionner les composants par compatibilité et usage, pas seulement par score ;
- rendre animations et 3D optionnelles pour éviter d’alourdir chaque sortie.

## Résultat final attendu

Chaque projet futur doit compiler seul, posséder un lockfile, ne contenir aucun secret ni build importé, fonctionner sans bridge, fournir sa provenance complète, séparer UI/animation/features/services/intégrations et passer typecheck, lint, tests, build et smoke test avant livraison.

## Références

[1]: /home/ubuntu/upload/pasted_content.txt "Plan maître de création des projets futurs ForgeAI Studio"
[2]: ./AUDIT_ARCHITECTURE_ET_BOILERPLATE.md "Audit du projet SaaS Pack"

*Document produit le 24 septembre 2026 à partir du plan fonctionnel fourni et de l’audit du projet existant.*
*Auteur : Manus AI*
