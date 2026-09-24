/* KIROV5 Orchestrator — Constants & Config
   Fusion v16 (modulaire) + KIROV4 (bridge, GitHub, injection) */

const PIPELINE_STEPS = [
  { id: 0, order: "read",   document: "00_PROJECT_META.md",     label: "Métadonnées projet",     phase: "intake" },
  { id: 1, order: "create", document: "01_PRD.md",              label: "Exigences produit (PRD)", phase: "spec" },
  { id: 2, order: "create", document: "02_ARCHITECTURE.md",     label: "Architecture technique",  phase: "spec" },
  { id: 3, order: "create", document: "03_SKILLS.yaml",         label: "Définition des skills",   phase: "spec" },
  { id: 4, order: "create", document: "04_TASKS.md",            label: "Découpage des tâches",    phase: "plan" },
  { id: 5, order: "create", document: "05_FILE_TREE.md",        label: "Arborescence fichiers",   phase: "plan" },
  { id: 6, order: "create", document: "06_PROMPT_WORKFLOW.md",  label: "Workflow des prompts",    phase: "plan" },
  { id: 7, order: "create", document: "07_VALIDATION_RULES.md", label: "Règles de validation",    phase: "gate" },
  { id: 8, order: "create", document: "08_ORDERS.md",           label: "Ordres d'exécution",      phase: "gate" },
  { id: 9, order: "codegen", document: null,                   label: "Génération du code",      phase: "code" },
  { id: 10, order: "finalize", document: null,                 label: "Écriture disque",         phase: "write" },
];

const PACK_FILES = [
  "00_PROJECT_META.md",
  "01_PRD.md",
  "02_ARCHITECTURE.md",
  "03_SKILLS.yaml",
  "04_TASKS.md",
  "05_FILE_TREE.md",
  "06_PROMPT_WORKFLOW.md",
  "07_VALIDATION_RULES.md",
  "08_ORDERS.md",
  "SOURCES_GITHUB.md",
  "sources.github.json",
  "DEPENDENCY_AUDIT.md",
];

const VALID_ACTIONS = ["read", "create", "validate", "advance", "codegen", "finalize"];

const ERROR_TYPES = {
  UNAUTHORIZED_DOCUMENT: "UNAUTHORIZED_DOCUMENT",
  UNAUTHORIZED_ACTION: "UNAUTHORIZED_ACTION",
  STEP_LOCKED: "STEP_LOCKED",
  INVALID_RESPONSE: "INVALID_RESPONSE",
  VALIDATION_FAILED: "VALIDATION_FAILED",
  API_ERROR: "API_ERROR",
  NO_PACK: "NO_PACK",
  NO_FOLDER: "NO_FOLDER",
  INJECT_FAILED: "INJECT_FAILED",
  CAPTURE_FAILED: "CAPTURE_FAILED",
};

const SYSTEM_PROMPT = `You are a controlled executor in a step-by-step orchestration pipeline.
You receive ONE JSON command at a time from the orchestrator extension.
Rules:
1. Read ONLY the document specified in the command.
2. Respond with a single JSON object: {"status":"ok"|"error","document":"<filename>","content":"<your full output>","ready":true|false}
3. Never request documents you have not been given.
4. Stay within the current step. Do not jump ahead.
5. For markdown files, produce complete meaningful content with headings.
6. For YAML files, produce valid YAML.
If you cannot fulfill the command, respond with {"status":"error","message":"<reason>","ready":false}.`;

