/* ForgeAI Studio — GitHub Repository Analyst : détection et scoring des « pépites » par fichier. */
const GitHubGemAnalyzer = (() => {

  /* ── Catégories de fichiers recherchées ── */
  const CATEGORIES = {
    "agent-system":    { patterns: [/agent/i, /orchestrat/i, /workflow/i], weight: 10 },
    "orchestration":   { patterns: [/orchestrat/i, /pipeline/i, /runner/i, /scheduler/i], weight: 9 },
    "memory":          { patterns: [/memory/i, /store/i, /cache/i, /persist/i, /storage/i], weight: 8 },
    "task-pipeline":   { patterns: [/task/i, /queue/i, /job/i, /dispatch/i, /worker/i], weight: 8 },
    "llm-adapter":     { patterns: [/llm/i, /openai/i, /claude/i, /gemini/i, /anthropic/i, /completion/i, /chat/i, /model/i], weight: 9 },
    "ui-component":    { patterns: [/component/i, /widget/i, /panel/i, /modal/i, /dialog/i], weight: 6 },
    "search-tool":     { patterns: [/search/i, /retriev/i, /index/i, /embed/i, /vector/i], weight: 7 },
    "file-manager":    { patterns: [/file/i, /fs/i, /directory/i, /path/i, /watcher/i], weight: 5 },
    "security":        { patterns: [/auth/i, /token/i, /permission/i, /sandbox/i, /guard/i], weight: 7 },
    "test":            { patterns: [/\.test\./i, /\.spec\./i, /test$/i, /spec$/i], weight: 3 },
    "build-config":    { patterns: [/webpack/i, /vite/i, /rollup/i, /tsconfig/i, /babel/i, /eslint/i], weight: 2 },
    "novel-solution":  { patterns: [/experiment/i, /prototype/i, /innovation/i, /novel/i], weight: 10 },
  };

  /* ── Extensions analysables ── */
  const ANALYZABLE_EXTS = new Set([
    ".ts", ".tsx", ".js", ".jsx", ".mjs", ".mts",
    ".py", ".go", ".rs", ".java", ".kt", ".swift",
    ".json", ".yaml", ".yml", ".toml",
  ]);

  /* ── Taille maximale d'un fichier à analyser (100 Ko) ── */
  const MAX_FILE_BYTES = 100 * 1024;

  /* ── Nombre maximum de pépites par dépôt ── */
  const MAX_GEMS = 30;

  function now() { return new Date().toISOString(); }
  function compact(v, max = 300) { return String(v || "").trim().slice(0, max); }

  /** Détermine si une extension de fichier est analysable. */
  function isAnalyzable(filePath) {
    const lower = filePath.toLowerCase();
    const dot = lower.lastIndexOf(".");
    if (dot < 0) return false;
    return ANALYZABLE_EXTS.has(lower.slice(dot));
  }

  /** Extrait la catégorie principale d'un fichier à partir de son chemin et de son contenu. */
  function detectCategory(filePath, content) {
    const name = filePath.split("/").pop() || "";
    const base = name.replace(/\.[^.]+$/, "");
    const text = `${filePath} ${content || ""}`;
    let best = null;
    let bestWeight = 0;
    for (const [cat, cfg] of Object.entries(CATEGORIES)) {
      const matched = cfg.patterns.some(p => p.test(text) || p.test(base));
      if (matched && cfg.weight > bestWeight) {
        best = cat;
        bestWeight = cfg.weight;
      }
    }
    return best || "generic";
  }

  /** Extrait les imports/dépendances déclarés dans un fichier source. */
  function extractImports(content) {
    const imports = new Set();
    // ESM imports: import X from 'pkg'  / import { X } from 'pkg'
    const esmRe = /import\s+(?:[^'"]+\s+from\s+)?['"]([^'"./][^'"]*)['"]/g;
    let m;
    while ((m = esmRe.exec(content)) !== null) {
      const pkg = m[1].split("/")[0].replace(/^@/, "@").split("/").slice(0, m[1].startsWith("@") ? 2 : 1).join("/");
      imports.add(pkg);
    }
    // CommonJS require('pkg')
    const cjsRe = /require\(['"]([^'"./][^'"]*)['"]\)/g;
    while ((m = cjsRe.exec(content)) !== null) {
      const pkg = m[1].split("/")[0];
      imports.add(pkg);
    }
    return [...imports].filter(p => p && !p.startsWith(".")).slice(0, 20);
  }

  /** Extrait la description d'un fichier depuis ses premiers commentaires. */
  function extractDescription(content) {
    const jsdocMatch = content.match(/\/\*\*?\s*([\s\S]*?)\*\//);
    if (jsdocMatch) {
      const cleaned = jsdocMatch[1].replace(/\s*\*\s?/g, " ").trim().split(".")[0];
      if (cleaned.length > 10) return compact(cleaned, 200);
    }
    const lineComments = content.split("\n").filter(l => l.trim().startsWith("//") || l.trim().startsWith("#")).slice(0, 3);
    if (lineComments.length) {
      return compact(lineComments.map(l => l.replace(/^[/#\s*]+/, "").trim()).join(" "), 200);
    }
    return "Composant détecté automatiquement";
  }

  /** Vérifie si un fichier contient des tests. */
  function hasTests(content) {
    return /\b(describe|it|test|expect|assert|beforeEach|afterEach)\s*\(/.test(content);
  }

  /** Détecte la licence déclarée dans l'en-tête d'un fichier (SPDX ou copyright). */
  function detectFileLicense(content) {
    const spdxMatch = content.match(/SPDX-License-Identifier:\s*([^\s*]+)/i);
    if (spdxMatch) return compact(spdxMatch[1], 60);
    if (/copyright.*mit/i.test(content)) return "MIT";
    if (/apache\s+license\s+2\.0/i.test(content)) return "Apache-2.0";
    if (/gpl/i.test(content)) return "GPL";
    if (/proprietary|all rights reserved/i.test(content)) return "PROPRIETARY";
    return null; // hérite de la licence du dépôt
  }

  /** Détecte si un fichier contient des secrets potentiels. */
  function detectSecrets(content) {
    const patterns = [
      /\b(api[_-]?key|secret[_-]?key|private[_-]?key|access[_-]?token)\s*[:=]\s*["'][^"']{8,}/i,
      /\bsk-[a-zA-Z0-9]{20,}/,
      /\bghp_[a-zA-Z0-9]{30,}/,
      /-----BEGIN\s+(RSA|EC|PRIVATE)\s+KEY-----/,
      /\bBearer\s+[a-zA-Z0-9_.-]{20,}/,
    ];
    return patterns.some(p => p.test(content));
  }

  /** Calcule le score d'utilité d'un composant (0–100). */
  function scoreGem({ category, content, filePath, dependencies, repoStars, repoLicenseStatus, fileLicense }) {
    let score = 0;
    const cat = CATEGORIES[category];
    // Valeur fonctionnelle (catégorie)
    if (cat) score += cat.weight * 3;
    // Qualité du code : présence de JSDoc / commentaires
    if (/\/\*\*[\s\S]*?\*\//.test(content)) score += 5;
    // Couverture de tests dans le fichier
    if (hasTests(content)) score += 8;
    // Taille raisonnable (pas trop petit, pas trop grand)
    const size = content.length;
    if (size > 200 && size < 30000) score += 5;
    if (size >= 30000) score -= 5;
    // Peu de dépendances externes = facile à intégrer
    const depCount = dependencies.length;
    if (depCount === 0) score += 8;
    else if (depCount <= 3) score += 5;
    else if (depCount <= 8) score += 2;
    else score -= 5;
    // Popularité du dépôt (proxy de maturité)
    if (repoStars > 5000) score += 8;
    else if (repoStars > 1000) score += 5;
    else if (repoStars > 100) score += 2;
    // Licence
    if (repoLicenseStatus === "allowed") score += 8;
    else if (repoLicenseStatus === "review") score += 2;
    else score -= 15;
    // Licence fichier (si propriétaire → blocage)
    if (fileLicense === "PROPRIETARY") score -= 30;
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /** Détermine le mode de réutilisation recommandé selon le score et les contraintes. */
  function recommendReuseMode(score, repoLicenseStatus, fileLicense, hasSecrets) {
    if (hasSecrets) return "blocked";
    if (fileLicense === "PROPRIETARY") return "blocked";
    if (repoLicenseStatus === "blocked") return "blocked";
    if (score < 40) return "inspiration";
    if (repoLicenseStatus === "review") return "inspiration";
    if (score >= 75 && repoLicenseStatus === "allowed") return "extractable";
    if (score >= 85 && repoLicenseStatus === "allowed") return "foundation";
    return "inspiration";
  }

  /**
   * Récupère l'arbre de fichiers d'un dépôt GitHub via l'API.
   * @param {string} owner
   * @param {string} repo
   * @param {string} defaultBranch
   * @param {string|null} token
   */
  async function fetchRepoTree(owner, repo, defaultBranch, token) {
    await RateLimiter.wait(200);
    const branch = encodeURIComponent(defaultBranch || "main");
    const resp = await GitHubClient.request(
      `/repos/${GitHubClient.encode(owner)}/${GitHubClient.encode(repo)}/git/trees/${branch}?recursive=1`,
      { token }
    );
    RateLimiter.update(resp.rateLimit);
    const tree = Array.isArray(resp.data?.tree) ? resp.data.tree : [];
    return tree.filter(node => node.type === "blob" && isAnalyzable(node.path || ""));
  }

  /**
   * Récupère le contenu d'un fichier via l'API GitHub (contenu base64 décodé).
   * @param {string} owner
   * @param {string} repo
   * @param {string} filePath
   * @param {string|null} token
   */
  async function fetchFileContent(owner, repo, filePath, token) {
    try {
      await RateLimiter.wait(150);
      const resp = await GitHubClient.request(
        `/repos/${GitHubClient.encode(owner)}/${GitHubClient.encode(repo)}/contents/${filePath}`,
        { token }
      );
      RateLimiter.update(resp.rateLimit);
      const encoded = resp.data?.content;
      if (!encoded) return null;
      // Décode base64 → texte
      return atob(encoded.replace(/\s/g, ""));
    } catch (_) {
      return null;
    }
  }

  /**
   * Sélectionne les fichiers candidats à analyser dans l'arbre (filtre + priorisation).
   * @param {Array} treeNodes - nœuds de l'arbre GitHub
   * @param {number} maxFiles - nombre maximum de fichiers à analyser
   */
  function selectCandidateFiles(treeNodes, maxFiles = 60) {
    // Exclure les dossiers vendor, node_modules, dist, .git
    const excluded = /\/(node_modules|vendor|dist|build|\.git|coverage|__pycache__)\/|\/\./;
    const filtered = treeNodes.filter(n => !excluded.test(`/${n.path || ""}`));

    // Prioriser les fichiers correspondant aux catégories importantes
    const highPriority = CATEGORIES;
    filtered.sort((a, b) => {
      const aHigh = Object.values(highPriority).some(c => c.patterns.some(p => p.test(a.path || "")));
      const bHigh = Object.values(highPriority).some(c => c.patterns.some(p => p.test(b.path || "")));
      if (aHigh && !bHigh) return -1;
      if (!aHigh && bHigh) return 1;
      // Favoriser les petits fichiers (plus rapides à charger)
      return (Number(a.size) || 0) - (Number(b.size) || 0);
    });

    return filtered
      .filter(n => !n.size || Number(n.size) <= MAX_FILE_BYTES)
      .slice(0, maxFiles);
  }

  /**
   * Analyse un dépôt GitHub et retourne ses « pépites ».
   * @param {Object} source - objet source avec repository, branch, url, license, licenseStatus, stars
   * @param {string|null} token - token GitHub (optionnel)
   * @returns {Promise<Object>} rapport de pépites
   */
  async function analyzeRepository(source, token) {
    const repoStr = compact(source.repository, 200);
    const match = repoStr.match(/^([^/]+)\/([^/]+)$/);
    if (!match) throw new Error(`Dépôt invalide : ${repoStr}`);
    const [, owner, repo] = match;
    const branch = source.branch || source.defaultBranch || "main";
    const repoStars = Number(source.stars || source.stargazersCount || 0);
    const repoLicenseStatus = source.licenseStatus || "unknown";
    const repoLicense = source.license || "NOASSERTION";

    // 1. Récupération de l'arbre de fichiers
    let treeNodes;
    try {
      treeNodes = await fetchRepoTree(owner, repo, branch, token);
    } catch (err) {
      return {
        repository: repoStr,
        error: `Impossible de récupérer l'arbre : ${err.message}`,
        highlights: [],
        analyzedAt: now(),
      };
    }

    const candidates = selectCandidateFiles(treeNodes, 60);
    const highlights = [];

    // 2. Analyse de chaque fichier candidat
    for (const node of candidates) {
      if (highlights.length >= MAX_GEMS) break;
      const filePath = node.path;
      const content = await fetchFileContent(owner, repo, filePath, token);
      if (!content) continue;

      const category = detectCategory(filePath, content);
      const dependencies = extractImports(content);
      const description = extractDescription(content);
      const fileLicense = detectFileLicense(content) || repoLicense;
      const secrets = detectSecrets(content);
      const fileHasTests = hasTests(content);

      const score = scoreGem({ category, content, filePath, dependencies, repoStars, repoLicenseStatus, fileLicense });
      const reuseMode = recommendReuseMode(score, repoLicenseStatus, detectFileLicense(content), secrets);

      // Ignorer les fichiers de config peu utiles avec un score très bas
      if (category === "build-config" && score < 40) continue;
      if (category === "test" && score < 30) continue;
      if (score < 20) continue;

      highlights.push({
        path: filePath,
        type: category,
        score,
        value: description,
        fileLicense,
        repoLicense,
        licenseStatus: repoLicenseStatus,
        reuseMode,
        dependencies,
        sizeBytes: content.length,
        hasTests: fileHasTests,
        hasSecrets: secrets,
        blocked: reuseMode === "blocked",
        selectedAction: null, // null = pas encore de choix utilisateur
      });
    }

    // Tri par score décroissant
    highlights.sort((a, b) => b.score - a.score);

    const summary = {
      total: highlights.length,
      extractable: highlights.filter(h => h.reuseMode === "extractable").length,
      inspiration: highlights.filter(h => h.reuseMode === "inspiration").length,
      foundation: highlights.filter(h => h.reuseMode === "foundation").length,
      blocked: highlights.filter(h => h.reuseMode === "blocked").length,
    };

    return {
      repository: repoStr,
      owner,
      repo,
      branch,
      repoLicense,
      repoLicenseStatus,
      repoStars,
      highlights,
      summary,
      analyzedAt: now(),
    };
  }

  /**
   * Analyse plusieurs dépôts en séquence.
   * @param {Array} sources - liste de sources GitHub
   * @param {string|null} token
   * @returns {Promise<Object>} rapport global de pépites
   */
  async function analyzeAll(sources, token) {
    if (!Array.isArray(sources) || !sources.length) {
      throw Object.assign(new Error("Aucune source GitHub à analyser."), { code: "GEM_NO_SOURCES" });
    }

    const reports = [];
    for (const source of sources) {
      const report = await analyzeRepository(source, token);
      reports.push(report);
    }

    const allGems = reports.flatMap(r => r.highlights.map(h => ({ ...h, repository: r.repository })));
    const globalSummary = {
      repositories: reports.length,
      totalGems: allGems.length,
      extractable: allGems.filter(g => g.reuseMode === "extractable").length,
      inspiration: allGems.filter(g => g.reuseMode === "inspiration").length,
      foundation: allGems.filter(g => g.reuseMode === "foundation").length,
      blocked: allGems.filter(g => g.reuseMode === "blocked").length,
      compatible: allGems.filter(g => g.licenseStatus === "allowed" && !g.blocked).length,
      needsReview: allGems.filter(g => g.licenseStatus === "review").length,
    };

    return {
      reports,
      allGems,
      summary: globalSummary,
      analyzedAt: now(),
    };
  }

  return {
    MAX_FILE_BYTES,
    MAX_GEMS,
    analyzeRepository,
    analyzeAll,
    detectCategory,
    extractImports,
    scoreGem,
    recommendReuseMode,
    detectSecrets,
    detectFileLicense,
  };
})();

globalThis.GitHubGemAnalyzer = GitHubGemAnalyzer;
