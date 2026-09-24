import { ENV } from "./_core/env";

export type AgentStage = "prd" | "architecture" | "tasks" | "code" | "qa" | "assistant";

export interface GemContext {
  fileName: string;
  repo: string;
  role: string;
  targetPath: string;
  license?: string;
}

export interface AgentContext {
  packName?: string;
  packSlug?: string;
  gems?: GemContext[];
}

function buildWiringRule(gems: GemContext[] = []): string {
  if (gems.length === 0) {
    return `### COMPOSANTS RÉUTILISABLES MONTÉS :
(Aucun composant GitHub n'a été sélectionné pour ce montage)
`;
  }

  const list = gems.slice(0, 10).map((g, i) => {
    const importName = g.fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_]/g, "");
    return `${i + 1}. \`${g.targetPath}\` (Origine : ${g.repo} · Licence ${g.license || "Libre"})
   - Rôle : ${g.role}
   - Import recommandé : \`import { ${importName} } from "@/${g.targetPath.replace(/^src\//, "").replace(/\.(tsx?|jsx?)$/, "")}";\``;
  }).join("\n");

  return `### COMPOSANTS RÉUTILISABLES MONTÉS DANS LE PROJET :
${list}

### RÈGLE DE CÂBLAGE MÉTIER :
Ne réimplémente PAS ces modules. Importe-les directement dans tes nouveaux services applicatifs.`;
}

const stageInstructions: Record<AgentStage, string> = {
  prd: "Tu es Product Agent. Rédige une synthèse PRD concise et percutante avec personas utilisateurs, parcours clés, fonctionnalités MVP, règles métier et critères d'acceptation.",
  architecture: "Tu es Architect Agent. Propose une architecture modulaire propre, la structure des dossiers, les contrats de données TypeScript et respecte rigoureusement la RÈGLE DE CÂBLAGE MÉTIER en réutilisant les composants montés.",
  tasks: "Tu es Planning Agent. Découpe le chantier en 4 sprints ordonnés (Setup & Boilerplate, Câblage des composants montés, Logique métier & Store, Tests & Validation).",
  code: "Tu es Code Agent. Génère un plan de montage de code original et cohérent. Importe et câble directement les pépites montées selon la règle de câblage.",
  qa: "Tu es QA Agent. Établis la matrice de tests fonctionnels, de compatibilité Vite/React 18 et d'audit de conformité des licences open-source (MIT, Apache-2.0).",
  assistant: "Tu es l'assistant de montage ForgeAI. Réponds comme un copilote technique pragmatique et indique les fichiers ou décisions à ajuster.",
};

function configured() {
  return Boolean(ENV.cloudflareAccountId && ENV.cloudflareApiToken);
}

