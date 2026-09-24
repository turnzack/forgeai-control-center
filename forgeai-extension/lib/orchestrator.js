/* Orchestrator — 4-layer pipeline core loop
   Intake → Pack → Blind-bag release → Step-by-step + Web inject/capture */

class Orchestrator {
  static async createProject(projectName, projectDescription, options = {}) {
    if (!projectName || !String(projectName).trim()) {
      return { success: false, message: "Le nom du projet est requis." };
    }
    if (!projectDescription || !String(projectDescription).trim()) {
      return { success: false, message: "La description du projet est requise." };
    }

    const folderName =
      options.folderName ||
      String(projectName).trim().replace(/[^a-zA-Z0-9_-]/g, "_");

    const pack = PackBuilder.build(String(projectName).trim(), String(projectDescription).trim(), {
      folderName,
      execMode: options.execMode || "web",
      webAi: options.webAi || "deepseek",
    });

    await PackRegistry.savePack(pack);
    await PackRegistry.setFolderName(folderName);

    // Persist exec preferences
    await chrome.storage.local.set({
      [STORAGE_KEYS.EXEC_MODE]: options.execMode || "web",
      [STORAGE_KEYS.WEB_AI]: options.webAi || "deepseek",
      [STORAGE_KEYS.FOLDER_NAME]: folderName,
    });

    return { success: true, pack, folderName };
  }

  static async getPack() {
    return PackRegistry.getPack();
  }

  static async getCurrentStepInfo() {
    const pack = await PackRegistry.getPack();
    if (!pack) return null;
    const step = PIPELINE_STEPS[pack.state.currentStep];
    const available = await PackRegistry.getAvailableDocuments();
    return {
      step,
      completedSteps: pack.state.completedSteps,
      lockedSteps: pack.state.lockedSteps,
      availableDocuments: available,
      status: pack.state.status,
      totalSteps: PIPELINE_STEPS.length,
      folderName: pack.state.folderName,
      execMode: pack.state.execMode,
      webAi: pack.state.webAi,
      codeFileCount: (pack.state.codeFiles || []).length,
      artifactCount: Object.keys(pack.state.artifacts || {}).length,
      sourcePipeline: pack.state.sourcePipeline || null,
      codegenApproval: pack.state.codegenApproval || null,
      sourceCount: Array.isArray(pack.state.sourceReferences) ? pack.state.sourceReferences.length : 0,
    };
  }

  /* ── Provider / API key / models ── */

  static async setApiKey(key, providerId) {
    const provider = providerId || (await CommandRouter.getProviderId());
    await CommandRouter.setApiKey(key, provider);
    return { success: true };
  }

  static async hasApiKey(providerId) {
    const providerObj = providerId ? PROVIDERS[providerId] : await CommandRouter.getProvider();
    const key = await CommandRouter.getApiKey(providerObj.id);
    return providerObj.needsKey ? !!key : true;
  }

  static async setProvider(providerId) {
    if (!PROVIDERS[providerId]) {
      return { success: false, message: `Provider inconnu: ${providerId}` };
    }
    await CommandRouter.setProviderId(providerId);
    return { success: true, provider: PROVIDERS[providerId] };
  }

  static async getProvider() {
    return CommandRouter.getProvider();
  }

  static async getConfigStatus() {
    const provider = await CommandRouter.getProvider();
    const key = await CommandRouter.getApiKey(provider.id);
    const storedModel = await CommandRouter.getModel(provider.id);
    const model =
      storedModel && storedModel.providerId === provider.id
        ? storedModel.model
        : provider.model;
    const execMode = await this.getExecMode();
    const webAi = await this.getWebAi();
    const folderName = await PackRegistry.getFolderName();
    return {
      provider,
      hasKey: !!key,
      ready: provider.needsKey ? !!key : true,
      model,
      execMode,
      webAi,
      folderName,
    };
  }

