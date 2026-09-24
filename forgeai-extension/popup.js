/* KIROV5 Orchestrator — Popup UI (v16 + KIROV4 fusion) */

const PIPELINE_STEPS_UI = [
  { id: 0, label: "Métadonnées projet", doc: "00_PROJECT_META.md", phase: "intake" },
  { id: 1, label: "Exigences produit (PRD)", doc: "01_PRD.md", phase: "spec" },
  { id: 2, label: "Architecture technique", doc: "02_ARCHITECTURE.md", phase: "spec" },
  { id: 3, label: "Définition des skills", doc: "03_SKILLS.yaml", phase: "spec" },
  { id: 4, label: "Découpage des tâches", doc: "04_TASKS.md", phase: "plan" },
  { id: 5, label: "Arborescence fichiers", doc: "05_FILE_TREE.md", phase: "plan" },
  { id: 6, label: "Workflow des prompts", doc: "06_PROMPT_WORKFLOW.md", phase: "plan" },
  { id: 7, label: "Règles de validation", doc: "07_VALIDATION_RULES.md", phase: "gate" },
  { id: 8, label: "Ordres d'exécution", doc: "08_ORDERS.md", phase: "gate" },
  { id: 9, label: "Génération du code", doc: null, phase: "code" },
  { id: 10, label: "Écriture disque", doc: null, phase: "write" },
];

const PROVIDERS_UI = {
  deepseek: { label: "DeepSeek", apiKeyLabel: "Clé API DeepSeek", placeholder: "sk-...", needsKey: true, hint: "Clé stockée localement dans le navigateur." },
  openai: { label: "OpenAI (GPT)", apiKeyLabel: "Clé API OpenAI", placeholder: "sk-...", needsKey: true, hint: "Clé stockée localement dans le navigateur." },
  claude: { label: "Claude (Anthropic)", apiKeyLabel: "Clé API Anthropic", placeholder: "sk-ant-...", needsKey: true, hint: "Clé stockée localement dans le navigateur." },
  gemini: { label: "Gemini (Google)", apiKeyLabel: "Clé API Google AI", placeholder: "AIza...", needsKey: true, hint: "Clé stockée localement. Auto-détecte gemini-2.5-flash, etc." },
  mistral: { label: "Mistral AI", apiKeyLabel: "Clé API Mistral", placeholder: "...", needsKey: true, hint: "Clé stockée localement dans le navigateur." },
  gemma: { label: "Gemma 2 (Local)", apiKeyLabel: "Clé locale (optionnel)", placeholder: "ollama (laisser vide)", needsKey: false, hint: "Ollama local (ollama serve + ollama pull gemma2). Aucune clé requise." },
};

const $ = (id) => {
  const el = document.getElementById(id);
  if (el) return el;
  // Fallback sûr pour éviter les crashs si l'élément HTML a été supprimé
  const dummy = document.createElement('div');
  dummy.value = '';
  dummy.disabled = false;
  return dummy;
};

const els = {
  settingsToggle: $("settingsToggle"),
  settingsPanel: $("settingsPanel"),
  statusDot: $("statusDot"),
  statusText: $("statusText"),
  modeBadge: $("modeBadge"),
  tigerBanner: $("tigerBanner"),

  execModeGrid: $("execModeGrid"),
  webAiGroup: $("webAiGroup"),
  webAiSelect: $("webAiSelect"),
  openWebAiBtn: $("openWebAiBtn"),
  uiAiSelect: $("uiAiSelect"),
  openUiAiBtn: $("openUiAiBtn"),
  apiProviderGroup: $("apiProviderGroup"),
  providerSelect: $("providerSelect"),
  apiKeyGroup: $("apiKeyGroup"),
  apiKeyLabel: $("apiKeyLabel"),
  apiKeyInput: $("apiKeyInput"),
  apiKeyHint: $("apiKeyHint"),
  toggleKeyBtn: $("toggleKeyBtn"),
  saveApiKey: $("saveApiKey"),
  saveFeedback: $("saveFeedback"),
  modelGroup: $("modelGroup"),
  modelSelect: $("modelSelect"),
  refreshModels: $("refreshModels"),
  modelHint: $("modelHint"),

  noProjectView: $("noProjectView"),
  projectView: $("projectView"),
  projectName: $("projectName"),
  projectDescription: $("projectDescription"),
  folderName: $("folderName"),
  pickFolderBtn: $("pickFolderBtn"),
  createProjectBtn: $("createProjectBtn"),

  activeProjectName: $("activeProjectName"),
  activeProjectDesc: $("activeProjectDesc"),
  activeFolderName: $("activeFolderName"),
  stepCounter: $("stepCounter"),
  progressFill: $("progressFill"),
  stepList: $("stepList"),
  currentStepPanel: $("currentStepPanel"),
  currentStepLabel: $("currentStepLabel"),
  currentStepDoc: $("currentStepDoc"),
  stepStatus: $("stepStatus"),
  artifactPreview: $("artifactPreview"),
  artifactContent: $("artifactContent"),
  currentStepBanner: $("currentStepBanner"),

  runStepBtn: $("runStepBtn"),
  advanceBtn: $("advanceBtn"),
  runAllBtn: $("runAllBtn"),
  writeArtifactsBtn: $("writeArtifactsBtn"),
  openAiTabBtn: $("openAiTabBtn"),
  logContainer: $("logContainer"),
  clearLog: $("clearLog"),
  resetBtn: $("resetBtn"),

  folderModal: $("folderModal"),
  folderModalBackdrop: $("folderModalBackdrop"),
  modalFolderName: $("modalFolderName"),
  modalPathPreview: $("modalPathPreview"),
  modalCancelBtn: $("modalCancelBtn"),
  modalConfirmBtn: $("modalConfirmBtn"),

  // KIROV5 tabs & extras
  navTabs: $("navTabs"),
  bridgeBadge: $("bridgeBadge"),
  bridgeEnabled: $("bridgeEnabled"),
  bridgeUrl: $("bridgeUrl"),
  bridgeVercel: $("bridgeVercel"),
  testBridgeBtn: $("testBridgeBtn"),
  saveBridgeBtn: $("saveBridgeBtn"),
  bridgeTestResult: $("bridgeTestResult"),

  injectPrompt: $("injectPrompt"),
  injectSilence: $("injectSilence"),
  btnInject: $("btnInject"),
  btnInjectCapture: $("btnInjectCapture"),
  injectLog: $("injectLog"),
  clearInjectLog: $("clearInjectLog"),

  captureDot: $("captureDot"),
  captureStatus: $("captureStatus"),
  capturedCountBadge: $("capturedCountBadge"),
  btnCapture: $("btnCapture"),
  btnCaptureQuick: $("btnCaptureQuick"),
  btnWriteCaptured: $("btnWriteCaptured"),
  btnPushCaptured: $("btnPushCaptured"),
  captureLog: $("captureLog"),
  clearCaptureLog: $("clearCaptureLog"),

  githubToken: $("githubToken"),
  githubRepo: $("githubRepo"),
  githubBranch: $("githubBranch"),
  saveGithubBtn: $("saveGithubBtn"),
  pushGithubBtn: $("pushGithubBtn"),
  githubLog: $("githubLog"),
  githubProjectIdea: $("githubProjectIdea"),
  githubSearchQuery: $("githubSearchQuery"),
  githubLanguage: $("githubLanguage"),
  githubMinStars: $("githubMinStars"),
  githubFreshness: $("githubFreshness"),
  githubPolicy: $("githubPolicy"),
  githubSort: $("githubSort"),
  githubSearchStatus: $("githubSearchStatus"),
  githubSummary: $("githubSummary"),
  githubResults: $("githubResults"),
  githubAutomationMode: $("githubAutomationMode"),
  githubSelectedCount: $("githubSelectedCount"),
  searchGithubSourcesBtn: $("searchGithubSourcesBtn"),
  clearGithubSourcesBtn: $("clearGithubSourcesBtn"),
  selectAllGithubBtn: $("selectAllGithubBtn"),
  downloadGithubSourcesBtn: $("downloadGithubSourcesBtn"),
  useGithubSourcesBtn: $("useGithubSourcesBtn"),
  githubApprovalPanel: $("githubApprovalPanel"),
  githubApprovalText: $("githubApprovalText"),
  approveSourceCodegenBtn: $("approveSourceCodegenBtn"),
  syncBridgeIntentBtn: $("syncBridgeIntentBtn"),
};

let currentExecMode = "web";
let pendingCreate = null; // { name, desc } waiting for folder confirm
let githubCandidates = [];
let githubSelected = new Set();
let githubSearchSummary = null;
const GITHUB_SEARCH_STATE_KEY = "forgeai_github_search_state_v1";
let githubStateHydrating = false;
let lastSyncedIntentTimestamp = null;
let lastSyncedPackSlug = null;

/* ── Helpers ── */

function sendMessage(message) {
  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          resolve({ success: false, message: chrome.runtime.lastError.message });
        } else {
          resolve(response || { success: false, message: "No response" });
        }
      });
    } catch (e) {
      resolve({ success: false, message: e.message });
    }
  });
}

function addLog(message, type = "info") {
  if (!els.logContainer) return;
  const entry = document.createElement("div");
  entry.className = `log-entry ${type}`;
  const time = new Date().toLocaleTimeString();
  entry.textContent = `[${time}] ${message}`;
  els.logContainer.appendChild(entry);
  els.logContainer.scrollTop = els.logContainer.scrollHeight;
}

function addToLog(container, message, type = "info") {
  if (!container) return;
  const entry = document.createElement("div");
  entry.className = `log-entry ${type}`;
  const time = new Date().toLocaleTimeString();
  entry.textContent = `[${time}] ${message}`;
  container.appendChild(entry);
  container.scrollTop = container.scrollHeight;
}

const SILENCE_PROMPT = `SILENCE ABSOLU — RÈGLE S1:
- UNIQUEMENT du JSON valide {"files":[{"path":"...","content":"...","language":"..."}]}
- Aucun texte conversationnel, aucune explication
`;

function switchTab(tabId) {
  document.querySelectorAll(".nav-tab").forEach((t) => {
    t.classList.toggle("active", t.dataset.tab === tabId);
  });
  document.querySelectorAll(".tab-panel").forEach((p) => {
    p.classList.toggle("hidden", p.id !== `tab-${tabId}`);
    p.classList.toggle("active", p.id === `tab-${tabId}`);
  });
}

function setBridgeBadge(ok, text) {
  if (els.bridgeBadge) {
    els.bridgeBadge.textContent = text || (ok ? "🔗 ON" : "🔗 OFF");
    els.bridgeBadge.className = "bridge-badge " + (ok ? "on" : "off");
  }
  
  const ledElectron = document.getElementById("led-electron");
  if (ledElectron) {
    if (ok) {
      ledElectron.classList.add("led-green");
    } else {
      ledElectron.classList.remove("led-green");
    }
  }
}

function setStatus(text, state = "online") {
  els.statusText.textContent = text;
  els.statusDot.className = `dot ${state}`;
}

function setButtonLoading(btn, loading, originalText) {
  if (!btn) return;
  if (loading) {
    btn.dataset.originalText = btn.textContent;
    btn.innerHTML = '<span class="loading"></span> ...';
    btn.disabled = true;
  } else {
    btn.textContent = originalText || btn.dataset.originalText || btn.textContent;
    btn.disabled = false;
  }
}

