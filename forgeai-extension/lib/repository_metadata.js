/* ForgeAI Studio — deterministic capability extraction and repository scoring. */
const RepositoryMetadata = (() => {
  const CAPABILITIES = [
    { id: "multi-agent", label: "Orchestration multi-agents", queries: ["multi-agent software engineering", "AI coding agent", "agentic software development"], languages: ["Python", "TypeScript"], terms: ["multi-agent", "agentic", "llm", "software engineering", "coding agent", "orchestration"] },
    { id: "code-editor", label: "Éditeur de code", queries: ["Monaco Editor React TypeScript IDE"], languages: ["TypeScript", "JavaScript"], terms: ["monaco", "code editor", "ide", "file tree", "syntax highlighting"] },
    { id: "electron-runtime", label: "Runtime Electron sécurisé", queries: ["Electron secure IPC filesystem terminal"], languages: ["TypeScript", "JavaScript"], terms: ["electron", "ipc", "preload", "filesystem", "desktop app", "terminal"] },
    { id: "code-sandbox", label: "Sandbox d’exécution de code", queries: ["AI code execution sandbox secure runtime"], languages: ["TypeScript", "Python", "Rust"], terms: ["sandbox", "code execution", "microvm", "secure runtime", "isolation"] },
    { id: "code-analysis", label: "Analyse de code", queries: ["Tree-sitter TypeScript code indexing language server"], languages: ["TypeScript", "Rust", "C"], terms: ["tree-sitter", "ast", "code indexing", "language server", "lsp"] },
    { id: "multi-llm", label: "Support multi-LLM", queries: ["TypeScript multi provider LLM SDK"], languages: ["TypeScript", "Python"], terms: ["llm", "openai", "anthropic", "ollama", "gemini", "ai sdk", "model provider"] },
    { id: "testing-review", label: "Tests et revue de code", queries: ["AI code review pull request automation"], languages: ["TypeScript", "Python"], terms: ["code review", "pull request", "testing", "vitest", "playwright", "lint"] },
  ];

  function normalizeText(value) { return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
  function extractCapabilities(idea, query = "") {
    const text = normalizeText(`${idea} ${query}`);
    const matched = CAPABILITIES.filter((cap) => cap.terms.some((term) => text.includes(normalizeText(term))));
    return matched.length ? matched : CAPABILITIES.slice(0, 3);
  }
  function buildQueries(capabilities) {
    return capabilities.flatMap((cap) => cap.queries.slice(0, 2).map((query) => ({ capabilityId: cap.id, query, languages: cap.languages })));
  }
  function normalizeRepo(repo) {
    return {
      id: repo.id, fullName: repo.full_name, owner: repo.owner?.login || repo.full_name?.split("/")[0], name: repo.name,
      url: repo.html_url, defaultBranch: repo.default_branch || "main", description: repo.description || "",
      language: repo.language || null, topics: Array.isArray(repo.topics) ? repo.topics : [], stars: Number(repo.stargazers_count || 0),
      forks: Number(repo.forks_count || 0), openIssues: Number(repo.open_issues_count || 0), archived: Boolean(repo.archived), fork: Boolean(repo.fork),
      createdAt: repo.created_at || null, updatedAt: repo.updated_at || null, pushedAt: repo.pushed_at || null,
      license: repo.license ? { key: repo.license.key, name: repo.license.name, spdxId: repo.license.spdx_id || "NOASSERTION" } : null,
    };
  }
  function daysSince(date, now = Date.now()) { const t = Date.parse(date || ""); return Number.isFinite(t) ? Math.max(0, (now - t) / 86400000) : Infinity; }
  function score(repo, capabilities, options = {}) {
    const text = normalizeText(`${repo.fullName} ${repo.description} ${(repo.topics || []).join(" ")}`);
    const capMatches = capabilities.filter((cap) => cap.terms.some((term) => text.includes(normalizeText(term))));
    const capability = Math.min(30, Math.round((capMatches.length / Math.max(1, capabilities.length)) * 30));
    const languageMatches = capabilities.filter((cap) => cap.languages.includes(repo.language)).length;
    const technology = Math.min(20, Math.round((languageMatches / Math.max(1, capabilities.length)) * 20));
    const licenseStatus = options.licenseStatus || "review";
    const license = licenseStatus === "allowed" ? 20 : licenseStatus === "review" ? 8 : 0;
    const age = daysSince(repo.pushedAt || repo.updatedAt, options.now);
    const activity = repo.archived ? 0 : age <= 365 ? 15 : age <= 1095 ? 11 : age <= 1825 ? 5 : 0;
    const popularity = Math.min(10, Math.round(Math.log10(Math.max(1, repo.stars + repo.forks * 2)) * 2.5));
    const documentation = (repo.description ? 2 : 0) + (repo.topics?.length ? 1 : 0) + (repo.openIssues >= 0 ? 1 : 0) + (repo.updatedAt ? 1 : 0);
    const total = Math.max(0, Math.min(100, capability + technology + license + activity + popularity + documentation));
    const reasons = [];
    if (capability >= 15) reasons.push("Correspondance forte avec les capacités demandées.");
    else if (capability > 0) reasons.push("Correspondance partielle avec les capacités demandées.");
    if (technology >= 10) reasons.push(`Langage ${repo.language || "non renseigné"} compatible.`);
    if (activity >= 11) reasons.push("Projet actif récemment.");
    if (repo.stars >= 1000) reasons.push("Adoption communautaire significative.");
    if (licenseStatus === "allowed") reasons.push("Licence autorisée par la politique active.");
    if (licenseStatus === "review") reasons.push("Licence à vérifier avant redistribution.");
    if (!reasons.length) reasons.push("Informations insuffisantes pour une recommandation forte.");
    return { score: total, scoreBreakdown: { capability, technology, license, activity, popularity, documentation }, reasons, matchedCapabilities: capMatches.map((cap) => ({ id: cap.id, label: cap.label })) };
  }
  return { CAPABILITIES, normalizeText, extractCapabilities, buildQueries, normalizeRepo, score };
})();

globalThis.RepositoryMetadata = RepositoryMetadata;