  static async detectModels() {
    const provider = await CommandRouter.getProvider();
    const apiKey = await CommandRouter.getApiKey(provider.id);
    const result = await CommandRouter.listModels(provider.id, apiKey);
    if (!result.success) return result;

    const storedModelObj = await CommandRouter.getModel(provider.id);
    const existingModel = storedModelObj ? storedModelObj.model : null;

    let selected = null;
    if (existingModel && result.models.some((m) => m.id === existingModel)) {
      selected = existingModel;
    } else {
      const prefs = MODEL_PREFERENCES[provider.id] || [];
      for (const pref of prefs) {
        const found = result.models.find((m) => m.id === pref || m.id.startsWith(pref));
        if (found) {
          selected = found.id;
          break;
        }
      }
      if (!selected && result.models.length > 0) {
        const flash = result.models.find((m) => /flash/i.test(m.id));
        selected = flash ? flash.id : result.models[0].id;
      }
    }

    if (selected) await CommandRouter.setModel(selected, provider.id);
    return {
      success: true,
      models: result.models,
      selectedModel: selected,
      provider,
      warning: result.warning,
    };
  }

  static async setModel(model, providerId) {
    const providerObj = providerId ? PROVIDERS[providerId] : await CommandRouter.getProvider();
    await CommandRouter.setModel(model, providerObj.id);
    return { success: true, model, provider: providerObj };
  }

  static async getModel(providerId) {
    const providerObj = providerId ? PROVIDERS[providerId] : await CommandRouter.getProvider();
    const stored = await CommandRouter.getModel(providerObj.id);
    const model =
      stored && stored.providerId === providerObj.id ? stored.model : providerObj.model;
    return { success: true, model, provider: providerObj };
  }

  static async getExecMode() {
    return new Promise((resolve) => {
      chrome.storage.local.get([STORAGE_KEYS.EXEC_MODE], (r) => {
        resolve(r[STORAGE_KEYS.EXEC_MODE] || "web");
      });
    });
  }

