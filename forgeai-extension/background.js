/**
 * KIROV5 Orchestrator — Background Service Worker
 * Message hub: popup ↔ orchestrator ↔ content scripts
 * + Bridge config + GitHub push (from KIROV4)
 */

importScripts(
  "lib/constants.js",
  "lib/pack-registry.js",
  "lib/pack-builder.js",
  "lib/gatekeeper.js",
  "lib/command-router.js",
  "lib/artifact-writer.js",
  "lib/orchestrator.js",
  "lib/bridge_polling.js",
  "lib/github_pusher.js",
  "lib/youtube-transcript.js",
  "lib/github_client.js",
  "lib/license_policy.js",
  "lib/github_schemas.js",
  "lib/rate_limiter.js",
  "lib/repository_metadata.js",
  "lib/project_sources.js",
  "lib/source_manifest.js",
  "lib/github_source_pipeline.js",
  "lib/github_source_downloader.js",
  "lib/github_search.js",
  "lib/github_license_auditor.js",
  "lib/github_gem_analyzer.js",
  "lib/github_reuse_pipeline.js"
);


async function resolveProjectId(requested) {
  if (requested && requested !== "current") return String(requested);
  const pack = await PackRegistry.getPack();
  return String(pack?.state?.projectName || pack?.state?.folderName || pack?.state?.name || pack?.name || "default");
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("[KIROV5] Orchestrator v5.1.1 installé — fix structure React + extensions.");
  autoDetectAndSaveBridge();
});

/* ── Auto-détection & Auto-sauvegarde du Bridge en arrière-plan ── */
async function autoDetectAndSaveBridge() {
  try {
    const cfg = await BridgePolling.getConfig();
    const targetUrl = cfg.serverUrl || "http://127.0.0.1:5006";
    const testResult = await BridgePolling.test(targetUrl);
    if (testResult.success) {
      await BridgePolling.setConfig({
        serverUrl: targetUrl,
        vercelUrl: cfg.vercelUrl || "https://forge-kohl-kappa.vercel.app",
        enabled: true,
      });
      // Synchroniser la clé API DeepSeek avec le serveur bridge 5006
      try {
        const key = await CommandRouter.getApiKey("deepseek");
        if (key) {
          fetch(`${targetUrl.replace(/\/$/, "")}/api/bridge/config`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ apiKey: key }),
          }).catch(() => {});
        }
      } catch (_) {}
      console.log("[KIROV5 Background] ✅ Bridge local auto-connecté & sauvegardé (5006)");
    }
  } catch (e) {
    // Silencieux
  }
}

// Lancement automatique au démarrage du Service Worker + vérification toutes les 8 secondes
autoDetectAndSaveBridge();
setInterval(autoDetectAndSaveBridge, 8000);

// Progress fan-out to popup
function broadcastProgress(progress) {
  try {
    chrome.runtime.sendMessage({ type: "PIPELINE_PROGRESS", progress });
  } catch (_) {}
}