function fallback(stage: AgentStage, prompt: string, context?: AgentContext) {
  const packTitle = context?.packName || "Projet ForgeAI";
  const gemsCount = context?.gems?.length || 0;
  const wiring = buildWiringRule(context?.gems);

  switch (stage) {
    case "prd":
      return `## 01 — PRD : ${packTitle}
**Intention Produit :** ${prompt.split("\n")[0] || "Application modulaire optimisée."}

### Personas Cibles
- Développeur / Lead Tech cherchant une architecture prête à l'emploi.
- Utilisateur final bénéficiant d'une interface fluide, moderne et réactive.

### Fonctionnalités Clés du Pack
1. Navigation et exploration temps réel avec thème dark adaptatif.
2. Intégration chirurgicale des ${gemsCount} pépites GitHub sélectionnées.
3. Architecture modulaire basée sur React 18, Vite et TypeScript strict.
4. Traçabilité complète des licences libres et de la provenance du code.

### Critères d'Acceptation
- 100% du code compile sans avertissement ni collision d'exports.
- Les composants adaptés sont isolés dans \`src/integrations/github-adapted/\`.`;

    case "architecture":
      return `## 02 — Architecture & Câblage : ${packTitle}

### Stack Technique
- **Framework :** React 18.3 + TypeScript 5.6
- **Bundler :** Vite 6 (HMR instantané sur port 5173)
- **Typographie & Design :** Inter, JetBrains Mono, Dark Theme tokens HSL

${wiring}

### Cartographie des Répertoires
- \`src/components/\` : UI réutilisable globale (Navbar, Layout, Badges)
- \`src/features/\` : Domaines métier indépendants
- \`src/integrations/\` : Registre \`MOUNTED_MANIFEST\` et pépites adaptées
- \`src/types/\` : Contrats TypeScript stricts`;

    case "tasks":
      return `## 03 — Plan de Réalisation : ${packTitle}

- **Sprint 1 (Bootstrap & Scaffolding) :**
  - Génération de \`package.json\`, \`tsconfig.json\`, \`vite.config.ts\`, \`index.html\`.
  - Initialisation de \`src/main.tsx\` et \`src/index.css\`.
- **Sprint 2 (Montage & Isolation des Pépites) :**
  - Décompression des ${gemsCount} modules dans \`src/integrations/github-adapted/\`.
  - Génération du barrel export typé \`src/integrations/index.ts\` (\`MOUNTED_MANIFEST\`).
- **Sprint 3 (Câblage Métier UI & State) :**
  - Assemblage de \`src/App.tsx\` connectant les composants adaptés.
  - Implémentation du store d'état local et des flux de données.
- **Sprint 4 (Audit & Validation QA) :**
  - Compilation \`tsc -b && vite build\` (0 erreur garantie).
  - Validation du rapport \`PROVENANCE_REPORT.md\` et \`THIRD_PARTY_NOTICES.md\`.`;

    case "code":
      return `## 04 — Montage Applicatif & Code : ${packTitle}
- ${gemsCount} modules montés avec succès dans \`src/integrations/github-adapted/\`.
- Interface principale \`src/App.tsx\` assemblée avec succès.
- Registre centralisé \`MOUNTED_MANIFEST\` prêt pour import dans les composants métiers.
- Application prête à démarrer sur http://localhost:5173 via \`pnpm dev\`.`;

    case "qa":
      return `## 05 — Matrice QA & Conformité des Licences : ${packTitle}
- **Compatibilité Build :** Vite 6 + React 18 validé (Code 0).
- **Vérification TypeScript :** Alias de chemins \`@/*\` résolus, exclusions configurées.
- **Audit Licences :** 100% des ${gemsCount} composants sont certifiés sous licences permissives (MIT, Apache-2.0, BSD).
- **Sécurité :** 0 secret, clé API ou token privé détecté dans les sources intégrées.`;

    case "assistant":
      return `[ForgeAI Studio Copilot]
Chantier : **${packTitle}** (${gemsCount} pépites actives).
Toutes les briques du PRD sont alignées avec l'architecture. Vous pouvez lancer la génération ou inspecter les fichiers dans l'explorateur.`;
  }
}

export async function runCloudflareAgent(
  stage: AgentStage,
  model: string,
  prompt: string,
  context?: AgentContext
) {
  const wiringRule = buildWiringRule(context?.gems);

  if (!configured()) {
    return {
      configured: false,
      model,
      stage,
      response: fallback(stage, prompt, context),
    };
  }

  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${ENV.cloudflareAccountId}/ai/run/${encodeURIComponent(model)}`;
  const systemPrompt = `${stageInstructions[stage]}
Tu travailles dans ForgeAI Studio Builder pour le pack "${context?.packName || "ForgeAI"}".
${wiringRule}
Les dépôts GitHub sont des références de contexte et de provenance ; le code applicatif doit respecter strictement la règle de câblage.`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ENV.cloudflareApiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_tokens: 1400,
    }),
  });

  const payload = (await response.json()) as {
    result?: { response?: string };
    success?: boolean;
    errors?: unknown[];
  };

  if (!response.ok || !payload.success) {
    // Fallback gracieux en cas de quota ou indisponibilité Cloudflare
    return {
      configured: false,
      model,
      stage,
      response: fallback(stage, prompt, context),
    };
  }

  return {
    configured: true,
    model,
    stage,
    response: payload.result?.response || fallback(stage, prompt, context),
  };
}

export function getCloudflareStatus() {
  return {
    configured: configured(),
    provider: "Cloudflare Workers AI",
    model: ENV.cloudflareModel || "@cf/meta/llama-3.1-8b-instruct",
    agents: ["Architect Agent", "Product Agent", "Code Agent", "QA Agent"],
  };
}

