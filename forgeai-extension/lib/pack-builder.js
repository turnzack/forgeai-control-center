/* Instruction Pack Builder — KIROV5 v5.1.0
   Prompts de niveau Senior (PM / Architecte / Dev) + enrichissement cumulatif
   Chaque étape reçoit le contexte de toutes les étapes précédentes.
*/

class PackBuilder {
  static build(projectName, projectDescription, options = {}) {
    const now = new Date().toISOString();
    const documents = this.generateDocuments(projectName, projectDescription, options);

    const state = {
      currentStep: 0,
      completedSteps: [],
      lockedSteps: {},
      accessLog: [],
      artifacts: {},
      codeFiles: [],
      createdAt: now,
      updatedAt: now,
      status: "intake_complete",
      folderName: options.folderName || projectName.replace(/[^a-zA-Z0-9_-]/g, "_"),
      execMode: options.execMode || "web",
      webAi: options.webAi || "deepseek",
    };

    return { projectName, projectDescription, documents, state, version: "5.1.0" };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // HELPER — Enrichissement cumulatif : injecte les artefacts précédents
  // ──────────────────────────────────────────────────────────────────────────
  static enrichedContext(artifacts, maxCharsPerDoc = 3000) {
    const entries = Object.entries(artifacts || {});
    if (!entries.length) return "";
    return (
      "\n\n---\n## 📋 Contexte des étapes précédentes\n\n" +
      entries
        .map(([k, v]) => `### ${k}\n${String(v || "").slice(0, maxCharsPerDoc)}`)
        .join("\n\n")
    );
  }

  // Construit le prompt enrichi d'une étape en injectant le contexte cumulatif
  static buildEnrichedDocument(baseDoc, artifacts) {
    const ctx = this.enrichedContext(artifacts);
    if (!ctx) return baseDoc;
    return baseDoc + ctx;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // GÉNÉRATION DES DOCUMENTS (placeholders enrichis)
  // ──────────────────────────────────────────────────────────────────────────
  static generateDocuments(name, description, options = {}) {
    const docs = {};
    docs["00_PROJECT_META.md"] = this.projectMeta(name, description, options);
    docs["01_PRD.md"]           = this.prdPrompt(name, description);
    docs["02_ARCHITECTURE.md"]  = this.architecturePrompt(name, description);
    docs["03_SKILLS.yaml"]      = this.skillsPrompt(name, description);
    docs["04_TASKS.md"]         = this.tasksPrompt(name, description);
    docs["05_FILE_TREE.md"]     = this.fileTreePrompt(name, description);
    docs["06_PROMPT_WORKFLOW.md"] = this.promptWorkflowDoc(name);
    docs["07_VALIDATION_RULES.md"] = this.validationRules();
    docs["08_ORDERS.md"]        = this.ordersDoc();
    return docs;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ÉTAPE 0 — Métadonnées Projet
  // ──────────────────────────────────────────────────────────────────────────
  static projectMeta(name, description, options = {}) {
    return [
      `# Project: ${name}`,
      "",
      `**Description:** ${description}`,
      "",
      `**Créé:** ${new Date().toISOString()}`,
      `**Mode d'exécution:** ${options.execMode || "web"}`,
      `**IA Cible:** ${options.webAi || "deepseek"}`,
      `**Dossier:** ${options.folderName || name}`,
      "",
      "## Pipeline 11 Étapes — Architecture 4 Couches",
      "",
      "| Couche | Étapes | Rôle |",
      "|--------|--------|------|",
      "| **Intake** | 0 | Métadonnées projet |",
      "| **Spec** | 1-3 | PRD, Architecture, Skills |",
      "| **Plan** | 4-6 | Tasks, File Tree, Workflow |",
      "| **Gate** | 7-8 | Validation, Orders |",
      "| **Code** | 9 | Génération du code source |",
      "| **Write** | 10 | Écriture automatique sur disque |",
      "",
      "## Principe",
      "",
      "L'extension est l'**orchestrateur**. Le LLM est un **exécuteur contrôlé**",
      "qui ne voit qu'un document à la fois, dans l'ordre strict du pipeline.",
      "",
      "## Objectif Final",
      "",
      "Tous les fichiers sources de l'application seront écrits automatiquement",
      `dans le dossier \`Downloads/${options.folderName || name}/\` à la fin du pipeline.`,
    ].join("\n");
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ÉTAPE 1 — PRD (Product Requirements Document)
  // ──────────────────────────────────────────────────────────────────────────
  static prdPrompt(name, description) {
    return [
      `# 01 — Product Requirements Document`,
      "",
      `> **Instruction pour le LLM :** Tu es un Product Manager Senior.`,
      `> Génère le PRD COMPLET et DÉTAILLÉ pour le projet **"${name}"**.`,
      "",
      `**Brief projet :** ${description}`,
      "",
      "## Structure obligatoire (respecte chaque section) :",
      "",
      "### 1. Objectif Produit",
      "Décris en 3-5 phrases le but principal du produit et la valeur qu'il apporte.",
      "",
      "### 2. Problème Résolu",
      "Quel problème concret résout ce produit ? Pour qui ? Avec quelle urgence ?",
      "",
      "### 3. Personas Utilisateurs",
      "Définis 2-3 personas avec : nom fictif, rôle, besoins, frustrations actuelles.",
      "",
      "### 4. User Stories",
      "Format obligatoire : `En tant que [persona], je veux [action], afin de [bénéfice].`",
      "Minimum 8 user stories couvrant tous les flux principaux.",
      "",
      "### 5. Fonctionnalités (MoSCoW)",
      "- **Must Have** : fonctionnalités bloquantes pour le MVP",
      "- **Should Have** : importantes mais non bloquantes",
      "- **Could Have** : nice-to-have si temps disponible",
      "- **Won't Have** : explicitement hors périmètre",
      "",
      "### 6. Exigences Non-Fonctionnelles",
      "Performance, sécurité, accessibilité (WCAG AA), responsive, offline support.",
      "",
      "### 7. Critères d'Acceptation",
      "Pour chaque Must Have : critère binaire et testable (✅ / ❌).",
      "",
      "### 8. Métriques de Succès",
      "KPIs mesurables à 30, 60, 90 jours.",
      "",
      "**Règles absolues :** Contenu 100% complet. Aucun placeholder. Aucun TODO.",
      "Produis un PRD de niveau production que toute une équipe pourrait utiliser.",
    ].join("\n");
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ÉTAPE 2 — Architecture Technique
  // ──────────────────────────────────────────────────────────────────────────
  static architecturePrompt(name, description) {
    return [
      `# 02 — Architecture Technique`,
      "",
      `> **Instruction pour le LLM :** Tu es un Architecte Logiciel Senior.`,
      `> Sur la base du PRD (contexte ci-dessous), conçois l'architecture COMPLÈTE`,
      `> pour **"${name}"** en React 18 + TypeScript + Vite.`,
      "",
      `**Brief :** ${description}`,
      "",
      "## Structure obligatoire :",
      "",
      "### 1. Stack Technologique Justifiée",
      "- Frontend : React 18 + TypeScript 5 + Vite 5",
      "- Router : HashRouter (JAMAIS BrowserRouter — contrainte APK)",
      "- État global : précise si useState seul ou Zustand/Context selon complexité",
      "- Styles : Tailwind CSS v3 + composants Headless UI si nécessaire",
      "- Icons : Lucide React",
      "- HTTP : fetch natif ou axios (justifie ton choix)",
      "",
      "### 2. Diagramme des Composants (ASCII)",
      "```",
      "App",
      "├── Layout",
      "│   ├── Header",
      "│   └── Sidebar",
      "└── Pages",
      "    ├── HomePage",
      "    └── ...",
      "```",
      "Adapte ce schéma au projet réel.",
      "",
      "### 3. Modèle de Données",
      "Interfaces TypeScript pour chaque entité principale.",
      "",
      "### 4. Structure des Dossiers",
      "Arborescence complète avec le rôle de chaque dossier.",
      "",
      "### 5. Flux de Données",
      "Décris comment les données circulent : API → Store → Composants → UI.",
      "",
      "### 6. Gestion des Erreurs",
      "Stratégie globale : Error Boundaries, try/catch, toast notifications.",
      "",
      "### 7. Performance",
      "Lazy loading, memoization, bundle splitting.",
      "",
      "### 8. Sécurité",
      "XSS prevention, input sanitization, HTTPS only.",
      "",
      "**Règles :** Architecture production-ready. Pas de choix génériques non justifiés.",
    ].join("\n");
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ÉTAPE 3 — Skills YAML
  // ──────────────────────────────────────────────────────────────────────────
  static skillsPrompt(name, description) {
    return [
      `# 03 — Skills Definition`,
      "",
      `> **Instruction pour le LLM :** Génère le fichier YAML de définition des skills`,
      `> pour le projet **"${name}"**.`,
      "",
      `**Brief :** ${description}`,
      "",
      "## Format YAML obligatoire :",
      "",
      "```yaml",
      "project: nom_du_projet",
      "version: 1.0.0",
      "stack:",
      "  framework: react",
      "  language: typescript",
      "  bundler: vite",
      "  router: hash-router",
      "  styling: tailwindcss",
      "",
      "constraints:",
      "  - Jamais BrowserRouter",
      "  - index.html minuscules avec id=root",
      "  - package.json type=module build=vite-build",
      "  - Pas de fichiers .vue",
      "",
      "skills:",
      "  - id: skill_001",
      "    name: NomDuSkill",
      "    description: Ce que fait ce skill",
      "    inputs:",
      "      - nom: description",
      "    outputs:",
      "      - nom: description",
      "    dependencies: []",
      "    files:",
      "      - src/components/NomDuSkill.tsx",
      "```",
      "",
      "Génère un skill pour chaque fonctionnalité majeure identifiée dans le PRD.",
      "Minimum 5 skills. Chaque skill doit être atomique et réutilisable.",
      "**Produis du YAML valide uniquement. Aucun texte en dehors du bloc YAML.**",
    ].join("\n");
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ÉTAPE 4 — Task Breakdown
  // ──────────────────────────────────────────────────────────────────────────
  static tasksPrompt(name, description) {
    return [
      `# 04 — Task Breakdown`,
      "",
      `> **Instruction pour le LLM :** Tu es un Tech Lead Senior. Décompose`,
      `> **"${name}"** en tâches d'implémentation ordonnées et actionnables.`,
      "",
      `**Brief :** ${description}`,
      "",
      "## Format obligatoire par tâche :",
      "",
      "```",
      "### TASK-001 : Titre de la tâche",
      "- **Phase :** setup | ui | logic | integration | polish",
      "- **Priorité :** P0 (bloquant) | P1 (important) | P2 (amélioration)",
      "- **Complexité :** XS | S | M | L | XL",
      "- **Dépendances :** TASK-xxx, TASK-xxx",
      "- **Description :** Ce qu'il faut faire exactement.",
      "- **Fichiers produits :**",
      "  - src/components/Nom.tsx",
      "  - src/hooks/useNom.ts",
      "- **Critère d'acceptation :** Comment savoir que c'est terminé ?",
      "```",
      "",
      "## Phases :",
      "1. **Setup** (T001-T010) : Initialisation, config, routing, layout de base",
      "2. **UI** (T011-T030) : Tous les composants visuels",
      "3. **Logic** (T031-T050) : Hooks, state, business logic",
      "4. **Integration** (T051-T060) : API calls, data fetching",
      "5. **Polish** (T061+) : Animations, responsive, optimisations",
      "",
      "**Minimum 15 tâches. Ordre strict du plus fondamental au plus avancé.**",
      "**Règle : chaque tâche doit pouvoir être assignée à un développeur seul.**",
    ].join("\n");
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ÉTAPE 5 — File Tree
  // ──────────────────────────────────────────────────────────────────────────
  static fileTreePrompt(name, description) {
    return [
      `# 05 — File Tree`,
      "",
      `> **Instruction pour le LLM :** Génère l'arborescence COMPLÈTE de tous les`,
      `> fichiers du projet **"${name}"** qui seront créés lors de la codegen.`,
      "",
      `**Brief :** ${description}`,
      "",
      "## Structure obligatoire :",
      "",
      "```",
      `${name.replace(/[^a-zA-Z0-9_-]/g, "_")}/`,
      "├── index.html                    # Point d'entrée HTML (id=root)",
      "├── package.json                  # Dépendances (type=module)",
      "├── vite.config.ts                # Config Vite + React plugin",
      "├── tsconfig.json                 # TypeScript config",
      "├── tailwind.config.js            # Tailwind config",
      "├── postcss.config.js             # PostCSS",
      "└── src/",
      "    ├── main.tsx                  # Entrée React",
      "    ├── App.tsx                   # Router + Layout racine",
      "    ├── index.css                 # Styles globaux + Tailwind",
      "    ├── components/               # Composants réutilisables",
      "    ├── pages/                    # Pages (une par route)",
      "    ├── hooks/                    # Hooks personnalisés",
      "    ├── store/                    # State global",
      "    ├── types/                    # Types TypeScript",
      "    └── utils/                    # Fonctions utilitaires",
      "```",
      "",
      "Adapte cette structure au projet réel. Ajoute tous les fichiers nécessaires.",
      "Pour chaque fichier : indique son rôle en commentaire inline.",
      "**Liste exhaustive — la codegen s'appuiera sur cette arborescence exacte.**",
    ].join("\n");
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ÉTAPE 6 — Prompt Workflow (séquençage de la codegen)
  // ──────────────────────────────────────────────────────────────────────────
  static promptWorkflowDoc(name) {
    return [
      `# 06 — Prompt Workflow`,
      "",
      `> **Instruction pour le LLM :** Décris le séquençage optimal des prompts`,
      `> pour générer tout le code de **"${name}"** en une seule passe.`,
      "",
      "## Stratégie de génération :",
      "",
      "### Contexte à injecter dans le prompt codegen",
      "Le prompt de génération de code doit inclure dans cet ordre :",
      "1. SILENCE_ABSOLU (règles de format JSON strict)",
      "2. PRD complet (objectifs, user stories, fonctionnalités)",
      "3. Architecture technique (stack, composants, interfaces)",
      "4. Arborescence des fichiers (liste exacte des fichiers à créer)",
      "5. Rules de validation (HashRouter, type=module, etc.)",
      "6. Ordre de génération (du plus fondamental au plus dépendant)",
      "",
      "### Ordre de génération recommandé",
      "1. `index.html`, `package.json`, `vite.config.ts`, `tsconfig.json`",
      "2. `tailwind.config.js`, `postcss.config.js`, `src/index.css`",
      "3. `src/main.tsx`, `src/App.tsx`",
      "4. `src/types/*.ts` (tous les types d'abord)",
      "5. `src/utils/*.ts` (fonctions pures, pas de dépendances UI)",
      "6. `src/hooks/*.ts` (logique métier)",
      "7. `src/components/*.tsx` (du plus simple au plus complexe)",
      "8. `src/pages/*.tsx` (assemblage des composants)",
      "",
      "### Format de sortie attendu",
      "```json",
      "{\"files\":[",
      "  {\"path\":\"index.html\",\"content\":\"<!DOCTYPE html>...\",\"language\":\"html\"},",
      "  {\"path\":\"src/App.tsx\",\"content\":\"import...\",\"language\":\"tsx\"}",
      "]}",
      "```",
      "",
      "**Ce workflow garantit que chaque fichier peut être écrit dans l'ordre",
      "sans jamais créer de dépendances circulaires.**",
    ].join("\n");
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ÉTAPE 7 — Validation Rules (statique, toujours le même)
  // ──────────────────────────────────────────────────────────────────────────
  static validationRules() {
    return [
      "# 07 — Validation Rules",
      "",
      "## Règles critiques (bloquantes si violées)",
      "",
      "### R1 — index.html",
      "- Nom en minuscules : `index.html` (jamais `Index.html`)",
      "- Doit contenir `id=\"root\"` exactement",
      "- Doit charger `./src/main.tsx` ou équivalent",
      "",
      "### R2 — Router",
      "- `HashRouter` OBLIGATOIRE (compatibilité APK / fichier statique)",
      "- `BrowserRouter` INTERDIT — provoque un écran blanc dans l'APK",
      "",
      "### R3 — package.json",
      "- `\"type\": \"module\"` obligatoire",
      "- `\"build\": \"vite build\"` obligatoire (jamais tsc seul)",
      "- Aucune dépendance interdite : expo-router, react-native, @expo, vue",
      "",
      "### R4 — Fichiers interdits",
      "- Pas de `package.js` (c'est `package.json`)",
      "- Pas de `tsconfig.js` (c'est `tsconfig.json`)",
      "- Pas de `App.ts` avec JSX (c'est `App.tsx`)",
      "- Pas de `main.js` (c'est `main.tsx`)",
      "- Pas de fichiers `.vue`",
      "",
      "### R5 — JSX",
      "- Toutes les balises JSX DOIVENT être fermées",
      "- Template strings AVEC backticks (jamais concaténation +)",
      "- Pas de préfixe de langage dans le contenu des fichiers",
      "",
      "### R6 — Format JSON (codegen)",
      "- Output UNIQUE : `{\"files\":[{\"path\":\"...\",\"content\":\"...\",\"language\":\"...\"}]}`",
      "- Aucun texte conversationnel avant ou après le JSON",
      "- JSON valide et équilibré (accolades, crochets)",
      "",
      "## Corrections automatiques (appliquées par KIROV5)",
      "- `Index.html` → `index.html`",
      "- `BrowserRouter` → `HashRouter`",
      "- `package.js` + JSON → `package.json`",
      "- `App.ts` + JSX → `App.tsx`",
      "- Préfixe langage en première ligne → supprimé",
      "- `package.json` : `type=module` et `build=vite build` forcés",
    ].join("\n");
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ÉTAPE 8 — Orders (commandes JSON du pipeline)
  // ──────────────────────────────────────────────────────────────────────────
  static ordersDoc() {
    const orders = PIPELINE_STEPS.filter((s) => s.document).map(
      (s) => `- Step ${s.id}: \`{"action": "${s.order}", "document": "${s.document}"}\` — ${s.label}`
    );
    return [
      "# 08 — Orders d'Exécution",
      "",
      "## Commandes envoyées par l'orchestrateur KIROV5",
      "",
      ...orders,
      "",
      '- Step 9: `{"action": "codegen"}` — génère TOUS les fichiers source en JSON',
      '- Step 10: `{"action": "finalize"}` — écriture automatique sur disque',
      "",
      "## Règles Gatekeeper",
      "",
      "- Le LLM ne voit QUE le document de l'étape COURANTE",
      "- Accès non autorisé → erreur + liste des documents disponibles + retry",
      "- Avancement uniquement après validation de l'étape courante",
      "- Chaque étape est verrouillée après complétion",
      "",
      "## Prompt de Codegen (Step 9)",
      "",
      "```",
      "[SILENCE ABSOLU — RÈGLE S1]",
      "Tu es un développeur Full-Stack Senior React/TypeScript.",
      "Génère le CODE COMPLET de l'application selon les specs ci-dessous.",
      "",
      "Réponds UNIQUEMENT avec le JSON valide :",
      "{\"files\":[{\"path\":\"...\",\"content\":\"...\",\"language\":\"...\"}]}",
      "",
      "CONTRAINTES ABSOLUES :",
      "- HashRouter, jamais BrowserRouter",
      "- index.html minuscules avec id=root",
      "- package.json type=module, build=vite build",
      "- Tous les fichiers nécessaires pour `npm install && npm run dev`",
      "```",
    ].join("\n");
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MÉTHODE PUBLIQUE — Prompt codegen enrichi (appelée par orchestrator.js)
  // ──────────────────────────────────────────────────────────────────────────
  static buildCodegenPrompt(projectName, artifacts) {
    // Unwrap nested JSON envelopes so the LLM sees real specs
    const cleanArts = {};
    for (const [k, v] of Object.entries(artifacts || {})) {
      if (k.startsWith("CODE_")) continue;
      let body = v || "";
      if (typeof ArtifactWriter !== "undefined" && ArtifactWriter.unwrapArtifactContent) {
        body = ArtifactWriter.unwrapArtifactContent(body, k);
      }
      cleanArts[k] = body;
    }
    const ctx = this.enrichedContext(cleanArts, 4000);
    return [
      "[SILENCE ABSOLU — RÈGLE S1 — KIROV5 ORCHESTRATOR v5.1.1]",
      "Tu es un développeur Full-Stack Senior React/TypeScript/Vite.",
      `Génère le CODE COMPLET et FONCTIONNEL de l'application "${projectName}".`,
      "",
      "RÈGLES ABSOLUES :",
      "1. Réponds UNIQUEMENT avec du JSON valide",
      '2. Format strict : {"files":[{"path":"...","content":"...","language":"..."}]}',
      "3. HashRouter OBLIGATOIRE (jamais BrowserRouter)",
      "4. index.html en minuscules avec id=\"root\"",
      "5. package.json : type=module, build=vite build, scripts.dev=vite",
      "6. AUCUN fichier .vue, package.js, App.ts, main.js, *.txt",
      "7. Toutes les balises JSX fermées",
      "8. Code 100% fonctionnel — `npm install && npm run dev` doit marcher",
      "9. Pas de TODO, pas de placeholder, pas de texte conversationnel",
      "10. Génère TOUS les fichiers listés dans le File Tree",
      "11. Les sources GitHub du contexte sont des références documentaires uniquement : ne copie aucun code, n’importe aucun paquet depuis GitHub et produis une implémentation originale.",
      "12. Limite les dépendances aux besoins explicites du PRD ; utilise des versions npm déterministes et jamais une URL, un dépôt git, `latest` ou `*`.",
      "",
      "RÈGLES DE CHEMINS (CRITIQUE — structure React) :",
      "- Chaque path DOIT avoir l'extension correcte : .tsx .ts .css .html .json .js",
      "- JAMAIS d'extension .txt — INTERDIT",
      "- Composants React (JSX) → .tsx  ex: src/App.tsx, src/components/Board.tsx",
      "- Hooks / utils / store / types / services → .ts  ex: src/hooks/useGame.ts",
      "- Styles → .css  ex: src/index.css",
      "- Config → vite.config.ts, tailwind.config.js, postcss.config.js, tsconfig.json",
      "- Entrée : index.html + src/main.tsx + src/App.tsx + package.json OBLIGATOIRES",
      "",
      "EXEMPLE DE SORTIE VALIDE :",
      '{"files":[',
      '  {"path":"index.html","content":"<!DOCTYPE html>...","language":"html"},',
      '  {"path":"package.json","content":"{\\"name\\":\\"...\\"}","language":"json"},',
      '  {"path":"vite.config.ts","content":"import { defineConfig }...","language":"ts"},',
      '  {"path":"src/main.tsx","content":"import React from \\"react\\"...","language":"tsx"},',
      '  {"path":"src/App.tsx","content":"import { HashRouter }...","language":"tsx"},',
      '  {"path":"src/index.css","content":"@tailwind base;...","language":"css"}',
      "]}",
      "",
      "STACK OBLIGATOIRE :",
      "- React 18 + TypeScript 5 + Vite 5",
      "- Tailwind CSS v3",
      "- HashRouter de react-router-dom",
      "- Lucide React pour les icônes",
      ctx,
    ].join("\n");
  }
}
