/* ForgeAI Studio — GitHub REST client for the MV3 service worker. */
const GitHubClient = (() => {
  const API = "https://api.github.com";
  const API_VERSION = "2022-11-28";

  function headers(token) {
    const value = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": API_VERSION,
    };
    if (token) value.Authorization = `Bearer ${token}`;
    return value;
  }

  function rate(response) {
    return {
      limit: response.headers.get("x-ratelimit-limit"),
      remaining: response.headers.get("x-ratelimit-remaining"),
      resetAt: response.headers.get("x-ratelimit-reset"),
      retryAfter: response.headers.get("retry-after"),
    };
  }

  async function request(path, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs || 12000);
    let response;
    try {
      response = await fetch(`${API}${path}`, {
        method: options.method || "GET",
        headers: { ...headers(options.token), ...(options.headers || {}) },
        signal: options.signal || controller.signal,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
    } catch (error) {
      const e = new Error(error.name === "AbortError" ? "Requête GitHub annulée ou expirée." : `GitHub inaccessible : ${error.message}`);
      e.code = error.name === "AbortError" ? "GITHUB_TIMEOUT" : "GITHUB_NETWORK";
      throw e;
    } finally {
      clearTimeout(timeout);
    }

    const quota = rate(response);
    const text = await response.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (_) { data = { message: text.slice(0, 500) }; }

    if (!response.ok) {
      const e = new Error(data?.message || `GitHub HTTP ${response.status}`);
      e.status = response.status;
      e.code = response.status === 401 ? "GITHUB_UNAUTHORIZED" :
        (response.status === 403 || response.status === 429) ? "GITHUB_RATE_LIMIT" :
        response.status === 404 ? "GITHUB_NOT_FOUND" :
        response.status === 422 ? "GITHUB_VALIDATION" : "GITHUB_HTTP_ERROR";
      e.rateLimit = quota;
      throw e;
    }
    return { data, rateLimit: quota, status: response.status };
  }

  function encode(value) { return encodeURIComponent(String(value)); }
  return { API, API_VERSION, request, encode };
})();

globalThis.GitHubClient = GitHubClient;
