/* Bridge Polling — KIROV5
   Polling Vercel + local :5006, anti race-condition, auto-pilot advance
   Porté depuis KIROV4_ORCHESTRATOR
*/

class BridgePolling {
  static DEFAULTS = {
    SERVER_URL: "http://127.0.0.1:5006",
    VERCEL_URL: "https://v0-reponse-git-main-v01-e951.vercel.app",
    POLLING_INTERVAL: 2500,
  };

  static async proxyFetch(url, options = {}) {
    if (typeof chrome !== "undefined" && chrome.runtime?.sendMessage) {
      return new Promise((resolve, reject) => {
        try {
          chrome.runtime.sendMessage({ type: "FETCH", url, options }, (response) => {
            if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
            if (!response || !response.success) return reject(new Error(response?.error || "Fetch failed"));
            resolve({
              ok: response.result.ok,
              status: response.result.status,
              json: async () => response.result.data,
              text: async () => response.result.text,
            });
          });
        } catch (e) {
          reject(e);
        }
      });
    }
    return fetch(url, options);
  }

  static async getConfig() {
    return new Promise((resolve) => {
      chrome.storage.local.get(
        [
          STORAGE_KEYS.BRIDGE_URL,
          STORAGE_KEYS.BRIDGE_VERCEL,
          STORAGE_KEYS.BRIDGE_ENABLED,
          STORAGE_KEYS.BRIDGE_INTERVAL,
          STORAGE_KEYS.WEB_AI,
        ],
        (r) => {
          const res = r || {};
          resolve({
            serverUrl: res[STORAGE_KEYS.BRIDGE_URL] || BridgePolling.DEFAULTS.SERVER_URL,
            vercelUrl: res[STORAGE_KEYS.BRIDGE_VERCEL] || BridgePolling.DEFAULTS.VERCEL_URL,
            enabled: res[STORAGE_KEYS.BRIDGE_ENABLED] !== false,
            interval:
              res[STORAGE_KEYS.BRIDGE_INTERVAL] || BridgePolling.DEFAULTS.POLLING_INTERVAL,
            webAi: res[STORAGE_KEYS.WEB_AI] || "deepseek",
          });
        }
      );
    });
  }

  static async setConfig(partial) {
    const map = {};
    if (partial.serverUrl != null) map[STORAGE_KEYS.BRIDGE_URL] = partial.serverUrl;
    if (partial.vercelUrl != null) map[STORAGE_KEYS.BRIDGE_VERCEL] = partial.vercelUrl;
    if (partial.enabled != null) map[STORAGE_KEYS.BRIDGE_ENABLED] = !!partial.enabled;
    if (partial.interval != null) map[STORAGE_KEYS.BRIDGE_INTERVAL] = partial.interval;
    return new Promise((resolve) => chrome.storage.local.set(map, resolve));
  }

  /** Test connectivity to local bridge and/or Vercel */
  static async test(url) {
    const cfg = await this.getConfig();
    const target = (url || cfg.serverUrl || "").replace(/\/$/, "");
    if (!target) return { success: false, message: "URL bridge vide" };

    let lastError = null;
    const endpoints = ["/health", "/bridge/health", "/v1/bridge/poll", "/api/bridge/health"];
    
    // Try both the provided target and a localhost fallback if applicable
    const targetsToTry = [target];
    if (target.includes("127.0.0.1")) targetsToTry.push(target.replace("127.0.0.1", "localhost"));
    else if (target.includes("localhost")) targetsToTry.push(target.replace("localhost", "127.0.0.1"));

    for (const currentTarget of targetsToTry) {
      for (const ep of endpoints) {
        try {
          const res = await this.proxyFetch(`${currentTarget}${ep}`, {
            method: "GET",
            headers: { Accept: "application/json" },
          });
          if (res.ok) {
            const text = await res.text();
            let data = null;
            try { data = typeof text === "object" ? text : JSON.parse(text); } catch (_) {}
            return {
              success: true,
              status: res.status,
              data,
              endpoint: ep,
              message: "Bridge connecté",
            };
          } else {
            lastError = `HTTP ${res.status}`;
          }
        } catch (err) {
          lastError = err.message;
        }
      }
    }
    return { success: false, message: `Failed to fetch (Bridge hors ligne) - ${lastError}` };
  }