function broadcastLog(message, level) {
  try {
    chrome.runtime.sendMessage({ type: "KIROV_LOG", message, level: level || "info", ts: Date.now() });
  } catch (_) {}
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      switch (message.type) {
        /* ── Project lifecycle ── */
        case "CREATE_PROJECT": {
          const result = await Orchestrator.createProject(
            message.projectName,
            message.projectDescription,
            {
              folderName: message.folderName,
              execMode: message.execMode,
              webAi: message.webAi,
            }
          );
          sendResponse(result);
          break;
        }

        case "GET_PACK": {
          const pack = await Orchestrator.getPack();
          sendResponse({ success: true, pack });
          break;
        }

        case "GET_STEP_INFO": {
          const info = await Orchestrator.getCurrentStepInfo();
          try {
            const bridgeData = await chrome.storage.local.get("kirov5_bridge_phase");
            if (bridgeData.kirov5_bridge_phase !== undefined && bridgeData.kirov5_bridge_phase !== null) {
              const bPhase = parseInt(bridgeData.kirov5_bridge_phase, 10);
              if (!isNaN(bPhase) && PIPELINE_STEPS[bPhase]) {
                info.step = PIPELINE_STEPS[bPhase];
                info.completedSteps = Array.from({length: bPhase}, (_, i) => i);
              }
            }
          } catch(e) {}
          sendResponse({ success: true, stepInfo: info });
          break;
        }

        case "SET_BRIDGE_PHASE": {
          await chrome.storage.local.set({ "kirov5_bridge_phase": message.phase });
          sendResponse({ success: true });
          break;
        }

        case "FETCH_SIMPLE": {
          try {
            const res = await fetch(message.url, message.options);
            const text = await res.text();
            sendResponse({
              success: true,
              result: {
                ok: res.ok,
                status: res.status,
                text: text
              }
            });
          } catch (error) {
            sendResponse({ success: false, error: error.message });
          }
          break;
        }

        case "RESET_PROJECT": {
          const result = await Orchestrator.resetProject();
          sendResponse(result);
          break;
        }

        /* ── Provider / models ── */
        case "SET_API_KEY": {
          const result = await Orchestrator.setApiKey(message.apiKey, message.providerId);
          if (message.apiKey) {
            try {
              fetch("http://127.0.0.1:5006/api/bridge/config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ apiKey: message.apiKey.trim() }),
              }).catch(() => {});
            } catch (_) {}
          }
          sendResponse(result);
          break;
        }

        case "GET_API_KEY": {
          const key = await CommandRouter.getApiKey(message.providerId);
          sendResponse({ success: true, apiKey: key });
          break;
        }

        case "HAS_API_KEY": {
          const has = await Orchestrator.hasApiKey(message.providerId);
          sendResponse({ success: true, hasApiKey: has });
          break;
        }

        case "SET_PROVIDER": {
          const result = await Orchestrator.setProvider(message.providerId);
          sendResponse(result);
          break;
        }

        case "GET_PROVIDER": {
          const provider = await Orchestrator.getProvider();
          sendResponse({ success: true, provider });
          break;
        }

        case "GET_CONFIG_STATUS": {
          const status = await Orchestrator.getConfigStatus();
          const bridge = await BridgePolling.getConfig();
          const github = await GitHubPusher.getConfig();
          const uiCfg = await chrome.storage.local.get("kirov5_uiAi");
          sendResponse({
            success: true,
            ...status,
            uiAi: uiCfg.kirov5_uiAi || "stitch",
            bridge,
            github: {
              hasToken: !!github.token,
              repo: github.repo,
              branch: github.branch,
            },
          });
          break;
        }

        case "DETECT_MODELS": {
          if (message.providerId) {
            await Orchestrator.setProvider(message.providerId);
          }
          if (message.apiKey) {
            await Orchestrator.setApiKey(message.apiKey, message.providerId);
          }
          const result = await Orchestrator.detectModels();
          sendResponse(result);
          break;
        }

        case "SET_MODEL": {
          const result = await Orchestrator.setModel(message.model, message.providerId);
          sendResponse(result);
          break;
        }

        case "GET_MODEL": {
          const result = await Orchestrator.getModel(message.providerId);
          sendResponse(result);
          break;
        }

        case "SET_EXEC_MODE": {
          await Orchestrator.setExecMode(message.mode);
          sendResponse({ success: true, mode: message.mode });
          break;
        }

        case "SET_WEB_AI": {
          await Orchestrator.setWebAi(message.webAi);
          sendResponse({ success: true, webAi: message.webAi });
          break;
        }

        case "SET_UI_AI": {
          await chrome.storage.local.set({ "kirov5_uiAi": message.uiAi });
          sendResponse({ success: true, uiAi: message.uiAi });
          break;
        }

        case "GET_PROVIDERS_LIST": {
          sendResponse({
            success: true,
            providers: Object.values(PROVIDERS),
            webTargets: Object.values(WEB_AI_TARGETS),
            steps: PIPELINE_STEPS,
            version: EXTENSION_VERSION,
          });
          break;
        }

        /* ── Pipeline ── */
        case "RUN_STEP": {
          const result = await Orchestrator.runCurrentStep({
            execMode: message.execMode,
            webAi: message.webAi,
            saveAs: message.saveAs,
          });
          sendResponse(result);
          break;
        }

        case "ADVANCE_STEP": {
          const result = await Orchestrator.advanceStep();
          sendResponse(result);
          break;
        }

        case "RUN_FULL_PIPELINE": {
          const result = await Orchestrator.runFullPipeline(broadcastProgress, {
            execMode: message.execMode,
            webAi: message.webAi,
            saveAs: message.saveAs,
          });
          sendResponse(result);
          break;
        }

        case "WRITE_ARTIFACTS": {
          const result = await ArtifactWriter.writeAll({
            folderName: message.folderName,
            saveAs: !!message.saveAs,
          });
          sendResponse(result);
          break;
        }

        case "WRITE_FILES": {
          const result = await ArtifactWriter.writeFiles(
            message.files || [],
            message.folderName,
            !!message.saveAs
          );
          sendResponse(result);
          break;
        }

        /* ── Folder name ── */
        case "SET_FOLDER_NAME": {
          await PackRegistry.setFolderName(message.folderName);
          const pack = await PackRegistry.getPack();
          if (pack) {
            pack.state.folderName = message.folderName;
            await PackRegistry.savePack(pack);
          }
          sendResponse({ success: true, folderName: message.folderName });
          break;
        }

        case "GET_FOLDER_NAME": {
          const name = await PackRegistry.getFolderName();
          sendResponse({ success: true, folderName: name });
          break;
        }

        /* ── Open AI tab ── */
        case "OPEN_WEB_AI": {
          const target = WEB_AI_TARGETS[message.webAi] || WEB_AI_TARGETS.deepseek;
          const tabId = await Orchestrator.ensureWebAiTab(target);
          sendResponse({ success: !!tabId, tabId, url: target.url });
          break;
        }

        /* ── Ping content script ── */
        case "PING_CONTENT": {
          const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
          if (!tabs[0]) {
            sendResponse({ success: false, message: "Aucun onglet actif" });
            break;
          }
          try {
            const resp = await chrome.tabs.sendMessage(tabs[0].id, { type: "KIROV_PING" });
            sendResponse(resp || { success: false });
          } catch (e) {
            sendResponse({ success: false, message: e.message });
          }
          break;
        }

        /* ── Direct inject / capture via active or AI tab ── */
        case "INJECT_PROMPT": {
          const result = await injectToWebAi(message.prompt, message.webAi, false);
          sendResponse(result);
          break;
        }

        case "INJECT_AND_CAPTURE": {
          const result = await injectToWebAi(message.prompt, message.webAi, true, {
            minLength: message.minLength,
            minFiles: message.minFiles,
            timeout: message.timeout,
          });
          sendResponse(result);
          break;
        }

        case "CAPTURE_ONLY": {
          const result = await captureFromWebAi(message.webAi, {
            minLength: message.minLength,
            minFiles: message.minFiles,
            timeout: message.timeout,
          });
          sendResponse(result);
          break;
        }

        /* ── YouTube Transcript Extraction ── */
        case "EXTRACT_YOUTUBE_TRANSCRIPT": {
          try {
            const url = message.url;
            if (!YouTubeTranscript.isYouTubeUrl(url)) {
              sendResponse({ success: false, error: `URL non YouTube : ${url}` });
              break;
            }
            console.log(`[KIROV5 BG] 🎬 Extraction transcript YouTube : ${url}`);
            const data = await YouTubeTranscript.extract(url);
            console.log(`[KIROV5 BG] ✅ Transcript extrait : ${data.transcript ? data.transcript.split(/\s+/).length + ' mots' : 'sous-titres indisponibles'}`);

            // Optionnel : envoyer directement au bridge Kirov5 (port 5006) pour enrichir v0-guest
            if (message.sendToBridge) {
              try {
                const cfg = await BridgePolling.getConfig();
                const bridgeUrl = (cfg.serverUrl || 'http://127.0.0.1:5006').replace(/\/$/, '');
                await fetch(`${bridgeUrl}/api/bridge/youtube-context`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ url, ...data })
                }).catch(() => {});
                console.log(`[KIROV5 BG] 📡 Transcript envoyé au bridge (5006)`);
              } catch (_) {}
            }

            sendResponse({ success: true, ...data });
          } catch (e) {
            console.error('[KIROV5 BG] Erreur extraction YouTube:', e);
            sendResponse({ success: false, error: e.message });
          }
          break;
        }

        /* ── GitHub ── */
        case "SET_GITHUB": {
          await GitHubPusher.setConfig({
            token: message.token,
            repo: message.repo,
            branch: message.branch,
          });
          sendResponse({ success: true });
          break;
        }

        case "GET_GITHUB": {
          const gh = await GitHubPusher.getConfig();
          sendResponse({
            success: true,
            token: gh.token || "",
            repo: gh.repo || "",
            branch: gh.branch || "main",
          });
          break;
        }

        case "PUSH_GITHUB": {
          let files = message.files || [];
          if (!files.length) {
            // Try pack codeFiles
            const pack = await PackRegistry.getPack();
            if (pack?.state?.codeFiles?.length) files = pack.state.codeFiles;
          }
          if (!files.length) {
            // Try last captured
            const stored = await chrome.storage.local.get([STORAGE_KEYS.CAPTURED_FILES]);
            files = stored[STORAGE_KEYS.CAPTURED_FILES] || [];
          }
          const result = await GitHubPusher.push(files, {
            message: message.commitMessage,
            token: message.token,
            repo: message.repo,
            branch: message.branch,
          });
          if (result.success) broadcastLog(result.message, "success");
          else broadcastLog("GitHub: " + result.message, "error");
          sendResponse(result);
          break;
        }

        /* ── Bridge ── */
        case "SET_BRIDGE": {
          await BridgePolling.setConfig({
            serverUrl: message.serverUrl,
            vercelUrl: message.vercelUrl,
            enabled: message.enabled,
            interval: message.interval,
          });
          sendResponse({ success: true });
          break;
        }

        case "GET_BRIDGE": {
          const cfg = await BridgePolling.getConfig();
          sendResponse({ success: true, ...cfg });
          break;
        }

        case "TEST_BRIDGE": {
          // 🛡️ Fetch DIRECT ici (pas via proxyFetch) pour éviter la boucle récursive SW→SW
          const testUrl = (message.url || "http://127.0.0.1:5006").replace(/\/$/, "");
          const endpoints = ["/health", "/api/bridge/health", "/bridge/health", "/v1/bridge/poll"];
          let bridgeOk = false;
          let lastErr = "";
          for (const ep of endpoints) {
            try {
              const controller = new AbortController();
              const tid = setTimeout(() => controller.abort(), 5000);
              const res = await fetch(`${testUrl}${ep}`, {
                method: "GET",
                headers: { Accept: "application/json" },
                signal: controller.signal,
              });
              clearTimeout(tid);
              if (res.ok) {
                bridgeOk = true;
                sendResponse({ success: true, message: "Bridge connecté", endpoint: ep, status: res.status });
                break;
              } else {
                lastErr = `HTTP ${res.status}`;
              }
            } catch (e) {
              lastErr = e.message;
            }
          }
          if (!bridgeOk) {
            sendResponse({ success: false, message: `Failed to fetch (Bridge hors ligne) - ${lastErr}` });
          }
          break;
        }

        case "CONTROL_CENTER_REQUEST": {
          try {
            if (message.path === "/v1/control/status") {
              const pack = await PackRegistry.getPack();
              const projectId = await resolveProjectId(message.projectId);
              const sources = await ProjectSources.get(projectId);
              sendResponse({ success: true, result: { ok: true, status: 200, data: {
                projectId,
                projectName: pack?.projectName || null,
                folderName: pack?.state?.folderName || null,
                currentStep: pack?.state?.currentStep ?? null,
                completedSteps: pack?.state?.completedSteps || [],
                sourceCount: sources.length,
                sourcePipeline: pack?.state?.sourcePipeline || null,
                codegenApproval: pack?.state?.codegenApproval || null,
                artifacts: Object.keys(pack?.state?.artifacts || {}),
              }, text: "" } });
              break;
            }
            const path = String(message.path || "");
            if (path === "/v1/github/config") {
              const init = message.init || {};
              if ((init.method || "GET").toUpperCase() === "POST") {
                const payload = init.body ? JSON.parse(init.body) : {};
                await GitHubPusher.setConfig({ token: payload.token, repo: payload.repo, branch: payload.branch });
              }
              const github = await GitHubPusher.getConfig();
              const data = { success: true, repo: github.repo || GitHubPusher.DEFAULT_REPO, branch: github.branch || GitHubPusher.DEFAULT_BRANCH, hasToken: !!github.token };
              sendResponse({ success: true, result: { ok: true, status: 200, data, text: JSON.stringify(data) } });
              break;
            }

            /* Synchronisation d'intention Pack/Projet depuis le cockpit web */
            if (path === "/v1/github/sync-intent") {
              const payload = message.init?.body ? JSON.parse(message.init.body) : {};
              const stored = await new Promise((r) => chrome.storage.local.get(["forgeai_github_search_state_v1"], r));
              const existing = stored?.["forgeai_github_search_state_v1"] || {};
              const updated = {
                ...existing,
                projectIdea: payload.projectIdea !== undefined ? payload.projectIdea : (existing.projectIdea || ""),
                query: payload.query !== undefined ? payload.query : (existing.query || ""),
                projectName: payload.projectName || existing.projectName || "default",
                packSlug: payload.packSlug || existing.packSlug || null,
                savedAt: new Date().toISOString(),
              };
              await new Promise((r) => chrome.storage.local.set({ ["forgeai_github_search_state_v1"]: updated }, r));
              broadcastLog(`Intention projet synchronisée : ${updated.projectName} — ${updated.packSlug || "libre"}`, "info");
              sendResponse({ success: true, result: { ok: true, status: 200, data: updated } });
              break;
            }

            /* Recherche GitHub depuis le cockpit web */
            if (path === "/v1/github/search") {
              try {
                const payload = message.init?.body ? JSON.parse(message.init.body) : {};
                const cfg = await GitHubPusher.getConfig();
                const policy = payload.policy || (await ProjectSources.getPolicy());
                const result = await GitHubSearch.searchForProject({
                  token: payload.token || cfg.token || null,
                  projectIdea: payload.projectIdea || "",
                  query: payload.query || "",
                  language: payload.language || "",
                  minStars: GitHubSchemas.clampInt(payload.minStars, 0, 1000000, 0),
                  freshnessDays: GitHubSchemas.clampInt(payload.freshnessDays, 30, 3650, 1095),
                  licenses: Array.isArray(payload.licenses) && payload.licenses.length ? payload.licenses : ["MIT", "Apache-2.0", "BSD-3-Clause", "ISC"],
                  policy,
                  perPage: GitHubSchemas.clampInt(payload.perPage, 1, 30, 20),
                });

                const stateToSave = {
                  projectIdea: payload.projectIdea || "",
                  query: payload.query || "",
                  language: payload.language || "",
                  minStars: payload.minStars || "0",
                  freshness: "1095",
                  policy,
                  licenses: ["MIT", "Apache-2.0", "BSD-3-Clause", "ISC"],
                  sort: "score",
                  candidates: result.items,
                  selected: [],
                  summary: result.summary,
                  savedAt: new Date().toISOString(),
                };
                await new Promise((r) => chrome.storage.local.set({ ["forgeai_github_search_state_v1"]: stateToSave }, r));
                broadcastLog(`${result.items.length} dépôts GitHub trouvés pour "${payload.query}"`, "success");

                sendResponse({
                  success: true,
                  result: {
                    ok: true,
                    status: 200,
                    data: {
                      candidates: result.items,
                      summary: result.summary,
                      capabilities: result.capabilities,
                      count: result.items.length,
                    }
                  }
                });
              } catch (err) {
                sendResponse({ success: false, result: { ok: false, status: 500, message: err.message } });
              }
              break;
            }
            const projectMatch = path.match(/^\/v1\/projects\/([^/]+)\/(files|github)$/);
            if (projectMatch) {
              const projectName = decodeURIComponent(projectMatch[1]);
              const payload = message.init?.body ? JSON.parse(message.init.body) : {};
              const files = Array.isArray(payload.files) ? payload.files : [];
              if (!files.length || files.length > 500) throw new Error("Le projet doit contenir entre 1 et 500 fichiers.");
              if (projectMatch[2] === "github") {
                const result = await GitHubPusher.push(files, {
                  repo: payload.repo,
                  branch: payload.branch,
                  message: payload.commitMessage || `ForgeAI : ${projectName}`,
                });
                sendResponse({ success: true, result: { ok: !!result.success, status: result.success ? 200 : 400, data: result, text: JSON.stringify(result) } });
                break;
              }
              const downloads = [];
              for (const file of files) {
                const safePath = String(file.path || "").replace(/\\/g, "/").replace(/^\/+/, "");
                if (!safePath || safePath.split("/").some((part) => part === ".." || part === ".")) continue;
                const blob = new Blob([String(file.content || "")], { type: "text/plain;charset=utf-8" });
                const reader = new FileReader();
                const dataUrl = await new Promise((resolve, reject) => {
                  reader.onloadend = () => resolve(reader.result);
                  reader.onerror = reject;
                  reader.readAsDataURL(blob);
                });
                const downloadId = await new Promise((resolve, reject) => {
                  chrome.downloads.download(
                    { url: dataUrl, filename: `ForgeAI/${projectName}/${safePath}`, saveAs: false, conflictAction: "overwrite" },
                    (id) => chrome.runtime.lastError ? reject(new Error(chrome.runtime.lastError.message)) : resolve(id)
                  );
                });
                downloads.push(downloadId);
              }
              const result = { success: true, mode: "extension-downloads", count: downloads.length, projectName, message: `${downloads.length} fichier(s) envoyés dans Downloads/ForgeAI/${projectName}/` };
              broadcastLog(result.message, "success");
              sendResponse({ success: true, result: { ok: true, status: 200, data: result, text: JSON.stringify(result) } });
              break;
            }
            const cfg = await BridgePolling.getConfig();
            const bridgeUrl = (cfg.serverUrl || BRIDGE_DEFAULTS.SERVER_URL).replace(/\/$/, "");
            const allowed = /^\/(health|api\/bridge\/health|bridge\/health|v1\/control\/status|v1\/github\/config|v1\/projects(?:\/[^/]+(?:\/(?:tree|command|files|github))?)?|v1\/commands)$/.test(path);
            if (!allowed) throw new Error("Endpoint Bridge non autorisé par le relais de contrôle.");
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 15000);
            const init = message.init || {};
            const res = await fetch(`${bridgeUrl}${path}`, {
              method: init.method || "GET",
              headers: init.headers || { Accept: "application/json" },
              body: init.body,
              signal: controller.signal,
            });
            clearTimeout(timer);
            const text = await res.text();
            let data = null;
            try { data = text ? JSON.parse(text) : null; } catch (_) { data = { output: text }; }
            sendResponse({ success: true, result: { ok: res.ok, status: res.status, data, text } });
          } catch (e) {
            sendResponse({ success: false, error: e.message });
          }
          break;
        }

        /* ── Bridge Projects (synced with web app) ── */
        case "GET_BRIDGE_PROJECTS": {
          try {
            const cfg = await BridgePolling.getConfig();
            const bridgeUrl = (cfg.serverUrl || BRIDGE_DEFAULTS.SERVER_URL).replace(/\/$/, "");
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 8000);
            const res = await fetch(`${bridgeUrl}/v1/projects`, {
              signal: controller.signal,
              headers: { Accept: "application/json" },
            });
            clearTimeout(timer);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const names = await res.json();
            const projects = (Array.isArray(names) ? names : []).map((name) => ({
              name,
              stack: null,
              fileCount: 0,
              hasIndexHtml: false,
              createdAt: 0,
            }));
            sendResponse({ success: true, projects });
          } catch (e) {
            sendResponse({ success: false, message: e.message, projects: [] });
          }
          break;
        }

        case "GET_BRIDGE_PROJECT_TREE": {
          try {
            const cfg = await BridgePolling.getConfig();
            const bridgeUrl = (cfg.serverUrl || BRIDGE_DEFAULTS.SERVER_URL).replace(/\/$/, "");
            const projectId = encodeURIComponent(message.projectId || "");
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 8000);
            const res = await fetch(`${bridgeUrl}/v1/projects/${projectId}/tree`, {
              signal: controller.signal,
              headers: { Accept: "application/json" },
            });
            clearTimeout(timer);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const raw = await res.json();
            // Normalize tree: bridge returns {"src":{"type":"file"},"app":{"page.tsx":{"type":"file"},...}}
            function normalizeTree(obj, basePath) {
              const nodes = [];
              if (!obj || typeof obj !== "object") return nodes;
              const entries = Object.entries(obj);
              for (const [key, val] of entries) {
                const fullPath = basePath ? `${basePath}/${key}` : key;
                if (val && typeof val === "object" && val.type === "file") {
                  nodes.push({ name: key, path: fullPath, type: "file" });
                } else if (val && typeof val === "object" && !Array.isArray(val)) {
                  const children = normalizeTree(val, fullPath);
                  nodes.push({ name: key, path: fullPath, type: "directory", children });
                }
              }
              // Sort: directories first, then files
              nodes.sort((a, b) => {
                if (a.type === "directory" && b.type !== "directory") return -1;
                if (a.type !== "directory" && b.type === "directory") return 1;
                return a.name.localeCompare(b.name);
              });
              return nodes;
            }
            const tree = normalizeTree(raw, "");
            sendResponse({ success: true, tree });
          } catch (e) {
            sendResponse({ success: false, message: e.message, tree: [] });
          }
          break;
        }

        /* ── Store captured files (from content) ── */
        case "STORE_CAPTURED": {
          const files = message.files || [];
          await chrome.storage.local.set({ [STORAGE_KEYS.CAPTURED_FILES]: files });
          broadcastLog(`📦 ${files.length} fichiers capturés stockés`, "success");
          sendResponse({ success: true, count: files.length });
          break;
        }

        case "GET_CAPTURED": {
          const stored = await chrome.storage.local.get([STORAGE_KEYS.CAPTURED_FILES]);
          sendResponse({
            success: true,
            files: stored[STORAGE_KEYS.CAPTURED_FILES] || [],
          });
          break;
        }
        /* ── GitHub source discovery ── */
        case "SEARCH_GITHUB_FOR_PROJECT": {
          try {
            const cfg = await GitHubPusher.getConfig();
            const policy = message.policy || await ProjectSources.getPolicy();
            const result = await GitHubSearch.searchForProject({
              token: message.token || cfg.token || null,
              projectIdea: message.projectIdea || "",
              query: message.query || "",
              language: message.language || "",
              minStars: GitHubSchemas.clampInt(message.minStars, 0, 1000000, 0),
              freshnessDays: GitHubSchemas.clampInt(message.freshnessDays, 30, 3650, 1095),
              licenses: Array.isArray(message.licenses) ? message.licenses : [],
              policy,
              perPage: GitHubSchemas.clampInt(message.perPage, 1, 30, 20),
            });
            sendResponse({
              success: true,
              requestId: `ghsrc_${Date.now()}`,
              candidates: result.items,
              capabilities: result.capabilities,
              summary: result.summary,
              rateLimit: result.rateLimit,
            });
          } catch (error) {
            sendResponse({ success: false, code: error.code || "GITHUB_ERROR", message: error.message, rateLimit: error.rateLimit || RateLimiter.status() });
          }
          break;
        }
        case "GET_GITHUB_SOURCE_POLICY": {
          sendResponse({ success: true, policy: await ProjectSources.getPolicy(), allowed: LicensePolicy.getAllowedLicenses(await ProjectSources.getPolicy()) });
          break;
        }
        case "SET_GITHUB_SOURCE_POLICY": {
          try { sendResponse({ success: true, policy: await ProjectSources.setPolicy(message.policy) }); }
          catch (error) { sendResponse({ success: false, code: "INVALID_LICENSE_POLICY", message: error.message }); }
          break;
        }
        case "SET_PROJECT_SOURCES": {
          try {
            const projectId = await resolveProjectId(message.projectId);
            const sources = await ProjectSources.set(projectId, message.sources || []);
            const artifacts = await SourceManifest.build(projectId);
            sendResponse({ success: true, projectId, count: sources.length, sources, artifacts });
          } catch (error) { sendResponse({ success: false, code: "INVALID_PROJECT_SOURCES", message: error.message }); }
          break;
        }
        case "PREPARE_PROJECT_WITH_GITHUB_SOURCES": {
          try {
            const result = await GitHubSourcePipeline.prepareProject({
              projectName: message.projectName,
              projectDescription: message.projectDescription,
              projectIdea: message.projectIdea,
              folderName: message.folderName,
              execMode: message.execMode,
              webAi: message.webAi,
              policy: message.policy,
              automationMode: message.automationMode,
              autoCreate: message.autoCreate !== false,
              sources: message.sources || [],
            });
            let pipeline = null;
            if (message.autoRunSpecs !== false) {
              pipeline = await Orchestrator.runFullPipeline(broadcastProgress, {
                execMode: message.execMode || result.pack?.state?.execMode,
                webAi: message.webAi || result.pack?.state?.webAi,
              });
              if (!pipeline.success && !pipeline.awaitingApproval) {
                sendResponse({
                  success: false,
                  code: "SOURCE_PIPELINE_EXECUTION_FAILED",
                  message: pipeline.message || "La génération des spécifications a échoué.",
                  created: result.created,
                  projectId: result.projectId,
                  pipeline,
                });
                break;
              }
            }
            broadcastLog(`Sources GitHub intégrées : ${result.sources.length} référence(s), provenance préparée.`, "success");
            sendResponse({
              success: true,
              created: result.created,
              projectId: result.projectId,
              count: result.sources.length,
              artifacts: result.artifacts,
              codegenApproval: result.pack?.state?.codegenApproval,
              pipeline,
            });
          } catch (error) {
            sendResponse({ success: false, code: error.code || "SOURCE_PIPELINE_ERROR", message: error.message });
          }
          break;
        }
        case "GET_SOURCE_PIPELINE_STATUS": {
          const pack = await PackRegistry.getPack();
          const projectId = await resolveProjectId(message.projectId);
          const sources = await ProjectSources.get(projectId);
          sendResponse({
            success: true,
            projectId,
            sourceCount: sources.length,
            sourcePipeline: pack?.state?.sourcePipeline || null,
            codegenApproval: pack?.state?.codegenApproval || null,
            currentStep: pack?.state?.currentStep ?? null,
          });
          break;
        }
        case "APPROVE_SOURCE_CODEGEN": {
          const result = await GitHubSourcePipeline.approveCodegen();
          if (result.success) broadcastLog("Validation reçue : génération du code autorisée.", "success");
          sendResponse(result);
          break;
        }
        case "DOWNLOAD_GITHUB_SOURCES": {
          try {
            const pack = await PackRegistry.getPack();
            const projectId = await resolveProjectId(message.projectId);
            const sources = Array.isArray(message.sources) && message.sources.length
              ? message.sources
              : await ProjectSources.get(projectId);
            const github = await GitHubPusher.getConfig();
            const bridgeCfg = await BridgePolling.getConfig();
            const result = await GitHubSourceDownloader.downloadSources({
              projectId,
              projectFolder: message.projectFolder || pack?.state?.folderName || projectId,
              sources,
              token: message.token || github.token || null,
              bridgeUrl: bridgeCfg?.serverUrl || message.bridgeUrl || null,
            });
            const dest = result.bridgeUsed ? result.folder : `Downloads/${result.folder}`;
            broadcastLog(`${result.results.length} archive(s) GitHub téléchargée(s) dans ${dest}`, "success");
            sendResponse(result);
          } catch (error) {
            sendResponse({ success: false, code: error.code || "GITHUB_DOWNLOAD_ERROR", message: error.message });
          }
          break;
        }

        /* ── Analyse des pépites GitHub ── */
        case "ANALYZE_GEMS": {
          try {
            const pack = await PackRegistry.getPack();
            const projectId = await resolveProjectId(message.projectId);
            const sources = message.sources || (pack ? await ProjectSources.get(projectId) : []);
            const github = await GitHubPusher.getConfig();
            const token = message.token || github.token || null;
            const policy = message.policy || pack?.state?.sourcePipeline?.policy || "commercial-permissive";
            broadcastLog("Analyse des pépites GitHub en cours...", "info");
            const gemReport = await GitHubGemAnalyzer.analyzeAll(sources, token);
            // Stocker le rapport dans le pack
            if (pack) {
              pack.state = pack.state || {};
              pack.state.gemReport = gemReport;
              pack.state.updatedAt = new Date().toISOString();
              await PackRegistry.savePack(pack);
            }
            broadcastLog(`Analyse terminée : ${gemReport.summary.totalGems} pépite(s) détectée(s).`, "success");
            sendResponse({ success: true, gemReport, projectId });
          } catch (error) {
            sendResponse({ success: false, code: error.code || "GEM_ANALYZE_ERROR", message: error.message });
          }
          break;
        }

        /* ── Sauvegarde des choix utilisateur sur les pépites ── */
        case "SAVE_GEM_CHOICES": {
          try {
            const pack = await PackRegistry.getPack();
            if (!pack) { sendResponse({ success: false, message: "Aucun projet actif." }); break; }
            pack.state = pack.state || {};
            pack.state.gemChoices = message.choices || [];
            pack.state.updatedAt = new Date().toISOString();
            await PackRegistry.savePack(pack);
            sendResponse({ success: true, saved: (message.choices || []).length });
          } catch (error) {
            sendResponse({ success: false, message: error.message });
          }
          break;
        }

        /* ── Montage du projet avec les composants sélectionnés ── */
        case "MOUNT_PROJECT": {
          try {
            const pack = await PackRegistry.getPack();
            const projectId = await resolveProjectId(message.projectId);
            const choices = message.choices || pack?.state?.gemChoices || [];
            const sources = message.sources || (pack ? await ProjectSources.get(projectId) : []);
            const bridgeCfg = await BridgePolling.getConfig();
            const bridgeUrl = bridgeCfg?.serverUrl || message.bridgeUrl;
            const policy = message.policy || pack?.state?.sourcePipeline?.policy || "commercial-permissive";
            broadcastLog("Montage du projet en cours...", "info");
            const result = await GitHubReusePipeline.mountProject({
              userChoices: choices,
              sources,
              projectId,
              bridgeUrl,
              policy,
            });
            if (result.success) {
              broadcastLog(`Montage réussi : ${result.filesWritten} fichier(s) écrit(s).`, "success");
              // Mise à jour du pack avec les données de montage
              if (pack) {
                pack.state.mountResult = result;
                pack.state.updatedAt = new Date().toISOString();
                await PackRegistry.savePack(pack);
              }
            } else {
              broadcastLog(`Montage échoué : ${result.message}`, "error");
            }
            sendResponse(result);
          } catch (error) {
            sendResponse({ success: false, code: error.code || "MOUNT_ERROR", message: error.message });
          }
          break;
        }

        /* ── Récupération du rapport de provenance ── */
        case "GET_PROVENANCE_REPORT": {
          try {
            const pack = await PackRegistry.getPack();
            const mountResult = pack?.state?.mountResult;
            sendResponse({ success: true, provenanceReport: mountResult?.provenanceReport || null, licenseAudit: mountResult?.licenseAuditMd || null, thirdPartyNotices: mountResult?.thirdPartyNotices || null });
          } catch (error) {
            sendResponse({ success: false, message: error.message });
          }
          break;
        }

        case "GET_PROJECT_SOURCES": {
          const projectId = await resolveProjectId(message.projectId);
          sendResponse({ success: true, projectId, sources: await ProjectSources.get(projectId), artifacts: await SourceManifest.build(projectId) });
          break;
        }
        case "CLEAR_PROJECT_SOURCES": {
          const projectId = await resolveProjectId(message.projectId);
          await ProjectSources.clear(projectId);
          sendResponse({ success: true, projectId });
          break;
        }

        /* ── Log fan-out from content ── */
        case "CONTENT_LOG": {
          broadcastLog(message.message, message.level);
          sendResponse({ success: true });
          break;
        }

        /* ── Proxy fetch (avoid mixed content from CS) ── */
        case "FETCH": {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);
            const opts = {
              method: message.options?.method || "GET",
              headers: message.options?.headers || {},
              signal: controller.signal,
            };
            if (message.options?.body) opts.body = message.options.body;
            const res = await fetch(message.url, opts);
            clearTimeout(timeoutId);
            const text = await res.text();
            let data = null;
            try {
              data = JSON.parse(text);
            } catch (_) {}
            sendResponse({
              success: true,
              result: { ok: res.ok, status: res.status, text, data },
            });
          } catch (e) {
            sendResponse({ success: false, error: e.message });
          }
          break;
        }

        /* ── Download single artifact ── */
        case "DOWNLOAD_ARTIFACT": {
          try {
            const blob = new Blob([message.content || ""], {
              type: "text/plain;charset=utf-8",
            });
            const reader = new FileReader();
            const dataUrl = await new Promise((resolve, reject) => {
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
            chrome.downloads.download(
              {
                url: dataUrl,
                filename: message.filename || "artifact.md",
                saveAs: !!message.saveAs,
              },
              (id) => {
                sendResponse({
                  success: !chrome.runtime.lastError,
                  downloadId: id,
                  error: chrome.runtime.lastError?.message,
                });
              }
            );
          } catch (e) {
            sendResponse({ success: false, message: e.message });
          }
          break;
        }

        default:
          sendResponse({
            success: false,
            message: `Type de message inconnu: ${message.type}`,
          });
      }
    } catch (err) {
      console.error("[KIROV5] BG error:", err);
      sendResponse({ success: false, message: err.message || String(err) });
    }
  })();

  return true; // keep channel open for async
});

