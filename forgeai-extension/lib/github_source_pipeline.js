/* ForgeAI Studio — source-aware project preparation and provenance controls. */
const GitHubSourcePipeline = (() => {
  const SOURCE_MARKDOWN = "SOURCES_GITHUB.md";
  const SOURCE_JSON = "sources.github.json";
  const DEPENDENCY_AUDIT = "DEPENDENCY_AUDIT.md";
  const MAX_AUTOMATED_SOURCES = 8;

  function now() { return new Date().toISOString(); }
  function compact(value, max = 800) { return String(value || "").trim().replace(/\s+/g, " ").slice(0, max); }
  function markdownCell(value, fallback = "—") { return compact(value || fallback, 500).replace(/\|/g, "\\|").replace(/[\r\n]+/g, " "); }

  function deriveProjectName(description) {
    const words = compact(description, 160)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 1)
      .slice(0, 5);
    const title = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    return title || "Projet avec sources GitHub";
  }

  function toSourceRecord(candidate) {
    return {
      repository: compact(candidate.repository || candidate.fullName, 200),
      url: compact(candidate.url, 500),
      branch: compact(candidate.branch || candidate.defaultBranch || "main", 120),
      commit: candidate.commit || null,
      description: compact(candidate.description, 1200),
      technology: compact(candidate.technology || candidate.language, 160),
      topics: Array.isArray(candidate.topics) ? candidate.topics.map((topic) => compact(topic, 80)).filter(Boolean).slice(0, 20) : [],
      updatedAt: candidate.updatedAt || candidate.pushedAt || null,
      capabilities: Array.isArray(candidate.capabilities) ? candidate.capabilities.map((capability) => compact(capability.label || capability.id || capability, 160)).filter(Boolean) : [],
      matchReasons: Array.isArray(candidate.matchReasons || candidate.reasons) ? (candidate.matchReasons || candidate.reasons).map((reason) => compact(reason, 280)).filter(Boolean).slice(0, 8) : [],
      score: Math.max(0, Math.min(100, Number(candidate.score) || 0)),
      scoreBreakdown: candidate.scoreBreakdown && typeof candidate.scoreBreakdown === "object" ? candidate.scoreBreakdown : {},
      license: compact(candidate.license || candidate.licenseCheck?.spdxId || "NOASSERTION", 120),
      licenseName: compact(candidate.licenseName || candidate.licenseCheck?.name || "Licence inconnue", 240),
      licenseStatus: compact(candidate.licenseStatus || candidate.licenseDecision?.status || "unknown", 24),
      licensePolicy: compact(candidate.licensePolicy || candidate.licenseDecision?.policy || "", 80),
      licenseReason: compact(candidate.licenseReason || candidate.licenseDecision?.reason || "", 500),
      repositoryLicenseChecked: Boolean(candidate.repositoryLicenseChecked ?? candidate.licenseCheck?.repositoryLicenseChecked),
      dependencyLicensesChecked: false,
      action: "reference-only",
      selectedAt: candidate.selectedAt || now(),
    };
  }

  function assertAutomationEligible(sources) {
    if (!Array.isArray(sources) || !sources.length) {
      const error = new Error("Sélectionnez au moins une source GitHub avant de préparer le projet.");
      error.code = "SOURCE_SELECTION_EMPTY";
      throw error;
    }
    if (sources.length > MAX_AUTOMATED_SOURCES) {
      const error = new Error(`Sélectionnez au maximum ${MAX_AUTOMATED_SOURCES} sources pour conserver un contexte d’architecture exploitable.`);
      error.code = "SOURCE_SELECTION_TOO_LARGE";
      throw error;
    }
    const incompatible = sources.filter((source) => source.licenseStatus !== "allowed" || !source.repositoryLicenseChecked);
    if (incompatible.length) {
      const names = incompatible.map((source) => source.repository).filter(Boolean).join(", ");
      const error = new Error(`Automatisation bloquée : les licences doivent être autorisées et vérifiées par GitHub (${names}). Retirez les sources « à vérifier », bloquées ou non vérifiables.`);
      error.code = "SOURCE_LICENSE_REVIEW_REQUIRED";
      throw error;
    }
  }

  function buildArchitectureContext(sources, policy) {
    const rows = (sources || []).map((source) => [
      `- Dépôt : ${source.repository}`,
      `  Description : ${compact(source.description, 420) || "non renseignée"}`,
      `  Technologie : ${source.technology || "non renseignée"}`,
      `  Mise à jour : ${source.updatedAt || "non renseignée"}`,
      `  Licence : ${source.license} (${source.licenseStatus})`,
      `  Correspondance : ${(source.capabilities || []).join(", ") || "à apprécier"}`,
      `  Référence : ${source.url}`,
    ].join("\n")).join("\n\n");
    return [
      "## Contexte de références GitHub approuvées",
      "",
      `Politique appliquée : **${policy || "commercial-permissive"}**. Les dépôts ci-dessous sont des références documentaires uniquement : ils ne doivent pas être copiés, importés comme dépendances, ni réimplémentés ligne à ligne.`,
      "",
      "Conçois une implémentation originale qui répond au PRD. Justifie la technologie retenue et ne conserve que les dépendances nécessaires au besoin produit.",
      "",
      rows || "Aucune référence approuvée.",
    ].join("\n");
  }

  function readPackageJson(codeFiles) {
    const file = (codeFiles || []).find((entry) => String(entry.path || "").split("/").pop() === "package.json");
    if (!file) return { error: "Le projet généré ne contient pas de package.json." };
    try { return { file, packageJson: JSON.parse(String(file.content || "")) }; }
    catch (_) { return { error: "Le package.json généré n’est pas un JSON valide." }; }
  }

  function auditDependencies(codeFiles) {
    const parsed = readPackageJson(codeFiles);
    if (parsed.error) return { valid: false, message: parsed.error, dependencies: [], markdown: `# Audit des dépendances\n\n> Échec : ${parsed.error}\n` };

    const packageGroups = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];
    const dependencies = [];
    const issues = [];
    packageGroups.forEach((group) => {
      const values = parsed.packageJson[group] || {};
      if (!values || typeof values !== "object" || Array.isArray(values)) {
        if (values) issues.push(`Le champ ${group} doit être un objet npm.`);
        return;
      }
      Object.entries(values).forEach(([name, version]) => {
        const spec = String(version || "").trim();
        dependencies.push({ group, name, version: spec });
        if (!name || !spec) issues.push(`Dépendance invalide dans ${group}.`);
        if (/^(github:|git\+|https?:|ssh:|file:|link:|\.\.?\/)/i.test(spec)) {
          issues.push(`${name} utilise une source non verrouillée ou locale (${spec}).`);
        }
        if (spec === "*" || /\blatest\b/i.test(spec)) {
          issues.push(`${name} utilise une version non déterministe (${spec}).`);
        }
      });
    });
    const duplicates = dependencies.filter((item, index, values) => values.findIndex((other) => other.name === item.name) !== index);
    duplicates.forEach((item) => issues.push(`${item.name} est déclaré dans plusieurs groupes de dépendances.`));

    const runtime = dependencies.filter((item) => item.group === "dependencies");
    const markdown = [
      "# Audit des dépendances",
      "",
      "> Contrôle automatique de cohérence : les références GitHub sont consultées comme documentation uniquement et ne deviennent jamais des dépendances directes.",
      "",
      `Généré le : ${now()}`,
      "",
      "## Dépendances déclarées",
      "",
      "| Groupe | Paquet | Version |",
      "|---|---|---|",
      ...(dependencies.length ? dependencies.map((item) => `| ${item.group} | ${markdownCell(item.name)} | ${markdownCell(item.version)} |`) : ["| — | Aucune dépendance déclarée | — |"]),
      "",
      "## Conclusion",
      "",
      issues.length
        ? `**Non conforme.** ${issues.join(" ")}`
        : `**Conforme.** ${runtime.length} dépendance(s) d’exécution et ${dependencies.length - runtime.length} dépendance(s) de développement déclarées avec des versions npm déterministes.`,
      "",
      "Les dépendances restent à limiter à celles nécessaires aux fonctionnalités du PRD. Cet audit n’est pas un avis de sécurité ou de licence.",
    ].join("\n");
    return { valid: !issues.length, message: issues.join(" "), dependencies, markdown };
  }

  async function prepareProject(options = {}) {
    const policy = options.policy || "commercial-permissive";
    const automationMode = options.automationMode === "full-auto" ? "full-auto" : "approval-gate";
    const sources = (options.sources || []).map((candidate) => {
      const source = toSourceRecord(candidate);
      const decision = LicensePolicy.evaluate(source.license, policy);
      return {
        ...source,
        licenseStatus: decision.status,
        licensePolicy: decision.policy,
        licenseReason: decision.reason,
      };
    });
    assertAutomationEligible(sources);

    let pack = await PackRegistry.getPack();
    let created = false;
    if (!pack) {
      if (options.autoCreate === false) {
        const error = new Error("Aucun projet actif. Activez la création automatique ou créez un projet avant d’utiliser les sources.");
        error.code = "SOURCE_PROJECT_REQUIRED";
        throw error;
      }
      const description = compact(options.projectDescription || options.projectIdea, 4000);
      if (!description) {
        const error = new Error("Une description de projet est requise pour créer automatiquement le projet.");
        error.code = "SOURCE_PROJECT_DESCRIPTION_REQUIRED";
        throw error;
      }
      const name = compact(options.projectName, 140) || deriveProjectName(description);
      const createdResult = await Orchestrator.createProject(name, description, {
        folderName: options.folderName,
        execMode: options.execMode,
        webAi: options.webAi,
      });
      if (!createdResult.success) throw new Error(createdResult.message || "Création automatique du projet impossible.");
      pack = createdResult.pack;
      created = true;
    }

    const projectId = String(pack.projectName || pack.state?.folderName || "default");
    const storedSources = await ProjectSources.set(projectId, sources);
    const manifest = await SourceManifest.build(projectId);
    pack = await PackRegistry.getPack();
    if (!pack) throw new Error("Le projet actif a disparu pendant la préparation des sources.");

    pack.documents = pack.documents || {};
    pack.state = pack.state || {};
    pack.state.artifacts = pack.state.artifacts || {};
    pack.documents[SOURCE_MARKDOWN] = manifest.markdown;
    pack.state.artifacts[SOURCE_MARKDOWN] = manifest.markdown;
    pack.state.artifacts[SOURCE_JSON] = manifest.json;
    pack.state.sourceContext = { architecture: buildArchitectureContext(storedSources, policy), updatedAt: now() };
    pack.state.sourceReferences = storedSources;
    pack.state.sourcePipeline = {
      version: "1.0.0",
      policy,
      automationMode,
      referenceOnly: true,
      selectedAt: now(),
      projectId,
    };
    pack.state.codegenApproval = automationMode === "full-auto"
      ? { status: "approved", requestedAt: now(), approvedAt: now(), reason: "Mode B sélectionné par l’utilisateur." }
      : { status: "pending", requestedAt: now(), reason: "Validation explicite requise avant la génération du code source." };
    if (!pack.state.completedSteps?.length) pack.state.status = "sources_ready";
    pack.state.updatedAt = now();
    await PackRegistry.savePack(pack);

    return { success: true, created, projectId, pack, sources: storedSources, artifacts: manifest };
  }

  async function approveCodegen() {
    const pack = await PackRegistry.getPack();
    if (!pack?.state?.sourcePipeline) return { success: false, message: "Aucun pipeline avec sources GitHub n’attend de validation." };
    const step = PIPELINE_STEPS[pack.state.currentStep];
    if (!step || step.order !== "codegen") return { success: false, message: "La validation du code n’est disponible qu’après les spécifications et les tâches." };
    pack.state.codegenApproval = { status: "approved", requestedAt: pack.state.codegenApproval?.requestedAt || now(), approvedAt: now() };
    pack.state.status = "codegen_approved";
    pack.state.updatedAt = now();
    await PackRegistry.savePack(pack);
    return { success: true, pack };
  }

  function requiresCodegenApproval(pack) {
    return Boolean(pack?.state?.sourcePipeline) && pack?.state?.codegenApproval?.status !== "approved";
  }

  function getArchitectureContext(pack) {
    return String(pack?.state?.sourceContext?.architecture || "");
  }

  return {
    SOURCE_MARKDOWN,
    SOURCE_JSON,
    DEPENDENCY_AUDIT,
    MAX_AUTOMATED_SOURCES,
    deriveProjectName,
    toSourceRecord,
    buildArchitectureContext,
    auditDependencies,
    prepareProject,
    approveCodegen,
    requiresCodegenApproval,
    getArchitectureContext,
  };
})();

globalThis.GitHubSourcePipeline = GitHubSourcePipeline;