function showStepStatus(message, type) {
  els.stepStatus.className = `step-status ${type}`;
  els.stepStatus.textContent = message;
  els.stepStatus.classList.remove("hidden");
}

function hideStepStatus() {
  els.stepStatus.classList.add("hidden");
}

function showArtifact(content) {
  const preview = String(content || "").slice(0, 2000);
  els.artifactContent.textContent = preview + (content && content.length > 2000 ? "\n…" : "");
  els.artifactPreview.classList.remove("hidden");
}

function hideArtifact() {
  els.artifactPreview.classList.add("hidden");
}

function slugify(name) {
  return String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60) || "kirov_project";
}

/* ── Exec mode UI ── */

function setExecModeUI(mode) {
  currentExecMode = mode || "web";
  els.modeBadge.textContent = currentExecMode.toUpperCase();
  els.execModeGrid.querySelectorAll(".mode-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.mode === currentExecMode);
  });
  // Web targets visible for web/hybrid
  const showWeb = currentExecMode === "web" || currentExecMode === "hybrid";
  const showApi = currentExecMode === "api" || currentExecMode === "hybrid";
  els.webAiGroup.classList.toggle("hidden", !showWeb);
  els.apiProviderGroup.classList.toggle("hidden", !showApi);
  els.apiKeyGroup.classList.toggle("hidden", !showApi);
  els.modelGroup.classList.toggle("hidden", !showApi);
}

/* ── Provider / models ── */

function updateProviderUI(providerId) {
  const p = PROVIDERS_UI[providerId];
  if (!p) return;
  els.apiKeyLabel.textContent = p.apiKeyLabel;
  els.apiKeyInput.placeholder = p.placeholder;
  els.apiKeyHint.textContent = p.hint;
  els.apiKeyInput.parentElement.style.opacity = p.needsKey ? "1" : "0.65";
}

function populateModelSelect(models, selectedModel) {
  els.modelSelect.innerHTML = "";
  if (!models || !models.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Aucun modèle trouvé";
    els.modelSelect.appendChild(opt);
    els.modelSelect.disabled = true;
    return;
  }
  for (const m of models) {
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.textContent = m.label || m.id;
    if (m.id === selectedModel) opt.selected = true;
    els.modelSelect.appendChild(opt);
  }
  els.modelSelect.disabled = false;
  els.refreshModels.disabled = false;
}

