import { useMemo, useState } from "react";
import { Check, Download, FolderDown, Github, HardDrive, Loader2, Play, Store, Terminal, UploadCloud, LayoutDashboard, Briefcase, Bot, Gamepad2, Sparkles, MessageSquare, Rocket } from "lucide-react";
import { bridgeClient, type ProjectFile } from "@/lib/bridgeClient";
import { downloadProjectZip, publishProjectToGitHub, writeWithDirectoryPicker, writeWithLocalBridge } from "@/lib/projectExport";

type Props = {
  projectName: string;
  sources: Array<{ repo: string; license: string }>;
  files?: ProjectFile[];
  packSlug?: string | null;
  packName?: string;
  buttonLabel?: string;
  activeDevUrl?: string;
  onLog?: (message: string) => void;
};

function generatedFiles(projectName: string, sources: Props["sources"]): ProjectFile[] {
  const provenance = sources.map((source) => `- ${source.repo} (${source.license})`).join("\n");
  return [
    { path: "README.md", content: `# ${projectName}\n\nProjet original assemblé par ForgeAI Studio Builder.\n` },
    { path: "SOURCES_GITHUB.md", content: `# Sources GitHub\n\nRéférences de contexte et de provenance — aucun code n’est copié automatiquement.\n\n${provenance}\n` },
    { path: "sources.github.json", content: JSON.stringify({ project: projectName, generatedAt: new Date().toISOString(), sources }, null, 2) },
    { path: "01_PRD.md", content: `# PRD\n\nApplication construite pour le workspace ${projectName}.\n` },
    { path: "02_ARCHITECTURE.md", content: "# Architecture\n\nNavigation multi-écrans, pipeline, back-office et agents.\n" },
    { path: "src/agents/orchestrator.ts", content: `export const projectName = ${JSON.stringify(projectName)};\nexport const agents = ["architect", "product", "code", "qa"];\n` },
    { path: "package.json", content: JSON.stringify({ name: projectName, private: true, scripts: { dev: "vite --port 5173", install: "pnpm install" } }, null, 2) },
  ];
}

