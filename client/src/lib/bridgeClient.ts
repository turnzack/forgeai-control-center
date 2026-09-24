export type BridgeProject = {
  name: string;
  stack?: string | null;
  fileCount?: number;
  hasIndexHtml?: boolean;
  createdAt?: number;
};

export type TreeNode = {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: TreeNode[];
};

export type BridgeHealth = {
  ok: boolean;
  endpoint?: string;
  message?: string;
};

export type GitHubConfig = {
  repo: string;
  branch: string;
  hasToken: boolean;
  token?: string;
};

export type CommandResult = {
  ok: boolean;
  accepted?: boolean;
  status?: string;
  output?: string;
  message?: string;
  url?: string;
};

export type ProjectFile = { path: string; content: string };

export type ExportResult = {
  success: boolean;
  mode?: string;
  count?: number;
  projectName?: string;
  repo?: string;
  branch?: string;
  sha?: string;
  message?: string;
};

import { availablePacks } from './packs';

export type PrdPack = {
  slug: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  category?: string;
  defaultIntent?: string;
  features?: string[];
  uiComponents?: string[];
  pages?: string[];
  apiEndpoints?: string[];
  designTokens?: Record<string, string>;
  domain?: string;
  archetype?: string;
  primaryEntity?: string;
  searchQuery?: string;
};

export type GemItem = {
  gemKey: string;
  zipName: string;
  repo: string;
  path: string;
  fileName: string;
  role: string;
  score: number;
  sizeBytes: number;
  lineCount?: number;
  license: string;
  hasTests: boolean;
  hasSecrets: boolean;
  dependencies: string[];
  action: "use-code" | "inspire-only" | "exclude";
  matchedPackComponent?: string | null;
};

export type ProjectSourcesResponse = {
  projectId: string;
  hasManifest: boolean;
  manifest?: {
    sources?: Array<{
      repository: string;
      url: string;
      license: string;
      sha256?: string;
      sizeBytes?: number;
    }>;
  };
  archives: Array<{
    name: string;
    sizeBytes: number;
    downloadedAt?: string;
  }>;
};

export type MountResult = {
  success: boolean;
  components: number;
  filesWritten: number;
  message?: string;
  provenanceReport?: string;
  thirdPartyNotices?: string;
  mountedComponents?: Array<{
    fileName: string;
    repo: string;
    targetPath: string;
    role: string;
    license: string;
  }>;
};

export type ControlStatus = {
  projectId?: string;
  projectName?: string | null;
  folderName?: string | null;
  currentStep?: number | null;
  completedSteps?: number[];
  sourceCount?: number;
  sourcePipeline?: { automationMode?: string } | null;
  codegenApproval?: { status?: string } | null;
  artifacts?: string[];
};

export class BridgeClient {
  baseUrl: string;