const SILENCE_ABSOLU = `
SILENCE ABSOLU — RÈGLE S1:
- Ne génère AUCUN texte conversationnel (pas de "Voici", "Le projet", etc.)
- AUCUNE explication, AUCUNE introduction, AUCUNE conclusion
- UNIQUEMENT du JSON valide avec les fichiers
- Format strict: {"files":[{"path":"...","content":"...","language":"..."}]}

RÈGLES DE STRUCTURE (R1-R5):
- index.html en MINUSCULES avec id="root"
- vite.config.ts présent avec plugins:[react()]
- package.json: type:"module", build:"vite build", dev:"vite"
- HashRouter OBLIGATOIRE (JAMAIS BrowserRouter)

RÈGLES DE CHEMINS REACT (CRITIQUE):
- Chaque path DOIT avoir l'extension correcte: .tsx .ts .css .html .json .js
- JAMAIS d'extension .txt
- Composants React → .tsx | hooks/utils/store/types → .ts | styles → .css
- Obligatoires: index.html, package.json, vite.config.ts, src/main.tsx, src/App.tsx, src/index.css

INTERDICTIONS (X1-X12):
- JAMAIS package.js, tsconfig.js, App.ts, main.js, *.vue, *.txt
- Toutes balises JSX DOIVENT être fermées
- Pas de préfixe de langage dans le contenu des fichiers
`;

const STORAGE_KEYS = {
  PACK: "kirov_pack",
  API_KEY: "kirov_api_key",
  API_KEYS: "kirov_api_keys",
  PROVIDER: "kirov_provider",
  MODEL: "kirov_model",
  MODELS: "kirov_models",
  PROJECTS: "kirov_projects",
  FOLDER_NAME: "kirov_folder_name",
  TARGET_PATH: "kirov_target_path",
  EXEC_MODE: "kirov_exec_mode",
  WEB_AI: "kirov_web_ai",
  GITHUB_TOKEN: "github_token",
  GITHUB_REPO: "github_repo",
  GITHUB_BRANCH: "github_branch",
  BRIDGE_URL: "kirov_bridge_url",
  BRIDGE_VERCEL: "kirov_bridge_vercel",
  BRIDGE_ENABLED: "kirov_bridge_enabled",
  BRIDGE_INTERVAL: "kirov_bridge_interval",
  LOGS: "kirov_logs",
  PIPELINE_RUNNING: "kirov_pipeline_running",
  CAPTURED_FILES: "kirov_captured_files",
  GITHUB_SOURCE_POLICY: "kirov_github_source_policy",
  GITHUB_SEARCH_CACHE: "kirov_github_search_cache",
  PROJECT_SOURCES: "kirov_project_sources",
};

const PROVIDERS = {
  deepseek: {
    id: "deepseek",
    label: "DeepSeek",
    apiUrl: "https://api.deepseek.com/v1/chat/completions",
    modelsUrl: "https://api.deepseek.com/v1/models",
    model: "deepseek-chat",
    format: "openai",
    apiKeyLabel: "Clé API DeepSeek",
    placeholder: "sk-...",
    needsKey: true,
    color: "#4d6bfe",
  },
  openai: {
    id: "openai",
    label: "OpenAI (GPT)",
    apiUrl: "https://api.openai.com/v1/chat/completions",
    modelsUrl: "https://api.openai.com/v1/models",
    model: "gpt-4o",
    format: "openai",
    apiKeyLabel: "Clé API OpenAI",
    placeholder: "sk-...",
    needsKey: true,
    color: "#10a37f",
  },
  claude: {
    id: "claude",
    label: "Claude (Anthropic)",
    apiUrl: "https://api.anthropic.com/v1/messages",
    modelsUrl: "https://api.anthropic.com/v1/models",
    model: "claude-sonnet-4-20250514",
    format: "anthropic",
    apiKeyLabel: "Clé API Anthropic",
    placeholder: "sk-ant-...",
    needsKey: true,
    color: "#d97706",
  },
  gemini: {
    id: "gemini",
    label: "Gemini (Google)",
    apiUrl: "https://generativelanguage.googleapis.com/v1beta/models",
    modelsUrl: "https://generativelanguage.googleapis.com/v1beta/models",
    model: "gemini-2.5-flash",
    format: "gemini",
    apiKeyLabel: "Clé API Google AI",
    placeholder: "AIza...",
    needsKey: true,
    color: "#4285f4",
  },
  mistral: {
    id: "mistral",
    label: "Mistral AI",
    apiUrl: "https://api.mistral.ai/v1/chat/completions",
    modelsUrl: "https://api.mistral.ai/v1/models",
    model: "mistral-large-latest",
    format: "openai",
    apiKeyLabel: "Clé API Mistral",
    placeholder: "...",
    needsKey: true,
    color: "#ff7000",
  },
  gemma: {
    id: "gemma",
    label: "Gemma 2 (Local Ollama)",
    apiUrl: "http://localhost:11434/v1/chat/completions",
    modelsUrl: "http://localhost:11434/api/tags",
    model: "gemma2",
    format: "openai",
    apiKeyLabel: "Clé locale (optionnel)",
    placeholder: "ollama (laisser vide)",
    needsKey: false,
    color: "#8b5cf6",
  },
};