async function loadAndDetectModels(providerId) {
  const modelResp = await sendMessage({ type: "GET_MODEL", providerId });
  const savedModel = modelResp.success ? modelResp.model : null;
  const detectResp = await sendMessage({ type: "DETECT_MODELS" });
  if (detectResp.success && detectResp.models?.length) {
    populateModelSelect(detectResp.models, detectResp.selectedModel || savedModel);
    if (detectResp.warning) addLog(detectResp.warning, "warning");
  } else if (savedModel) {
    populateModelSelect([{ id: savedModel, label: savedModel }], savedModel);
  } else {
    const defaults = {
      gemini: [
        { id: "gemini-3.6-flash", label: "Gemini 3.6 Flash" },
        { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
        { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
        { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
        { id: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
      ],
      deepseek: [
        { id: "deepseek-chat", label: "DeepSeek Chat" },
        { id: "deepseek-coder", label: "DeepSeek Coder" },
      ],
      openai: [
        { id: "gpt-4o", label: "GPT-4o" },
        { id: "gpt-4o-mini", label: "GPT-4o Mini" },
      ],
      claude: [
        { id: "claude-sonnet-4-20250514", label: "Claude Sonnet 4" },
        { id: "claude-3-5-sonnet-latest", label: "Claude 3.5 Sonnet" },
      ],
      mistral: [{ id: "mistral-large-latest", label: "Mistral Large" }],
      gemma: [
        { id: "gemma2", label: "Gemma 2" },
        { id: "gemma2:9b", label: "Gemma 2 9B" },
      ],
    };
    const list = defaults[providerId] || [];
    populateModelSelect(list, list[0]?.id || "");
  }
}

/* ── Pipeline render ── */

function renderPipeline(stepInfo) {
  if (!stepInfo) {
    els.stepCounter.textContent = "Étape 0/0";
    els.stepList.innerHTML = "";
    els.progressFill.style.width = "0%";
    return;
  }

  const currentId = stepInfo.step ? stepInfo.step.id : 0;
  const total = stepInfo.totalSteps || PIPELINE_STEPS_UI.length;
  const done = (stepInfo.completedSteps || []).length;
  els.stepCounter.textContent = `Étape ${currentId + 1}/${total}`;
  els.progressFill.style.width = `${Math.round((done / total) * 100)}%`;

  els.stepList.innerHTML = "";
  for (const step of PIPELINE_STEPS_UI) {
    const item = document.createElement("div");
    let cls = "step-item";
    let icon = "○";
    if ((stepInfo.completedSteps || []).includes(step.id)) {
      cls += " completed";
      icon = "✓";
    } else if (step.id === currentId) {
      cls += " current";
      icon = "▶";
    } else {
      cls += " pending";
    }
    item.className = cls;
    item.innerHTML = `<span class="step-icon">${icon}</span><span>${step.label}</span><span class="step-phase">${step.phase}</span>`;
    els.stepList.appendChild(item);
  }

  if (stepInfo.step) {
    els.currentStepLabel.textContent = stepInfo.step.label;
    els.currentStepDoc.textContent = stepInfo.step.document || `(${stepInfo.step.order})`;
    els.currentStepPanel.classList.remove("hidden");
  }

  const currentCompleted = (stepInfo.completedSteps || []).includes(currentId);
  els.runStepBtn.disabled = currentCompleted && stepInfo.step?.order !== "finalize";
  els.advanceBtn.disabled = !currentCompleted || currentId >= total - 1;

  if (stepInfo.status === "complete" || done >= total - 1) {
    els.writeArtifactsBtn.classList.remove("hidden");
  }
}

async function refreshProjectView() {
  const response = await sendMessage({ type: "GET_PACK" });
  if (!response.success || !response.pack) {
    els.noProjectView.classList.remove("hidden");
    els.projectView.classList.add("hidden");
    setStatus("Prêt — créez un projet", "online");
    return;
  }

  els.noProjectView.classList.add("hidden");
  els.projectView.classList.remove("hidden");

  const pack = response.pack;
  els.activeProjectName.textContent = pack.projectName;
  els.activeProjectDesc.textContent = pack.projectDescription;
  els.activeFolderName.textContent = pack.state?.folderName || "—";

  if (pack.state?.execMode) setExecModeUI(pack.state.execMode);
  if (pack.state?.webAi) els.webAiSelect.value = pack.state.webAi;

  const stepResponse = await sendMessage({ type: "GET_STEP_INFO" });
  if (stepResponse.success) renderPipeline(stepResponse.stepInfo);

  const currentStep = stepResponse.stepInfo?.step;
  if (currentStep?.document && pack.state.artifacts?.[currentStep.document]) {
    showArtifact(pack.state.artifacts[currentStep.document]);
  } else if (pack.state.codeFiles?.length) {
    showArtifact(JSON.stringify({ files: pack.state.codeFiles.slice(0, 3).map((f) => f.path) }, null, 2));
  } else {
    hideArtifact();
  }

  if (pack.state.status === "complete") {
    showStepStatus("Pipeline terminé. Fichiers prêts sur le disque.", "success");
    setStatus("Terminé ✅", "online");
  } else {
    setStatus(`Projet actif — étape ${(pack.state.currentStep || 0) + 1}`, "online");
  }
}

/* ── Folder modal ── */

function openFolderModal(defaultName) {
  els.modalFolderName.value = defaultName || slugify(els.projectName.value);
  els.modalPathPreview.textContent = els.modalFolderName.value || "mon_projet";
  els.folderModal.classList.remove("hidden");
  els.modalFolderName.focus();
  els.modalFolderName.select();
}

function closeFolderModal() {
  els.folderModal.classList.add("hidden");
  pendingCreate = null;
}

async function confirmCreateWithFolder() {
  const folder = slugify(els.modalFolderName.value || els.projectName.value);
  if (!folder) {
    addLog("Nom de dossier invalide.", "error");
    return;
  }
  const name = pendingCreate?.name || els.projectName.value.trim();
  const desc = pendingCreate?.desc || els.projectDescription.value.trim();
  if (!name || !desc) {
    closeFolderModal();
    return;
  }

  // For web mode, ensure AI tab exists
  if (currentExecMode === "web" || currentExecMode === "hybrid") {
    // ok — orchestrator opens tab when needed
  } else {
    const hasKey = await sendMessage({ type: "HAS_API_KEY", providerId: els.providerSelect.value });
    if (!hasKey.hasApiKey) {
      addLog("Configurez votre clé API d'abord (mode API).", "warning");
      els.settingsPanel.classList.remove("hidden");
      closeFolderModal();
      return;
    }
  }

  setButtonLoading(els.modalConfirmBtn, true);
  setStatus("Création du pack…", "busy");

  const response = await sendMessage({
    type: "CREATE_PROJECT",
    projectName: name,
    projectDescription: desc,
    folderName: folder,
    execMode: currentExecMode,
    webAi: els.webAiSelect.value,
  });

  setButtonLoading(els.modalConfirmBtn, false, "Confirmer & Créer");
  closeFolderModal();

  if (response.success) {
    addLog(`Projet « ${name} » créé. Dossier: Downloads/${folder}/`, "success");
    addLog("Pack d'instructions généré (pochette surprise). DeepSeek ne le voit pas en entier.", "info");
    els.folderName.value = folder;
    await refreshProjectView();

    // Auto-open AI tab in web mode
    if (currentExecMode === "web" || currentExecMode === "hybrid") {
      await sendMessage({ type: "OPEN_WEB_AI", webAi: els.webAiSelect.value });
      addLog(`Onglet ${els.webAiSelect.selectedOptions[0]?.text || "IA"} ouvert pour injection.`, "info");
    }
  } else {
    addLog("Erreur: " + (response.message || "échec"), "error");
    setStatus("Erreur création", "offline");
  }
}

/* ── Events ── */

els.settingsToggle.addEventListener("click", () => {
  els.settingsPanel.classList.toggle("hidden");
});

els.execModeGrid.addEventListener("click", async (e) => {
  const card = e.target.closest(".mode-card");
  if (!card) return;
  setExecModeUI(card.dataset.mode);
  await sendMessage({ type: "SET_EXEC_MODE", mode: currentExecMode });
  addLog(`Mode d'exécution: ${currentExecMode}`, "info");
});

els.webAiSelect.addEventListener("change", async () => {
  await sendMessage({ type: "SET_WEB_AI", webAi: els.webAiSelect.value });
  addLog(`Assistant web: ${els.webAiSelect.selectedOptions[0].text}`, "info");
});

els.uiAiSelect.addEventListener("change", async () => {
  await sendMessage({ type: "SET_UI_AI", uiAi: els.uiAiSelect.value });
  addLog(`Assistant UI: ${els.uiAiSelect.selectedOptions[0].text}`, "info");
});

els.openWebAiBtn.addEventListener("click", async () => {
  const r = await sendMessage({ type: "OPEN_WEB_AI", webAi: els.webAiSelect.value });
  if (r.success) addLog("Onglet IA ouvert.", "success");
  else addLog("Impossible d'ouvrir l'onglet: " + (r.message || ""), "error");
});

els.openAiTabBtn?.addEventListener("click", async () => {
  const r = await sendMessage({ type: "OPEN_WEB_AI", webAi: els.webAiSelect.value });
  addLog(r.success ? "Onglet IA ouvert." : "Échec ouverture onglet", r.success ? "success" : "error");
});

if (els.toggleKeyBtn) {
  els.toggleKeyBtn.addEventListener("click", () => {
    if (els.apiKeyInput.type === "password") {
      els.apiKeyInput.type = "text";
      els.toggleKeyBtn.textContent = "🙈";
    } else {
      els.apiKeyInput.type = "password";
      els.toggleKeyBtn.textContent = "👁";
    }
  });
}

els.saveApiKey.addEventListener("click", async () => {
  const key = els.apiKeyInput.value.trim();
  const providerId = els.providerSelect.value;
  const provider = PROVIDERS_UI[providerId];
  if (provider.needsKey && !key) {
    addLog("Veuillez entrer une clé API.", "error");
    return;
  }
  setButtonLoading(els.saveApiKey, true);
  await sendMessage({ type: "SET_PROVIDER", providerId });
  const response = await sendMessage({ type: "SET_API_KEY", apiKey: key, providerId });
  if (response.success) {
    addLog(`${provider.label} — clé enregistrée.`, "success");
    els.saveFeedback.classList.remove("hidden");
    addLog("Détection automatique des modèles…", "info");
    const detectResp = await sendMessage({ type: "DETECT_MODELS", providerId, apiKey: key });
    if (detectResp.success && detectResp.models) {
      populateModelSelect(detectResp.models, detectResp.selectedModel);
      addLog(`${detectResp.models.length} modèles. Sélectionné: ${detectResp.selectedModel}`, "success");
      if (detectResp.warning) addLog(detectResp.warning, "warning");
    } else {
      addLog("Détection échouée: " + (detectResp.message || "erreur"), "warning");
      await loadAndDetectModels(providerId);
    }
  } else {
    addLog("Erreur: " + (response.message || "échec"), "error");
  }
  setButtonLoading(els.saveApiKey, false, "💾 Enregistrer + Détecter");
});

els.providerSelect.addEventListener("change", async () => {
  const providerId = els.providerSelect.value;
  updateProviderUI(providerId);
  await sendMessage({ type: "SET_PROVIDER", providerId });
  const keyResp = await sendMessage({ type: "GET_API_KEY", providerId });
  if (keyResp.success && keyResp.apiKey) {
    els.apiKeyInput.value = keyResp.apiKey;
    els.saveFeedback.classList.remove("hidden");
  } else {
    els.apiKeyInput.value = "";
    els.saveFeedback.classList.add("hidden");
  }
  await loadAndDetectModels(providerId);
});

els.refreshModels.addEventListener("click", async () => {
  els.refreshModels.disabled = true;
  els.refreshModels.textContent = "…";
  addLog("Rafraîchissement des modèles…", "info");
  const resp = await sendMessage({ type: "DETECT_MODELS" });
  els.refreshModels.disabled = false;
  els.refreshModels.textContent = "🔄";
  if (resp.success && resp.models) {
    populateModelSelect(resp.models, resp.selectedModel);
    addLog(`${resp.models.length} modèles. Sélectionné: ${resp.selectedModel}`, "success");
  } else {
    addLog("Détection échouée: " + (resp.message || "erreur"), "error");
  }
});

els.modelSelect.addEventListener("change", async () => {
  const model = els.modelSelect.value;
  if (!model) return;
  const resp = await sendMessage({
    type: "SET_MODEL",
    model,
    providerId: els.providerSelect.value,
  });
  addLog(resp.success ? `Modèle: ${model}` : "Erreur modèle", resp.success ? "success" : "error");
});

function validateCreateForm() {
  const name = els.projectName.value.trim();
  const desc = els.projectDescription.value.trim();
  els.createProjectBtn.disabled = !(name && desc);
  if (name && !els.folderName.value) {
    els.folderName.placeholder = slugify(name);
  }
}

els.projectName.addEventListener("input", validateCreateForm);
els.projectDescription.addEventListener("input", validateCreateForm);

let folderModalMode = "create"; // "create" | "pick"

els.pickFolderBtn.addEventListener("click", () => {
  folderModalMode = "pick";
  pendingCreate = null;
  const suggested = els.folderName.value || slugify(els.projectName.value) || "mon_projet";
  els.modalConfirmBtn.textContent = "Utiliser ce dossier";
  openFolderModal(suggested);
});

els.createProjectBtn.addEventListener("click", () => {
  const name = els.projectName.value.trim();
  const desc = els.projectDescription.value.trim();
  if (!name || !desc) return;

  folderModalMode = "create";
  pendingCreate = { name, desc };
  const suggested = els.folderName.value || slugify(name);
  els.modalConfirmBtn.textContent = "Confirmer & Créer";
  openFolderModal(suggested);
});

els.modalFolderName.addEventListener("input", () => {
  els.modalPathPreview.textContent = slugify(els.modalFolderName.value) || "mon_projet";
});

els.modalCancelBtn.addEventListener("click", closeFolderModal);
els.folderModalBackdrop.addEventListener("click", closeFolderModal);

els.modalConfirmBtn.addEventListener("click", async () => {
  if (folderModalMode === "pick") {
    els.folderName.value = slugify(els.modalFolderName.value);
    closeFolderModal();
    addLog(`Dossier cible: Downloads/${els.folderName.value}/`, "info");
    return;
  }
  await confirmCreateWithFolder();
});

els.modalFolderName.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    els.modalConfirmBtn.click();
  }
});

/* ── Pipeline actions ── */

els.runStepBtn.addEventListener("click", async () => {
  hideStepStatus();
  hideArtifact();
  setButtonLoading(els.runStepBtn, true);
  els.advanceBtn.disabled = true;
  els.runAllBtn.disabled = true;
  setStatus("Exécution étape…", "busy");
  addLog("Exécution de l'étape courante…", "info");

  const response = await sendMessage({
    type: "RUN_STEP",
    execMode: currentExecMode,
    webAi: els.webAiSelect.value,
  });

  setButtonLoading(els.runStepBtn, false, "▶ Exécuter l'étape");
  els.runAllBtn.disabled = false;

  if (response.success) {
    showStepStatus("Étape complétée ✅", "success");
    if (response.artifact) {
      showArtifact(response.artifact);
      addLog(`Artefact: ${response.step?.document || response.step?.label}`, "success");
    }
    if (response.codeFileCount) {
      addLog(`${response.codeFileCount} fichiers code capturés.`, "success");
    }
    if (response.autoWrite) {
      const msg = `💾 Auto-write: ${response.autoWrite.filesWritten} fichiers dans ${response.autoWrite.folderName}`;
      addLog(msg, "success");
      if (els.currentStepBanner) {
        els.currentStepBanner.textContent = `✅ ${msg}`;
        els.currentStepBanner.style.background = "rgba(16, 163, 127, 0.1)";
        els.currentStepBanner.style.color = "#10a37f";
        els.currentStepBanner.style.borderColor = "rgba(16, 163, 127, 0.2)";
      }
    }
    if (response.finalized) {
      addLog(`Pipeline terminé. Dossier: Downloads/${response.folderName}/`, "success");
      showStepStatus(`Fichiers écrits → Downloads/${response.folderName}/`, "success");
    }
    setStatus("Étape OK", "online");
    await refreshProjectView();
  } else {
    showStepStatus(response.message || "Échec", "error");
    addLog("Échec: " + (response.message || "erreur"), "error");
    if (response.raw) addLog("Brut: " + String(response.raw).slice(0, 150), "warning");
    setStatus("Erreur étape", "offline");
    await refreshProjectView();
  }
});

els.advanceBtn.addEventListener("click", async () => {
  const response = await sendMessage({ type: "ADVANCE_STEP" });
  if (response.success) {
    addLog(`→ ${response.nextStep.label}`, "info");
    hideStepStatus();
    hideArtifact();
    await refreshProjectView();
  } else {
    addLog("Erreur: " + (response.message || "échec"), "error");
  }
});

els.runAllBtn.addEventListener("click", async () => {
  hideStepStatus();
  hideArtifact();
  setButtonLoading(els.runAllBtn, true);
  els.runStepBtn.disabled = true;
  els.advanceBtn.disabled = true;
  setStatus("Pipeline en cours…", "busy");
  addLog("⚡ Démarrage pipeline complet (injection + capture auto)…", "info");

  const response = await sendMessage({
    type: "RUN_FULL_PIPELINE",
    execMode: currentExecMode,
    webAi: els.webAiSelect.value,
  });

  setButtonLoading(els.runAllBtn, false, "⚡ Tout exécuter");
  els.runStepBtn.disabled = false;

  if (response.success) {
    if (response.finalized) {
      addLog(`Pipeline COMPLET. Fichiers → Downloads/${response.folderName}/`, "success");
      showStepStatus(`Terminé → Downloads/${response.folderName}/`, "success");
    } else {
      addLog("Pipeline terminé.", "success");
    }
    setStatus("Pipeline terminé ✅", "online");
  } else {
    showStepStatus(response.message || "Pipeline arrêté", "error");
    addLog("Pipeline arrêté: " + (response.message || "erreur"), "error");
    setStatus("Pipeline stoppé", "offline");
  }
  await refreshProjectView();
});

els.writeArtifactsBtn.addEventListener("click", async () => {
  setButtonLoading(els.writeArtifactsBtn, true);
  addLog("Écriture des fichiers sur disque…", "info");
  const folder = els.activeFolderName.textContent || els.folderName.value || undefined;
  const response = await sendMessage({
    type: "WRITE_ARTIFACTS",
    folderName: folder,
    saveAs: false,
  });
  setButtonLoading(els.writeArtifactsBtn, false, "💾 Écrire sur disque");
  if (response.success) {
    addLog(response.message || "Fichiers écrits.", "success");
    showStepStatus(response.message || "OK", "success");
  } else {
    addLog("Erreur: " + (response.message || "échec"), "error");
  }
});

els.resetBtn.addEventListener("click", async () => {
  if (!confirm("Supprimer le projet actuel ? Les fichiers déjà téléchargés restent sur le disque.")) return;
  const response = await sendMessage({ type: "RESET_PROJECT" });
  if (response.success) {
    addLog("Projet supprimé.", "info");
    hideStepStatus();
    hideArtifact();
    els.projectName.value = "";
    els.projectDescription.value = "";
    els.folderName.value = "";
    validateCreateForm();
    await refreshProjectView();
  }
});

els.clearLog.addEventListener("click", () => {
  els.logContainer.innerHTML = "";
});

/* ── Nav tabs ── */
if (els.navTabs) {
  els.navTabs.addEventListener("click", (e) => {
    const tab = e.target.closest(".nav-tab");
    if (!tab) return;
    switchTab(tab.dataset.tab);
  });
}

/* ── Bridge settings ── */
els.saveBridgeBtn?.addEventListener("click", async () => {
  const r = await sendMessage({
    type: "SET_BRIDGE",
    serverUrl: els.bridgeUrl?.value?.trim(),
    vercelUrl: els.bridgeVercel?.value?.trim(),
    enabled: !!els.bridgeEnabled?.checked,
  });
  if (r.success) {
    addLog("Config Bridge sauvegardée.", "success");
    setBridgeBadge(!!els.bridgeEnabled?.checked, els.bridgeEnabled?.checked ? "🔗 ON" : "🔗 OFF");
    if (els.bridgeTestResult) els.bridgeTestResult.textContent = "✅ Sauvegardé";
  }
});

els.testBridgeBtn?.addEventListener("click", async () => {
  if (els.bridgeTestResult) els.bridgeTestResult.textContent = "Test en cours…";
  const r = await sendMessage({ type: "TEST_BRIDGE", url: els.bridgeUrl?.value?.trim() });
  if (r.success) {
    setBridgeBadge(true, "🔗 OK");
    if (els.bridgeTestResult) els.bridgeTestResult.textContent = "✅ " + (r.message || "Bridge connecté");
    addLog("Bridge connecté.", "success");
  } else {
    setBridgeBadge(false, "🔗 KO");
    if (els.bridgeTestResult) els.bridgeTestResult.textContent = "❌ " + (r.message || "hors ligne");
    addLog("Bridge hors ligne: " + (r.message || ""), "error");
  }
});

/* ── Injection directe ── */
function buildInjectPrompt() {
  let prompt = (els.injectPrompt?.value || "").trim();
  if (!prompt) return "";
  if (els.injectSilence?.checked) prompt = SILENCE_PROMPT + "\n\n---\n\n" + prompt;
  return prompt;
}

els.btnInject?.addEventListener("click", async () => {
  const prompt = buildInjectPrompt();
  if (!prompt) {
    addToLog(els.injectLog, "⚠ Prompt vide", "warning");
    return;
  }
  addToLog(els.injectLog, `Injection: ${prompt.slice(0, 60)}…`, "info");
  setButtonLoading(els.btnInject, true);
  const r = await sendMessage({
    type: "INJECT_PROMPT",
    prompt,
    webAi: els.webAiSelect?.value,
  });
  setButtonLoading(els.btnInject, false, "💉 Injecter");
  if (r.success) {
    addToLog(els.injectLog, "✅ Prompt injecté !", "success");
    addLog("Injection manuelle OK", "success");
  } else {
    addToLog(els.injectLog, "❌ " + (r.message || "échec"), "error");
  }
});

els.btnInjectCapture?.addEventListener("click", async () => {
  const prompt = buildInjectPrompt();
  if (!prompt) {
    addToLog(els.injectLog, "⚠ Prompt vide", "warning");
    return;
  }
  addToLog(els.injectLog, "Injection + capture…", "info");
  setButtonLoading(els.btnInjectCapture, true);
  setStatus("Inject+Capture…", "busy");
  const r = await sendMessage({
    type: "INJECT_AND_CAPTURE",
    prompt,
    webAi: els.webAiSelect?.value,
  });
  setButtonLoading(els.btnInjectCapture, false, "💉 + Capturer");
  if (r.success) {
    addToLog(els.injectLog, `✅ Capturé ${r.length || r.content?.length || 0} chars`, "success");
    if (r.fileCount) {
      addToLog(els.injectLog, `📦 ${r.fileCount} fichiers`, "success");
      if (els.capturedCountBadge) els.capturedCountBadge.textContent = `${r.fileCount} fichiers`;
      (r.files || []).forEach((f) => addToLog(els.captureLog, `📄 ${f.path}`, "success"));
    }
    addLog("Inject+Capture OK", "success");
    setStatus("Capture OK", "online");
  } else {
    addToLog(els.injectLog, "❌ " + (r.message || "échec"), "error");
    setStatus("Capture échouée", "offline");
  }
});

els.clearInjectLog?.addEventListener("click", () => {
  if (els.injectLog) els.injectLog.innerHTML = "";
});

/* ── Capture tab ── */
els.btnCapture?.addEventListener("click", async () => {
  if (els.captureStatus) els.captureStatus.textContent = "Capture en cours…";
  if (els.captureDot) els.captureDot.className = "dot busy";
  setButtonLoading(els.btnCapture, true);
  const r = await sendMessage({ type: "CAPTURE_ONLY", webAi: els.webAiSelect?.value });
  setButtonLoading(els.btnCapture, false, "📸 Capturer");
  handleCaptureResponse(r);
});

els.btnCaptureQuick?.addEventListener("click", async () => {
  setButtonLoading(els.btnCaptureQuick, true);
  const r = await sendMessage({ type: "CAPTURE_ONLY", webAi: els.webAiSelect?.value });
  setButtonLoading(els.btnCaptureQuick, false, "📦 Forcer Capture (Secours Manuel)");
  handleCaptureResponse(r);
});

function handleCaptureResponse(r) {
  if (r.success) {
    const n = r.fileCount || r.files?.length || 0;
    if (els.captureDot) els.captureDot.className = "dot online";
    if (els.captureStatus) els.captureStatus.textContent = n ? `${n} fichiers capturés` : `Capturé ${r.content?.length || 0} chars`;
    if (els.capturedCountBadge) els.capturedCountBadge.textContent = `${n} fichiers`;
    (r.files || []).forEach((f) =>
      addToLog(els.captureLog, `📄 ${f.path} (${String(f.content || "").length} chars)`, "success")
    );
    if (!n) addToLog(els.captureLog, "Aucun fichier JSON détecté (texte brut capturé)", "warning");
    addLog(`Capture: ${n} fichiers`, "success");
  } else {
    if (els.captureDot) els.captureDot.className = "dot offline";
    if (els.captureStatus) els.captureStatus.textContent = "Échec capture";
    addToLog(els.captureLog, "❌ " + (r.message || "échec"), "error");
  }
}

els.btnWriteCaptured?.addEventListener("click", async () => {
  const got = await sendMessage({ type: "GET_CAPTURED" });
  const files = got.files || [];
  if (!files.length) {
    addToLog(els.captureLog, "⚠ Aucun fichier capturé", "warning");
    return;
  }
  const folder = els.folderName?.value || els.activeFolderName?.textContent || "kirov5_capture";
  const r = await sendMessage({ type: "WRITE_FILES", files, folderName: folder });
  if (r.success) {
    addToLog(els.captureLog, `💾 Écrit → Downloads/${r.folderName}/`, "success");
    addLog(`Écriture capture → Downloads/${r.folderName}/`, "success");
  } else {
    addToLog(els.captureLog, "❌ Écriture échouée", "error");
  }
});

els.btnPushCaptured?.addEventListener("click", async () => {
  addToLog(els.captureLog, "🐙 Push GitHub…", "info");
  const r = await sendMessage({ type: "PUSH_GITHUB" });
  if (r.success) {
    addToLog(els.captureLog, "✅ " + r.message, "success");
    addToLog(els.githubLog, "✅ " + r.message, "success");
    addLog(r.message, "success");
  } else {
    addToLog(els.captureLog, "❌ " + (r.message || "échec"), "error");
    addToLog(els.githubLog, "❌ " + (r.message || "échec"), "error");
  }
});

els.clearCaptureLog?.addEventListener("click", () => {
  if (els.captureLog) els.captureLog.innerHTML = "";
});

/* ── GitHub tab ── */
els.saveGithubBtn?.addEventListener("click", async () => {
  const r = await sendMessage({
    type: "SET_GITHUB",
    token: els.githubToken?.value?.trim(),
    repo: els.githubRepo?.value?.trim(),
    branch: els.githubBranch?.value?.trim() || "main",
  });
  if (r.success) {
    addToLog(els.githubLog, "✅ Config GitHub sauvegardée", "success");
    addLog("Config GitHub OK", "success");
  }
});

els.pushGithubBtn?.addEventListener("click", async () => {
  addToLog(els.githubLog, "🚀 Push en cours…", "info");
  setButtonLoading(els.pushGithubBtn, true);
  const r = await sendMessage({ type: "PUSH_GITHUB" });
  setButtonLoading(els.pushGithubBtn, false, "🚀 Push maintenant");
  if (r.success) {
    addToLog(els.githubLog, "✅ " + r.message, "success");
    addLog(r.message, "success");
  } else {
    addToLog(els.githubLog, "❌ " + (r.message || "échec"), "error");
  }
});

/* Progress + live logs from background / content */
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "PIPELINE_PROGRESS") {
    const p = message.progress;
    if (p.phase === "running") {
      const bannerText = `⏳ Exécution étape ${p.stepIndex + 1}/${p.totalSteps}: ${p.step?.label}…`;
      addLog(bannerText, "info");
      setStatus(`${p.step?.label || "…"}`, "busy");
      if (els.currentStepBanner) {
        els.currentStepBanner.textContent = bannerText;
        els.currentStepBanner.style.background = "rgba(77, 107, 254, 0.1)";
        els.currentStepBanner.style.color = "#4d6bfe";
        els.currentStepBanner.style.borderColor = "rgba(77, 107, 254, 0.2)";
      }
      sendMessage({ type: "GET_STEP_INFO" }).then((r) => {
        if (r.success) renderPipeline(r.stepInfo);
      });
    } else if (p.phase === "retry") {
      const bannerText = `⚠️ Réessai ${p.retryCount}: ${p.message}`;
      addLog(bannerText, "warning");
      if (els.currentStepBanner) {
        els.currentStepBanner.textContent = bannerText;
        els.currentStepBanner.style.background = "rgba(217, 119, 6, 0.1)";
        els.currentStepBanner.style.color = "#d97706";
        els.currentStepBanner.style.borderColor = "rgba(217, 119, 6, 0.2)";
      }
    } else if (p.phase === "failed") {
      const bannerText = `❌ Échec étape ${p.stepIndex + 1}: ${p.message}`;
      addLog(bannerText, "error");
      if (els.currentStepBanner) {
        els.currentStepBanner.textContent = bannerText;
        els.currentStepBanner.style.background = "rgba(239, 68, 68, 0.1)";
        els.currentStepBanner.style.color = "#ef4444";
        els.currentStepBanner.style.borderColor = "rgba(239, 68, 68, 0.2)";
      }
    } else if (p.phase === "complete") {
      const bannerText = "✅ Pipeline complété ! Fichiers sur le disque.";
      addLog(bannerText, "success");
      setStatus("Terminé ✅", "online");
      if (els.currentStepBanner) {
        els.currentStepBanner.textContent = bannerText;
        els.currentStepBanner.style.background = "rgba(16, 163, 127, 0.1)";
        els.currentStepBanner.style.color = "#10a37f";
        els.currentStepBanner.style.borderColor = "rgba(16, 163, 127, 0.2)";
      }
    }
  }
  if (message.type === "KIROV_LOG") {
    const t = message.level === "ok" ? "success" : message.level || "info";
    addLog(message.message, t);
    addToLog(els.injectLog, message.message, t);
  }
});