  static async setExecMode(mode) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEYS.EXEC_MODE]: mode }, resolve);
    });
  }

  static async getWebAi() {
    return new Promise((resolve) => {
      chrome.storage.local.get([STORAGE_KEYS.WEB_AI], (r) => {
        resolve(r[STORAGE_KEYS.WEB_AI] || "deepseek");
      });
    });
  }

  static async setWebAi(id) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEYS.WEB_AI]: id }, resolve);
    });
  }

  /* ── Run current step ── */

  static async runCurrentStep(options = {}) {
    const pack = await PackRegistry.getPack();
    if (!pack) return { success: false, message: "Aucun projet actif." };

    const step = PIPELINE_STEPS[pack.state.currentStep];
    if (!step) return { success: false, message: "Étape invalide." };

    if (
      step.order === "codegen" &&
      typeof GitHubSourcePipeline !== "undefined" &&
      GitHubSourcePipeline.requiresCodegenApproval(pack)
    ) {
      return {
        success: false,
        needsApproval: true,
        step,
        message: "Validation requise avant la génération du code. Vérifiez les sources, le PRD, l’architecture et les tâches, puis autorisez la génération.",
      };
    }

    // Finalize → write to disk
    if (step.order === "finalize") {
      const result = await ArtifactWriter.writeAll({
        folderName: pack.state.folderName,
        saveAs: !!options.saveAs,
      });
      if (result.success) {
        await PackRegistry.markStepCompleted(step.id);
      }
      return {
        success: result.success,
        message: result.message,
        step,
        results: result.results,
        finalized: true,
        folderName: result.folderName,
      };
    }

    // Gatekeeper
    const access = await Gatekeeper.checkAccess(step.order, step.document);
    if (!access.allowed) {
      return {
        success: false,
        message: access.message,
        step,
        errorResponse: Gatekeeper.buildErrorResponse(
          access.errorType,
          access.message,
          access.availableDocuments
        ),
      };
    }

    await PackRegistry.logAccess({
      action: step.order,
      document: step.document,
      stepId: step.id,
      granted: true,
    });

    const execMode = options.execMode || pack.state.execMode || (await this.getExecMode());

    // WEB mode: inject into chat tab + capture
    if (execMode === "web" || (execMode === "hybrid" && step.order === "codegen")) {
      return await this.runStepViaWeb(pack, step, options);
    }

    // API mode
    return await this.runStepViaApi(pack, step);
  }

  static async runStepViaApi(pack, step) {
    const documentContent = step.document ? pack.documents[step.document] || "" : "";
    // Enrichissement cumulatif : injecte TOUS les artefacts précédents
    let enriched = documentContent;
    if (step.order === "codegen") {
      // Prompt codegen spécialisé avec contexte complet
      enriched = PackBuilder.buildCodegenPrompt(pack.projectName, pack.state.artifacts || {});
    } else if (step.order === "create") {
      const ctx = PackBuilder.enrichedContext(pack.state.artifacts || {}, 4000);
      if (ctx) enriched = documentContent + ctx;
      if (step.document === "02_ARCHITECTURE.md" && typeof GitHubSourcePipeline !== "undefined") {
        const sourceContext = GitHubSourcePipeline.getArchitectureContext(pack);
        if (sourceContext) enriched += `\n\n---\n${sourceContext}`;
      }
    }

    const history = this.buildConversationHistory(pack);
    const llmResponse = await CommandRouter.sendCommand(
      step.order,
      step.document,
      enriched,
      history
    );

    if (llmResponse.status === "error") {
      await PackRegistry.logAccess({
        action: step.order,
        document: step.document,
        stepId: step.id,
        granted: true,
        result: "error",
        error: llmResponse.message,
      });
      return {
        success: false,
        message: llmResponse.message || "Erreur LLM",
        step,
        llmResponse,
      };
    }

    return await this.persistStepResult(pack, step, llmResponse);
  }

  static async runStepViaWeb(pack, step, options = {}) {
    const webAi = options.webAi || pack.state.webAi || (await this.getWebAi());
    const target = WEB_AI_TARGETS[webAi] || WEB_AI_TARGETS.deepseek;

    const documentContent = step.document ? pack.documents[step.document] || "" : "";
    // Enrichissement cumulatif : prompts pro avec contexte cumulé
    let contextContent = documentContent;
    if (step.order === "codegen") {
      // Prompt codegen spécialisé : Silence Absolu + TOUS les artefacts
      contextContent = PackBuilder.buildCodegenPrompt(pack.projectName, pack.state.artifacts || {});
    } else if (step.order === "create") {
      const ctx = PackBuilder.enrichedContext(pack.state.artifacts || {}, 3500);
      if (ctx) contextContent = documentContent + ctx;
      if (step.document === "02_ARCHITECTURE.md" && typeof GitHubSourcePipeline !== "undefined") {
        const sourceContext = GitHubSourcePipeline.getArchitectureContext(pack);
        if (sourceContext) contextContent += `\n\n---\n${sourceContext}`;
      }
    }

    const prompt = CommandRouter.buildWebPrompt(step.order, step.document, contextContent, pack);

    // Ensure AI tab is open
    const tabId = await this.ensureWebAiTab(target);
    if (!tabId) {
      return {
        success: false,
        message: `Impossible d'ouvrir l'onglet ${target.label}. Ouvrez ${target.url} manuellement.`,
        step,
      };
    }

    // Wait for content script ready
    await this.sleep(1500);

    // Send inject+capture command to content script
    let captureResult;
    try {
      captureResult = await this.sendToTab(tabId, {
        type: "KIROV_INJECT_AND_CAPTURE",
        prompt,
        stepId: step.id,
        action: step.order,
        document: step.document,
        minLength: step.order === "codegen" ? 500 : 200,
        minFiles: step.order === "codegen" ? 2 : 0,
        timeout: CAPTURE_CONFIG.TIMEOUT,
      });
    } catch (err) {
      return {
        success: false,
        message: `Injection échouée: ${err.message}. Rechargez l'onglet ${target.label} et réessayez.`,
        step,
      };
    }

    if (!captureResult || !captureResult.success) {
      return {
        success: false,
        message: captureResult?.message || "Capture échouée — aucune réponse.",
        step,
        captureResult,
      };
    }

    const captured = captureResult.content || "";
    // Parse into structured response
    const llmResponse = CommandRouter.parseAssistantResponse(captured, step.document || "CODE");

    if (llmResponse.status === "error" && captured.length >= 50) {
      // Accept raw capture as content
      llmResponse.status = "ok";
      llmResponse.content = captured;
      llmResponse.ready = true;
      llmResponse.document = step.document || "CODE";
    }

    if (llmResponse.status === "error") {
      return {
        success: false,
        message: llmResponse.message || "Réponse non valide",
        step,
        llmResponse,
        raw: captured.slice(0, 300),
      };
    }

    return await this.persistStepResult(pack, step, llmResponse);
  }

  static async persistStepResult(pack, step, llmResponse) {
    const validation = this.validateArtifact(step, llmResponse);
    if (!validation.valid) {
      await PackRegistry.logAccess({
        action: step.order,
        document: step.document,
        stepId: step.id,
        granted: true,
        result: "validation_failed",
        error: validation.message,
      });
      return {
        success: false,
        message: `Validation échouée: ${validation.message}`,
        step,
        llmResponse,
        validationError: validation.message,
      };
    }

    // Unwrap nested JSON envelopes so artifacts store REAL content, not
    // {"status":"ok","content":"# md..."} which later becomes .txt dumps.
    let artifactContent = llmResponse.content || "";
    if (step.order !== "codegen" && step.document) {
      artifactContent = ArtifactWriter.unwrapArtifactContent(
        artifactContent,
        step.document
      );
    }
    let autoWriteResult = null;

    if (step.order === "codegen") {
      let files = ArtifactWriter.parseCodeFiles(artifactContent);
      // Also try files already parsed by content script
      if (!files.length && Array.isArray(llmResponse.files) && llmResponse.files.length) {
        files = ArtifactWriter.normalizeCodeFiles(llmResponse.files);
      }
      // Fallback: last captured batch in storage
      if (!files.length) {
        try {
          const stored = await chrome.storage.local.get([STORAGE_KEYS.CAPTURED_FILES]);
          if (stored[STORAGE_KEYS.CAPTURED_FILES]?.length) {
            files = ArtifactWriter.normalizeCodeFiles(stored[STORAGE_KEYS.CAPTURED_FILES]);
          }
        } catch (_) {}
      }

      if (files.length) {
        const fixed = this.applyKnownFixes(files);
        if (pack.state?.sourcePipeline && typeof GitHubSourcePipeline !== "undefined") {
          const audit = GitHubSourcePipeline.auditDependencies(fixed);
          await PackRegistry.storeArtifact(GitHubSourcePipeline.DEPENDENCY_AUDIT, audit.markdown);
          if (!audit.valid) {
            await PackRegistry.logAccess({
              action: step.order,
              document: step.document,
              stepId: step.id,
              granted: true,
              result: "dependency_audit_failed",
              error: audit.message,
            });
            return {
              success: false,
              step,
              message: `Audit des dépendances non conforme : ${audit.message}`,
              dependencyAudit: audit,
            };
          }
        }
        await PackRegistry.storeCodeFiles(fixed);
        await PackRegistry.storeArtifact(
          "CODE_GENERATION.json",
          JSON.stringify({ files: fixed }, null, 2)
        );

        // ═══════════════════════════════════════════════════
        // AUTO-WRITE DISQUE : écriture immédiate après codegen
        // Extensions React préservées (.tsx/.ts/.css/.json)
        // ═══════════════════════════════════════════════════
        try {
          autoWriteResult = await ArtifactWriter.writeAll({
            folderName: pack.state.folderName,
            saveAs: false,
          });
          console.log(`[KIROV5] ✅ Auto-write : ${autoWriteResult.message}`);
          const finalizeStep = PIPELINE_STEPS.find((s) => s.order === "finalize");
          if (finalizeStep) await PackRegistry.markStepCompleted(finalizeStep.id);
        } catch (writeErr) {
          console.warn("[KIROV5] Auto-write partiel:", writeErr.message);
        }
      } else {
        await PackRegistry.storeArtifact("CODE_GENERATION.raw.md", artifactContent);
        console.warn(
          "[KIROV5] Codegen: aucun fichier parsé — raw stocké. Relancez l'étape code."
        );
        if (pack.state?.sourcePipeline) {
          return {
            success: false,
            step,
            message: "La génération ne contient aucun fichier exploitable. Elle a été bloquée pour éviter un projet incomplet.",
          };
        }
      }
    } else if (step.document) {
      await PackRegistry.storeArtifact(step.document, artifactContent);
    }

    await PackRegistry.markStepCompleted(step.id);
    await PackRegistry.logAccess({
      action: step.order,
      document: step.document,
      stepId: step.id,
      granted: true,
      result: "success",
    });

    const codeFiles =
      step.order === "codegen"
        ? ArtifactWriter.normalizeCodeFiles(
            ArtifactWriter.parseCodeFiles(artifactContent)
          )
        : [];
    const writeReport = autoWriteResult
      ? {
          filesWritten: autoWriteResult.results?.filter((r) => r.success).length || 0,
          folderName: autoWriteResult.folderName,
          message: autoWriteResult.message,
          codeFileCount: autoWriteResult.codeFileCount || 0,
        }
      : null;

    return {
      success: true,
      step,
      artifact: artifactContent,
      llmResponse,
      codeFileCount: codeFiles.length || writeReport?.codeFileCount || 0,
      autoWrite: writeReport,
    };
  }

  /* ── Advance ── */

  static async advanceStep() {
    const pack = await PackRegistry.getPack();
    if (!pack) return { success: false, message: "Aucun projet actif." };

    const currentStep = PIPELINE_STEPS[pack.state.currentStep];
    if (!pack.state.completedSteps.includes(currentStep.id)) {
      return {
        success: false,
        message: `L'étape (${currentStep.label}) doit être terminée avant d'avancer.`,
      };
    }

    const nextStepId = pack.state.currentStep + 1;
    if (nextStepId >= PIPELINE_STEPS.length) {
      return { success: false, message: "Déjà à la dernière étape." };
    }

    await PackRegistry.setCurrentStep(nextStepId);
    return { success: true, nextStep: PIPELINE_STEPS[nextStepId] };
  }

  /* ── Full pipeline ── */

  static async runFullPipeline(onProgress, options = {}) {
    const pack = await PackRegistry.getPack();
    if (!pack) return { success: false, message: "Aucun projet actif." };

    await chrome.storage.local.set({ [STORAGE_KEYS.PIPELINE_RUNNING]: true });

    const results = [];
    let safety = 0;
    const MAX_RETRIES = 2;

    try {
      while (pack.state.currentStep < PIPELINE_STEPS.length && safety < 60) {
        safety++;
        const fresh = await PackRegistry.getPack();
        if (!fresh) break;
        pack.state = fresh.state;

        const step = PIPELINE_STEPS[pack.state.currentStep];
        if (onProgress) {
          onProgress({
            step,
            stepIndex: pack.state.currentStep,
            totalSteps: PIPELINE_STEPS.length,
            phase: "running",
          });
        }

        // Skip already completed
        if (pack.state.completedSteps.includes(step.id) && step.order !== "finalize") {
          const adv = await this.advanceStep();
          if (!adv.success) break;
          pack.state = (await PackRegistry.getPack()).state;
          continue;
        }

        let result = await this.runCurrentStep(options);
        let retries = 0;
        if (result.needsApproval) {
          if (onProgress) {
            onProgress({
              step,
              stepIndex: pack.state.currentStep,
              totalSteps: PIPELINE_STEPS.length,
              phase: "awaiting_approval",
              message: result.message,
            });
          }
          return { success: false, awaitingApproval: true, message: result.message, results };
        }
        while (!result.success && retries < MAX_RETRIES && !result.finalized) {
          retries++;
          if (onProgress) {
            onProgress({
              step,
              stepIndex: pack.state.currentStep,
              totalSteps: PIPELINE_STEPS.length,
              phase: "retry",
              retryCount: retries,
              message: result.message,
            });
          }
          await this.sleep(2000);
          result = await this.runCurrentStep(options);
        }

        results.push({ step, result, retries });

        if (!result.success) {
          if (onProgress) {
            onProgress({
              step,
              stepIndex: pack.state.currentStep,
              totalSteps: PIPELINE_STEPS.length,
              phase: "failed",
              message: result.message,
            });
          }
          return {
            success: false,
            message: `Pipeline stoppé à l'étape ${pack.state.currentStep} (${step.label}): ${result.message}`,
            results,
          };
        }

        if (result.finalized) {
          if (onProgress) {
            onProgress({
              step,
              stepIndex: pack.state.currentStep,
              totalSteps: PIPELINE_STEPS.length,
              phase: "complete",
            });
          }
          return { success: true, results, finalized: true, folderName: result.folderName };
        }

        const adv = await this.advanceStep();
        if (!adv.success) {
          return { success: false, message: adv.message, results };
        }
        pack.state = (await PackRegistry.getPack()).state;

        // Brief pause between steps
        await this.sleep(800);
      }

      return { success: true, results };
    } finally {
      await chrome.storage.local.set({ [STORAGE_KEYS.PIPELINE_RUNNING]: false });
    }
  }

  /* ── Helpers ── */

  static buildConversationHistory(pack) {
    const history = [];
    for (const stepId of pack.state.completedSteps) {
      const step = PIPELINE_STEPS[stepId];
      if (!step || !step.document) continue;
      const artifact = pack.state.artifacts[step.document];
      if (!artifact) continue;
      history.push({
        role: "user",
        content: JSON.stringify({ action: step.order, document: step.document }),
      });
      history.push({
        role: "assistant",
        content: JSON.stringify({
          status: "ok",
          document: step.document,
          content: artifact.slice(0, 4000),
          ready: true,
        }),
      });
    }
    return history;
  }

  static validateArtifact(step, llmResponse) {
    if (!llmResponse || llmResponse.status !== "ok") {
      return { valid: false, message: "Status LLM n'est pas 'ok'." };
    }
    const content = llmResponse.content || "";
    if (!content || !content.trim()) {
      return { valid: false, message: "Contenu d'artifact vide." };
    }
    if (content.trim().length < 40) {
      return { valid: false, message: "Contenu trop court pour être significatif." };
    }
    if (step.order === "codegen") {
      const files = ArtifactWriter.parseCodeFiles(content);
      if (!files.length && !content.includes("path")) {
        // Accept if long enough raw content
        if (content.length < 200) {
          return { valid: false, message: "Aucun fichier code détecté dans la réponse." };
        }
      }
      return { valid: true };
    }
    if (step.document && step.document.endsWith(".md")) {
      if (!/^#{1,6}\s/m.test(content) && content.length < 100) {
        return { valid: false, message: "Markdown doit contenir au moins un titre." };
      }
    }
    if (step.document && step.document.endsWith(".yaml")) {
      if (!/^[a-zA-Z0-9_-]+:/m.test(content) && content.length < 80) {
        return { valid: false, message: "YAML doit contenir des paires clé-valeur." };
      }
    }
    return { valid: true };
  }

  static applyKnownFixes(files) {
    // First normalize all paths to proper React/Vite extensions (.tsx/.ts/.css…)
    const normalized = ArtifactWriter.normalizeCodeFiles(files || []);
    const fixed = [];
    const seen = new Set();
    const FORBIDDEN = new Set([
      "package.js",
      "tsconfig.js",
      "tsconfig.node.js",
      "App.ts",
      "main.js",
    ]);

    for (const file of normalized) {
      let path = file.path;
      let content = file.content || "";
      const basename = (path || "").split("/").pop() || path;
      const baseLower = basename.toLowerCase();

      // Canonical renames
      if (baseLower === "index.html" && basename !== "index.html") {
        path = path.replace(/[^/]+$/, "index.html");
      }
      if (basename === "Index.html") path = path.replace(/Index\.html$/, "index.html");
      if (basename === "package.js" && String(content).trim().startsWith("{")) {
        path = path.replace(/package\.js$/, "package.json");
      }
      if (
        (/^App\.ts$/i.test(basename) || /^main\.ts$/i.test(basename) || /^index\.ts$/i.test(basename)) &&
        /<[A-Z]|<div|<span|from ['"]react['"]/i.test(content)
      ) {
        path = path.replace(/\.ts$/i, ".tsx");
      }
      // .txt residual → re-normalize
      if (/\.txt$/i.test(path)) {
        path = ArtifactWriter.normalizePath(path, content, file.language);
      }

      if (path.endsWith(".vue")) continue;
      const finalBase = path.split("/").pop() || path;
      if (FORBIDDEN.has(finalBase)) continue;

      // Strip language fence prefix left in content
      const firstLine = String(content).split("\n")[0] || "";
      if (/^(html|javascript|typescript|tsx|jsx|css|json|yaml|yml)\s*$/i.test(firstLine.trim())) {
        content = String(content).split("\n").slice(1).join("\n");
      }

      // HashRouter enforcement
      if (
        (path.endsWith(".tsx") || path.endsWith(".jsx") || path.endsWith(".ts") || path.endsWith(".js")) &&
        content.includes("BrowserRouter")
      ) {
        content = content
          .replace(/\bBrowserRouter\b/g, "HashRouter")
          .replace(
            /from\s+['"]react-router-dom['"]/g,
            (m) => m // keep import path
          );
      }

      // package.json hardening
      if (path === "package.json" || path.endsWith("/package.json")) {
        try {
          const pkg = JSON.parse(content);
          if (pkg.type !== "module") pkg.type = "module";
          if (!pkg.scripts) pkg.scripts = {};
          if (!pkg.scripts.dev) pkg.scripts.dev = "vite";
          if (!pkg.scripts.build || String(pkg.scripts.build).includes("tsc") && !String(pkg.scripts.build).includes("vite")) {
            pkg.scripts.build = "vite build";
          }
          if (!pkg.scripts.preview) pkg.scripts.preview = "vite preview";
          // Ensure core deps for React+Vite
          if (!pkg.dependencies) pkg.dependencies = {};
          if (!pkg.devDependencies) pkg.devDependencies = {};
          content = JSON.stringify(pkg, null, 2);
        } catch (_) {}
      }

      // index.html must reference main.tsx and have id=root
      if (path === "index.html" || path.endsWith("/index.html")) {
        if (!/id=["']root["']/.test(content)) {
          content = content.replace(
            /<body[^>]*>/i,
            (m) => `${m}\n    <div id="root"></div>`
          );
        }
        if (!/src\/main\.(tsx|jsx|ts|js)/.test(content)) {
          if (!/<script[^>]+type=["']module["']/.test(content)) {
            content = content.replace(
              /<\/body>/i,
              '  <script type="module" src="/src/main.tsx"></script>\n</body>'
            );
          }
        }
      }

      if (!seen.has(path)) {
        seen.add(path);
        fixed.push({ ...file, path, content, language: ArtifactWriter.extOf(path) });
      }
    }
    return fixed;
  }

  static async ensureWebAiTab(target) {
    return new Promise((resolve) => {
      chrome.tabs.query({ url: target.match }, (tabs) => {
        if (tabs && tabs.length > 0) {
          // On ne force plus active: true pour ne pas voler le focus à l'utilisateur (Background Mode)
          resolve(tabs[0].id);
        } else {
          // Ouvre l'onglet en arrière-plan (active: false) pour un mode "invisible"
          chrome.tabs.create({ url: target.url, active: false }, (tab) => {
            // Wait for load
            const listener = (tabId, info) => {
              if (tabId === tab.id && info.status === "complete") {
                chrome.tabs.onUpdated.removeListener(listener);
                resolve(tab.id);
              }
            };
            chrome.tabs.onUpdated.addListener(listener);
            // Fallback timeout
            setTimeout(() => {
              chrome.tabs.onUpdated.removeListener(listener);
              resolve(tab?.id || null);
            }, 15000);
          });
        }
      });
    });
  }

  static sendToTab(tabId, message) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout content script (pas de réponse)"));
      }, (message.timeout || 300000) + 10000);

      chrome.tabs.sendMessage(tabId, message, (response) => {
        clearTimeout(timeout);
        if (chrome.runtime.lastError) {
          // Try inject content script then retry once
          chrome.scripting.executeScript(
            { target: { tabId }, files: ["content.js"] },
            () => {
              setTimeout(() => {
                chrome.tabs.sendMessage(tabId, message, (resp2) => {
                  if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                  } else {
                    resolve(resp2);
                  }
                });
              }, 1000);
            }
          );
        } else {
          resolve(response);
        }
      });
    });
  }

  static async resetProject() {
    await PackRegistry.clearPack();
    return { success: true };
  }

  static sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
}
