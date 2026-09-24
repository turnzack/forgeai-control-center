/* Pack Registry — IndexedDB/chrome.storage pack store (blind bag) */

class PackRegistry {
  static async savePack(pack) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [STORAGE_KEYS.PACK]: pack }, () => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
        else resolve();
      });
    });
  }

  static async getPack() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([STORAGE_KEYS.PACK], (result) => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
        else resolve(result[STORAGE_KEYS.PACK] || null);
      });
    });
  }

  static async clearPack() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.remove([STORAGE_KEYS.PACK, STORAGE_KEYS.FOLDER_NAME, STORAGE_KEYS.PIPELINE_RUNNING], () => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
        else resolve();
      });
    });
  }

  static async getDocument(filename) {
    const pack = await this.getPack();
    if (!pack || !pack.documents[filename]) return null;
    return pack.documents[filename];
  }

  static async setDocument(filename, content) {
    const pack = await this.getPack();
    if (!pack) throw new Error("No active pack");
    pack.documents[filename] = content;
    pack.state.updatedAt = new Date().toISOString();
    await this.savePack(pack);
  }

  static async getCurrentStep() {
    const pack = await this.getPack();
    if (!pack) return null;
    return pack.state.currentStep;
  }

  static async setCurrentStep(stepId) {
    const pack = await this.getPack();
    if (!pack) throw new Error("No active pack");
    pack.state.currentStep = stepId;
    pack.state.updatedAt = new Date().toISOString();
    await this.savePack(pack);
  }

  static async markStepCompleted(stepId) {
    const pack = await this.getPack();
    if (!pack) throw new Error("No active pack");
    if (!pack.state.completedSteps.includes(stepId)) {
      pack.state.completedSteps.push(stepId);
    }
    pack.state.lockedSteps[stepId] = true;
    pack.state.updatedAt = new Date().toISOString();
    await this.savePack(pack);
  }

  static async isStepLocked(stepId) {
    const pack = await this.getPack();
    if (!pack) return false;
    return !!pack.state.lockedSteps[stepId];
  }

  static async logAccess(entry) {
    const pack = await this.getPack();
    if (!pack) return;
    pack.state.accessLog.push({
      timestamp: new Date().toISOString(),
      ...entry,
    });
    // Keep last 200 entries
    if (pack.state.accessLog.length > 200) {
      pack.state.accessLog = pack.state.accessLog.slice(-200);
    }
    await this.savePack(pack);
  }

  static async getAvailableDocuments() {
    const pack = await this.getPack();
    if (!pack) return [];
    const docs = [];
    for (const s of PIPELINE_STEPS) {
      if (s.id <= pack.state.currentStep && s.document && !pack.state.lockedSteps[s.id]) {
        docs.push(s.document);
      }
    }
    return docs;
  }

  static async storeArtifact(filename, content) {
    const pack = await this.getPack();
    if (!pack) throw new Error("No active pack");
    pack.state.artifacts[filename] = content;
    pack.state.updatedAt = new Date().toISOString();
    await this.savePack(pack);
  }

  static async storeCodeFiles(files) {
    const pack = await this.getPack();
    if (!pack) throw new Error("No active pack");
    pack.state.codeFiles = files;
    pack.state.updatedAt = new Date().toISOString();
    await this.savePack(pack);
  }

  static async setFolderName(name) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEYS.FOLDER_NAME]: name }, resolve);
    });
  }

  static async getFolderName() {
    return new Promise((resolve) => {
      chrome.storage.local.get([STORAGE_KEYS.FOLDER_NAME], (r) => {
        resolve(r[STORAGE_KEYS.FOLDER_NAME] || null);
      });
    });
  }
}