/* ── Projects Tab (Bridge sync — identical to web app KIROV3) ── */

const STACK_COLORS = {
  'nextjs':       { gradient: 'stack-nextjs',       label: 'Next.js',        iconClass: 'stack-nextjs' },
  'react-vite':   { gradient: 'stack-react-vite',   label: 'React + Vite',   iconClass: 'stack-react-vite' },
  'vue-vite':     { gradient: 'stack-vue-vite',     label: 'Vue + Vite',     iconClass: 'stack-vue-vite' },
  'react-native': { gradient: 'stack-react-native', label: 'React Native',   iconClass: 'stack-react-native' },
  'index-html':   { gradient: 'stack-index-html',   label: 'HTML Autonome',  iconClass: 'stack-index-html' },
};

/** Heuristic: detect stack from project name (same as web app) */
function detectStack(name) {
  const n = (name || "").toLowerCase();
  if (n.includes("next") || n.includes("vercel")) return "nextjs";
  if (n.includes("vue")) return "vue-vite";
  if (n.includes("react-native") || n.includes("rn-") || n.includes("mobile") || n.includes("expo")) return "react-native";
  if (n.includes("react") || n.includes("vite") || n.includes("spa")) return "react-vite";
  if (n.includes("html") || n.includes("landing") || n.includes("page")) return "index-html";
  return "nextjs"; // default
}