/* ── Helpers: inject / capture on AI tab ── */

async function resolveAiTab(webAi) {
  const target = WEB_AI_TARGETS[webAi] || WEB_AI_TARGETS.deepseek;
  
  // 1. Prioritize active tab if it matches target AI
  const activeTabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (activeTabs && activeTabs.length > 0) {
    const activeUrl = activeTabs[0].url || "";
    if (activeUrl.includes(webAi) || (target.url && activeUrl.startsWith(target.url))) {
      return activeTabs[0].id;
    }
  }

  let tabId = null;
  if (typeof Orchestrator !== "undefined" && Orchestrator.ensureWebAiTab) {
    tabId = await Orchestrator.ensureWebAiTab(target);
  }
  if (!tabId && activeTabs && activeTabs.length > 0) {
    // fallback active tab
    tabId = activeTabs[0].id;
  }
  return tabId;
}

async function injectToWebAi(prompt, webAi, andCapture, captureOpts = {}) {
  const tabId = await resolveAiTab(webAi);
  if (!tabId) return { success: false, message: "Aucun onglet IA disponible" };
  try {
    const type = andCapture ? "KIROV_INJECT_AND_CAPTURE" : "KIROV_INJECT_ONLY";
    const resp = await chrome.tabs.sendMessage(tabId, {
      type,
      prompt,
      stepId: "manual",
      ...captureOpts,
    });
    if (resp?.success && andCapture && resp.content) {
      // Parse & store files
      const files = ArtifactWriter.parseCodeFiles(resp.content);
      if (files.length) {
        await chrome.storage.local.set({ [STORAGE_KEYS.CAPTURED_FILES]: files });
        resp.files = files;
        resp.fileCount = files.length;
      }
    }
    return resp || { success: false, message: "Pas de réponse content script" };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

async function captureFromWebAi(webAi, captureOpts = {}) {
  const tabId = await resolveAiTab(webAi);
  if (!tabId) return { success: false, message: "Aucun onglet IA disponible" };
  try {
    const resp = await chrome.tabs.sendMessage(tabId, {
      type: "KIROV_CAPTURE_ONLY",
      ...captureOpts,
    });
    if (resp?.success && resp.content) {
      const files = ArtifactWriter.parseCodeFiles(resp.content);
      if (files.length) {
        await chrome.storage.local.set({ [STORAGE_KEYS.CAPTURED_FILES]: files });
        resp.files = files;
        resp.fileCount = files.length;
      }
    }
    return resp || { success: false, message: "Pas de réponse content script" };
  } catch (e) {
    return { success: false, message: e.message };
  }
}