  constructor(baseUrl = "http://127.0.0.1:5006") {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  private async requestViaExtension<T>(path: string, init?: RequestInit): Promise<T> {
    return new Promise((resolve, reject) => {
      const requestId = `control-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const timeout = window.setTimeout(() => {
        window.removeEventListener("message", onMessage);
        reject(new Error("Extension relay indisponible"));
      }, 7000);
      const onMessage = (event: MessageEvent) => {
        if (event.source !== window || event.data?.source !== "forgeai-extension" || event.data.requestId !== requestId) return;
        window.clearTimeout(timeout);
        window.removeEventListener("message", onMessage);
        const response = event.data.response;
        if (!response?.success) reject(new Error(response?.error || "Extension relay failed"));
        else if (!response.result?.ok) reject(new Error(`${response.result?.status || 500} — Bridge request failed`));
        else resolve(response.result.data as T);
      };
      window.addEventListener("message", onMessage);
      window.postMessage({ source: "forgeai-control-center", requestId, path, init: { method: init?.method || "GET", headers: init?.headers, body: init?.body } }, "*");
    });
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 7000);
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        ...init,
        headers: { Accept: "application/json", "Content-Type": "application/json", ...(init?.headers || {}) },
        signal: controller.signal,
      });
      const text = await response.text();
      let payload: unknown = null;
      try { payload = text ? JSON.parse(text) : null; } catch { payload = { output: text }; }
      if (!response.ok) {
        throw new Error(`${response.status} — ${(payload as { message?: string })?.message || response.statusText}`);
      }
      return payload as T;
    } catch (directError) {
      try {
        return await this.requestViaExtension<T>(path, init);
      } catch {
        throw directError;
      }
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async health(): Promise<BridgeHealth> {
    const candidates = ["/health", "/api/bridge/health", "/bridge/health"];
    let lastMessage = "Bridge hors ligne";
    for (const endpoint of candidates) {
      try {
        await this.request(endpoint);
        return { ok: true, endpoint, message: "Bridge connecté" };
      } catch (error) {
        lastMessage = error instanceof Error ? error.message : String(error);
      }
    }
    return { ok: false, message: lastMessage };
  }

  async projects(): Promise<BridgeProject[]> {
    const payload = await this.request<unknown>("/v1/projects");
    const names = Array.isArray(payload) ? payload : Array.isArray((payload as { projects?: unknown[] })?.projects) ? (payload as { projects: unknown[] }).projects : [];
    return names.map((item) => typeof item === "string" ? { name: item } : item as BridgeProject);
  }

  async tree(projectName: string): Promise<TreeNode[]> {
    const payload = await this.request<unknown>(`/v1/projects/${encodeURIComponent(projectName)}/tree`);
    return this.normalizeTree(payload);
  }

  private normalizeTree(raw: unknown, basePath = ""): TreeNode[] {
    if (Array.isArray(raw)) return raw as TreeNode[];
    if (!raw || typeof raw !== "object") return [];
    return Object.entries(raw).map(([name, value]) => {
      const path = basePath ? `${basePath}/${name}` : name;
      if (value && typeof value === "object" && (value as { type?: string }).type === "file") return { name, path, type: "file" as const };
      return { name, path, type: "directory" as const, children: this.normalizeTree(value, path) };
    });
  }

  async readFile(projectName: string, filePath: string): Promise<{ success: boolean; path: string; content: string }> {
    return this.request<{ success: boolean; path: string; content: string }>(
      `/v1/projects/${encodeURIComponent(projectName)}/file?path=${encodeURIComponent(filePath)}`
    );
  }

  async command(projectName: string, command: string): Promise<CommandResult> {
    const body = JSON.stringify({ command, cwd: projectName, projectId: projectName });
    try {
      return await this.request<CommandResult>(`/v1/projects/${encodeURIComponent(projectName)}/command`, { method: "POST", body });
    } catch (firstError) {
      if (!String(firstError).includes("404")) throw firstError;
      return this.request<CommandResult>("/v1/commands", { method: "POST", body });
    }
  }

  async writeFiles(projectName: string, files: ProjectFile[]): Promise<ExportResult> {
    return this.request<ExportResult>(`/v1/projects/${encodeURIComponent(projectName)}/files`, {
      method: "POST",
      body: JSON.stringify({ projectName, files }),
    });
  }

  async publishGitHub(projectName: string, files: ProjectFile[], options: { repo?: string; branch?: string; commitMessage?: string } = {}): Promise<ExportResult> {
    return this.request<ExportResult>(`/v1/projects/${encodeURIComponent(projectName)}/github`, {
      method: "POST",
      body: JSON.stringify({ projectName, files, ...options }),
    });
  }

  async getGitHubConfig(): Promise<GitHubConfig> {
    return this.request<GitHubConfig>("/v1/github/config");
  }

  async saveGitHubConfig(config: { token?: string; repo: string; branch: string }): Promise<{ success: boolean; repo: string; branch: string; hasToken: boolean }> {
    return this.request("/v1/github/config", { method: "POST", body: JSON.stringify(config) });
  }

  async controlStatus(): Promise<ControlStatus> {
    return this.request<ControlStatus>("/v1/control/status");
  }

  async getPrdPacks(): Promise<{ packs: PrdPack[]; count: number }> {
    try {
      return await this.request<{ packs: PrdPack[]; count: number }>("/v1/prd-packs");
    } catch (e) {
      console.warn("VPS unreachable, falling back to 114 hardcoded packs", e);
      const packs: PrdPack[] = availablePacks.map(p => ({
        slug: p.name,
        name: p.name,
        description: `Pack ${p.name}`,
        filesCount: 1,
        path: `prd_packs/${p.name}`
      }));
      return { packs, count: packs.length };
    }
  }

  async getPrdPack(slug: string): Promise<{ ok: boolean; pack: PrdPack }> {
    return this.request<{ ok: boolean; pack: PrdPack }>(`/v1/prd-packs/${encodeURIComponent(slug)}`);
  }

  async getProjectSources(projectName: string): Promise<ProjectSourcesResponse> {
    return this.request<ProjectSourcesResponse>(`/v1/projects/${encodeURIComponent(projectName)}/sources`);
  }

  async analyzeGems(projectName: string, packSlug?: string | null): Promise<{ gems: GemItem[]; stats: { total: number; extractable: number; inspire: number; excluded: number } }> {
    return this.request(`/v1/projects/${encodeURIComponent(projectName)}/analyze-gems`, {
      method: "POST",
      body: JSON.stringify({ packSlug }),
    });
  }

  async mountProject(projectName: string, choices: Array<{ gemKey: string; action: string; path: string; repo: string; zipName: string; role?: string; license?: string }>, packSlug?: string | null): Promise<MountResult> {
    return this.request<MountResult>(`/v1/projects/${encodeURIComponent(projectName)}/mount`, {
      method: "POST",
      body: JSON.stringify({ choices, packSlug }),
    });
  }

  async assembleFinalApp(projectName: string, packSlug?: string | null, forceOverwrite = true): Promise<{ success: boolean; projectName: string; filesCreated: number; message: string }> {
    return this.request(`/v1/projects/${encodeURIComponent(projectName)}/assemble-final-app`, {
      method: "POST",
      body: JSON.stringify({ packSlug, forceOverwrite }),
    });
  }

  async getProjectDevUrl(projectName: string): Promise<{ success: boolean; projectName: string; url: string; isRunning: boolean }> {
    return this.request(`/v1/projects/${encodeURIComponent(projectName)}/dev-url`);
  }

  async createProject(name: string): Promise<{ success: boolean; name: string; path: string; message: string }> {
    return this.request("/v1/projects", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  }

  async syncGitHubIntent(payload: { projectName: string; projectIdea: string; query: string; packSlug?: string | null }): Promise<{ ok: boolean; intent: unknown }> {
    return this.request("/v1/github/sync-intent", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async searchGitHubSources(payload: {
    query: string;
    projectIdea?: string;
    projectName?: string;
    packSlug?: string | null;
    language?: string;
    minStars?: number;
    activity?: string;
    policy?: string;
    licenses?: string[];
  }): Promise<{
    ok: boolean;
    count: number;
    items: any[];
    query: string;
    summary?: {
      total: number;
      compatible: number;
      review: number;
      blocked?: number;
      averageScore: number;
    };
  }> {
    return this.request("/v1/github/search", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async downloadGitHubSources(projectName: string, sources: Array<{ repo: string; branch?: string }>): Promise<{ success: boolean; downloadedCount: number; destination: string; errors?: any[] }> {
    return this.request("/v1/github/download-sources", {
      method: "POST",
      body: JSON.stringify({ projectName, sources }),
    });
  }
}

export const bridgeClient = new BridgeClient(
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5006"
);
