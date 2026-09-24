# Fiche d'Identité du Projet — ai-voice-agent

- **Titre :** AI Voice Agent
- **Pack PRD source :** prd_ai_voice_agent
- **Date de scaffold :** 2026-09-23T13:12:24.436Z
- **Framework :** React 18 + Vite + TypeScript
- **Pépites montées :** 40

## Arborescence du Projet
```
ai-voice-agent/
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
