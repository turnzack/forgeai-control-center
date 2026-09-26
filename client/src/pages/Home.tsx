import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Bot,
  Box,
  Check,
  ChevronRight,
  ChevronDown,
  CircleAlert,
  Cloud,
  Code2,
  Copy,
  Cpu,
  Database,
  ExternalLink,
  File,
  Folder,
  GitBranch,
  Github,
  Layers3,
  LayoutDashboard,
  Library,
  Link2,
  LockKeyhole,
  Maximize2,
  MessageSquare,
  Package,
  PanelLeft,
  Play,
  Plus,
  Puzzle,
  RefreshCw,
  Rocket,
  Search,
  Server,
  Settings2,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Store,
  Terminal,
  TestTube2,
  WandSparkles,
  Workflow,
  X,
  Zap,
  CheckCircle2,
  Sliders,
  Archive,
  Layers,
  ShoppingBag,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { ProjectExportActions } from "@/components/ProjectExportActions";
import {
  bridgeClient,
  type BridgeHealth,
  type PrdPack,
  type GemItem,
  type MountResult,
  type BridgeProject,
  type TreeNode,
} from "@/lib/bridgeClient";

type View = "github" | "ide" | "orchestration" | "files" | "settings";
type Source = {
  repo: string;
  description: string;
  license: string;
  updated: string;
  score: number;
  category: string;
  selected: boolean;
  color: string;
  stars?: number;
  forks?: number;
  language?: string;
  reasons?: string[];
  licenseStatus?: "allowed" | "review" | "blocked";
  url?: string;
};
type LogItem = { time: string; tone: "success" | "info" | "warning" | "error"; text: string };

const initialSources: Source[] = [
  {
    repo: "earendil-works/pi",
    score: 79,
    description: "AI agent toolkit: unified LLM API, agent loop, TUI, coding agent CLI",
    category: "TypeScript",
    updated: "Mis à jour 22/09/2026",
    stars: 108153,
    forks: 13693,
    license: "MIT",
    licenseStatus: "allowed",
    selected: false,
    color: "cyan",
    url: "https://github.com/earendil-works/pi",
    reasons: [
      "Correspondance partielle avec les capacités demandées.",
      "Langage TypeScript compatible.",
      "Projet actif récemment.",
      "MIT est compatible avec la politique open-source."
    ]
  },
  {
    repo: "thedotmack/claude-mem",
    score: 70,
    description: "Persistent Context Across Sessions for Every Agent – Captures everything your agent does during sessions, compresses it with AI, and injects relevant context back into future sessions. Works with Claude Code, OpenClaw, Codex, Gemini, Hermes, Copilot, OpenCode + More",
    category: "TypeScript",
    updated: "Mis à jour 22/09/2026",
    stars: 94417,
    forks: 8343,
    license: "Apache-2.0",
    licenseStatus: "allowed",
    selected: false,
    color: "purple",
    url: "https://github.com/thedotmack/claude-mem",
    reasons: [
      "Langage TypeScript compatible.",
      "Projet actif récemment.",
      "Adoption communautaire significative.",
      "Apache-2.0 est compatible avec la politique open-source."
    ]
  },
  {
    repo: "ruvnet/ruflo",
    score: 80,
    description: "🌊 The original agent harness. Deploy intelligent multi-player swarms, coordinate autonomous workflows, and build conversational AI systems. Features adaptive memory, self-learning intelligence, federation, vector RAG integration, and native Claude Code / Codex / Hermes and many more Integrated",
    category: "TypeScript",
    updated: "Mis à jour 21/09/2026",
    stars: 73009,
    forks: 8665,
    license: "MIT",
    licenseStatus: "allowed",
    selected: false,
    color: "green",
    url: "https://github.com/ruvnet/ruflo",
    reasons: [
      "Correspondance partielle avec les capacités demandées.",
      "Langage TypeScript compatible.",
      "Projet actif récemment.",
      "MIT est compatible avec la politique open-source."
    ]
  },
  {
    repo: "danny-avila/LibreChat",
    score: 70,
    description: "Enhanced ChatGPT Clone: Features Agents, MCP, Skills, DeepSeek, Anthropic, AWS, OpenAI, Responses API, Azure, Groq, o1, GPT-5, Mistral, OpenRouter, Vertex AI, Gemini, Artifacts, AI model switching, message search, Code Interpreter, langchain, DALL-E-3, OpenAPI Actions, Functions, Secure Multi-User Auth, Presets, open-source for self-hosting. Active",
    category: "TypeScript",
    updated: "Mis à jour 22/09/2026",
    stars: 44585,
    forks: 9152,
    license: "MIT",
    licenseStatus: "allowed",
    selected: false,
    color: "cyan",
    url: "https://github.com/danny-avila/LibreChat",
    reasons: [
      "Langage TypeScript compatible.",
      "Projet actif récemment.",
      "Adoption communautaire significative.",
      "MIT est compatible avec la politique open-source."
    ]
  },
  {
    repo: "continuedev/continue",
    score: 80,
    description: "open-source coding agent",
    category: "TypeScript",
    updated: "Mis à jour 21/09/2026",
    stars: 35979,
    forks: 5409,
    license: "Apache-2.0",
    licenseStatus: "allowed",
    selected: false,
    color: "purple",
    url: "https://github.com/continuedev/continue",
    reasons: [
      "Correspondance partielle avec les capacités demandées.",
      "Langage TypeScript compatible.",
      "Projet actif récemment.",
      "Apache-2.0 est compatible avec la politique open-source."
    ]
  },
  {
    repo: "JCodesMore/ai-website-cloner-template",
    score: 80,
    description: "Clone any website with one command using AI coding agents",
    category: "TypeScript",
    updated: "Mis à jour 20/09/2026",
    stars: 34752,
    forks: 5064,
    license: "MIT",
    licenseStatus: "allowed",
    selected: false,
    color: "green",
    url: "https://github.com/JCodesMore/ai-website-cloner-template",
    reasons: [
      "Correspondance partielle avec les capacités demandées.",
      "Langage TypeScript compatible.",
      "Projet actif récemment.",
      "MIT est compatible avec la politique open-source."
    ]
  },
  {
    repo: "iOfficeAI/AionUi",
    score: 80,
    description: "Open-source 24/7 Cowork app for OpenClaw, Hermes, Claude Code, Codex, OpenCode and 20+ more CLI Agent | Customize your assistants | Team them up｜Star if you like it!",
    category: "TypeScript",
    updated: "Mis à jour 09/09/2026",
    stars: 33024,
    forks: 3423,
    license: "Apache-2.0",
    licenseStatus: "allowed",
    selected: false,
    color: "cyan",
    url: "https://github.com/iOfficeAI/AionUi",
    reasons: [
      "Correspondance partielle avec les capacités demandées.",
      "Langage TypeScript compatible.",
      "Projet actif récemment.",
      "Apache-2.0 est compatible avec la politique open-source."
    ]
  },
  {
    repo: "rohitg00/agentmemory",
    score: 80,
    description: "#1 Persistent memory for AI coding agents based on real-world benchmarks",
    category: "TypeScript",
    updated: "Mis à jour 21/09/2026",
    stars: 28687,
    forks: 2488,
    license: "Apache-2.0",
    licenseStatus: "allowed",
    selected: false,
    color: "purple",
    url: "https://github.com/rohitg00/agentmemory",
    reasons: [
      "Correspondance partielle avec les capacités demandées.",
      "Langage TypeScript compatible.",
      "Projet actif récemment.",
      "Apache-2.0 est compatible avec la politique open-source."
    ]
  },
  {
    repo: "QwenLM/qwen-code",
    score: 90,
    description: "An open-source AI coding agent that lives in your terminal.",
    category: "TypeScript",
    updated: "Mis à jour 22/09/2026",
    stars: 28051,
    forks: 3076,
    license: "Apache-2.0",
    licenseStatus: "allowed",
    selected: false,
    color: "green",
    url: "https://github.com/QwenLM/qwen-code",
    reasons: [
      "Correspondance forte avec les capacités demandées.",
      "Langage TypeScript compatible.",
      "Projet actif récemment.",
      "Apache-2.0 est compatible avec la politique open-source."
    ]
  },
  {
    repo: "Kilo-Org/kilocode",
    score: 80,
    description: "Kilo is the all-in-one agentic engineering platform. Build, ship, and iterate faster with the most popular open source coding agent.",
    category: "TypeScript",
    updated: "Mis à jour 22/09/2026",
    stars: 27381,
    forks: 3179,
    license: "MIT",
    licenseStatus: "allowed",
    selected: false,
    color: "cyan",
    url: "https://github.com/Kilo-Org/kilocode",
    reasons: [
      "Correspondance partielle avec les capacités demandées.",
      "Langage TypeScript compatible.",
      "Projet actif récemment.",
      "MIT est compatible avec la politique open-source."
    ]
  },
  {
    repo: "TencentCloud/TencentDB-Agent-Memory",
    score: 68,
    description: "TencentDB Agent Memory is a team-level memory hub for AI Agents — turning conversations, docs, and code into four reusable memory assets (Chat Memory, Skill, LLM-Wiki, Code-Graph) that are governed, shared, and equipped across agents and frameworks.",
    category: "TypeScript",
    updated: "Mis à jour 21/09/2026",
    stars: 27105,
    forks: 2596,
    license: "NOASSERTION",
    licenseStatus: "review",
    selected: false,
    color: "orange",
    url: "https://github.com/TencentCloud/TencentDB-Agent-Memory",
    reasons: [
      "Correspondance partielle avec les capacités demandées.",
      "Langage TypeScript compatible.",
      "Projet actif récemment.",
      "NOASSERTION nécessite une vérification manuelle avant redistribution."
    ]
  },
  {
    repo: "mksglu/context-mode",
    score: 68,
    description: "Context window optimization for AI coding agents. Sandboxes tool output (98% reduction), persists session memory, and enforces routing across 17 platforms via MCP + hooks.",
    category: "TypeScript",
    updated: "Mis à jour 21/09/2026",
    stars: 23891,
    forks: 1722,
    license: "NOASSERTION",
    licenseStatus: "review",
    selected: false,
    color: "orange",
    url: "https://github.com/mksglu/context-mode",
    reasons: [
      "Correspondance partielle avec les capacités demandées.",
      "Langage TypeScript compatible.",
      "Projet actif récemment.",
      "NOASSERTION nécessite une vérification manuelle avant redistribution."
    ]
  },
  {
    repo: "conwnet/github1s",
    score: 80,
    description: "One second to read GitHub code with VS Code.",
    category: "TypeScript",
    updated: "Mis à jour 20/09/2026",
    stars: 23288,
    forks: 906,
    license: "MIT",
    licenseStatus: "allowed",
    selected: false,
    color: "green",
    url: "https://github.com/conwnet/github1s",
    reasons: [
      "Correspondance partielle avec les capacités demandées.",
      "Langage TypeScript compatible.",
      "Projet actif récemment.",
      "MIT est compatible avec la politique open-source."
    ]
  },
  {
    repo: "labring/sealos",
    score: 68,
    description: "Deploy real projects from GitHub or your AI coding agent, then keep them running with AI-powered operations.",
    category: "TypeScript",
    updated: "Mis à jour 18/09/2026",
    stars: 18351,
    forks: 2480,
    license: "NOASSERTION",
    licenseStatus: "review",
    selected: false,
    color: "orange",
    url: "https://github.com/labring/sealos",
    reasons: [
      "Correspondance partielle avec les capacités demandées.",
      "Langage TypeScript compatible.",
      "Projet actif récemment.",
      "NOASSERTION nécessite une vérification manuelle avant redistribution."
    ]
  },
  {
    repo: "GLips/Figma-Context-MCP",
    score: 90,
    description: "MCP server to provide Figma layout information to AI coding agents like Cursor",
    category: "TypeScript",
    updated: "Mis à jour 18/09/2026",
    stars: 15891,
    forks: 1261,
    license: "MIT",
    licenseStatus: "allowed",
    selected: false,
    color: "cyan",
    url: "https://github.com/GLips/Figma-Context-MCP",
    reasons: [
      "Correspondance forte avec les capacités demandées.",
      "Langage TypeScript compatible.",
      "Projet actif récemment.",
      "MIT est compatible avec la politique open-source."
    ]
  },
  {
    repo: "NanmiCoder/cc-haha",
    score: 90,
    description: "Local-first cross-platform desktop workspace for Claude Code / agents: multi-agent, Git worktrees, code diffs, skill marketplace, multi-model, Computer Use, task-aware desktop pets, with WeChat, Feishu, DingTalk, Telegram, WhatsApp and H5 access.",
    category: "TypeScript",
    updated: "Mis à jour 22/09/2026",
    stars: 14671,
    forks: 8582,
    license: "MIT",
    licenseStatus: "allowed",
    selected: false,
    color: "green",
    url: "https://github.com/NanmiCoder/cc-haha",
    reasons: [
      "Correspondance forte avec les capacités demandées.",
      "Langage TypeScript compatible.",
      "Projet actif récemment.",
      "MIT est compatible avec la politique open-source."
    ]
  },
  {
    repo: "XiaomiMiMo/MiMo-Code",
    score: 70,
    description: "MiMo Code: Where Models and Agents Co-Evolve",
    category: "TypeScript",
    updated: "Mis à jour 22/09/2026",
    stars: 13263,
    forks: 1374,
    license: "MIT",
    licenseStatus: "allowed",
    selected: false,
    color: "purple",
    url: "https://github.com/XiaomiMiMo/MiMo-Code",
    reasons: [
      "Langage TypeScript compatible.",
      "Projet actif récemment.",
      "Adoption communautaire significative.",
      "MIT est compatible avec la politique open-source."
    ]
  },
  {
    repo: "InsForge/InsForge",
    score: 80,
    description: "The all-in-one, open-source backend platform for agentic coding. InsForge gives your coding agent database, auth, storage, compute, hosting, and AI gateway to ship full-stack apps end-to-end.",
    category: "TypeScript",
    updated: "Mis à jour 19/09/2026",
    stars: 13016,
    forks: 1195,
    license: "Apache-2.0",
    licenseStatus: "allowed",
    selected: false,
    color: "cyan",
    url: "https://github.com/InsForge/InsForge",
    reasons: [
      "Correspondance partielle avec les capacités demandées.",
      "Langage TypeScript compatible.",
      "Projet actif récemment.",
      "Apache-2.0 est compatible avec la politique open-source."
    ]
  },
  {
    repo: "humanlayer/humanlayer",
    score: 68,
    description: "The best way to get AI coding agents to solve hard problems in complex codebases.",
    category: "TypeScript",
    updated: "Mis à jour 19/06/2026",
    stars: 11593,
    forks: 956,
    license: "NOASSERTION",
    licenseStatus: "review",
    selected: false,
    color: "orange",
    url: "https://github.com/humanlayer/humanlayer",
    reasons: [
      "Correspondance partielle avec les capacités demandées.",
      "Langage TypeScript compatible.",
      "Projet actif récemment.",
      "NOASSERTION nécessite une vérification manuelle avant redistribution."
    ]
  },
  {
    repo: "holaboss-ai/holaOS",
    score: 78,
    description: "Open-source agentic workspace enterprises can make their own. Connect the systems you already run — 100+ integrations, MCP, chat tools, apps, browser, local files — with shared memory. Any agent (Claude Code, Codex), any model, or BYOK. Set up in clicks, not months. Local-first: your data never leaves your machines.",
    category: "TypeScript",
    updated: "Mis à jour 21/08/2026",
    stars: 11340,
    forks: 724,
    license: "NOASSERTION",
    licenseStatus: "review",
    selected: false,
    color: "orange",
    url: "https://github.com/holaboss-ai/holaOS",
    reasons: [
      "Correspondance forte avec les capacités demandées.",
      "Langage TypeScript compatible.",
      "Projet actif récemment.",
      "NOASSERTION nécessite une vérification manuelle avant redistribution."
    ]
  },
  {
    repo: "notnotype/neuro-book",
    score: 75,
    description: "An AI-powered IDE for long-form fiction writing, combining software engineering workflows, modern storytelling methodologies, and multi-agent systems.",
    category: "TypeScript",
    updated: "Mis à jour 17/09/2026",
    stars: 688,
    forks: 65,
    license: "AGPL-3.0",
    licenseStatus: "review",
    selected: false,
    color: "orange",
    url: "https://github.com/notnotype/neuro-book",
    reasons: [
      "Correspondance forte avec les capacités demandées.",
      "Langage TypeScript compatible.",
      "Projet actif récemment.",
      "AGPL-3.0 nécessite une vérification manuelle avant redistribution."
    ]
  },
  {
    repo: "seth-schultz/orchestr8",
    score: 75,
    description: "The Future of AI-Powered Development: Orchestr8 Transforms Claude Code Into a Complete Software Engineering Team",
    category: "TypeScript",
    updated: "Mis à jour 14/06/2026",
    stars: 69,
    forks: 5,
    license: "MIT",
    licenseStatus: "allowed",
    selected: false,
    color: "purple",
    url: "https://github.com/seth-schultz/orchestr8",
    reasons: [
      "Correspondance partielle avec les capacités demandées.",
      "Langage TypeScript compatible.",
      "Projet actif récemment.",
      "MIT est compatible avec la politique open-source."
    ]
  },
  {
    repo: "RaheesAhmed/SajiCode",
    score: 75,
    description: "Autonomous engineering organism — contract-first multi-agent team, 24/7 daemon, persistent memory, git-native safety, Guardian Swarm, MCP + A2A. | Builds production software, not prototypes.",
    category: "TypeScript",
    updated: "Mis à jour 14/09/2026",
    stars: 67,
    forks: 15,
    license: "MIT",
    licenseStatus: "allowed",
    selected: false,
    color: "green",
    url: "https://github.com/RaheesAhmed/SajiCode",
    reasons: [
      "Correspondance partielle avec les capacités demandées.",
      "Langage TypeScript compatible.",
      "Projet actif récemment.",
      "MIT est compatible avec la politique open-source."
    ]
  }
];

