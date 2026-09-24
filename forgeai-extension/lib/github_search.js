/* ForgeAI Studio — GitHub candidate search, filtering and ranking. */
const GitHubSearch = (() => {
  async function searchRepositories(options = {}) {
    const queryParts = [String(options.query || "").trim(), options.language ? `language:${options.language}` : "", Number(options.minStars) > 0 ? `stars:>=${Math.floor(Number(options.minStars))}` : "", "archived:false", "fork:false"].filter(Boolean);
    if (!queryParts[0]) throw Object.assign(new Error("Une requête GitHub est requise."), { code: "GITHUB_EMPTY_QUERY" });
    const params = new URLSearchParams({ q: queryParts.join(" "), sort: options.sort === "updated" ? "updated" : options.sort === "stars" ? "stars" : "best-match", order: "desc", per_page: String(Math.max(1, Math.min(30, Number(options.perPage) || 20))), page: "1" });
    await RateLimiter.wait(150);
    const response = await GitHubClient.request(`/search/repositories?${params.toString()}`, { token: options.token });
    RateLimiter.update(response.rateLimit);
    return { totalCount: Number(response.data?.total_count || 0), incompleteResults: Boolean(response.data?.incomplete_results), items: Array.isArray(response.data?.items) ? response.data.items.map(RepositoryMetadata.normalizeRepo) : [], rateLimit: response.rateLimit };
  }

  async function getLicense(repo, token) {
    try {
      await RateLimiter.wait(150);
      const response = await GitHubClient.request(`/repos/${GitHubClient.encode(repo.owner)}/${GitHubClient.encode(repo.name)}/license`, { token });
      RateLimiter.update(response.rateLimit);
      const detected = response.data?.license;
      return { detected: Boolean(detected), spdxId: detected?.spdx_id || "NOASSERTION", name: detected?.name || "Licence inconnue", path: response.data?.path || null, source: "repository-license-endpoint", repositoryLicenseChecked: true, dependencyLicensesChecked: false };
    } catch (error) {
      if (error.status === 404) return { detected: false, spdxId: "NOASSERTION", name: "Aucune licence détectée", path: null, source: "repository-license-endpoint", repositoryLicenseChecked: true, dependencyLicensesChecked: false };
      throw error;
    }
  }

  async function searchForProject(options = {}) {
    const policy = options.policy || "commercial-permissive";
    const capabilities = options.capabilities || RepositoryMetadata.extractCapabilities(options.projectIdea, options.query);
    const queries = options.query ? [{ query: options.query, capabilityId: null }] : RepositoryMetadata.buildQueries(capabilities);
    const all = new Map();
    const rateLimits = [];
    for (const item of queries.slice(0, 12)) {
      const result = await searchRepositories({ ...options, query: item.query, sort: "stars", perPage: options.perPage || 20 });
      rateLimits.push(result.rateLimit);
      for (const repo of result.items) {
        if (!repo.fullName || repo.archived || repo.fork) continue;
        const current = all.get(repo.fullName) || { ...repo, capabilityHints: new Set(), queryMatches: [] };
        if (item.capabilityId) current.capabilityHints.add(item.capabilityId);
        current.queryMatches.push(item.query);
        all.set(repo.fullName, current);
      }
    }
    const candidates = [];
    for (const repo of all.values()) {
      let licenseCheck;
      try { licenseCheck = await getLicense(repo, options.token); } catch (error) { licenseCheck = { detected: false, spdxId: "NOASSERTION", name: "Licence non vérifiable", repositoryLicenseChecked: false, dependencyLicensesChecked: false, error: error.code || "GITHUB_ERROR" }; }
      const decision = LicensePolicy.evaluate(licenseCheck.spdxId, policy);
      if (options.licenses?.length && !options.licenses.includes(licenseCheck.spdxId) && decision.status === "allowed") continue;
      const scored = RepositoryMetadata.score(repo, capabilities, { licenseStatus: decision.status, now: Date.now() });
      const age = repo.pushedAt ? (Date.now() - Date.parse(repo.pushedAt)) / 86400000 : Infinity;
      if (options.freshnessDays && age > Number(options.freshnessDays)) continue;
      candidates.push({ ...repo, licenseCheck, licenseDecision: decision, capabilities: scored.matchedCapabilities, score: scored.score, scoreBreakdown: scored.scoreBreakdown, reasons: scored.reasons, selected: false, sourceStatus: "candidate" });
    }
    candidates.sort((a, b) => b.score - a.score);
    const summary = { total: candidates.length, compatible: candidates.filter((x) => x.licenseDecision.status === "allowed").length, review: candidates.filter((x) => x.licenseDecision.status === "review").length, blocked: candidates.filter((x) => x.licenseDecision.status === "blocked").length, averageScore: candidates.length ? Math.round(candidates.reduce((sum, x) => sum + x.score, 0) / candidates.length) : 0 };
    return { items: candidates, summary, capabilities, rateLimit: rateLimits[rateLimits.length - 1] || RateLimiter.status() };
  }
  return { searchRepositories, searchForProject, getLicense };
})();

globalThis.GitHubSearch = GitHubSearch;
