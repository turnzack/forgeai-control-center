// content.js — Content script AIOS Stealth Bridge
// -------------------------------------------------
// Injecté (document_idle) sur les pages :
//   - https://stitch.withgoogle.com/*
//   - https://chat.deepseek.com/*
//   - http://localhost:3000/*  (AIOS Studio)
//   - http://localhost:81/*    (Caddy gateway → AIOS Studio)
//
// Écoute les messages `STEALTH_BRIDGE_INJECT` envoyés par popup.js,
// localise la zone de saisie de l'IA cible, y tape le prompt, puis
// déclenche le bouton d'envoi. Chaque étape est enveloppée dans un
// try/catch et le statut est renvoyé au popup.

(function () {
  "use strict";

  /** Détecte la cible à partir de l'URL courante. */
  function detectTarget() {
    const href = window.location.href;
    if (href.startsWith("https://stitch.withgoogle.com/")) return "stitch";
    if (href.startsWith("https://chat.deepseek.com/")) return "deepseek";
    // localhost n'est pas une cible d'injection IA, mais on l'autorise pour
    // les tests : on tente quand même la détection générique.
    return null;
  }

  /**
   * Attend qu'un élément réponde à un sélecteur donné, avec timeout.
   * @param {string} selector
   * @param {number} [timeout=4000]
   * @returns {Promise<Element|null>}
   */
  function waitFor(selector, timeout = 4000) {
    return new Promise((resolve) => {
      const existing = document.querySelector(selector);
      if (existing) return resolve(existing);
      const start = Date.now();
      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        } else if (Date.now() - start > timeout) {
          observer.disconnect();
          resolve(null);
        }
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
      // Sécurité : timeout même sans mutation.
      setTimeout(() => {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }, timeout + 50);
    });
  }

  /**
   * Trouve la zone de saisie du prompt selon la cible.
   * @param {string} target
   * @returns {Promise<{el: Element, kind: "textarea"|"contenteditable"}>}
   */
  async function findPromptInput(target) {
    if (target === "stitch") {
      // Heuristique Stitch : textarea dont le placeholder contient "describe"
      // (insensible à la casse), à défaut un contenteditable.
      const ta = document.querySelector('textarea[placeholder*="describe" i]');
      if (ta) return { el: ta, kind: "textarea" };
      const ce = document.querySelector('div[contenteditable="true"]');
      if (ce) return { el: ce, kind: "contenteditable" };
      // Retry avec attente passive.
      const waited = await waitFor('textarea[placeholder*="describe" i], div[contenteditable="true"]');
      if (waited) {
        const kind = waited.tagName.toLowerCase() === "textarea" ? "textarea" : "contenteditable";
        return { el: waited, kind };
      }
      throw new Error("Zone de saisie Stitch introuvable.");
    }

    if (target === "deepseek") {
      const ta = document.querySelector("textarea");
      if (ta) return { el: ta, kind: "textarea" };
      const waited = await waitFor("textarea");
      if (waited) return { el: waited, kind: "textarea" };
      throw new Error("Zone de saisie DeepSeek introuvable.");
    }

    throw new Error(`Cible non supportée : ${target}`);
  }

  /**
   * Écrit le prompt dans un <textarea> en simulant une saisie utilisateur
   * (déclenche les events input/change nécessaires aux frameworks React/Vue).
   * @param {HTMLTextAreaElement} el
   * @param {string} text
   */
  function typeIntoTextarea(el, text) {
    // Focus + activation.
    el.focus();
    // Utilise le setter natif pour que React reconnaisse la mutation.
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value"
    );
    if (setter && setter.set) {
      setter.set.call(el, text);
    } else {
      el.value = text;
    }
    // Dispatche les events pour réveiller le framework UI.
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }

  /**
   * Écrit le prompt dans un contenteditable (Stitch fallback).
   * @param {HTMLElement} el
   * @param {string} text
   */
  function typeIntoContentEditable(el, text) {
    el.focus();
    // Efface le contenu existant.
    el.textContent = "";
    // Insère le texte via execCommand pour rester compatible avec les
    // éditeurs riches basés sur contenteditable.
    try {
      document.execCommand("insertText", false, text);
    } catch (e) {
      // Fallback : assignation directe.
      el.textContent = text;
      el.dispatchEvent(new InputEvent("input", { bubbles: true, data: text }));
    }
  }

  /**
   * Cherche puis clique le bouton d'envoi.
   * @param {string} target
   * @returns {{clicked: boolean, label: string}}
   */
  function clickSubmit(target) {
    // Sélecteurs candidats, du plus précis au plus générique.
    const candidates = [
      'button[type="submit"]',
      'button[aria-label*="Send" i]',
      'button[aria-label*="Envoyer" i]',
      'button[aria-label*="submit" i]',
      'button[data-testid*="send" i]',
      'button[title*="Send" i]',
      'button[title*="Envoyer" i]',
      // Stitch / DeepSeek utilisent souvent une icône ; le dernier bouton du
      // formulaire de saisie est en général celui d'envoi.
      'form button:last-of-type',
    ];

    for (const sel of candidates) {
      const btns = Array.from(document.querySelectorAll(sel)).filter(
        (b) => !b.disabled && b.offsetParent !== null
      );
      if (btns.length > 0) {
        const btn = btns[btns.length - 1];
        btn.click();
        return { clicked: true, label: sel };
      }
    }
    return { clicked: false, label: "(aucun bouton trouvé)" };
  }

  /**
   * Surligne brièvement un élément injecté pour feedback visuel.
   * @param {Element} el
   */
  function highlight(el) {
    try {
      el.classList.add("aios-stealth-highlight");
      setTimeout(() => {
        el.classList.remove("aios-stealth-highlight");
      }, 1800);
    } catch (e) {
      // noop
    }
  }

  /**
   * Effectue l'injection complète sur la page cible.
   * @param {{target: string, prompt: string}} req
   * @returns {{ok: boolean, message: string}}
   */
  async function performInjection(req) {
    const target = req.target || detectTarget();
    if (!target) {
      return {
        ok: false,
        message: "Cible non détectée sur cette page (URL non supportée).",
      };
    }

    // 1) Localisation de la zone de saisie.
    let inputInfo;
    try {
      inputInfo = await findPromptInput(target);
    } catch (e) {
      return { ok: false, message: e.message };
    }

    // 2) Saisie du prompt.
    try {
      if (inputInfo.kind === "textarea") {
        typeIntoTextarea(/** @type {HTMLTextAreaElement} */ (inputInfo.el), req.prompt);
      } else {
        typeIntoContentEditable(/** @type {HTMLElement} */ (inputInfo.el), req.prompt);
      }
      highlight(inputInfo.el);
    } catch (e) {
      return { ok: false, message: `Échec de la saisie : ${e.message}` };
    }

    // 3) Clic sur le bouton d'envoi.
    let submitResult;
    try {
      submitResult = clickSubmit(target);
    } catch (e) {
      return { ok: false, message: `Saisie OK, mais échec du clic submit : ${e.message}` };
    }

    if (!submitResult.clicked) {
      return {
        ok: true,
        message: `Prompt injecté dans la zone de saisie (${target}), mais aucun bouton d'envoi détecté — clique manuellement.`,
      };
    }
    return {
      ok: true,
      message: `Prompt injecté et bouton d'envoi cliqué (${target}, selecteur: ${submitResult.label}).`,
    };
  }

  // --- Listener des messages venant du popup ---
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (!msg || msg.type !== "STEALTH_BRIDGE_INJECT") {
      return false; // Message non géré : laisser les autres listeners traiter.
    }
    // Réponse asynchrone.
    performInjection({ target: msg.target, prompt: msg.prompt })
      .then(sendResponse)
      .catch((e) => {
        sendResponse({ ok: false, message: `Erreur inattendue : ${e.message}` });
      });
    return true; // Indique que sendResponse sera appelé de façon asynchrone.
  });

  // Petit marqueur de présence pour debug.
  console.debug("[AIOS Stealth Bridge] content script prêt sur", window.location.href);
})();