const DEFAULT_PROVIDER = "deepseek";

const MODEL_PREFERENCES = {
  deepseek: ["deepseek-chat", "deepseek-coder", "deepseek-reasoner"],
  openai: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-4.1", "o3-mini", "gpt-3.5-turbo"],
  claude: [
    "claude-sonnet-4-20250514",
    "claude-opus-4-20250514",
    "claude-3-5-sonnet-latest",
    "claude-3-5-sonnet-20241022",
    "claude-3-haiku-20240307",
  ],
  gemini: [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-flash-latest",
    "gemini-pro-latest",
  ],
  mistral: ["mistral-large-latest", "mistral-medium-latest", "mistral-small-latest", "codestral-latest"],
  gemma: ["gemma2", "gemma2:9b", "gemma2:27b", "gemma2:2b", "gemma3"],
};

const WEB_AI_TARGETS = {
  deepseek: {
    id: "deepseek",
    label: "🐋 DeepSeek Web",
    url: "https://chat.deepseek.com/",
    match: "*://*.deepseek.com/*",
  },
  gemini: {
    id: "gemini",
    label: "✨ Gemini Web",
    url: "https://gemini.google.com/app",
    match: "*://gemini.google.com/*",
  },
  chatgpt: {
    id: "chatgpt",
    label: "🟢 ChatGPT Web",
    url: "https://chatgpt.com/",
    match: "*://chatgpt.com/*",
  },
  kimi: {
    id: "kimi",
    label: "🌙 Kimi Web",
    url: "https://www.kimi.com/fr?chat_enter_method=new_chat",
    match: "*://*.kimi.com/*",
  },
  perplexity: {
    id: "perplexity",
    label: "🔍 Perplexity",
    url: "https://www.perplexity.ai/",
    match: "*://*.perplexity.ai/*",
  },
  claude: {
    id: "claude",
    label: "🟣 Claude Web",
    url: "https://claude.ai/",
    match: "*://*.claude.ai/*",
  },
  qwen: {
    id: "qwen",
    label: "🌐 Qwen Web",
    url: "https://chat.qwen.ai/",
    match: "*://*.qwen.ai/*",
  },
  notebooklm: {
    id: "notebooklm",
    label: "📝 NotebookLM",
    url: "https://notebooklm.google.com/",
    match: "*://notebooklm.google.com/*",
  },
};

const BRIDGE_DEFAULTS = {
  SERVER_URL: "http://127.0.0.1:5006",
  VERCEL_URL: "http://localhost:3006",
  POLLING_INTERVAL: 2500,
};

const CAPTURE_CONFIG = {
  CHECK_INTERVAL: 2500,
  TIMEOUT: 300000,
  MIN_RESPONSE_LENGTH: 200,
  STABLE_CHECKS_REQUIRED: 3,
  POST_GENERATION_COOLDOWN: 8000,
  MIN_FILES_REQUIRED: 1,
  CONTENT_DROP_THRESHOLD: 0.5,
};

const EXEC_MODES = {
  API: "api",
  WEB: "web",
  HYBRID: "hybrid",
};

const EXTENSION_VERSION = "5.3.0";
const EXTENSION_NAME = "ForgeAI Studio Builder";