export function ProjectExportActions({ projectName, sources, files: projectFiles, packSlug, packName, buttonLabel, activeDevUrl = "http://localhost:5173", onLog }: Props) {
  const files = useMemo(() => projectFiles?.length ? projectFiles : generatedFiles(projectName, sources), [projectName, projectFiles, sources]);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // Déterminer dynamiquement le label et l'icône de l'action d'assemblage selon le projet / pack
  const actionMeta = useMemo(() => {
    const p = (packSlug || projectName || "").toLowerCase();
    if (buttonLabel) {
      return {
        label: buttonLabel.replace(/^[^\w\s]+/, "").trim(),
        fullLabel: buttonLabel,
        icon: buttonLabel.includes("Dashboard") ? LayoutDashboard : buttonLabel.includes("CRM") ? Briefcase : buttonLabel.includes("Studio") ? Bot : buttonLabel.includes("Jeu") ? Gamepad2 : Store,
        color: "#38bdf8",
      };
    }
    if (p.includes("saas") || p.includes("billing")) {
      return {
        label: "Assembler Dashboard Final",
        fullLabel: "📊 Assembler Dashboard Final",
        icon: LayoutDashboard,
        color: "#38bdf8",
      };
    }
    if (p.includes("crm") || p.includes("erp")) {
      return {
        label: "Assembler Suite CRM/ERP Finale",
        fullLabel: "💼 Assembler Suite CRM/ERP Finale",
        icon: Briefcase,
        color: "#0ea5e9",
      };
    }
    if (p.includes("landing") || p.includes("conversion") || p.includes("colorful") || packSlug?.includes("landing") || packSlug?.includes("colorful")) {
      return {
        label: "Assembler Landing Page Finale",
        fullLabel: "🚀 Assembler Landing Page Finale",
        icon: Rocket,
        color: "#7C3AED",
      };
    }
    if ((p.includes("chat") || p.includes("message") || packSlug?.includes("chat")) && !p.includes("ai") && !p.includes("voice")) {
      return {
        label: "Assembler Messagerie Finale",
        fullLabel: "💬 Assembler Messagerie & Chat Final",
        icon: MessageSquare,
        color: "#3b82f6",
      };
    }
    if (p.includes("voice") || p.includes("agent") || p.includes("ai")) {
      return {
        label: "Assembler Studio IA Final",
        fullLabel: "🤖 Assembler Studio IA Final",
        icon: Bot,
        color: "#d946ef",
      };
    }
    if (p.includes("game") || p.includes("arcade")) {
      return {
        label: "Assembler Hub Jeu Final",
        fullLabel: "🎮 Assembler Hub Jeu Final",
        icon: Gamepad2,
        color: "#f59e0b",
      };
    }
    if (p.includes("ecom") || p.includes("commerce")) {
      return {
        label: "Assembler Vitrine Finale",
        fullLabel: "🏪 Assembler Vitrine Finale",
        icon: Store,
        color: "#10b981",
      };
    }
    return {
      label: "Assembler l'Application Finale",
      fullLabel: "🚀 Assembler l'Application Finale",
      icon: Sparkles,
      color: "#6366f1",
    };
  }, [packSlug, projectName, buttonLabel]);

  const ActionIcon = actionMeta.icon;

  const run = async (name: string, action: () => Promise<string>) => {
    setBusy(name); setMessage("");
    try { const result = await action(); setMessage(result); onLog?.(result); }
    catch (error) { const result = error instanceof Error ? error.message : String(error); setMessage(`Échec : ${result}`); onLog?.(`Export : ${result}`); }
    finally { setBusy(null); }
  };

  const cleanDevPort = activeDevUrl.replace(/^https?:\/\//, "");

  return (
    <section className="export-actions-panel">
      <div className="export-actions-copy">
        <div className="section-kicker">PONT D'EXPORTATION ET LOCAL</div>
        <h3>Emporter ce projet</h3>
        <p>{files.length} fichiers seront exportés avec la provenance GitHub. Ces actions sont disponibles pour chaque futur workspace.</p>
      </div>
      <div className="export-actions-grid">
        <button
          disabled={!!busy}
          onClick={() => run("assemble", async () => {
            const res = await bridgeClient.assembleFinalApp(projectName, packSlug);
            return `Application finale multi-pages générée avec succès (${res.filesCreated} fichiers câblés dans App.tsx).`;
          })}
          style={{ borderColor: "rgba(16, 185, 129, 0.4)", background: "rgba(16, 185, 129, 0.08)" }}
        >
          <ActionIcon size={16} style={{ color: actionMeta.color }} />
          <span>
            <b>{actionMeta.fullLabel}</b>
            <small>Câblage complet des routes dans App.tsx</small>
          </span>
          {busy === "assemble" ? <Loader2 className="spin" size={15} /> : <Check size={14} />}
        </button>

        <button disabled={!!busy} onClick={() => run("bridge", async () => { try { const result = await writeWithLocalBridge(projectName, files); return `Bridge local : ${result.count || files.length} fichiers écrits.`; } catch { const result = await writeWithDirectoryPicker(projectName, files); return `Dossier local : ${result.count} fichiers écrits.`; } })}>
          <HardDrive size={16} />
          <span><b>Écrire sur le disque</b><small>Bridge local ou choix d’un dossier</small></span>
          {busy === "bridge" ? <Loader2 className="spin" size={15} /> : <Check size={14} />}
        </button>

        <button disabled={!!busy} onClick={() => run("zip", async () => { downloadProjectZip(projectName, files); return "ZIP téléchargé dans le dossier de téléchargements."; })}>
          <Download size={16} />
          <span><b>Exporter en ZIP</b><small>Projet + artefacts de provenance</small></span>
          {busy === "zip" ? <Loader2 className="spin" size={15} /> : <Check size={14} />}
        </button>

        <button disabled={!!busy} onClick={() => run("github", async () => { const result = await publishProjectToGitHub(projectName, files, { commitMessage: `ForgeAI : ${projectName}` }); if (!result.success) throw new Error(result.message || "GitHub non configuré"); return `GitHub : ${result.count || files.length} fichiers publiés.`; })}>
          <Github size={16} />
          <span><b>Publier sur GitHub</b><small>Token et dépôt configurés dans l’extension</small></span>
          {busy === "github" ? <Loader2 className="spin" size={15} /> : <UploadCloud size={14} />}
        </button>

        <button disabled={!!busy} onClick={() => run("install", async () => { const result = await bridgeClient.command(projectName, "pnpm install"); return result.message || "pnpm install lancé."; })}>
          <Terminal size={16} />
          <span><b>Installer dépendances</b><small>pnpm install dans le workspace</small></span>
          {busy === "install" ? <Loader2 className="spin" size={15} /> : <Check size={14} />}
        </button>

        <button disabled={!!busy} onClick={() => run("dev", async () => { const result = await bridgeClient.command(projectName, "pnpm dev"); return result.message || `Serveur lancé sur ${cleanDevPort}.`; })}>
          <Play size={16} />
          <span><b>Lancer l’application</b><small>pnpm dev · {cleanDevPort}</small></span>
          {busy === "dev" ? <Loader2 className="spin" size={15} /> : <Play size={14} />}
        </button>
      </div>
      {message && <div className={`export-feedback ${message.startsWith("Échec") ? "export-feedback-error" : ""}`}><FolderDown size={14} /> {message}</div>}
    </section>
  );
}
