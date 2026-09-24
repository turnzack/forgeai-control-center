# Fiche d'Identité du Projet — saas-pack

- **Titre :** SAAS
- **Pack PRD source :** saas_pack
- **Date de scaffold :** 2026-09-24T00:34:56.896Z
- **Framework :** React 18 + Vite + TypeScript
- **Pépites montées :** 100

## Arborescence du Projet
```
saas-pack/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── 00_PROJECT_META.md
├── 01_PRD.md
├── 02_ARCHITECTURE.md
├── 03_TASKS.md
├── PROVENANCE_REPORT.md
├── THIRD_PARTY_NOTICES.md
├── github-sources/           # Archives .zip téléchargées
└── src/
    ├── main.tsx              # Point d'entrée React
    ├── App.tsx               # Câblage des pépites et interface principale
    ├── index.css             # Tokens et styles globaux
    ├── components/           # Composants UI réutilisables (Navbar, Layout, etc.)
    ├── features/             # Modules métier
    ├── hooks/                # Hooks personnalisés
    ├── types/                # Définitions TypeScript
    ├── services/             # Couche API & logique métier
    └── integrations/
        ├── index.ts          # Barrel export des pépites montées
        └── github-adapted/   # Pépites extraites avec en-têtes @provenance
```