/** Count files recursively in a tree */
function countFiles(nodes) {
  let c = 0;
  for (const n of (nodes || [])) {
    if (n.type === "file") c++;
    else if (n.children) c += countFiles(n.children);
  }
  return c;
}

/** Check if any file named index.html exists in the tree */
function hasIndexHtml(nodes) {
  for (const n of (nodes || [])) {
    if (n.type === "file" && n.name === "index.html") return true;
    if (n.children && hasIndexHtml(n.children)) return true;
  }
  return false;
}

let projSelected = null;
let projProjects = [];
let projTreeCache = {}; // { projectName: treeNodes }

async function loadBridgeProjects() {
  const projLoading = $("projLoading");
  const projEmpty = $("projEmpty");
  const projGrid = $("projGrid");
  const projectsCount = $("projectsCount");

  projLoading.classList.remove("hidden");
  projEmpty.classList.add("hidden");
  projGrid.classList.add("hidden");

  const resp = await sendMessage({ type: "GET_BRIDGE_PROJECTS" });
  projLoading.classList.add("hidden");

  if (!resp.success || !resp.projects?.length) {
    projEmpty.classList.remove("hidden");
    if (projectsCount) projectsCount.textContent = "0 projet";
    projProjects = [];
    return;
  }

  // Enrich projects with stack detection + file count from cache
  projProjects = resp.projects.map((p) => {
    const stack = detectStack(p.name);
    const cached = projTreeCache[p.name];
    return {
      ...p,
      stack,
      fileCount: cached ? countFiles(cached) : 0,
      hasIndexHtml: cached ? hasIndexHtml(cached) : false,
    };
  });

  if (projectsCount) {
    projectsCount.textContent = `${projProjects.length} projet(s) — arborescence fichiers`;
  }

  projGrid.classList.remove("hidden");
  renderProjectsList();

  // If a project was selected, refresh its tree data
  if (projSelected) {
    const enriched = projProjects.find(p => p.name === projSelected);
    if (enriched) {
      loadProjectTree(projSelected);
    }
  }
}

function renderProjectsList() {
  const container = $("projListScroll");
  if (!container) return;
  container.innerHTML = "";

  for (const p of projProjects) {
    const sc = STACK_COLORS[p.stack] || STACK_COLORS['nextjs'];
    const item = document.createElement("button");
    item.className = `proj-item${projSelected === p.name ? ' selected' : ''}`;
    item.dataset.name = p.name;

    item.innerHTML = `
      <div class="proj-item-icon ${sc.iconClass}">${p.name.charAt(0).toUpperCase()}</div>
      <div class="proj-item-info">
        <div class="proj-item-name" title="${p.name}">${p.name}</div>
        <div class="proj-item-meta">
          <span class="proj-stack-badge ${sc.iconClass}">${sc.label}</span>
          <span class="proj-file-count">${p.fileCount} fichiers</span>
        </div>
      </div>
      <div class="proj-status-dot ${p.hasIndexHtml ? 'has-index' : 'no-index'}"></div>
    `;

    item.addEventListener("click", () => selectProject(p.name));
    container.appendChild(item);
  }
}

async function selectProject(name) {
  projSelected = name;

  // Update selection UI
  document.querySelectorAll(".proj-item").forEach(el => {
    el.classList.toggle("selected", el.dataset.name === name);
  });

  // Update tree header
  const projTreeTitle = $("projTreeTitle");
  if (projTreeTitle) projTreeTitle.textContent = `Arborescence: ${name}`;

  // Show actions
  const projTreeActions = $("projTreeActions");
  if (projTreeActions) projTreeActions.classList.remove("hidden");

  await loadProjectTree(name);
}

async function loadProjectTree(name) {
  const projTreeEmpty = $("projTreeEmpty");
  const projTreeContent = $("projTreeContent");

  projTreeContent.classList.add("hidden");
  projTreeEmpty.classList.remove("hidden");
  projTreeEmpty.innerHTML = '<div class="loading"></div>';

  const resp = await sendMessage({ type: "GET_BRIDGE_PROJECT_TREE", projectId: name });
  projTreeEmpty.classList.add("hidden");

  if (!resp.success || !resp.tree?.length) {
    projTreeEmpty.textContent = "Aucun fichier";
    return;
  }

  // Cache the tree and update file counts
  projTreeCache[name] = resp.tree;
  const p = projProjects.find(x => x.name === name);
  if (p) {
    p.fileCount = countFiles(resp.tree);
    p.hasIndexHtml = hasIndexHtml(resp.tree);
    renderProjectsList(); // re-render to update counts
  }

  projTreeContent.classList.remove("hidden");
  projTreeContent.innerHTML = "";
  renderFileTreeNodes(projTreeContent, resp.tree, 0);
}

function renderFileTreeNodes(container, nodes, depth) {
  for (const node of nodes) {
    const isDir = node.type === "directory";
    const row = document.createElement("div");
    row.className = "ft-node";
    row.style.paddingLeft = `${depth * 12 + 6}px`;

    if (isDir) {
      const arrow = document.createElement("span");
      arrow.className = "ft-arrow";
      arrow.textContent = "▼";
      row.appendChild(arrow);

      const icon = document.createElement("span");
      icon.className = "ft-icon";
      icon.textContent = "📁";
      row.appendChild(icon);

      const nameEl = document.createElement("span");
      nameEl.className = "ft-name dir";
      nameEl.textContent = node.name;
      row.appendChild(nameEl);

      container.appendChild(row);

      // Children container
      const childContainer = document.createElement("div");
      childContainer.className = "ft-children";
      if (node.children && node.children.length) {
        renderFileTreeNodes(childContainer, node.children, depth + 1);
      }
      container.appendChild(childContainer);

      // Toggle collapse on click
      let open = true;
      row.addEventListener("click", () => {
        open = !open;
        arrow.textContent = open ? "▼" : "▶";
        childContainer.classList.toggle("collapsed", !open);
      });
    } else {
      // File — spacer instead of arrow
      const spacer = document.createElement("span");
      spacer.className = "ft-arrow";
      spacer.textContent = "";
      row.appendChild(spacer);

      const icon = document.createElement("span");
      icon.className = "ft-icon";
      icon.textContent = "📄";
      row.appendChild(icon);

      const nameEl = document.createElement("span");
      nameEl.className = "ft-name file";
      nameEl.textContent = node.name;
      nameEl.title = node.path;
      row.appendChild(nameEl);

      container.appendChild(row);
    }
  }
}

function initProjects() {
  const refreshBtn = $("refreshProjectsBtn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => loadBridgeProjects());
  }

  const openIdeBtn = $("openIdeBtn");
  if (openIdeBtn) {
    openIdeBtn.addEventListener("click", () => {
      chrome.tabs.create({ url: "http://127.0.0.1:3006" });
    });
  }

  const openPreviewBtn = $("openPreviewBtn");
  if (openPreviewBtn) {
    openPreviewBtn.addEventListener("click", () => {
      if (!projSelected) return;
      // Try to open the project preview via bridge
      const proj = projProjects.find(p => p.name === projSelected);
      if (proj) {
        addLog(`Preview: ${projSelected}`, "info");
      }
    });
  }

  // Load projects immediately
  loadBridgeProjects();
}

/* ── Init ── */

async function init() {
  if (els.tigerBanner) {
    els.tigerBanner.addEventListener("error", () => {
      const fallback = document.createElement("div");
      fallback.className = "logo-title";
      fallback.style.color = "#00e676";
      fallback.textContent = "TIGER IA";
      els.tigerBanner.replaceWith(fallback);
    });
  }

  setExecModeUI("web");
  updateProviderUI("deepseek");
  switchTab("dashboard");

  const cfg = await sendMessage({ type: "GET_CONFIG_STATUS" });
  if (cfg.success) {
    if (cfg.provider?.id) {
      els.providerSelect.value = cfg.provider.id;
      updateProviderUI(cfg.provider.id);
    }
    if (cfg.execMode) setExecModeUI(cfg.execMode);
    if (cfg.webAi) els.webAiSelect.value = cfg.webAi;
    if (cfg.uiAi) els.uiAiSelect.value = cfg.uiAi;
    if (cfg.folderName) els.folderName.value = cfg.folderName;
    if (cfg.hasKey) {
      const keyResp = await sendMessage({ type: "GET_API_KEY", providerId: cfg.provider?.id });
      if (keyResp.apiKey) {
        els.apiKeyInput.value = keyResp.apiKey;
        els.saveFeedback.classList.remove("hidden");
      }
      if (cfg.model) {
        populateModelSelect([{ id: cfg.model, label: cfg.model }], cfg.model);
        loadAndDetectModels(cfg.provider?.id || "deepseek");
      }
    }
    // Bridge
    if (cfg.bridge) {
      if (els.bridgeUrl && cfg.bridge.serverUrl) els.bridgeUrl.value = cfg.bridge.serverUrl;
      if (els.bridgeVercel && cfg.bridge.vercelUrl) els.bridgeVercel.value = cfg.bridge.vercelUrl;
      if (els.bridgeEnabled) els.bridgeEnabled.checked = cfg.bridge.enabled !== false;
      setBridgeBadge(cfg.bridge.enabled !== false, cfg.bridge.enabled !== false ? "🔗 ON" : "🔗 OFF");
    }
    // GitHub
    if (cfg.github) {
      if (els.githubRepo && cfg.github.repo) els.githubRepo.value = cfg.github.repo;
      if (els.githubBranch && cfg.github.branch) els.githubBranch.value = cfg.github.branch;
    }
  }

  // Load full github token (masked in status only)
  const gh = await sendMessage({ type: "GET_GITHUB" });
  if (gh.success) {
    if (els.githubToken && gh.token) els.githubToken.value = gh.token;
    if (els.githubRepo && gh.repo) els.githubRepo.value = gh.repo;
    if (els.githubBranch && gh.branch) els.githubBranch.value = gh.branch;
  }

  const bridge = await sendMessage({ type: "GET_BRIDGE" });
  if (bridge.success) {
    if (els.bridgeUrl) els.bridgeUrl.value = bridge.serverUrl || "http://127.0.0.1:5006";
    if (els.bridgeVercel) els.bridgeVercel.value = bridge.vercelUrl || "http://localhost:3006";
    if (els.bridgeEnabled) els.bridgeEnabled.checked = bridge.enabled !== false;
    setBridgeBadge(bridge.enabled !== false);
  }

  // ── Auto-test + auto-save du bridge au démarrage ──
  const autoTestUrl = (bridge.success && bridge.serverUrl) ? bridge.serverUrl : "http://127.0.0.1:5006";
  try {
    const testResult = await sendMessage({ type: "TEST_BRIDGE", url: autoTestUrl });
    if (testResult.success) {
      await sendMessage({
        type: "SET_BRIDGE",
        serverUrl: autoTestUrl,
        vercelUrl: (bridge.success && bridge.vercelUrl) ? bridge.vercelUrl : "http://localhost:3006",
        enabled: true,
      });
      setBridgeBadge(true, "🔗 OK");
      if (els.bridgeTestResult) {
        els.bridgeTestResult.textContent = "✅ Bridge connecté (auto-détecté)";
        els.bridgeTestResult.style.color = "#10b981";
        els.bridgeTestResult.style.fontWeight = "600";
      }
      addLog("✅ Bridge local (5006) auto-connecté et sauvegardé.", "success");
    } else {
      setBridgeBadge(false, "🔗 OFF");
      if (els.bridgeTestResult) {
        els.bridgeTestResult.textContent = "⚠️ Bridge local hors ligne";
        els.bridgeTestResult.style.color = "#f59e0b";
      }
      addLog(`⚠️ Bridge local non joignable (${testResult.message}). Polling Vercel actif.`, "warning");
    }
  } catch (e) {
    addLog("⚠️ Auto-test Bridge échoué : " + e.message, "warning");
  }

  // Last captured count
  const cap = await sendMessage({ type: "GET_CAPTURED" });
  if (cap.success && cap.files?.length && els.capturedCountBadge) {
    els.capturedCountBadge.textContent = `${cap.files.length} fichiers`;
  }

  await refreshProjectView();
  const sourcePipelineStatus = await sendMessage({ type: "GET_SOURCE_PIPELINE_STATUS" });
  if (sourcePipelineStatus.success) githubShowApproval(sourcePipelineStatus);
  addLog("KIROV5 Orchestrator v5.1.1 prêt — structure React (.tsx/.ts/.css) préservée.", "info");
  addLog("Onglets: Projets · Projet · Injection · Capture · GitHub + Bridge :5006.", "info");

  // Initialize bridge-synced projects tab
  initProjects();
}