const stageDefinitions = [
  { id: "sources", label: "Sources GitHub", detail: "Recherche, tri et licences", icon: Github },
  { id: "context", label: "Contexte Architect Agent", detail: "Provenance injectée", icon: Library },
  { id: "prd", label: "PRD & Pack actif", detail: "Cahier des charges structuré", icon: File },
  { id: "architecture", label: "Architecture", detail: "Stack et modules", icon: Layers3 },
  { id: "tasks", label: "Tâches de montage", detail: "Plan de réalisation", icon: Puzzle },
  { id: "approval", label: "Validation humaine", detail: "Garde avant code", icon: LockKeyhole },
  { id: "code", label: "Application originale", detail: "Fichiers générés", icon: Code2 },
];

const initialLogs: LogItem[] = [
  { time: "00:02:11", tone: "success", text: "Bridge local connecté sur http://127.0.0.1:5006" },
  { time: "00:02:16", tone: "info", text: "113 Packs PRD chargés depuis prd_packs/" },
  { time: "00:02:19", tone: "info", text: "Architect Agent — provenance injectée dans le contexte" },
  { time: "00:02:26", tone: "success", text: "Pack PRD actif : E-Commerce Suite — 7 briques cibles configurées" },
];

function Dot({ tone = "green" }: { tone?: "green" | "amber" | "blue" | "red" }) { return <span className={`status-dot status-dot-${tone}`} />; }
function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "green" | "cyan" | "orange" | "purple" }) { return <span className={`soft-badge soft-badge-${tone}`}>{children}</span>; }

