/*
[CONTEXTE CACHÉ - ARCHITECTURE MASTER PRD TIGER IA SOVEREIGN MOBILE ENGINE V5]
# 🏛️ MASTER PRD — TigerIA Sovereign Mobile Engine
## Plateforme locale d'orchestration de génération d'applications mobiles natives
> **Solo Dev · Extension Electron existante · 10 Sprints + Sprint 0**

---

## 🎯 1. Vision & Règles Absolues

**Objectif** : Transformer un brief utilisateur + des maquettes HTML Stitch en applications mobiles natives Expo React Native, 100% local sauf DeepSeek Chat Web.

**Stack de sortie** : React Native · Expo · Expo Router · TypeScript strict · NativeWind · Zustand · TanStack Query

**Règle fondatrice** :
```
Extension collecte → Electron valide & installe → Hermes décide → DeepSeek génère → SQLite mémorise
```

**Contraintes non-négociables** :
- ❌ Zero WebView / Zero HTML runtime / Zero CSS navigateur dans le code généré
- ❌ Zero commande arbitraire depuis le LLM (allowlist stricte)  
- ❌ Zero donnée externe sauf DeepSeek Chat Web
- ✅ Bridge uniquement sur 127.0.0.1:5005 (jamais 0.0.0.0)
- ✅ spawn avec shell: false partout

---

## 🏗️ 2. Architecture Cible

```
Electron.exe (127.0.0.1:5005)
├── Node.js Orchestrator (main.js → routes/)
├── Hermes Agent (observe → decide → act)
├── MCP Host Local
│   ├── project-filesystem   (read/write workspace)
│   ├── project-memory       (SQLite + sqlite-vec)
│   ├── browser-deepseek     (bridge Extension Chrome)
│   ├── project-runner       (install/typecheck/lint)
│   ├── expo-mobile          (expo install/start/build)
│   └── git-deployment       (commit/push protégé)
├── SQLite + sqlite-vec (%APPDATA%/TigerIA/database/)
├── Ollama local (embeddings nomic-embed-text 768D)
└── Extension Chrome Bridge
        └── DeepSeek Chat Web
```

### Structure Monorepo
```
electron/     (contracts, policies, services, routes, tools, mcp)
extension/    (parsers, bridge, content scripts)
hermes/       (agent, tools, decision loop)
mcp/servers/  (6 serveurs MCP locaux)
shared/       (schemas Zod, types TypeScript, constantes)
```

### Stockage Local
```
%APPDATA%/TigerIA/
├── database/tiger-ia.sqlite   (memories, documents, decisions, job_events, memory_vectors)
├── projects/<projectId>/      (workspaces Expo)
├── mcp/                       (configs serveurs MCP)
├── logs/                      (rotation 10MB × 5 fichiers)
├── embeddings/                (cache Ollama)
└── settings/                  (clés locales)
```

---

## 📋 3. Contrat JSON Canonique v1.0

Format imposé à DeepSeek pour toute réponse de génération :

```json
{
  "schemaVersion": "1.0",
  "projectId": "mobile-001",
  "projectType": "react-native-expo",
  "stack": {
    "framework": "react-native",
    "runtime": "expo",
    "router": "expo-router",
    "language": "typescript",
    "styling": "nativewind",
    "state": "zustand",
    "serverState": "@tanstack/react-query"
  },
  "dependencies": {
    "expo": ["expo-router", "expo-status-bar"],
    "native": ["react-native-reanimated", "react-native-gesture-handler",
               "react-native-safe-area-context", "react-native-screens"],
    "runtime": ["nativewind", "zustand", "@tanstack/react-query"],
    "dev": ["typescript", "tailwindcss", "eslint", "prettier"]
  },
  "mcpServers": [],
  "files": [{ "path": "src/app/index.tsx", "content": "..." }],
  "commands": ["install_dependencies", "run_typecheck", "start_preview"],
  "nextPhase": 5
}
```

**Validation Zod** : projectType obligatoire · dependencies obligatoire et séparé · files[].path relatif uniquement · commands sont des intentions (Electron construit les args) · Rejet des chemins ../../, file:, git+ssh://.

---

## 🚶 4. Walkthrough Complet — Cycle de Vie d'un Projet

```
1. USER fournit un PRD + maquette Stitch HTML dans l'UI Electron

2. HERMES lit le brief, consulte SQLite (projets similaires passés)
   → Décide : démarrer phase 0 "prepare_project"

3. EXTENSION injecte le prompt dans DeepSeek Chat Web
   DeepSeek retourne → contrat JSON (stack + deps native/runtime/dev + files + mcpServers)
   Extension parse → valide → POST PROJECT_CONTRACT à Electron

4. ELECTRON valide le contrat (Zod)
   → Vérifie chaque dépendance contre l'allowlist
   → Rejette : ../../package, file:, git+ssh://, URLs suspectes

5. ELECTRON installe (5 phases séquentielles)
   Phase 1 : npx create-expo-app@latest <projectName>
   Phase 2 : npx expo install <native deps>
   Phase 3 : pnpm add <runtime deps>
   Phase 4 : pnpm add -D <dev deps>
   Phase 5 : npx expo install --check

6. HERMES décide : generate_mobile_files
   Extension injecte le prompt de génération de code dans DeepSeek Chat
   DeepSeek génère les fichiers .tsx (React Native natif, NativeWind, Expo Router)
   Extension capture → POST files[] à Electron

7. ELECTRON écrit les fichiers
   Via MCP project-filesystem.write_project_file
   Validation des chemins (uniquement dans src/)

8. MCP project-runner lance : run_typecheck → run_lint
   Erreurs détectées → Hermes décide de régénérer les fichiers concernés
   Cycle correction : max 3 tentatives par fichier

9. SQLite mémorise
   Décisions de Hermes, erreurs rencontrées, contexte projet, embeddings Ollama

10. MCP expo-mobile lance : npx expo start --lan
    → QR Code → Expo Go sur device physique

11. HERMES marque le job completed
    Documentation auto générée (README, ARCHITECTURE, CHANGELOG)
    Build EAS possible pour APK/AAB final
```

[FIN DU CONTEXTE CACHÉ]
*/