/* ── GitHub Sources UI ── */
function githubSetStatus(text, state = "idle") {
  if (!els.githubSearchStatus) return;
  els.githubSearchStatus.textContent = text;
  els.githubSearchStatus.className = `status-pill ${state}`;
}

function githubProjectId(pack) {
  return pack?.projectName || pack?.name || pack?.folderName || pack?.project?.name || "default";
}
function githubSearchStateSnapshot() {
  return {
    projectIdea: els.githubProjectIdea?.value || "",
    query: els.githubSearchQuery?.value || "",
    language: els.githubLanguage?.value || "",
    minStars: els.githubMinStars?.value || "0",
    freshness: els.githubFreshness?.value || "1095",
    policy: els.githubPolicy?.value || "commercial-permissive",
    licenses: [...document.querySelectorAll('input[name="githubLicense"]:checked')].map((input) => input.value),
    sort: els.githubSort?.value || "score",
    candidates: githubCandidates,
    selected: [...githubSelected],
    summary: githubSearchSummary,
    syncedTimestamp: lastSyncedIntentTimestamp,
    syncedPackSlug: lastSyncedPackSlug,
    savedAt: new Date().toISOString(),
  };
}
function githubPersistSearchState() {
  if (githubStateHydrating || !globalThis.chrome?.storage?.local) return;
  chrome.storage.local.set({ [GITHUB_SEARCH_STATE_KEY]: githubSearchStateSnapshot() });
}
async function githubRestoreSearchState() {
  if (!globalThis.chrome?.storage?.local) return;
  githubStateHydrating = true;
  try {
    const result = await new Promise((resolve) => chrome.storage.local.get([GITHUB_SEARCH_STATE_KEY], resolve));
    const state = result?.[GITHUB_SEARCH_STATE_KEY];
    if (state?.syncedTimestamp) lastSyncedIntentTimestamp = state.syncedTimestamp;
    if (state?.syncedPackSlug) lastSyncedPackSlug = state.syncedPackSlug;
    if (els.githubProjectIdea) els.githubProjectIdea.value = state?.projectIdea || "";
    if (els.githubSearchQuery) els.githubSearchQuery.value = state?.query || "";
    if (els.githubLanguage) els.githubLanguage.value = state.language || "";
    if (els.githubMinStars) els.githubMinStars.value = state.minStars ?? "0";
    if (els.githubFreshness) els.githubFreshness.value = state.freshness || "1095";
    if (els.githubPolicy) els.githubPolicy.value = state.policy || "commercial-permissive";
    if (els.githubSort) els.githubSort.value = state.sort || "score";
    const accepted = new Set(Array.isArray(state.licenses) ? state.licenses : ["MIT", "Apache-2.0", "BSD-3-Clause", "ISC"]);
    document.querySelectorAll('input[name="githubLicense"]').forEach((input) => { input.checked = accepted.has(input.value); });
    githubCandidates = Array.isArray(state.candidates) ? state.candidates : [];
    githubSelected = new Set(Array.isArray(state.selected) ? state.selected : []);
    githubSearchSummary = state.summary && typeof state.summary === "object" ? state.summary : null;
    if (githubCandidates.length) {
      if (githubSearchSummary) githubRenderSummary(githubSearchSummary);
      githubRenderResults();
      githubUpdateSelection();
      githubSetStatus(`${githubCandidates.length} RÉSULTATS`, "success");
    }
  } finally {
    githubStateHydrating = false;
  }
}
function githubRenderSummary(summary) {
  if (!els.githubSummary) return;
  els.githubSummary.classList.remove("hidden");
  els.githubSummary.innerHTML = "";
  [[summary.total, "résultats"], [summary.compatible, "autorisés"], [summary.review, "à vérifier"], [summary.averageScore, "score moyen"]].forEach(([value, label]) => {
    const card = document.createElement("div"); card.className = "summary-card";
    const v = document.createElement("span"); v.className = "summary-value"; v.textContent = String(value ?? 0);
    const l = document.createElement("span"); l.className = "summary-label"; l.textContent = label;
    card.append(v, l); els.githubSummary.appendChild(card);
  });
}

function githubRenderResults() {
  if (!els.githubResults) return;
  const sort = els.githubSort?.value || "score";
  const items = [...githubCandidates].sort((a, b) => sort === "stars" ? b.stars - a.stars : sort === "updated" ? String(b.pushedAt || "").localeCompare(String(a.pushedAt || "")) : sort === "license" ? String(a.licenseDecision?.status).localeCompare(String(b.licenseDecision?.status)) : b.score - a.score);
  els.githubResults.innerHTML = "";
  if (!items.length) { els.githubResults.innerHTML = '<div class="empty-state">Aucun dépôt ne correspond aux filtres.</div>'; return; }
  items.forEach((repo) => {
    const status = repo.licenseDecision?.status || "review";
    const card = document.createElement("article"); card.className = `github-card ${status} ${githubSelected.has(repo.fullName) ? "selected" : ""}`;
    const header = document.createElement("div"); header.className = "github-card-header";
    const title = document.createElement("a"); title.className = "github-card-title"; title.href = repo.url; title.target = "_blank"; title.rel = "noopener noreferrer"; title.textContent = repo.fullName;
    const score = document.createElement("div"); score.className = "github-score"; score.textContent = String(repo.score); const scoreLabel = document.createElement("span"); scoreLabel.className = "github-score-label"; scoreLabel.textContent = "/100"; score.appendChild(scoreLabel); header.append(title, score);
    const description = document.createElement("p"); description.className = "github-card-description"; description.textContent = repo.description || "Aucune description.";
    const meta = document.createElement("div"); meta.className = "github-meta";
    const updatedAt = repo.pushedAt || repo.updatedAt;
    const updatedLabel = updatedAt && !Number.isNaN(Date.parse(updatedAt)) ? `Mis à jour ${new Date(updatedAt).toLocaleDateString("fr-FR")}` : "Mise à jour inconnue";
    [[repo.language || "Technologie ?", ""], [updatedLabel, ""], [`★ ${repo.stars}`, ""], [`⑂ ${repo.forks}`, ""], [repo.licenseCheck?.spdxId || "Licence inconnue", `license-${status}`]].forEach(([text, cls]) => { const tag = document.createElement("span"); tag.className = `github-tag ${cls}`; tag.textContent = text; meta.appendChild(tag); });
    const bar = document.createElement("div"); bar.className = "github-score-bar"; const fill = document.createElement("div"); fill.className = "github-score-bar-fill"; fill.style.width = `${repo.score}%`; bar.appendChild(fill);
    const reasons = document.createElement("ul"); reasons.className = "github-reasons"; (repo.reasons || []).slice(0, 3).forEach((reason) => { const li = document.createElement("li"); li.textContent = reason; reasons.appendChild(li); });
    const actions = document.createElement("div"); actions.className = "github-card-actions";
    const license = document.createElement("span"); license.className = "github-tag"; license.textContent = repo.licenseDecision?.reason || "Licence à vérifier";
    const selectable = status === "allowed";
    const select = document.createElement("button"); select.className = "btn-cyber btn-sm"; select.textContent = githubSelected.has(repo.fullName) ? "✓ Sélectionné" : selectable ? "Sélectionner" : status === "review" ? "À vérifier" : "Bloqué"; select.disabled = !selectable; select.addEventListener("click", () => { if (githubSelected.has(repo.fullName)) githubSelected.delete(repo.fullName); else githubSelected.add(repo.fullName); githubRenderResults(); githubUpdateSelection(); }); actions.append(license, select);
    card.append(header, description, meta, bar, reasons, actions); els.githubResults.appendChild(card);
  });
}

function githubUpdateSelection() { const count = githubSelected.size; if (els.githubSelectedCount) els.githubSelectedCount.textContent = `${count} dépôt${count > 1 ? "s" : ""} sélectionné${count > 1 ? "s" : ""}`; if (els.useGithubSourcesBtn) els.useGithubSourcesBtn.disabled = count === 0; if (els.downloadGithubSourcesBtn) els.downloadGithubSourcesBtn.disabled = count === 0; githubPersistSearchState(); }

async function githubSearch() {
  githubSetStatus("RECHERCHE…", "loading");
  if (els.githubResults) els.githubResults.innerHTML = '<div class="loading-results">Interrogation de GitHub et vérification des licences…</div>';
  const freshness = els.githubFreshness?.value === "all" ? 3650 : Number(els.githubFreshness?.value || 1095);
  const licenses = [...document.querySelectorAll('input[name="githubLicense"]:checked')].map((input) => input.value);
  const response = await sendMessage({ type: "SEARCH_GITHUB_FOR_PROJECT", projectId: "current", projectIdea: els.githubProjectIdea?.value || "", query: els.githubSearchQuery?.value || "", language: els.githubLanguage?.value || "", minStars: Number(els.githubMinStars?.value || 0), freshnessDays: freshness, licenses, policy: els.githubPolicy?.value || "commercial-permissive", perPage: 20 });
  if (!response.success) { githubSetStatus("ERREUR", "error"); if (els.githubResults) els.githubResults.innerHTML = `<div class="empty-state">${String(response.message || "Recherche impossible")}</div>`; return; }
  githubCandidates = response.candidates || []; githubSelected = new Set(); githubSearchSummary = response.summary || {}; githubRenderSummary(githubSearchSummary); githubRenderResults(); githubUpdateSelection(); githubSetStatus(`${githubCandidates.length} RÉSULTATS`, "success"); githubPersistSearchState();
}

