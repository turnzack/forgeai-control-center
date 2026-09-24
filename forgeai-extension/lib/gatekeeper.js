/* Step Gatekeeper — enforces document access per pipeline step */

class Gatekeeper {
  static async checkAccess(action, document) {
    const pack = await PackRegistry.getPack();
    if (!pack) {
      return {
        allowed: false,
        errorType: ERROR_TYPES.NO_PACK,
        message: "Aucun pack d'instructions actif. Créez un projet d'abord.",
        availableDocuments: [],
      };
    }

    const currentStepId = pack.state.currentStep;
    const currentStep = PIPELINE_STEPS[currentStepId];
    const available = await PackRegistry.getAvailableDocuments();

    if (!VALID_ACTIONS.includes(action)) {
      return {
        allowed: false,
        errorType: ERROR_TYPES.UNAUTHORIZED_ACTION,
        message: `Action "${action}" invalide. Actions valides: ${VALID_ACTIONS.join(", ")}.`,
        availableDocuments: available,
      };
    }

    if (action === "finalize") {
      if (currentStep.order !== "finalize") {
        return {
          allowed: false,
          errorType: ERROR_TYPES.UNAUTHORIZED_ACTION,
          message: `Finalize uniquement à l'étape finale (actuelle: ${currentStepId} — ${currentStep.label}).`,
          availableDocuments: available,
        };
      }
      return { allowed: true, availableDocuments: available };
    }

    if (action === "codegen") {
      if (currentStep.order !== "codegen") {
        return {
          allowed: false,
          errorType: ERROR_TYPES.UNAUTHORIZED_ACTION,
          message: `Codegen uniquement à l'étape codegen (actuelle: ${currentStepId}).`,
          availableDocuments: available,
        };
      }
      return { allowed: true, availableDocuments: available };
    }

    const isLocked = await PackRegistry.isStepLocked(currentStepId);
    if (isLocked && action !== "advance") {
      return {
        allowed: false,
        errorType: ERROR_TYPES.STEP_LOCKED,
        message: `Étape ${currentStepId} (${currentStep.label}) verrouillée. Utilisez "advance".`,
        availableDocuments: available,
      };
    }

    if (action === "advance") {
      if (pack.state.completedSteps.includes(currentStepId)) {
        return { allowed: true, availableDocuments: available };
      }
      return {
        allowed: false,
        errorType: ERROR_TYPES.STEP_LOCKED,
        message: `Impossible d'avancer: étape ${currentStepId} (${currentStep.label}) non terminée.`,
        availableDocuments: available,
      };
    }

    // read/create/validate — document must match current step
    if (document && document !== currentStep.document) {
      return {
        allowed: false,
        errorType: ERROR_TYPES.UNAUTHORIZED_DOCUMENT,
        message: `Document "${document}" non autorisé à l'étape ${currentStepId} (${currentStep.label}). Accès autorisé: ${currentStep.document || "(aucun)"}.`,
        availableDocuments: available,
      };
    }

    return { allowed: true, availableDocuments: available };
  }

  static buildErrorResponse(errorType, message, availableDocuments) {
    return {
      status: "error",
      errorType,
      message,
      availableDocuments,
      ready: false,
    };
  }
}
