/* GitHub Pusher — KIROV5
   Push fichiers capturés vers un repo GitHub via Git Data API
   Porté depuis KIROV4_ORCHESTRATOR (pushToGitHub)
*/

class GitHubPusher {
  static DEFAULT_REPO = "tcereponse/apk-builder";
  static DEFAULT_BRANCH = "main";

  static async getConfig() {
    return new Promise((resolve) => {
      chrome.storage.local.get(
        [STORAGE_KEYS.GITHUB_TOKEN, STORAGE_KEYS.GITHUB_REPO, STORAGE_KEYS.GITHUB_BRANCH],
        (r) => {
          resolve({
            token: r[STORAGE_KEYS.GITHUB_TOKEN] || "",
            repo: r[STORAGE_KEYS.GITHUB_REPO] || GitHubPusher.DEFAULT_REPO,
            branch: r[STORAGE_KEYS.GITHUB_BRANCH] || GitHubPusher.DEFAULT_BRANCH,
          });
        }
      );
    });
  }

  static async setConfig({ token, repo, branch }) {
    const map = {};
    if (token != null) map[STORAGE_KEYS.GITHUB_TOKEN] = token;
    if (repo != null) map[STORAGE_KEYS.GITHUB_REPO] = repo;
    if (branch != null) map[STORAGE_KEYS.GITHUB_BRANCH] = branch;
    return new Promise((resolve) => chrome.storage.local.set(map, resolve));
  }

  /**
   * Push an array of {path, content} files to GitHub.
   * Creates blobs → tree → commit → update ref.
   * @param {Array<{path:string, content:string}>} files
   * @param {object} [options]
   * @param {string} [options.message] commit message
   * @param {string} [options.token]
   * @param {string} [options.repo]
   * @param {string} [options.branch]
   */
  static async push(files, options = {}) {
    const cfg = await this.getConfig();
    const TOKEN = options.token || cfg.token;
    const REPO = options.repo || cfg.repo || this.DEFAULT_REPO;
    const BRANCH = options.branch || cfg.branch || this.DEFAULT_BRANCH;
    const message =
      options.message || `🚀 KIROV5: Auto-Suture — ${new Date().toISOString()}`;

    if (!TOKEN) {
      return { success: false, message: "Pas de token GitHub configuré." };
    }
    if (!files || !files.length) {
      return { success: false, message: "Aucun fichier à pousser." };
    }

    const api = async (path, method = "GET", body = null) => {
      const res = await fetch(`https://api.github.com/repos/${REPO}/${path}`, {
        method,
        headers: {
          Authorization: `token ${TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : null,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || `GitHub API ${res.status} on ${path}`);
      }
      return data;
    };

    try {
      // Resolve branch ref (main → master fallback)
      let ref;
      let branchUsed = BRANCH;
      try {
        ref = await api(`git/refs/heads/${BRANCH}`);
      } catch (_) {
        branchUsed = "master";
        ref = await api("git/refs/heads/master");
      }

      const commit = await api(`git/commits/${ref.object.sha}`);

      // Create blobs
      const items = [];
      for (const f of files) {
        if (!f.path || f.content == null) continue;
        const blob = await api("git/blobs", "POST", {
          content: String(f.content),
          encoding: "utf-8",
        });
        items.push({
          path: String(f.path).replace(/^\//, ""),
          mode: "100644",
          type: "blob",
          sha: blob.sha,
        });
      }

      if (!items.length) {
        return { success: false, message: "Aucun blob valide à créer." };
      }

      const tree = await api("git/trees", "POST", {
        base_tree: commit.tree.sha,
        tree: items,
      });

      const newCommit = await api("git/commits", "POST", {
        message,
        tree: tree.sha,
        parents: [ref.object.sha],
      });

      await api(`git/refs/heads/${branchUsed}`, "PATCH", { sha: newCommit.sha });

      console.log("[GitHubPusher] ✅ Push réussi →", REPO, branchUsed, newCommit.sha);
      return {
        success: true,
        sha: newCommit.sha,
        repo: REPO,
        branch: branchUsed,
        fileCount: items.length,
        message: `Push OK — ${items.length} fichiers → ${REPO}@${branchUsed}`,
      };
    } catch (e) {
      console.error("[GitHubPusher] ❌", e.message);
      return { success: false, message: e.message || String(e) };
    }
  }

  /**
   * Heuristic: should we auto-push after capture?
   * True if App.tsx/main.tsx present and >= 2 files.
   */
  static shouldAutoPush(files) {
    if (!files || files.length < 2) return false;
    return files.some(
      (f) =>
        f.path &&
        (f.path.includes("App.tsx") ||
          f.path.includes("main.tsx") ||
          f.path.includes("App.jsx") ||
          f.path.includes("main.jsx"))
    );
  }
}