function githubSelectedSourceRecords() {
  return githubCandidates.filter((repo) => githubSelected.has(repo.fullName)).map((repo) => ({
    repository: repo.fullName,
    url: repo.url,
    branch: repo.defaultBranch,
    commit: null,
    description: repo.description,
    technology: repo.language,
    topics: repo.topics || [],
    updatedAt: repo.pushedAt || repo.updatedAt || null,
    capabilities: repo.capabilities || [],
    reasons: repo.reasons || [],
    score: repo.score,
    scoreBreakdown: repo.scoreBreakdown || {},
    license: repo.licenseCheck?.spdxId || "NOASSERTION",
    licenseName: repo.licenseCheck?.name || "Licence inconnue",
    licenseStatus: repo.licenseDecision?.status || "unknown",
    licensePolicy: repo.licenseDecision?.policy || els.githubPolicy?.value || "commercial-permissive",
    licenseReason: repo.licenseDecision?.reason || "",
    repositoryLicenseChecked: Boolean(repo.licenseCheck?.repositoryLicenseChecked),
    selectedAt: new Date().toISOString(),
  }));
}

async function githubDownloadSources() {
  const sources = githubSelectedSourceRecords();
  if (!sources.length) return;
  const packResponse = await sendMessage({ type: "GET_PACK" });
  const pack = packResponse?.pack;
  const projectFolder = pack?.state?.folderName || els.folderName?.value?.trim() || pack?.projectName || "forgeai-project";
  const confirmed = confirm(`Télécharger ${sources.length} dépôt(s) au format ZIP dans Downloads/${projectFolder}/github-sources/ ?\n\nLes archives seront enregistrées comme références uniquement. Elles ne seront pas copiées dans l’application générée.`);
  if (!confirmed) return;
  setButtonLoading(els.downloadGithubSourcesBtn, true);
  githubSetStatus("TÉLÉCHARGEMENT…", "loading");
  const response = await sendMessage({ type: "DOWNLOAD_GITHUB_SOURCES", projectId: githubProjectId(pack), projectFolder, sources });
  setButtonLoading(els.downloadGithubSourcesBtn, false, "⬇️ TÉLÉCHARGER LES SOURCES");
  if (!response.success) {
    githubSetStatus("ÉCHEC", "error");
    addLog(`Téléchargement GitHub arrêté : ${response.message}`, "error");
    return;
  }
  githubSetStatus("TÉLÉCHARGÉ", "success");
  response.results.forEach((result) => addLog(`${result.repository} → ${result.filename} — SHA-256 ${result.sha256}`, "success"));
  addLog(`Manifest de téléchargement → ${response.manifestFilename}`, "success");
  addLog(response.warning, "warning");
}

function githubShowApproval(status, sourceCount = 0) {
  if (!els.githubApprovalPanel || !els.githubApprovalText || !els.approveSourceCodegenBtn) return;
  if (!status?.sourcePipeline) {
    els.githubApprovalPanel.classList.add("hidden");
    return;
  }
  els.githubApprovalPanel.classList.remove("hidden");
  if (status.sourcePipeline.automationMode === "full-auto") {
    els.githubApprovalText.textContent = "Mode B actif : les spécifications, la génération du code et l’export final sont automatisés.";
    els.approveSourceCodegenBtn.classList.add("hidden");
    return;
  }
  const approval = status.codegenApproval?.status || "pending";
  if (approval === "pending") {
    els.githubApprovalText.textContent = `${sourceCount || status.sourceCount || 0} référence(s) sont enregistrées. Le PRD, l’architecture et les tâches sont prêts ou en cours de préparation. Vérifiez-les avant de lancer une application originale.`;
    els.approveSourceCodegenBtn.classList.remove("hidden");
    els.approveSourceCodegenBtn.disabled = status.currentStep !== 9;
  } else if (approval === "approved") {
    els.githubApprovalText.textContent = "Validation enregistrée. La génération du code est autorisée.";
    els.approveSourceCodegenBtn.classList.add("hidden");
  }
}

async function githubUseSources() {
  const sources = githubSelectedSourceRecords();
  if (!sources.length) return;
  const packResponse = await sendMessage({ type: "GET_PACK" });
  const pack = packResponse?.pack;
  const projectDescription = pack?.projectDescription || els.githubProjectIdea?.value?.trim() || "";
  if (!projectDescription) {
    githubSetStatus("DESCRIPTION REQUISE", "error");
    addLog("Ajoutez la description du projet pour pouvoir créer automatiquement le projet.", "error");
    return;
  }
  setButtonLoading(els.useGithubSourcesBtn, true);
  githubSetStatus("PRÉPARATION…", "loading");
  const response = await sendMessage({
    type: "PREPARE_PROJECT_WITH_GITHUB_SOURCES",
    projectName: pack?.projectName || els.projectName?.value?.trim() || "",
    projectDescription,
    projectIdea: els.githubProjectIdea?.value || projectDescription,
    folderName: pack?.state?.folderName || els.folderName?.value?.trim() || "",
    execMode: currentExecMode,
    webAi: els.webAiSelect?.value || "deepseek",
    policy: els.githubPolicy?.value || "commercial-permissive",
    automationMode: els.githubAutomationMode?.value || "approval-gate",
    autoCreate: true,
    autoRunSpecs: true,
    sources,
  });
  setButtonLoading(els.useGithubSourcesBtn, false, "✅ UTILISER");
  if (!response.success) { githubSetStatus("ÉCHEC", "error"); addLog(`Préparation GitHub arrêtée : ${response.message}`, "error"); return; }
  githubSetStatus("VALIDATION REQUISE", "success");
  addLog(`${sources.length} source(s) GitHub enregistrée(s) et documents de provenance intégrés.`, "success");
  addLog("PRD, architecture et tâches déclenchés ; la génération du code attend votre validation.", "info");
  if (response.created) addLog("Projet créé automatiquement à partir de la description fournie.", "success");
  const sourceStatus = await sendMessage({ type: "GET_SOURCE_PIPELINE_STATUS" });
  githubShowApproval(sourceStatus, sources.length);
  if (sourceStatus.sourcePipeline?.automationMode === "full-auto") addLog("Mode B : génération et export final automatisés.", "success");
  await refreshProjectView();
}

async function githubApproveCodegen() {
  const status = await sendMessage({ type: "GET_SOURCE_PIPELINE_STATUS" });
  if (!status.success || !status.sourcePipeline) return;
  const confirmed = confirm(`Valider la génération d’une application originale ?\n\n${status.sourceCount} référence(s) GitHub resteront documentaires uniquement ; aucun code externe ne sera copié automatiquement. Les dépendances seront contrôlées pour éviter les URLs, versions non déterministes et doublons.`);
  if (!confirmed) return;
  setButtonLoading(els.approveSourceCodegenBtn, true);
  githubSetStatus("GÉNÉRATION…", "loading");
  const approval = await sendMessage({ type: "APPROVE_SOURCE_CODEGEN" });
  if (!approval.success) { setButtonLoading(els.approveSourceCodegenBtn, false, "VALIDER & GÉNÉRER L’APPLICATION"); githubSetStatus("ÉCHEC", "error"); addLog(approval.message || "Validation impossible.", "error"); return; }
  const result = await sendMessage({ type: "RUN_FULL_PIPELINE", execMode: currentExecMode, webAi: els.webAiSelect?.value || "deepseek" });
  setButtonLoading(els.approveSourceCodegenBtn, false, "VALIDER & GÉNÉRER L’APPLICATION");
  if (result.success) {
    githubSetStatus("TERMINÉ", "success");
    addLog(`Application originale générée avec provenance incluse dans Downloads/${result.folderName || "projet"}/.`, "success");
  } else {
    githubSetStatus("AUDIT À CORRIGER", "error");
    addLog(result.message || "Génération arrêtée par les contrôles de cohérence.", "error");
  }
  await refreshProjectView();
  githubShowApproval(await sendMessage({ type: "GET_SOURCE_PIPELINE_STATUS" }));
}

function initGithubSourcesUI() {
  initGemsPanel();
  if (!els.searchGithubSourcesBtn || els.searchGithubSourcesBtn.dataset.bound) return;
  els.searchGithubSourcesBtn.dataset.bound = "1";
  els.searchGithubSourcesBtn.addEventListener("click", githubSearch);
  els.githubSort?.addEventListener("change", () => { githubRenderResults(); githubPersistSearchState(); });
  els.selectAllGithubBtn?.addEventListener("click", () => { const selectable = githubCandidates.filter((repo) => repo.licenseDecision?.status === "allowed"); if (githubSelected.size === selectable.length) githubSelected.clear(); else selectable.forEach((repo) => githubSelected.add(repo.fullName)); githubRenderResults(); githubUpdateSelection(); });
  els.downloadGithubSourcesBtn?.addEventListener("click", githubDownloadSources);
  els.useGithubSourcesBtn?.addEventListener("click", githubUseSources);
  els.approveSourceCodegenBtn?.addEventListener("click", githubApproveCodegen);
  els.clearGithubSourcesBtn?.addEventListener("click", () => { githubCandidates = []; githubSelected.clear(); githubSearchSummary = null; if (els.githubProjectIdea) els.githubProjectIdea.value = ""; if (els.githubResults) els.githubResults.innerHTML = '<div class="empty-state">Lancez une recherche pour afficher les dépôts.</div>'; els.githubSummary?.classList.add("hidden"); githubUpdateSelection(); chrome.storage.local.remove(GITHUB_SEARCH_STATE_KEY); githubSetStatus("PRÊT", "idle"); });
  [els.githubProjectIdea, els.githubSearchQuery, els.githubLanguage, els.githubMinStars, els.githubFreshness, els.githubPolicy, ...document.querySelectorAll('input[name="githubLicense"]')].forEach((element) => element?.addEventListener("input", githubPersistSearchState));
  [els.githubLanguage, els.githubMinStars, els.githubFreshness, els.githubPolicy, ...document.querySelectorAll('input[name="githubLicense"]')].forEach((element) => element?.addEventListener("change", githubPersistSearchState));
  // Ne pas forcer le champ requête GitHub : il reste vide si l'utilisateur ne le renseigne pas
  void githubRestoreSearchState();

  /* Écouteur en direct : synchronise le popup si l'application web modifie l'intention ou lance une recherche */
  if (globalThis.chrome?.storage?.onChanged) {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes[GITHUB_SEARCH_STATE_KEY]) {
        const newState = changes[GITHUB_SEARCH_STATE_KEY].newValue;
        if (newState) {
          if (els.githubProjectIdea && newState.projectIdea !== undefined) {
            els.githubProjectIdea.value = newState.projectIdea;
          }
          if (els.githubSearchQuery && newState.query !== undefined) {
            els.githubSearchQuery.value = newState.query || "";
          }
          if (Array.isArray(newState.candidates)) {
            githubCandidates = newState.candidates;
            githubSelected = new Set(Array.isArray(newState.selected) ? newState.selected : []);
            githubSearchSummary = newState.summary || null;
            if (githubSearchSummary) githubRenderSummary(githubSearchSummary);
            githubRenderResults();
            githubUpdateSelection();
            githubSetStatus(`${githubCandidates.length} RÉSULTATS`, "success");
          }
        }
      }
    });
  }

  /* Synchronisation dynamique avec le pack actif du Studio via le bridge */
  async function syncWithBridgeIntent(force = false) {
    try {
      const res = await fetch("http://127.0.0.1:5006/v1/github/intent");
      if (!res.ok) return;
      const data = await res.json();
      if (!data?.intent) return;
      const intent = data.intent;

      const isDifferent =
        force ||
        (intent.timestamp && intent.timestamp !== lastSyncedIntentTimestamp) ||
        (intent.packSlug && intent.packSlug !== lastSyncedPackSlug) ||
        (!els.githubProjectIdea?.value && intent.projectIdea);

      if (isDifferent) {
        lastSyncedIntentTimestamp = intent.timestamp || new Date().toISOString();
        lastSyncedPackSlug = intent.packSlug || null;

        if (els.githubProjectIdea && intent.projectIdea) {
          els.githubProjectIdea.value = intent.projectIdea;
        }
        if (els.githubSearchQuery && intent.query !== undefined) {
          els.githubSearchQuery.value = intent.query || "";
        }
        githubPersistSearchState();
        addLog(`⚡ Pack actif synchronisé : ${intent.packSlug || intent.projectName || "Studio"}`, "info");
        // Déclencher automatiquement la recherche pour rafraîchir les candidats correspondants
        void githubSearch();
      }
    } catch (_) {}
  }

  els.syncBridgeIntentBtn?.addEventListener("click", () => syncWithBridgeIntent(true));

  // Synchro au démarrage, puis surveillance périodique et sur focus du popup
  void syncWithBridgeIntent(false);
  setInterval(() => syncWithBridgeIntent(false), 2500);
  window.addEventListener("focus", () => syncWithBridgeIntent(false));
}

