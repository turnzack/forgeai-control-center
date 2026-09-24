/* ForgeAI Studio — GitHub Reuse Pipeline : orchestrateur de montage sélectif et génération de provenance. */
const GitHubReusePipeline = (() => {

  const INTEGRATIONS_PATH = "src/integrations/github-adapted";
  const THIRD_PARTY_FILE = "THIRD_PARTY_NOTICES.md";
  const LICENSE_AUDIT_FILE = "LICENSE_AUDIT.md";
  const PROVENANCE_REPORT_FILE = "PROVENANCE_REPORT.md";

  function now() { return new Date().toISOString(); }
  function compact(v, max = 300) { return String(v || "").trim().slice(0, max); }
  function safeSlug(v) {
    return String(v || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "source";
  }

  /* ── Mode de réutilisation → description humaine ── */
  const MODE_LABELS = {
    "extractable":  "Extraction sélective",
    "inspiration":  "Inspiration architecturale",
    "foundation":   "Fondation technique",
    "blocked":      "Bloqué",
  };

  /* ── Actions utilisateur → mode final ── */
  const ACTION_TO_MODE = {
    "use-code":     "extractable",
    "inspire-only": "inspiration",
    "foundation":   "foundation",
    "exclude":      null,
  };

  /**
   * Génère le contenu de PROVENANCE.md pour un composant réutilisé.
   * @param {Object} gem - pépite avec repository, path, fileLicense, reuseMode
   * @param {Object} source - source GitHub d'origine
   * @param {string[]} adaptations - liste des adaptations réalisées
   */
  function generateProvenanceFile(gem, source, adaptations) {
    const repoUrl = compact(source.url || `https://github.com/${gem.repository}`, 300);
    const commit = compact(source.commit || "HEAD", 80);
    const modeLabel = MODE_LABELS[gem.reuseMode] || gem.reuseMode;
    const fileName = (gem.path || "").split("/").pop();
    const lines = [
      `# Provenance — ${fileName}`,
      "",
      `| Champ | Valeur |`,
      `|---|---|`,
      `| Source | \`${gem.repository}\` |`,
      `| URL | ${repoUrl} |`,
      `| Commit | \`${commit}\` |`,
      `| Chemin original | \`${gem.path}\` |`,
      `| Licence | ${gem.fileLicense || gem.repoLicense || "NOASSERTION"} |`,
      `| Date d'import | ${now().split("T")[0]} |`,
      `| Mode | ${modeLabel} |`,
      "",
    ];
    if (adaptations && adaptations.length) {
      lines.push("## Adaptations");
      lines.push("");
      for (const a of adaptations) lines.push(`- ${a}`);
      lines.push("");
    }
    lines.push("## Avertissement");
    lines.push("");
    lines.push("Ce fichier documente la provenance d'un composant réutilisé. Toute modification ultérieure doit être consignée ici.");
    return lines.join("\n");
  }

  /**
   * Génère le NOTICE.md d'un composant (attribution minimale).
   */
  function generateNoticeFile(gem, source) {
    const repoUrl = compact(source.url || `https://github.com/${gem.repository}`, 300);
    const license = gem.fileLicense || gem.repoLicense || "voir dépôt d'origine";
    return [
      `# NOTICE — ${(gem.path || "").split("/").pop()}`,
      "",
      `Ce composant est issu de \`${gem.repository}\`.`,
      `URL : ${repoUrl}`,
      `Licence : ${license}`,
      "",
      "Conformément aux termes de la licence, cette notice doit être conservée dans toute redistribution.",
    ].join("\n");
  }

  /**
   * Génère le fichier THIRD_PARTY_NOTICES.md global.
   * @param {Array} usedGems - liste des pépites avec action "use-code" ou "foundation"
   * @param {Array} sources - sources GitHub d'origine
   */
  function generateThirdPartyNotices(usedGems, sources) {
    const lines = [
      "# Third Party Notices",
      "",
      `> Généré automatiquement le ${now().split("T")[0]} par ForgeAI Studio.`,
      `> Ce fichier liste les composants tiers réutilisés dans ce projet.`,
      "",
    ];
    const byRepo = {};
    for (const gem of usedGems) {
      if (!byRepo[gem.repository]) byRepo[gem.repository] = [];
      byRepo[gem.repository].push(gem);
    }
    for (const [repo, gems] of Object.entries(byRepo)) {
      const src = sources.find(s => s.repository === repo) || {};
      const license = gems[0]?.repoLicense || gems[0]?.fileLicense || "voir dépôt";
      const url = compact(src.url || `https://github.com/${repo}`, 300);
      lines.push(`## ${repo}`);
      lines.push("");
      lines.push(`**URL** : ${url}  `);
      lines.push(`**Licence** : ${license}  `);
      lines.push(`**Composants réutilisés** :`);
      lines.push("");
      for (const gem of gems) {
        const mode = MODE_LABELS[gem.reuseMode] || gem.reuseMode;
        lines.push(`- \`${gem.path}\` — ${mode}`);
      }
      lines.push("");
      lines.push("---");
      lines.push("");
    }
    return lines.join("\n");
  }

  /**
   * Génère le fichier PROVENANCE_REPORT.md global.
   */
  function generateProvenanceReport(usedGems, sources, projectName) {
    const lines = [
      "# Rapport de provenance",
      "",
      `**Projet** : ${projectName || "ForgeAI Project"}  `,
      `**Date** : ${now().split("T")[0]}  `,
      `**Généré par** : ForgeAI Studio — Pipeline de réutilisation sélective`,
      "",
      "## Composants intégrés",
      "",
      "| Dépôt | Fichier | Licence | Mode | Score |",
      "|---|---|---|---|---|",
    ];
    for (const gem of usedGems) {
      const repo = compact(gem.repository, 40);
      const file = compact(gem.path?.split("/").slice(-2).join("/"), 50);
      const lic = compact(gem.fileLicense || gem.repoLicense, 30);
      const mode = MODE_LABELS[gem.reuseMode] || gem.reuseMode;
      lines.push(`| ${repo} | ${file} | ${lic} | ${mode} | ${gem.score}/100 |`);
    }
    lines.push("");
    lines.push("## Sources de référence (inspiration uniquement)");
    lines.push("");
    const inspirationGems = []; // les gems en mode inspiration n'ont pas de fichier copié
    // On référence les sources dont on s'est inspiré
    for (const src of sources) {
      lines.push(`- [${src.repository}](${src.url || `https://github.com/${src.repository}`}) — référence architecturale`);
    }
    lines.push("");
    lines.push("## Déclaration");
    lines.push("");
    lines.push("Les composants listés ci-dessus ont été sélectionnés manuellement, leur licence vérifiée, et leur provenance enregistrée. Toute modification doit être consignée dans le fichier PROVENANCE.md du composant concerné.");
    return lines.join("\n");
  }

  /**
   * Construit la liste des fichiers à écrire pour le montage d'un composant.
   * @param {Object} gem - pépite avec path, repository, reuseMode
   * @param {string} content - contenu source du fichier
   * @param {Object} source - source GitHub
   * @returns {Array<{path: string, content: string}>}
   */
  function buildComponentFiles(gem, content, source) {
    const parts = (gem.repository || "unknown/repo").split("/");
    const folderName = `${safeSlug(parts[0])}-${safeSlug(parts[1] || "repo")}`;
    const fileName = (gem.path || "component.ts").split("/").pop();
    const basePath = `${INTEGRATIONS_PATH}/${folderName}`;

    const adaptations = [
      "Fichier copié depuis le dépôt source.",
      "Vérification des imports nécessaire.",
    ];

    return [
      {
        path: `${basePath}/${fileName}`,
        content: addProvenanceHeader(content, gem, source),
      },
      {
        path: `${basePath}/PROVENANCE.md`,
        content: generateProvenanceFile(gem, source, adaptations),
      },
      {
        path: `${basePath}/NOTICE.md`,
        content: generateNoticeFile(gem, source),
      },
    ];
  }

  /**
   * Ajoute un en-tête de provenance au contenu d'un fichier copié.
   */
  function addProvenanceHeader(content, gem, source) {
    const repoUrl = compact(source.url || `https://github.com/${gem.repository}`, 300);
    const license = gem.fileLicense || gem.repoLicense || "voir dépôt";
    const isSingleLine = /\.(py|rb|sh|yaml|yml|toml)$/.test(gem.path || "");
    const header = isSingleLine
      ? `# Source: ${gem.repository} | ${gem.path} | Licence: ${license}\n# ${repoUrl}\n\n`
      : `/*\n * Source: ${gem.repository}\n * Fichier: ${gem.path}\n * Licence: ${license}\n * URL: ${repoUrl}\n * Importé le: ${now().split("T")[0]} via ForgeAI Studio\n */\n\n`;
    return header + content;
  }

  /**
   * Garde de sécurité : vérifie les fichiers montés pour détecter des problèmes.
   * @param {Array<{path, content}>} files - fichiers à vérifier
   * @returns {Object} résultat de l'audit de sécurité
   */
  function runSecurityGuard(files) {
    const issues = [];
    for (const file of files) {
      const content = String(file.content || "");
      const detected = GitHubLicenseAuditor.detectSecrets(content);
      if (detected.length) {
        issues.push({ path: file.path, type: "secret", details: detected });
      }
      // Vérification URLs GitHub non validées dans package.json
      if (file.path.endsWith("package.json")) {
        if (/["']github:[^"']+["']|["']git\+https:\/\/github/.test(content)) {
          issues.push({ path: file.path, type: "github-url-dependency", details: ["URL GitHub détectée dans package.json"] });
        }
      }
    }
    return {
      passed: issues.length === 0,
      issues,
      message: issues.length
        ? `⚠️ ${issues.length} problème(s) de sécurité détecté(s).`
        : "✅ Aucun problème de sécurité détecté.",
    };
  }

  /**
   * Monte le projet final : copie les composants validés, génère les fichiers de provenance.
   * @param {Object} options
   * @param {Array} options.userChoices - [{gemId, repository, path, reuseMode, action, content}]
   * @param {Array} options.sources - sources GitHub d'origine
   * @param {string} options.projectId - identifiant du projet
   * @param {string} options.bridgeUrl - URL du bridge local
   * @param {string} options.policy - politique de licence
   */
  async function mountProject(options = {}) {
    const { userChoices = [], sources = [], projectId, bridgeUrl, policy } = options;

    if (!projectId) throw Object.assign(new Error("Identifiant de projet requis."), { code: "MOUNT_NO_PROJECT" });
    if (!userChoices.length) throw Object.assign(new Error("Aucun composant sélectionné pour le montage."), { code: "MOUNT_NO_CHOICES" });

    const usedGems = userChoices.filter(c => c.action === "use-code" || c.action === "foundation");
    const filesToWrite = [];

    // Monter les composants sélectionnés pour extraction
    for (const choice of usedGems) {
      if (!choice.content) continue; // pas de contenu = ignoré
      const source = sources.find(s => s.repository === choice.repository) || { repository: choice.repository, url: `https://github.com/${choice.repository}` };
      const componentFiles = buildComponentFiles(choice, choice.content, source);
      filesToWrite.push(...componentFiles);
    }

    // Générer les fichiers de provenance globaux
    const allUsedGems = userChoices.filter(c => c.action === "use-code" || c.action === "foundation" || c.action === "inspire-only");
    const thirdPartyNotices = generateThirdPartyNotices(usedGems, sources);
    const licenseAuditMd = GitHubLicenseAuditor.buildLicenseAuditMarkdown(allUsedGems, policy || "commercial-permissive");
    const provenanceReport = generateProvenanceReport(usedGems, sources, projectId);

    filesToWrite.push(
      { path: THIRD_PARTY_FILE, content: thirdPartyNotices },
      { path: LICENSE_AUDIT_FILE, content: licenseAuditMd },
      { path: PROVENANCE_REPORT_FILE, content: provenanceReport },
    );

    // Garde de sécurité avant écriture
    const securityGuard = runSecurityGuard(filesToWrite);
    if (!securityGuard.passed) {
      return {
        success: false,
        code: "MOUNT_SECURITY_GUARD",
        message: securityGuard.message,
        issues: securityGuard.issues,
      };
    }

    // Écriture via le bridge local
    if (!bridgeUrl) {
      return { success: false, code: "MOUNT_NO_BRIDGE", message: "Bridge local non configuré." };
    }

    try {
      const response = await fetch(`${bridgeUrl}/v1/projects/${encodeURIComponent(projectId)}/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: filesToWrite }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        throw new Error(err.message || `HTTP ${response.status}`);
      }
      const result = await response.json();
      return {
        success: true,
        filesWritten: result.count || filesToWrite.length,
        projectId,
        components: usedGems.length,
        securityGuard,
        files: filesToWrite.map(f => f.path),
        thirdPartyNotices,
        licenseAuditMd,
        provenanceReport,
      };
    } catch (err) {
      return { success: false, code: "MOUNT_BRIDGE_ERROR", message: err.message };
    }
  }

  /**
   * Applique le Mode B automatique : sélectionne automatiquement les composants éligibles.
   * @param {Array} allGems - toutes les pépites analysées
   * @param {number} scoreThreshold - score minimum (défaut 80)
   * @returns {Array} choices auto-générées
   */
  function autoSelectModeB(allGems, scoreThreshold = 80) {
    const choices = [];
    for (const gem of allGems) {
      if (gem.blocked || gem.hasSecrets) {
        choices.push({ ...gem, action: "exclude", autoSelected: true, autoReason: "Bloqué" });
        continue;
      }
      if (gem.licenseStatus === "blocked") {
        choices.push({ ...gem, action: "exclude", autoSelected: true, autoReason: "Licence bloquée" });
        continue;
      }
      if (gem.licenseStatus === "review") {
        choices.push({ ...gem, action: "inspire-only", autoSelected: true, autoReason: "Licence à vérifier" });
        continue;
      }
      if (gem.score >= scoreThreshold && gem.reuseMode === "extractable") {
        choices.push({ ...gem, action: "use-code", autoSelected: true, autoReason: `Score ${gem.score}/100 ≥ ${scoreThreshold}` });
      } else if (gem.score >= 60) {
        choices.push({ ...gem, action: "inspire-only", autoSelected: true, autoReason: `Score ${gem.score}/100 < seuil d'extraction` });
      } else {
        choices.push({ ...gem, action: "exclude", autoSelected: true, autoReason: `Score ${gem.score}/100 trop faible` });
      }
    }
    return choices;
  }

  return {
    INTEGRATIONS_PATH,
    THIRD_PARTY_FILE,
    LICENSE_AUDIT_FILE,
    PROVENANCE_REPORT_FILE,
    MODE_LABELS,
    ACTION_TO_MODE,
    mountProject,
    generateProvenanceFile,
    generateNoticeFile,
    generateThirdPartyNotices,
    generateProvenanceReport,
    buildComponentFiles,
    runSecurityGuard,
    autoSelectModeB,
    addProvenanceHeader,
  };
})();

globalThis.GitHubReusePipeline = GitHubReusePipeline;
