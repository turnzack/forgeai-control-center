/* ForgeAI Studio — project-scoped GitHub source persistence and provenance artifacts. */
const ProjectSources = (() => {
  const KEY = "kirov_project_sources";
  const POLICY_KEY = "kirov_github_source_policy";
  const MAX_SOURCES = 8;
  function now() { return new Date().toISOString(); }
  function text(value, max = 1200) { return String(value || "").trim().replace(/\s+/g, " ").slice(0, max); }
  function cell(value, fallback = "—") { return text(value || fallback, 500).replace(/\|/g, "\\|").replace(/[\r\n]+/g, " "); }
  function list(values, max = 12) { return Array.isArray(values) ? values.map((value) => text(value?.label || value?.id || value, 200)).filter(Boolean).slice(0, max) : []; }
  function cleanSource(source) {
    const clean = {
      repository: text(source.repository, 200),
      url: text(source.url, 500),
      branch: text(source.branch || "main", 120),
      commit: source.commit || null,
      description: text(source.description, 1200),
      technology: text(source.technology || source.language, 160),
      topics: list(source.topics, 20),
      updatedAt: source.updatedAt || source.pushedAt || null,
      capabilities: list(source.capabilities),
      matchReasons: list(source.matchReasons || source.reasons, 8),
      score: Math.max(0, Math.min(100, Number(source.score) || 0)),
      scoreBreakdown: source.scoreBreakdown && typeof source.scoreBreakdown === "object" ? source.scoreBreakdown : {},
      license: text(source.license || "NOASSERTION", 120),
      licenseName: text(source.licenseName, 240),
      licenseStatus: text(source.licenseStatus || "unknown", 24),
      licensePolicy: text(source.licensePolicy, 80),
      licenseReason: text(source.licenseReason, 500),
      repositoryLicenseChecked: Boolean(source.repositoryLicenseChecked),
      dependencyLicensesChecked: false,
      action: "reference-only",
      selectedAt: source.selectedAt || now(),
    };
    GitHubSchemas.assertSource(clean);
    return clean;
  }
  async function readAll() { const result = await chrome.storage.local.get([KEY]); return result[KEY] || {}; }
  async function get(projectId) { if (!projectId) return []; const all = await readAll(); return Array.isArray(all[projectId]) ? all[projectId] : []; }
  async function set(projectId, sources) {
    if (!projectId) throw new Error("projectId requis.");
    if (!Array.isArray(sources)) throw new Error("sources doit être un tableau.");
    const byRepository = new Map();
    sources.map(cleanSource).forEach((source) => byRepository.set(source.repository, source));
    const clean = [...byRepository.values()];
    if (clean.length > MAX_SOURCES) throw new Error(`Maximum de ${MAX_SOURCES} sources GitHub par projet.`);
    const all = await readAll(); all[projectId] = clean; await chrome.storage.local.set({ [KEY]: all }); return clean;
  }
  async function clear(projectId) { const all = await readAll(); delete all[projectId]; await chrome.storage.local.set({ [KEY]: all }); }
  async function getPolicy() { const result = await chrome.storage.local.get([POLICY_KEY]); return result[POLICY_KEY] || "commercial-permissive"; }
  async function setPolicy(policy) { if (!LicensePolicy.POLICIES[policy]) throw new Error("Politique de licence inconnue."); await chrome.storage.local.set({ [POLICY_KEY]: policy }); return policy; }
  function toMarkdown(projectId, sources) {
    const lines = [
      `# Sources GitHub — ${projectId}`,
      "",
      "> Ces dépôts sont des **références documentaires uniquement**. Aucun code, paquet ni dépendance externe n’est copié automatiquement.",
      "",
      `Généré le : ${now()}`,
      "",
      "## Références sélectionnées",
      "",
      "| Dépôt | Description | Technologie | Mise à jour | Licence | Correspondance avec le besoin |",
      "|---|---|---|---|---|---|",
    ];
    if (!sources.length) lines.push("| Aucune source sélectionnée | — | — | — | — | — |");
    sources.forEach((source) => lines.push(`| [${cell(source.repository)}](${source.url}) | ${cell(source.description)} | ${cell([source.technology, ...(source.topics || [])].filter(Boolean).join(", "))} | ${cell(source.updatedAt)} | ${cell(source.license)} (${cell(source.licenseStatus)}) | ${cell((source.capabilities || []).join(", "))} — score ${source.score}/100 |`));
    lines.push("", "## Justification de la correspondance", "");
    sources.forEach((source) => {
      lines.push(`### ${source.repository}`, "");
      const reasons = source.matchReasons || [];
      if (reasons.length) reasons.forEach((reason) => lines.push(`- ${reason}`));
      else lines.push("- Correspondance évaluée à partir de la description, des sujets, de la technologie et de l’activité du dépôt.");
      lines.push("");
    });
    lines.push(
      "## Vérifications et limites",
      "",
      "La licence du dépôt est vérifiée lorsque GitHub peut l’identifier. Les licences transitives des dépendances, les avis de droits d’auteur et la compatibilité avec le cas d’usage final doivent être vérifiés par une personne compétente avant toute redistribution.",
      "",
      "L’application générée doit rester originale ; les références servent à comprendre des approches, non à reproduire du code ou à importer des dépendances sans nécessité produit."
    );
    return lines.join("\n");
  }
  function toJSON(projectId, sources) {
    return JSON.stringify({
      schemaVersion: "1.1.0",
      projectId,
      generatedAt: now(),
      referenceOnly: true,
      sourceLicenseCheck: { repositoryLicenseChecked: sources.every((source) => source.repositoryLicenseChecked), dependencyLicensesChecked: false },
      sources,
    }, null, 2);
  }
  return { KEY, MAX_SOURCES, get, set, clear, getPolicy, setPolicy, toMarkdown, toJSON };
})();

globalThis.ProjectSources = ProjectSources;
