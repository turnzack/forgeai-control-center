/* ForgeAI Studio — controlled GitHub source archive downloader.
 * Les archives ZIP sont sauvegardées dans le dossier projet du bridge local :
 *   <WORKSPACES_ROOT>/<projet>/github-sources/<owner>__<repo>.zip
 * Si le bridge est hors ligne, fallback sur chrome.downloads vers Downloads/.
 */
const GitHubSourceDownloader = (() => {
  const MAX_SOURCES = 8;
  const ROOT_FOLDER = "github-sources";
  const WARNING = "Archives téléchargées pour consultation uniquement. Aucun code externe n'est intégré automatiquement au projet généré.";

  function now() { return new Date().toISOString(); }
  function safeSegment(value, fallback = "source") {
    const clean = String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100);
    return clean || fallback;
  }
  function repositoryParts(repository) {
    const match = String(repository || "").trim().match(/^([^/]+)\/([^/]+)$/);
    if (!match) throw new Error(`Dépôt GitHub invalide : ${repository || "(vide)"}`);
    return { owner: match[1], name: match[2] };
  }
  function archiveUrl(source) {
    const { owner, name } = repositoryParts(source.repository);
    const branch = encodeURIComponent(String(source.branch || "main"));
    return `https://codeload.github.com/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/zip/refs/heads/${branch}`;
  }
  function bytesToBase64(bytes) {
    let binary = "";
    const chunk = 0x8000;
    for (let offset = 0; offset < bytes.length; offset += chunk) {
      binary += String.fromCharCode(...bytes.subarray(offset, Math.min(offset + chunk, bytes.length)));
    }
    return btoa(binary);
  }
  async function sha256(bytes) {
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, "0")).join("");
  }
  function downloadDataUrl(dataUrl, filename) {
    return new Promise((resolve, reject) => {
      chrome.downloads.download({ url: dataUrl, filename, saveAs: false, conflictAction: "overwrite" }, (downloadId) => {
        if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
        else resolve(downloadId);
      });
    });
  }
  function downloadText(content, filename) {
    const dataUrl = `data:application/json;charset=utf-8,${encodeURIComponent(String(content || ""))}`;
    return downloadDataUrl(dataUrl, filename);
  }

  /** Vérifie si le bridge local est accessible. */
  async function isBridgeAvailable(bridgeUrl) {
    if (!bridgeUrl) return false;
    try {
      const resp = await fetch(`${bridgeUrl}/health`, { method: "GET", signal: AbortSignal.timeout(2000) });
      return resp.ok;
    } catch (_) {
      return false;
    }
  }

  /**
   * Écrit un fichier binaire (ZIP) via le bridge local en le base64-encodant.
   * Le bridge doit supporter le préfixe data URI dans le champ content.
   */
  async function writeBinaryViaBridge(bridgeUrl, projectId, filePath, bytes) {
    const base64 = `data:application/zip;base64,${bytesToBase64(bytes)}`;
    const resp = await fetch(`${bridgeUrl}/v1/projects/${encodeURIComponent(projectId)}/files`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ files: [{ path: filePath, content: base64, binary: true }] }),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ message: `HTTP ${resp.status}` }));
      throw new Error(err.message || `HTTP ${resp.status}`);
    }
    return await resp.json();
  }

  /** Écrit un fichier texte (JSON manifest) via le bridge local. */
  async function writeTextViaBridge(bridgeUrl, projectId, filePath, content) {
    const resp = await fetch(`${bridgeUrl}/v1/projects/${encodeURIComponent(projectId)}/files`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ files: [{ path: filePath, content: String(content) }] }),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ message: `HTTP ${resp.status}` }));
      throw new Error(err.message || `HTTP ${resp.status}`);
    }
    return await resp.json();
  }

  function assertDownloadable(sources) {
    if (!Array.isArray(sources) || !sources.length) throw new Error("Aucune source GitHub sélectionnée.");
    if (sources.length > MAX_SOURCES) throw new Error(`Sélectionnez au maximum ${MAX_SOURCES} sources GitHub.`);
    const blocked = sources.filter((source) => source.licenseStatus !== "allowed" || !source.repositoryLicenseChecked);
    if (blocked.length) throw new Error(`Téléchargement bloqué : seules les licences autorisées et vérifiées peuvent être téléchargées (${blocked.map((source) => source.repository).join(", ")}).`);
  }

  /**
   * Télécharge les archives ZIP des sources GitHub sélectionnées.
   * Stratégie :
   *   1. Si bridgeUrl fourni et bridge disponible → écrit dans <WORKSPACES_ROOT>/<projet>/github-sources/
   *   2. Sinon → fallback chrome.downloads → Downloads/<projet>/github-sources/
   * @param {Object} options
   * @param {Array}  options.sources       - sources GitHub validées
   * @param {string} options.projectFolder - nom du dossier projet
   * @param {string} options.projectId     - identifiant du projet (=projectFolder si absent)
   * @param {string} options.bridgeUrl     - URL du bridge local (ex: http://127.0.0.1:5006)
   * @param {string} options.token         - token GitHub optionnel
   */
  async function downloadSources(options = {}) {
    const sources = Array.isArray(options.sources) ? options.sources : [];
    assertDownloadable(sources);
    const projectFolder = safeSegment(options.projectFolder || options.projectId || "forgeai-project", "forgeai-project");
    const projectId = options.projectId || projectFolder;
    const bridgeUrl = options.bridgeUrl || null;

    // Détecter si le bridge est disponible
    const useBridge = bridgeUrl ? await isBridgeAvailable(bridgeUrl) : false;

    const results = [];
    for (const source of sources) {
      const { owner, name } = repositoryParts(source.repository);
      const repoSlug = `${safeSegment(owner)}__${safeSegment(name)}`;
      const relPath = `${ROOT_FOLDER}/${repoSlug}.zip`;

      // Téléchargement de l'archive
      const response = await fetch(archiveUrl(source), {
        method: "GET",
        headers: { Accept: "application/zip", ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}) },
      });
      if (!response.ok) throw new Error(`Téléchargement impossible pour ${source.repository} : HTTP ${response.status}`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      const hash = await sha256(bytes);

      let destination, bridgeWritten = false;
      if (useBridge) {
        // Écriture via bridge local → dossier projet dans WORKSPACES_ROOT
        await writeBinaryViaBridge(bridgeUrl, projectId, relPath, bytes);
        destination = `${projectId}/${relPath}`;
        bridgeWritten = true;
      } else {
        // Fallback : chrome.downloads vers Downloads/
        const filename = `${projectFolder}/${relPath}`;
        await downloadDataUrl(`data:application/zip;base64,${bytesToBase64(bytes)}`, filename);
        destination = `Downloads/${filename}`;
      }

      results.push({
        repository: source.repository,
        url: source.url,
        branch: source.branch || "main",
        archiveUrl: archiveUrl(source),
        destination,
        relPath,
        sizeBytes: bytes.byteLength,
        sha256: hash,
        license: source.license,
        licenseStatus: source.licenseStatus,
        downloadedAt: now(),
        bridgeWritten,
        referenceOnly: true,
      });
    }

    // Manifeste JSON des sources
    const manifest = {
      schemaVersion: "1.1.0",
      projectId,
      generatedAt: now(),
      referenceOnly: true,
      warning: WARNING,
      storagePath: useBridge ? `${projectId}/${ROOT_FOLDER}/` : `Downloads/${projectFolder}/${ROOT_FOLDER}/`,
      bridgeUsed: useBridge,
      sources: results,
    };
    const manifestContent = JSON.stringify(manifest, null, 2);
    const manifestRelPath = `${ROOT_FOLDER}/sources.github.json`;

    if (useBridge) {
      await writeTextViaBridge(bridgeUrl, projectId, manifestRelPath, manifestContent);
    } else {
      const manifestFilename = `${projectFolder}/${manifestRelPath}`;
      await downloadText(manifestContent, manifestFilename);
    }

    return {
      success: true,
      projectFolder,
      projectId,
      bridgeUsed: useBridge,
      folder: manifest.storagePath,
      warning: WARNING,
      results,
      manifest,
    };
  }

  return { MAX_SOURCES, ROOT_FOLDER, WARNING, archiveUrl, sha256, isBridgeAvailable, downloadSources };
})();

globalThis.GitHubSourceDownloader = GitHubSourceDownloader;
