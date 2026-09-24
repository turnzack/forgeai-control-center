/* Small runtime guards: external GitHub data is never trusted blindly. */
const GitHubSchemas = (() => {
  function isRepoName(value) { return typeof value === "string" && /^[^/\s]+\/[^/\s]+$/.test(value); }
  function isGithubUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && url.hostname === "github.com" && /^\/[^/]+\/[^/]+(?:\/|$)/.test(url.pathname);
    } catch (_) { return false; }
  }
  function assertSource(source) {
    if (!source || !isRepoName(source.repository) || !isGithubUrl(source.url)) throw new Error("Source GitHub invalide.");
    if (!Number.isFinite(Number(source.score)) || Number(source.score) < 0 || Number(source.score) > 100) throw new Error("Score de source invalide.");
    if (!["allowed", "review", "blocked", "unknown"].includes(source.licenseStatus)) throw new Error("État de licence invalide.");
    return true;
  }
  function clampInt(value, min, max, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? Math.max(min, Math.min(max, Math.floor(n))) : fallback;
  }
  return { isRepoName, isGithubUrl, assertSource, clampInt };
})();

globalThis.GitHubSchemas = GitHubSchemas;
