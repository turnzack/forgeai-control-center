// popup.js — Logique du popup AIOS Stealth Bridge
// --------------------------------------------------
// Communique avec le content script injecté dans l'onglet actif via
// `chrome.tabs.sendMessage`. Affiche un journal d'exécution coloré.

(function () {
  "use strict";

  /** @type {HTMLSelectElement} */
  const targetEl = document.getElementById("target");
  /** @type {HTMLTextAreaElement} */
  const promptEl = document.getElementById("prompt");
  /** @type {HTMLButtonElement} */
  const injectBtn = document.getElementById("inject");
  /** @type {HTMLButtonElement} */
  const clearBtn = document.getElementById("clear");
  /** @type {HTMLPreElement} */
  const statusEl = document.getElementById("status");

  // Hôtes autorisés par cible (alignés sur host_permissions du manifest).
  const HOSTS = {
    stitch: "https://stitch.withgoogle.com/",
    deepseek: "https://chat.deepseek.com/",
  };

  /**
   * Ajoute une ligne horodatée dans le journal.
   * @param {string} msg
   * @param {"info"|"ok"|"warn"|"err"} [level="info"]
   */
  function log(msg, level = "info") {
    const ts = new Date().toLocaleTimeString("fr-FR", { hour12: false });
    const span = document.createElement("span");
    span.className = "ts";
    span.textContent = `[${ts}] `;
    const line = document.createElement("span");
    if (level !== "info") line.className = level;
    line.textContent = msg + "\n";
    // Remplace le contenu initial au premier log.
    if (statusEl.dataset.started !== "1") {
      statusEl.textContent = "";
      statusEl.dataset.started = "1";
    }
    statusEl.appendChild(span);
    statusEl.appendChild(line);
    statusEl.scrollTop = statusEl.scrollHeight;
  }

  /** Charge la dernière cible utilisée depuis chrome.storage. */
  async function restoreState() {
    try {
      const data = await chrome.storage.local.get(["stealth_target", "stealth_prompt"]);
      if (data.stealth_target && HOSTS[data.stealth_target]) {
        targetEl.value = data.stealth_target;
      }
      if (typeof data.stealth_prompt === "string") {
        promptEl.value = data.stealth_prompt;
      }
    } catch (e) {
      // storage indisponible (contexte privé) — on ignore silencieusement.
    }
  }

  /** Persiste la cible + le prompt courant. */
  async function persistState() {
    try {
      await chrome.storage.local.set({
        stealth_target: targetEl.value,
        stealth_prompt: promptEl.value,
      });
    } catch (e) {
      // noop
    }
  }

  /**
   * Récupère l'onglet actif courant.
   * @returns {Promise<chrome.tabs.Tab>}
   */
  function getActiveTab() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const err = chrome.runtime.lastError;
        if (err) reject(new Error(err.message));
        else if (!tabs || tabs.length === 0) reject(new Error("Aucun onglet actif."));
        else resolve(tabs[0]);
      });
    });
  }

  /**
   * Vérifie que l'URL de l'onglet correspond bien à la cible choisie.
   * @param {string} url
   * @param {string} target
   */
  function urlMatchesTarget(url, target) {
    if (!url) return false;
    const expected = HOSTS[target];
    return url.startsWith(expected);
  }

  /**
   * Gestionnaire du clic "Injecter".
   * @param {MouseEvent} evt
   */
  async function onInject(evt) {
    evt.preventDefault();
    const target = targetEl.value;
    const prompt = promptEl.value.trim();

    if (!prompt) {
      log("Le prompt est vide — rien à injecter.", "warn");
      return;
    }

    injectBtn.disabled = true;
    log(`Initialisation de l'injection vers « ${target} »...`);

    try {
      const tab = await getActiveTab();
      log(`Onglet actif : ${tab.url || "(URL masquée)"}`);

      if (!urlMatchesTarget(tab.url || "", target)) {
        log(
          `L'onglet courant ne correspond pas à la cible "${target}". ` +
            `Ouvre ${HOSTS[target]} dans cet onglet puis réessaie.`,
          "err"
        );
        return;
      }

      // Envoi du message au content script.
      const response = await chrome.tabs.sendMessage(tab.id, {
        type: "STEALTH_BRIDGE_INJECT",
        target,
        prompt,
      });

      if (response && response.ok) {
        log(`Injection réussie : ${response.message || "OK"}`, "ok");
      } else {
        const reason = (response && response.message) || "Réponse inattendue.";
        log(`Échec de l'injection : ${reason}`, "err");
      }
    } catch (e) {
      const msg = e && e.message ? e.message : String(e);
      if (msg.includes("Could not establish connection") || msg.includes("Receiving end does not exist")) {
        log(
          "Aucun content script trouvé sur cet onglet. Recharge la page cible " +
            "(Ctrl+R) puis réessaie.",
          "err"
        );
      } else {
        log(`Erreur : ${msg}`, "err");
      }
    } finally {
      injectBtn.disabled = false;
      await persistState();
    }
  }

  /** Vide le journal. */
  function onClear() {
    statusEl.textContent = "";
    statusEl.dataset.started = "1";
    const span = document.createElement("span");
    span.className = "ts";
    span.textContent = "[prêt] ";
    const line = document.createElement("span");
    line.textContent = "Journal vidé.\n";
    statusEl.appendChild(span);
    statusEl.appendChild(line);
  }

  // Bind des événements.
  injectBtn.addEventListener("click", onInject);
  clearBtn.addEventListener("click", onClear);
  targetEl.addEventListener("change", persistState);
  promptEl.addEventListener("input", persistState);

  // Raccourci clavier : Ctrl+Enter dans le textarea = Injecter.
  promptEl.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onInject(e);
    }
  });

  restoreState();
})();
