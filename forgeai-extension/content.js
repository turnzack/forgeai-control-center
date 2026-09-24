/**
 * KIROV5 Orchestrator — Content Script
 * Base v16 : injection + Smart Capture v2 + HUD
 * + KIROV4 : bridge polling :5006/Vercel, target_ai filter, safeInterval,
 *            push GitHub auto, fetch override anti mixed-content, Claude
 */

(() => {
  if (window.__KIROV5_CS__) return;
  window.__KIROV5_CS__ = true;

  const CONFIG = {
    CAPTURE_CHECK_INTERVAL: 2500,
    CAPTURE_TIMEOUT: 300000,
    MIN_RESPONSE_LENGTH: 200,
    STABLE_CHECKS_REQUIRED: 3,
    POST_GENERATION_COOLDOWN: 8000,
    MIN_FILES_REQUIRED: 1,
    CONTENT_DROP_THRESHOLD: 0.5,
    BRIDGE_SERVER: "http://127.0.0.1:5006",
    BRIDGE_FALLBACK: "http://127.0.0.1:8765",
    BRIDGE_VERCEL: "https://forge-kohl-kappa.vercel.app",
    POLLING_INTERVAL: 2500,
    VERSION: "5.1.2-AIOS",
  };

  let isBusy = false;
  let isBridgeProcessing = false;
  let bridgeEnabled = true;

  /* ── Logger ── */
  const Log = {
    info: (...a) => console.log("%c[KIROV5]", "color:#06b6d4;font-weight:bold", ...a),
    warn: (...a) => console.warn("[KIROV5]", ...a),
    error: (...a) => console.error("[KIROV5]", ...a),
    success: (...a) => console.log("%c[KIROV5] ✅", "color:#10b981;font-weight:bold", ...a),
  };

    /* ── Mouchard (Logger interne avec Masquage / Réouverture) ── */
  function addMouchardLog(message, type = "info") {
    let container = document.getElementById("kirov5-mouchard");
    let miniBtn = document.getElementById("kirov5-mouchard-mini");

    if (!miniBtn) {
      miniBtn = document.createElement("div");
      miniBtn.id = "kirov5-mouchard-mini";
      miniBtn.title = "Afficher le Mouchard Kirov5 (Raccourci: Alt+M)";
      miniBtn.innerText = "🕵️";
      miniBtn.style.cssText = `
        position: fixed !important; top: 20px !important; right: 20px !important; z-index: 2147483647 !important;
        background: rgba(15,23,42,0.92) !important; color: #38bdf8 !important; border: 1px solid #334155 !important;
        width: 34px !important; height: 34px !important; border-radius: 50% !important;
        display: none !important; align-items: center !important; justify-content: center !important;
        cursor: pointer !important; box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
        font-size: 16px !important; user-select: none !important; backdrop-filter: blur(8px) !important;
        transition: transform 0.2s, background 0.2s !important;
      `;
      miniBtn.onmouseenter = () => { miniBtn.style.transform = "scale(1.15)"; miniBtn.style.background = "#1e293b"; };
      miniBtn.onmouseleave = () => { miniBtn.style.transform = "scale(1)"; miniBtn.style.background = "rgba(15,23,42,0.92)"; };
      miniBtn.onclick = () => {
        const c = document.getElementById("kirov5-mouchard");
        if (c) c.style.display = "flex";
        miniBtn.style.display = "none";
        try { sessionStorage.setItem("kirov5_mouchard_hidden", "false"); } catch(_) {}
      };
      (document.body || document.documentElement).appendChild(miniBtn);

      // Raccourci clavier universel Alt + M pour masquer / afficher
      window.addEventListener("keydown", (e) => {
        if (e.altKey && (e.key === "m" || e.key === "M")) {
          e.preventDefault();
          const c = document.getElementById("kirov5-mouchard");
          const m = document.getElementById("kirov5-mouchard-mini");
          if (c) {
            const isHidden = c.style.display === "none";
            c.style.display = isHidden ? "flex" : "none";
            if (m) m.style.display = isHidden ? "none" : "flex";
            try { sessionStorage.setItem("kirov5_mouchard_hidden", isHidden ? "false" : "true"); } catch(_) {}
          }
        }
      });
    }

    if (!container) {
      container = document.createElement("div");
      container.id = "kirov5-mouchard";
      
      const isInitiallyHidden = (() => {
        try { return sessionStorage.getItem("kirov5_mouchard_hidden") === "true"; } catch(_) { return false; }
      })();

      container.style.cssText = `
        position: fixed !important; top: 20px !important; right: 20px !important; z-index: 2147483647 !important;
        background: rgba(15,23,42,0.95) !important; color: #e2e8f0 !important; 
        width: 340px !important; max-height: 400px !important; display: ${isInitiallyHidden ? "none" : "flex"} !important; flex-direction: column !important;
        border-radius: 12px !important; font: 11px/1.4 'Fira Code', monospace !important;
        border: 1px solid #334155 !important; box-shadow: 0 8px 32px rgba(0,0,0,0.5) !important;
        backdrop-filter: blur(12px) !important; overflow: hidden !important; pointer-events: auto !important;
      `;

      if (isInitiallyHidden && miniBtn) {
        miniBtn.style.display = "flex";
      }

      const header = document.createElement("div");
      header.style.cssText = `
        padding: 8px 12px; background: #1e293b; font-weight: bold; color: #38bdf8;
        border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center;
        user-select: none;
      `;
      header.innerHTML = `
        <span style="display:flex;align-items:center;gap:6px;cursor:pointer;" id="m-title">🕵️ Mouchard Kirov5</span>
        <div style="display:flex;align-items:center;gap:10px;">
          <span id="m-clear" title="Vider les logs" style="cursor:pointer;opacity:0.7;font-size:12px;">🗑️</span>
          <span id="m-toggle" title="Réduire / Déplier" style="cursor:pointer;font-size:12px;">▼</span>
          <span id="m-close" title="Masquer la fenêtre (Alt+M)" style="cursor:pointer;color:#f87171;font-weight:bold;font-size:15px;line-height:1;padding:0 2px;">✕</span>
        </div>
      `;

      const logsArea = document.createElement("div");
      logsArea.id = "kirov5-mouchard-logs";
      logsArea.style.cssText = `
        padding: 8px 12px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 4px;
      `;

      // Déplier / replier avec clic sur titre ou toggle
      const toggleFn = () => {
        const isHidden = logsArea.style.display === "none";
        logsArea.style.display = isHidden ? "flex" : "none";
        const tog = header.querySelector("#m-toggle");
        if (tog) tog.innerText = isHidden ? "▼" : "▲";
      };
      header.querySelector("#m-title").onclick = toggleFn;
      header.querySelector("#m-toggle").onclick = toggleFn;

      // Vider les logs
      header.querySelector("#m-clear").onclick = (e) => {
        e.stopPropagation();
        logsArea.innerHTML = "";
      };

      // Fermer / masquer la fenêtre
      header.querySelector("#m-close").onclick = (e) => {
        e.stopPropagation();
        container.style.display = "none";
        if (miniBtn) miniBtn.style.display = "flex";
        try { sessionStorage.setItem("kirov5_mouchard_hidden", "true"); } catch(_) {}
      };

      container.appendChild(header);
      container.appendChild(logsArea);
      if (document.body) {
        document.body.appendChild(container);
      } else {
        document.documentElement.appendChild(container);
      }
    }

    const logsArea = document.getElementById("kirov5-mouchard-logs");
    if (logsArea) {
      const logItem = document.createElement("div");
      const colors = { info: "#94a3b8", success: "#34d399", error: "#f87171", warn: "#fbbf24", debug: "#818cf8" };
      logItem.style.color = colors[type] || colors.info;
      logItem.innerText = `[${new Date().toLocaleTimeString().split(' ')[0]}] ${message}`;

      logsArea.appendChild(logItem);
      logsArea.scrollTop = logsArea.scrollHeight;
    }
  }

  function contentLog(message, level) {
    try {
      addMouchardLog(message, level);
      if (typeof chrome !== "undefined" && chrome.runtime?.id) {
        chrome.runtime.sendMessage({ type: "CONTENT_LOG", message, level: level || "info" }).catch(() => { });
      }
    } catch (_) { }
  }

  /* ── safeInterval — protection invalidation d'extension (KIROV4) ── */
  function safeInterval(fn, delay) {
    const id = setInterval(async () => {
      try {
        if (typeof chrome !== "undefined" && chrome.runtime?.id) {
          await fn();
        } else {
          clearInterval(id);
        }
      } catch (e) {
        if (e?.message?.includes("Extension context invalidated")) {
          clearInterval(id);
        }
      }
    }, delay);
    return id;
  }

  /* ── Fetch override (anti mixed-content → proxy BG) ── */
  const originalFetch = window.fetch.bind(window);
  window.fetch = async function (resource, config) {
    const url =
      typeof resource === "string"
        ? resource
        : resource instanceof Request
          ? resource.url
          : "";
    const isBridge =
      url &&
      (url.includes("127.0.0.1:5006") ||
        url.includes("localhost:5006") ||
        url.includes("forge-kohl-kappa.vercel.app"));
    if (isBridge && typeof chrome !== "undefined" && chrome.runtime?.sendMessage) {
      return new Promise((resolve, reject) => {
        try {
          chrome.runtime.sendMessage(
            { type: "FETCH", url, options: config || {} },
            (response) => {
              if (chrome.runtime.lastError || !response || (response.success === false && response.ok === false)) {
                if (response && response.error) {
                  reject(new Error(response.error));
                  return;
                }
                originalFetch(resource, config).then(resolve).catch(reject);
                return;
              }
              const resObj = response.result || response;
              const bodyData = resObj.data !== undefined ? resObj.data : response.body;
              resolve({
                ok: resObj.ok !== undefined ? resObj.ok : (response.ok !== undefined ? response.ok : true),
                status: resObj.status || response.status || 200,
                text: async () => resObj.text || (typeof bodyData === 'string' ? bodyData : JSON.stringify(bodyData || {})),
                json: async () => typeof bodyData === 'object' ? bodyData : JSON.parse(bodyData || "{}"),
              });
            }
          );
        } catch (e) {
          originalFetch(resource, config).then(resolve).catch(reject);
        }
      });
    }
    return originalFetch(resource, config);
  };

  /* ── Platform detection (+ DeepSeek, Qwen, ChatGPT, Claude, Gemini, Kimi, Perplexity) ── */
  const PlatformDetector = {
    detect() {
      const host = location.hostname.toLowerCase();
      if (host.includes("deepseek")) {
        return {
          name: "deepseek",
          textareaSelector:
            '#chat-input, textarea#chat-input, div#chat-input, textarea[placeholder*="Message" i], textarea[placeholder*="DeepSeek" i], div[contenteditable="true"], .ds-input, textarea',
          sendButtonSelector:
            'div[role="button"]:not([aria-disabled="true"]), button[type="submit"], .ds-icon-button, button.send-button, div[class*="send"], button[aria-label*="Send" i]',
        };
      }
      if (host.includes("chatgpt") || host.includes("openai.com")) {
        return {
          name: "chatgpt",
          textareaSelector:
            '#prompt-textarea, div[contenteditable="true"][id="prompt-textarea"], div[contenteditable="true"], textarea',
          sendButtonSelector:
            'button[data-testid="send-button"], button[aria-label*="Send" i], button[aria-label*="Envoyer" i], button[type="submit"]',
        };
      }
      if (host.includes("gemini")) {
        return {
          name: "gemini",
          textareaSelector:
            'rich-textarea div[contenteditable="true"], rich-textarea, div[contenteditable="true"], textarea',
          sendButtonSelector:
            'button[aria-label*="Send" i], button[aria-label*="Envoyer" i], button[mattooltip*="Send" i], button.send-button',
        };
      }
      if (host.includes("qwen")) {
        return {
          name: "qwen",
          textareaSelector: 'textarea, div[contenteditable="true"], .qwen-input, [role="textbox"]',
          sendButtonSelector:
            'button[type="submit"], button[aria-label*="Send" i], button[aria-label*="Envoyer" i], button:has(svg), div[role="button"]:has(svg)',
        };
      }
      if (host.includes("kimi") || host.includes("moonshot")) {
        return {
          name: "kimi",
          textareaSelector: 'div[contenteditable="true"], textarea, [role="textbox"]',
          sendButtonSelector:
            'button[aria-label*="send" i], button[aria-label*="envoyer" i], .send-button, div[role="button"]:has(svg)',
        };
      }
      if (host.includes("claude")) {
        return {
          name: "claude",
          textareaSelector: 'div[contenteditable="true"], .ProseMirror, [role="textbox"]',
          sendButtonSelector:
            'button[aria-label*="Send" i], button[aria-label*="Envoyer" i], button[type="submit"]',
        };
      }
      if (host.includes("perplexity")) {
        return {
          name: "perplexity",
          textareaSelector: 'textarea, div[contenteditable="true"]',
          sendButtonSelector:
            'button[aria-label*="Submit" i], button[aria-label*="Send" i], button:has(svg)',
        };
      }
      if (host.includes("stitch.withgoogle.com") || host.includes("stitch") || host.includes("withgoogle.com") || host.includes("appspot")) {
        return {
          name: "stitch",
          textareaSelector: 'textarea, [role="textbox"], [contenteditable="true"], textarea[placeholder*="message" i], textarea[aria-label*="message" i], textarea[placeholder*="prompt" i], textarea[placeholder*="describe" i], textarea[placeholder*="create" i], #chat-input',
          sendButtonSelector: 'button[aria-label*="send" i], button[aria-label*="generate" i], button[aria-label*="envoyer" i], button[type="submit"], div[role="button"][aria-label*="send" i], button:has(svg), button.send-button, [class*="send"]',
        };
      }
      if (host.includes("notebooklm.google.com") || host.includes("notebook.google.com") || host.includes("notebooklm")) {
        return {
          name: "notebooklm",
          textareaSelector: 'textarea, [role="textbox"], [contenteditable="true"], .textarea',
          sendButtonSelector: 'button[aria-label*="send" i], button[aria-label*="Envoyer" i], button[aria-label*="Submit" i], .send-button, div[role="button"]:has(svg)',
        };
      }
      return {
        name: "unknown",
        textareaSelector: '#chat-input, textarea, div[contenteditable="true"]',
        sendButtonSelector: 'button[type="submit"], button, div[role="button"]',
      };
    },
  };

  /* ── DOM helpers ── */
  function isElementVisible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).visibility !== 'hidden' && window.getComputedStyle(el).display !== 'none';
  }

  function searchRootForTextarea(root, platform) {
    const exactId = root.querySelector('#chat-input, #prompt-textarea, textarea#chat-input, textarea#prompt-textarea');
    if (exactId && isElementVisible(exactId)) return exactId;

    const els = root.querySelectorAll(platform.textareaSelector);
    for (const el of els) {
      const placeholder = (el.getAttribute('placeholder') || '').toLowerCase();
      const ariaLabel = (el.getAttribute('aria-label') || '').toLowerCase();

      if (placeholder.includes('rechercher') || placeholder.includes('search') || ariaLabel.includes('search')) continue;

      if (
        el.id === 'chat-input' ||
        el.id === 'prompt-textarea' ||
        el.tagName === 'TEXTAREA' ||
        el.tagName === 'INPUT' ||
        el.isContentEditable ||
        el.getAttribute('role') === 'textbox' ||
        el.getAttribute('contenteditable') === 'true'
      ) {
        if (isElementVisible(el)) return el;
      }
      const inner = el.querySelector('#chat-input, #prompt-textarea, [contenteditable="true"], textarea, input, [role="textbox"]');
      if (inner && isElementVisible(inner)) return inner;
    }

    const fallbacks = root.querySelectorAll('textarea, [contenteditable="true"], [role="textbox"], input[type="text"], #chat-input, #prompt-textarea');
    for (const fb of fallbacks) {
      const ph = (fb.getAttribute('placeholder') || '').toLowerCase();
      const al = (fb.getAttribute('aria-label') || '').toLowerCase();
      if (ph.includes('search') || ph.includes('rechercher') || al.includes('search')) continue;
      if (isElementVisible(fb)) return fb;
    }

    // EXTREME FALLBACK: Any element that is contenteditable, even without role="textbox"
    const extremeFallbacks = root.querySelectorAll('[contenteditable="plaintext-only"], [contenteditable="true"]');
    for (const fb of extremeFallbacks) {
      if (isElementVisible(fb)) return fb;
    }

    return null;
  }

  function findAllShadowRoots(node, roots = []) {
    const all = node.querySelectorAll('*');
    for (const el of all) {
      if (el.shadowRoot) {
        roots.push(el.shadowRoot);
        findAllShadowRoots(el.shadowRoot, roots);
      }
    }
    return roots;
  }

  function findTextarea() {
    const platform = PlatformDetector.detect();
    const docs = [document];
    const iframes = document.querySelectorAll("iframe");
    for (const iframe of iframes) {
      try {
        if (iframe.contentDocument) docs.push(iframe.contentDocument);
      } catch (_) { }
    }

    for (const doc of docs) {
      let found = searchRootForTextarea(doc, platform);
      if (found) return found;

      const roots = findAllShadowRoots(doc);
      for (const shadow of roots) {
        found = searchRootForTextarea(shadow, platform);
        if (found) return found;
      }
    }
    return null;
  }

  function findSendButton() {
    const platform = PlatformDetector.detect();
    const candidates = document.querySelectorAll(platform.sendButtonSelector);
    for (const el of candidates) {
      if (el.disabled && el.tagName === "BUTTON") continue;
      return el;
    }
    const area = findTextarea();
    if (area) {
      const parent = area.closest("form, div, section, body") || document.body;
      const btns = parent.querySelectorAll('button, div[role="button"], .ds-icon-button, [class*="send"]');
      for (const b of btns) {
        const label = (b.getAttribute("aria-label") || b.title || b.textContent || b.className || "").toLowerCase();
        if (/send|envoyer|submit|arrow|ds-icon/i.test(label)) return b;
      }
    }
    return document.querySelector('div[role="button"]:not([aria-disabled="true"]), button[type="submit"]');
  }

  function isGenerating() {
    const stopBtn = document.querySelector(
      'button[aria-label*="Stop" i], button[aria-label*="Arrêter" i], button[aria-label*="Stop generating" i], div[role="button"][aria-label*="Stop" i], .ds-stop-button, [class*="stop-generating"], button[class*="stopButton"], [class*="stop-btn"], [aria-label*="Cancel" i], .button-stop'
    );
    if (stopBtn && (stopBtn.offsetParent !== null || stopBtn.getClientRects().length)) return true;
    const spinner = document.querySelector(
      '.ds-spinner, .generating, [class*="loading-dots"], message-processing, [class*="Spinner"], [aria-busy="true"], .typing-indicator, [class*="typing"]'
    );
    if (spinner && (spinner.offsetParent !== null || spinner.getClientRects().length)) return true;
    
    const sendBtn = findSendButton();
    if (sendBtn && sendBtn.querySelector('rect')) return true;

    if (sendBtn && (sendBtn.disabled || sendBtn.getAttribute('aria-disabled') === 'true')) {
        const ta = findTextarea();
        if (ta && (ta.value || ta.innerText).trim().length === 0) return true;
    }
    
    return false;
  }

  function getLastAssistantElement() {
    const host = location.hostname;

    // ── DeepSeek : prendre le DERNIER élément IA (le plus récent dans le DOM) ──
    // On NE prend PAS le plus grand : sinon le lot 2 ne serait jamais capturé
    // tant qu'il n'a pas dépassé la taille du lot 1.
    if (host.includes("deepseek")) {
      const dsSelectors = [
        ".ds-markdown",
        "[class*='ds-markdown']",
        ".markdown-body",
        "[class*='markdown']",
        "[class*='message-content']",
        "[class*='chat-message']",
        "[class*='reply']",
      ];
      for (const sel of dsSelectors) {
        try {
          const found = Array.from(document.querySelectorAll(sel));
          if (!found.length) continue;
          // ← DERNIER élément avec du contenu (= réponse en cours ou la plus récente)
          const withContent = found.filter(e => (e.textContent || "").length > 50);
          if (withContent.length) return withContent[withContent.length - 1];
        } catch (_) { }
      }
    }

    // ── NotebookLM / Gemini Notebook ──
    if (host.includes("notebooklm") || host.includes("notebook.google.com")) {
      const nlSelectors = [
        "chat-message",
        ".chat-message",
        "[class*='message-content']",
        "[class*='response']",
        ".markdown-body",
        "div[dir='auto']"
      ];
      for (const sel of nlSelectors) {
        try {
          const found = Array.from(document.querySelectorAll(sel));
          if (!found.length) continue;
          const withContent = found.filter(e => (e.textContent || "").length > 50);
          if (withContent.length) return withContent[withContent.length - 1];
        } catch (_) { }
      }
    }

    // ── Autres plateformes ──
    const selectors = [
      ".markdown-body",
      "div.ds-markdown",
      "message-content",
      "model-response",
      "response-message",
      '[data-message-author-role="assistant"]',
      '[data-role="assistant"]',
      ".prose",
      ".msh-markdown",
      '[class*="markdown"]',
      '[class*="MessageContent"]',
      '[class*="assistant"]',
      "div[dir='auto']",
    ];
    let els = [];
    for (const sel of selectors) {
      try {
        const found = document.querySelectorAll(sel);
        if (found.length) els = Array.from(found);
      } catch (_) { }
    }
    if (!els.length) {
      els = Array.from(
        document.querySelectorAll('[class*="message"], [class*="bubble"], [class*="response"]')
      );
    }

    // ── Fallback AGRESSIF : plus grand bloc de texte visible ──
    if (!els.length) {
      const allDivs = Array.from(document.querySelectorAll("div, article, section, main"));
      let best = null, max = 0;
      for (const d of allDivs) {
        const n = (d.textContent || "").length;
        if (n > max && n < 500000) { max = n; best = d; }
      }
      if (best && max > 200) return best;
      return null;
    }

    const withFiles = els.filter(
      (e) =>
        e.textContent &&
        (e.textContent.includes('"path"') ||
          e.textContent.includes("Fichier:") ||
          e.textContent.includes('"status"') ||
          e.textContent.length > 200)
    );
    if (withFiles.length) return withFiles[withFiles.length - 1];
    if (els.length) return els[els.length - 1];
    return null;
  }

  function extractContent(el) {
    if (!el) return "";
    try {
      const inner = el.innerText || "";
      const text = el.textContent || "";
      let res = (text.length > inner.length * 1.2) ? text.trim() : (inner || text).trim();
      return res.replace(/(?:⚪|\||▋)$/, "").trim();
    } catch {
      let t = (el.textContent || "").trim();
      return t.replace(/(?:⚪|\||▋)$/, "").trim();
    }
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function sha256(t) {
    const b = new TextEncoder().encode(t);
    const h = await crypto.subtle.digest("SHA-256", b);
    return Array.from(new Uint8Array(h))
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("");
  }

  /* ── Inject prompt ── */
  async function injectPrompt(prompt) {
    let textarea = null;
    for (let retry = 0; retry < 60; retry++) {
      textarea = findTextarea();
      if (textarea && isElementVisible(textarea)) break;
      await sleep(250);
    }
    if (!textarea) {
      Log.error("Textarea introuvable sur", location.hostname);
      return false;
    }
    textarea.focus();
    await sleep(150);

    if (textarea.tagName === "TEXTAREA" || textarea.tagName === "INPUT") {
      const proto = window.HTMLTextAreaElement.prototype;
      const desc = Object.getOwnPropertyDescriptor(proto, "value");
      if (desc && desc.set) desc.set.call(textarea, prompt);
      else textarea.value = prompt;
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      textarea.dispatchEvent(new Event("change", { bubbles: true }));
      try {
        textarea.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: prompt }));
      } catch (_) { }
    } else {
      textarea.focus();
      
      // FORCE CLEAR AVANT PASTE POUR ÉVITER LA CONCATÉNATION
      try {
        textarea.innerHTML = "";
        textarea.innerText = "";
        textarea.textContent = "";
      } catch (_) {}
      
      try {
        const dataTransfer = new DataTransfer();
        dataTransfer.setData("text/plain", prompt);
        const pasteEvent = new ClipboardEvent("paste", {
          clipboardData: dataTransfer,
          bubbles: true,
          cancelable: true,
        });
        textarea.dispatchEvent(pasteEvent);
      } catch (e) {
        Log.warn("ClipboardEvent paste failed", e);
      }

      await sleep(150);

      // Fallback execCommand
      if ((textarea.innerText || textarea.textContent || "").trim().length < 5) {
        try {
          const sel = window.getSelection();
          if (sel) {
            const range = document.createRange();
            range.selectNodeContents(textarea);
            sel.removeAllRanges();
            sel.addRange(range);
            document.execCommand("delete", false, null);
            document.execCommand("insertText", false, prompt);
          }
        } catch (e) {
          Log.warn("execCommand fallback failed", e);
        }
      }

      // Hard fallback
      if ((textarea.innerText || textarea.textContent || "").trim().length < 5) {
        textarea.innerText = prompt;
        textarea.textContent = prompt;
      }

      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      textarea.dispatchEvent(new Event("change", { bubbles: true }));
      try {
        textarea.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: prompt }));
      } catch (_) { }
    }

    await sleep(400);
    const contentCheck = (textarea.value || textarea.innerText || textarea.textContent || "").trim();
    if (contentCheck.length < 5) {
      Log.error("L'injection de texte a échoué silencieusement (champ vide).");
      return false;
    }

    let sendBtn = null;
    for (let i = 0; i < 10; i++) {
      await sleep(300);
      sendBtn = findSendButton();
      if (sendBtn) {
        sendBtn.removeAttribute("disabled");
        sendBtn.removeAttribute("aria-disabled");
        break;
      }
    }

    if (sendBtn) {
      sendBtn.removeAttribute("disabled");
      sendBtn.removeAttribute("aria-disabled");
      try { sendBtn.click(); } catch (_) { }
      sendBtn.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
      Log.info("Bouton Send cliqué");
      return true;
    }

    Log.warn("Send introuvable — fallback Enter");
    const target = findTextarea() || textarea;
    target.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true,
      })
    );
    return true;
  }

  /* ── Smart Capture v2 ── */
  function isJsonBalanced(content) {
    if (!content) return false;
    let json = content.trim();
    const fence = json.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fence) json = fence[1].trim();
    let braces = 0,
      brackets = 0,
      inString = false,
      escape = false;
    for (let i = 0; i < json.length; i++) {
      const c = json[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (c === "\\") {
        escape = true;
        continue;
      }
      if (c === '"') {
        inString = !inString;
        continue;
      }
      if (inString) continue;
      if (c === "{") braces++;
      else if (c === "}") braces--;
      else if (c === "[") brackets++;
      else if (c === "]") brackets--;
    }
    return braces === 0 && brackets === 0;
  }

  function countFilesInJson(content) {
    if (!content) return 0;
    const m = content.match(/"path"\s*:/g);
    return m ? m.length : 0;
  }

  async function waitForFullResponse(opts = {}) {
    const minLength = opts.minLength || CONFIG.MIN_RESPONSE_LENGTH;
    const minFiles = opts.minFiles || 0;
    const timeout = opts.timeout || CONFIG.CAPTURE_TIMEOUT;
    const lastKnownText = opts.lastKnownText || "";

    Log.info("Attente démarrage génération...");
    let started = false;
    for (let i = 0; i < 60; i++) {
      await sleep(400);
      if (isGenerating()) {
        started = true;
        break;
      }
      const el = getLastAssistantElement();
      const t = el ? extractContent(el) : "";
      // On considère que la génération a démarré si le contenu est clairement
      // NOUVEAU par rapport à l'ancienne réponse (et non juste le même lot précédent)
      const isNewContent = lastKnownText.length === 0
        ? t.length > 50
        : t.length > lastKnownText.length + 200 &&
        !t.startsWith(lastKnownText.substring(0, Math.min(200, lastKnownText.length)));
      if (isNewContent) {
        started = true;
        break;
      }
    }
    if (started) Log.info("Génération démarrée");
    else Log.warn("Génération non détectée — capture quand même");

    const startTime = Date.now();
    let previousContent = "";
    let previousLen = 0;
    let maxLenSeen = 0;
    let stableCount = 0;
    let checkNum = 0;
    let generationEndedAt = null;

    while (Date.now() - startTime < timeout) {
      await sleep(CONFIG.CAPTURE_CHECK_INTERVAL);
      checkNum++;
      let generating = isGenerating();
      const lastEl = getLastAssistantElement();
      const currentContent = lastEl ? extractContent(lastEl) : "";
      const currentLen = currentContent.length;

      if (currentLen > maxLenSeen) maxLenSeen = currentLen;

      if (maxLenSeen > 1000 && currentLen < maxLenSeen * CONFIG.CONTENT_DROP_THRESHOLD) {
        Log.warn(`Chute contenu: ${currentLen} < ${maxLenSeen}`);
        stableCount = 0;
        generationEndedAt = null;
        maxLenSeen = currentLen;
      }

      // ── Logique stableCount multi-lots ──
      // Si on est encore sur l'ancienne réponse (lastKnownText),
      // on ne commence PAS à compter les checks stables — on attend
      // que le nouveau contenu soit clairement différent (> 300 chars de plus).
      const isStillOldContent = lastKnownText.length > 0 &&
        currentLen <= lastKnownText.length + 300 &&
        currentContent.startsWith(lastKnownText.substring(0, Math.min(200, lastKnownText.length)));

      if (isStillOldContent) {
        stableCount = 0; // Pas encore la nouvelle réponse
      } else if (!generating && currentLen === previousLen && currentLen > 0) {
        stableCount++;
      } else if (currentLen !== previousLen) {
        stableCount = 0;
      }

      if (stableCount > 12 && generating && currentLen > minLength) {
        Log.warn("Texte stable mais generating=true — forçage arrêt");
        generating = false;
      }

      if (generating) generationEndedAt = null;
      else if (generationEndedAt === null && currentLen > 0) generationEndedAt = Date.now();

      previousContent = currentContent;
      previousLen = currentLen;

      const fileCount = countFilesInJson(currentContent);
      const jsonOk = isJsonBalanced(currentContent);

      if (checkNum % 2 === 0) {
        Log.info(
          `Check #${checkNum}: gen=${generating} len=${currentLen} stable=${stableCount}/${CONFIG.STABLE_CHECKS_REQUIRED} files=${fileCount} json=${jsonOk}`
        );
      }

      if (generating) continue;
      if (
        generationEndedAt &&
        Date.now() - generationEndedAt < CONFIG.POST_GENERATION_COOLDOWN
      ) {
        continue;
      }
      if (currentLen < minLength) continue;
      if (minFiles > 0 && fileCount < minFiles && currentLen < minLength * 3) continue;
      if (stableCount < CONFIG.STABLE_CHECKS_REQUIRED) continue;
      if (currentContent.includes("{") && !jsonOk && stableCount < 10) continue;

      Log.success(`Capture OK — ${currentLen} chars, ${fileCount} files`);
      return currentContent;
    }

    if (previousLen >= minLength) {
      Log.warn(`Timeout — capture partielle (${previousLen} chars)`);
      return previousContent;
    }
    Log.error("Timeout — aucune réponse");
    return null;
  }

  /* ── Parse / fix files (KIROV5.1.1 — React extensions préservées) ── */
  const FORBIDDEN_FILES = new Set(["package.js", "tsconfig.js", "App.ts", "main.js"]);

  const LANG_TO_EXT = {
    typescript: "ts", ts: "ts", tsx: "tsx",
    javascript: "js", js: "js", jsx: "jsx",
    html: "html", css: "css", json: "json",
    markdown: "md", md: "md", yaml: "yaml", yml: "yml",
  };

  const CANONICAL = {
    "index.html": "index.html",
    "package.json": "package.json",
    "tsconfig.json": "tsconfig.json",
    "vite.config.ts": "vite.config.ts",
    "vite.config.js": "vite.config.js",
    "tailwind.config.js": "tailwind.config.js",
    "postcss.config.js": "postcss.config.js",
    "readme.md": "README.md",
  };

  function inferExt(basename, content, dir) {
    const name = String(basename || "");
    const c = String(content || "");
    const d = String(dir || "").toLowerCase();
    const head = c.slice(0, 400);
    if (/<!doctype html|<html/i.test(c)) return "html";
    if (/^package$/i.test(name) || (c.trim().startsWith("{") && /"name"\s*:/.test(c))) return "json";
    if (/^tsconfig/i.test(name)) return "json";
    if (/^vite\.config$/i.test(name)) return "ts";
    if (/^tailwind\.config$/i.test(name) || /^postcss\.config$/i.test(name)) return "js";
    if (/^index$/i.test(name) && /@tailwind|@import|^\s*:root\s*\{/m.test(c)) return "css";
    if (
      /@tailwind\s+(base|components|utilities)/.test(c) ||
      (/^\s*[.#*a-z][\w-]*\s*\{/m.test(c) && !/^(import |export |const |function )/m.test(head))
    ) return "css";
    const hasJsx =
      /(?:return\s*\(?\s*|[=(:]\s*)<[A-Z][A-Za-z0-9]*[\s/>]/.test(c) ||
      /<\/[A-Za-z][A-Za-z0-9]*>/.test(c) ||
      /React\.createElement/.test(c) ||
      /\bcreateRoot\b|\bReactDOM\b/.test(c) ||
      /return\s+<[A-Za-z]/.test(c);
    if (/components|pages|layouts/i.test(d) || /^(App|main)$/i.test(name) || /^[A-Z][A-Za-z0-9]+$/.test(name))
      return "tsx";
    // hooks/store/utils/types → always .ts (ignore TS generics)
    if (/hooks|utils|store|services|types|lib|data/i.test(d) || /^use[A-Z]/.test(name))
      return "ts";
    if (hasJsx) return "tsx";
    if (/^(interface |type |enum |export type |import type )/m.test(c)) return "ts";
    if (/^import |^export |function |const /m.test(c)) return "ts";
    if (/^#\s/m.test(c)) return "md";
    return "ts";
  }

  function normalizePath(rawPath, content, language) {
    if (!rawPath) return rawPath;
    let path = String(rawPath).trim()
      .replace(/\\/g, "/").replace(/^\/+/, "").replace(/^\.\//, "")
      .replace(/\*\*/g, "").replace(/`/g, "").replace(/^["']|["']$/g, "")
      .replace(/[:\s]+$/, "");
    const segs = path.split("/");
    let base = segs.pop() || path;
    const dir = segs.join("/");
    const low = base.toLowerCase();
    if (CANONICAL[low]) {
      base = CANONICAL[low];
      return dir ? `${dir}/${base}` : base;
    }
    // Strip forced .txt
    if (/\.txt$/i.test(base)) base = base.replace(/\.txt$/i, "");
    const EXT_RE = /\.(tsx|ts|jsx|js|mjs|cjs|css|scss|html|json|md|yaml|yml|svg)$/i;
    if (EXT_RE.test(base)) {
      if (/\.ts$/i.test(base) && /<[A-Za-z]|<\/[A-Za-z]|from ['"]react['"]/.test(content || ""))
        base = base.replace(/\.ts$/i, ".tsx");
      return dir ? `${dir}/${base}` : base;
    }
    const lang = String(language || "").toLowerCase();
    let ext = LANG_TO_EXT[lang] || inferExt(base, content, dir);
    if (ext) base = `${base}.${ext}`;
    return dir ? `${dir}/${base}` : base;
  }

  function parseFiles(content) {
    if (!content) return [];
    const files = [];

    // 1) Fichier: path blocks
    const segs = content.split(/(?:Fichier|File)\s*:\s*/i);
    for (let i = 1; i < segs.length; i++) {
      const seg = segs[i];
      const lines = seg.split("\n");
      const path = lines[0].trim().replace(/\*\*/g, "").replace(/`/g, "");
      const f = seg.indexOf("```");
      const l = seg.lastIndexOf("```");
      if (f === -1 || l === f) continue;
      const nl = seg.substring(f).indexOf("\n");
      if (nl === -1) continue;
      const langMatch = seg.substring(f + 3, f + nl).trim();
      files.push({
        path,
        content: seg.substring(f + nl + 1, l).trim(),
        language: langMatch || undefined,
      });
    }
    if (files.length) return files;

    // 2) JSON {"files":[...]}
    let s = content.trim();
    const fm = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fm && /"files"\s*:|"path"\s*:/.test(fm[1])) s = fm[1].trim();

    try {
      const p = JSON.parse(s);
      if (p.files && Array.isArray(p.files)) return p.files;
      if (Array.isArray(p) && p[0]?.path) return p;
      if (typeof p.content === "string" && p.content.includes("path")) {
        const inner = parseFiles(p.content);
        if (inner.length) return inner;
      }
      if (p.content?.files) return p.content.files;
    } catch (_) { }

    // Brace-match extract of object containing "files"
    const filesKey = s.search(/"files"\s*:\s*\[/);
    if (filesKey !== -1) {
      let start = s.lastIndexOf("{", filesKey);
      for (let si = start; si >= 0; si = s.lastIndexOf("{", si - 1)) {
        let depth = 0, inStr = false, esc = false;
        for (let i = si; i < s.length; i++) {
          const c = s[i];
          if (esc) { esc = false; continue; }
          if (c === "\\") { esc = true; continue; }
          if (c === '"') { inStr = !inStr; continue; }
          if (inStr) continue;
          if (c === "{") depth++;
          else if (c === "}") {
            depth--;
            if (depth === 0) {
              try {
                const p = JSON.parse(s.slice(si, i + 1));
                if (p.files && Array.isArray(p.files)) return p.files;
              } catch (_) { }
              break;
            }
          }
        }
        if (si === 0) break;
      }
    }

    const fi = s.indexOf("{"), la = s.lastIndexOf("}");
    if (fi !== -1 && la > fi) {
      try {
        const p = JSON.parse(s.slice(fi, la + 1));
        if (p.files) return p.files;
        if (typeof p.content === "string") {
          const inner = parseFiles(p.content);
          if (inner.length) return inner;
        }
      } catch (_) { }
    }

    // 3) Regex individual file objects
    const re =
      /\{\s*"path"\s*:\s*"((?:[^"\\]|\\.)*)"\s*,\s*"content"\s*:\s*"((?:[^"\\]|\\.)*)"(?:\s*,\s*"language"\s*:\s*"((?:[^"\\]|\\.)*)")?\s*\}/g;
    let m;
    while ((m = re.exec(s)) !== null) {
      try {
        files.push({
          path: JSON.parse(`"${m[1]}"`),
          content: JSON.parse(`"${m[2]}"`),
          language: m[3] ? JSON.parse(`"${m[3]}"`) : undefined,
        });
      } catch (_) {
        files.push({
          path: m[1],
          content: m[2].replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\"/g, '"').replace(/\\\\/g, "\\"),
          language: m[3] || undefined,
        });
      }
    }
    if (files.length) return files;

    // 4) ```tsx src/App.tsx\n...```
    const fencePathRe =
      /```(\w+)?\s*(?:(?:file|path|title)=)?[`"]?([^\n`"]+\.[a-zA-Z0-9]+)[`"]?\s*\n([\s\S]*?)```/g;
    let fm2;
    while ((fm2 = fencePathRe.exec(content)) !== null) {
      const lang = fm2[1] || "";
      const p = fm2[2].trim();
      if (/^(json|javascript|typescript|tsx|jsx|html|css|bash|shell|yaml|yml|md|markdown)$/i.test(p))
        continue;
      files.push({ path: p, content: fm2[3], language: lang });
    }
    return files;
  }

  function fixFiles(files) {
    const seen = new Set(), out = [];
    for (let f of files || []) {
      let p = f.path;
      let c = f.content;
      if (!p || c == null) continue;
      p = normalizePath(p, c, f.language);
      const base = p.split("/").pop() || p;
      if (base === "Index.html") p = p.replace(/Index\.html$/, "index.html");
      if (base === "package.js" && String(c).trim().startsWith("{"))
        p = p.replace(/package\.js$/, "package.json");
      if (/^App\.ts$/i.test(base) && /<[A-Z]|from ['"]react['"]/i.test(c))
        p = p.replace(/App\.ts$/i, "App.tsx");
      if (/^main\.ts$/i.test(base) && /from ['"]react['"]|createRoot/i.test(c))
        p = p.replace(/main\.ts$/i, "main.tsx");
      if (p.endsWith(".vue") || FORBIDDEN_FILES.has(base)) continue;
      const fl = String(c).split("\n")[0];
      if (/^(html|javascript|typescript|tsx|jsx|css|json)\s*$/i.test(fl.trim()))
        c = String(c).split("\n").slice(1).join("\n");
      if (/\.(tsx|jsx|ts|js)$/i.test(p) && String(c).includes("BrowserRouter"))
        c = String(c).replace(/\bBrowserRouter\b/g, "HashRouter");
      if (p === "package.json" || p.endsWith("/package.json")) {
        try {
          const pkg = JSON.parse(c);
          if (pkg.type !== "module") pkg.type = "module";
          if (!pkg.scripts) pkg.scripts = {};
          if (!pkg.scripts.dev) pkg.scripts.dev = "vite";
          if (!pkg.scripts.build || (String(pkg.scripts.build).includes("tsc") && !String(pkg.scripts.build).includes("vite")))
            pkg.scripts.build = "vite build";
          c = JSON.stringify(pkg, null, 2);
        } catch (_) { }
      }
      if (!seen.has(p)) {
        seen.add(p);
        out.push({ ...f, path: p, content: c });
      }
    }
    return out;
  }

  /* ── HUD overlay ── */
  function showHud(message, type = "info") {
    let hud = document.getElementById("kirov5-hud");
    if (!hud) {
      hud = document.createElement("div");
      hud.id = "kirov5-hud";
      hud.style.cssText = `
        position:fixed; bottom:20px; right:20px; z-index:2147483647;
        background:rgba(15,23,42,0.95); color:#e2e8f0; padding:12px 16px;
        border-radius:12px; font:12px/1.4 system-ui,sans-serif;
        border:1px solid #06b6d4; box-shadow:0 8px 32px rgba(0,0,0,0.4);
        max-width:320px; backdrop-filter:blur(8px);
        transition:opacity .3s;
      `;
      document.documentElement.appendChild(hud);
    }
    const colors = { info: "#06b6d4", success: "#10b981", error: "#ef4444", warn: "#f59e0b" };
    hud.style.borderColor = colors[type] || colors.info;
    hud.innerHTML = `<div style="font-weight:700;color:${colors[type] || colors.info};margin-bottom:4px">⚡ KIROV5 v${CONFIG.VERSION}</div><div>${message}</div>`;
    hud.style.opacity = "1";
  }

  function hideHud(delay = 3000) {
    setTimeout(() => {
      const hud = document.getElementById("kirov5-hud");
      if (hud) hud.style.opacity = "0";
    }, delay);
  }

  /* ── Bridge helpers ── */
  function detectAiName() {
    const h = location.hostname.toLowerCase();
    if (h.includes("deepseek")) return "deepseek";
    if (h.includes("qwen")) return "qwen";
    if (h.includes("kimi") || h.includes("moonshot")) return "kimi";
    if (h.includes("gemini")) return "gemini";
    if (h.includes("claude")) return "claude";
    if (h.includes("chatgpt") || h.includes("openai.com")) return "chatgpt";
    if (h.includes("perplexity")) return "perplexity";
    if (h.includes("stitch") || h.includes("withgoogle.com") || h.includes("appspot")) return "stitch";
    if (h.includes("notebooklm.google.com") || h.includes("notebook.google.com") || h.includes("notebooklm")) return "notebooklm";
    return "unknown";
  }

  async function loadBridgeConfig() {
    try {
      if (typeof chrome === "undefined" || !chrome.runtime?.id) return;
      const r = await chrome.storage.local.get([
        "kirov_bridge_url",
        "kirov_bridge_vercel",
        "kirov_bridge_enabled",
        "kirov_bridge_interval",
      ]);
      if (r.kirov_bridge_url) CONFIG.BRIDGE_SERVER = r.kirov_bridge_url;
      if (r.kirov_bridge_vercel) CONFIG.BRIDGE_VERCEL = r.kirov_bridge_vercel;
      if (r.kirov_bridge_enabled === false) bridgeEnabled = false;
      else bridgeEnabled = true;
      if (r.kirov_bridge_interval) CONFIG.POLLING_INTERVAL = r.kirov_bridge_interval;
    } catch (_) { }
  }
  async function proxyFetch(url, options = {}) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          type: "FETCH",
          url,
          options: {
            method: options.method,
            headers: options.headers,
            body: options.body
          }
        },
        (res) => {
          if (!res) return reject(new Error("No response from SW"));
          if (!res.success) return reject(new Error(res.error || "Fetch failed"));
          resolve({
            ok: res.result.ok,
            status: res.result.status,
            json: async () => res.result.data || JSON.parse(res.result.text),
            text: async () => res.result.text,
          });
        }
      );
    });
  }

  async function sendBridgeCallback(content, projectId, files = null) {
    try {
      // 1. Envoyer au callback principal pour avancement du batch
      const res = await proxyFetch(`${CONFIG.BRIDGE_SERVER}/v1/bridge/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, response: content, is_final: true, project_id: projectId, files }),
      });
      const result = await res.json();

      // 2. Envoyer aussi vers /api/extension/capture si on a des fichiers (stockage local garanti)
      if (files && Array.isArray(files) && files.length > 0) {
        try {
          await proxyFetch(`${CONFIG.BRIDGE_SERVER}/api/extension/capture`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ project_id: projectId, files, phase_num: 1 }),
          });
          Log.success(`/api/extension/capture → ${files.length} fichiers sauvegardés sur disque`);
        } catch (capErr) {
          Log.error("extension/capture failed:", capErr.message);
        }
      }

      return result;
    } catch (e) {
      Log.error("sendCallback failed:", e.message);
      return null;
    }
  }


  const SILENCE = `
SILENCE ABSOLU — RÈGLE S1:
- UNIQUEMENT du JSON valide {"files":[{"path":"...","content":"...","language":"..."}]}
- Aucun texte conversationnel, aucune explication
`;

  async function pollForPrompt() {
    if (isBridgeProcessing || isBusy || !bridgeEnabled) return;

    // Heartbeat pour s'assurer que le Mouchard survit au refresh React
    addMouchardLog("📡 Polling en cours...", "info");

    try {
      let data = null;
      try {
        const currentAi = detectAiName();
        const serversToTry = [CONFIG.BRIDGE_SERVER];
        if (CONFIG.BRIDGE_FALLBACK && CONFIG.BRIDGE_FALLBACK !== CONFIG.BRIDGE_SERVER) {
          serversToTry.push(CONFIG.BRIDGE_FALLBACK);
        }
        let fetchSuccess = false;
        for (const srv of serversToTry) {
          try {
            const pollUrl = `${srv}/v1/bridge/poll?target_ai=${encodeURIComponent(currentAi)}`;
            const r = await proxyFetch(pollUrl, { method: "GET" });
            if (r && r.ok) {
              fetchSuccess = true;
              CONFIG.BRIDGE_SERVER = srv;
              const d = await r.json();
              const pData = d.data || d;
              if (pData && pData.prompt) {
                console.log(`[KIROV5 BRIDGE] 🎉 PROMPT REÇU POUR INJECTION (${currentAi}) ! Projet: ${pData.project_id || 'KIKI'}`);
                addMouchardLog(`🎉 PROMPT DÉTECTÉ (${pData.project_id}) !`, "success");
                data = pData;
              }
              break;
            }
          } catch (_) {}
        }
        if (!fetchSuccess && !window.__kirov5_warned_offline) {
          window.__kirov5_warned_offline = true;
          console.warn(`[KIROV5 BRIDGE] Bridge local non joignable (${serversToTry.join(", ")}). Démarrez 'npm run bridge:prodgit'.`);
        } else if (fetchSuccess) {
          window.__kirov5_warned_offline = false;
        }
      } catch (err) {
        console.warn("[KIROV5 BRIDGE] Erreur polling bridge:", err.message);
      }

      if (!data) return;

      // target_ai filter — avoid injecting on wrong AI tab (KIROV4)
      const ai = detectAiName();
      if (data.target_ai && ai !== "unknown" && data.target_ai !== ai) {
        Log.info(`Bridge skip: target_ai=${data.target_ai} current=${ai}`);
        return;
      }

      const hash = await sha256(data.prompt + (data.prompt_id || ""));
      const promptId = String(data.prompt_id || "");

      if (promptId && sessionStorage.getItem("kirov5_injected_" + promptId) === "true") {
        const area = findTextarea();
        const currentText = area ? (area.value || area.innerText || area.textContent || "").trim() : "";
        if (currentText.length < 10) {
          Log.warn("Prompt marqué injecté mais le champ est vide ! On force la réinjection.");
          sessionStorage.removeItem("kirov5_injected_" + promptId);
        } else {
          try {
            await proxyFetch(`${CONFIG.BRIDGE_SERVER}/v1/bridge/consume`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ target_ai: data.target_ai || ai }),
            });
          } catch (_) { }
          return;
        }
      }

      isBridgeProcessing = true;
      const missionId = data.project_id || `mission_${Date.now()}`;
      const lastEl = getLastAssistantElement();
      const lastText = lastEl ? extractContent(lastEl) : "";

      let full = "";
      if (data.prompt && data.prompt.startsWith("[PROJET :")) {
        full = data.prompt;
      } else {
        full = `[PROJET : ${String(missionId).toUpperCase()}]`;
        if (data.phase_name) full += ` - [${data.phase_name}]`;
        full += "\n";
        if (parseInt(data.phase_num, 10) >= 2) full += SILENCE + "\n\n---\n\n";
        full += data.prompt;
      }

      showHud(`Bridge → injection (${ai})…`, "info");
      contentLog(`Bridge prompt reçu (${data.source || "local"}) → ${ai}`, "info");

      const ok = await injectPrompt(full);
      if (!ok) {
        isBridgeProcessing = false;
        showHud("Bridge: échec injection", "error");
        hideHud();
        return;
      }

      try {
        await proxyFetch(`${CONFIG.BRIDGE_SERVER}/v1/bridge/consume`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target_ai: ai })
        });
      } catch (_) { }

      if (promptId) sessionStorage.setItem("kirov5_injected_" + promptId, "true");
      sessionStorage.setItem("kirov5_last_prompt_id", promptId);
      sessionStorage.setItem("kirov5_last_hash", hash);

      if (data.action === "auto_rip") {
        showHud("Bridge → Auto-Rip Stitch…", "info");
        await waitForFullResponse({
          lastKnownText: lastText,
          minLength: 50,
          timeout: 180000
        });
        
        showHud("Recherche du bouton Export ZIP...", "info");
        let dlBtn = null;
        for (let idx = 0; idx < 15; idx++) {
           dlBtn = Array.from(document.querySelectorAll('button, div[role="button"], a, [class*="download"], [class*="export"]'))
             .find(el => {
                const text = (el.textContent || el.title || el.getAttribute('aria-label') || "").toLowerCase();
                return (text.includes("download zip") || text.includes("télécharger le dossier") || text.includes("export") || text.includes("télécharger") || text.includes("download")) && !text.includes("app");
             });
           if (dlBtn) break;
           await sleep(1000);
        }

        if (dlBtn) {
           showHud("Bouton Export trouvé. Téléchargement en cours...", "success");
           try { dlBtn.click(); } catch (e) {}
           try {
             await proxyFetch(`${CONFIG.BRIDGE_SERVER}/api/bridge/expect-stitch-zip`, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ projectId: data.project_id || missionId })
             });
             contentLog("Auto-Rip notifié au Moteur (Downloads watcher activé)", "ok");
           } catch(e) {
             console.error("Erreur notification expect-stitch-zip", e);
           }
        } else {
           showHud("Erreur: Bouton Export ZIP introuvable sur l'UI.", "error");
        }
        
        isBridgeProcessing = false;
        setTimeout(hideHud, 5000);
        return;
      }

      showHud("Bridge → capture…", "info");
      const captured = await waitForFullResponse({
        lastKnownText: lastText,
        minLength: CONFIG.MIN_RESPONSE_LENGTH,
      });

      if (captured && captured.length >= CONFIG.MIN_RESPONSE_LENGTH) {
        const parsed = parseFiles(captured);
        if (parsed.length === 0) {
          // Pas de fichiers structurés — on envoie le texte brut
          await sendBridgeCallback(captured, missionId, null);
          showHud(`Bridge capturé ${captured.length} chars`, "success");
        } else {
          const fixed = fixFiles(parsed);
          // On passe les fichiers directement à sendBridgeCallback (→ /v1/bridge/callback + /api/extension/capture)
          const result = await sendBridgeCallback(JSON.stringify({ files: fixed }), missionId, fixed);
          try {
            chrome.runtime.sendMessage({ type: "STORE_CAPTURED", files: fixed });
          } catch (_) { }

          // Auto-write to disk (pour Treecontry Pipeline >= phase 8)
          const pNum = parseInt(data.phase_num, 10);
          if (!isNaN(pNum) && (pNum >= 8 || fixed.length >= 2)) {
            try {
              chrome.runtime.sendMessage({
                type: "WRITE_FILES",
                files: fixed,
                folderName: `Treecontry_${missionId}`,
                saveAs: false
              });
              contentLog(`💾 Auto-write disque déclenché (${fixed.length} fichiers)`, "success");
            } catch (_) { }
          }

          // Auto GitHub push if App/main present
          if (
            fixed.some(
              (f) =>
                f.path &&
                (f.path.includes("App.tsx") ||
                  f.path.includes("main.tsx") ||
                  f.path.includes("App.jsx"))
            ) &&
            fixed.length >= 2
          ) {
            try {
              chrome.runtime.sendMessage({ type: "PUSH_GITHUB", files: fixed });
              contentLog(`🐙 Auto-push GitHub (${fixed.length} fichiers)`, "info");
            } catch (_) { }
          }

          if (result) {
            const phase = result.currentPhase;
            const total = result.totalPhases;
            if (!result.completed && phase) {
              Log.info(`AUTO-PILOT → Phase ${phase}/${total || '?'}`);
              contentLog(`AUTO-PILOT → Phase ${phase}/${total || '?'}`, "ok");
            } else if (result.completed) {
              Log.success(`AUTO-PILOT → Projet complet ! 🎉`);
              contentLog(`AUTO-PILOT → Projet complet ! 🎉`, "success");
            }
          }
          showHud(`Bridge: ${fixed.length} fichiers ✅`, "success");
          contentLog(`📦 Bridge capture: ${fixed.length} fichiers`, "success");
        }
      } else {
        showHud("Bridge: capture insuffisante", "warn");
      }
      hideHud(4000);
      isBridgeProcessing = false;
    } catch (e) {
      Log.error("Poll error:", e.message);
      contentLog("Bridge error: " + e.message, "error");
      isBridgeProcessing = false;
    }
  }

  /* ── Local ForgeAI Control Center relay ── */
  window.addEventListener("message", (event) => {
    const data = event.data;
    if (event.source !== window || !data || data.source !== "forgeai-control-center" || !data.requestId) return;
    chrome.runtime.sendMessage({ type: "CONTROL_CENTER_REQUEST", path: data.path, init: data.init }, (response) => {
      window.postMessage({ source: "forgeai-extension", requestId: data.requestId, response }, "*");
    });
  });

  /* ── Message handler ── */
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    // Legacy KIROV4 action-style messages (popup inject tab)
    if (msg.action === "injectPrompt") {
      (async () => {
        try {
          showHud("Injection…", "info");
          const ok = await injectPrompt(msg.prompt || "");
          showHud(ok ? "Injecté ✅" : "Échec", ok ? "success" : "error");
          hideHud();
          sendResponse({ ok, success: ok });
        } catch (e) {
          sendResponse({ ok: false, success: false, message: e.message });
        }
      })();
      return true;
    }
    if (msg.action === "getCapturedFiles") {
      const el = getLastAssistantElement();
      if (el) {
        const c = extractContent(el);
        const files = fixFiles(parseFiles(c));
        sendResponse({ files, content: c, projectId: "kirov5-" + Date.now() });
      } else {
        sendResponse({ files: [], projectId: null });
      }
      return false;
    }
    if (msg.action === "getCapture") {
      const el = getLastAssistantElement();
      sendResponse({ content: el ? extractContent(el) : "" });
      return false;
    }

    if (msg.type === "KIROV_PING") {
      sendResponse({
        success: true,
        platform: PlatformDetector.detect().name,
        version: CONFIG.VERSION,
        busy: isBusy || isBridgeProcessing,
        bridgeEnabled,
      });
      return false;
    }

    if (msg.type === "KIROV_SET_BRIDGE") {
      if (msg.enabled != null) bridgeEnabled = !!msg.enabled;
      if (msg.serverUrl) CONFIG.BRIDGE_SERVER = msg.serverUrl;
      if (msg.vercelUrl) CONFIG.BRIDGE_VERCEL = msg.vercelUrl;
      sendResponse({ success: true, bridgeEnabled });
      return false;
    }

    if (msg.type === "KIROV_INJECT_ONLY") {
      (async () => {
        try {
          showHud("Injection du prompt...", "info");
          const ok = await injectPrompt(msg.prompt || "");
          showHud(ok ? "Prompt injecté ✅" : "Échec injection", ok ? "success" : "error");
          hideHud();
          sendResponse({ success: ok });
        } catch (e) {
          sendResponse({ success: false, message: e.message });
        }
      })();
      return true;
    }

    if (msg.type === "KIROV_CAPTURE_ONLY") {
      (async () => {
        try {
          showHud("Capture en cours...", "info");
          const content = await waitForFullResponse({
            minLength: msg.minLength,
            minFiles: msg.minFiles,
            timeout: msg.timeout,
          });
          if (content) {
            const files = fixFiles(parseFiles(content));
            if (files.length) {
              try {
                chrome.runtime
                  .sendMessage({ type: "STORE_CAPTURED", files })
                  .catch(() => { });
              } catch (_) { }
            }
            showHud(`Capturé ${content.length} chars ✅`, "success");
            hideHud();
            sendResponse({ success: true, content, files, fileCount: files.length });
          } else {
            showHud("Capture échouée", "error");
            hideHud();
            sendResponse({ success: false, message: "Aucune réponse capturée" });
          }
        } catch (e) {
          sendResponse({ success: false, message: e.message });
        }
      })();
      return true;
    }

    if (msg.type === "KIROV_INJECT_AND_CAPTURE") {
      (async () => {
        if (isBusy) {
          sendResponse({ success: false, message: "Déjà en cours de traitement" });
          return;
        }
        isBusy = true;
        try {
          const platform = PlatformDetector.detect();
          Log.info(`Inject+Capture sur ${platform.name} — step ${msg.stepId}`);
          showHud(`Étape ${msg.stepId ?? "?"} — Injection...`, "info");

          const lastEl = getLastAssistantElement();
          const lastKnownText = lastEl ? extractContent(lastEl) : "";

          const injected = await injectPrompt(msg.prompt || "");
          if (!injected) {
            showHud("Échec injection textarea", "error");
            hideHud();
            sendResponse({
              success: false,
              message: "Impossible d'injecter le prompt (textarea introuvable)",
            });
            return;
          }

          showHud(`Étape ${msg.stepId ?? "?"} — Génération en cours...`, "info");
          const content = await waitForFullResponse({
            minLength: msg.minLength || CONFIG.MIN_RESPONSE_LENGTH,
            minFiles: msg.minFiles || 0,
            timeout: msg.timeout || CONFIG.CAPTURE_TIMEOUT,
            lastKnownText,
          });

          if (content && content.length >= (msg.minLength || CONFIG.MIN_RESPONSE_LENGTH) * 0.5) {
            const files = fixFiles(parseFiles(content));
            if (files.length) {
              try {
                chrome.runtime
                  .sendMessage({ type: "STORE_CAPTURED", files })
                  .catch(() => { });
              } catch (_) { }
            }
            showHud(`Capturé ${content.length} caractères ✅`, "success");
            hideHud(4000);
            Log.success(`Capture ${content.length} chars`);
            sendResponse({
              success: true,
              content,
              length: content.length,
              files,
              fileCount: files.length,
            });
          } else {
            showHud("Capture insuffisante / timeout", "error");
            hideHud();
            sendResponse({
              success: false,
              message: `Capture échouée (${content ? content.length : 0} chars)`,
              content: content || null,
            });
          }
        } catch (e) {
          Log.error(e);
          showHud("Erreur: " + e.message, "error");
          hideHud();
          sendResponse({ success: false, message: e.message });
        } finally {
          isBusy = false;
        }
      })();
      return true;
    }

    return false;
  });

  /* ── Boot ── */
  (async () => {
    await loadBridgeConfig();
    Log.success(
      `Content script actif sur ${PlatformDetector.detect().name} — v${CONFIG.VERSION} (bridge ${bridgeEnabled ? "ON" : "OFF"})`
    );
    contentLog(
      `CS prêt — ${PlatformDetector.detect().name} v${CONFIG.VERSION}`,
      "info"
    );
    safeInterval(pollForPrompt, CONFIG.POLLING_INTERVAL);
    // First poll after short delay
    setTimeout(() => {
      pollForPrompt().catch(() => { });
    }, 1500);
  })();
})();