  /** Poll both Vercel then local bridge for a pending prompt */
  static async pollForPrompt(targetAi) {
    const cfg = await this.getConfig();
    if (!cfg.enabled) return null;

    try {
      const url = `${cfg.serverUrl.replace(/\/$/, "")}/v1/bridge/poll${targetAi ? `?target_ai=${encodeURIComponent(targetAi)}` : ""}`;
      const r = await this.proxyFetch(url);
      if (r.ok) {
        const d = await r.json();
        if (d && d.status !== "idle" && d.prompt) return { ...d, source: "local" };
      }
    } catch (_) {}

    return null;
  }

  /** Mark prompt as consumed on local bridge */
  static async consume(targetAi) {
    const cfg = await this.getConfig();
    try {
      await this.proxyFetch(`${cfg.serverUrl.replace(/\/$/, "")}/v1/bridge/consume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_ai: targetAi }),
      });
      return true;
    } catch (_) {
      return false;
    }
  }

  /** Send captured content back to bridge callback */
  static async sendCallback(content) {
    const cfg = await this.getConfig();
    try {
      const res = await this.proxyFetch(`${cfg.serverUrl.replace(/\/$/, "")}/v1/bridge/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, response: content, is_final: true }),
      });
      const data = await res.json().catch(() => null);
      return data;
    } catch (e) {
      console.error("[BridgePolling] callback failed:", e.message);
      return null;
    }
  }

  /** Advance G5 auto-pilot after successful capture */
  static async advanceAutopilot() {
    const cfg = await this.getConfig();
    try {
      const r = await this.proxyFetch(`${cfg.serverUrl.replace(/\/$/, "")}/v1/g5/autopilot/advance`, {
        method: "POST",
      });
      return await r.json();
    } catch (_) {
      return null;
    }
  }

  /**
   * Detect platform AI name from hostname.
   * Used with target_ai filter to avoid injecting on wrong tab.
   */
  static detectAiFromHost(hostname) {
    const h = String(hostname || "").toLowerCase();
    if (h.includes("deepseek")) return "deepseek";
    if (h.includes("kimi") || h.includes("moonshot")) return "kimi";
    if (h.includes("qwen")) return "qwen";
    if (h.includes("gemini")) return "gemini";
    if (h.includes("claude")) return "claude";
    if (h.includes("chatgpt") || h.includes("openai.com")) return "chatgpt";
    if (h.includes("perplexity")) return "perplexity";
    if (h.includes("mistral")) return "mistral";
    if (h.includes("stitch.withgoogle.com") || h.includes("stitch") || h.includes("appspot.com")) return "stitch";
    return "unknown";
  }

  /**
   * Returns true if this page is allowed to process the bridge prompt.
   * If data.target_ai is set and current AI is known, they must match.
   */
  static matchesTargetAi(data, hostname) {
    if (!data || !data.target_ai) return true;
    const ai = this.detectAiFromHost(hostname);
    if (ai === "unknown") return true; // let unknown hosts try
    return data.target_ai === ai;
  }

  /** Build full prompt with optional Silence Absolu for phase >= 2 */
  static buildBridgePrompt(data) {
    const missionId = data.project_id || `mission_${Date.now()}`;
    let full = `[PROJET : ${String(missionId).toUpperCase()}]`;
    if (data.phase_name) full += ` - [${data.phase_name}]`;
    full += "\n";
    const phaseNum = parseInt(data.phase_num, 10);
    if (!Number.isNaN(phaseNum) && phaseNum >= 2) {
      full += (typeof SILENCE_ABSOLU !== "undefined" ? SILENCE_ABSOLU : "") + "\n\n---\n\n";
    }
    full += data.prompt || "";
    return full;
  }
}
