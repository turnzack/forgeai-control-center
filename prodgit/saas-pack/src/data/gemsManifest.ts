import rawGems from "./gemsData.json";

export interface GemItem {
  id: string;
  index: number;
  fileName: string;
  originalPath: string;
  repo: string;
  targetPath: string;
  role: string;
  license: string;
  linesCount: number;
  sizeBytes: number;
  category: "ui-component" | "ai-provider" | "scheduler-job" | "state-storage" | "parser-util";
  categoryLabel: string;
  codeSnippet: string;
  fullCode: string;
}

export const GEMS_DATA: GemItem[] = rawGems as GemItem[];

export const GEMS_CATEGORIES = [
  { key: "all", label: "Toutes les Pépites", count: GEMS_DATA.length },
  { key: "ui-component", label: "🎨 Design System & UI", count: GEMS_DATA.filter(g => g.category === "ui-component").length },
  { key: "ai-provider", label: "🤖 IA & Fournisseurs LLM", count: GEMS_DATA.filter(g => g.category === "ai-provider").length },
  { key: "scheduler-job", label: "⏱️ Scheduler & Tâches", count: GEMS_DATA.filter(g => g.category === "scheduler-job").length },
  { key: "state-storage", label: "🧠 Mémoire & État", count: GEMS_DATA.filter(g => g.category === "state-storage").length },
  { key: "parser-util", label: "🛠️ Parsers & Utilitaires", count: GEMS_DATA.filter(g => g.category === "parser-util").length },
];
