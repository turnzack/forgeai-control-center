/* ForgeAI Studio — SPDX-aware repository license policy. */
const LicensePolicy = (() => {
  const POLICIES = {
    "commercial-permissive": {
      allowed: ["MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "ISC", "0BSD", "Unlicense", "CC0-1.0"],
      review: ["MPL-2.0", "LGPL-2.1-only", "LGPL-2.1-or-later", "LGPL-3.0-only", "LGPL-3.0-or-later"],
      blockedPrefixes: ["GPL", "AGPL"],
    },
    "open-source": {
      allowed: ["MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "ISC", "0BSD", "Unlicense", "CC0-1.0", "MPL-2.0", "LGPL-2.1-only", "LGPL-2.1-or-later", "LGPL-3.0-only", "LGPL-3.0-or-later", "GPL-2.0-only", "GPL-2.0-or-later", "GPL-3.0-only", "GPL-3.0-or-later", "AGPL-3.0-only", "AGPL-3.0-or-later"],
      review: ["NOASSERTION", "UNKNOWN"],
      blockedPrefixes: [],
    },
    "internal-only": {
      allowed: ["MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "ISC", "0BSD", "Unlicense", "CC0-1.0", "MPL-2.0", "LGPL-2.1-only", "LGPL-2.1-or-later", "LGPL-3.0-only", "LGPL-3.0-or-later"],
      review: ["GPL-2.0-only", "GPL-2.0-or-later", "GPL-3.0-only", "GPL-3.0-or-later", "AGPL-3.0-only", "AGPL-3.0-or-later", "NOASSERTION", "UNKNOWN"],
      blockedPrefixes: [],
    },
    "analysis-only": {
      allowed: [],
      review: ["NOASSERTION", "UNKNOWN"],
      blockedPrefixes: [],
    },
  };

  function normalize(id) {
    const value = String(id || "NOASSERTION").trim();
    if (!value || value === "null" || value === "NONE") return "NOASSERTION";
    if (value.toLowerCase() === "mit") return "MIT";
    if (value.toLowerCase() === "apache-2.0") return "Apache-2.0";
    return value;
  }

  function evaluate(spdxId, policy = "commercial-permissive") {
    const id = normalize(spdxId);
    const config = POLICIES[policy] || POLICIES["commercial-permissive"];
    let status = "blocked";
    if (config.allowed.includes(id)) status = "allowed";
    else if (config.review.includes(id) || id === "NOASSERTION" || id === "UNKNOWN") status = "review";
    else if (!config.blockedPrefixes.some((prefix) => id.startsWith(prefix))) status = "review";
    if (policy === "analysis-only") status = "allowed";
    const reasons = {
      allowed: `${id} est compatible avec la politique ${policy}.`,
      review: `${id} nécessite une vérification manuelle avant redistribution.`,
      blocked: `${id} est bloquée par la politique ${policy}.`,
    };
    return {
      status,
      policy,
      spdxId: id,
      requiresAttribution: status === "allowed" || status === "review",
      manualReview: status === "review",
      reason: reasons[status],
    };
  }

  function getAllowedLicenses(policy = "commercial-permissive") { return [...(POLICIES[policy] || POLICIES["commercial-permissive"]).allowed]; }
  function getLicenseLabel(id) { return normalize(id); }
  function requiresManualReview(id, policy) { return evaluate(id, policy).manualReview; }

  /** Évalue la compatibilité d'une licence dans un contexte de redistribution spécifique. */
  function evaluateRedistribution(spdxId, useContext) {
    const id = normalize(spdxId);
    if (useContext === "proprietary" && (id.startsWith("GPL") || id.startsWith("AGPL"))) {
      return { compatible: false, reason: `${id} impose le copyleft — incompatible avec un projet propriétaire.` };
    }
    if (id === "PROPRIETARY") return { compatible: false, reason: "Licence propriétaire — redistribution interdite." };
    if (id === "NOASSERTION" || id === "UNKNOWN") return { compatible: null, reason: "Licence inconnue — vérification humaine obligatoire." };
    return { compatible: true, reason: `${id} permet la redistribution dans ce contexte.` };
  }

  /** Garde de sécurité : détecte secrets et URLs GitHub non verrouillées dans le contenu d'un fichier. */
  function securityGuard(content, filePath) {
    const issues = [];
    const patterns = [
      { name: "OpenAI Key",        re: /\bsk-[a-zA-Z0-9]{20,}/ },
      { name: "Anthropic Key",     re: /\bsk-ant-[a-zA-Z0-9]{20,}/ },
      { name: "GitHub Token",      re: /\b(ghp_|gho_|github_pat_)[a-zA-Z0-9]{30,}/ },
      { name: "AWS Key",           re: /\bAKIA[0-9A-Z]{16}/ },
      { name: "Private Key Block", re: /-----BEGIN\s+(RSA|EC|DSA|PRIVATE)\s+KEY-----/ },
      { name: "Generic API Key",   re: /\b(api[_-]?key|secret)\s*[:=]\s*["'][a-zA-Z0-9_\-.]{10,}/i },
      { name: "Database URL",      re: /\b(mongodb|postgres|mysql|redis):\/\/[^:]+:[^@]+@/ },
    ];
    for (const { name, re } of patterns) {
      if (re.test(content)) issues.push({ type: "secret", name, filePath });
    }
    if (filePath && filePath.endsWith("package.json") && /["']github:[^"']+["']|["']git\+https:\/\/github/.test(content)) {
      issues.push({ type: "github-url-dep", name: "URL GitHub non verrouillée dans package.json", filePath });
    }
    return issues;
  }

  return { POLICIES, normalize, evaluate, getAllowedLicenses, getLicenseLabel, requiresManualReview, evaluateRedistribution, securityGuard };
})();

globalThis.LicensePolicy = LicensePolicy;
