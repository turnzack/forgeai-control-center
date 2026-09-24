# KIROV5 Orchestrator — Elite Forge v5.1.1

Extension Chrome **Manifest V3** — fusion v16 + KIROV4, avec correctif structure React.

## Correctif v5.1.1 (critique)

### Problème corrigé
Lors de la phase **code + écriture disque**, tous les fichiers finissaient en `.txt` :
```
src/main.txt          ❌
src/hooks/useGame.ts  → useGameLoop.txt  ❌
vite.config.txt       ❌
01_PRD.txt            ❌
```
au lieu d'une vraie arborescence React/Vite :
```
index.html
package.json
vite.config.ts
src/main.tsx
src/App.tsx
src/index.css
src/components/*.tsx
src/hooks/*.ts
src/store/*.ts
src/types/*.ts
src/utils/*.ts
```

### Causes racines
1. **MIME `text/plain`** sur tous les téléchargements → Chrome force l'extension `.txt`
2. **Parsing codegen fragile** → `codeFiles` vide → pas de structure React
3. **Artefacts specs stockés en JSON envelope** `{"status":"ok","content":"..."}` au lieu du markdown réel
4. **Pas de normalisation** des chemins `.txt` / sans extension vers `.tsx/.ts/.css`

### Correctifs appliqués
| Fichier | Fix |
|---------|-----|
| `lib/artifact-writer.js` | MIME par extension, `normalizePath`, `parseCodeFiles` robuste, unwrap artefacts |
| `lib/orchestrator.js` | unwrap specs, fallback capture, `applyKnownFixes` React |
| `lib/command-router.js` | unwrap JSON nested, prompts chemins React |
| `lib/pack-builder.js` | codegen prompt avec règles de chemins strictes |
| `content.js` | parse/fix extensions React (plus de `.txt`) |
| `lib/constants.js` | SILENCE_ABSOLU + règles chemins |

## Installation

1. Chrome → `chrome://extensions`
2. Activer **Mode développeur**
3. **Charger l'extension non empaquetée** → sélectionner le dossier `kirov5/`
4. Si une ancienne version est chargée : **Recharger** (icône ↻) puis recharger les onglets IA (DeepSeek, etc.)

## Résultat attendu après codegen

```
Downloads/<projet>/
├── 00_PROJECT_META.md
├── 01_PRD.md
├── ...
├── 08_ORDERS.md
├── state.json
├── README.md
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── components/
    ├── hooks/
    ├── store/
    ├── types/
    └── utils/
```

Puis :
```bash
cd Downloads/<projet>
npm install
npm run dev
```

## Récupérer un ancien projet déjà écrit en .txt

Un script de récupération est fourni : `tools/recover-txt-project.cjs`

```bash
node tools/recover-txt-project.cjs /chemin/vers/bn /chemin/vers/bn-react
```

Il renomme `src/main.txt` → `src/main.tsx`, etc., selon le contenu et le dossier.

## Pipeline 4 couches

| # | Document / action |
|---|-------------------|
| 0–8 | Specs (`00_PROJECT_META.md` … `08_ORDERS.md`) |
| 9 | Génération code (`{"files":[{"path":"src/App.tsx",...}]}`) |
| 10 | Écriture disque → `Downloads/<dossier>/` avec **vraies extensions** |

## Modes d'exécution

| Mode | Comportement |
|------|----------------|
| **Chat Web** | Injection DeepSeek/Gemini/ChatGPT/Kimi/Perplexity/Claude + capture DOM |
| **API Directe** | Appels API (clé) DeepSeek / OpenAI / Claude / Gemini / Mistral / Ollama |
| **Hybride** | Specs via API, codegen via chat web |

## Structure

```
kirov5/
├── manifest.json
├── background.js
├── content.js
├── popup.html / .css / .js
├── icons/
├── tools/
│   └── recover-txt-project.cjs
└── lib/
    ├── constants.js
    ├── pack-builder.js
    ├── pack-registry.js
    ├── gatekeeper.js
    ├── command-router.js
    ├── artifact-writer.js   ← FIX principal
    ├── orchestrator.js
    ├── bridge_polling.js
    └── github_pusher.js
```

## Version

**5.1.1** — Fix structure hiérarchique React (extensions .tsx/.ts/.css/.json préservées à l'écriture disque)

## Module Sources GitHub — Pipeline de provenance

L’onglet **Sources** recherche des dépôts publics correspondant à l’idée du projet, exclut par défaut les forks et dépôts archivés, contrôle la licence du dépôt et calcule un score explicable sur 100. Les résultats sont triables par pertinence, activité, popularité ou licence et présentent la description, la technologie, la date de mise à jour et la correspondance avec le besoin.

Après **UTILISER**, l’extension crée le projet s’il n’existe pas, enregistre les références par projet, intègre `SOURCES_GITHUB.md` au pack, ajoute `sources.github.json` aux artefacts et fournit le contexte retenu à l’architecture. Elle lance ensuite le PRD, l’architecture et les tâches. Le pipeline s’arrête avant le code et demande une validation explicite. Après validation, il génère une application originale, audite le `package.json`, exporte `DEPENDENCY_AUDIT.md` et affiche les références dans le `README.md` final.

Les sources restent documentaires : aucun code, dépôt ou paquet externe n’est copié automatiquement. Cette fonctionnalité est une aide de présélection et de traçabilité, pas un avis juridique.

L’action **TÉLÉCHARGER LES SOURCES** est indépendante. Elle enregistre les archives ZIP autorisées dans `Downloads/<projet>/github-sources/`, calcule un hash SHA-256 pour chaque archive et ajoute un `sources.github.json` local. Les archives restent des références de consultation et ne sont pas intégrées à l’application générée.

Lors de l’action **UTILISER**, l’utilisateur choisit entre deux modes : **A**, qui automatise tout jusqu’à une validation avant la génération du code, ou **B**, qui automatise également la génération et l’export final.

Voir `docs/ARCHITECTURE.md`, `docs/PROVENANCE_PIPELINE.md`, `docs/SOURCE_DOWNLOADS.md`, `docs/LICENSE_POLICY.md` et `docs/TESTING.md`.