initGithubSourcesUI();
init();


/* ── Gems UI — Pépites détectées ── */

let gemsReport = null;
let gemChoices = {};

function gemKey(gem) { return `${gem.repository}::${gem.path}`; }

const GEM_LICENSE_CLASS = { "allowed": "gem-license-allowed", "review": "gem-license-review", "blocked": "gem-license-blocked" };
const GEM_MODE_LABELS = { "extractable": "Extraction sélective", "inspiration": "Inspiration architecturale", "foundation": "Fondation technique", "blocked": "Bloqué ❌" };

function initGemsPanel() {
  const modeBThresholdGroup = document.getElementById("modeBThresholdGroup");
  function updateModeBThreshold() {
    const isB = els.githubAutomationMode?.value === "full-auto";
    if (modeBThresholdGroup) modeBThresholdGroup.style.display = isB ? "" : "none";
  }
  els.githubAutomationMode?.addEventListener("change", updateModeBThreshold);
  updateModeBThreshold();
  document.getElementById("mountProjectBtn")?.addEventListener("click", async () => {
    const reuseLog = document.getElementById("reuseLog");
    const provenancePanel = document.getElementById("provenancePanel");
    const btn = document.getElementById("mountProjectBtn");
    await handleMountProject(reuseLog, provenancePanel, btn);
  });
  document.getElementById("viewProvenanceBtn")?.addEventListener("click", () => {
    const el = document.getElementById("provenanceText");
    const panel = document.getElementById("provenanceContent");
    if (el && panel) { el.textContent = window._provenanceReport || "Aucun rapport."; panel.classList.toggle("hidden"); }
  });
  document.getElementById("viewThirdPartyBtn")?.addEventListener("click", () => {
    const el = document.getElementById("provenanceText");
    const panel = document.getElementById("provenanceContent");
    if (el && panel) { el.textContent = window._thirdPartyNotices || "Aucun fichier."; panel.classList.remove("hidden"); }
  });
}

async function githubAnalyzeAndShowGems(sources) {
  const gemsPanel = document.getElementById("gemsPanel");
  const gemsStatus = document.getElementById("gemsStatus");
  const mountPanel = document.getElementById("mountPanel");
  if (!gemsPanel) return;
  gemsPanel.classList.remove("hidden");
  if (gemsStatus) { gemsStatus.textContent = "ANALYSE…"; gemsStatus.className = "status-pill loading"; }
  document.getElementById("gemsList").innerHTML = '<div class="empty-state"><span class="loading"></span> Analyse en cours…</div>';
  addLog(`Analyse des pépites : ${sources.length} dépôt(s)…`, "info");
  const resp = await sendMessage({ type: "ANALYZE_GEMS", sources });
  if (!resp.success) {
    if (gemsStatus) { gemsStatus.textContent = "ERREUR"; gemsStatus.className = "status-pill error"; }
    document.getElementById("gemsList").innerHTML = `<div class="empty-state log-entry error">Analyse échouée : ${resp.message}</div>`;
    addLog("Analyse pépites échouée : " + resp.message, "error");
    return;
  }
  gemsReport = resp.gemReport;
  gemChoices = {};
  if (gemsStatus) { gemsStatus.textContent = "PRÊT"; gemsStatus.className = "status-pill success"; }
  renderGems(gemsReport.allGems || []);
  if (mountPanel) mountPanel.classList.remove("hidden");
  updateMountBtn();
}

function renderGems(gems) {
  const container = document.getElementById("gemsList");
  const summary = document.getElementById("gemsSummary");
  if (!container) return;
  const totals = { extractable: 0, inspiration: 0, blocked: 0, total: gems.length };
  for (const g of gems) {
    if (g.reuseMode === "extractable" || g.reuseMode === "foundation") totals.extractable++;
    else if (g.reuseMode === "inspiration") totals.inspiration++;
    else if (g.reuseMode === "blocked") totals.blocked++;
  }
  const setCount = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  setCount("gemsCountExtractable", totals.extractable);
  setCount("gemsCountInspiration", totals.inspiration);
  setCount("gemsCountBlocked", totals.blocked);
  setCount("gemsCountTotal", totals.total);
  if (summary) summary.classList.remove("hidden");
  if (!gems.length) { container.innerHTML = '<div class="empty-state">Aucune pépite détectée.</div>'; return; }
  container.innerHTML = "";
  for (const gem of gems) {
    const key = gemKey(gem);
    const isBlocked = gem.reuseMode === "blocked";
    const licClass = GEM_LICENSE_CLASS[gem.licenseStatus] || "gem-license-review";
    const currentAction = gemChoices[key] || null;
    const score = gem.score ?? 0;
    const scoreClass = score >= 80 ? "gem-score-high" : score >= 60 ? "gem-score-mid" : "gem-score-low";
    const modeLabel = GEM_MODE_LABELS[gem.reuseMode] || gem.reuseMode;
    const card = document.createElement("div");
    card.className = `gem-card${isBlocked ? " gem-card-blocked" : ""}`;
    card.dataset.gemKey = key;
    card.innerHTML = `
      <div class="gem-card-top">
        <div class="gem-info">
          <div class="gem-repo">${gem.repository || "—"}</div>
          <div class="gem-path" title="${gem.path || ""}">${(gem.path || "").split("/").slice(-2).join("/")}</div>
          <div class="gem-desc">${gem.value || "Composant détecté"}</div>
        </div>
        <div class="gem-score-badge ${scoreClass}">${score}<small>/100</small></div>
      </div>
      <div class="gem-meta">
        <span class="gem-license-badge ${licClass}">${gem.fileLicense || gem.repoLicense || "?"}</span>
        <span class="gem-mode-badge">${modeLabel}</span>
        ${gem.dependencies?.length ? `<span class="gem-dep-count">${gem.dependencies.length} dép.</span>` : ""}
        ${gem.hasTests ? `<span class="gem-has-tests">✔ Tests</span>` : ""}
        ${gem.hasSecrets ? `<span class="gem-has-secrets">⚠ Secrets</span>` : ""}
        <span class="gem-size">${Math.round((gem.sizeBytes || 0) / 1024 * 10) / 10} Ko</span>
      </div>
      <div class="gem-actions" ${isBlocked ? 'style="opacity:0.5;pointer-events:none"' : ""}>
        <button class="gem-btn gem-btn-use${currentAction === "use-code" ? " active" : ""}" data-action="use-code" data-key="${key}" ${isBlocked ? "disabled" : ""}>✅ Utiliser</button>
        <button class="gem-btn gem-btn-inspire${currentAction === "inspire-only" ? " active" : ""}" data-action="inspire-only" data-key="${key}" ${isBlocked ? "disabled" : ""}>💡 Inspirer</button>
        <button class="gem-btn gem-btn-exclude${currentAction === "exclude" ? " active" : ""}" data-action="exclude" data-key="${key}">❌ Exclure</button>
      </div>`;
    container.appendChild(card);
  }
  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".gem-btn");
    if (!btn) return;
    handleGemAction(btn.dataset.key, btn.dataset.action);
  });
}

function handleGemAction(key, action) {
  if (!key || !action) return;
  gemChoices[key] = action;
  const card = document.querySelector(`.gem-card[data-gem-key="${key}"]`);
  if (card) {
    card.querySelectorAll(".gem-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.action === action));
    card.classList.toggle("gem-card-chosen", action !== "exclude");
  }
  updateMountBtn();
  const allGems = gemsReport?.allGems || [];
  const choices = allGems.map(gem => ({ ...gem, action: gemChoices[gemKey(gem)] || null })).filter(c => c.action);
  sendMessage({ type: "SAVE_GEM_CHOICES", choices }).catch(() => {});
}

function updateMountBtn() {
  const btn = document.getElementById("mountProjectBtn");
  if (!btn) return;
  btn.disabled = !Object.values(gemChoices).some(a => a === "use-code" || a === "foundation");
}

async function handleMountProject(reuseLog, provenancePanel, mountBtn) {
  if (!gemsReport) return;
  const allGems = gemsReport.allGems || [];
  const choices = allGems.map(gem => ({ ...gem, action: gemChoices[gemKey(gem)] || null })).filter(c => c.action && c.action !== "exclude");
  if (!choices.some(c => c.action === "use-code")) {
    addToLog(reuseLog, "⚠ Sélectionnez au moins un composant à extraire.", "warning");
    return;
  }
  setButtonLoading(mountBtn, true);
  addToLog(reuseLog, "🚀 Montage en cours…", "info");
  const resp = await sendMessage({ type: "MOUNT_PROJECT", choices });
  setButtonLoading(mountBtn, false, "🚀 MONTER LE PROJET");
  if (resp.success) {
    addToLog(reuseLog, `✅ ${resp.filesWritten} fichier(s) dans src/integrations/github-adapted/`, "success");
    addLog(`Montage terminé : ${resp.components} composant(s).`, "success");
    window._provenanceReport = resp.provenanceReport || "";
    window._thirdPartyNotices = resp.thirdPartyNotices || "";
    if (provenancePanel) provenancePanel.classList.remove("hidden");
    const setCount = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    setCount("provComponentsCount", resp.components || 0);
    setCount("provFilesCount", resp.filesWritten || 0);
    if (resp.securityGuard?.issues?.length) addToLog(reuseLog, `⚠ ${resp.securityGuard.issues.length} avertissement(s) de sécurité.`, "warning");
  } else {
    addToLog(reuseLog, `❌ Montage échoué : ${resp.message}`, "error");
    if (resp.issues?.length) resp.issues.forEach(i => addToLog(reuseLog, `  → ${i.type}: ${i.path}`, "error"));
    addLog("Montage arrêté : " + resp.message, "error");
  }
}

