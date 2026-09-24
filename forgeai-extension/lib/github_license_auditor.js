/* ForgeAI Studio — License Auditor : audit de licence au niveau fichier et module. */
const GitHubLicenseAuditor = (() => {

  function compact(v, max = 300) { return String(v || "").trim().slice(0, max); }

  /* ── Patterns de secrets / clés API à détecter dans les fichiers ── */
  const SECRET_PATTERNS = [
    { name: "Generic API Key",   re: /\b(api[_-]?key|apikey)\s*[:=]\s*["'][a-zA-Z0-9_\-.]{10,}/i },
    { name: "Generic Secret",    re: /\b(secret[_-]?key|client[_-]?secret)\s*[:=]\s*["'][a-zA-Z0-9_\-.]{8,}/i },
    { name: "OpenAI Key",        re: /\bsk-[a-zA-Z0-9]{20,}/ },
    { name: "Anthropic Key",     re: /\bsk-ant-[a-zA-Z0-9]{20,}/ },
    { name: "GitHub Token",      re: /\b(ghp_|gho_|github_pat_)[a-zA-Z0-9]{30,}/ },
    { name: "AWS Access Key",    re: /\bAKIA[0-9A-Z]{16}/ },
    { name: "Private Key Block", re: /-----BEGIN\s+(RSA|EC|DSA|PRIVATE)\s+KEY-----/ },
    { name: "Bearer Token",      re: /\bBearer\s+[a-zA-Z0-9_.\-]{20,}/ },
    { name: "Database URL",      re: /\b(mongodb|postgres|mysql|redis):\/\/[^:]+:[^@]+@/ },
    { name: "Hardcoded Password",re: /\bpassword\s*[:=]\s*["'][^"']{6,}/i },
  ];

  /* ── Patterns de restriction de redistribution ── */
  const RESTRICTION_PATTERNS = [
    { name: "Proprietary",         re: /proprietary|all\s+rights\s+reserved/i,          status: "blocked" },
    { name: "Non-commercial",      re: /non-commercial|noncommercial|not\s+for\s+profit/i, status: "blocked" },
    { name: "Commercial Forbidden",re: /commercial\s+use\s+(is\s+)?prohibited/i,         status: "blocked" },
    { name: "No Redistribution",   re: /no\s+redistribution|redistribution\s+prohibited/i, status: "blocked" },
    { name: "Internal Only",       re: /internal\s+use\s+only|not\s+for\s+distribution/i,  status: "blocked" },
  ];

  /* ── Identifiants SPDX inline ── */
  function extractSpdxInline(content) {
    const m = content.match(/SPDX-License-Identifier:\s*([^\s*\r\n]+)/i);
    return m ? compact(m[1], 80) : null;
  }

  /* ── Détection de copyright dans les en-têtes ── */
  function extractCopyright(content) {
    const lines = content.split("\n").slice(0, 30).join("\n");
    const m = lines.match(/copyright\s+(?:\(c\)\s*)?(?:\d{4}[-,\s\d]*\s+)?(.{5,80})/i);
    return m ? compact(m[1].trim(), 120) : null;
  }

  /* ── Détection des restrictions de redistribution ── */
  function detectRestrictions(content) {
    const found = [];
    for (const { name, re, status } of RESTRICTION_PATTERNS) {
      if (re.test(content)) found.push({ name, status });
    }
    return found;
  }

  /* ── Détection de secrets ── */
  function detectSecrets(content) {
    const found = [];
    for (const { name, re } of SECRET_PATTERNS) {
      if (re.test(content)) found.push(name);
    }
    return found;
  }

  /**
   * Évalue la licence d'un fichier individuel.
   * @param {Object} opts
   * @param {string} opts.filePath - chemin du fichier dans le dépôt
   * @param {string} opts.content  - contenu source du fichier
   * @param {string} opts.repoLicense - licence SPDX du dépôt parent
   * @param {string} opts.repoLicenseStatus - statut de la licence du dépôt ("allowed"|"review"|"blocked")
   * @param {string[]} opts.importedDeps - dépendances importées dans le fichier
   * @param {string} opts.policy - politique de licence appliquée
   * @returns {Object} résultat d'audit
   */
  function evaluateFile({ filePath, content, repoLicense, repoLicenseStatus, importedDeps, policy }) {
    const spdxInline = extractSpdxInline(content);
    const effectiveLicense = spdxInline || repoLicense || "NOASSERTION";
    const copyright = extractCopyright(content);
    const restrictions = detectRestrictions(content);
    const secrets = detectSecrets(content);
    const hasSecrets = secrets.length > 0;

    // Évaluation de la licence effective
    const licenseDecision = LicensePolicy.evaluate(effectiveLicense, policy || "commercial-permissive");

    // Les restrictions de redistribution l'emportent
    const blockedByRestriction = restrictions.some(r => r.status === "blocked");

    let finalStatus = licenseDecision.status;
    if (blockedByRestriction) finalStatus = "blocked";
    if (hasSecrets) finalStatus = "blocked";
    if (effectiveLicense === "NOASSERTION" && !spdxInline) finalStatus = "review"; // hérite du dépôt

    // Si le fichier a un SPDX inline différent du dépôt, réévaluer
    let reuseMode = "inspiration";
    if (finalStatus === "blocked") reuseMode = "blocked";
    else if (finalStatus === "allowed" && !hasSecrets) reuseMode = "extractable";
    else if (finalStatus === "review") reuseMode = "inspiration";

    const reasons = [];
    if (spdxInline) reasons.push(`Licence SPDX inline : ${spdxInline}`);
    if (copyright) reasons.push(`Copyright : ${copyright}`);
    if (blockedByRestriction) reasons.push(`Restriction détectée : ${restrictions.map(r => r.name).join(", ")}`);
    if (hasSecrets) reasons.push(`⚠️ Secrets détectés : ${secrets.join(", ")}`);
    if (importedDeps && importedDeps.length) reasons.push(`Dépendances importées : ${importedDeps.slice(0, 5).join(", ")}`);

    return {
      filePath,
      effectiveLicense,
      spdxInline,
      repoLicense,
      repoLicenseStatus,
      copyright,
      restrictions,
      secrets,
      hasSecrets,
      licenseStatus: finalStatus,
      reuseMode,
      requiresAttribution: finalStatus === "allowed" || finalStatus === "review",
      reasons,
    };
  }

  /**
   * Audite tous les fichiers d'un rapport de pépites.
   * @param {Object} gemReport - rapport produit par GitHubGemAnalyzer
   * @param {string} policy - politique de licence
   * @returns {Object} rapport enrichi avec audit de licence par fichier
   */
  function auditGemReport(gemReport, policy) {
    const highlights = (gemReport.highlights || []).map(gem => {
      const audit = evaluateFile({
        filePath: gem.path,
        content: gem._rawContent || "",
        repoLicense: gem.repoLicense || gemReport.repoLicense || "NOASSERTION",
        repoLicenseStatus: gem.licenseStatus || gemReport.repoLicenseStatus || "unknown",
        importedDeps: gem.dependencies || [],
        policy,
      });
      return {
        ...gem,
        licenseAudit: audit,
        licenseStatus: audit.licenseStatus,
        reuseMode: gem.hasSecrets ? "blocked" : audit.reuseMode,
        blocked: audit.licenseStatus === "blocked" || gem.hasSecrets,
      };
    });

    return { ...gemReport, highlights };
  }

  /**
   * Produit le résumé global de licence pour un ensemble de pépites.
   * @param {Array} gems - liste de pépites avec licenseAudit
   * @returns {Object} résumé
   */
  function summarizeLicenses(gems) {
    const counts = { allowed: 0, review: 0, blocked: 0, human_review: 0 };
    const uniqueLicenses = new Set();
    for (const gem of gems) {
      const status = gem.licenseStatus || "review";
      counts[status] = (counts[status] || 0) + 1;
      uniqueLicenses.add(gem.licenseAudit?.effectiveLicense || gem.fileLicense || "NOASSERTION");
    }
    return {
      counts,
      uniqueLicenses: [...uniqueLicenses],
      secretsDetected: gems.filter(g => g.hasSecrets).length,
      requiresHumanReview: counts.review + counts.human_review,
      fullyBlocked: counts.blocked,
    };
  }

  /**
   * Génère un rapport d'audit de licences au format Markdown.
   * @param {Array} gems - liste de pépites avec licenseAudit
   * @param {string} policy - politique appliquée
   * @returns {string} contenu Markdown
   */
  function buildLicenseAuditMarkdown(gems, policy) {
    const summary = summarizeLicenses(gems);
    const lines = [
      "# Audit des licences",
      "",
      `> Politique appliquée : **${policy || "commercial-permissive"}**  `,
      `> Généré le : ${new Date().toISOString()}`,
      "",
      "## Résumé global",
      "",
      `| Statut | Nombre |`,
      `|---|---|`,
      `| ✅ Autorisé | ${summary.counts.allowed || 0} |`,
      `| ⚠️ À vérifier | ${summary.counts.review || 0} |`,
      `| ❌ Bloqué | ${summary.counts.blocked || 0} |`,
      `| 🔐 Secrets détectés | ${summary.secretsDetected} |`,
      "",
      "## Détail par composant",
      "",
      "| Dépôt | Fichier | Licence | Statut | Mode |",
      "|---|---|---|---|---|",
    ];
    for (const gem of gems) {
      const repo = compact(gem.repository, 40);
      const file = compact(gem.path?.split("/").slice(-2).join("/"), 50);
      const lic = compact(gem.licenseAudit?.effectiveLicense || gem.fileLicense, 30);
      const status = gem.licenseStatus === "allowed" ? "✅" : gem.licenseStatus === "blocked" ? "❌" : "⚠️";
      const mode = gem.reuseMode || "—";
      lines.push(`| ${repo} | ${file} | ${lic} | ${status} | ${mode} |`);
    }
    lines.push("");
    lines.push("## Règle appliquée");
    lines.push("");
    lines.push("Aucun code externe n'a été intégré sans licence identifiée, compatibilité vérifiée et provenance enregistrée.");
    return lines.join("\n");
  }

  return {
    evaluateFile,
    auditGemReport,
    summarizeLicenses,
    buildLicenseAuditMarkdown,
    detectSecrets,
    extractSpdxInline,
    extractCopyright,
  };
})();

globalThis.GitHubLicenseAuditor = GitHubLicenseAuditor;