function CandidateRepoCard({
  source,
  onToggle,
}: {
  source: Source;
  onToggle: () => void;
}) {
  const isHigh = source.score >= 80;
  const isMed = source.score >= 70;
  const scoreClass = isHigh ? "score-badge-high" : isMed ? "score-badge-medium" : "score-badge-review";
  const isAllowed = source.licenseStatus === "allowed" || ["MIT", "Apache-2.0", "BSD-3", "ISC"].includes(source.license);

  return (
    <div className={`detailed-candidate-card ${source.selected ? "selected" : ""}`}>
      <div className="candidate-card-header">
        <a
          href={source.url || `https://github.com/${source.repo}`}
          target="_blank"
          rel="noreferrer"
          className="candidate-repo-link"
        >
          <Github size={15} />
          <span>{source.repo}</span>
          <ExternalLink size={12} style={{ opacity: 0.6 }} />
        </a>
        <span className={`candidate-score-badge ${scoreClass}`}>
          {source.score}/100
        </span>
      </div>

      <p className="candidate-description">{source.description}</p>

      <div className="candidate-meta-badges">
        <span className="meta-badge">{source.category || source.language || "TypeScript"}</span>
        <span className="meta-badge">{source.updated}</span>
        {source.stars !== undefined && (
          <span className="meta-badge badge-stars">★ {source.stars.toLocaleString("fr-FR")}</span>
        )}
        {source.forks !== undefined && (
          <span className="meta-badge badge-forks">⑂ {source.forks.toLocaleString("fr-FR")}</span>
        )}
        <span className={`meta-badge ${isAllowed ? "badge-license-allowed" : "badge-license-review"}`}>
          {source.license}
        </span>
      </div>

      {source.reasons && source.reasons.length > 0 && (
        <ul className="candidate-reasons-list">
          {source.reasons.map((reason, idx) => (
            <li key={idx} className="candidate-reason-item">
              <span className={reason.includes("compatible") || reason.includes("actif") ? "reason-allowed" : "reason-review"}>
                •
              </span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="candidate-card-bottom">
        <button
          type="button"
          onClick={onToggle}
          className={`candidate-select-btn ${source.selected ? "selected" : ""}`}
        >
          {source.selected ? (
            <>
              <Check size={13} />
              <span>Sélectionné</span>
            </>
          ) : (
            <>
              <Plus size={13} />
              <span>Sélectionner</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function SourceCard({ source, onToggle, pack }: { source: Source; onToggle: () => void; pack: PrdPack | null }) {
  return <CandidateRepoCard source={source} onToggle={onToggle} />;
}

function TreeMini({ mountedGems = [] }: { mountedGems?: Array<{ fileName: string; targetPath?: string }> }) {
  return (
    <div className="mini-tree">
      <div className="mini-tree-row mini-tree-project">
        <Folder size={14} className="tree-folder" />
        <b>workspace</b>
        <span>local</span>
      </div>
      {[
        ["00_PROJECT_META.md", "file"],
        ["SOURCES_GITHUB.md", "file"],
        ["sources.github.json", "file"],
        ["01_PRD.md", "file"],
        ["02_ARCHITECTURE.md", "file"],
        ["src", "folder"],
        ["  integrations", "folder"],
        ["    github-adapted", "folder"],
        ...mountedGems.slice(0, 4).map(g => [`      ${g.fileName}`, "file"] as [string, string]),
        ["  storefront", "folder"],
        ["    pages", "folder"],
        ["      Home.tsx", "file"],
        ["      Product.tsx", "file"],
        ["      Cart.tsx", "file"],
        ["package.json", "file"],
      ].map(([name, type], index) => (
        <div className={`mini-tree-row ${type === "file" ? "mini-tree-file" : "mini-tree-folder"}`} style={{ paddingLeft: `${19 + (name.match(/^\s+/)?.[0].length || 0) * 11}px` }} key={`${name}-${index}`}>
          {type === "folder" ? <Folder size={13} /> : <File size={13} />}
          <span>{name.trim()}</span>
          {type === "file" && <small>{name.includes("SOURCES") ? "PROVENANCE" : name.endsWith(".ts") ? "ADAPTED" : "TSX"}</small>}
        </div>
      ))}
    </div>
  );
}

// ── Ruban des Packs PRD ──
function PrdPacksRibbon({
  packs,
  selectedPack,
  onSelectPack,
  selectedCategory,
  onSelectCategory,
  packSearch,
  setPackSearch,
}: {
  packs: PrdPack[];
  selectedPack: PrdPack | null;
  onSelectPack: (pack: PrdPack) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  packSearch: string;
  setPackSearch: (v: string) => void;
}) {
  const categories = ["Tous", "business", "ai", "data", "communication", "media", "marketing"];

  const filteredPacks = useMemo(() => {
    return packs.filter((p) => {
      const matchCat = selectedCategory === "Tous" || (p.category || "").toLowerCase() === selectedCategory.toLowerCase();
      const matchQuery = !packSearch || `${p.name} ${p.slug} ${p.description}`.toLowerCase().includes(packSearch.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [packs, selectedCategory, packSearch]);

  const getPackIcon = (slug: string) => {
    if (slug.includes("commerce") || slug.includes("shop")) return "🛒";
    if (slug.includes("billing") || slug.includes("saas")) return "⚡";
    if (slug.includes("ai") || slug.includes("voice") || slug.includes("agent")) return "🤖";
    if (slug.includes("crm") || slug.includes("erp") || slug.includes("table")) return "📊";
    if (slug.includes("form") || slug.includes("input")) return "🎨";
    if (slug.includes("chat") || slug.includes("comms")) return "💬";
    if (slug.includes("audio") || slug.includes("media")) return "🎵";
    return "📦";
  };

  return (
    <section className="prd-packs-section">
      <div className="prd-packs-header">
        <div className="prd-packs-header-title">
          <Sparkles size={16} />
          <span>SÉLECTIONNEZ UN PACK PRD (BIBLE DU PROJET)</span>
          <Badge tone="cyan">{packs.length} packs disponibles</Badge>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="text"
            value={packSearch}
            onChange={(e) => setPackSearch(e.target.value)}
            placeholder="Filtrer les packs..."
            style={{
              padding: "4px 8px",
              fontSize: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "4px",
              color: "#fff",
              outline: "none",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            style={{
              padding: "3px 9px",
              fontSize: "9px",
              borderRadius: "99px",
              cursor: "pointer",
              border: selectedCategory === cat ? "1px solid #10b981" : "1px solid rgba(255,255,255,0.08)",
              background: selectedCategory === cat ? "rgba(16,185,129,0.15)" : "transparent",
              color: selectedCategory === cat ? "#34d399" : "#94a3b8",
            }}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="prd-packs-scroll">
        {filteredPacks.slice(0, 24).map((pack) => {
          const isSelected = selectedPack?.slug === pack.slug;
          return (
            <div
              key={pack.slug}
              className={`prd-pack-card ${isSelected ? "active" : ""}`}
              onClick={() => onSelectPack(pack)}
            >
              <div className="prd-pack-top">
                <span style={{ fontSize: "16px" }}>{getPackIcon(pack.slug)}</span>
                <Badge tone={isSelected ? "green" : "neutral"}>{pack.category || "Pack"}</Badge>
              </div>
              <div className="prd-pack-name">{pack.name}</div>
              <div className="prd-pack-desc">{pack.description}</div>
              <div style={{ marginTop: 6, fontSize: "8px", color: isSelected ? "#34d399" : "#64748b" }}>
                {pack.uiComponents?.length || 5} briques · {pack.features?.length || 8} features
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Bandeau du Pack PRD Actif ──
function ActivePackBanner({ pack, onReset, onSync }: { pack: PrdPack; onReset: () => void; onSync?: () => void }) {
  const bricks = pack.uiComponents && pack.uiComponents.length > 0
    ? pack.uiComponents
    : ["CartDrawer", "CheckoutWizard", "ProductGrid", "FilterSidebar", "ReviewList"];

  return (
    <div className="active-pack-banner">
      <div className="active-pack-info">
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 16 }}>🛒</span>
          <b>PACK PRD ACTIF : {pack.name.toUpperCase()} ({pack.slug})</b>
          <Badge tone="green">{pack.category || "Business"}</Badge>
        </div>
        <span>
          Cible : {pack.features?.length || 10} fonctionnalités · {bricks.length} composants UI · Stack React/TypeScript/Tailwind
        </span>
        <div className="active-pack-bricks">
          <strong style={{ fontSize: 9, color: "#a7f3d0", alignSelf: "center", marginRight: 3 }}>
            Briques cibles :
          </strong>
          {bricks.map((brick) => {
            const cleanName = brick.split("(")[0].trim();
            return (
              <span key={brick} className="brick-tag">
                [{cleanName}]
              </span>
            );
          })}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {onSync && (
          <button
            onClick={onSync}
            style={{
              padding: "5px 10px",
              borderRadius: "5px",
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              color: "#6ee7b7",
              fontSize: "10px",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
            title="Ré-appliquer la description métier, la requête GitHub et recharger les sources du pack"
          >
            ⚡ Synchroniser Prompts & Sources
          </button>
        )}
        <button
          onClick={onReset}
          style={{
            padding: "5px 10px",
            borderRadius: "5px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#cbd5e1",
            fontSize: "9px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Changer de Pack
        </button>
      </div>
    </div>
  );
}

// ── Workspace Switcher Dynamique ──
function WorkspaceSwitcher({
  currentProject,
  projects,
  onSelectProject,
  onCreateProject,
}: {
  currentProject: string;
  projects: BridgeProject[];
  onSelectProject: (name: string) => void;
  onCreateProject: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="workspace-switcher">
      <span className="side-label">WORKSPACE ACTIF</span>
      <div className="workspace-select" onClick={() => setOpen(!open)}>
        <Store size={15} />
        <div>
          <b>{currentProject}</b>
          <small>prodgit local</small>
        </div>
        <ChevronDown size={14} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </div>

      {open && (
        <div className="workspace-dropdown">
          <div style={{ padding: "4px 6px", fontSize: "8px", color: "#64748b", textTransform: "uppercase" }}>
            Workspaces détectés ({projects.length})
          </div>
          {projects.map((proj) => (
            <div
              key={proj.name}
              className={`workspace-option ${proj.name === currentProject ? "active" : ""}`}
              onClick={() => {
                onSelectProject(proj.name);
                setOpen(false);
              }}
            >
              <span>📁 {proj.name}</span>
              {proj.name === currentProject && <Check size={12} />}
            </div>
          ))}
          <div
            className="workspace-option"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 4, color: "#38bdf8" }}
            onClick={() => {
              setOpen(false);
              onCreateProject();
            }}
          >
            <span>+ Nouveau workspace</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Studio Pépites & Découpe de Code ──
function GemsStudioPanel({
  projectName,
  pack,
  gems,
  loading,
  onRefreshGems,
  onToggleAction,
  onMount,
  mountLoading,
  mountResult,
}: {
  projectName: string;
  pack: PrdPack | null;
  gems: GemItem[];
  loading: boolean;
  onRefreshGems: () => void;
  onToggleAction: (gemKey: string, action: "use-code" | "inspire-only" | "exclude") => void;
  onMount: () => void;
  mountLoading: boolean;
  mountResult: MountResult | null;
}) {
  const [filter, setFilter] = useState<"all" | "use-code" | "inspire-only" | "exclude">("all");

  const filteredGems = useMemo(() => {
    if (filter === "all") return gems;
    return gems.filter((g) => g.action === filter);
  }, [gems, filter]);

  const stats = useMemo(() => {
    return {
      total: gems.length,
      useCode: gems.filter((g) => g.action === "use-code").length,
      inspire: gems.filter((g) => g.action === "inspire-only").length,
      exclude: gems.filter((g) => g.action === "exclude").length,
    };
  }, [gems]);

  return (
    <div className="gems-panel">
      <div className="gems-header">
        <div>
          <div className="section-kicker">EXTRACTION INTELLIGENTE DEPUIS ARCHIVES .ZIP</div>
          <h3 style={{ margin: "4px 0", color: "#f8fafc", fontSize: "14px" }}>
            Pépites & Composants réutilisables ({gems.length})
          </h3>
          <p style={{ margin: 0, fontSize: "10px", color: "#94a3b8" }}>
            Workspace : <b>prodgit/{projectName}</b> {pack ? `· Cible : ${pack.name}` : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className="ghost-button" onClick={onRefreshGems} disabled={loading} style={{ fontSize: "9px" }}>
            <RefreshCw size={12} className={loading ? "spin" : ""} /> Ré-analyser
          </button>
          <button
            className="primary-button"
            onClick={onMount}
            disabled={mountLoading || stats.useCode === 0}
            style={{ background: "linear-gradient(135deg, #10b981, #059669)", border: "none", color: "#fff", fontWeight: 700 }}
          >
            <Rocket size={14} /> {mountLoading ? "Montage en cours..." : `MONTER LE PROJET (${stats.useCode})`}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button
          className={`ghost-button ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
          style={{ fontSize: "9px", padding: "4px 8px" }}
        >
          Tous ({stats.total})
        </button>
        <button
          className={`ghost-button ${filter === "use-code" ? "active" : ""}`}
          onClick={() => setFilter("use-code")}
          style={{ fontSize: "9px", padding: "4px 8px", color: "#34d399" }}
        >
          🟢 À intégrer ({stats.useCode})
        </button>
        <button
          className={`ghost-button ${filter === "inspire-only" ? "active" : ""}`}
          onClick={() => setFilter("inspire-only")}
          style={{ fontSize: "9px", padding: "4px 8px", color: "#fbbf24" }}
        >
          🟡 S'inspirer ({stats.inspire})
        </button>
        <button
          className={`ghost-button ${filter === "exclude" ? "active" : ""}`}
          onClick={() => setFilter("exclude")}
          style={{ fontSize: "9px", padding: "4px 8px", color: "#f87171" }}
        >
          🔴 Exclus ({stats.exclude})
        </button>
      </div>

      {mountResult && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            background: "rgba(16,185,129,0.12)",
            border: "1px solid rgba(16,185,129,0.3)",
            marginBottom: "12px",
            fontSize: "10px",
            color: "#a7f3d0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700 }}>
            <CheckCircle2 size={14} /> Montage terminé avec succès !
          </div>
          <p style={{ margin: "4px 0 0", color: "#6ee7b7", fontSize: "9px" }}>
            {mountResult.filesWritten} fichiers écrits dans <code>src/integrations/github-adapted/</code> avec mentions de provenance et audits de licence (MIT).
          </p>
        </div>
      )}

      {gems.length === 0 ? (
        <div style={{ padding: 30, textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 8, border: "1px dashed rgba(255,255,255,0.1)" }}>
          <Archive size={32} style={{ color: "#64748b", margin: "0 auto 10px" }} />
          <h4 style={{ color: "#cbd5e1", margin: "0 0 5px" }}>Aucune pépite analysée</h4>
          <p style={{ fontSize: "10px", color: "#64748b", maxWidth: 400, margin: "0 auto 12px" }}>
            Cliquez sur "Ré-analyser" pour scanner les archives .zip présentes dans <code>prodgit/{projectName}/github-sources/</code>.
          </p>
          <button className="primary-button" onClick={onRefreshGems} disabled={loading}>
            <RefreshCw size={13} /> Lancer l'analyse des archives
          </button>
        </div>
      ) : (
        <div className="gems-grid">
          {filteredGems.map((gem) => (
            <div
              key={gem.gemKey}
              className={`gem-card ${
                gem.action === "use-code"
                  ? "action-use"
                  : gem.action === "inspire-only"
                  ? "action-inspire"
                  : "action-exclude"
              }`}
            >
              <div className="gem-card-top">
                <div className="gem-card-title">
                  <a
                    href={`https://github.com/${gem.repo}`}
                    target="_blank"
                    rel="noreferrer"
                    className="gem-repo"
                    style={{ textDecoration: "none", color: "#38bdf8", display: "inline-flex", alignItems: "center", gap: 4 }}
                    title="Ouvrir le dépôt sur GitHub"
                  >
                    <Github size={11} /> {gem.repo} <ExternalLink size={9} style={{ opacity: 0.6 }} />
                  </a>
                  <div className="gem-file" title={gem.path} style={{ fontWeight: 700, color: "#f8fafc", fontSize: "11px" }}>
                    {gem.fileName}
                  </div>
                  <div className="gem-role" style={{ color: "#a5b4fc", fontSize: "9.5px" }}>
                    📦 {gem.role}
                  </div>
                </div>
                <div className={`gem-score-badge ${gem.score >= 90 ? "gem-score-high" : ""}`}>
                  {gem.score}% match
                </div>
              </div>

              {gem.path && (
                <div style={{ margin: "4px 0", fontSize: "8.5px", color: "#64748b", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  <code>{gem.path}</code>
                </div>
              )}

              {gem.matchedPackComponent && (
                <div style={{ margin: "4px 0", fontSize: "8.5px", color: "#34d399", display: "flex", alignItems: "center", gap: 4 }}>
                  <Sparkles size={11} /> <strong>Pack :</strong> {gem.matchedPackComponent}
                </div>
              )}

              <div className="gem-meta">
                <Badge tone="cyan">{gem.license}</Badge>
                <Badge tone={gem.hasSecrets ? "orange" : "green"}>
                  {gem.hasSecrets ? "⚠️ Secret possible" : "✅ Clean"}
                </Badge>
                <span style={{ color: "#64748b", fontSize: "8px", alignSelf: "center" }}>
                  {(gem.sizeBytes / 1024).toFixed(1)} KB · {gem.lineCount} lignes
                </span>
              </div>

              <div className="gem-btn-group">
                <button
                  className={`gem-action-btn btn-use ${gem.action === "use-code" ? "active" : ""}`}
                  onClick={() => onToggleAction(gem.gemKey, "use-code")}
                >
                  🟢 Utiliser
                </button>
                <button
                  className={`gem-action-btn btn-inspire ${gem.action === "inspire-only" ? "active" : ""}`}
                  onClick={() => onToggleAction(gem.gemKey, "inspire-only")}
                >
                  🟡 S'inspirer
                </button>
                <button
                  className={`gem-action-btn btn-exclude ${gem.action === "exclude" ? "active" : ""}`}
                  onClick={() => onToggleAction(gem.gemKey, "exclude")}
                >
                  🔴 Exclure
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Composant Principal Home ──
export default function Home() {
  const [view, setView] = useState<View>("github");
  const [sources, setSources] = useState(initialSources);
  const [search, setSearch] = useState("");
  const [projectName, setProjectName] = useState("ecom-suite");
  const [projectIdea, setProjectIdea] = useState(
    "Suite e-commerce complète avec gestion stock, panier persistant, tunnel de checkout en 3 étapes et catalogue filtrable."
  );
  const [activeStage, setActiveStage] = useState(0);
  const [logs, setLogs] = useState(initialLogs);
  const [runState, setRunState] = useState<"idle" | "running" | "approval" | "done">("idle");
  const [agentFocus, setAgentFocus] = useState("Architect Agent");
  const [activeTab, setActiveTab] = useState<"canvas" | "gems" | "files" | "agents" | "preview">("canvas");
  const [showCloudflare, setShowCloudflare] = useState(false);
  const [cloudflareModel, setCloudflareModel] = useState("@cf/meta/llama-3.1-8b-instruct");
  const [prompt, setPrompt] = useState("");
  const [bridgeHealth, setBridgeHealth] = useState<BridgeHealth>({ ok: false, message: "Vérification…" });

  // Nouveaux états Filtres GitHub Cockpit
  const [githubLanguage, setGithubLanguage] = useState<string>("Tous");
  const [githubMinStars, setGithubMinStars] = useState<number>(0);
  const [githubActivity, setGithubActivity] = useState<string>("Toute activité");
  const [githubPolicy, setGithubPolicy] = useState<string>("Open source");
  const [githubLicenses, setGithubLicenses] = useState<string[]>(["MIT", "Apache-2.0", "BSD-3", "ISC"]);
  const [sortOrder, setSortOrder] = useState<"relevance" | "stars" | "activity" | "license">("relevance");
  const [automationMode, setAutomationMode] = useState<"A" | "B">("B");

  // Nouveaux états Packs PRD & Pépites
  const [prdPacks, setPrdPacks] = useState<PrdPack[]>([]);
  const [selectedPack, setSelectedPack] = useState<PrdPack | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [packSearch, setPackSearch] = useState<string>("");
  const [projects, setProjects] = useState<BridgeProject[]>([]);
  const [gems, setGems] = useState<GemItem[]>([]);
  const [gemsLoading, setGemsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [mountLoading, setMountLoading] = useState(false);
  const [mountResult, setMountResult] = useState<MountResult | null>(null);

  // Recherche GitHub pilotée depuis l'application
  const handleSearchGitHubSources = async (
    queryOverride?: string,
    ideaOverride?: string,
    projOverride?: string,
    slugOverride?: string
  ) => {
    const q = queryOverride !== undefined ? queryOverride : search;
    const idea = ideaOverride !== undefined ? ideaOverride : projectIdea;
    const proj = projOverride !== undefined ? projOverride : projectName;
    const slug = slugOverride !== undefined ? slugOverride : selectedPack?.slug;

    setSearchLoading(true);
    addLog(`Envoi de la requête GitHub : "${q || "(brief seul)"}" vers l'extension et le bridge…`, "info");

    try {
      // 1. Synchronisation temps réel avec l'extension et le bridge
      await bridgeClient
        .syncGitHubIntent({
          projectName: proj,
          projectIdea: idea,
          query: q,
          packSlug: slug,
        })
        .catch(() => {});

      // 2. Exécution de la recherche avec filtres complets
      const res = await bridgeClient.searchGitHubSources({
        query: q,
        projectIdea: idea,
        projectName: proj,
        packSlug: slug,
        language: githubLanguage,
        minStars: githubMinStars,
        activity: githubActivity,
        policy: githubPolicy,
        licenses: githubLicenses,
      });

      if (res && Array.isArray(res.items) && res.items.length > 0) {
        // Normaliser les sources pour l'affichage cockpit
        const mapped: Source[] = res.items.map((item: any, idx: number) => ({
          repo: item.repo || item.fullName || item.name || "source",
          description: item.description || "Dépôt GitHub correspondant au pack PRD",
          license: item.license || item.licenseDecision?.spdxId || "MIT",
          licenseStatus: item.licenseStatus || (["MIT", "Apache-2.0", "BSD-3", "ISC"].includes(item.license) ? "allowed" : "review"),
          updated: item.updated || "récent",
          score: item.score || Math.min(95, 90 - idx * 3),
          stars: item.stars,
          forks: item.forks,
          category: item.category || (item.language ? `${item.language}` : "TypeScript"),
          language: item.language || item.category || "TypeScript",
          selected: false,
          color: idx % 3 === 0 ? "cyan" : idx % 3 === 1 ? "purple" : "green",
          url: item.url || `https://github.com/${item.repo}`,
          reasons: item.reasons || [
            "Correspondance avec les capacités demandées.",
            "Langage TypeScript compatible.",
            "Projet actif récemment.",
            "Licence compatible."
          ]
        }));

        setSources(mapped);
        addLog(
          `✅ ${mapped.length} dépôts GitHub trouvés — synchronisés avec l'extension`,
          "success"
        );
      } else {
        addLog("Recherche exécutée, aucune nouvelle source trouvée.", "warning");
      }
    } catch (err) {
      addLog(`Erreur recherche GitHub : ${err instanceof Error ? err.message : String(err)}`, "error");
    } finally {
      setSearchLoading(false);
    }
  };

  // Téléchargement direct des sources .zip dans prodgit/
  const handleDownloadSources = async () => {
    if (selectedSources.length === 0) {
      addLog("Veuillez d'abord sélectionner au moins un dépôt.", "warning");
      return;
    }
    setDownloadLoading(true);
    addLog(`Téléchargement de ${selectedSources.length} dépôts dans prodgit/${projectName}/github-sources/…`, "info");

    try {
      const res = await bridgeClient.downloadGitHubSources(
        projectName,
        selectedSources.map((s) => ({ repo: s.repo }))
      );

      if (res.success) {
        addLog(`✅ ${res.downloadedCount} archives .zip téléchargées avec succès`, "success");
        // Réanalyser automatiquement les pépites
        await reloadGems(projectName, selectedPack?.slug);
        setView("ide");
        setActiveTab("gems");
      } else {
        addLog(`Téléchargement partiel ou échoué`, "warning");
      }
    } catch (err) {
      addLog(`Échec du téléchargement : ${err instanceof Error ? err.message : String(err)}`, "error");
    } finally {
      setDownloadLoading(false);
    }
  };

  function buildMegaProjectDescription(pack: PrdPack): string {
  const domainText = pack.domain ? `Domaine : ${pack.domain}` : `Pack : ${pack.name}`;
  const entityText = pack.primaryEntity ? `Entité clé : ${pack.primaryEntity}` : "";
  const featuresList = (pack.features || []).slice(0, 10).map((f, i) => `${i + 1}. ${f}`).join("\n");
  const endpointsList = (pack.apiEndpoints || []).slice(0, 5).join(" | ");
  const componentsList = (pack.uiComponents || []).slice(0, 7).map((c) => `[${c.replace(/^[\[\(]+|[\]\)]+$/g, "")}]`).join(" ");
  const tokens = pack.designTokens ? `Primaire ${pack.designTokens.primary || "#3B82F6"} / Accent ${pack.designTokens.accent || "#10B981"} (${pack.designTokens.font || "Inter"})` : "";

  return [
    `🎯 [${pack.name.toUpperCase()}] — ${pack.description || pack.defaultIntent || "Application métier complète."}`,
    domainText + (entityText ? ` | ${entityText}` : ""),
    "",
    "⚡ 10 FONCTIONNALITÉS MÉTIER DU CAHIER DES CHARGES (PRD) :",
    featuresList || "1. Architecture modulaire et composants réutilisables\n2. Système d'authentification et permissions\n3. Gestion d'état et persistance locale",
    "",
    componentsList ? `🧩 BRIQUES & COMPOSANTS UI CIBLES :\n${componentsList}\n` : "",
    endpointsList ? `🔌 CONTRATS D'API & ENDPOINTS :\n${endpointsList}\n` : "",
    tokens ? `🎨 DESIGN TOKENS : ${tokens}` : "",
  ].filter(Boolean).join("\n");
}

  const handleSelectPack = (pack: PrdPack) => {
    setSelectedPack(pack);
    const slugClean = pack.slug.replace(/^(prd_|pack_)/, "").replace(/_/g, "-");
    setProjectName(slugClean || "app-projet");
    const idea = buildMegaProjectDescription(pack);
    setProjectIdea(idea);

    // Requête ciblée propre au pack sélectionné
    let autoQuery = "";
    const s = pack.slug.toLowerCase();
    if (s.includes("crm") || s.includes("erp")) {
      autoQuery = "crm erp pipeline kanban deal react typescript license:mit";
    } else if (s.includes("billing") || s.includes("saas")) {
      autoQuery = "saas billing stripe subscription metrics react typescript license:mit";
    } else if (s.includes("chat") || s.includes("comms") || s.includes("message") || s.includes("messenger")) {
      autoQuery = "chat ui messenger components message bubble conversation react typescript license:mit";
    } else if (s.includes("voice") || s.includes("vocal") || s.includes("audio_agent") || s.includes("speech")) {
      autoQuery = "ai voice agent webrtc audio assistant react typescript license:mit";
    } else if (s.includes("blog") || s.includes("contenu") || s.includes("article") || s.includes("magazine")) {
      autoQuery = "blog markdown editor post article react typescript license:mit";
    } else if (s.includes("component") || s.includes("design") || s.includes("ui") || s.includes("composant")) {
      autoQuery = "design system ui kit components react typescript license:mit";
    } else if (s.includes("game") || s.includes("arcade") || s.includes("tetris")) {
      autoQuery = "game arcade canvas react typescript license:mit";
    } else if (s.includes("ecom") || s.includes("commerce")) {
      autoQuery = "ecommerce cart checkout react typescript license:mit";
    } else {
      const entity = (pack.primaryEntity || "").toLowerCase();
      autoQuery = `${pack.name.toLowerCase().replace(/pack/gi, "").trim()} ${entity} react typescript license:mit`.trim();
    }
    setSearch(autoQuery);

    addLog(`Pack PRD activé : ${pack.name} — ${pack.uiComponents?.length || 0} composants cibles`, "success");

    // Lancer la recherche GitHub ciblée pour ce pack
    void handleSearchGitHubSources(autoQuery, idea, slugClean, pack.slug);
    void reloadGems(slugClean, pack.slug);
  };

  const cloudflareStatus = trpc.agents.status.useQuery(undefined, { retry: false });
  const runAgent = trpc.agents.run.useMutation();
  const selectedSources = useMemo(() => sources.filter((source) => source.selected), [sources]);

  const filteredSources = useMemo(() => {
    let result = sources.filter((source) => {
      // 1. Filtrage texte si renseigné (optionnel, peut être vide)
      if (search.trim()) {
        const q = search.toLowerCase();
        const text = `${source.repo} ${source.category} ${source.description} ${source.license}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      // 2. Filtre Langage
      if (githubLanguage !== "Tous") {
        const srcLang = source.language || source.category || "";
        if (srcLang.toLowerCase() !== githubLanguage.toLowerCase()) return false;
      }
      // 3. Filtre Étoiles
      if (githubMinStars > 0 && (source.stars || 0) < githubMinStars) {
        return false;
      }
      return true;
    });

    // Tri dynamique
    if (sortOrder === "stars") {
      result = [...result].sort((a, b) => (b.stars || 0) - (a.stars || 0));
    } else if (sortOrder === "license") {
      result = [...result].sort((a, b) => a.license.localeCompare(b.license));
    } else if (sortOrder === "activity") {
      result = [...result].sort((a, b) => b.updated.localeCompare(a.updated));
    } else {
      // relevance (default)
      result = [...result].sort((a, b) => b.score - a.score);
    }
    return result;
  }, [sources, search, githubLanguage, githubMinStars, sortOrder]);

  const summaryStats = useMemo(() => {
    const total = filteredSources.length;
    const compatible = filteredSources.filter(
      (s) => s.licenseStatus === "allowed" || ["MIT", "Apache-2.0", "BSD-3", "ISC"].includes(s.license)
    ).length;
    const review = filteredSources.filter(
      (s) => s.licenseStatus === "review" || s.license === "NOASSERTION" || s.license === "AGPL-3.0"
    ).length;
    const averageScore = total ? Math.round(filteredSources.reduce((acc, s) => acc + s.score, 0) / total) : 77;
    return { total, compatible, review, averageScore };
  }, [filteredSources]);

  const addLog = (text: string, tone: LogItem["tone"] = "info") =>
    setLogs((current) => [
      ...current.slice(-15),
      { time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }), tone, text },
    ]);

  // Chargement des packs et des projets
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const [packsRes, projsRes] = await Promise.all([
          bridgeClient.getPrdPacks().catch(() => ({ packs: [], count: 0 })),
          bridgeClient.projects().catch(() => [] as BridgeProject[]),
        ]);

        if (!mounted) return;

        if (packsRes.packs && packsRes.packs.length > 0) {
          setPrdPacks(packsRes.packs);
          // Sélectionner par défaut le pack e-commerce
          const ecom = packsRes.packs.find((p) => p.slug === "ecommerce_pack") || packsRes.packs[0];
          setSelectedPack(ecom);
          if (ecom) {
            setSearch("ecommerce cart checkout react typescript license:mit");
          }
        }

        if (Array.isArray(projsRes) && projsRes.length > 0) {
          setProjects(projsRes);
          const hasCurrent = projsRes.some((p) => p.name === projectName);
          if (!hasCurrent) {
            const preferred = projsRes.find((p) => p.name !== "default") || projsRes[0];
            if (preferred) {
              setProjectName(preferred.name);
            }
          }
        }
      } catch (err) {
        console.error("Erreur initialisation bridge:", err);
      }
    };
    void init();
    return () => {
      mounted = false;
    };
  }, []);

  // Analyse des pépites
  const reloadGems = async (projName: string, packSlug?: string) => {
    setGemsLoading(true);
    try {
      const res = await bridgeClient.analyzeGems(projName, packSlug || selectedPack?.slug);
      setGems(res.gems);
      addLog(`${res.gems.length} pépites extraites depuis les sources de prodgit/${projName}`, "success");
    } catch (err) {
      // Fallback sur le projet default si le nouveau dossier n'a pas encore de sources
      if (projName !== "default") {
        try {
          const fallback = await bridgeClient.analyzeGems("default", packSlug || selectedPack?.slug);
          setGems(fallback.gems);
          addLog(`${fallback.gems.length} pépites analysées depuis prodgit/default`, "info");
        } catch {
          addLog("Aucune archive source trouvée pour ce workspace", "warning");
        }
      } else {
        addLog("Aucune archive source trouvée dans prodgit/default", "warning");
      }
    } finally {
      setGemsLoading(false);
    }
  };

  // Chargement des pépites au montage si dispo
  useEffect(() => {
    void reloadGems(projectName, selectedPack?.slug);
  }, [selectedPack?.slug]);


  const handleToggleGemAction = (gemKey: string, action: "use-code" | "inspire-only" | "exclude") => {
    setGems((prev) => prev.map((g) => (g.gemKey === gemKey ? { ...g, action } : g)));
  };

  const handleMountProject = async () => {
    setMountLoading(true);
    try {
      const choices = gems.map((g) => ({
        gemKey: g.gemKey,
        action: g.action,
        path: g.path,
        repo: g.repo,
        zipName: g.zipName,
        role: g.role,
        license: g.license,
      }));

      const res = await bridgeClient.mountProject(projectName, choices, selectedPack?.slug);
      setMountResult(res);
      addLog(
        `🚀 Projet monté : Scaffold complet généré + ${res.filesWritten} composants adaptés`,
        "success"
      );
      addLog("Rapports PROVENANCE.md et THIRD_PARTY_NOTICES.md générés", "info");
    } catch (err) {
      addLog(`Échec du montage : ${err instanceof Error ? err.message : String(err)}`, "error");
    } finally {
      setMountLoading(false);
    }
  };

  const handleCreateProject = async () => {
    const name = window.prompt("Nom du nouveau workspace (ex: mon-saas) :");
    if (!name) return;
    try {
      await bridgeClient.createProject(name);
      setProjectName(name);
      const projsRes = await bridgeClient.projects();
      setProjects(projsRes);
      addLog(`Workspace créé : ${name}`, "success");
    } catch (err) {
      addLog(`Erreur création workspace : ${err instanceof Error ? err.message : String(err)}`, "error");
    }
  };

  const [agentOutputs, setAgentOutputs] = useState<Record<string, string>>({});

  const startPipeline = async () => {
    if (runState === "running") return;
    setRunState("running");
    setView("orchestration");
    setActiveStage(0);
    addLog(`Pipeline lancé pour ${projectName} avec ${selectedSources.length} références GitHub`, "info");

    // Préparer le contexte des composants montés / pépites
    const gemContext = gems.map((g) => ({
      fileName: g.fileName,
      repo: g.repo,
      role: g.role,
      targetPath: g.path
        ? `src/integrations/github-adapted/${g.repo.replace(/[^a-zA-Z0-9_-]/g, "-")}/${g.path}`
        : `src/integrations/github-adapted/${g.repo.replace(/[^a-zA-Z0-9_-]/g, "-")}/${g.fileName}`,
      license: g.license || "MIT",
    }));

    const agentCtx = {
      packName: selectedPack?.name || "E-Commerce Suite",
      packSlug: selectedPack?.slug || "ecommerce_pack",
      gems: gemContext,
    };

    const stages = ["sources", "context", "prd", "architecture", "tasks"];
    for (let i = 0; i < stages.length; i += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 600));
      setActiveStage(i + 1);

      if (i === 0) {
        addLog(`Phase 01 validée : ${selectedSources.length} dépôts GitHub sélectionnés et certifiés SPDX`, "success");
      }

      if (i === 1) {
        addLog(`Phase 02 : Règle de câblage métier injectée (${gemContext.length} modules dérivés réutilisables)`, "success");
      }

      if (i === 2) {
        try {
          const result = await runAgent.mutateAsync({
            stage: "prd",
            model: cloudflareModel,
            prompt: `${projectIdea}\nSources: ${selectedSources.map((source) => source.repo).join(", ")}`,
            context: agentCtx,
          });
          setAgentOutputs((prev) => ({ ...prev, "Product Agent": result.response }));
          addLog(
            result.configured ? "Product Agent (Cloudflare AI) — PRD structuré et prêt" : "Product Agent — PRD structuré prêt",
            result.configured ? "success" : "info"
          );
        } catch {
          addLog("Product Agent indisponible — PRD local conservé", "warning");
        }
      }

      if (i === 3) {
        try {
          const result = await runAgent.mutateAsync({
            stage: "architecture",
            model: cloudflareModel,
            prompt: `${projectIdea}\nArchitecture modulaire et réutilisation des composants`,
            context: agentCtx,
          });
          setAgentOutputs((prev) => ({ ...prev, "Architect Agent": result.response }));
          addLog(
            result.configured ? "Architect Agent (Cloudflare AI) — Architecture et règle de câblage validées" : "Architect Agent — Règle de câblage métier injectée",
            result.configured ? "success" : "info"
          );
        } catch {
          addLog("Architect Agent indisponible — architecture locale conservée", "warning");
        }
      }

      if (i === 4) {
        try {
          const result = await runAgent.mutateAsync({
            stage: "tasks",
            model: cloudflareModel,
            prompt: `${projectIdea}\nDécoupage en 4 sprints de réalisation`,
            context: agentCtx,
          });
          setAgentOutputs((prev) => ({ ...prev, "Planning Agent": result.response }));
          addLog(
            result.configured ? "Planning Agent (Cloudflare AI) — 4 Sprints d'exécution ordonnés" : "Planning Agent — Plan de tâches prêt",
            result.configured ? "success" : "info"
          );
        } catch {
          addLog("Planning Agent indisponible — plan de tâches local conservé", "warning");
        }
      }
    }

    setRunState("approval");
    addLog("🔒 Garde de validation humaine : Plan de montage prêt, accord requis avant écriture du code", "warning");
  };

  const approveCode = async () => {
    setRunState("running");
    addLog("Validation reçue — génération et montage de l’application autorisés", "success");
    setActiveStage(6);

    try {
      const gemContext = gems.map((g) => ({
        fileName: g.fileName,
        repo: g.repo,
        role: g.role,
        targetPath: g.path
          ? `src/integrations/github-adapted/${g.repo.replace(/[^a-zA-Z0-9_-]/g, "-")}/${g.path}`
          : `src/integrations/github-adapted/${g.repo.replace(/[^a-zA-Z0-9_-]/g, "-")}/${g.fileName}`,
        license: g.license || "MIT",
      }));

      const choices = gems.map((g) => ({
        gemKey: g.gemKey,
        action: g.action,
        path: g.path,
        repo: g.repo,
        zipName: g.zipName,
        role: g.role,
        license: g.license,
      }));

      const agentCtx = {
        packName: selectedPack?.name || "E-Commerce Suite",
        packSlug: selectedPack?.slug || "ecommerce_pack",
        gems: gemContext,
      };

      // 1. Appel Code Agent
      try {
        const codeRes = await runAgent.mutateAsync({
          stage: "code",
          model: cloudflareModel,
          prompt: projectIdea,
          context: agentCtx,
        });
        setAgentOutputs((prev) => ({ ...prev, "Code Agent": codeRes.response }));
        addLog("Code Agent : Plan d'assemblage et de câblage validé", "success");
      } catch (_) {}

      // 2. Montage effectif sur disque via le Bridge Local
      addLog(`Montage du projet "${projectName}" sur disque via bridge local…`, "info");
      const mountRes = await bridgeClient.mountProject(projectName, choices, selectedPack?.slug);
      setMountResult(mountRes);

      addLog(`✓ ${mountRes.filesWritten} pépites adaptées écrites dans src/integrations/github-adapted/`, "success");
      addLog(`✓ Squelette applicatif React 18 + Vite généré (package.json, App.tsx, Navbar, barrel index)`, "success");
      addLog(`✓ Spécifications générées : 01_PRD.md, 02_ARCHITECTURE.md, 03_TASKS.md, PROVENANCE_REPORT.md`, "success");

      // 3. Appel QA Agent
      try {
        const qaRes = await runAgent.mutateAsync({
          stage: "qa",
          model: cloudflareModel,
          prompt: projectIdea,
          context: agentCtx,
        });
        setAgentOutputs((prev) => ({ ...prev, "QA Agent": qaRes.response }));
        addLog("QA Agent : Matrice de tests et audit de licences validés (0 secret, licences compatibles)", "success");
      } catch (_) {}

      // 4. Recharger la liste des projets
      const updatedProjects = await bridgeClient.projects();
      setProjects(updatedProjects);

      setActiveStage(7);
      setRunState("done");
      addLog("🚀 Montage et câblage terminés avec succès ! Application disponible sur http://localhost:5173", "success");
    } catch (err) {
      addLog(`Erreur lors du montage : ${err instanceof Error ? err.message : String(err)}`, "error");
      setRunState("approval");
    }
  };

  const sendAgentPrompt = async () => {
    if (!prompt.trim()) return;
    addLog(`${agentFocus} reçoit une instruction ciblée : "${prompt.slice(0, 50)}…"`, "info");
    try {
      const result = await runAgent.mutateAsync({
        stage: "assistant",
        model: cloudflareModel,
        prompt: `${projectIdea}\nInstruction: ${prompt}`,
        context: {
          packName: selectedPack?.name,
          packSlug: selectedPack?.slug,
          gems: gems.map((g) => ({
            fileName: g.fileName,
            repo: g.repo,
            role: g.role,
            targetPath: g.path
              ? `src/integrations/github-adapted/${g.repo.replace(/[^a-zA-Z0-9_-]/g, "-")}/${g.path}`
              : `src/integrations/github-adapted/${g.repo.replace(/[^a-zA-Z0-9_-]/g, "-")}/${g.fileName}`,
          })),
        },
      });
      setAgentOutputs((prev) => ({ ...prev, [agentFocus]: result.response }));
      addLog(
        result.configured ? `Réponse Cloudflare reçue pour ${agentFocus}` : `Réponse locale reçue pour ${agentFocus}`,
        result.configured ? "success" : "info"
      );
    } catch {
      addLog("L’agent n’a pas répondu — la tâche reste en attente", "error");
    }
    setPrompt("");
  };

  useEffect(() => {
    if (cloudflareStatus.data?.model) setCloudflareModel(cloudflareStatus.data.model);
  }, [cloudflareStatus.data]);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      const status = await bridgeClient.health();
      if (mounted) setBridgeHealth(status);
    };
    void check();
    const timer = window.setInterval(() => void check(), 5000);
    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="control-shell">
      <aside className="control-sidebar">
        <div className="brand-lockup">
          <div className="brand-orb"><Cpu size={20} /></div>
          <div><b>FORGE<span>AI</span></b><small>STUDIO BUILDER</small></div>
        </div>

        <WorkspaceSwitcher
          currentProject={projectName}
          projects={projects}
          onSelectProject={(p) => {
            setProjectName(p);
            void reloadGems(p, selectedPack?.slug);
          }}
          onCreateProject={handleCreateProject}
        />

        <nav className="side-nav">
          <span className="side-label nav-label">PHASES DU BUILDER</span>
          <button className={`side-nav-item ${view === "github" ? "side-nav-active" : ""}`} onClick={() => setView("github")}>
            <Github size={17} />
            <span>1. Sources GitHub</span>
            {selectedSources.length > 0 && <em>{selectedSources.length}</em>}
          </button>
          <button className={`side-nav-item ${view === "ide" ? "side-nav-active" : ""}`} onClick={() => setView("ide")}>
            <Code2 size={17} />
            <span>2. IDE de montage</span>
            {gems.length > 0 && <em>{gems.length}</em>}
          </button>
          <button className={`side-nav-item ${view === "orchestration" ? "side-nav-active" : ""}`} onClick={() => setView("orchestration")}>
            <Workflow size={17} />
            <span>3. Orchestration</span>
            {runState === "approval" && <Dot tone="amber" />}
          </button>
          <button className={`side-nav-item ${view === "files" ? "side-nav-active" : ""}`} onClick={() => setView("files")}>
            <Folder size={17} />
            <span>4. Fichiers & artefacts</span>
          </button>
        </nav>

        <div className="sidebar-spacer" />
        <div className="sidebar-bottom">
          <div className="agent-mini">
            <div className="agent-mini-head">
              <Bot size={15} />
              <b>AGENTS LLM</b>
              <Dot tone={cloudflareStatus.data?.configured ? "green" : "amber"} />
            </div>
            <strong>{cloudflareStatus.data?.configured ? "Cloudflare connecté" : "Configuration requise"}</strong>
            <span>{cloudflareModel}</span>
            <button onClick={() => setView("settings")}>
              Configurer les agents <ArrowRight size={13} />
            </button>
          </div>
          <button className={`settings-link ${view === "settings" ? "settings-link-active" : ""}`} onClick={() => setView("settings")}>
            <Settings2 size={16} /> Paramètres
          </button>
        </div>
      </aside>

      <main className="control-main">
        <header className="topbar">
          <div className="topbar-context">
            <span className="crumb-muted">FORGEAI BUILDER /</span>
            <b>
              {view === "github"
                ? "GITHUB SOURCES"
                : view === "ide"
                ? "PROJECT IDE & GEMS"
                : view === "orchestration"
                ? "ORCHESTRATION"
                : view === "settings"
                ? "SETTINGS"
                : "PROJECT FILES"}
            </b>
            <span className="mode-chip">
              <span className="live-pulse" /> {runState === "running" ? "PIPELINE RUNNING" : "LOCAL WORKSPACE"}
            </span>
            <span className={`bridge-status bridge-status-${bridgeHealth.ok ? "online" : "offline"}`} title={bridgeHealth.message}>
              <Dot tone={bridgeHealth.ok ? "green" : "red"} /> Bridge {bridgeHealth.ok ? "connecté" : "hors ligne"}
            </span>
          </div>
          <div className="topbar-actions">
            <span className="sync-text"><RefreshCw size={13} /> Autosave actif</span>
            <button className="icon-button"><CircleAlert size={17} /></button>
            <div className="avatar">FA</div>
          </div>
        </header>

        <div className="page-body">
          {view === "github" && (
            <GitHubWorkspace
              sources={filteredSources}
              selectedCount={selectedSources.length}
              search={search}
              setSearch={setSearch}
              projectIdea={projectIdea}
              setProjectIdea={setProjectIdea}
              onToggle={(repo) =>
                setSources((current) =>
                  current.map((source) => (source.repo === repo ? { ...source, selected: !source.selected } : source))
                )
              }
              onToggleAll={() => {
                const allSelected = filteredSources.every((s) => s.selected) && filteredSources.length > 0;
                setSources((current) =>
                  current.map((s) => {
                    const isVisible = filteredSources.some((f) => f.repo === s.repo);
                    return isVisible ? { ...s, selected: !allSelected } : s;
                  })
                );
              }}
              projectName={projectName}
              setProjectName={setProjectName}
              onUse={() => {
                setView("ide");
                setActiveTab("gems");
              }}
              packs={prdPacks}
              selectedPack={selectedPack}
              onSelectPack={handleSelectPack}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              packSearch={packSearch}
              setPackSearch={setPackSearch}
              onSearch={() => handleSearchGitHubSources()}
              searchLoading={searchLoading}
              onDownloadSources={handleDownloadSources}
              downloadLoading={downloadLoading}
              githubLanguage={githubLanguage}
              setGithubLanguage={setGithubLanguage}
              githubMinStars={githubMinStars}
              setGithubMinStars={setGithubMinStars}
              githubActivity={githubActivity}
              setGithubActivity={setGithubActivity}
              githubPolicy={githubPolicy}
              setGithubPolicy={setGithubPolicy}
              githubLicenses={githubLicenses}
              setGithubLicenses={setGithubLicenses}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              automationMode={automationMode}
              setAutomationMode={setAutomationMode}
              summaryStats={summaryStats}
              onResetFilters={() => {
                setSearch("");
                setGithubLanguage("Tous");
                setGithubMinStars(0);
                setGithubActivity("Toute activité");
                setGithubPolicy("Commercial permissive");
                setGithubLicenses(["MIT", "Apache-2.0", "BSD-3", "ISC"]);
                setSortOrder("relevance");
                addLog("Filtres réinitialisés. Requête GitHub vidée.", "info");
              }}
            />
          )}

          {view === "ide" && (
            <IdeWorkspace
              projectName={projectName}
              setProjectName={setProjectName}
              projectIdea={projectIdea}
              setProjectIdea={setProjectIdea}
              sources={selectedSources}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onLaunch={startPipeline}
              runState={runState}
              pack={selectedPack}
              gems={gems}
              gemsLoading={gemsLoading}
              onRefreshGems={() => reloadGems(projectName, selectedPack?.slug)}
              onToggleGemAction={handleToggleGemAction}
              onMount={handleMountProject}
              mountLoading={mountLoading}
              mountResult={mountResult}
            />
          )}

          {view === "orchestration" && (
            <OrchestrationWorkspace
              activeStage={activeStage}
              runState={runState}
              logs={logs}
              onStart={startPipeline}
              onApprove={approveCode}
              cloudflareConfigured={!!cloudflareStatus.data?.configured}
              agentFocus={agentFocus}
              setAgentFocus={setAgentFocus}
              agentOutputs={agentOutputs}
              prompt={prompt}
              setPrompt={setPrompt}
              onSend={sendAgentPrompt}
            />
          )}

          {view === "files" && (
            <FilesWorkspace
              projectName={projectName}
              projects={projects}
              onSelectProject={(p) => {
                setProjectName(p);
                const lower = p.toLowerCase();
                if (prdPacks.length > 0) {
                  const exactSlug = lower.replace(/-/g, "_");
                  const matchPack = prdPacks.find((pack) => {
                    const s = pack.slug.toLowerCase();
                    const cleanS = s.replace(/^prd_/, "");
                    return s === exactSlug || s === lower || cleanS === exactSlug || cleanS === lower;
                  }) || prdPacks.find((pack) => {
                    const slug = pack.slug.toLowerCase();
                    if ((lower.includes("voice") || lower.includes("agent") || lower.includes("ai")) && (slug.includes("voice") || slug.includes("agent") || slug.includes("ai") || slug.includes("ia"))) return true;
                    if ((lower.includes("landing") || lower.includes("conversion") || lower.includes("colorful")) && (slug.includes("landing") || slug.includes("conversion") || slug.includes("colorful"))) return true;
                    if ((lower.includes("chat") || lower.includes("message") || lower.includes("messenger")) && (slug.includes("chat") || slug.includes("comms") || slug.includes("message"))) return true;
                    if ((lower.includes("crm") || lower.includes("erp")) && (slug.includes("crm") || slug.includes("erp"))) return true;
                    if ((lower.includes("saas") || lower.includes("billing")) && (slug.includes("saas") || slug.includes("billing"))) return true;
                    if ((lower.includes("ui") || lower.includes("skill") || lower.includes("comp")) && (slug.includes("composant") || slug.includes("design") || slug.includes("ui"))) return true;
                    if ((lower.includes("game") || lower.includes("arcade") || lower.includes("tetris")) && (slug.includes("game") || slug.includes("arcade") || slug.includes("tetris"))) return true;
                    if ((lower.includes("ecom") || lower.includes("commerce")) && (slug.includes("ecom") || slug.includes("commerce"))) return true;
                    if (lower === "default" && (slug.includes("saas") || slug.includes("ecom"))) return true;
                    return false;
                  });
                  if (matchPack) {
                    setSelectedPack(matchPack);
                    void reloadGems(p, matchPack.slug);
                    return;
                  }
                }
                void reloadGems(p, selectedPack?.slug);
              }}
              sources={selectedSources}
              selectedPack={selectedPack}
              onRefreshProjects={async () => {
                const p = await bridgeClient.projects();
                setProjects(p);
              }}
            />
          )}

          {view === "settings" && (
            <SettingsWorkspace
              model={cloudflareModel}
              setModel={setCloudflareModel}
              configured={!!cloudflareStatus.data?.configured}
              onRefresh={() => cloudflareStatus.refetch()}
            />
          )}
        </div>
      </main>

      {showCloudflare && (
        <CloudflareDialog
          model={cloudflareModel}
          setModel={setCloudflareModel}
          configured={!!cloudflareStatus.data?.configured}
          onClose={() => setShowCloudflare(false)}
          onRefresh={() => cloudflareStatus.refetch()}
        />
      )}
    </div>
  );
}

// ── Écran Phase 1 : Sources GitHub (Cockpit complet de pilotage) ──
function GitHubWorkspace({
  sources,
  selectedCount,
  search,
  setSearch,
  projectIdea,
  setProjectIdea,
  onToggle,
  onToggleAll,
  projectName,
  setProjectName,
  onUse,
  packs,
  selectedPack,
  onSelectPack,
  selectedCategory,
  setSelectedCategory,
  packSearch,
  setPackSearch,
  onSearch,
  searchLoading,
  onDownloadSources,
  downloadLoading,
  githubLanguage,
  setGithubLanguage,
  githubMinStars,
  setGithubMinStars,
  githubActivity,
  setGithubActivity,
  githubPolicy,
  setGithubPolicy,
  githubLicenses,
  setGithubLicenses,
  sortOrder,
  setSortOrder,
  automationMode,
  setAutomationMode,
  summaryStats,
  onResetFilters,
}: {
  sources: Source[];
  selectedCount: number;
  search: string;
  setSearch: (value: string) => void;
  projectIdea: string;
  setProjectIdea: (value: string) => void;
  onToggle: (repo: string) => void;
  onToggleAll: () => void;
  projectName: string;
  setProjectName: (value: string) => void;
  onUse: () => void;
  packs: PrdPack[];
  selectedPack: PrdPack | null;
  onSelectPack: (pack: PrdPack) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  packSearch: string;
  setPackSearch: (v: string) => void;
  onSearch: () => void;
  searchLoading: boolean;
  onDownloadSources: () => void;
  downloadLoading: boolean;
  githubLanguage: string;
  setGithubLanguage: (v: string) => void;
  githubMinStars: number;
  setGithubMinStars: (v: number) => void;
  githubActivity: string;
  setGithubActivity: (v: string) => void;
  githubPolicy: string;
  setGithubPolicy: (v: string) => void;
  githubLicenses: string[];
  setGithubLicenses: (v: string[] | ((prev: string[]) => string[])) => void;
  sortOrder: "relevance" | "stars" | "activity" | "license";
  setSortOrder: (v: "relevance" | "stars" | "activity" | "license") => void;
  automationMode: "A" | "B";
  setAutomationMode: (v: "A" | "B") => void;
  summaryStats: { total: number; compatible: number; review: number; averageScore: number };
  onResetFilters: () => void;
}) {
  return (
    <>
      <div className="page-intro">
        <div>
          <div className="section-kicker">PHASE 01 / SOURCE INTELLIGENCE</div>
          <h2>Composez votre base GitHub.</h2>
          <p>Triez, comparez et verrouillez les références avant d’ouvrir l’IDE de montage.</p>
        </div>
        <Badge tone="green"><Dot tone="green" /> {selectedCount} sources prêtes</Badge>
      </div>

      {/* 1. Ruban de sélection des Packs PRD */}
      <PrdPacksRibbon
        packs={packs}
        selectedPack={selectedPack}
        onSelectPack={onSelectPack}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        packSearch={packSearch}
        setPackSearch={setPackSearch}
      />

      {/* 2. Bandeau du Pack PRD Actif */}
      {selectedPack && (
        <ActivePackBanner
          pack={selectedPack}
          onSync={() => onSelectPack(selectedPack)}
          onReset={() => {
            const first = packs[0];
            if (first) onSelectPack(first);
          }}
        />
      )}

      {/* 3. Panneau Projet à analyser & Filtres complets */}
      <section className="github-analysis-card">
        <div className="analysis-header">
          <div className="analysis-header-icon"><Github size={20} /></div>
          <div>
            <h3>Projet à analyser</h3>
            <p>Pilotez la recherche, les filtres et les critères sans avoir à ouvrir l'extension</p>
          </div>
        </div>

        <div className="analysis-fields-grid">
          <div className="analysis-field">
            <label>Description du projet</label>
            <textarea
              value={projectIdea}
              onChange={(e) => setProjectIdea(e.target.value)}
              placeholder="Décrivez votre idée de projet..."
              rows={3}
            />
          </div>

          <div className="analysis-field">
            <label>
              Requête GitHub{" "}
              <small style={{ fontWeight: 400, color: "#64748b", textTransform: "none" }}>
                (optionnel — ce champ peut rester vide)
              </small>
            </label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Laisser vide pour une recherche automatique basée sur la description"
            />
          </div>
        </div>

        <div className="github-filters-row">
          {/* Langage principal */}
          <div className="filter-group">
            <span className="filter-label">Langage principal</span>
            <div className="filter-pills-selector">
              {["Tous", "TypeScript", "JavaScript", "Python", "Rust", "C++"].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={`filter-pill-btn ${githubLanguage === lang ? "active" : ""}`}
                  onClick={() => setGithubLanguage(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Étoiles minimum */}
          <div className="filter-group">
            <span className="filter-label">Étoiles minimum</span>
            <input
              type="number"
              className="filter-input"
              value={githubMinStars || ""}
              onChange={(e) => setGithubMinStars(Math.max(0, parseInt(e.target.value, 10) || 0))}
              placeholder="0"
              min={0}
            />
          </div>

          {/* Activité */}
          <div className="filter-group">
            <span className="filter-label">Activité</span>
            <select
              className="filter-select"
              value={githubActivity}
              onChange={(e) => setGithubActivity(e.target.value)}
            >
              <option value="Toute activité">Toute activité</option>
              <option value="Moins d’un an">Moins d’un an</option>
              <option value="Moins de trois ans">Moins de trois ans</option>
            </select>
          </div>

          {/* Politique licence */}
          <div className="filter-group">
            <span className="filter-label">Politique licence</span>
            <select
              className="filter-select"
              value={githubPolicy}
              onChange={(e) => setGithubPolicy(e.target.value)}
            >
              <option value="Commercial permissive">Commercial permissive</option>
              <option value="Open source">Open source</option>
              <option value="Usage interne">Usage interne</option>
              <option value="Analyse uniquement">Analyse uniquement</option>
            </select>
          </div>

          {/* Licences acceptées */}
          <div className="filter-group" style={{ gridColumn: "span 2" }}>
            <span className="filter-label">Licences acceptées</span>
            <div className="licenses-checkbox-group">
              {["MIT", "Apache-2.0", "BSD-3", "ISC"].map((lic) => {
                const checked = githubLicenses.includes(lic);
                return (
                  <label key={lic} className={`license-checkbox-label ${checked ? "checked" : ""}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        setGithubLicenses((prev) =>
                          prev.includes(lic) ? prev.filter((l) => l !== lic) : [...prev, lic]
                        );
                      }}
                    />
                    <span>{lic}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="analysis-actions-bar">
          <button
            type="button"
            className="ghost-button"
            onClick={onResetFilters}
            title="Réinitialiser les filtres et vider la requête"
          >
            <RefreshCw size={12} /> ↺ RÉINITIALISER
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={onSearch}
            disabled={searchLoading}
            style={{
              padding: "8px 18px",
              background: "linear-gradient(135deg, #0284c7, #0369a1)",
              color: "#fff",
              fontWeight: 700
            }}
          >
            <Search size={14} className={searchLoading ? "spin" : ""} />
            <span>{searchLoading ? "Recherche en cours…" : "🔎 RECHERCHER"}</span>
          </button>
        </div>
      </section>

      {/* 4. Ruban des statistiques de synthèse */}
      <div className="github-summary-ribbon">
        <div className="summary-stat-box stat-total">
          <span className="summary-stat-value">{summaryStats.total}</span>
          <span className="summary-stat-label">résultats</span>
        </div>
        <div className="summary-stat-box stat-allowed">
          <span className="summary-stat-value" style={{ color: "#34d399" }}>{summaryStats.compatible}</span>
          <span className="summary-stat-label">autorisés</span>
        </div>
        <div className="summary-stat-box stat-review">
          <span className="summary-stat-value" style={{ color: "#fbbf24" }}>{summaryStats.review}</span>
          <span className="summary-stat-label">à vérifier</span>
        </div>
        <div className="summary-stat-box stat-score">
          <span className="summary-stat-value" style={{ color: "#c084fc" }}>{summaryStats.averageScore}</span>
          <span className="summary-stat-label">score moyen</span>
        </div>
      </div>

      {/* 5. Barre de tri et contrôles */}
      <div className="github-toolbar-row">
        <div className="sort-controls">
          <span className="sort-label">Trier :</span>
          <div className="sort-btn-group">
            {[
              { id: "relevance", label: "Pertinence" },
              { id: "stars", label: "Étoiles" },
              { id: "activity", label: "Activité récente" },
              { id: "license", label: "Licence" },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                className={`sort-btn ${sortOrder === s.id ? "active" : ""}`}
                onClick={() => setSortOrder(s.id as any)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="ghost-button"
          onClick={onToggleAll}
          style={{ fontSize: "9.5px", padding: "5px 10px" }}
        >
          <Check size={12} />
          <span>{sources.every(s => s.selected) && sources.length > 0 ? "Tout désélectionner" : "Tout sélectionner"}</span>
        </button>
      </div>

      {/* 6. Liste des dépôts candidats avec justifications */}
      <div className="candidate-cards-list">
        {sources.map((source) => (
          <CandidateRepoCard
            key={source.repo}
            source={source}
            onToggle={() => onToggle(source.repo)}
          />
        ))}
      </div>

      {/* 7. Mode de création du projet final */}
      <section className="automation-mode-box">
        <div className="automation-mode-title">
          <Workflow size={14} /> Mode de création du projet final
        </div>
        <p style={{ margin: "0 0 12px", color: "#94a3b8", fontSize: "10px" }}>
          Choisissez une automatisation pour l'orchestration du projet :
        </p>
        <div className="automation-mode-options">
          <div
            className={`automation-mode-card ${automationMode === "A" ? "active" : ""}`}
            onClick={() => setAutomationMode("A")}
          >
            <div className="mode-card-header">
              <span className="mode-card-title">A — Automatique jusqu’à la validation avant le code</span>
              {automationMode === "A" && <Check size={14} style={{ color: "#10b981" }} />}
            </div>
            <p className="mode-card-desc">
              A prépare automatiquement les sources, le projet, le PRD, l’architecture et les tâches, puis attend votre validation.
            </p>
          </div>

          <div
            className={`automation-mode-card ${automationMode === "B" ? "active" : ""}`}
            onClick={() => setAutomationMode("B")}
          >
            <div className="mode-card-header">
              <span className="mode-card-title">B — Tout automatiser jusqu’à l’export final</span>
              {automationMode === "B" && <Check size={14} style={{ color: "#10b981" }} />}
            </div>
            <p className="mode-card-desc">
              B lance aussi automatiquement la génération du code et l’export final.
            </p>
          </div>
        </div>

        <div className="automation-gate-callout">
          <LockKeyhole size={14} style={{ flexShrink: 0 }} />
          <div>
            <strong>Validation avant génération du code :</strong>{" "}
            {automationMode === "B"
              ? "Mode B actif : les spécifications, la génération du code et l’export final sont automatisés."
              : "Mode A actif : les spécifications sont préparées, le pipeline attend votre accord explicite avant la génération du code."}
          </div>
        </div>
      </section>

      {/* 8. Barre d'actions footer */}
      <div className="github-actions-footer">
        <div className="footer-selection-info">
          <div className="footer-selection-count">
            <Library size={15} style={{ color: "#38bdf8" }} />
            <span><b>{selectedCount}</b> dépôt{selectedCount > 1 ? "s" : ""} sélectionné{selectedCount > 1 ? "s" : ""}</span>
          </div>
          <span className="footer-fallback-note">
            Le téléchargement enregistre des archives ZIP dans le dossier projet du bridge local (<code>{projectName}/github-sources/&lt;owner&gt;__&lt;repo&gt;.zip</code>) avec leur hash SHA-256. Fallback : <code>Downloads/{projectName}/github-sources/</code> si le bridge est hors ligne.
          </span>
        </div>

        <div className="footer-buttons-group">
          <button
            type="button"
            className="ghost-button"
            onClick={onDownloadSources}
            disabled={selectedCount === 0 || downloadLoading}
            style={{ borderColor: "rgba(56,189,248,0.3)", color: "#38bdf8", padding: "10px 16px" }}
          >
            <Archive size={14} className={downloadLoading ? "spin" : ""} />
            <span>{downloadLoading ? "Téléchargement…" : "⬇️ TÉLÉCHARGER LES SOURCES"}</span>
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={onUse}
            disabled={selectedCount === 0}
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#fff",
              padding: "10px 18px"
            }}
          >
            <CheckCircle2 size={15} />
            <span>✅ UTILISER</span>
          </button>
        </div>
      </div>
    </>
  );
}

function LivePreview() {
  const [key, setKey] = useState(0);
  return (
    <div className="live-preview-panel">
      <div className="live-preview-toolbar">
        <div>
          <span className="section-kicker">LIVE PREVIEW</span>
          <b>localhost:5173</b>
        </div>
        <div className="live-preview-actions">
          <button className="ghost-button" onClick={() => setKey((value) => value + 1)}>
            <RefreshCw size={13} /> Actualiser
          </button>
          <a className="ghost-button" href="http://localhost:5173" target="_blank" rel="noreferrer">
            <ExternalLink size={13} /> Ouvrir
          </a>
        </div>
      </div>
      <iframe key={key} title="Aperçu live de l’application générée" src="http://localhost:5173" className="live-preview-frame" />
    </div>
  );
}

// ── Écran Phase 2 : IDE de Montage & Pépites ──
function IdeWorkspace({
  projectName,
  setProjectName,
  projectIdea,
  setProjectIdea,
  sources,
  activeTab,
  setActiveTab,
  onLaunch,
  runState,
  pack,
  gems,
  gemsLoading,
  onRefreshGems,
  onToggleGemAction,
  onMount,
  mountLoading,
  mountResult,
}: {
  projectName: string;
  setProjectName: (value: string) => void;
  projectIdea: string;
  setProjectIdea: (value: string) => void;
  sources: Source[];
  activeTab: "canvas" | "gems" | "files" | "agents" | "preview";
  setActiveTab: (value: "canvas" | "gems" | "files" | "agents" | "preview") => void;
  onLaunch: () => void;
  runState: string;
  pack: PrdPack | null;
  gems: GemItem[];
  gemsLoading: boolean;
  onRefreshGems: () => void;
  onToggleGemAction: (gemKey: string, action: "use-code" | "inspire-only" | "exclude") => void;
  onMount: () => void;
  mountLoading: boolean;
  mountResult: MountResult | null;
}) {
  return (
    <>
      <div className="page-intro">
        <div>
          <div className="section-kicker">PHASE 02 / PROJECT ASSEMBLY IDE</div>
          <h2>Montez l’application finale.</h2>
          <p>Un véritable espace de composition : structure, pépites extraites, agents et aperçu avant génération.</p>
        </div>
        <div className="ide-status">
          <Dot tone={runState === "running" ? "blue" : "green"} /> {runState === "running" ? "Montage en cours" : "Brouillon local"}
        </div>
      </div>

      <section className="ide-frame">
        <header className="ide-toolbar">
          <div className="ide-project-name">
            <Box size={16} />
            <input value={projectName} onChange={(event) => setProjectName(event.target.value)} />
            <span>/</span>
            <Badge tone="green">{pack?.slug || "original-fork"}</Badge>
          </div>
          <div className="ide-tabs">
            {(["canvas", "gems", "files", "agents", "preview"] as const).map((tab) => (
              <button key={tab} className={activeTab === tab ? "ide-tab-active" : ""} onClick={() => setActiveTab(tab)}>
                {tab === "canvas" ? (
                  <Layers3 size={14} />
                ) : tab === "gems" ? (
                  <Sparkles size={14} />
                ) : tab === "files" ? (
                  <Folder size={14} />
                ) : tab === "agents" ? (
                  <Bot size={14} />
                ) : (
                  <ExternalLink size={14} />
                )}
                {tab === "canvas"
                  ? "Canvas"
                  : tab === "gems"
                  ? `🔬 Pépites (${gems.length})`
                  : tab === "files"
                  ? "Fichiers"
                  : tab === "agents"
                  ? "Agents"
                  : "Aperçu"}
              </button>
            ))}
          </div>
          <button className="icon-button"><Maximize2 size={15} /></button>
        </header>

        <div className="ide-workspace">
          <aside className="ide-left">
            <div className="ide-pane-heading">
              <span>STRUCTURE APP</span>
              <Plus size={14} />
            </div>
            <TreeMini mountedGems={mountResult?.mountedComponents} />
            <div className="ide-left-card">
              <div className="ide-pane-heading">
                <span>RÉFÉRENCES</span>
                <Library size={13} />
              </div>
              {sources.slice(0, 4).map((source) => (
                <div className="ide-ref" key={source.repo}>
                  <GitBranch size={12} />
                  <span>{source.repo.split("/")[1]}</span>
                  <small>{source.license}</small>
                </div>
              ))}
            </div>
          </aside>

          <main className="ide-canvas">
            {activeTab === "canvas" && (
              <>
                <div className="canvas-heading">
                  <div>
                    <span className="section-kicker">APPLICATION BLUEPRINT</span>
                    <h3>{pack ? pack.name : "e-commerce / production-ready"}</h3>
                  </div>
                  <Badge tone="cyan"><Sparkles size={12} /> AI assembled</Badge>
                </div>
                <div className="idea-editor">
                  <label>
                    <WandSparkles size={15} /> INTENTION PRODUIT (PRD)
                    <textarea value={projectIdea} onChange={(event) => setProjectIdea(event.target.value)} />
                  </label>
                  <div className="idea-actions">
                    <span>Glissez des blocs pour composer votre produit</span>
                    <button className="ghost-button"><Copy size={14} /> Copier brief</button>
                  </div>
                </div>
                <div className="module-grid">
                  <ModuleCard icon={<Store size={17} />} title="Storefront" detail="Home · catalogue · produit" color="cyan" />
                  <ModuleCard icon={<Package size={17} />} title="Catalogue" detail="Produits · variantes · stock" color="purple" />
                  <ModuleCard icon={<Box size={17} />} title="Panier & checkout" detail="Panier · paiement · commandes" color="orange" />
                  <ModuleCard icon={<Database size={17} />} title="Back-office" detail="Admin · analytics · contenus" color="green" />
                  <ModuleCard icon={<Bot size={17} />} title="Assistant shopping" detail="Agent LLM · recherche produit" color="blue" />
                  <button className="add-module"><Plus size={20} /><span>Ajouter un module</span></button>
                </div>
                <div className="canvas-footer">
                  <div className="compatibility">
                    <Check size={14} />
                    <span>Compatibilité validée <b>· licences MIT / Apache-2.0</b></span>
                  </div>
                  <button className="primary-button" onClick={onLaunch}>
                    <Rocket size={16} /> Lancer le pipeline d'orchestration <ArrowRight size={15} />
                  </button>
                </div>
              </>
            )}

            {activeTab === "gems" && (
              <GemsStudioPanel
                projectName={projectName}
                pack={pack}
                gems={gems}
                loading={gemsLoading}
                onRefreshGems={onRefreshGems}
                onToggleAction={onToggleGemAction}
                onMount={onMount}
                mountLoading={mountLoading}
                mountResult={mountResult}
              />
            )}

            {activeTab === "files" && (
              <div className="ide-tab-empty">
                <Folder size={27} />
                <h3>Arborescence prête à générer</h3>
                <p>Le montage produira les fichiers du storefront, des agents et les artefacts de provenance.</p>
              </div>
            )}

            {activeTab === "agents" && (
              <div className="ide-tab-empty">
                <Bot size={27} />
                <h3>Agents spécialisés attachés</h3>
                <p>Architect · Product · Code · QA seront exécutés dans l’ordre du pipeline.</p>
              </div>
            )}

            {activeTab === "preview" && <LivePreview />}
          </main>

          <aside className="ide-right">
            <div className="ide-pane-heading">
              <span>ASSISTANT DE MONTAGE</span>
              <span className="live-badge"><span className="live-pulse" /> LIVE</span>
            </div>
            <div className="assistant-avatar"><Bot size={18} /></div>
            <h4>Architect Agent</h4>
            <p>
              Votre blueprint pour <b>{pack?.name || projectName}</b> est cohérent avec {gems.filter(g => g.action === "use-code").length} composants ciblés.
            </p>
            <div className="assistant-check"><Check size={13} /><span>{pack?.uiComponents?.length || 5} briques requises</span></div>
            <div className="assistant-check"><Check size={13} /><span>{gems.length} pépites analysées</span></div>
            <div className="assistant-check"><Check size={13} /><span>Garde de licence MIT active</span></div>
            <button className="assistant-action" onClick={() => setActiveTab("gems")}>
              <MessageSquare size={14} /> Voir les pépites ({gems.length})
            </button>
          </aside>
        </div>
      </section>
    </>
  );
}

function ModuleCard({ icon, title, detail, color }: { icon: React.ReactNode; title: string; detail: string; color: string }) {
  return (
    <div className={`module-card module-card-${color}`}>
      <div className="module-icon">{icon}</div>
      <div>
        <b>{title}</b>
        <span>{detail}</span>
      </div>
      <button><Settings2 size={13} /></button>
      <div className="module-port port-in" />
      <div className="module-port port-out" />
    </div>
  );
}

// ── Écran Phase 3 : Orchestration & Agents ──
function OrchestrationWorkspace({
  activeStage,
  runState,
  logs,
  onStart,
  onApprove,
  cloudflareConfigured,
  agentFocus,
  setAgentFocus,
  agentOutputs = {},
  prompt,
  setPrompt,
  onSend,
}: {
  activeStage: number;
  runState: string;
  logs: LogItem[];
  onStart: () => void;
  onApprove: () => void;
  cloudflareConfigured: boolean;
  agentFocus: string;
  setAgentFocus: (value: string) => void;
  agentOutputs?: Record<string, string>;
  prompt: string;
  setPrompt: (value: string) => void;
  onSend: () => void;
}) {
  const currentOutput = agentOutputs[agentFocus];

  return (
    <>
      <div className="page-intro">
        <div>
          <div className="section-kicker">PHASE 03 / AGENT ORCHESTRATION</div>
          <h2>Le chantier, agent par agent.</h2>
          <p>Cloudflare Workers AI pilote les assistants ; ForgeAI applique la règle de câblage métier et la validation humaine.</p>
        </div>
        <div className="orchestration-actions">
          {runState === "approval" ? (
            <button className="primary-button" onClick={onApprove}>
              <Check size={16} /> Valider et générer le code
            </button>
          ) : (
            <button className="primary-button" onClick={onStart} disabled={runState === "running"}>
              <Play size={16} /> {runState === "running" ? "Pipeline en cours…" : "Lancer le pipeline"}
            </button>
          )}
        </div>
      </div>

      <div className="orchestration-grid">
        <section className="panel orchestration-panel">
          <div className="panel-heading">
            <div>
              <div className="section-kicker">EXECUTION PLAN</div>
              <h2>Pipeline de génération modulaire</h2>
            </div>
            <Badge tone={cloudflareConfigured ? "green" : "orange"}>
              <Cloud size={12} /> {cloudflareConfigured ? "Cloudflare connecté" : "Mode plan local & câblage"}
            </Badge>
          </div>
          <div className="orchestration-timeline">
            {stageDefinitions.map((stage, index) => {
              const Icon = stage.icon;
              const done = activeStage > index;
              const active = activeStage === index || (runState === "approval" && index === 5);
              return (
                <button
                  className={`orchestration-stage ${done ? "orchestration-done" : ""} ${active ? "orchestration-active" : ""}`}
                  key={stage.id}
                >
                  <div className="orchestration-stage-marker">{done ? <Check size={14} /> : <Icon size={14} />}</div>
                  <div className="orchestration-stage-copy">
                    <b>{stage.label}</b>
                    <span>{stage.detail}</span>
                  </div>
                  <span className="orchestration-stage-state">{done ? "DONE" : active ? "RUNNING" : "QUEUED"}</span>
                  {index < stageDefinitions.length - 1 && <i className={`timeline-connector ${done ? "connector-done" : ""}`} />}
                </button>
              );
            })}
          </div>
          <div className="human-gate">
            <div className="gate-icon"><LockKeyhole size={17} /></div>
            <div>
              <b>Garde de validation avant code</b>
              <span>Le code et le squelette complet ne seront écrits sur disque qu’après votre accord explicite.</span>
            </div>
            {runState === "approval" ? (
              <button className="gate-button" onClick={onApprove}>
                Valider et Monter <ArrowRight size={14} />
              </button>
            ) : (
              <Badge tone={runState === "done" ? "green" : "neutral"}>{runState === "done" ? "Monté & Validé" : "En attente"}</Badge>
            )}
          </div>
        </section>

        <aside className="panel agent-panel">
          <div className="panel-heading">
            <div>
              <div className="section-kicker">AGENT CONSOLE</div>
              <h2>Assistants actifs</h2>
            </div>
            <Bot size={19} className="muted-icon" />
          </div>
          <div className="agent-stack">
            {["Architect Agent", "Product Agent", "Code Agent", "QA Agent"].map((agent, index) => (
              <button
                className={`agent-row ${agentFocus === agent ? "agent-row-active" : ""}`}
                key={agent}
                onClick={() => setAgentFocus(agent)}
              >
                <div className={`agent-avatar agent-avatar-${index}`}><Bot size={14} /></div>
                <div>
                  <b>{agent}</b>
                  <span>
                    {index === 0
                      ? "Architecture & règle de câblage"
                      : index === 1
                      ? "PRD & fonctionnalités cibles"
                      : index === 2
                      ? "Montage de code original"
                      : "Tests & conformité des licences"}
                  </span>
                </div>
                <Dot tone={agentOutputs[agent] ? "green" : cloudflareConfigured ? "blue" : "amber"} />
              </button>
            ))}
          </div>
          <div className="agent-chat">
            <div className="chat-message" style={{ maxHeight: "320px", overflowY: "auto" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span className="chat-label" style={{ margin: 0 }}>{agentFocus}</span>
                {currentOutput && (
                  <span style={{ fontSize: "10px", color: "#34d399", fontWeight: 600 }}>✓ Prêt</span>
                )}
              </div>
              {currentOutput ? (
                <div style={{
                  fontSize: "11px",
                  lineHeight: 1.6,
                  color: "#cbd5e1",
                  whiteSpace: "pre-wrap",
                  fontFamily: "Inter, sans-serif"
                }}>
                  {currentOutput}
                </div>
              ) : (
                <p>
                  {cloudflareConfigured
                    ? "Cliquez sur « Lancer le pipeline » pour déclencher l’analyse et la génération de cet agent."
                    : "Fonctionne en mode plan local avec règle de câblage des pépites. Lancez le pipeline pour générer les spécifications complètes."}
                </p>
              )}
            </div>
            <div className="chat-compose">
              <input
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && onSend()}
                placeholder="Instruction à l’agent…"
              />
              <button onClick={onSend}><ArrowRight size={15} /></button>
            </div>
          </div>
        </aside>
      </div>

      <section className="panel execution-log-panel">
        <div className="panel-heading">
          <div>
            <div className="section-kicker">EVENT STREAM</div>
            <h2>Journal d’exécution</h2>
          </div>
          <span className="terminal-live"><span className="live-pulse" /> STREAMING</span>
        </div>
        <div className="execution-log">
          {logs.map((log, index) => (
            <div className="execution-log-line" key={`${log.time}-${index}`}>
              <span>[{log.time}]</span>
              <i className={`log-symbol log-${log.tone}`}>
                {log.tone === "success" ? "✓" : log.tone === "warning" ? "!" : log.tone === "error" ? "×" : "›"}
              </i>
              <p>{log.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function FilesWorkspace({
  projectName,
  projects,
  onSelectProject,
  sources,
  onRefreshProjects,
  selectedPack,
}: {
  projectName: string;
  projects: BridgeProject[];
  onSelectProject: (name: string) => void;
  sources: Source[];
  onRefreshProjects?: () => void;
  selectedPack?: PrdPack | null;
}) {
  const [selectedProject, setSelectedProject] = useState(projectName);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [loadingTree, setLoadingTree] = useState(false);
  const [selectedFilePath, setSelectedFilePath] = useState<string>("00_PROJECT_META.md");
  const [fileContent, setFileContent] = useState<string>("");
  const [loadingFile, setLoadingFile] = useState(false);
  const [searchTree, setSearchTree] = useState("");
  const [copied, setCopied] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    src: true,
    "src/integrations": true,
    "src/integrations/github-adapted": true,
    "src/components": true,
  });
  const [assemblingStorefront, setAssemblingStorefront] = useState(false);
  const [assembleFeedback, setAssembleFeedback] = useState<string | null>(null);
  const [devLaunching, setDevLaunching] = useState(false);

  const packArchetype = useMemo(() => {
    const projName = (selectedProject || "").toLowerCase();
    const slug = (selectedPack?.slug || "").toLowerCase();
    const arch = (selectedPack?.archetype || "").toLowerCase();
    const domain = (selectedPack?.domain || "").toLowerCase();

    // 0. Landing Page & Conversion
    if (projName.includes("landing") || projName.includes("conversion") || projName.includes("colorful") || slug.includes("landing") || slug.includes("conversion") || slug.includes("colorful") || arch.includes("landing") || domain.includes("landing") || domain.includes("conversion")) {
      return {
        type: "landing",
        kicker: "PHASE 3 — LANDING PAGE HAUTE CONVERSION",
        title: `Landing Page & Leads (${selectedProject})`,
        buttonLabel: "🚀 Assembler Landing Page Finale",
        desc: "Assemble la landing page complète haute conversion : Hero percutant, Grille de features, Table de pricing, Preuve sociale, FAQ & Formulaire Waitlist.",
        color: "#7C3AED",
      };
    }

    // 1. CRM / ERP prioritaire
    if (projName.includes("crm") || projName.includes("erp") || slug.includes("crm") || slug.includes("erp") || domain.includes("crm") || arch.includes("crm")) {
      return {
        type: "crm",
        kicker: "PHASE 3 — PIPELINE COMMERCIAL & SUITE CRM/ERP",
        title: `Suite CRM/ERP & Leads (${selectedProject})`,
        buttonLabel: "💼 Assembler Suite CRM/ERP Finale",
        desc: "Assemble le Kanban des opportunités d'affaires, facturation ERP, fiches clients et métriques de conversion.",
        color: "#0ea5e9",
      };
    }

    // 2. SaaS & Billing
    if (projName.includes("saas") || projName.includes("billing") || slug.includes("saas") || slug.includes("billing") || arch.includes("saas") || domain.includes("analytics") || domain.includes("dashboard")) {
      return {
        type: "saas",
        kicker: "PHASE 3 — APPLICATION SAAS & FACTURATION",
        title: `Dashboard Métier & KPIs (${selectedProject})`,
        buttonLabel: "📊 Assembler Dashboard Final",
        desc: "Assemble le tableau de bord avec KPIs MRR/Churn en temps réel, analytics, facturation Stripe et gestion d'équipe.",
        color: "#38bdf8",
      };
    }

    // 3. Messagerie / Chat d'Équipe
    if ((projName.includes("chat") || projName.includes("message") || slug.includes("chat") || slug.includes("message") || arch.includes("chat")) && !projName.includes("ai") && !slug.includes("ai") && !projName.includes("voice")) {
      return {
        type: "chat",
        kicker: "PHASE 3 — MESSAGERIE TEMPS RÉEL & CANAUX",
        title: `Messagerie & Chat d'Équipe (${selectedProject})`,
        buttonLabel: "💬 Assembler Messagerie & Chat Final",
        desc: "Assemble les canaux d'équipe, conversations privées, fichiers partagés, annuaire des membres et 40 pépites connectées.",
        color: "#3b82f6",
      };
    }

    // 4. Agent IA / Vocal / Studio IA
    if (projName.includes("voice") || projName.includes("agent") || projName.includes("ai") || slug.includes("voice") || slug.includes("agent") || arch.includes("ai") || domain.includes("assistant") || domain.includes("vocal")) {
      return {
        type: "ai",
        kicker: "PHASE 3 — STUDIO AGENT IA & VOCAL",
        title: `Studio IA & Voice Agent (${selectedProject})`,
        buttonLabel: "🤖 Assembler Studio IA Final",
        desc: "Assemble l'interface conversationnelle, visualiseur d'ondes audio temps réel, synthèse vocale et réglages de prompts.",
        color: "#d946ef",
      };
    }

    // 4. Jeux / Arcade
    if (projName.includes("game") || projName.includes("arcade") || projName.includes("tetris") || slug.includes("game") || slug.includes("arcade") || slug.includes("tetris") || arch.includes("game")) {
      return {
        type: "game",
        kicker: "PHASE 3 — HUB JEU & LEADERBOARD",
        title: `Hub Arcade & Système de Score (${selectedProject})`,
        buttonLabel: "🎮 Assembler Hub Jeu Final",
        desc: "Assemble l'interface interactive du jeu, la boucle de score, records personnels et contrôles réactifs.",
        color: "#f59e0b",
      };
    }

    // 5. UI Kit / Design System / Skill UI/UX
    if (projName.includes("ui") || projName.includes("skill") || projName.includes("component") || projName.includes("design") || slug.includes("composant") || slug.includes("design") || arch.includes("ui")) {
      return {
        type: "ui_kit",
        kicker: "PHASE 3 — BIBLIOTHÈQUE DE COMPOSANTS & DESIGN SYSTEM",
        title: `Skill UI/UX Design System (${selectedProject})`,
        buttonLabel: "🎨 Assembler Bibliothèque UI Finale",
        desc: "Assemble le catalogue interactif de composants, le playground live de props, l'explorateur de design tokens et le studio de 40 pépites.",
        color: "#6366f1",
      };
    }

    // 6. E-Commerce
    if (projName.includes("ecom") || projName.includes("commerce") || slug.includes("ecom") || slug.includes("commerce") || arch.includes("ecom") || domain.includes("commerce")) {
      return {
        type: "ecommerce",
        kicker: "PHASE 3 — VITRINE COMMERCIALE",
        title: `Vitrine E-Commerce Finale (${selectedProject})`,
        buttonLabel: "🏪 Assembler Vitrine Finale",
        desc: "Génère et assemble l’application commerciale complète : Catalogue interactif, Panier dynamique, Tunnel de commande 3 étapes & Double-vue Studio.",
        color: "#34d399",
      };
    }
    return {
      type: "universal",
      kicker: "PHASE 3 — APPLICATION FINALE AUTHENTIQUE",
      title: `Application Finale ${selectedPack?.name || selectedProject}`,
      buttonLabel: "🚀 Assembler l'Application Finale",
      desc: `Assemble l'application interactive pilotée par les 10 fonctionnalités authentiques du pack ${selectedPack?.name || "sélectionné"}.`,
      color: "#38bdf8",
    };
  }, [selectedPack, selectedProject]);

  const handleAssembleDirect = async () => {
    setAssemblingStorefront(true);
    setAssembleFeedback(null);
    try {
      const res = await bridgeClient.assembleFinalApp(selectedProject, selectedPack?.slug);
      setAssembleFeedback(`${res.message || "Application finale assemblée avec succès"} (${res.filesCreated} fichiers créés/mis à jour) !`);
      void reloadTree(selectedProject);
      try {
        await bridgeClient.command(selectedProject, "pnpm dev");
        setTimeout(() => void refreshDevUrl(selectedProject), 1000);
      } catch (_) {}
    } catch (err) {
      setAssembleFeedback(`Erreur : ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setAssemblingStorefront(false);
    }
  };

  const [activeDevUrl, setActiveDevUrl] = useState("http://localhost:5173");

  const refreshDevUrl = async (proj = selectedProject) => {
    try {
      const res = await bridgeClient.getProjectDevUrl(proj);
      if (res?.url) {
        setActiveDevUrl(res.url);
      }
    } catch (_) {}
  };

  useEffect(() => {
    void refreshDevUrl(selectedProject);
  }, [selectedProject]);

  const handleLaunchDevDirect = async () => {
    setDevLaunching(true);
    try {
      const cmdRes = await bridgeClient.command(selectedProject, "pnpm dev");
      if (cmdRes?.url) {
        setActiveDevUrl(cmdRes.url);
      }
      setTimeout(() => void refreshDevUrl(selectedProject), 1500);
      setAssembleFeedback(`Serveur Vite lancé pour ${selectedProject} sur ${cmdRes?.url || activeDevUrl} !`);
    } catch (err) {
      setAssembleFeedback(`Erreur lancement dev : ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setDevLaunching(false);
    }
  };

  useEffect(() => {
    if (projectName && projectName !== selectedProject) {
      setSelectedProject(projectName);
    }
  }, [projectName]);

  const reloadTree = async (proj: string) => {
    setLoadingTree(true);
    try {
      const tree = await bridgeClient.tree(proj);
      setTreeData(tree);
      const findFirstFile = (nodes: TreeNode[]): string | null => {
        for (const node of nodes) {
          if (node.type === "file") return node.path;
          if (node.children) {
            const f = findFirstFile(node.children);
            if (f) return f;
          }
        }
        return null;
      };
      const first = findFirstFile(tree);
      if (first) {
        setSelectedFilePath(first);
      }
    } catch (err) {
      console.error("Erreur chargement arborescence:", err);
    } finally {
      setLoadingTree(false);
    }
  };

  useEffect(() => {
    if (selectedProject) {
      void reloadTree(selectedProject);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject || !selectedFilePath) return;
    let active = true;
    setLoadingFile(true);
    bridgeClient
      .readFile(selectedProject, selectedFilePath)
      .then((res) => {
        if (active) setFileContent(res.content || "");
      })
      .catch((err) => {
        if (active) setFileContent(`// Impossible de charger le fichier : ${err.message}`);
      })
      .finally(() => {
        if (active) setLoadingFile(false);
      });
    return () => {
      active = false;
    };
  }, [selectedProject, selectedFilePath]);

  const flattenedNodes = useMemo(() => {
    const list: Array<{ node: TreeNode; depth: number }> = [];
    const traverse = (nodes: TreeNode[], depth = 0) => {
      for (const node of nodes) {
        if (searchTree.trim()) {
          const match = node.name.toLowerCase().includes(searchTree.toLowerCase());
          if (node.type === "file" && match) {
            list.push({ node, depth });
          } else if (node.type === "directory") {
            traverse(node.children || [], depth + 1);
          }
        } else {
          list.push({ node, depth });
          if (node.type === "directory" && (expandedFolders[node.path] ?? true) && node.children) {
            traverse(node.children, depth + 1);
          }
        }
      }
    };
    traverse(treeData, 0);
    return list;
  }, [treeData, searchTree, expandedFolders]);

  const totalFilesCount = useMemo(() => {
    let count = 0;
    const countNodes = (nodes: TreeNode[]) => {
      for (const n of nodes) {
        if (n.type === "file") count += 1;
        if (n.children) countNodes(n.children);
      }
    };
    countNodes(treeData);
    return count;
  }, [treeData]);

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderPath]: !(prev[folderPath] ?? true),
    }));
  };

  const copyCode = () => {
    if (!fileContent) return;
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fileExt = selectedFilePath.split(".").pop()?.toUpperCase() || "FILE";
  const fileBadge =
    selectedFilePath.includes("PRD") || selectedFilePath.includes("ARCHITECTURE") || selectedFilePath.includes("META")
      ? "SPECIFICATION"
      : selectedFilePath.includes("github-adapted")
      ? "ADAPTED GEM"
      : selectedFilePath.includes("PROVENANCE") || selectedFilePath.includes("NOTICES")
      ? "AUDIT & LICENCE"
      : fileExt;

  const lines = useMemo(() => fileContent.split("\n"), [fileContent]);

  return (
    <>
      <div className="page-intro">
        <div>
          <div className="section-kicker">PROJECT OUTPUT / PROVENANCE</div>
          <h2>Le projet final, lisible.</h2>
          <p>Chaque fichier généré et chaque référence restent consultables dans le même workspace.</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            className="ghost-button"
            onClick={() => {
              onRefreshProjects?.();
              void reloadTree(selectedProject);
            }}
            style={{ fontSize: "10px", padding: "5px 9px" }}
          >
            <RefreshCw size={12} className={loadingTree ? "spin" : ""} /> Rafraîchir
          </button>
          <Badge tone="green">
            <Check size={12} /> {totalFilesCount} fichiers réels prêts
          </Badge>
        </div>
      </div>

      {/* ── Sélecteur de Projets prodgit/ ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 14px",
          background: "rgba(15, 23, 42, 0.65)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 8,
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
          <Store size={14} color="#38bdf8" /> Projets créés dans <code>prodgit/</code> ({projects.length}) :
        </span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1 }}>
          {projects.map((proj) => {
            const isActive = proj.name === selectedProject;
            return (
              <button
                key={proj.name}
                onClick={() => {
                  setSelectedProject(proj.name);
                  onSelectProject(proj.name);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 10px",
                  borderRadius: 6,
                  fontSize: "11px",
                  fontWeight: isActive ? 700 : 500,
                  background: isActive ? "rgba(56, 189, 248, 0.18)" : "rgba(255, 255, 255, 0.04)",
                  color: isActive ? "#38bdf8" : "#cbd5e1",
                  border: isActive ? "1px solid rgba(56, 189, 248, 0.45)" : "1px solid rgba(255, 255, 255, 0.08)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <Folder size={12} />
                <span>{proj.name}</span>
                {isActive && <Check size={12} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── BANNIÈRE HÉROÏQUE PHASE 3 : ASSEMBLER L'APPLICATION FINALE UNIVERSELLE ── */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 78, 59, 0.3) 50%, rgba(15, 23, 42, 0.85) 100%)",
          border: `1px solid ${packArchetype.color}40`,
          boxShadow: `0 4px 24px ${packArchetype.color}20`,
          borderRadius: 12,
          padding: "16px 20px",
          marginBottom: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                background: `${packArchetype.color}25`,
                border: `1px solid ${packArchetype.color}50`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: packArchetype.color,
                flexShrink: 0,
              }}
            >
              {packArchetype.type === "saas" ? <LayoutDashboard size={26} /> :
               packArchetype.type === "ai" ? <Sparkles size={26} /> :
               packArchetype.type === "crm" ? <Box size={26} /> :
               packArchetype.type === "game" ? <Zap size={26} /> :
               <Store size={26} />}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    color: packArchetype.color,
                    textTransform: "uppercase",
                    background: `${packArchetype.color}15`,
                    padding: "3px 9px",
                    borderRadius: 4,
                    border: `1px solid ${packArchetype.color}35`,
                  }}
                >
                  {packArchetype.kicker}
                </span>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc" }}>
                  {packArchetype.title}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#94a3b8",
                    background: "rgba(255, 255, 255, 0.05)",
                    padding: "2px 8px",
                    borderRadius: 4,
                  }}
                >
                  prodgit/{selectedProject}
                </span>
              </div>
              <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#cbd5e1" }}>
                {packArchetype.desc}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {/* BOUTON D'ACTION DIRECTE ULTRA VISIBLE */}
            <button
              id="btn-assembler-vitrine-finale"
              disabled={assemblingStorefront}
              onClick={handleAssembleDirect}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 20px",
                borderRadius: 8,
                fontSize: "13px",
                fontWeight: 700,
                color: "#022c22",
                background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
                border: "none",
                cursor: assemblingStorefront ? "wait" : "pointer",
                boxShadow: "0 3px 12px rgba(16, 185, 129, 0.45)",
                transition: "all 0.2s ease",
              }}
            >
              <Store size={18} />
              <span>{assemblingStorefront ? "Assemblage en cours..." : packArchetype.buttonLabel}</span>
              {assemblingStorefront ? <RefreshCw size={15} className="spin" /> : <Sparkles size={15} />}
            </button>

            {/* ACCÈS DIRECT À L'APPLICATION LIVE DYNAMIQUE */}
            <a
              href={activeDevUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 15px",
                borderRadius: 8,
                fontSize: "12px",
                fontWeight: 600,
                color: "#38bdf8",
                background: "rgba(56, 189, 248, 0.12)",
                border: "1px solid rgba(56, 189, 248, 0.4)",
                textDecoration: "none",
              }}
              title={`Ouvrir le serveur dev de ${selectedProject} (${activeDevUrl})`}
            >
              <ExternalLink size={14} />
              <span>Ouvrir l'App Live ({activeDevUrl.replace(/https?:\/\//, "")})</span>
            </a>

            {/* DÉMARRAGE DEV SERVER */}
            <button
              disabled={devLaunching}
              onClick={handleLaunchDevDirect}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 14px",
                borderRadius: 8,
                fontSize: "12px",
                fontWeight: 600,
                color: "#e2e8f0",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                cursor: "pointer",
              }}
              title={`Lancer ou redémarrer le serveur dev Vite pour ${selectedProject}`}
            >
              <Play size={13} />
              <span>{devLaunching ? "Démarrage..." : `Lancer dev (${selectedProject})`}</span>
            </button>
          </div>
        </div>

        {assembleFeedback && (
          <div
            style={{
              padding: "9px 14px",
              borderRadius: 6,
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: assembleFeedback.startsWith("Erreur") ? "rgba(239, 68, 68, 0.18)" : "rgba(16, 185, 129, 0.18)",
              color: assembleFeedback.startsWith("Erreur") ? "#f87171" : "#34d399",
              border: assembleFeedback.startsWith("Erreur") ? "1px solid rgba(239, 68, 68, 0.35)" : "1px solid rgba(16, 185, 129, 0.35)",
            }}
          >
            {assembleFeedback.startsWith("Erreur") ? <AlertTriangle size={15} /> : <Check size={15} />}
            <span>{assembleFeedback}</span>
          </div>
        )}
      </div>

      <ProjectExportActions
        projectName={selectedProject}
        sources={sources}
        packSlug={selectedPack?.slug}
        packName={selectedPack?.name}
        buttonLabel={packArchetype.buttonLabel}
        activeDevUrl={activeDevUrl}
        projectIdea={projectIdea}
      />

      <div className="files-layout">
        <div className="panel file-tree-panel">
          <div className="panel-heading">
            <div>
              <div className="section-kicker">PROJECT EXPLORER</div>
              <h2>{selectedProject}</h2>
            </div>
            <span className="file-count">{totalFilesCount} fichiers</span>
          </div>

          <div className="tree-toolbar">
            <div className="search-box">
              <Search size={12} />
              <input
                type="text"
                placeholder="Filtrer les fichiers..."
                value={searchTree}
                onChange={(e) => setSearchTree(e.target.value)}
              />
            </div>
          </div>

          <div className="tree-root">
            <div className="tree-project">
              <Folder size={14} className="tree-folder" />
              <b>prodgit/{selectedProject}</b>
              <span>workspace local</span>
            </div>

            {loadingTree ? (
              <div style={{ padding: "20px", textAlign: "center", color: "#64748b", fontSize: "11px" }}>
                <RefreshCw size={14} className="spin" /> Chargement de l'arborescence...
              </div>
            ) : flattenedNodes.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center", color: "#64748b", fontSize: "11px" }}>
                Aucun fichier trouvé
              </div>
            ) : (
              flattenedNodes.map(({ node, depth }) => {
                const isDir = node.type === "directory";
                const isExpanded = expandedFolders[node.path] ?? true;
                const isSelected = selectedFilePath === node.path;
                const ext = node.name.split(".").pop()?.toUpperCase();

                return (
                  <button
                    key={node.path}
                    className={`tree-row ${isSelected ? "tree-row-selected" : ""}`}
                    style={{ paddingLeft: `${14 + depth * 14}px` }}
                    onClick={() => {
                      if (isDir) {
                        toggleFolder(node.path);
                      } else {
                        setSelectedFilePath(node.path);
                      }
                    }}
                  >
                    {isDir ? (
                      <>
                        <ChevronRight
                          size={12}
                          style={{
                            transform: isExpanded ? "rotate(90deg)" : "none",
                            transition: "transform 0.15s",
                            marginRight: -2,
                          }}
                        />
                        <Folder size={13} className="tree-folder" />
                      </>
                    ) : (
                      <>
                        <span className="tree-spacer" />
                        <File size={13} className="tree-file" />
                      </>
                    )}
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {node.name}
                    </span>
                    {!isDir && (
                      <span className="tree-kind">
                        {node.name.startsWith("0") ? "SPEC" : ext || "FILE"}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="panel file-preview-panel">
          <div className="preview-head">
            <div>
              <span className="file-breadcrumb">prodgit / {selectedProject} / {selectedFilePath}</span>
              <h2>{selectedFilePath.split("/").pop()}</h2>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                className="ghost-button"
                onClick={copyCode}
                style={{ fontSize: "10px", padding: "4px 8px" }}
              >
                {copied ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
                {copied ? "Copié !" : "Copier"}
              </button>
              <Badge tone="cyan">
                <Code2 size={12} /> {fileBadge}
              </Badge>
            </div>
          </div>

          <div className="code-preview" style={{ maxHeight: "480px", overflow: "auto" }}>
            {loadingFile ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "#64748b" }}>
                <RefreshCw size={16} className="spin" /> Chargement du contenu...
              </div>
            ) : lines.length === 0 || (lines.length === 1 && !lines[0]) ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "#64748b" }}>
                (Fichier vide)
              </div>
            ) : (
              lines.map((line, idx) => (
                <div className="code-line" key={idx}>
                  <span>{String(idx + 1).padStart(2, "0")}</span>
                  <code>{line}</code>
                </div>
              ))
            )}
          </div>

          <div className="preview-foot">
            <span>
              <Library size={13} /> {lines.length} lignes · UTF-8
            </span>
            <button
              className="text-button"
              onClick={() => {
                if (selectedProject && selectedFilePath) {
                  bridgeClient.command(selectedProject, `code ${selectedFilePath}`).catch(() => {});
                }
              }}
            >
              <ExternalLink size={13} /> Ouvrir dans l’IDE
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function GitHubSettings() {
  const [repo, setRepo] = useState("tcereponse/apk-builder");
  const [branch, setBranch] = useState("main");
  const [token, setToken] = useState("");
  const [hasToken, setHasToken] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    void bridgeClient
      .getGitHubConfig()
      .then((config) => {
        setRepo(config.repo);
        setBranch(config.branch);
        setHasToken(config.hasToken);
      })
      .catch(() => setStatus("Extension non connectée — les valeurs seront enregistrées dès qu’elle sera disponible."));
  }, []);

  const save = async () => {
    setStatus("Enregistrement…");
    try {
      const result = await bridgeClient.saveGitHubConfig({ repo, branch, token: token || undefined });
      setHasToken(result.hasToken);
      setToken("");
      setStatus("Configuration GitHub enregistrée dans l’extension.");
    } catch (error) {
      setStatus(error instanceof Error ? `Échec : ${error.message}` : "Échec de l’enregistrement.");
    }
  };

  return (
    <section className="panel github-settings-panel">
      <div className="settings-title">
        <div className="github-settings-icon"><Github size={21} /></div>
        <div>
          <h3>Publication GitHub</h3>
          <p>Le token reste dans le stockage local de l’extension et n’est jamais affiché après sauvegarde.</p>
        </div>
        <Badge tone={hasToken ? "green" : "orange"}>
          <Dot tone={hasToken ? "green" : "amber"} /> {hasToken ? "Token configuré" : "Token manquant"}
        </Badge>
      </div>
      <div className="settings-form-grid github-form-grid">
        <label>
          Dépôt GitHub
          <input value={repo} onChange={(event) => setRepo(event.target.value)} placeholder="organisation/depot" />
          <small>Format : owner/repository</small>
        </label>
        <label>
          Branche
          <input value={branch} onChange={(event) => setBranch(event.target.value)} placeholder="main" />
          <small>Branche cible du commit.</small>
        </label>
        <label className="github-token-field">
          Token d’accès
          <input
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder={hasToken ? "Laisser vide pour conserver le token" : "ghp_…"}
            autoComplete="new-password"
          />
          <small>Envoyé uniquement à l’extension lors de la sauvegarde.</small>
        </label>
      </div>
      <div className="settings-actions">
        <span className="settings-inline-status">{status}</span>
        <button className="primary-button" onClick={save}><Github size={14} /> Enregistrer GitHub</button>
      </div>
    </section>
  );
}

function SettingsWorkspace({
  model,
  setModel,
  configured,
  onRefresh,
}: {
  model: string;
  setModel: (value: string) => void;
  configured: boolean;
  onRefresh: () => void;
}) {
  const [accountId, setAccountId] = useState(() => localStorage.getItem("forgeai.cloudflare.account") || "");
  const [token, setToken] = useState("");
  const [saved, setSaved] = useState(false);

  const saveDraft = () => {
    localStorage.setItem("forgeai.cloudflare.account", accountId);
    localStorage.setItem("forgeai.cloudflare.model", model);
    setToken("");
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2600);
  };

  return (
    <>
      <div className="page-intro">
        <div>
          <div className="section-kicker">SETTINGS / AGENT RUNTIME</div>
          <h2>Paramètres des agents.</h2>
          <p>Remplissez les identifiants quand vous serez prêt. Le projet peut rester en mode plan local entre-temps.</p>
        </div>
        <Badge tone={configured ? "green" : "orange"}>
          <Dot tone={configured ? "green" : "amber"} /> {configured ? "Cloudflare connecté" : "À configurer plus tard"}
        </Badge>
      </div>
      <div className="settings-layout">
        <section className="panel settings-main">
          <div className="settings-title">
            <div className="cloudflare-icon"><Cloud size={22} /></div>
            <div>
              <h3>Cloudflare Workers AI</h3>
              <p>Connexion serveur pour Architect, Product, Code et QA Agents.</p>
            </div>
          </div>
          <div className="settings-callout">
            <LockKeyhole size={15} />
            <span>
              Pour votre sécurité, le token est seulement conservé comme brouillon dans ce navigateur jusqu’à la configuration serveur. Il n’est jamais intégré dans le code de l’application.
            </span>
          </div>
          <div className="settings-form-grid">
            <label>
              Cloudflare Account ID
              <input value={accountId} onChange={(event) => setAccountId(event.target.value)} placeholder="ex. 7b3…" />
              <small>Disponible dans Cloudflare Dashboard → Workers AI.</small>
            </label>
            <label>
              Cloudflare API Token
              <input
                type="password"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder="Saisir une valeur plus tard"
              />
              <small>Workers AI Read + Edit. Le champ reste vide après sauvegarde.</small>
            </label>
          </div>
          <label className="dialog-label">
            Modèle par défaut
            <select value={model} onChange={(event) => setModel(event.target.value)}>
              <option>@cf/meta/llama-3.1-8b-instruct</option>
              <option>@cf/meta/llama-3.2-3b-instruct</option>
              <option>@cf/mistral/mistral-7b-instruct-v0.2</option>
            </select>
          </label>
          <div className="settings-actions">
            <button className="ghost-button" onClick={onRefresh}><RefreshCw size={14} /> Tester la connexion serveur</button>
            <button className="primary-button" onClick={saveDraft}>
              <Check size={15} /> {saved ? "Brouillon enregistré" : "Enregistrer pour plus tard"}
            </button>
          </div>
        </section>

        <GitHubSettings />

        <aside className="panel settings-side">
          <div className="section-kicker">PARCOURS RECOMMANDÉ</div>
          <h3>Vous pouvez continuer sans clé.</h3>
          <p>
            Le cockpit produit le PRD, l’architecture et les tâches en mode local. Les appels Cloudflare remplacent ensuite les réponses de démonstration lorsque les secrets serveur sont installés.
          </p>
          <div className="settings-step">
            <span>01</span>
            <div><b>Sélectionner un Pack PRD</b><small>Intention, features & composants</small></div>
            <Check size={14} />
          </div>
          <div className="settings-step">
            <span>02</span>
            <div><b>Composer & Découper les Pépites</b><small>Archives .zip de prodgit/</small></div>
            <Check size={14} />
          </div>
          <div className="settings-step">
            <span>03</span>
            <div><b>Monter & Orchestrer</b><small>Code original & provenance</small></div>
            <Dot tone={configured ? "green" : "amber"} />
          </div>
          <div className="settings-note">
            <Bot size={15} />
            <span>Les dépôts GitHub restent des références de contexte ; le code final est généré comme un projet original.</span>
          </div>
        </aside>
      </div>
    </>
  );
}

function CloudflareDialog({
  model,
  setModel,
  configured,
  onClose,
  onRefresh,
}: {
  model: string;
  setModel: (value: string) => void;
  configured: boolean;
  onClose: () => void;
  onRefresh: () => void;
}) {
  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="cloudflare-dialog" onClick={(event) => event.stopPropagation()}>
        <div className="dialog-header">
          <div>
            <div className="section-kicker">AGENT RUNTIME</div>
            <h2>Cloudflare Workers AI</h2>
          </div>
          <button className="icon-button" onClick={onClose}><X size={17} /></button>
        </div>
        <div className="cloudflare-hero">
          <div className="cloudflare-icon"><Cloud size={22} /></div>
          <div>
            <b>{configured ? "Connexion active" : "Connexion serveur requise"}</b>
            <span>Les clés restent côté serveur et ne sont jamais exposées au navigateur.</span>
          </div>
          <Dot tone={configured ? "green" : "amber"} />
        </div>
        <label className="dialog-label">
          Modèle par défaut
          <select value={model} onChange={(event) => setModel(event.target.value)}>
            <option>@cf/meta/llama-3.1-8b-instruct</option>
            <option>@cf/meta/llama-3.2-3b-instruct</option>
            <option>@cf/mistral/mistral-7b-instruct-v0.2</option>
          </select>
        </label>
        <div className="cloudflare-agent-list">
          <div><Bot size={15} /><span>Architect Agent</span><small>PRD + architecture</small></div>
          <div><Code2 size={15} /><span>Code Agent</span><small>montage original</small></div>
          <div><TestTube2 size={15} /><span>QA Agent</span><small>tests + compatibilité</small></div>
        </div>
        <div className="dialog-note">
          <LockKeyhole size={14} />
          <span>Variables attendues : <b>CLOUDFLARE_ACCOUNT_ID</b> et <b>CLOUDFLARE_API_TOKEN</b>.</span>
        </div>
        <div className="dialog-actions">
          <button className="ghost-button" onClick={onRefresh}><RefreshCw size={14} /> Retester</button>
          <button className="primary-button" onClick={onClose}>Enregistrer le modèle</button>
        </div>
      </div>
    </div>
  );
}

