import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { wireProjectIndustrially } from "./industrial_gems_wirer.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PRD_PACKS_DIR = path.resolve(__dirname, "..", "prd_packs");

/**
 * Moteur Universel d'Application Finale (Phase 3)
 * Assemble automatiquement l'application finale authentique, originale et adaptée
 * aux spécifications réelles de n'importe quel Pack PRD (E-Commerce, SaaS, IA, CRM, Jeux, etc.)
 */

/**
 * Résout et charge le pack PRD associé au projet
 */
/**
 * 🚀 SPRINT 2: Client Cloudflare Workers AI pour le Code Agent
 * Exécute le modèle d'inférence (Llama 3 par défaut) pour générer du code React.
 */
async function generateCodeWithAI(systemPrompt, userPrompt) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const aiModel = process.env.CLOUDFLARE_AI_MODEL || "@cf/meta/llama-3.1-8b-instruct";

  if (!accountId || !apiToken) {
    throw new Error("Variables d'environnement Cloudflare manquantes (CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN).");
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${aiModel}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      max_tokens: 3500,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Erreur API Cloudflare (${response.status}): ${errText}`);
  }

  const data = await response.json();
  if (data.success && data.result && data.result.response) {
    return data.result.response;
  }
  
  throw new Error("Réponse Cloudflare AI invalide ou vide.");
}

export async function resolvePrdPack(projDir, packSlug = null) {
  let targetSlug = packSlug;

  // 1. Déduction intelligente prioritaire à partir du nom de dossier si pas de slug explicite
  if (!targetSlug && projDir) {
    const folderName = path.basename(projDir).toLowerCase();
    const candidateSlugs = [];

    if (folderName.includes("crm") || folderName.includes("erp")) {
      candidateSlugs.push("prd_crm_erp_pack");
    } else if (folderName.includes("saas") || folderName.includes("billing")) {
      candidateSlugs.push("prd_saas_billing_pro", "saas_pack");
    } else if (folderName.includes("voice") || folderName.includes("agent") || folderName.includes("ai")) {
      candidateSlugs.push("prd_ai_voice_agent", "prd_ai_apps_pack");
    } else if (folderName.includes("ecom") || folderName.includes("commerce")) {
      candidateSlugs.push("ecommerce_pack", "prd_ecom_catalog");
    }

    candidateSlugs.push(
      folderName,
      folderName.replace(/-/g, "_"),
      `prd_${folderName.replace(/-/g, "_")}`,
      `${folderName.replace(/-/g, "_")}_pack`
    );

    for (const cand of candidateSlugs) {
      try {
        await fs.access(path.join(PRD_PACKS_DIR, cand, "pack.json"));
        targetSlug = cand;
        break;
      } catch (_) { }
    }
  }

  // 2. Si pas trouvé par le nom du dossier, lire dans 00_PROJECT_META.md
  if (!targetSlug && projDir) {
    try {
      const metaContent = await fs.readFile(path.join(projDir, "00_PROJECT_META.md"), "utf-8");
      const match = metaContent.match(/Pack PRD source\s*:\s*([^\r\n]+)/i);
      if (match && match[1]) {
        const found = match[1].trim();
        // Vérifier que le pack trouvé n'est pas contradictoire avec le nom du dossier
        const folderName = path.basename(projDir).toLowerCase();
        if ((folderName.includes("crm") && !found.includes("crm")) || (folderName.includes("saas") && !found.includes("saas"))) {
          // Ignorer la meta contradictoire
        } else {
          targetSlug = found;
        }
      }
    } catch (_) { }
  }

  // Fallback intelligent basé sur le nom du dossier plutôt que ecommerce par défaut
  if (!targetSlug && projDir) {
    const folderName = path.basename(projDir).toLowerCase();
    if (folderName.includes("crm") || folderName.includes("erp")) {
      targetSlug = "crm_erp_pack";
    } else if (folderName.includes("saas") || folderName.includes("billing")) {
      targetSlug = "saas_pack";
    } else if (folderName.includes("blog") || folderName.includes("content") || folderName.includes("article") || folderName.includes("news")) {
      targetSlug = "blog_contenu_pack";
    } else if (folderName.includes("ui") || folderName.includes("design") || folderName.includes("skill") || folderName.includes("component")) {
      targetSlug = "composant_pack";
    } else if (folderName.includes("ecom") || folderName.includes("commerce")) {
      targetSlug = "ecommerce_pack";
    } else {
      targetSlug = "blog_contenu_pack";
    }
  } else if (!targetSlug) {
    targetSlug = "ecommerce_pack";
  }

  // 3. Charger le pack.json
  try {
    const packJsonPath = path.join(PRD_PACKS_DIR, targetSlug, "pack.json");
    const raw = await fs.readFile(packJsonPath, "utf-8");
    const data = JSON.parse(raw);
    return { ...data, slug: targetSlug };
  } catch (_) {
    // Fallback pack par défaut si introuvable
    return {
      slug: targetSlug,
      name: targetSlug.replace(/[-_]/g, " ").toUpperCase(),
      description: `Application générée pour ${targetSlug}`,
      domain: targetSlug.includes("blog") || targetSlug.includes("content") ? "Blog & Contenu Éditorial" : "Application Métier",
      archetype: targetSlug.includes("saas") || targetSlug.includes("billing") ? "saas" :
        targetSlug.includes("voice") || targetSlug.includes("ai") || targetSlug.includes("chat") ? "ai_agent" :
          targetSlug.includes("crm") || targetSlug.includes("erp") ? "crm" :
            targetSlug.includes("game") || targetSlug.includes("tetris") || targetSlug.includes("arcade") ? "game" :
              targetSlug.includes("blog") || targetSlug.includes("content") ? "universal_app" :
                targetSlug.includes("ui") || targetSlug.includes("composant") ? "ui_kit" :
                  "ecommerce",
      primaryEntity: targetSlug.includes("blog") ? "Article" : "Item",
      features: [
        "Tableau de bord interactif",
        "Gestion d'état réactive",
        "Filtres et recherche instantanée",
        "Persistance locale des données"
      ],
      designTokens: {
        primary: "#10B981",
        accent: "#38BDF8",
        background: "#0F172A",
        text: "#F8FAFC",
        font: "Inter"
      },
      uiComponents: ["Header", "Card", "List", "Modal", "FilterBar"]
    };
  }
}

/**
 * Détermine l'archétype principal à partir du pack
 */
export function detectArchetype(pack, projDir = null) {
  // Priorité absolue : nom du dossier projet (évite les faux positifs via pack.json mal configuré)
  if (projDir) {
    const folderName = path.basename(projDir).toLowerCase();
    if (folderName.includes("crm") || folderName.includes("erp")) return "crm";
    if (folderName.includes("saas") || folderName.includes("billing")) return "saas";
    if (folderName.includes("ecom") || folderName.includes("commerce") || folderName.includes("shop") || folderName.includes("store")) return "ecommerce";
    if (folderName.includes("game") || folderName.includes("arcade") || folderName.includes("tetris")) return "game";
    if (folderName.includes("voice") || folderName.includes("agent") || folderName.includes("ai-") || folderName.startsWith("ai_")) return "ai_agent";
    if (folderName.includes("ui") || folderName.includes("design") || folderName.includes("skill") || folderName.includes("component")) return "ui_kit";
    if (folderName.includes("chat") || folderName.includes("message")) return "chat";
    if (folderName.includes("landing") || folderName.includes("conversion") || folderName.includes("colorful")) return "landing";
  }

  const slug = (pack.slug || "").toLowerCase();
  const archetype = (pack.archetype || "").toLowerCase();
  const domain = (pack.domain || "").toLowerCase();

  // 1. CRM / ERP — prioritaire car souvent mal classé
  if (slug.includes("crm") || slug.includes("erp") || archetype.includes("crm") || archetype.includes("erp") || domain.includes("crm") || domain.includes("erp") || domain.includes("relation client")) {
    return "crm";
  }

  // 2. UI Kit / Design System
  if (slug.includes("ui") || slug.includes("composant") || slug.includes("component") || slug.includes("design") || archetype.includes("ui") || domain.includes("composant") || domain.includes("design")) {
    return "ui_kit";
  }

  // 3. Chat & Messagerie
  if (slug.includes("landing") || slug.includes("conversion") || domain.includes("landing") || domain.includes("conversion")) return "landing";

  if (slug.includes("chat") || slug.includes("comms") || slug.includes("message") || slug.includes("messenger") || domain.includes("chat") || domain.includes("messagerie")) {
    return "chat";
  }

  // 4. E-Commerce
  if (slug.includes("ecom") || slug.includes("commerce") || archetype.includes("ecom") || domain.includes("commerce") || domain.includes("boutique")) {
    return "ecommerce";
  }

  // 5. SaaS / Billing / Dashboard
  if (slug.includes("saas") || slug.includes("billing") || archetype.includes("saas") || domain.includes("analytics") || domain.includes("dashboard") || domain.includes("facturation")) {
    return "saas";
  }

  // 6. Jeux / Arcade
  if (slug.includes("game") || slug.includes("arcade") || slug.includes("tetris") || archetype.includes("game")) {
    return "game";
  }

  // 7. Agent IA Vocal
  if (slug.includes("voice") || slug.includes("vocal") || archetype.includes("ai") || archetype.includes("voice") || domain.includes("assistant") || domain.includes("vocal")) {
    return "ai_agent";
  }

  return "universal_app";
}

/**
 * Nettoie les fichiers de features orphelins d'autres archétypes
 * pour garantir que chaque projet n'a QUE ses features pertinentes et 100% câblées
 */
async function cleanOrphanFeatures(projDir, archetype) {
  const featuresDir = path.join(projDir, "src", "features");
  const componentsDir = path.join(projDir, "src", "components");

  const allowedFeaturesByArchetype = {
    ecommerce: ["Storefront.tsx", "ProductDetailPage.tsx", "OrdersTrackingPage.tsx", "IntegratedModulesPage.tsx", "GemsStudio.tsx", "GemsExplorer.tsx", "ProvenanceAuditView.tsx"],
    crm: ["CrmKanban.tsx", "InvoicesErp.tsx", "ClientsDirectory.tsx", "AnalyticsDashboard.tsx", "IntegratedModulesPage.tsx", "GemsStudio.tsx", "GemsExplorer.tsx", "ProvenanceAuditView.tsx"],
    saas: ["SaasDashboard.tsx", "IntegratedModulesPage.tsx", "GemsStudio.tsx", "GemsExplorer.tsx", "ProvenanceAuditView.tsx"],
    ui_kit: ["ComponentCatalog.tsx", "TokenExplorer.tsx", "IntegratedModulesPage.tsx", "GemsStudio.tsx", "GemsExplorer.tsx", "ProvenanceAuditView.tsx"],
    chat: ["ChatMessenger.tsx", "ChatFiles.tsx", "ChatMembers.tsx", "IntegratedModulesPage.tsx", "GemsStudio.tsx", "GemsExplorer.tsx", "ProvenanceAuditView.tsx"],
    landing: ["LandingPageMain.tsx", "LeadConversionDashboard.tsx", "IntegratedModulesPage.tsx", "GemsStudio.tsx", "GemsExplorer.tsx", "ProvenanceAuditView.tsx"],
    game: ["GameHub.tsx", "IntegratedModulesPage.tsx", "GemsStudio.tsx", "GemsExplorer.tsx", "ProvenanceAuditView.tsx"],
    ai_agent: ["AiStudio.tsx", "PromptEngineeringView.tsx", "IntegratedModulesPage.tsx", "GemsStudio.tsx", "GemsExplorer.tsx", "ProvenanceAuditView.tsx"],
    universal_app: ["UniversalApp.tsx", "ArticleReader.tsx", "ArticleEditor.tsx", "IntegratedModulesPage.tsx", "GemsStudio.tsx", "GemsExplorer.tsx", "ProvenanceAuditView.tsx"],
  };

  const allowed = allowedFeaturesByArchetype[archetype];
  if (!allowed) return;

  try {
    const files = await fs.readdir(featuresDir);
    for (const f of files) {
      if (f.endsWith(".tsx") && !allowed.includes(f)) {
        await fs.unlink(path.join(featuresDir, f)).catch(() => { });
        console.log(`[Universal Generator] Nettoyage feature orpheline : ${f}`);
      }
    }
  } catch (_) { }

  // Nettoyage components e-commerce si hors e-commerce
  if (archetype !== "ecommerce") {
    const ecomComponents = ["CartDrawer.tsx", "CheckoutWizard.tsx", "FilterSidebar.tsx", "ProductCard.tsx", "ProductDetailModal.tsx"];
    for (const c of ecomComponents) {
      await fs.unlink(path.join(componentsDir, c)).catch(() => { });
    }
  }
}

/**
 * Assemble l'application finale interactive adaptée au Pack PRD
 * @param {boolean} forceOverwrite - Si true, réécrit même un App.tsx existant (par défaut false = préserve le câblage manuel)
 */

/**
 * Génère le fichier index.css avec les Design Tokens stricts du pack
 */
export async function updateDesignTokensCss(projDir, pack) {
  const primary = pack.designTokens?.primary || "#3B82F6";
  const accent = pack.designTokens?.accent || "#10B981";
  const font = pack.designTokens?.font || "Inter";
  const bg = pack.designTokens?.background || "#0b0f19";

  const cssPath = path.join(projDir, "src", "index.css");
  const cssContent = `@import "./design-system/tokens.css";

:root {
  --primary: ${primary};
  --accent: ${accent};
  --bg-primary: #0b0f19;
  --bg-secondary: #0f172a;
  --bg-card: rgba(255, 255, 255, 0.03);
  --border-color: rgba(255, 255, 255, 0.08);
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --font-family: '${font}', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-main);
  font-family: var(--font-family);
  min-height: 100vh;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

button {
  font-family: inherit;
}

/* Animations globales */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulseGlow {
  0%, 100% { filter: drop-shadow(0 0 15px ${primary}44); }
  50% { filter: drop-shadow(0 0 30px ${accent}66); }
}
`;

  await fs.writeFile(cssPath, cssContent, "utf-8");
  console.log(`[Universal Generator] ✓ index.css mis à jour avec les Design Tokens (${primary} / ${accent})`);
}

export async function assembleFinalApplication(projDir, projectName, packSlug = null, forceOverwrite = true, userPrompt = "") {
  const pack = await resolvePrdPack(projDir, packSlug);
  const archetype = detectArchetype(pack, projDir);

  // Nettoyage proactif des features orphelines incompatibles
  await cleanOrphanFeatures(projDir, archetype);
  await updateDesignTokensCss(projDir, pack);

  // Couche d'animation & Design System commune (tokens, accessibilité, 3D, SVG)
  try {
    const { ensureAnimationDesignSystem } = await import("./animation-design-system.mjs");
    await ensureAnimationDesignSystem(projDir, { archetype, pack, projectName });
  } catch (err) {
    console.warn("[Universal Generator] ensureAnimationDesignSystem: " + (err instanceof Error ? err.message : String(err)));
  }

  const appTsxPath = path.join(projDir, "src", "App.tsx");
  let appNeedsGeneration = forceOverwrite !== false;

  if (!appNeedsGeneration) {
    try {
      const existingContent = await fs.readFile(appTsxPath, "utf-8");
      // Cas 1 : boilerplate initial non câblé
      if (existingContent.includes("MOUNTED_MANIFEST[0]") || existingContent.includes("hero-banner") || existingContent.includes("Pépites & Composants")) {
        appNeedsGeneration = true;
      }
      // Cas 2 : archétype incorrect — App.tsx d'un autre domaine (ex: blog sur un projet landing, ecommerce sur un chat...)
      if (!appNeedsGeneration) {
        const wrongSignals = [
          archetype !== "landing" && (existingContent.includes("LandingPageMain") || existingContent.includes("LeadConversionDashboard")),
          archetype !== "ecommerce" && (existingContent.includes("Storefront") && existingContent.includes("CartDrawer")),
          archetype !== "universal_app" && (existingContent.includes("ArticleReader") || existingContent.includes("UniversalApp") || existingContent.includes("ArticleEditor")),
          archetype !== "chat" && (existingContent.includes("ChatMessenger") || existingContent.includes("ConversationSidebar")),
          archetype !== "crm" && (existingContent.includes("CrmKanban") || existingContent.includes("InvoicesErp")),
          archetype !== "saas" && existingContent.includes("SaasDashboard"),
          archetype !== "ai_agent" && (existingContent.includes("AiStudio") || existingContent.includes("PromptEngineeringView")),
          archetype !== "game" && existingContent.includes("GameHub"),
          archetype !== "ui_kit" && (existingContent.includes("ComponentCatalog") || existingContent.includes("TokenExplorer")),
        ];
        if (wrongSignals.some(Boolean)) {
          console.log(`[Universal Generator] Mauvais archétype détecté dans App.tsx pour ${projectName} (cible: ${archetype}) — Régénération forcée`);
          appNeedsGeneration = true;
        }
      }
    } catch (_) {
      appNeedsGeneration = true;
    }
  }

  const dirsToCreate = [
    path.join(projDir, "src", "types"),
    path.join(projDir, "src", "services"),
    path.join(projDir, "src", "components"),
    path.join(projDir, "src", "features"),
    path.join(projDir, "src", "integrations"),
  ];
  for (const d of dirsToCreate) {
    await fs.mkdir(d, { recursive: true });
  }

  let filesCreated = 0;

  if (appNeedsGeneration) {
    let aiSuccess = false;
    if (userPrompt) {
      try {
        console.log(`[Universal Generator] Lancement de l'Agent de Code Dynamique via Cloudflare AI...`);
        let availableGems = "";
        try {
          const manifestContent = await fs.readFile(path.join(projDir, "src", "integrations", "github-adapted", "MOUNTED_MANIFEST.json"), "utf-8");
          const manifest = JSON.parse(manifestContent);
          availableGems = manifest.map(g => `- ${g.gemKey} : import { ... } from '@/integrations/github-adapted/${g.targetFile.replace('.tsx', '').replace('.ts', '')}'`).join("\n");
        } catch (_) { }

        const systemPrompt = `Tu es un Expert React/Vite Senior. 
Ton objectif est de générer UNIQUEMENT le code complet et fonctionnel pour le fichier \`App.tsx\` du projet.
Archétype du projet : ${archetype}
Nom du projet : ${projectName}
Pépites (composants) disponibles localement que tu DOIS utiliser si pertinent :
${availableGems}

CONSIGNES CRITIQUES :
1. Renvoie UNIQUEMENT le code source TSX, entouré de \`\`\`tsx ... \`\`\`.
2. Pas de texte introductif ou conclusif.
3. Le composant par défaut doit s'appeler App (export default App).
4. Utilise \`lucide-react\` pour les icônes.
5. Sois créatif : intègre le design et la thématique demandée par l'utilisateur (belles couleurs, interfaces premium, animations simples).
6. INTERDICTION FORMELLE d'importer des fichiers locaux inexistants (ex: import { CrmKanban } from "./features/..."). TOUT composant personnalisé (features, pages, layout) DOIT être codé ENTIÈREMENT EN INLINE dans ce même fichier App.tsx, à l'exception des pépites fournies ci-dessus.`;

        const codeResponse = await generateCodeWithAI(systemPrompt, userPrompt);
        
        // Extraction du code avec Regex
        const match = codeResponse.match(/```(?:tsx|jsx)?\s*([\s\S]*?)\s*```/);
        let finalCode = match ? match[1] : codeResponse;
        
        if (!finalCode.includes("export default App") && !finalCode.includes("export default function App")) {
           throw new Error("Le code généré ne contient pas l'export de 'App'.");
        }
        
        await fs.writeFile(appTsxPath, finalCode.trim(), "utf-8");
        filesCreated++;
        aiSuccess = true;
        console.log(`[Universal Generator] ✓ App.tsx généré dynamiquement par l'IA Cloudflare !`);
        
      } catch (aiError) {
        console.warn(`[Universal Generator] Échec de la génération IA (${aiError.message}). Fallback sur le template générique.`);
      }
    }
    
    if (!aiSuccess) {
    if (archetype === "ui_kit") {
      filesCreated += await generateUiKitApp(projDir, projectName, pack);
    } else if (archetype === "chat") {
      filesCreated += await generateChatApp(projDir, projectName, pack);
    } else if (archetype === "landing") {
      filesCreated += await generateLandingApp(projDir, projectName, pack);
    } else if (archetype === "ecommerce") {
      filesCreated += await generateEcommerceApp(projDir, projectName, pack);
    } else if (archetype === "saas") {
      filesCreated += await generateSaasApp(projDir, projectName, pack);
    } else if (archetype === "ai_agent") {
      filesCreated += await generateAiAgentApp(projDir, projectName, pack);
    } else if (archetype === "crm") {
      filesCreated += await generateCrmApp(projDir, projectName, pack);
    } else if (archetype === "game") {
      filesCreated += await generateGameApp(projDir, projectName, pack);
    } else {
      filesCreated += await generateUniversalApp(projDir, projectName, pack);
    }
  }
  } else {
    console.log(`[Universal Generator] App.tsx existant personnalisé pour ${projectName} — câblage industriel uniquement`);
  }

  // Câblage industriel garanti des pépites montées (GemsStudio, GemsExplorer, Provenance)
  try {
    await wireProjectIndustrially(projDir, projectName, packSlug);
  } catch (err) {
    console.warn(`[Universal Generator] Câblage industriel des pépites : \${err.message}

  // Extraction & injection automatique des composants Animation, 3D & UI (Motion, R3F, shadcn/ui)
  try {
    const { extractAnimationAndDesignComponents } = await import("./animation_extractor.mjs");
    await extractAnimationAndDesignComponents(projDir);
  } catch (err) {
    console.warn("[Universal Generator] Extraction animation & design: " + (err ? err.message : ""));
  }`);
  }

  return {
    success: true,
    packSlug: pack.slug,
    packName: pack.name,
    archetype,
    filesCreated,
    appPreserved: !appNeedsGeneration,
    message: `Application finale pour ${projectName} assemblée avec succès (Archétype: ${archetype}, Pack: ${pack.name})${!appNeedsGeneration ? " — App.tsx préservé" : ""}.`
  };
}

/* ══════════════════════════════════════════════════════════════════════════
   1. GÉNÉRATEUR E-COMMERCE (Storefront, Cart, Checkout, Filters)
   ══════════════════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════════════════
   2. GÉNÉRATEUR LANDING PAGE & CONVERSION (#7C3AED / #EC4899)
   ══════════════════════════════════════════════════════════════════════════ */
async function generateLandingApp(projDir, projectName, pack) {
  let count = 0;
  const primaryColor = pack.designTokens?.primary || "#7C3AED";
  const accentColor = pack.designTokens?.accent || "#EC4899";

  // 1. Types complets pour Landing & Leads
  await fs.writeFile(path.join(projDir, "src", "types", "index.ts"), `export interface Lead {
  id: string;
  email: string;
  name?: string;
  planInterest: "starter" | "pro" | "enterprise";
  createdAt: string;
  status: "new" | "contacted" | "converted";
}

export interface PricingPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  popular?: boolean;
  features: string[];
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
`, "utf-8");
  count++;

  // 2. Service Métier : leadService.ts
  await fs.writeFile(path.join(projDir, "src", "services", "leadService.ts"), `import { Lead, PricingPlan, FeatureItem, Testimonial, FaqItem } from "../types";

const STORAGE_KEY = "forgeai_landing_leads";

const INITIAL_LEADS: Lead[] = [
  { id: "1", email: "sarah.connor@cyberdyne.io", name: "Sarah C.", planInterest: "pro", createdAt: "Aujourd'hui à 09:42", status: "new" },
  { id: "2", email: "marc.tech@startup.fr", name: "Marc T.", planInterest: "enterprise", createdAt: "Hier à 17:15", status: "contacted" },
  { id: "3", email: "elena.design@studio.co", name: "Elena D.", planInterest: "starter", createdAt: "21 Septembre", status: "converted" },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter Créateur",
    priceMonthly: 19,
    priceYearly: 15,
    description: "Idéal pour lancer vos premiers projets avec conversion immédiate.",
    features: ["Jusqu'à 5 pages de conversion", "Formulaire de capture avec validation", "Export CSV & Webhooks", "Support communautaire standard"]
  },
  {
    id: "pro",
    name: "Pro Conversion",
    priceMonthly: 49,
    priceYearly: 39,
    popular: true,
    description: "Le plan le plus plébiscité pour maximiser votre taux d'acquisition.",
    features: ["Landing pages illimitées", "A/B Testing en direct", "Intégration CRM & Stripe instantanée", "Statistiques & taux de rebond temps réel", "Support prioritaire 24/7"]
  },
  {
    id: "enterprise",
    name: "Entreprise Scalable",
    priceMonthly: 129,
    priceYearly: 99,
    description: "Puissance maximale, personnalisation poussée et SLA garanti.",
    features: ["Domaines personnalisés illimités", "Accompagnement CRO dédié", "SLA 99.9% & SSO d'équipe", "Pipelines d'automatisation avancés"]
  }
];

export const FEATURES_LIST: FeatureItem[] = [
  { id: "1", title: "Design Ultra-Vibrant & Fluide", description: "Palette harmonieuse #7C3AED et #EC4899 pensée pour capter le regard dès la première seconde.", iconName: "Sparkles", badge: "Visuel Whaou" },
  { id: "2", title: "Conversion Maximisée", description: "Call-To-Actions stratégiques, formulaires simplifiés et tunnels d'acquisition optimisés pour le ROI.", iconName: "TrendingUp", badge: "+35% Leads" },
  { id: "3", title: "Social Proof Intégrée", description: "Témoignages clients vérifiés, compteurs de communauté en direct et avis 5 étoiles.", iconName: "ShieldCheck", badge: "Confiance" },
  { id: "4", title: "Persistance Locale & Sécurisée", description: "Les inscriptions et leads sont sauvegardés instantanément et exportables en un clic.", iconName: "Database", badge: "Zéro Perte" },
  { id: "5", title: "Responsive & Temps Réel", description: "Rendu fluide sur mobile, tablette et desktop avec navigation ultra-rapide sans rechargement.", iconName: "Zap", badge: "Vitesse Pure" },
  { id: "6", title: "Prêt pour la Production", description: "Code propre en TypeScript, composants modulaires et zéro dépendance superflue.", iconName: "CheckCircle2", badge: "100% Propre" }
];

export const TESTIMONIALS_LIST: Testimonial[] = [
  { id: "1", quote: "Cette landing page a multiplié par 3 notre taux d'inscription dès la première semaine. Le design est sublime !", author: "Claire V.", role: "Directrice Marketing", company: "Novaflow", avatar: "👩‍💼", rating: 5 },
  { id: "2", quote: "L'ergonomie des formulaires et la fluidité des sections font toute la différence. Nos prospects adorent.", author: "Julien M.", role: "Fondateur SaaS", company: "LeadPulse", avatar: "👨‍💻", rating: 5 },
  { id: "3", quote: "Un rendu coloré moderne qui se démarque enfin des templates grisâtres habituels. Chapeau !", author: "Amélie R.", role: "Head of Growth", company: "ScaleCraft", avatar: "🚀", rating: 5 }
];

export const FAQ_LIST: FaqItem[] = [
  { id: "1", question: "Comment mes leads sont-ils stockés ?", answer: "Vos leads sont enregistrés en local de manière persistante et accessibles à tout moment dans l'onglet 'Leads & Conversions'." },
  { id: "2", question: "Puis-je exporter mes prospects ?", answer: "Oui, un bouton d'export CSV / JSON vous permet de télécharger vos leads en un clic pour les importer dans votre CRM." },
  { id: "3", question: "Les formulaires fonctionnent-ils sans serveur externe ?", answer: "Absolument. L'application est autonome et gère la validation, le stockage et les notifications en toute indépendance." },
  { id: "4", question: "Est-ce optimisé pour les appareils mobiles ?", answer: "Oui, la mise en page, la barre CTA collante et les grilles s'adaptent parfaitement à tous les écrans." }
];

export class LeadService {
  static getLeads(): Lead[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEADS));
      return INITIAL_LEADS;
    }
    return JSON.parse(raw);
  }

  static captureLead(email: string, name: string = "", planInterest: "starter" | "pro" | "enterprise" = "pro"): Lead {
    const leads = this.getLeads();
    const newLead: Lead = {
      id: Date.now().toString(),
      email,
      name: name.trim() || undefined,
      planInterest,
      createdAt: "À l'instant",
      status: "new"
    };
    leads.unshift(newLead);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    return newLead;
  }

  static getWaitlistCount(): number {
    return 1420 + this.getLeads().length;
  }
}
`, "utf-8");
  count++;

  // 3. Composant : HeroSection.tsx
  await fs.writeFile(path.join(projDir, "src", "components", "HeroSection.tsx"), `import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Star } from "lucide-react";
import { ParticleField } from "../animation/ParticleField";
import { AnimatedCube } from "./3d/AnimatedCube";

interface Props {
  onCtaClick: () => void;
  onExploreFeatures: () => void;
  waitlistCount: number;
}

export const HeroSection: React.FC<Props> = ({ onCtaClick, onExploreFeatures, waitlistCount }) => {
  return (
    <section style={{ padding: "70px 20px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <ParticleField />
      <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "350px", background: "radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, rgba(236, 72, 153, 0.15) 50%, transparent 80%)", filter: "blur(60px)", pointerEvents: "none" }} />

      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(236, 72, 153, 0.3)", borderRadius: 30, padding: "6px 16px", marginBottom: 20, backdropFilter: "blur(8px)", position: "relative", zIndex: 1 }}>
        <Sparkles size={14} color="#ec4899" />
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#f472b6" }}>Nouvelle Édition V2.0 · Design & Animations Actives</span>
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 30, flexWrap: "wrap", margin: "10px auto 30px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "680px", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(34px, 5.5vw, 60px)", fontWeight: 900, lineHeight: 1.15, margin: "0 auto 20px", letterSpacing: "-0.03em" }}>
            Transformez vos visiteurs en <span style={{ background: "linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #f43f5e 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>clients fidèles</span>
          </h1>
          <p style={{ fontSize: "clamp(15px, 1.8vw, 18px)", color: "#94a3b8", maxWidth: "620px", margin: "0 auto 30px", lineHeight: 1.6 }}>
            La solution de conversion nouvelle génération alliant design système moderne, animations fluides et analytics de capture en temps réel.
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <AnimatedCube size={140} />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 40 }}>
        <button onClick={onCtaClick} style={{ background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)", color: "#fff", border: "none", padding: "16px 32px", borderRadius: 12, fontSize: "15px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 10px 25px rgba(236, 72, 153, 0.35)", transition: "transform 0.2s" }}>
          Rejoindre l'accès anticipé <ArrowRight size={18} />
        </button>
        <button onClick={onExploreFeatures} style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.12)", color: "#f8fafc", padding: "16px 28px", borderRadius: 12, fontSize: "15px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <Zap size={16} color="#a78bfa" /> Découvrir les fonctionnalités
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24, flexWrap: "wrap", fontSize: "12px", color: "#94a3b8" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}><ShieldCheck size={16} color="#10b981" /> Sans engagement</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Zap size={16} color="#f59e0b" /> Configuration en 2 minutes</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={14} fill="#ec4899" color="#ec4899" /><Star size={14} fill="#ec4899" color="#ec4899" /><Star size={14} fill="#ec4899" color="#ec4899" /><Star size={14} fill="#ec4899" color="#ec4899" /><Star size={14} fill="#ec4899" color="#ec4899" /> 4.9/5 par {waitlistCount} inscrits</span>
      </div>
    </section>
  );
};
`, "utf-8");
  count++;

  // 4. Composant : FeatureGrid.tsx
  await fs.writeFile(path.join(projDir, "src", "components", "FeatureGrid.tsx"), `import React from "react";
import { FEATURES_LIST } from "../services/leadService";
import { Sparkles, TrendingUp, ShieldCheck, Database, Zap, CheckCircle2 } from "lucide-react";

export const FeatureGrid: React.FC = () => {
  const getIcon = (name: string) => {
    switch(name) {
      case "Sparkles": return <Sparkles size={22} color="#ec4899" />;
      case "TrendingUp": return <TrendingUp size={22} color="#10b981" />;
      case "ShieldCheck": return <ShieldCheck size={22} color="#38bdf8" />;
      case "Database": return <Database size={22} color="#a78bfa" />;
      case "Zap": return <Zap size={22} color="#f59e0b" />;
      default: return <CheckCircle2 size={22} color="#7c3aed" />;
    }
  };

  return (
    <section style={{ padding: "60px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 50 }}>
        <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#f8fafc", margin: "0 0 12px" }}>
          Des fonctionnalités taillées pour la conversion
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "15px", maxWidth: "600px", margin: "0 auto" }}>
          Chaque bloc a été pensé pour captiver, rassurer et inciter à l'action.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
        {FEATURES_LIST.map(f => (
          <div key={f.id} style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 16, padding: "28px", display: "flex", flexDirection: "column", gap: 14, transition: "all 0.3s ease", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ background: "rgba(255, 255, 255, 0.06)", borderRadius: 12, padding: 10, display: "inline-flex" }}>
                {getIcon(f.iconName)}
              </div>
              {f.badge && (
                <span style={{ fontSize: "10px", fontWeight: 700, background: "rgba(124, 58, 237, 0.2)", color: "#c4b5fd", padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(124, 58, 237, 0.4)" }}>
                  {f.badge}
                </span>
              )}
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#f8fafc", margin: 0 }}>{f.title}</h3>
            <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
`, "utf-8");
  count++;

  // 5. Composant : PricingTable.tsx
  await fs.writeFile(path.join(projDir, "src", "components", "PricingTable.tsx"), `import React, { useState } from "react";
import { PRICING_PLANS } from "../services/leadService";
import { Check, Star, ArrowRight } from "lucide-react";

interface Props {
  onSelectPlan: (planId: "starter" | "pro" | "enterprise") => void;
}

export const PricingTable: React.FC<Props> = ({ onSelectPlan }) => {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <section style={{ padding: "60px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#f8fafc", margin: "0 0 12px" }}>
          Tarification claire et transparente
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "15px", marginBottom: 24 }}>
          Investissez dans votre croissance avec une formule adaptée à votre stade.
        </p>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "rgba(255, 255, 255, 0.05)", padding: "4px 8px", borderRadius: 30, border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <button onClick={() => setIsYearly(false)} style={{ background: !isYearly ? "#7c3aed" : "transparent", color: !isYearly ? "#fff" : "#94a3b8", border: "none", padding: "6px 14px", borderRadius: 20, fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>Mensuel</button>
          <button onClick={() => setIsYearly(true)} style={{ background: isYearly ? "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)" : "transparent", color: "#fff", border: "none", padding: "6px 14px", borderRadius: 20, fontSize: "12px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            Annuel <span style={{ fontSize: "10px", background: "#10b981", color: "#000", padding: "1px 6px", borderRadius: 10, fontWeight: 800 }}>-20%</span>
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, alignItems: "stretch" }}>
        {PRICING_PLANS.map(p => {
          const price = isYearly ? p.priceYearly : p.priceMonthly;
          return (
            <div key={p.id} style={{ background: p.popular ? "rgba(124, 58, 237, 0.12)" : "rgba(255, 255, 255, 0.02)", border: p.popular ? "2px solid #ec4899" : "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 20, padding: "32px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
              {p.popular && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)", color: "#fff", fontSize: "11px", fontWeight: 800, padding: "4px 14px", borderRadius: 20, display: "flex", alignItems: "center", gap: 4 }}>
                  <Star size={12} fill="#fff" /> Choix Recommandé
                </div>
              )}

              <div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#f8fafc", margin: "0 0 6px" }}>{p.name}</h3>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 20px", minHeight: "36px" }}>{p.description}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 24 }}>
                  <span style={{ fontSize: "36px", fontWeight: 900, color: "#fff" }}>{price}€</span>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>/ mois {isYearly && "(facturé annuellement)"}</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: 20 }}>
                  {p.features.map((feat, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "13px", color: "#cbd5e1" }}>
                      <Check size={16} color="#10b981" /> {feat}
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => onSelectPlan(p.id as any)} style={{ marginTop: 30, background: p.popular ? "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)" : "rgba(255, 255, 255, 0.08)", color: "#fff", border: "none", padding: "14px 20px", borderRadius: 10, fontWeight: 800, fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                Choisir cette formule <ArrowRight size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
`, "utf-8");
  count++;

  // 6. Composant : TestimonialsSection.tsx
  await fs.writeFile(path.join(projDir, "src", "components", "TestimonialsSection.tsx"), `import React from "react";
import { TESTIMONIALS_LIST } from "../services/leadService";
import { Star } from "lucide-react";

export const TestimonialsSection: React.FC = () => {
  return (
    <section style={{ padding: "60px 20px", background: "rgba(0, 0, 0, 0.2)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: "30px", fontWeight: 800, color: "#f8fafc", margin: "0 0 10px" }}>Ils ont transformé leur acquisition</h2>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>Retours d'expérience concrets d'entrepreneurs et marketeurs.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {TESTIMONIALS_LIST.map(t => (
            <div key={t.id} style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 16, padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 16 }}>
              <div>
                <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="#ec4899" color="#ec4899" />
                  ))}
                </div>
                <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>"{t.quote}"</p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: 14 }}>
                <span style={{ fontSize: "24px" }}>{t.avatar}</span>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc" }}>{t.author}</div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>{t.role} · {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
`, "utf-8");
  count++;

  // 7. Composant : FaqAccordion.tsx
  await fs.writeFile(path.join(projDir, "src", "components", "FaqAccordion.tsx"), `import React, { useState } from "react";
import { FAQ_LIST } from "../services/leadService";
import { ChevronDown, HelpCircle } from "lucide-react";

export const FaqAccordion: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQ_LIST[0].id);

  const toggle = (id: string) => {
    setOpenId(prev => prev === id ? null : id);
  };

  return (
    <section style={{ padding: "60px 20px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2 style={{ fontSize: "30px", fontWeight: 800, color: "#f8fafc", margin: "0 0 10px", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <HelpCircle size={28} color="#7c3aed" /> Questions Fréquentes
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>Toutes les réponses pour aborder votre transition en toute sérénité.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {FAQ_LIST.map(faq => {
          const isOpen = openId === faq.id;
          return (
            <div key={faq.id} style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 12, overflow: "hidden" }}>
              <button onClick={() => toggle(faq.id)} style={{ width: "100%", padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "transparent", border: "none", color: "#f8fafc", fontSize: "15px", fontWeight: 700, cursor: "pointer", textAlign: "left" }}>
                <span>{faq.question}</span>
                <ChevronDown size={18} color="#a78bfa" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
              </button>
              {isOpen && (
                <div style={{ padding: "0 20px 18px", color: "#94a3b8", fontSize: "14px", lineHeight: 1.6, borderTop: "1px solid rgba(255, 255, 255, 0.04)", paddingTop: 12 }}>
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
`, "utf-8");
  count++;

  // 8. Composant : WaitlistForm.tsx
  await fs.writeFile(path.join(projDir, "src", "components", "WaitlistForm.tsx"), `import React, { useState } from "react";
import { LeadService } from "../services/leadService";
import { Send, CheckCircle2, Sparkles } from "lucide-react";

interface Props {
  selectedPlan?: "starter" | "pro" | "enterprise";
  onSuccess: (email: string) => void;
}

export const WaitlistForm: React.FC<Props> = ({ selectedPlan = "pro", onSuccess }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [plan, setPlan] = useState<"starter" | "pro" | "enterprise">(selectedPlan);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;

    LeadService.captureLead(email, name, plan);
    setSubmitted(true);
    onSuccess(email);
  };

  return (
    <section id="waitlist" style={{ padding: "70px 20px", maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
      <div style={{ background: "linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)", border: "1px solid rgba(236, 72, 153, 0.3)", borderRadius: 24, padding: "40px 30px", backdropFilter: "blur(16px)" }}>
        <div style={{ display: "inline-flex", padding: 8, background: "rgba(236, 72, 153, 0.2)", borderRadius: 12, marginBottom: 16 }}>
          <Sparkles size={24} color="#ec4899" />
        </div>
        <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#f8fafc", margin: "0 0 10px" }}>Rejoignez les pionniers</h2>
        <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 28px" }}>Accédez en avant-première à la plateforme et profitez de 3 mois offerts.</p>

        {submitted ? (
          <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: 12, padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <CheckCircle2 size={32} color="#10b981" />
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#34d399" }}>Félicitations, votre place est réservée !</div>
            <div style={{ fontSize: "12px", color: "#cbd5e1" }}>Un email de confirmation vous a été envoyé. Retrouvez votre lead dans le tableau de bord.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Votre prénom ou nom"
                style={{ flex: 1, minWidth: "200px", padding: "14px 18px", borderRadius: 10, background: "rgba(0, 0, 0, 0.4)", border: "1px solid rgba(255, 255, 255, 0.12)", color: "#fff", fontSize: "14px", outline: "none" }}
              />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre.email@entreprise.com"
                style={{ flex: 1.5, minWidth: "240px", padding: "14px 18px", borderRadius: 10, background: "rgba(0, 0, 0, 0.4)", border: "1px solid rgba(255, 255, 255, 0.12)", color: "#fff", fontSize: "14px", outline: "none" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 8, fontSize: "12px", color: "#94a3b8", margin: "4px 0" }}>
              <span>Formule d'intérêt :</span>
              <button type="button" onClick={() => setPlan("starter")} style={{ background: plan === "starter" ? "#7c3aed" : "transparent", color: plan === "starter" ? "#fff" : "#94a3b8", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "2px 8px", cursor: "pointer", fontSize: "11px" }}>Starter</button>
              <button type="button" onClick={() => setPlan("pro")} style={{ background: plan === "pro" ? "#ec4899" : "transparent", color: plan === "pro" ? "#fff" : "#94a3b8", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "2px 8px", cursor: "pointer", fontSize: "11px" }}>Pro ⭐</button>
              <button type="button" onClick={() => setPlan("enterprise")} style={{ background: plan === "enterprise" ? "#38bdf8" : "transparent", color: plan === "enterprise" ? "#fff" : "#94a3b8", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "2px 8px", cursor: "pointer", fontSize: "11px" }}>Enterprise</button>
            </div>

            <button type="submit" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)", color: "#fff", border: "none", padding: "16px", borderRadius: 10, fontSize: "15px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 4px 15px rgba(236, 72, 153, 0.4)" }}>
              <Send size={16} /> Réserver ma place prioritaire
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
`, "utf-8");
  count++;

  // 9. Feature : LandingPageMain.tsx
  await fs.writeFile(path.join(projDir, "src", "features", "LandingPageMain.tsx"), `import React, { useState } from "react";
import { HeroSection } from "../components/HeroSection";
import { FeatureGrid } from "../components/FeatureGrid";
import { PricingTable } from "../components/PricingTable";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { FaqAccordion } from "../components/FaqAccordion";
import { WaitlistForm } from "../components/WaitlistForm";
import { LeadService } from "../services/leadService";

interface Props {
  onLeadCaptured?: (email: string) => void;
}

export const LandingPageMain: React.FC<Props> = ({ onLeadCaptured }) => {
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "pro" | "enterprise">("pro");
  const waitlistCount = LeadService.getWaitlistCount();

  const scrollToWaitlist = () => {
    const el = document.getElementById("waitlist");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectPlan = (plan: "starter" | "pro" | "enterprise") => {
    setSelectedPlan(plan);
    scrollToWaitlist();
  };

  return (
    <div style={{ color: "#f8fafc" }}>
      <HeroSection
        onCtaClick={scrollToWaitlist}
        onExploreFeatures={() => {
          window.scrollTo({ top: 600, behavior: "smooth" });
        }}
        waitlistCount={waitlistCount}
      />
      <FeatureGrid />
      <PricingTable onSelectPlan={handleSelectPlan} />
      <TestimonialsSection />
      <FaqAccordion />
      <WaitlistForm selectedPlan={selectedPlan} onSuccess={(e) => onLeadCaptured?.(e)} />

      <footer style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", padding: "30px 20px", textAlign: "center", color: "#64748b", fontSize: "12px" }}>
        © 2026 Colorful Landing. Tous droits réservés · Développé avec ForgeAI Studio & React 18
      </footer>
    </div>
  );
};
`, "utf-8");
  count++;

  // 10. Feature : LeadConversionDashboard.tsx
  await fs.writeFile(path.join(projDir, "src", "features", "LeadConversionDashboard.tsx"), `import React, { useState, useEffect } from "react";
import { Lead } from "../types";
import { LeadService } from "../services/leadService";
import { Users, Download, UserCheck, TrendingUp, Mail } from "lucide-react";

export const LeadConversionDashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filterPlan, setFilterPlan] = useState<string>("all");

  useEffect(() => {
    setLeads(LeadService.getLeads());
  }, []);

  const filtered = leads.filter(l => filterPlan === "all" || l.planInterest === filterPlan);

  const exportCSV = () => {
    const headers = "ID,Email,Nom,Plan,Date,Statut\\n";
    const rows = leads.map(l => '"' + l.id + '","' + l.email + '","' + (l.name || '') + '","' + l.planInterest + '","' + l.createdAt + '","' + l.status + '"').join("\\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "leads_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "10px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "rgba(124, 58, 237, 0.1)", border: "1px solid rgba(124, 58, 237, 0.3)", borderRadius: 14, padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#c4b5fd" }}><Users size={20} /> Total Prospects</div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#fff", marginTop: 8 }}>{leads.length}</div>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: 4 }}>+100% capturés en direct</div>
        </div>
        <div style={{ background: "rgba(236, 72, 153, 0.1)", border: "1px solid rgba(236, 72, 153, 0.3)", borderRadius: 14, padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#f472b6" }}><TrendingUp size={20} /> Taux de Conversion</div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#fff", marginTop: 8 }}>4.8%</div>
          <div style={{ fontSize: "11px", color: "#34d399", marginTop: 4 }}>Supérieur à la moyenne (+1.8%)</div>
        </div>
        <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: 14, padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#34d399" }}><UserCheck size={20} /> Intérêt Plan Pro</div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#fff", marginTop: 8 }}>{leads.filter(l => l.planInterest === "pro").length}</div>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: 4 }}>Offre phare choisie</div>
        </div>
      </div>

      <div style={{ background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 16, padding: "24px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div>
          <h2 style={{ fontSize: "20px", color: "#f8fafc", margin: "0 0 4px", display: "flex", alignItems: "center", gap: 8 }}>
            <Mail size={20} color="#ec4899" /> Liste des Leads Enregistrés
          </h2>
          <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>Les contacts saisis dans le formulaire sont stockés ici en temps réel.</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)} style={{ background: "rgba(0, 0, 0, 0.3)", border: "1px solid rgba(255, 255, 255, 0.12)", color: "#fff", borderRadius: 8, padding: "8px 12px", fontSize: "12px", outline: "none" }}>
            <option value="all">Tous les plans</option>
            <option value="starter">Starter</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
          <button onClick={exportCSV} style={{ background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, fontSize: "12px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Download size={14} /> Exporter CSV
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(l => (
          <div key={l.id} style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: 12, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc" }}>{l.email}</div>
              <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: 2 }}>
                {l.name ? l.name + " · " : ""}Formule choisie : <span style={{ color: "#ec4899", fontWeight: 700 }}>{l.planInterest.toUpperCase()}</span> · {l.createdAt}
              </div>
            </div>
            <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: "rgba(16, 185, 129, 0.15)", color: "#34d399" }}>
              CAPTITÉ
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
`, "utf-8");
  count++;

  // 11. Main App.tsx pour Landing Page & Conversion
  await fs.writeFile(path.join(projDir, "src", "App.tsx"), `import React, { useState } from "react";
import { LandingPageMain } from "./features/LandingPageMain";
import { LeadConversionDashboard } from "./features/LeadConversionDashboard";
import { Sparkles, Users, Activity } from "lucide-react";

export function App() {
  const [currentTab, setCurrentTab] = useState<"landing" | "leads">("landing");
  const [leadToast, setLeadToast] = useState<string | null>(null);

  const handleLeadCaptured = (email: string) => {
    setLeadToast("Lead capturé avec succès (" + email + ") !");
    setTimeout(() => setLeadToast(null), 4000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f19", color: "#f8fafc", fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <header style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", background: "rgba(11, 15, 25, 0.95)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50, padding: "12px 24px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ background: "linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)", borderRadius: 10, padding: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={20} color="#fff" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "16px", fontWeight: 800, color: "#f8fafc" }}>${pack.name}</span>
                <span style={{ fontSize: "10px", background: "rgba(236, 72, 153, 0.2)", color: "#f472b6", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>Landing Page & Conversion</span>
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>Palette #7C3AED / #EC4899 · Capture de Leads & Waitlist</div>
            </div>
          </div>

          <nav style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", overflowX: "auto" }}>
            <button onClick={() => setCurrentTab("landing")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, fontSize: "12px", fontWeight: currentTab === "landing" ? 700 : 500, cursor: "pointer", background: currentTab === "landing" ? "linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)" : "transparent", color: "#fff", border: "none" }}>
              <Sparkles size={14} /> Vitrine & Landing
            </button>
            <button onClick={() => setCurrentTab("leads")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, fontSize: "12px", fontWeight: currentTab === "leads" ? 700 : 500, cursor: "pointer", background: currentTab === "leads" ? "linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)" : "transparent", color: "#fff", border: "none" }}>
              <Users size={14} /> Leads & Conversions
            </button>
          </nav>

          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "11px", color: "#34d399", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)", padding: "4px 10px", borderRadius: 20 }}><Activity size={12} /> Prêt pour Acquisition</span>
        </div>
      </header>

      {leadToast && (
        <div style={{ background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)", color: "#000", padding: "10px 24px", textAlign: "center", fontSize: "13px", fontWeight: 800, position: "sticky", top: 65, zIndex: 49, boxShadow: "0 4px 20px rgba(16,185,129,0.4)" }}>
          🎉 {leadToast}
        </div>
      )}

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px 20px" }}>
        {currentTab === "landing" && <LandingPageMain onLeadCaptured={handleLeadCaptured} />}
        {currentTab === "leads" && <LeadConversionDashboard />}
      </main>
    </div>
  );
}

export default App;
`, "utf-8");
  count++;

  return count;
}

async function generateEcommerceApp(projDir, projectName, pack) {
  const primaryColor = pack.designTokens?.primary || "#10B981";
  const accentColor = pack.designTokens?.accent || "#06B6D4";
  let count = 0;

  // Types
  const typesContent = `/**
 * Modèle de données & contrats TypeScript — ${pack.name}
 * Domaine : ${pack.domain || "E-Commerce"}
 */

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  brand: string;
  attributes: { size?: string[]; color?: string[] };
  stock: number;
  rating: number;
  reviewCount: number;
  description: string;
  isPromo?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered";
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
}

export interface FilterState {
  category: string;
  maxPrice: number;
  sortBy: "popular" | "price-asc" | "price-desc" | "rating";
  searchQuery: string;
  inStockOnly?: boolean;
  promoOnly?: boolean;
}
`;
  await fs.writeFile(path.join(projDir, "src", "types", "index.ts"), typesContent, "utf-8");
  count++;

  // Mock Data
  const mockDataContent = `import { Product } from "../types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-01",
    slug: "casque-sans-fil-anc-pro",
    name: "Casque Audio Spatial ANC Pro",
    price: 249.99,
    compareAtPrice: 299.99,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"],
    category: "Audio & Tech",
    brand: "AuraSound",
    attributes: { color: ["Noir Mat", "Argent", "Bleu Nuit"] },
    stock: 24,
    rating: 4.8,
    reviewCount: 142,
    description: "Réduction de bruit active adaptative hybride, audio haute résolution 24-bit et autonomie de 40 heures.",
    isPromo: true
  },
  {
    id: "prod-02",
    slug: "montre-connectee-zenith-pulse",
    name: "Montre Connectée Zenith Pulse",
    price: 189.00,
    compareAtPrice: 229.00,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"],
    category: "Objets Connectés",
    brand: "ZenithTech",
    attributes: { color: ["Titane", "Carbone", "Or Rose"] },
    stock: 18,
    rating: 4.7,
    reviewCount: 89,
    description: "Écran AMOLED Always-On, suivi cardiofréquencemètre en continu, GPS intégré et étanchéité 50m.",
    isPromo: true
  },
  {
    id: "prod-03",
    slug: "clavier-mecanique-rgb-tactile",
    name: "Clavier Mécanique Lumina 75%",
    price: 139.50,
    images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80"],
    category: "Informatique",
    brand: "VortexKeys",
    attributes: { color: ["Blanc Glacé", "Gris Anthracite"] },
    stock: 35,
    rating: 4.9,
    reviewCount: 210,
    description: "Switches tactiles lubrifiés en usine, châssis aluminium CNC et connectivité triple-mode.",
    isPromo: false
  },
  {
    id: "prod-04",
    slug: "sac-a-dos-urbain-etanche",
    name: "Sac à Dos Urbain Nomad Waterproof",
    price: 89.90,
    compareAtPrice: 119.00,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"],
    category: "Maroquinerie & Voyage",
    brand: "NomadCraft",
    attributes: { color: ["Noir Tactique", "Vert Olive"] },
    stock: 42,
    rating: 4.6,
    reviewCount: 67,
    description: "Tissu Cordura imperméable, compartiment ordinateur 16 pouces et poche anti-RFID.",
    isPromo: true
  }
];

export const CATEGORIES = ["Tous", "Audio & Tech", "Objets Connectés", "Informatique", "Maroquinerie & Voyage"];
`;
  await fs.writeFile(path.join(projDir, "src", "services", "mockData.ts"), mockDataContent, "utf-8");
  count++;

  // Components ProductCard, FilterSidebar, CartDrawer, CheckoutWizard
  await fs.writeFile(path.join(projDir, "src", "components", "ProductCard.tsx"), `import React from "react";
import { Product } from "../types";
import { ShoppingBag, Star, Eye } from "lucide-react";

export const ProductCard: React.FC<{
  product: Product;
  onAddToCart: (p: Product) => void;
  onViewDetail: (p: Product) => void;
}> = ({ product, onAddToCart, onViewDetail }) => (
  <div className="product-card">
    <div className="product-image-wrap" onClick={() => onViewDetail(product)}>
      <img src={product.images[0]} alt={product.name} className="product-image" loading="lazy" />
      {product.isPromo && <span className="promo-tag">PROMO</span>}
      <button className="quick-view-btn" onClick={(e) => { e.stopPropagation(); onViewDetail(product); }}>
        <Eye size={15} />
      </button>
    </div>
    <div className="product-info">
      <div className="product-category">{product.category} · {product.brand}</div>
      <h3 className="product-title" onClick={() => onViewDetail(product)}>{product.name}</h3>
      <div className="product-rating">
        <Star size={13} className="star-filled" />
        <span className="rating-val">{product.rating}</span>
        <span className="rating-count">({product.reviewCount})</span>
      </div>
      <div className="product-footer">
        <div className="product-price-box">
          <span className="product-price">{product.price.toFixed(2)} €</span>
          {product.compareAtPrice && <span className="product-compare-price">{product.compareAtPrice.toFixed(2)} €</span>}
        </div>
        <button className="add-to-cart-btn" onClick={() => onAddToCart(product)}>
          <ShoppingBag size={15} />
          <span>Ajouter</span>
        </button>
      </div>
    </div>
  </div>
);`, "utf-8");
  count++;

  await fs.writeFile(path.join(projDir, "src", "components", "FilterSidebar.tsx"), `import React from "react";
import { FilterState } from "../types";
import { CATEGORIES } from "../services/mockData";
import { SlidersHorizontal, RotateCcw, Check, ShieldCheck } from "lucide-react";

export const FilterSidebar: React.FC<{
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onReset: () => void;
  totalResults: number;
}> = ({ filters, onChange, onReset, totalResults }) => (
  <aside style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 20 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <SlidersHorizontal size={16} color="#10b981" />
        <b style={{ fontSize: "14px", color: "#f8fafc" }}>Filtres Catalogue</b>
        <span style={{ fontSize: "10px", background: "rgba(16,185,129,0.2)", color: "#34d399", padding: "1px 6px", borderRadius: 10, fontWeight: 700 }}>{totalResults}</span>
      </div>
      <button onClick={onReset} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: "11px" }}>
        <RotateCcw size={12} /> Reset
      </button>
    </div>

    <div>
      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#cbd5e1", marginBottom: 6, textTransform: "uppercase" }}>Trier par</label>
      <select value={filters.sortBy} onChange={(e) => onChange({ ...filters, sortBy: e.target.value as any })} style={{ width: "100%", background: "#0b0f19", border: "1px solid rgba(255,255,255,0.12)", color: "#f8fafc", padding: "8px 10px", borderRadius: 8, fontSize: "12px" }}>
        <option value="popular">Pertinence & Popularité</option>
        <option value="price-asc">Prix : Moins cher au plus cher</option>
        <option value="price-desc">Prix : Plus cher au moins cher</option>
        <option value="rating">Meilleures Évaluations (★)</option>
      </select>
    </div>

    <div>
      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#cbd5e1", marginBottom: 8, textTransform: "uppercase" }}>Catégories</label>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {CATEGORIES.map((cat) => {
          const isSelected = filters.category === cat;
          return (
            <button key={cat} onClick={() => onChange({ ...filters, category: cat })} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 10px", borderRadius: 6, fontSize: "12px", background: isSelected ? "rgba(16,185,129,0.15)" : "transparent", color: isSelected ? "#34d399" : "#94a3b8", border: isSelected ? "1px solid rgba(16,185,129,0.3)" : "1px solid transparent", cursor: "pointer", textAlign: "left" }}>
              <span>{cat}</span>
              {isSelected && <Check size={13} color="#34d399" />}
            </button>
          );
        })}
      </div>
    </div>

    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <label style={{ fontSize: "11px", fontWeight: 700, color: "#cbd5e1", textTransform: "uppercase" }}>Prix Maximum</label>
        <span style={{ fontSize: "12px", fontWeight: 800, color: "#10b981" }}>{filters.maxPrice} €</span>
      </div>
      <input type="range" min="30" max="350" step="10" value={filters.maxPrice} onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })} style={{ width: "100%", accentColor: "#10b981" }} />
    </div>

    <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.18)", borderRadius: 8, padding: "8px 10px", fontSize: "10px", color: "#34d399", display: "flex", alignItems: "center", gap: 6 }}>
      <ShieldCheck size={14} /> <span>Module adapté : <b>Boundless FilterForm (MIT)</b></span>
    </div>
  </aside>
);`, "utf-8");
  count++;

  await fs.writeFile(path.join(projDir, "src", "components", "CartDrawer.tsx"), `import React from "react";
import { CartItem } from "../types";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export const CartDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, q: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedCheckout: () => void;
}> = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onProceedCheckout }) => {
  if (!isOpen) return null;
  const subtotal = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const total = subtotal;

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <div className="cart-title"><ShoppingBag size={18} /><span>Mon Panier ({items.length})</span></div>
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        {items.length === 0 ? (
          <div className="cart-empty"><p>Votre panier est vide.</p></div>
        ) : (
          <div className="cart-items-list">
            {items.map(item => (
              <div key={item.product.id} className="cart-item-row">
                <img src={item.product.images[0]} alt={item.product.name} className="cart-item-img" />
                <div className="cart-item-details">
                  <div className="cart-item-name">{item.product.name}</div>
                  <div className="cart-item-unit-price">{item.product.price.toFixed(2)} €</div>
                  <div className="qty-controls">
                    <button onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}>+</button>
                    <button onClick={() => onRemoveItem(item.product.id)}><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            ))}
            <div className="cart-footer">
              <div className="cart-summary-total">Total : {total.toFixed(2)} €</div>
              <button className="checkout-btn" onClick={onProceedCheckout}>Commander <ArrowRight size={15} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};`, "utf-8");
  count++;

  // CheckoutWizard.tsx
  await fs.writeFile(
    path.join(projDir, "src", "components", "CheckoutWizard.tsx"),
    `import React, { useState } from "react";
import { CartItem } from "../types";
import {
  X,
  CheckCircle2,
  Truck,
  CreditCard,
  ArrowRight,
} from "lucide-react";

interface CheckoutWizardProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: () => void;
}

export const CheckoutWizard: React.FC<CheckoutWizardProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingData, setShippingData] = useState({
    fullName: "",
    street: "",
    city: "",
    postalCode: "",
    country: "France",
  });

  if (!isOpen) return null;

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const updateShipping = (
    field: keyof typeof shippingData,
    value: string,
  ) => {
    setShippingData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (
        !shippingData.fullName.trim() ||
        !shippingData.street.trim() ||
        !shippingData.city.trim() ||
        !shippingData.postalCode.trim()
      ) {
        return;
      }

      setStep(2);
      return;
    }

    if (step === 2) {
      setIsProcessing(true);

      window.setTimeout(() => {
        setIsProcessing(false);
        setStep(3);
        onOrderSuccess();
      }, 800);
    }
  };

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      style={{
        background: "rgba(15, 23, 42, 0.96)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 16,
        padding: 24,
        maxWidth: 720,
        width: "100%",
        margin: "0 auto",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          paddingBottom: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <h2
            id="checkout-title"
            style={{
              color: "#f8fafc",
              fontSize: 20,
              margin: 0,
            }}
          >
            Tunnel de commande
          </h2>

          <p
            style={{
              color: "#94a3b8",
              fontSize: 12,
              margin: "5px 0 0",
            }}
          >
            Étape {step} sur 3
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer le tunnel de commande"
          style={{
            background: "transparent",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
          }}
        >
          <X size={18} />
        </button>
      </header>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 24,
          fontSize: 12,
          color: "#94a3b8",
        }}
      >
        <span style={{ color: step >= 1 ? "#10b981" : "#64748b" }}>
          1. Livraison
        </span>
        <span>—</span>
        <span style={{ color: step >= 2 ? "#10b981" : "#64748b" }}>
          2. Paiement
        </span>
        <span>—</span>
        <span style={{ color: step >= 3 ? "#10b981" : "#64748b" }}>
          3. Confirmation
        </span>
      </div>

      {step === 1 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <h3 style={{ color: "#f8fafc", margin: 0 }}>
            Adresse de livraison
          </h3>

          <input
            value={shippingData.fullName}
            onChange={(event) =>
              updateShipping("fullName", event.target.value)
            }
            placeholder="Nom complet"
            autoComplete="name"
            style={inputStyle}
          />

          <input
            value={shippingData.street}
            onChange={(event) =>
              updateShipping("street", event.target.value)
            }
            placeholder="Adresse"
            autoComplete="street-address"
            style={inputStyle}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <input
              value={shippingData.postalCode}
              onChange={(event) =>
                updateShipping("postalCode", event.target.value)
              }
              placeholder="Code postal"
              autoComplete="postal-code"
              style={inputStyle}
            />

            <input
              value={shippingData.city}
              onChange={(event) =>
                updateShipping("city", event.target.value)
              }
              placeholder="Ville"
              autoComplete="address-level2"
              style={inputStyle}
            />
          </div>

          <button type="button" onClick={handleNext} style={primaryButtonStyle}>
            Continuer vers le paiement
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <h3 style={{ color: "#f8fafc", margin: 0 }}>
            Récapitulatif et paiement
          </h3>

          <div
            style={{
              background: "rgba(0,0,0,0.25)",
              borderRadius: 10,
              padding: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#cbd5e1",
                fontSize: 13,
              }}
            >
              <span>Articles</span>
              <span>{items.length}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#cbd5e1",
                fontSize: 13,
                marginTop: 10,
              }}
            >
              <span>Livraison</span>
              <span style={{ color: "#34d399" }}>Gratuite</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#f8fafc",
                fontSize: 18,
                fontWeight: 800,
                borderTop: "1px solid rgba(255,255,255,0.1)",
                marginTop: 14,
                paddingTop: 14,
              }}
            >
              <span>Total TTC</span>
              <span style={{ color: "#10b981" }}>
                {total.toFixed(2)} €
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={isProcessing}
            style={{
              ...primaryButtonStyle,
              opacity: isProcessing ? 0.7 : 1,
              cursor: isProcessing ? "wait" : "pointer",
            }}
          >
            <CreditCard size={16} />
            {isProcessing
              ? "Traitement en cours..."
              : "Confirmer le paiement"}
          </button>
        </div>
      )}

      {step === 3 && (
        <div
          style={{
            textAlign: "center",
            padding: "32px 0 16px",
          }}
        >
          <CheckCircle2
            size={52}
            color="#10b981"
            style={{ marginBottom: 14 }}
          />

          <h3 style={{ color: "#f8fafc", margin: "0 0 8px" }}>
            Commande confirmée
          </h3>

          <p style={{ color: "#94a3b8", fontSize: 13 }}>
            Votre commande a été enregistrée localement avec succès.
          </p>

          <button
            type="button"
            onClick={onClose}
            style={{
              ...primaryButtonStyle,
              display: "inline-flex",
              marginTop: 16,
            }}
          >
            Fermer
          </button>
        </div>
      )}
    </section>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 13px",
  borderRadius: 8,
  background: "rgba(0,0,0,0.3)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#fff",
  fontSize: 13,
  boxSizing: "border-box",
};

const primaryButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  alignSelf: "flex-end",
  background: "#10b981",
  color: "#04130d",
  border: "none",
  padding: "11px 20px",
  borderRadius: 8,
  fontWeight: 800,
  cursor: "pointer",
};
`,
    "utf-8",
  );
  count++;


  // Storefront.tsx (Avec Breadcrumbs, Pagination, Slider et Filtres Boundless d'office)
  await fs.writeFile(path.join(projDir, "src", "features", "Storefront.tsx"), `import React, { useState, useMemo } from "react";
import { Product, CartItem, FilterState } from "../types";
import { MOCK_PRODUCTS } from "../services/mockData";
import { FilterSidebar } from "../components/FilterSidebar";
import { ProductCard } from "../components/ProductCard";
import { CartDrawer } from "../components/CartDrawer";
import { Sparkles, Search, ShoppingBag, ChevronRight, Home, Flame, Star, ShieldCheck } from "lucide-react";

interface StorefrontProps {
  onSelectProduct?: (product: Product) => void;
}

export const Storefront: React.FC<StorefrontProps> = ({ onSelectProduct }) => {
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filters, setFilters] = useState<FilterState>({
    category: "Tous",
    maxPrice: 350,
    sortBy: "popular",
    searchQuery: "",
    inStockOnly: false,
    promoOnly: false,
  });

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      if (filters.category !== "Tous" && p.category !== filters.category) return false;
      if (p.price > filters.maxPrice) return false;
      if (filters.searchQuery && !p.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
      if (filters.inStockOnly && p.stock <= 0) return false;
      if (filters.promoOnly && !p.isPromo) return false;
      return true;
    });

    if (filters.sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [products, filters]);

  const promoProducts = useMemo(() => {
    return products.filter((p) => p.isPromo || p.compareAtPrice);
  }, [products]);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  return (
    <div className="storefront-root">
      {/* Fil d'Ariane Boundless BreadCrumbs */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "12px", color: "#94a3b8", marginBottom: 16 }}>
        <button onClick={() => setFilters({ ...filters, category: "Tous" })} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: 0 }}>
          <Home size={13} /> Boutique
        </button>
        <ChevronRight size={13} />
        <span style={{ color: filters.category === "Tous" ? "#10b981" : "#cbd5e1", fontWeight: filters.category === "Tous" ? 700 : 500 }}>Catalogue</span>
        {filters.category !== "Tous" && (
          <>
            <ChevronRight size={13} />
            <span style={{ color: "#10b981", fontWeight: 700 }}>{filters.category}</span>
          </>
        )}
        <span style={{ marginLeft: "auto", fontSize: "11px", color: "#34d399", background: "rgba(16,185,129,0.12)", padding: "2px 8px", borderRadius: 12, border: "1px solid rgba(16,185,129,0.25)" }}>
          ⚡ 40 Briques Actives (Boundless + Medusa)
        </span>
      </div>

      <header className="storefront-nav">
        <div className="storefront-brand">
          <Sparkles size={20} color="#10b981" />
          <b>${pack.name}</b>
        </div>
        <div className="storefront-search">
          <Search size={15} />
          <input placeholder="Rechercher par nom, marque, catégorie..." value={filters.searchQuery} onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })} />
        </div>
        <button className="cart-trigger-btn" onClick={() => setCartOpen(true)}>
          <ShoppingBag size={18} />
          <span>Panier ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
        </button>
      </header>

      <main className="storefront-layout">
        <FilterSidebar filters={filters} onChange={setFilters} onReset={() => setFilters({ category: "Tous", maxPrice: 350, sortBy: "popular", searchQuery: "", inStockOnly: false, promoOnly: false })} totalResults={filteredProducts.length} />

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <section className="products-grid">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onViewDetail={(item) => onSelectProduct ? onSelectProduct(item) : alert(\`Détails : \${item.name} (\${item.price} €)\`)} />
            ))}
          </section>

          {/* Pagination Interactive Boundless */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 18px" }}>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>Affichage de <b>{filteredProducts.length}</b> produit(s)</span>
            <div style={{ display: "flex", gap: 6 }}>
              {[1, 2].map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)} style={{ width: 32, height: 32, borderRadius: 6, border: currentPage === page ? "1px solid #10b981" : "1px solid rgba(255,255,255,0.1)", background: currentPage === page ? "#10b981" : "rgba(255,255,255,0.05)", color: currentPage === page ? "#000" : "#cbd5e1", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}>{page}</button>
              ))}
            </div>
          </div>

          {/* Carrousel Promotions Recommandées Boundless ProductsSlider */}
          <div style={{ background: "rgba(15,23,42,0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Flame size={18} color="#f59e0b" />
              <b style={{ fontSize: "14px", color: "#f8fafc" }}>Offres & Promotions Recommandées (Boundless Slider)</b>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
              {promoProducts.slice(0, 4).map((item) => (
                <div key={item.id} onClick={() => onSelectProduct && onSelectProduct(item)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 12, cursor: "pointer" }}>
                  <div style={{ width: "100%", height: 110, borderRadius: 8, overflow: "hidden", marginBottom: 8 }}><img src={item.images[0]} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#f8fafc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}><span style={{ fontSize: "13px", fontWeight: 800, color: "#10b981" }}>{item.price.toFixed(2)} €</span><span style={{ fontSize: "10px", color: "#f59e0b", display: "flex", alignItems: "center", gap: 2 }}><Star size={11} fill="#f59e0b" /> {item.rating}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <CartDrawer isOpen={cartOpen} items={cart} onClose={() => setCartOpen(false)} onUpdateQuantity={(id, delta) => setCart(prev => prev.map(i => i.product.id === id ? { ...i, quantity: i.quantity + delta } : i).filter(i => i.quantity > 0))} onRemoveItem={(id) => setCart(prev => prev.filter(i => i.product.id !== id))} onProceedCheckout={() => alert("Tunnel de commande prêt !")} />
    </div>
  );
};`, "utf-8");
  count++;

  // ProductDetailPage.tsx (Avec Medusa add-variant-modal & edit-variant-inventory d'office)
  await fs.writeFile(path.join(projDir, "src", "features", "ProductDetailPage.tsx"), `import React, { useState } from "react";
import { Product } from "../types";
import { MOCK_PRODUCTS } from "../services/mockData";
import { Star, ShoppingCart, ShieldCheck, Truck, ArrowLeft, Heart, Share2, Check, Plus, Sliders, X, Box } from "lucide-react";

interface ProductDetailPageProps {
  productId?: string;
  onBackToCatalog: () => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  activeFeatureHighlight?: string | null;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId, onBackToCatalog, onAddToCart, activeFeatureHighlight }) => {
  const product: Product = MOCK_PRODUCTS.find(p => p.id === productId) || MOCK_PRODUCTS[0];
  const [selectedImage, setSelectedImage] = useState(product.images[0] || "");
  const [sizes, setSizes] = useState<string[]>(product.attributes.size || ["S", "M", "L", "XL"]);
  const [colors, setColors] = useState<string[]>(product.attributes.color || ["Noir", "Gris", "Argent"]);
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "M");
  const [selectedColor, setSelectedColor] = useState(colors[0] || "Noir");
  const [currentStock, setCurrentStock] = useState<number>(product.stock || 48);
  const [warehouseLocation, setWarehouseLocation] = useState<string>("Zone Logistique B-12");
  const [modalMode, setModalMode] = useState<"none" | "add-variant" | "edit-inventory">("none");
  const [newSizeInput, setNewSizeInput] = useState("");
  const [newColorInput, setNewColorInput] = useState("");
  const [stockInput, setStockInput] = useState(currentStock.toString());
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart({ ...product, stock: currentStock }, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleSaveNewVariant = () => {
    if (newSizeInput.trim() && !sizes.includes(newSizeInput.trim().toUpperCase())) {
      setSizes(prev => [...prev, newSizeInput.trim().toUpperCase()]);
      setSelectedSize(newSizeInput.trim().toUpperCase());
    }
    if (newColorInput.trim() && !colors.includes(newColorInput.trim())) {
      setColors(prev => [...prev, newColorInput.trim()]);
      setSelectedColor(newColorInput.trim());
    }
    setNewSizeInput("");
    setNewColorInput("");
    setModalMode("none");
  };

  const handleSaveInventory = () => {
    const val = parseInt(stockInput, 10);
    if (!isNaN(val) && val >= 0) setCurrentStock(val);
    setModalMode("none");
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "10px 0" }}>
      <button onClick={onBackToCatalog} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: "#94a3b8", fontSize: "13px", cursor: "pointer", marginBottom: 20 }}>
        <ArrowLeft size={16} /> Retour au catalogue
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 40, background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 32 }}>
        <div>
          <div style={{ width: "100%", height: "420px", borderRadius: 12, overflow: "hidden", background: "#0b0f19", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 16 }}>
            <img src={selectedImage || product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>

        <div>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#10b981", background: "rgba(16,185,129,0.15)", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>{product.category}</span>
          <h1 style={{ fontSize: "26px", color: "#f8fafc", margin: "8px 0" }}>{product.name}</h1>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, margin: "16px 0" }}>
            <span style={{ fontSize: "32px", fontWeight: 900, color: "#10b981" }}>{product.price.toFixed(2)} €</span>
            {product.compareAtPrice && <span style={{ fontSize: "18px", color: "#64748b", textDecoration: "line-through" }}>{product.compareAtPrice.toFixed(2)} €</span>}
          </div>
          <p style={{ fontSize: "13px", lineHeight: "1.6", color: "#cbd5e1", marginBottom: 20 }}>{product.description}</p>

          {/* Tailles & Bouton d'ajout de variante Medusa */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#cbd5e1" }}>Taille : <span style={{ color: "#10b981" }}>{selectedSize}</span></label>
              <button onClick={() => setModalMode("add-variant")} style={{ background: "rgba(99, 102, 241, 0.15)", color: "#a5b4fc", border: "1px solid rgba(99, 102, 241, 0.3)", borderRadius: 4, padding: "2px 8px", fontSize: "10px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}><Plus size={11} /> Ajouter Variante (Medusa UI)</button>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {sizes.map(sz => (
                <button key={sz} onClick={() => setSelectedSize(sz)} style={{ padding: "8px 16px", borderRadius: 6, fontSize: "12px", fontWeight: 700, cursor: "pointer", background: selectedSize === sz ? "#10b981" : "rgba(255,255,255,0.05)", color: selectedSize === sz ? "#000" : "#cbd5e1", border: selectedSize === sz ? "1px solid #10b981" : "1px solid rgba(255,255,255,0.1)" }}>{sz}</button>
              ))}
            </div>
          </div>

          {/* Couleurs */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#cbd5e1", marginBottom: 8 }}>Couleur : <span style={{ color: "#10b981" }}>{selectedColor}</span></label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {colors.map(col => (
                <button key={col} onClick={() => setSelectedColor(col)} style={{ padding: "6px 14px", borderRadius: 6, fontSize: "12px", cursor: "pointer", background: selectedColor === col ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)", color: selectedColor === col ? "#34d399" : "#cbd5e1", border: selectedColor === col ? "1px solid #10b981" : "1px solid rgba(255,255,255,0.1)" }}>{col}</button>
              ))}
            </div>
          </div>

          {/* Module Gestionnaire d'Inventaire Medusa */}
          <div style={{ background: "rgba(11, 15, 25, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 10, padding: 14, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8" }}>RÉFÉRENCE SKU : <code style={{ color: "#38bdf8" }}>ECOM-{product.id}-{selectedSize}-{selectedColor.slice(0, 3).toUpperCase()}</code></div>
              <button onClick={() => setModalMode("edit-inventory")} style={{ background: "transparent", border: "none", color: "#38bdf8", cursor: "pointer", fontSize: "11px", display: "flex", alignItems: "center", gap: 4 }}><Sliders size={12} /> Ajuster Stock (Medusa)</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: "12px", color: "#cbd5e1" }}>
              <div>📦 Disponibilité : <b style={{ color: currentStock > 0 ? "#10b981" : "#ef4444" }}>{currentStock} unités</b></div>
              <div>🏢 Emplacement : <b style={{ color: "#f8fafc" }}>{warehouseLocation}</b></div>
            </div>
          </div>

          <button onClick={handleAdd} disabled={currentStock <= 0} style={{ width: "100%", padding: "16px", borderRadius: 10, fontSize: "15px", fontWeight: 800, background: added ? "#059669" : "#10b981", color: "#000", border: "none", cursor: currentStock > 0 ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            {added ? <><Check size={18} /> Ajouté au panier !</> : <><ShoppingCart size={18} /> Ajouter au Panier</>}
          </button>
        </div>
      </div>

      {/* Modale d'ajout de variante Medusa */}
      {modalMode === "add-variant" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#0b0f19", border: "1px solid rgba(99,102,241,0.4)", borderRadius: 14, padding: 24, maxWidth: "440px", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <b style={{ color: "#f8fafc", fontSize: "15px" }}>Ajouter une Variante (Medusa UI)</b>
              <button onClick={() => setModalMode("none")} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={18} /></button>
            </div>
            <input type="text" placeholder="Nouvelle taille (ex: XXL)" value={newSizeInput} onChange={e => setNewSizeInput(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: "8px 12px", color: "#fff", marginBottom: 10 }} />
            <input type="text" placeholder="Nouvelle couleur (ex: Vert Émeraude)" value={newColorInput} onChange={e => setNewColorInput(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: "8px 12px", color: "#fff", marginBottom: 16 }} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setModalMode("none")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1", borderRadius: 6, padding: "8px 16px", cursor: "pointer" }}>Annuler</button>
              <button onClick={handleSaveNewVariant} style={{ background: "#10b981", color: "#000", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 700, cursor: "pointer" }}>Ajouter</button>
            </div>
          </div>
        </div>
      )}

      {/* Modale d'ajustement de stock Medusa */}
      {modalMode === "edit-inventory" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#0b0f19", border: "1px solid rgba(56,189,248,0.4)", borderRadius: 14, padding: 24, maxWidth: "440px", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <b style={{ color: "#f8fafc", fontSize: "15px" }}>Modifier l'Inventaire (Medusa UI)</b>
              <button onClick={() => setModalMode("none")} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={18} /></button>
            </div>
            <input type="number" min="0" value={stockInput} onChange={e => setStockInput(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: "8px 12px", color: "#fff", marginBottom: 10 }} />
            <input type="text" value={warehouseLocation} onChange={e => setWarehouseLocation(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: "8px 12px", color: "#fff", marginBottom: 16 }} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setModalMode("none")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1", borderRadius: 6, padding: "8px 16px", cursor: "pointer" }}>Annuler</button>
              <button onClick={handleSaveInventory} style={{ background: "#38bdf8", color: "#000", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 700, cursor: "pointer" }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};`, "utf-8");
  count++;

  // OrdersTrackingPage.tsx
  await fs.writeFile(path.join(projDir, "src", "features", "OrdersTrackingPage.tsx"), `import React from "react";
import { Package, Clock, CheckCircle2, Truck, Download } from "lucide-react";

export const OrdersTrackingPage: React.FC = () => {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "10px 0" }}>
      <h1 style={{ fontSize: "24px", color: "#f8fafc", margin: "0 0 6px" }}>📦 Mes Commandes & Suivi de Livraison</h1>
      <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: 24 }}>Consultez vos commandes récentes et téléchargez vos factures.</p>
      <div style={{ background: "rgba(15,23,42,0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 14, marginBottom: 16 }}>
          <b>Commande #CMD-2026-9842</b>
          <span style={{ fontSize: "11px", color: "#38bdf8", background: "rgba(56,189,248,0.15)", padding: "3px 8px", borderRadius: 4 }}><Truck size={12} style={{ display: "inline", marginRight: 4 }} />En acheminement</span>
        </div>
        <p style={{ fontSize: "13px", color: "#cbd5e1" }}>Livraison estimée sous 48h par Colissimo Suivi.</p>
      </div>
    </div>
  );
};`, "utf-8");
  count++;

  // IntegratedModulesPage.tsx
  await fs.writeFile(path.join(projDir, "src", "features", "IntegratedModulesPage.tsx"), `import React from "react";
import { MOUNTED_MANIFEST } from "../integrations";
import { Layers, Code2, Sliders, Box } from "lucide-react";

export const IntegratedModulesPage: React.FC = () => {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "10px 0" }}>
      <h1 style={{ fontSize: "24px", color: "#f8fafc", margin: "0 0 6px" }}>🧩 Modules & Briques Intégrées</h1>
      <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: 20 }}>Composants open-source adaptés dans src/integrations/ et branchés dans l'application.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
        {MOUNTED_MANIFEST.map((m, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#f8fafc" }}><Code2 size={13} style={{ display: "inline", marginRight: 6, color: "#10b981" }} />{m.fileName}</div>
              <div style={{ fontSize: "10px", color: "#64748b" }}>{m.repo}</div>
            </div>
            <span style={{ fontSize: "9px", color: "#38bdf8", background: "rgba(56,189,248,0.15)", padding: "2px 6px", borderRadius: 4 }}>{m.license}</span>
          </div>
        ))}
      </div>
    </div>
  );
};`, "utf-8");
  count++;

  // Main App.tsx (Multi-Pages 100% Métier & Animations)
  await fs.writeFile(path.join(projDir, "src", "App.tsx"), `import React, { useState } from "react";
import { Storefront } from "./features/Storefront";
import { ProductDetailPage } from "./features/ProductDetailPage";
import { CheckoutWizard } from "./components/CheckoutWizard";
import { OrdersTrackingPage } from "./features/OrdersTrackingPage";
import { AnimatedGradient } from "./animation/AnimatedGradient";
import { AnimatedLogo } from "./animation/AnimatedLogo";
import { ParticleField } from "./animation/ParticleField";
import { AnimatedContainer } from "./animation/AnimatedContainer";
import { AnimatedCube } from "./components/3d/AnimatedCube";
import { MOCK_PRODUCTS } from "./services/mockData";
import { Product, CartItem } from "./types";
import { Store, ShoppingBag, ShoppingCart, PackageCheck, Sparkles, Activity } from "lucide-react";

type Tab = "catalog" | "product" | "checkout" | "orders";
const ACCENT = "${primaryColor}";

export function App() {
  const [currentTab, setCurrentTab] = useState<Tab>("catalog");
  const [selectedProductId, setSelectedProductId] = useState<string>(MOCK_PRODUCTS[0]?.id || "1");
  const [cart, setCart] = useState<CartItem[]>([
    { product: MOCK_PRODUCTS[0], quantity: 1, selectedSize: "M", selectedColor: "Noir" },
    { product: MOCK_PRODUCTS[1], quantity: 2, selectedSize: "L", selectedColor: "Gris" }
  ]);

  const TABS: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "catalog",  label: "Vitrine & Catalogue", icon: <Store size={15} /> },
    { id: "product",  label: "Fiche Produit",       icon: <ShoppingBag size={15} /> },
    { id: "checkout", label: "Tunnel Commande",     icon: <ShoppingCart size={15} />, badge: cart.reduce((a, b) => a + b.quantity, 0) },
    { id: "orders",   label: "Mes Commandes",       icon: <PackageCheck size={15} /> },
  ];

  const handleAddToCart = (product: Product, size: string, color: string) => {
    setCart(prev => [...prev, { product, quantity: 1, selectedSize: size, selectedColor: color }]);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#070b14", color: "#f8fafc", fontFamily: "Inter, system-ui, sans-serif", position: "relative", overflowX: "hidden" }}>
      <AnimatedGradient intensity={0.6} />
      <ParticleField />

      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(11,15,25,0.85)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50, padding: "10px 24px" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <AnimatedLogo label="${pack.name}" />
            <span style={{ fontSize: "11px", background: "rgba(16, 185, 129, 0.2)", color: "#34d399", padding: "3px 10px", borderRadius: 14, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Sparkles size={11} color="${primaryColor}" /> Boutique Souveraine
            </span>
          </div>

          <nav style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", overflowX: "auto" }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setCurrentTab(tab.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, fontSize: "12px", fontWeight: currentTab === tab.id ? 700 : 500, cursor: "pointer", background: currentTab === tab.id ? "linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)" : "transparent", color: currentTab === tab.id ? "#000" : "#94a3b8", border: "none", whiteSpace: "nowrap" }}>
                {tab.icon} {tab.label} {tab.badge !== undefined && tab.badge > 0 && <span style={{ fontSize: "10px", background: "#000", color: "#fff", padding: "1px 6px", borderRadius: 10 }}>{tab.badge}</span>}
              </button>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
              <AnimatedCube size={28} />
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "11px", color: "#34d399", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", padding: "5px 12px", borderRadius: 20 }}><Activity size={12} /> Prêt pour Commandes</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1440px", margin: "0 auto", padding: "24px 20px" }}>
        <AnimatedContainer key={currentTab} animation="fade-in" delay={40}>
          {currentTab === "catalog" && <Storefront onSelectProduct={(p) => { setSelectedProductId(p.id); setCurrentTab("product"); }} />}
          {currentTab === "product" && <ProductDetailPage productId={selectedProductId} onBackToCatalog={() => setCurrentTab("catalog")} onAddToCart={handleAddToCart} />}
          {currentTab === "checkout" && <div style={{ maxWidth: "800px", margin: "0 auto" }}><CheckoutWizard isOpen={true} onClose={() => setCurrentTab("catalog")} items={cart} onOrderSuccess={() => { setCart([]); setCurrentTab("orders"); }} /></div>}
          {currentTab === "orders" && <OrdersTrackingPage />}
        </AnimatedContainer>
      </main>
    </div>
  );
}

export default App;`, "utf-8");
  count++;

  return count;
}

async function generateSaasApp(projDir, projectName, pack) {
  const primaryColor = pack.designTokens?.primary || "#0EA5E9";
  const accentColor = pack.designTokens?.accent || "#6366F1";
  let count = 0;

  // 1. src/types/index.ts
  await fs.writeFile(path.join(projDir, "src", "types", "index.ts"), `export interface Metric {
  id: string;
  label: string;
  value: string;
  trend: number;
  description: string;
}

export interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  maxUsers: number;
  recommended?: boolean;
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  date: string;
  customerName?: string;
  customerEmail?: string;
  planName?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Developer" | "Viewer";
  avatar: string;
  joinedAt?: string;
}
`, "utf-8");
  count++;

  // 2. src/services/saasService.ts (Service Réactif avec Persistance LocalStorage)
  await fs.writeFile(path.join(projDir, "src", "services", "saasService.ts"), `export interface SaasPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  maxUsers: number;
  recommended?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Developer" | "Viewer";
  avatar: string;
  joinedAt: string;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  planName: string;
  customerName?: string;
  customerEmail?: string;
}

export interface SaasState {
  currentPlanId: string;
  billingCycle: "monthly" | "yearly";
  mrr: number;
  arr: number;
  activeUsersCount: number;
  team: TeamMember[];
  invoices: Invoice[];
  usage: {
    apiCalls: number;
    apiLimit: number;
    storageUsedGb: number;
    storageLimitGb: number;
  };
}

export const SAAS_PLANS: SaasPlan[] = [
  {
    id: "starter",
    name: "Starter",
    priceMonthly: 29,
    priceYearly: 290,
    maxUsers: 3,
    features: ["Jusqu'à 3 collaborateurs", "10 000 requêtes API / mois", "Support standard par email", "SSL Dédié & SLA 99.9%"],
  },
  {
    id: "pro",
    name: "Professionnel",
    priceMonthly: 79,
    priceYearly: 790,
    maxUsers: 10,
    recommended: true,
    features: ["Jusqu'à 10 collaborateurs", "100 000 requêtes API / mois", "Support prioritaire 24/7", "Webhooks Stripe & SSO SAML", "Analytics avancés & Export CSV"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: 199,
    priceYearly: 1990,
    maxUsers: 50,
    features: ["Collaborateurs illimités", "Requêtes API illimitées", "Account Manager dédié", "Audit logs & Chiffrement bancaire", "Déploiement sur-mesure sur Cloud privé"],
  },
];

const INITIAL_TEAM: TeamMember[] = [
  { id: "1", name: "Alexandre Martin", email: "alexandre@entreprise.fr", role: "Owner", avatar: "AM", joinedAt: "12 Janvier 2026" },
  { id: "2", name: "Sophie Bernard", email: "sophie.b@entreprise.fr", role: "Admin", avatar: "SB", joinedAt: "03 Février 2026" },
  { id: "3", name: "Thomas Dubois", email: "thomas.dev@entreprise.fr", role: "Developer", avatar: "TD", joinedAt: "18 Mars 2026" },
];

const INITIAL_INVOICES: Invoice[] = [
  { id: "inv-01", number: "FAC-2026-003", date: "01 Septembre 2026", amount: 79.0, status: "paid", planName: "Professionnel", customerName: "Acme Corp", customerEmail: "billing@acme.com" },
  { id: "inv-02", number: "FAC-2026-002", date: "01 Août 2026", amount: 79.0, status: "paid", planName: "Professionnel", customerName: "CyberPulse SAS", customerEmail: "finance@cyberpulse.io" },
  { id: "inv-03", number: "FAC-2026-001", date: "01 Juillet 2026", amount: 29.0, status: "paid", planName: "Starter", customerName: "Studio Orbit", customerEmail: "hello@orbit.design" },
];

export class SaasService {
  private static readonly STORAGE_KEY = "forgeai_saas_state";
  private static listeners: Array<(state: SaasState) => void> = [];

  static subscribe(listener: (state: SaasState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private static notify(state: SaasState): void {
    this.listeners.forEach((l) => l(state));
  }

  static getState(): SaasState {
    if (typeof window === "undefined") return this.getDefaultState();
    try {
      const raw = window.localStorage.getItem(this.STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    const def = this.getDefaultState();
    this.save(def);
    return def;
  }

  private static getDefaultState(): SaasState {
    return {
      currentPlanId: "pro",
      billingCycle: "monthly",
      mrr: 79,
      arr: 948,
      activeUsersCount: 1420,
      team: INITIAL_TEAM,
      invoices: INITIAL_INVOICES,
      usage: {
        apiCalls: 64230,
        apiLimit: 100000,
        storageUsedGb: 14.8,
        storageLimitGb: 50.0,
      },
    };
  }

  static changePlan(planId: string, cycle: "monthly" | "yearly" = "monthly"): SaasState {
    const state = this.getState();
    const plan = SAAS_PLANS.find((p) => p.id === planId) || SAAS_PLANS[1];
    const price = cycle === "monthly" ? plan.priceMonthly : plan.priceYearly / 12;

    state.currentPlanId = planId;
    state.billingCycle = cycle;
    state.mrr = price;
    state.arr = price * 12;

    const newInvoice: Invoice = {
      id: "inv-" + Date.now(),
      number: "FAC-2026-" + String(state.invoices.length + 1).padStart(3, "0"),
      date: "Aujourd'hui",
      amount: cycle === "monthly" ? plan.priceMonthly : plan.priceYearly,
      status: "paid",
      planName: plan.name,
      customerName: "Espace Workspace",
      customerEmail: "admin@saas.io"
    };
    state.invoices = [newInvoice, ...state.invoices];

    this.save(state);
    return state;
  }

  static inviteMember(name: string, email: string, role: TeamMember["role"] = "Developer"): SaasState {
    const state = this.getState();
    const initials = name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const newMember: TeamMember = {
      id: "user-" + Date.now(),
      name,
      email,
      role,
      avatar: initials || "U",
      joinedAt: "À l'instant",
    };

    state.team = [...state.team, newMember];
    this.save(state);
    return state;
  }

  static removeMember(id: string): SaasState {
    const state = this.getState();
    state.team = state.team.filter((m) => m.id !== id);
    this.save(state);
    return state;
  }

  static incrementApiUsage(calls = 100): SaasState {
    const state = this.getState();
    state.usage.apiCalls = Math.min(state.usage.apiLimit, state.usage.apiCalls + calls);
    this.save(state);
    return state;
  }

  private static save(state: SaasState): void {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
      } catch (_) {}
    }
    this.notify(state);
  }
}
`, "utf-8");
  count++;

  // 3. src/features/SaasDashboard.tsx
  await fs.writeFile(path.join(projDir, "src", "features", "SaasDashboard.tsx"), `import React, { useState, useEffect } from "react";
import { SaasService, SaasState, SAAS_PLANS } from "../services/saasService";
import {
  TrendingUp,
  CreditCard,
  Users,
  Shield,
  Plus,
  Download,
  CheckCircle2,
  Zap,
  Activity,
  Trash2,
} from "lucide-react";

interface SaasDashboardProps {
  defaultTab?: "dashboard" | "billing" | "team" | "overview";
}

export const SaasDashboard: React.FC<SaasDashboardProps> = ({ defaultTab }) => {
  const [state, setState] = useState<SaasState>(SaasService.getState());
  const resolvedDefault =
    defaultTab === "dashboard"
      ? "overview"
      : (defaultTab as "overview" | "billing" | "team") ?? "overview";
  const [activeTab, setActiveTab] = useState<"overview" | "billing" | "team">(
    resolvedDefault
  );
  const [notice, setNotice] = useState<string | null>(null);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"Admin" | "Developer" | "Viewer">("Developer");

  useEffect(() => {
    const unsubscribe = SaasService.subscribe((newState) => {
      setState(newState);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const handlePlanUpgrade = (planId: string) => {
    SaasService.changePlan(planId, state.billingCycle);
    const planName = SAAS_PLANS.find((p) => p.id === planId)?.name;
    showToast("✓ Plan " + planName + " activé immédiatement ! Proration et facture générées.");
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    SaasService.inviteMember(inviteName.trim(), inviteEmail.trim(), inviteRole);
    setInviteName("");
    setInviteEmail("");
    setShowInviteModal(false);
    showToast("✓ Invitation envoyée avec succès à " + inviteEmail + " !");
  };

  const handleRemoveMember = (id: string, name: string) => {
    SaasService.removeMember(id);
    showToast("Membre " + name + " retiré de l'espace.");
  };

  const currentPlan =
    SAAS_PLANS.find((p) => p.id === state.currentPlanId) || SAAS_PLANS[1];

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "10px 0" }}>
      {notice && (
        <div
          style={{
            padding: "12px 20px",
            borderRadius: 10,
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 700,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 6px 20px rgba(16, 185, 129, 0.35)",
          }}
        >
          <CheckCircle2 size={18} color="#fff" />
          <span>{notice}</span>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 800,
              color: "${primaryColor}",
              background: "rgba(14, 165, 233, 0.15)",
              padding: "2px 8px",
              borderRadius: 4,
              textTransform: "uppercase",
            }}
          >
            SaaS Billing & MRR Engine
          </span>
          <h1
            style={{
              margin: "6px 0 0 0",
              fontSize: "24px",
              fontWeight: 900,
              color: "#f8fafc",
            }}
          >
            ${pack.name}
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            gap: 6,
            background: "rgba(255, 255, 255, 0.03)",
            padding: 4,
            borderRadius: 10,
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <button
            onClick={() => setActiveTab("overview")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: "12.5px",
              fontWeight: activeTab === "overview" ? 700 : 500,
              background:
                activeTab === "overview"
                  ? "linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)"
                  : "transparent",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Vue d'ensemble KPIs
          </button>
          <button
            onClick={() => setActiveTab("billing")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: "12.5px",
              fontWeight: activeTab === "billing" ? 700 : 500,
              background:
                activeTab === "billing"
                  ? "linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)"
                  : "transparent",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <CreditCard size={14} /> Facturation & Plans
          </button>
          <button
            onClick={() => setActiveTab("team")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: "12.5px",
              fontWeight: activeTab === "team" ? 700 : 500,
              background:
                activeTab === "team"
                  ? "linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)"
                  : "transparent",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Users size={14} /> Équipe ({state.team.length})
          </button>
        </div>
      </div>

      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            <div
              style={{
                background: "rgba(15, 23, 42, 0.75)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 14,
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Revenu Récurrent Mensuel (MRR)</span>
                <TrendingUp size={16} color="#10b981" />
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 900,
                  color: "#38bdf8",
                  margin: "8px 0 4px",
                }}
              >
                {state.mrr.toFixed(2)} €
              </div>
              <div style={{ fontSize: "11px", color: "#34d399" }}>
                +14.2% vs mois précédent
              </div>
            </div>

            <div
              style={{
                background: "rgba(15, 23, 42, 0.75)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 14,
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Revenu Récurrent Annuel (ARR)</span>
                <Activity size={16} color="#6366f1" />
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 900,
                  color: "#a78bfa",
                  margin: "8px 0 4px",
                }}
              >
                {state.arr.toFixed(2)} €
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                Projection sur 12 mois
              </div>
            </div>

            <div
              style={{
                background: "rgba(15, 23, 42, 0.75)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 14,
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Plan Actif</span>
                <Shield size={16} color="#f59e0b" />
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "#f8fafc",
                  margin: "8px 0 4px",
                }}
              >
                {currentPlan.name}
              </div>
              <div style={{ fontSize: "11px", color: "#cbd5e1" }}>
                Cycle : {state.billingCycle === "monthly" ? "Mensuel" : "Annuel"}
              </div>
            </div>

            <div
              style={{
                background: "rgba(15, 23, 42, 0.75)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 14,
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Utilisation API</span>
                <Zap size={16} color="#10b981" />
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 900,
                  color: "#f8fafc",
                  margin: "8px 0 4px",
                }}
              >
                {((state.usage.apiCalls / state.usage.apiLimit) * 100).toFixed(0)}%
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                {state.usage.apiCalls.toLocaleString()} / {state.usage.apiLimit.toLocaleString()} requêtes
              </div>
            </div>
          </div>

          <div
            style={{
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 14,
              padding: "20px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc" }}>
                ⚡ Simulateur d'Appels API Réactifs
              </div>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                Testez la mise à jour réactive des métriques et le dépassement de quota.
              </div>
            </div>
            <button
              onClick={() => {
                SaasService.incrementApiUsage(2500);
                showToast("✓ 2 500 requêtes API simulées avec succès !");
              }}
              style={{
                background: "linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)",
                color: "#fff",
                border: "none",
                padding: "10px 18px",
                borderRadius: 8,
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + Simuler 2 500 Requêtes API
            </button>
          </div>
        </div>
      )}

      {activeTab === "billing" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {SAAS_PLANS.map((plan) => {
              const isCurrent = state.currentPlanId === plan.id;
              return (
                <div
                  key={plan.id}
                  style={{
                    background: isCurrent
                      ? "rgba(14, 165, 233, 0.12)"
                      : "rgba(15, 23, 42, 0.75)",
                    border: isCurrent
                      ? "2px solid ${primaryColor}"
                      : "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: 16,
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: isCurrent
                      ? "0 10px 30px rgba(14, 165, 233, 0.25)"
                      : "none",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "18px",
                          fontWeight: 800,
                          color: "#f8fafc",
                          margin: 0,
                        }}
                      >
                        {plan.name}
                      </h3>
                      {plan.recommended && (
                        <span
                          style={{
                            fontSize: "10px",
                            background: "${primaryColor}",
                            color: "#000",
                            padding: "2px 8px",
                            borderRadius: 4,
                            fontWeight: 800,
                          }}
                        >
                          RECOMMANDÉ
                        </span>
                      )}
                    </div>

                    <div style={{ margin: "16px 0" }}>
                      <span
                        style={{
                          fontSize: "32px",
                          fontWeight: 900,
                          color: "#f8fafc",
                        }}
                      >
                        {plan.priceMonthly} €
                      </span>
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                        {" "}
                        / mois
                      </span>
                    </div>

                    <ul
                      style={{
                        paddingLeft: 18,
                        fontSize: "12.5px",
                        color: "#cbd5e1",
                        lineHeight: 1.8,
                        margin: "0 0 20px 0",
                      }}
                    >
                      {plan.features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handlePlanUpgrade(plan.id)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: 8,
                      fontWeight: 800,
                      fontSize: "13px",
                      cursor: "pointer",
                      background: isCurrent
                        ? "rgba(14, 165, 233, 0.2)"
                        : "linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)",
                      color: isCurrent ? "#38bdf8" : "#fff",
                      border: isCurrent ? "1px solid ${primaryColor}" : "none",
                    }}
                  >
                    {isCurrent ? "✓ Plan Actuellement Actif" : "Passer au plan " + plan.name}
                  </button>
                </div>
              );
            })}
          </div>

          <div
            style={{
              background: "rgba(15, 23, 42, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 14,
              padding: "24px",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 800,
                color: "#f8fafc",
                margin: "0 0 16px 0",
              }}
            >
              Historique des Factures Générées
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {state.invoices.map((inv) => (
                <div
                  key={inv.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    background: "rgba(255, 255, 255, 0.02)",
                    borderRadius: 8,
                    border: "1px solid rgba(255, 255, 255, 0.04)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        padding: "8px",
                        background: "rgba(14, 165, 233, 0.1)",
                        borderRadius: 6,
                        color: "#38bdf8",
                      }}
                    >
                      <CreditCard size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#f8fafc" }}>
                        {inv.number} — Plan {inv.planName}
                      </div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>{inv.date}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: "14px", fontWeight: 800, color: "#f8fafc" }}>
                      {inv.amount.toFixed(2)} €
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 4,
                        background: "rgba(16, 185, 129, 0.15)",
                        color: "#34d399",
                      }}
                    >
                      PAYÉE
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "team" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              background: "rgba(15, 23, 42, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 14,
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#f8fafc", margin: 0 }}>
                  Collaborateurs de l'Espace ({state.team.length} / {currentPlan.maxUsers})
                </h3>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: "4px 0 0" }}>
                  Gérez les permissions et invitez de nouveaux membres.
                </p>
              </div>

              <button
                onClick={() => setShowInviteModal(true)}
                style={{
                  background: "linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)",
                  color: "#fff",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: 8,
                  fontSize: "12.5px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Plus size={15} /> Inviter un Membre
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {state.team.map((member) => (
                <div
                  key={member.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 18px",
                    background: "rgba(255, 255, 255, 0.02)",
                    borderRadius: 10,
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: "12px",
                        color: "#fff",
                      }}
                    >
                      {member.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#f8fafc" }}>
                        {member.name}
                      </div>
                      <div style={{ fontSize: "11.5px", color: "#94a3b8" }}>{member.email}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: 6,
                        background:
                          member.role === "Owner"
                            ? "rgba(14, 165, 233, 0.2)"
                            : "rgba(255, 255, 255, 0.06)",
                        color: member.role === "Owner" ? "#38bdf8" : "#cbd5e1",
                      }}
                    >
                      {member.role}
                    </span>

                    {member.role !== "Owner" && (
                      <button
                        onClick={() => handleRemoveMember(member.id, member.name)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#ef4444",
                          cursor: "pointer",
                          padding: 4,
                        }}
                        title="Retirer le collaborateur"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showInviteModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 16,
              padding: 24,
              maxWidth: 440,
              width: "90%",
            }}
          >
            <h3 style={{ fontSize: "18px", color: "#f8fafc", margin: "0 0 6px" }}>
              Inviter un Collaborateur
            </h3>
            <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: 20 }}>
              Ajoutez un membre à votre équipe et attribuez-lui un rôle.
            </p>

            <form onSubmit={handleInviteSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input
                type="text"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Nom complet (ex: Claire Martin)"
                required
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Email professionnel"
                required
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: "#0b0f19",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  fontSize: "13px",
                  outline: "none",
                }}
              >
                <option value="Admin">Admin (Tous droits)</option>
                <option value="Developer">Developer (Lecture/Écriture)</option>
                <option value="Viewer">Viewer (Lecture seule)</option>
              </select>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.06)",
                    color: "#cbd5e1",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 18px",
                    borderRadius: 8,
                    background: "${primaryColor}",
                    color: "#000",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Envoyer l'invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
`, "utf-8");
  count++;

  // 4. src/App.tsx — SaaS complet 100% Métier & Animations
  await fs.writeFile(path.join(projDir, "src", "App.tsx"), `import React, { useState } from "react";
import { SaasDashboard } from "./features/SaasDashboard";
import { AnimatedGradient } from "./animation/AnimatedGradient";
import { AnimatedLogo } from "./animation/AnimatedLogo";
import { ParticleField } from "./animation/ParticleField";
import { AnimatedContainer } from "./animation/AnimatedContainer";
import { AnimatedCube } from "./components/3d/AnimatedCube";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Settings,
  Sparkles,
  Activity,
} from "lucide-react";

type Tab = "dashboard" | "billing" | "team" | "settings";

export function App() {
  const [currentTab, setCurrentTab] = useState<Tab>("dashboard");

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard KPIs", icon: <LayoutDashboard size={14} /> },
    { id: "billing", label: "Facturation & Plans", icon: <CreditCard size={14} /> },
    { id: "team", label: "Équipe & Rôles", icon: <Users size={14} /> },
    { id: "settings", label: "Paramètres Espace", icon: <Settings size={14} /> },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070b14",
        color: "#f8fafc",
        fontFamily:
          "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <AnimatedGradient intensity={0.65} />
      <ParticleField />

      <header
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(11, 15, 25, 0.85)",
          backdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "10px 24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <AnimatedLogo label="${pack.name}" />
            <span
              style={{
                fontSize: "11px",
                background:
                  "linear-gradient(135deg, rgba(14, 165, 233, 0.25) 0%, rgba(99, 102, 241, 0.25) 100%)",
                border: "1px solid rgba(14, 165, 233, 0.4)",
                color: "#38bdf8",
                padding: "3px 10px",
                borderRadius: 14,
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Sparkles size={11} color="${primaryColor}" /> SaaS Souverain Actif
            </span>
          </div>

          <nav
            style={{
              display: "flex",
              gap: 6,
              background: "rgba(255, 255, 255, 0.03)",
              padding: 4,
              borderRadius: 12,
              border: "1px solid rgba(255, 255, 255, 0.08)",
              overflowX: "auto",
            }}
          >
            {TABS.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "8px 15px",
                    borderRadius: 9,
                    fontSize: "12.5px",
                    fontWeight: isActive ? 700 : 500,
                    cursor: "pointer",
                    background: isActive
                      ? "linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)"
                      : "transparent",
                    color: isActive ? "#ffffff" : "#94a3b8",
                    border: "none",
                    boxShadow: isActive
                      ? "0 4px 15px rgba(14, 165, 233, 0.4)"
                      : "none",
                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#94a3b8";
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.03)",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              title="Moteur SaaS 3D ForgeAI actif"
            >
              <AnimatedCube size={28} />
            </div>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: "11px",
                color: "#34d399",
                background: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                padding: "5px 12px",
                borderRadius: 20,
              }}
            >
              <Activity size={12} />
              <span>Production Prête</span>
            </span>
          </div>
        </div>
      </header>

      <main
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "24px 20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <AnimatedContainer key={currentTab} animation="fade-in" delay={40}>
          {(currentTab === "dashboard" ||
            currentTab === "billing" ||
            currentTab === "team") && (
            <SaasDashboard defaultTab={currentTab as any} />
          )}

          {currentTab === "settings" && (
            <div
              style={{
                padding: "32px",
                background: "rgba(15, 23, 42, 0.75)",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h2 style={{ color: "#f8fafc", margin: "0 0 10px" }}>
                Paramètres de l'Espace Workspace
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.6 }}>
                Configuration des clés d'API, webhooks Stripe et préférences de sécurité SSO.
              </p>
            </div>
          )}
        </AnimatedContainer>
      </main>
    </div>
  );
}

export default App;`, "utf-8");
  count++;

  return count;
}

async function generateAiAgentApp(projDir, projectName, pack) {
  let count = 0;
  const primaryColor = pack.designTokens?.primary || "#D946EF";
  const accentColor = pack.designTokens?.accent || "#8B5CF6";

  // Types
  await fs.writeFile(path.join(projDir, "src", "types", "index.ts"), `export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  tokensUsed?: number;
  audioUrl?: string;
}

export interface ConversationSession {
  id: string;
  title: string;
  model: string;
  messages: ChatMessage[];
  createdAt: string;
}

export interface VoiceSettings {
  voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
  speed: number;
  pitch: number;
  autoPlay: boolean;
}
`, "utf-8");
  count++;

  // Feature AI Studio
  await fs.writeFile(path.join(projDir, "src", "features", "AiStudio.tsx"), `import React, { useState } from "react";
import { ChatMessage, VoiceSettings } from "../types";
import { Mic, MicOff, Send, Sparkles, Volume2, Bot, Play, Settings2 } from "lucide-react";

export const AiStudio: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", role: "assistant", content: "Bonjour ! Je suis votre agent vocal intelligent. Comment puis-je vous assister aujourd'hui ?", timestamp: "10:00" }
  ]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: input, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Réponse simulée
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: \`Réponse analysée pour : "\${userMsg.content}". Traitement vocal haute fidélité effectué.\`,
        timestamp: new Date().toLocaleTimeString(),
        tokensUsed: 42
      };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px 20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <span style={{ fontSize: "10px", fontWeight: 800, color: "${primaryColor}", background: "rgba(217, 70, 239, 0.15)", padding: "2px 8px", borderRadius: 4 }}>
            ASSISTANT VOCAL & IA
          </span>
          <h1 style={{ margin: "4px 0 0 0", fontSize: "22px", color: "#f8fafc" }}>${pack.name}</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setIsRecording(!isRecording)}
            style={{ padding: "8px 16px", borderRadius: 20, background: isRecording ? "#ef4444" : "${primaryColor}", color: "#fff", border: "none", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontWeight: 600 }}
          >
            {isRecording ? <MicOff size={15} /> : <Mic size={15} />}
            <span>{isRecording ? "Écoute en cours..." : "Parler à l'Agent"}</span>
          </button>
        </div>
      </header>

      {/* Visualiseur d'ondes audio */}
      <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px", marginBottom: 20, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4, height: 40 }}>
          {[12, 28, 45, 18, 55, 75, 40, 60, 25, 15, 40, 80, 50, 30, 65, 20].map((h, i) => (
            <span
              key={i}
              style={{
                width: 4,
                height: isRecording || isSpeaking ? \`\${h}%\` : "15%",
                background: "${primaryColor}",
                borderRadius: 2,
                transition: "height 0.15s ease"
              }}
            />
          ))}
        </div>
        <small style={{ color: "#94a3b8", fontSize: "11px" }}>
          {isRecording ? "Capture audio active via WebRTC / AudioContext" : "Mode veille — cliquez sur 'Parler à l'Agent' ou écrivez un message"}
        </small>
      </div>

      {/* Chat Messages */}
      <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 18, height: "400px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map(m => (
          <div key={m.id} style={{ display: "flex", gap: 10, alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
            {m.role === "assistant" && <div style={{ width: 28, height: 28, borderRadius: "50%", background: "${primaryColor}", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}><Bot size={15} /></div>}
            <div style={{ background: m.role === "user" ? "${primaryColor}" : "rgba(255,255,255,0.06)", padding: "10px 14px", borderRadius: 10, fontSize: "13px", color: "#f8fafc" }}>
              <div>{m.content}</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", marginTop: 4, textAlign: "right" }}>{m.timestamp}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Envoyer une consigne ou poser une question..."
          style={{ flex: 1, padding: "12px 16px", borderRadius: 8, background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "13px" }}
        />
        <button onClick={handleSend} style={{ background: "${primaryColor}", color: "#fff", border: "none", padding: "0 20px", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};`, "utf-8");
  count++;

  // PromptEngineeringView.tsx
  await fs.writeFile(path.join(projDir, "src", "features", "PromptEngineeringView.tsx"), `import React, { useState } from "react";
import { Sliders, Cpu, Save, RefreshCw, Key, Sparkles } from "lucide-react";

export const PromptEngineeringView: React.FC = () => {
  const [model, setModel] = useState("gpt-4o");
  const [systemPrompt, setSystemPrompt] = useState("Tu es un agent conversationnel d'assistance client expert, chaleureux, concis et rigoureux.");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "10px 0" }}>
      <div style={{ background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "28px 32px" }}>
        <h2 style={{ fontSize: "20px", color: "#f8fafc", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 10 }}>
          <Sliders size={20} color="#d946ef" /> Configuration du Moteur LLM & Prompts
        </h2>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: 24 }}>Ajustez les hyperparamètres du modèle de langage et le prompt système de l'agent.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#cbd5e1", marginBottom: 6 }}>Modèle LLM</label>
            <select value={model} onChange={e => setModel(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "#0b0f19", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: "13px", outline: "none" }}>
              <option value="gpt-4o">OpenAI GPT-4o (Multimodal & Rapide)</option>
              <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet (Raisonnement)</option>
              <option value="gemini-1-5-pro">Google Gemini 1.5 Pro (Grand Contexte)</option>
              <option value="llama-3-70b">Meta Llama 3 70B (Open-Source)</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#cbd5e1", marginBottom: 6 }}>Prompt Système Fondateur</label>
            <textarea rows={5} value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: "13px", outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#cbd5e1", marginBottom: 6 }}>
                <span>Température : <b>{temperature}</b></span>
                <span style={{ color: "#94a3b8" }}>{temperature < 0.4 ? "Précis" : "Créatif"}</span>
              </div>
              <input type="range" min="0" max="1" step="0.05" value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))} style={{ width: "100%" }} />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#cbd5e1", marginBottom: 6 }}>
                <span>Max Tokens : <b>{maxTokens}</b></span>
              </div>
              <input type="range" min="256" max="4096" step="128" value={maxTokens} onChange={e => setMaxTokens(parseInt(e.target.value))} style={{ width: "100%" }} />
            </div>
          </div>

          <button onClick={handleSave} style={{ alignSelf: "flex-start", background: saved ? "#10b981" : "#d946ef", color: "#fff", border: "none", padding: "10px 22px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: "13px", display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <Save size={15} /> {saved ? "Configuration Enregistrée !" : "Enregistrer la Configuration"}
          </button>
        </div>
      </div>
    </div>
  );
};
`, "utf-8");
  count++;

  // App.tsx
  await fs.writeFile(path.join(projDir, "src", "App.tsx"), `import React, { useState } from "react";
import { AiStudio } from "./features/AiStudio";
import { PromptEngineeringView } from "./features/PromptEngineeringView";
import { GemsStudio } from "./features/GemsStudio";
import { Bot, Sliders, Sparkles, Activity } from "lucide-react";

export function App() {
  const [currentTab, setCurrentTab] = useState<"agent" | "prompts">("agent");

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f19", color: "#f8fafc", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <header style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", background: "rgba(11, 15, 25, 0.95)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50, padding: "12px 24px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ background: "linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)", borderRadius: 10, padding: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bot size={20} color="#fff" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "16px", fontWeight: 800, color: "#f8fafc" }}>${pack.name}</span>
                <span style={{ fontSize: "10px", background: "rgba(217, 70, 239, 0.2)", color: "#f472b6", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>Studio Agent IA</span>
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>Agent Conversationnel & Synthèse Vocale Temps Réel</div>
            </div>
          </div>

          <nav style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", overflowX: "auto" }}>
            <button onClick={() => setCurrentTab("agent")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, fontSize: "12px", fontWeight: currentTab === "agent" ? 700 : 500, cursor: "pointer", background: currentTab === "agent" ? "#d946ef" : "transparent", color: currentTab === "agent" ? "#fff" : "#94a3b8", border: "none" }}><Bot size={14} /> Studio Agent IA</button>
            <button onClick={() => setCurrentTab("prompts")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, fontSize: "12px", fontWeight: currentTab === "prompts" ? 700 : 500, cursor: "pointer", background: currentTab === "prompts" ? "#d946ef" : "transparent", color: currentTab === "prompts" ? "#fff" : "#94a3b8", border: "none" }}><Sliders size={14} /> Modèles & Prompts</button>
          </nav>

          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "11px", color: "#34d399", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)", padding: "4px 10px", borderRadius: 20 }}><Activity size={12} /> Modèle Connecté</span>
        </div>
      </header>

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px 20px" }}>
        {currentTab === "agent" && <AiStudio />}
        {currentTab === "prompts" && <PromptEngineeringView />}
      </main>
    </div>
  );
}

export default App;`, "utf-8");
  count++;

  return count;
}

/* ══════════════════════════════════════════════════════════════════════════
   4. GÉNÉRATEUR CRM / ERP / VENTES
   ══════════════════════════════════════════════════════════════════════════ */
async function generateCrmApp(projDir, projectName, pack) {
  let count = 0;
  const primaryColor = pack.designTokens?.primary || "#0EA5E9";

  await fs.writeFile(path.join(projDir, "src", "types", "index.ts"), `export interface Lead {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: "discovery" | "demo" | "proposal" | "won" | "lost";
  priority: "high" | "medium" | "low";
  contactEmail: string;
}
`, "utf-8");
  count++;

  await fs.writeFile(path.join(projDir, "src", "features", "CrmKanban.tsx"), `import React, { useState } from "react";
import { Lead } from "../types";
import { Plus, Briefcase, DollarSign, Filter } from "lucide-react";

export const CrmKanban: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([
    { id: "1", name: "Modernisation Infrastructure Cloud", company: "AeroTech", value: 45000, stage: "proposal", priority: "high", contactEmail: "cto@aerotech.com" },
    { id: "2", name: "Déploiement Plateforme Data", company: "FinBank", value: 85000, stage: "demo", priority: "high", contactEmail: "data@finbank.fr" },
    { id: "3", name: "Licences SaaS Pro x50", company: "BioHealth", value: 12500, stage: "won", priority: "medium", contactEmail: "procure@biohealth.com" },
    { id: "4", name: "Audit de Cybersécurité & SSO", company: "NexGen Retail", value: 24000, stage: "discovery", priority: "low", contactEmail: "it@nexgen.io" },
  ]);

  const stages = [
    { key: "discovery", label: "Prospection & Découverte" },
    { key: "demo", label: "Démonstration" },
    { key: "proposal", label: "Offre & Négociation" },
    { key: "won", label: "Gagné / Signé" },
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <span style={{ fontSize: "10px", fontWeight: 800, color: "${primaryColor}", background: "rgba(14, 165, 233, 0.15)", padding: "2px 8px", borderRadius: 4 }}>
            PIPELINE COMMERCIAL & CRM
          </span>
          <h1 style={{ margin: "4px 0 0 0", fontSize: "22px", color: "#f8fafc" }}>${pack.name}</h1>
        </div>
        <button
          onClick={() => {
            const name = prompt("Nom de l'opportunité :");
            if (name) setLeads(prev => [...prev, { id: Date.now().toString(), name, company: "Nouvelle Entreprise", value: 10000, stage: "discovery", priority: "medium", contactEmail: "contact@prospect.com" }]);
          }}
          style={{ background: "${primaryColor}", color: "#fff", border: "none", padding: "9px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}
        >
          <Plus size={15} /> Nouvelle Affaire
        </button>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
        {stages.map(s => {
          const colLeads = leads.filter(l => l.stage === s.key);
          const colTotal = colLeads.reduce((acc, l) => acc + l.value, 0);
          return (
            <div key={s.key} style={{ background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <b style={{ fontSize: "13px", color: "#f8fafc" }}>{s.label} ({colLeads.length})</b>
                <span style={{ fontSize: "11px", color: "#38bdf8", fontWeight: 700 }}>{colTotal.toLocaleString()} €</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {colLeads.map(lead => (
                  <div key={lead.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#f8fafc" }}>{lead.name}</div>
                    <div style={{ fontSize: "11px", color: "#94a3b8", margin: "4px 0" }}>{lead.company}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                      <span style={{ fontSize: "12px", fontWeight: 800, color: "#34d399" }}>{lead.value.toLocaleString()} €</span>
                      <span style={{ fontSize: "9px", textTransform: "uppercase", padding: "2px 6px", borderRadius: 4, background: lead.priority === "high" ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.1)", color: lead.priority === "high" ? "#f87171" : "#cbd5e1" }}>
                        {lead.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};`, "utf-8");
  count++;

  await fs.writeFile(path.join(projDir, "src", "App.tsx"), `import React, { useState } from "react";
import { CrmKanban } from "./features/CrmKanban";
import { InvoicesErp } from "./features/InvoicesErp";
import { ClientsDirectory } from "./features/ClientsDirectory";
import { AnalyticsDashboard } from "./features/AnalyticsDashboard";
import { GemsStudio } from "./features/GemsStudio";
import { GemsExplorer } from "./features/GemsExplorer";
import { ProvenanceAuditView } from "./features/ProvenanceAuditView";
import { Briefcase, Receipt, Users, TrendingUp, Sparkles, ShieldCheck, Activity, Code2 } from "lucide-react";

export function App() {
  const [currentTab, setCurrentTab] = useState<"crm" | "invoices" | "clients" | "analytics">("crm");

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f19", color: "#f8fafc", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <header
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(11, 15, 25, 0.95)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "12px 24px",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)", borderRadius: 10, padding: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Briefcase size={20} color="#fff" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "16px", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.02em" }}>
                  ${pack.name}
                </span>
                <span style={{ fontSize: "10px", background: "rgba(79, 70, 229, 0.2)", color: "#a5b4fc", padding: "2px 8px", borderRadius: 12, fontWeight: 700, border: "1px solid rgba(79, 70, 229, 0.3)" }}>
                  Suite Complète
                </span>
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                Pipeline Commercial, ERP, Devis & Factures
              </div>
            </div>
          </div>

          <nav style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", overflowX: "auto" }}>
            <button
              onClick={() => setCurrentTab("crm")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: "12px",
                fontWeight: currentTab === "crm" ? 700 : 500,
                cursor: "pointer",
                background: currentTab === "crm" ? "#4f46e5" : "transparent",
                color: currentTab === "crm" ? "#fff" : "#94a3b8",
                border: "none",
                whiteSpace: "nowrap",
              }}
            >
              <Briefcase size={14} /> Pipeline CRM
            </button>

            <button
              onClick={() => setCurrentTab("invoices")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: "12px",
                fontWeight: currentTab === "invoices" ? 700 : 500,
                cursor: "pointer",
                background: currentTab === "invoices" ? "#4f46e5" : "transparent",
                color: currentTab === "invoices" ? "#fff" : "#94a3b8",
                border: "none",
                whiteSpace: "nowrap",
              }}
            >
              <Receipt size={14} /> Facturation & Devis
            </button>

            <button
              onClick={() => setCurrentTab("clients")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: "12px",
                fontWeight: currentTab === "clients" ? 700 : 500,
                cursor: "pointer",
                background: currentTab === "clients" ? "#4f46e5" : "transparent",
                color: currentTab === "clients" ? "#fff" : "#94a3b8",
                border: "none",
                whiteSpace: "nowrap",
              }}
            >
              <Users size={14} /> Clients & Comptes
            </button>

            <button
              onClick={() => setCurrentTab("analytics")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: "12px",
                fontWeight: currentTab === "analytics" ? 700 : 500,
                cursor: "pointer",
                background: currentTab === "analytics" ? "#4f46e5" : "transparent",
                color: currentTab === "analytics" ? "#fff" : "#94a3b8",
                border: "none",
                whiteSpace: "nowrap",
              }}
            >
              <TrendingUp size={14} /> Analytique
            </button>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "11px", color: "#34d399", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)", padding: "4px 10px", borderRadius: 20 }}>
              <Activity size={12} /> Prêt Production
            </span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px 20px" }}>
        {currentTab === "crm"       && <CrmKanban />}
        {currentTab === "invoices"  && <InvoicesErp />}
        {currentTab === "clients"   && <ClientsDirectory />}
        {currentTab === "analytics" && <AnalyticsDashboard />}
      </main>
    </div>
  );
}

export default App;`, "utf-8");
  count++;

  return count;
}

/* ══════════════════════════════════════════════════════════════════════════
   5. GÉNÉRATEUR JEUX / ARCADE
   ══════════════════════════════════════════════════════════════════════════ */
async function generateGameApp(projDir, projectName, pack) {
  let count = 0;
  const primaryColor = pack.designTokens?.primary || "#F59E0B";

  await fs.writeFile(path.join(projDir, "src", "features", "GameHub.tsx"), `import React, { useState, useEffect } from "react";
import { Play, RotateCcw, Trophy, Sparkles } from "lucide-react";

export const GameHub: React.FC = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(1240);
  const [gameActive, setGameActive] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleAction = () => {
    if (!gameActive) setGameActive(true);
    const newScore = score + 10;
    setScore(newScore);
    setClickCount(c => c + 1);
    if (newScore > highScore) setHighScore(newScore);
  };

  const handleReset = () => {
    setScore(0);
    setClickCount(0);
    setGameActive(false);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "30px 20px", textAlign: "center" }}>
      <h1 style={{ fontSize: "28px", color: "${primaryColor}", marginBottom: 8 }}>🎮 ${pack.name}</h1>
      <p style={{ color: "#94a3b8", fontSize: "14px" }}>${pack.description?.slice(0, 100)}</p>

      <div style={{ display: "flex", justifyContent: "center", gap: 30, margin: "30px 0" }}>
        <div style={{ background: "rgba(15,23,42,0.8)", padding: "16px 30px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: "12px", color: "#94a3b8" }}>SCORE ACTUEL</div>
          <div style={{ fontSize: "32px", fontWeight: 900, color: "#f8fafc" }}>{score}</div>
        </div>
        <div style={{ background: "rgba(15,23,42,0.8)", padding: "16px 30px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: "12px", color: "#94a3b8" }}>RECORD PERSONNEL</div>
          <div style={{ fontSize: "32px", fontWeight: 900, color: "${primaryColor}" }}>{highScore}</div>
        </div>
      </div>

      <div style={{ padding: "50px 20px", background: "rgba(15,23,42,0.6)", borderRadius: 16, border: "2px dashed rgba(255,255,255,0.15)", marginBottom: 20 }}>
        <button
          onClick={handleAction}
          style={{ padding: "20px 40px", fontSize: "18px", fontWeight: 900, background: "${primaryColor}", color: "#000", border: "none", borderRadius: 12, cursor: "pointer", boxShadow: "0 4px 20px rgba(245, 158, 11, 0.4)" }}
        >
          {gameActive ? "TAP / ACTION !" : "LANCER LA PARTIE"}
        </button>
      </div>

      <button onClick={handleReset} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#cbd5e1", padding: "8px 16px", borderRadius: 8, cursor: "pointer" }}>
        <RotateCcw size={13} style={{ display: "inline", marginRight: 6 }} /> Réinitialiser
      </button>
    </div>
  );
};`, "utf-8");
  count++;

  await fs.writeFile(path.join(projDir, "src", "App.tsx"), `import React, { useState } from "react";
import { GameHub } from "./features/GameHub";
import { Gamepad2, Sparkles, ShieldCheck, Activity } from "lucide-react";

export function App() {
  const [currentTab, setCurrentTab] = useState<"game" | "studio" | "audit">("game");

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f19", color: "#f8fafc", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <header
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(11, 15, 25, 0.95)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "12px 24px",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)", borderRadius: 10, padding: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Gamepad2 size={20} color="#fff" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "16px", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.02em" }}>
                  ${pack.name}
                </span>
                <span style={{ fontSize: "10px", background: "rgba(245, 158, 11, 0.2)", color: "#fbbf24", padding: "2px 8px", borderRadius: 12, fontWeight: 700, border: "1px solid rgba(245, 158, 11, 0.3)" }}>
                  Arcade Game
                </span>
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                ForgeAI Studio · Hub de Jeu, Leaderboard & Contrôles
              </div>
            </div>
          </div>

          <nav style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", overflowX: "auto" }}>
            <button
              onClick={() => setCurrentTab("game")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: "12px",
                fontWeight: currentTab === "game" ? 700 : 500,
                cursor: "pointer",
                background: currentTab === "game" ? "#f59e0b" : "transparent",
                color: currentTab === "game" ? "#000" : "#94a3b8",
                border: "none",
                whiteSpace: "nowrap",
              }}
            >
              <Gamepad2 size={14} /> Hub de Jeu
            </button>

            <button
              onClick={() => setCurrentTab("studio")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: "12px",
                fontWeight: currentTab === "studio" ? 700 : 500,
                cursor: "pointer",
                background: currentTab === "studio" ? "#f59e0b" : "transparent",
                color: currentTab === "studio" ? "#000" : "#94a3b8",
                border: "none",
                whiteSpace: "nowrap",
              }}
            >
              <Sparkles size={14} style={{ color: currentTab === "studio" ? "#000" : "#94a3b8" }} />
              Studio Pépites
            </button>

            <button
              onClick={() => setCurrentTab("audit")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: "12px",
                fontWeight: currentTab === "audit" ? 700 : 500,
                cursor: "pointer",
                background: currentTab === "audit" ? "#f59e0b" : "transparent",
                color: currentTab === "audit" ? "#000" : "#94a3b8",
                border: "none",
                whiteSpace: "nowrap",
              }}
            >
              <ShieldCheck size={14} /> Licences MIT
            </button>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "11px", color: "#34d399", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)", padding: "4px 10px", borderRadius: 20 }}>
              <Activity size={12} /> Actif
            </span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px 20px" }}>
        {currentTab === "game"     && <GameHub />}
        {currentTab === "studio"   && <GemsStudio />}
        {currentTab === "audit"    && <ProvenanceAuditView />}
      </main>
    </div>
  );
}

export default App;`, "utf-8");
  count++;

  return count;
}

/* ══════════════════════════════════════════════════════════════════════════
   6. GÉNÉRATEUR UNIVERSEL PILOTÉ PAR PACK.JSON (Blog, Contenu & Autres Packs)
   ══════════════════════════════════════════════════════════════════════════ */
async function generateUniversalApp(projDir, projectName, pack) {
  let count = 0;
  const primaryColor = pack.designTokens?.primary || "#38BDF8";
  const entity = pack.primaryEntity || "Article";

  // 1. Types
  await fs.writeFile(path.join(projDir, "src", "types", "index.ts"), `export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  status: "published" | "draft" | "archived";
  publishedAt: string;
  readTimeMinutes: number;
  metrics: { views: number; rating: number; commentsCount: number };
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}
`, "utf-8");
  count++;

  // 2. Feature 1: UniversalApp.tsx (Flux des Articles & Recherche)
  await fs.writeFile(path.join(projDir, "src", "features", "UniversalApp.tsx"), `import React, { useState, useMemo } from "react";
import { Article } from "../types";
import { Search, Plus, BookOpen, Clock, Tag, ThumbsUp, MessageSquare, Sparkles } from "lucide-react";

interface UniversalAppProps {
  onSelectArticle?: (article: Article) => void;
  onNewArticle?: () => void;
}

export const MOCK_ARTICLES: Article[] = [
  {
    id: "art-1",
    slug: "architecture-react-moderne",
    title: "Architecture React & Next.js : Le Guide Ultime des Pépites Modulaires",
    excerpt: "Découvrez comment structurer vos applications industrielles avec les 40 composants extraits et assemblés d'office.",
    content: "Dans le développement moderne, la modularité et la séparation des responsabilités sont la clé. En isolant les composants dans src/features et src/components, on garantit une maintenabilité et une évolutivité sans faille...",
    author: "Alexandre Dev",
    category: "Architecture & IA",
    tags: ["React", "TypeScript", "Vite", "Pépites"],
    status: "published",
    publishedAt: "2026-09-21",
    readTimeMinutes: 5,
    metrics: { views: 2450, rating: 4.9, commentsCount: 14 }
  },
  {
    id: "art-2",
    slug: "design-systems-accessibles",
    title: "Construire un Design System Accessible WCAG AA en 2026",
    excerpt: "Les principes fondamentaux pour concevoir des interfaces utilisables par tous avec un contraste et des tokens certifiés.",
    content: "L'accessibilité web n'est pas une option. L'utilisation de tokens CSS harmonisés et de composants accessibles dès la conception garantit une expérience utilisateur fluide et universelle...",
    author: "Sarah Design",
    category: "Design & UX",
    tags: ["Design System", "WCAG", "CSS", "UI"],
    status: "published",
    publishedAt: "2026-09-22",
    readTimeMinutes: 4,
    metrics: { views: 1820, rating: 4.8, commentsCount: 8 }
  },
  {
    id: "art-3",
    slug: "orchestration-micro-agents",
    title: "Orchestration de Micro-Agents IA : Du Prototype au Déploiement",
    excerpt: "Retour d'expérience sur le pilotage autonome et le câblage temps réel des flux de données IA.",
    content: "L'intelligence artificielle générative franchit un cap décisif lorsqu'elle est orchestrée sous forme d'agents spécialisés autonomes travaillant de concert...",
    author: "Équipe ForgeAI",
    category: "IA & Automatisation",
    tags: ["Agents IA", "LLM", "Orchestration"],
    status: "published",
    publishedAt: "2026-09-23",
    readTimeMinutes: 7,
    metrics: { views: 3100, rating: 5.0, commentsCount: 22 }
  }
];

export const UniversalApp: React.FC<UniversalAppProps> = ({ onSelectArticle, onNewArticle }) => {
  const [articles] = useState<Article[]>(MOCK_ARTICLES);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const categories = ["Tous", "Architecture & IA", "Design & UX", "IA & Automatisation"];

  const filtered = useMemo(() => {
    return articles.filter(a => {
      const matchCat = selectedCategory === "Tous" || a.category === selectedCategory;
      const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [articles, search, selectedCategory]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
      {/* En-tête du flux */}
      <div style={{ background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "11px", fontWeight: 700, color: "#38bdf8", background: "rgba(56,189,248,0.15)", padding: "3px 10px", borderRadius: 20 }}>
            <Sparkles size={13} /> ${pack.domain || "Blog & Contenu Éditorial"}
          </div>
          <h1 style={{ margin: "10px 0 6px", fontSize: "24px", color: "#f8fafc" }}>${pack.name}</h1>
          <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>Flux d'articles éditoriaux, commentaires interactifs et 40 pépites connectées.</p>
        </div>
        {onNewArticle && (
          <button onClick={onNewArticle} style={{ background: "${primaryColor}", color: "#000", border: "none", padding: "10px 20px", borderRadius: 10, cursor: "pointer", fontWeight: 800, fontSize: "13px", display: "flex", alignItems: "center", gap: 8 }}>
            <Plus size={16} /> Rédiger un Article
          </button>
        )}
      </div>

      {/* Barre de recherche et catégories */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ padding: "7px 14px", borderRadius: 8, fontSize: "12px", fontWeight: selectedCategory === cat ? 700 : 500, cursor: "pointer", background: selectedCategory === cat ? "${primaryColor}" : "rgba(255,255,255,0.04)", color: selectedCategory === cat ? "#000" : "#cbd5e1", border: "1px solid rgba(255,255,255,0.08)", whiteSpace: "nowrap" }}>
              {cat}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 14px", minWidth: 260 }}>
          <Search size={15} color="#94a3b8" />
          <input placeholder="Rechercher un article..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: "transparent", border: "none", color: "#fff", fontSize: "12px", outline: "none", width: "100%" }} />
        </div>
      </div>

      {/* Grille d'articles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 20 }}>
        {filtered.map(article => (
          <div key={article.id} onClick={() => onSelectArticle && onSelectArticle(article)} style={{ background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 22, display: "flex", flexDirection: "column", justifyContent: "space-between", cursor: "pointer", transition: "transform 0.15s ease", borderTop: "3px solid ${primaryColor}" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "${primaryColor}", background: "rgba(56,189,248,0.1)", padding: "2px 8px", borderRadius: 4 }}>{article.category}</span>
                <span style={{ fontSize: "11px", color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {article.readTimeMinutes} min</span>
              </div>
              <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#f8fafc", margin: "0 0 10px", lineHeight: 1.4 }}>{article.title}</h2>
              <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.6, margin: "0 0 16px" }}>{article.excerpt}</p>
            </div>
            <div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                {article.tags.map(t => (
                  <span key={t} style={{ fontSize: "10px", color: "#94a3b8", background: "rgba(255,255,255,0.04)", padding: "2px 6px", borderRadius: 4 }}><Tag size={10} style={{ display: "inline", marginRight: 4 }} />{t}</span>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
                <span style={{ fontSize: "11px", color: "#cbd5e1" }}>Par <b>{article.author}</b></span>
                <div style={{ display: "flex", gap: 12, fontSize: "11px", color: "#94a3b8" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><ThumbsUp size={12} /> {article.metrics.views}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MessageSquare size={12} /> {article.metrics.commentsCount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};`, "utf-8");
  count++;

  // 3. Feature 2: ArticleReader.tsx (Lecture immersive d'article avec commentaires)
  await fs.writeFile(path.join(projDir, "src", "features", "ArticleReader.tsx"), `import React, { useState } from "react";
import { Article, Comment } from "../types";
import { ArrowLeft, Clock, MessageSquare, ThumbsUp, Bookmark, Share2, Send, Check } from "lucide-react";

interface ArticleReaderProps {
  article: Article;
  onBackToFeed: () => void;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({ article, onBackToFeed }) => {
  const [comments, setComments] = useState<Comment[]>([
    { id: "c1", author: "Marc Leroy", text: "Article très clair et inspirant ! Les pépites modulaires font gagner un temps fou.", createdAt: "Il y a 2h" },
    { id: "c2", author: "Claire Martin", text: "Excellente analyse, j'applique cette architecture dès demain sur mon projet.", createdAt: "Il y a 30m" }
  ]);
  const [newComment, setNewComment] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments(prev => [...prev, { id: Date.now().toString(), author: "Visiteur Connecté", text: newComment.trim(), createdAt: "À l'instant" }]);
    setNewComment("");
  };

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex", flexDirection: "column", gap: 28, padding: "10px 0" }}>
      <button onClick={onBackToFeed} style={{ alignSelf: "flex-start", background: "transparent", border: "none", color: "#38bdf8", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "13px", fontWeight: 700 }}>
        <ArrowLeft size={16} /> Retour au flux des articles
      </button>

      {/* En-tête Article */}
      <header>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", background: "rgba(56,189,248,0.15)", padding: "2px 8px", borderRadius: 4 }}>{article.category}</span>
          <span style={{ fontSize: "11px", color: "#64748b" }}>•</span>
          <span style={{ fontSize: "11px", color: "#94a3b8" }}><Clock size={12} style={{ display: "inline", marginRight: 4 }} />Lecture {article.readTimeMinutes} min</span>
        </div>
        <h1 style={{ fontSize: "30px", fontWeight: 900, color: "#f8fafc", lineHeight: 1.3, margin: "0 0 16px" }}>{article.title}</h1>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 16 }}>
          <div style={{ fontSize: "12px", color: "#cbd5e1" }}>Par <b style={{ color: "#fff" }}>{article.author}</b> · Publié le {article.publishedAt}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setLiked(l => !l)} style={{ background: liked ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)", border: liked ? "1px solid #10b981" : "1px solid rgba(255,255,255,0.1)", color: liked ? "#34d399" : "#cbd5e1", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              <ThumbsUp size={13} /> {article.metrics.views + (liked ? 1 : 0)}
            </button>
            <button onClick={() => setBookmarked(b => !b)} style={{ background: bookmarked ? "rgba(56,189,248,0.2)" : "rgba(255,255,255,0.05)", border: bookmarked ? "1px solid #38bdf8" : "1px solid rgba(255,255,255,0.1)", color: bookmarked ? "#38bdf8" : "#cbd5e1", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              <Bookmark size={13} /> {bookmarked ? "Enregistré" : "Sauvegarder"}
            </button>
          </div>
        </div>
      </header>

      {/* Corps de l'Article */}
      <article style={{ fontSize: "16px", color: "#e2e8f0", lineHeight: 1.8, background: "rgba(15, 23, 42, 0.5)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "32px 36px" }}>
        <p style={{ fontSize: "17px", fontWeight: 600, color: "#38bdf8", marginBottom: 24 }}>{article.excerpt}</p>
        <p style={{ marginBottom: 20 }}>{article.content}</p>
        <p style={{ marginBottom: 20 }}>L'avantage décisif d'un projet assemblé avec le moteur ForgeAI réside dans la standardisation : chaque composant monté depuis les dépôts open-source est immédiatement audité, réutilisable et disponible dans l'onglet des pépites sans aucune configuration manuelle.</p>
        <div style={{ display: "flex", gap: 8, marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {article.tags.map(t => (
            <span key={t} style={{ fontSize: "11px", color: "#38bdf8", background: "rgba(56,189,248,0.1)", padding: "4px 10px", borderRadius: 6 }}>#{t}</span>
          ))}
        </div>
      </article>

      {/* Section Commentaires */}
      <section style={{ background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
        <h3 style={{ fontSize: "17px", color: "#f8fafc", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <MessageSquare size={17} color="#38bdf8" /> Commentaires ({comments.length})
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {comments.map(c => (
            <div key={c.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <b style={{ fontSize: "12px", color: "#f8fafc" }}>{c.author}</b>
                <span style={{ fontSize: "10px", color: "#64748b" }}>{c.createdAt}</span>
              </div>
              <p style={{ fontSize: "13px", color: "#cbd5e1", margin: 0 }}>{c.text}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <input value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddComment()} placeholder="Ajoutez un commentaire..." style={{ flex: 1, padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: "13px", outline: "none" }} />
          <button onClick={handleAddComment} style={{ background: "#38bdf8", color: "#000", border: "none", padding: "0 18px", borderRadius: 8, cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
            <Send size={14} /> Publier
          </button>
        </div>
      </section>
    </div>
  );
};`, "utf-8");
  count++;

  // 4. Feature 3: ArticleEditor.tsx (Rédacteur et Créateur d'Article)
  await fs.writeFile(path.join(projDir, "src", "features", "ArticleEditor.tsx"), `import React, { useState } from "react";
import { Article } from "../types";
import { PenTool, Check, ArrowLeft } from "lucide-react";

interface ArticleEditorProps {
  onArticlePublished?: (article: Article) => void;
  onCancel?: () => void;
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({ onArticlePublished, onCancel }) => {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Architecture & IA");
  const [author, setAuthor] = useState("Auteur Blog");
  const [tagsInput, setTagsInput] = useState("React, Innovation");
  const [published, setPublished] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newArticle: Article = {
      id: "art-" + Date.now(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title,
      excerpt: excerpt || title,
      content,
      author: author || "Auteur Blog",
      category,
      tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
      status: "published",
      publishedAt: new Date().toISOString().slice(0, 10),
      readTimeMinutes: Math.max(1, Math.round(content.split(" ").length / 150)),
      metrics: { views: 1, rating: 5.0, commentsCount: 0 }
    };

    setPublished(true);
    setTimeout(() => {
      if (onArticlePublished) onArticlePublished(newArticle);
    }, 800);
  };

  return (
    <div style={{ maxWidth: "780px", margin: "0 auto", padding: "10px 0" }}>
      {onCancel && (
        <button onClick={onCancel} style={{ background: "transparent", border: "none", color: "#38bdf8", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "13px", fontWeight: 700, marginBottom: 16 }}>
          <ArrowLeft size={16} /> Annuler et retour au flux
        </button>
      )}

      <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "28px 32px" }}>
        <h2 style={{ fontSize: "20px", color: "#f8fafc", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 8 }}>
          <PenTool size={18} color="#38bdf8" /> Rédiger un Nouvel Article
        </h2>
        <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: 24 }}>Publiez du contenu directement dans le flux éditorial de votre application.</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#cbd5e1", marginBottom: 6 }}>Titre de l'article *</label>
            <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Les 5 règles d'or pour concevoir avec les pépites..." style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#cbd5e1", marginBottom: 6 }}>Catégorie</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "#0b0f19", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: "13px", outline: "none", boxSizing: "border-box" }}>
                <option value="Architecture & IA">Architecture & IA</option>
                <option value="Design & UX">Design & UX</option>
                <option value="IA & Automatisation">IA & Automatisation</option>
                <option value="Tutoriels & Guides">Tutoriels & Guides</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#cbd5e1", marginBottom: 6 }}>Auteur</label>
              <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Votre nom ou pseudonyme" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#cbd5e1", marginBottom: 6 }}>Extrait / Résumé introductif</label>
            <input value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Courte synthèse pour la carte du flux..." style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#cbd5e1", marginBottom: 6 }}>Contenu complet *</label>
            <textarea required rows={7} value={content} onChange={e => setContent(e.target.value)} placeholder="Rédigez l'article complet ici..." style={{ width: "100%", padding: "12px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: "13px", outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#cbd5e1", marginBottom: 6 }}>Tags (séparés par virgule)</label>
            <input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="React, Vite, Architecture" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
          </div>

          <button type="submit" disabled={published} style={{ background: published ? "#10b981" : "#38bdf8", color: "#000", border: "none", padding: "12px 24px", borderRadius: 10, cursor: published ? "default" : "pointer", fontWeight: 800, fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8 }}>
            {published ? <><Check size={16} /> Article Publié avec Succès !</> : <><PenTool size={16} /> Publier l'Article</>}
          </button>
        </form>
      </div>
    </div>
  );
};`, "utf-8");
  count++;

  // 5. Main App.tsx (Multi-Pages 100% Câblé avec toutes les features)
  await fs.writeFile(path.join(projDir, "src", "App.tsx"), `import React, { useState } from "react";
import { UniversalApp, MOCK_ARTICLES } from "./features/UniversalApp";
import { ArticleReader } from "./features/ArticleReader";
import { ArticleEditor } from "./features/ArticleEditor";
import { GemsStudio } from "./features/GemsStudio";
import { Article } from "./types";
import { Newspaper, BookOpen, PenTool, Sparkles, Activity } from "lucide-react";

type Tab = "feed" | "reader" | "editor";

export function App() {
  const [currentTab, setCurrentTab] = useState<Tab>("feed");
  const [selectedArticle, setSelectedArticle] = useState<Article>(MOCK_ARTICLES[0]);

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f19", color: "#f8fafc", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <header
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(11, 15, 25, 0.95)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "12px 24px",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ background: "linear-gradient(135deg, #38bdf8 0%, #10b981 100%)", borderRadius: 10, padding: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Newspaper size={20} color="#fff" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "16px", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.02em" }}>
                  ${pack.name}
                </span>
                <span style={{ fontSize: "10px", background: "rgba(56, 189, 248, 0.2)", color: "#38bdf8", padding: "2px 8px", borderRadius: 12, fontWeight: 700, border: "1px solid rgba(56, 189, 248, 0.3)" }}>
                  ${pack.domain || "Blog & Contenu Éditorial"}
                </span>
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                Flux d'articles, lecture détaillée & commentaires interactifs
              </div>
            </div>
          </div>

          <nav style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", overflowX: "auto" }}>
            <button
              onClick={() => setCurrentTab("feed")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: "12px",
                fontWeight: currentTab === "feed" ? 700 : 500,
                cursor: "pointer",
                background: currentTab === "feed" ? "#38bdf8" : "transparent",
                color: currentTab === "feed" ? "#000" : "#94a3b8",
                border: "none",
                whiteSpace: "nowrap",
              }}
            >
              <Newspaper size={14} /> Flux des Articles
            </button>

            <button
              onClick={() => setCurrentTab("reader")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: "12px",
                fontWeight: currentTab === "reader" ? 700 : 500,
                cursor: "pointer",
                background: currentTab === "reader" ? "#38bdf8" : "transparent",
                color: currentTab === "reader" ? "#000" : "#94a3b8",
                border: "none",
                whiteSpace: "nowrap",
              }}
            >
              <BookOpen size={14} /> Fiche Article
            </button>

            <button
              onClick={() => setCurrentTab("editor")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: "12px",
                fontWeight: currentTab === "editor" ? 700 : 500,
                cursor: "pointer",
                background: currentTab === "editor" ? "#38bdf8" : "transparent",
                color: currentTab === "editor" ? "#000" : "#94a3b8",
                border: "none",
                whiteSpace: "nowrap",
              }}
            >
              <PenTool size={14} /> Rédiger un Article
            </button>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "11px", color: "#34d399", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)", padding: "4px 10px", borderRadius: 20 }}>
              <Activity size={12} /> Prêt Publication
            </span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px 20px" }}>
        {currentTab === "feed" && (
          <UniversalApp
            onSelectArticle={(art) => {
              setSelectedArticle(art);
              setCurrentTab("reader");
            }}
            onNewArticle={() => setCurrentTab("editor")}
          />
        )}
        {currentTab === "reader" && (
          <ArticleReader
            article={selectedArticle}
            onBackToFeed={() => setCurrentTab("feed")}
          />
        )}
        {currentTab === "editor" && (
          <ArticleEditor
            onArticlePublished={(art) => {
              setSelectedArticle(art);
              setCurrentTab("reader");
            }}
            onCancel={() => setCurrentTab("feed")}
          />
        )}
      </main>
    </div>
  );
}

export default App;`, "utf-8");
  count++;

  return count;
}

/* ══════════════════════════════════════════════════════════════════════════
   7. GÉNÉRATEUR UI KIT & DESIGN SYSTEM (Composants, Tokens, Playground)
   ══════════════════════════════════════════════════════════════════════════ */
async function generateUiKitApp(projDir, projectName, pack) {
  let count = 0;
  const primaryColor = pack.designTokens?.primary || "#6366F1";

  await fs.writeFile(path.join(projDir, "src", "types", "index.ts"), `export type ComponentCategory = "Forms & Inputs" | "Navigation" | "Feedback & Status" | "Layout & Containers" | "Data Display" | "Overlays";

export interface ComponentProp {
  name: string;
  type: string;
  defaultValue: string;
  required: boolean;
  description: string;
}

export interface UIComponentItem {
  id: string;
  name: string;
  category: ComponentCategory;
  description: string;
  tags: string[];
  accessibilityScore: number;
  props: ComponentProp[];
  variants: string[];
  status: "stable" | "beta" | "new";
  figmaSync: boolean;
}

export interface DesignToken {
  category: "Colors" | "Typography" | "Spacing" | "Radius" | "Shadows";
  name: string;
  value: string;
  description: string;
  cssVariable: string;
}

export interface ProjectMetadata {
  id: string;
  name: string;
  packSlug: string;
  version: string;
  features: string[];
  mountedGemsCount: number;
}
`, "utf-8");
  count++;

  await fs.writeFile(path.join(projDir, "src", "services", "mockComponents.ts"), `import { UIComponentItem, DesignToken } from "../types";

export const MOCK_UI_COMPONENTS: UIComponentItem[] = [
  {
    id: "btn-primary",
    name: "Button",
    category: "Forms & Inputs",
    description: "Bouton d'action interactif avec support des états hover, active, focus, disabled et spinner de chargement.",
    tags: ["Core", "Action", "Form"],
    accessibilityScore: 99,
    status: "stable",
    figmaSync: true,
    variants: ["primary", "secondary", "danger", "ghost", "outline"],
    props: [
      { name: "variant", type: "'primary' | 'secondary' | 'danger' | 'ghost'", defaultValue: "'primary'", required: false, description: "Variante visuelle du bouton" },
      { name: "size", type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", required: false, description: "Taille de padding et police" },
      { name: "isLoading", type: "boolean", defaultValue: "false", required: false, description: "Affiche un spinner et désactive les clics" },
      { name: "disabled", type: "boolean", defaultValue: "false", required: false, description: "Désactive l'interaction utilisateur" }
    ]
  },
  {
    id: "input-field",
    name: "InputField",
    category: "Forms & Inputs",
    description: "Champ de saisie de texte sécurisé avec label flottant, message d'erreur et icône de validation.",
    tags: ["Form", "Text", "Security"],
    accessibilityScore: 98,
    status: "stable",
    figmaSync: true,
    variants: ["default", "filled", "outlined"],
    props: [
      { name: "label", type: "string", defaultValue: "''", required: true, description: "Label accessible au-dessus du champ" },
      { name: "placeholder", type: "string", defaultValue: "''", required: false, description: "Texte indicatif" },
      { name: "error", type: "string | undefined", defaultValue: "undefined", required: false, description: "Message d'erreur affiché en rouge" }
    ]
  },
  {
    id: "modal-dialog",
    name: "ModalDialog",
    category: "Overlays",
    description: "Fenêtre modale accessible avec piège de focus (Focus Trap), fond flouté et fermeture ESC.",
    tags: ["Dialog", "Popup", "Overlay"],
    accessibilityScore: 96,
    status: "stable",
    figmaSync: true,
    variants: ["standard", "fullscreen", "bottom-sheet"],
    props: [
      { name: "isOpen", type: "boolean", defaultValue: "false", required: true, description: "Contrôle la visibilité" },
      { name: "title", type: "string", defaultValue: "''", required: true, description: "Titre principal de la modale" }
    ]
  }
];

export const MOCK_DESIGN_TOKENS: DesignToken[] = [
  { category: "Colors", name: "Primary Brand", value: "${primaryColor}", description: "Couleur principale de marque", cssVariable: "--color-primary" },
  { category: "Colors", name: "Accent Success", value: "#10B981", description: "Validation & succès", cssVariable: "--color-accent" },
  { category: "Colors", name: "Dark Surface", value: "#0F172A", description: "Fond des cartes sombres", cssVariable: "--color-surface" },
  { category: "Typography", name: "Font Heading", value: "'Inter', sans-serif", description: "Typographie principale", cssVariable: "--font-heading" }
];

export const DESIGN_TOKENS = MOCK_DESIGN_TOKENS;
`, "utf-8");
  count++;

  await fs.writeFile(path.join(projDir, "src", "features", "ComponentCatalog.tsx"), `import React, { useState } from "react";
import { MOCK_UI_COMPONENTS } from "../services/mockComponents";
import { ComponentCategory } from "../types";
import { Search, Sparkles, Layers, ShieldCheck } from "lucide-react";

export const ComponentCatalog: React.FC = () => {
  const [category, setCategory] = useState<ComponentCategory | "Tous">("Tous");
  const [search, setSearch] = useState("");

  const filtered = MOCK_UI_COMPONENTS.filter(c => {
    if (category !== "Tous" && c.category !== category) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "20px 24px" }}>
        <h2 style={{ margin: "0 0 6px", fontSize: "18px", color: "#f8fafc" }}>Catalogue des Composants Graphiques</h2>
        <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>Bibliothèque UI avec score d'accessibilité WCAG AA et spécifications TypeScript.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        {filtered.map(comp => (
          <div key={comp.id} style={{ background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <b style={{ fontSize: "16px", color: "#f8fafc" }}>{comp.name}</b>
              <span style={{ fontSize: "10px", color: "#34d399", background: "rgba(16,185,129,0.15)", padding: "2px 8px", borderRadius: 4 }}>WCAG {comp.accessibilityScore}%</span>
            </div>
            <p style={{ fontSize: "12px", color: "#cbd5e1", margin: "0 0 12px" }}>{comp.description}</p>
            <div style={{ fontSize: "11px", color: "#94a3b8" }}>
              <b>Props :</b> {comp.props.map(p => p.name).join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
`, "utf-8");
  await fs.writeFile(path.join(projDir, "src", "features", "TokenExplorer.tsx"), `import React, { useState } from "react";
import { DESIGN_TOKENS } from "../services/mockComponents";
import { Palette, Copy, Check, Sliders } from "lucide-react";

export const TokenExplorer: React.FC = () => {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Colors", "Typography", "Spacing", "Radius", "Shadows"];

  const handleCopy = (variable: string) => {
    navigator.clipboard.writeText(\`var(\${variable})\`);
    setCopiedToken(variable);
    setTimeout(() => setCopiedToken(null), 1800);
  };

  const filteredTokens = DESIGN_TOKENS.filter(
    (t) => selectedCategory === "All" || t.category === selectedCategory
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "20px 24px" }}>
        <h2 style={{ margin: "0 0 6px", fontSize: "18px", color: "#f8fafc" }}>Système de Design Tokens Synchronisé</h2>
        <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>Variables CSS harmonisées prêtes pour l'export Figma et Tailwind.</p>
      </div>

      <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: "12px",
              fontWeight: selectedCategory === cat ? 700 : 500,
              cursor: "pointer",
              background: selectedCategory === cat ? "${primaryColor}" : "rgba(255,255,255,0.05)",
              color: selectedCategory === cat ? "#fff" : "#cbd5e1",
              border: "none",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {filteredTokens.map((token) => (
          <div key={token.name} style={{ background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#f8fafc" }}>{token.name}</div>
              <div style={{ fontSize: "11px", color: "#38bdf8", fontFamily: "monospace", marginTop: 2 }}>{token.cssVariable}</div>
              <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: 2 }}>{token.value}</div>
            </div>
            <button
              onClick={() => handleCopy(token.cssVariable)}
              style={{ background: copiedToken === token.cssVariable ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: copiedToken === token.cssVariable ? "#34d399" : "#cbd5e1", padding: "6px 10px", borderRadius: 6, cursor: "pointer", fontSize: "11px" }}
            >
              {copiedToken === token.cssVariable ? <Check size={13} /> : <Copy size={13} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
`, "utf-8");
  count++;

  await fs.writeFile(path.join(projDir, "src", "App.tsx"), `import React, { useState } from "react";
import { ComponentCatalog } from "./features/ComponentCatalog";
import { TokenExplorer } from "./features/TokenExplorer";
import { GemsStudio } from "./features/GemsStudio";
import { Palette, Layers, Sliders, Sparkles, Activity } from "lucide-react";

export function App() {
  const [currentTab, setCurrentTab] = useState<"catalog" | "tokens">("catalog");

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f19", color: "#f8fafc", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <header style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", background: "rgba(11, 15, 25, 0.95)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50, padding: "12px 24px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ background: "linear-gradient(135deg, ${primaryColor} 0%, #0ea5e9 100%)", borderRadius: 10, padding: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Palette size={20} color="#fff" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "16px", fontWeight: 800, color: "#f8fafc" }}>${pack.name}</span>
                <span style={{ fontSize: "10px", background: "rgba(99, 102, 241, 0.2)", color: "#818cf8", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>Design System</span>
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>Bibliothèque UI, Spécifications Accessibilité WCAG & Tokens</div>
            </div>
          </div>

          <nav style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", overflowX: "auto" }}>
            <button onClick={() => setCurrentTab("catalog")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, fontSize: "12px", fontWeight: currentTab === "catalog" ? 700 : 500, cursor: "pointer", background: currentTab === "catalog" ? "${primaryColor}" : "transparent", color: currentTab === "catalog" ? "#fff" : "#94a3b8", border: "none" }}><Layers size={14} /> Catalogue UI</button>
            <button onClick={() => setCurrentTab("tokens")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, fontSize: "12px", fontWeight: currentTab === "tokens" ? 700 : 500, cursor: "pointer", background: currentTab === "tokens" ? "${primaryColor}" : "transparent", color: currentTab === "tokens" ? "#fff" : "#94a3b8", border: "none" }}><Sliders size={14} /> Design Tokens</button>
          </nav>

          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "11px", color: "#34d399", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)", padding: "4px 10px", borderRadius: 20 }}><Activity size={12} /> Actif</span>
        </div>
      </header>

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px 20px" }}>
        {currentTab === "catalog" && <ComponentCatalog />}
        {currentTab === "tokens" && <TokenExplorer />}
      </main>
    </div>
  );
}

export default App;
`, "utf-8");
  count++;

  return count;
}

/* ══════════════════════════════════════════════════════════════════════════
   8. GÉNÉRATEUR CHAT & MESSAGERIE TEMPS RÉEL (Channels, DMs, Bubbles)
   ══════════════════════════════════════════════════════════════════════════ */
async function generateChatApp(projDir, projectName, pack) {
  let count = 0;
  const primaryColor = pack.designTokens?.primary || "#3B82F6";

  // 1. Types complets
  await fs.writeFile(path.join(projDir, "src", "types", "index.ts"), `export interface Message {
  id: string;
  conversationId: string;
  authorName: string;
  authorAvatar: string;
  isMe: boolean;
  content: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  attachments?: { name: string; size: string; type: string }[];
}

export interface Conversation {
  id: string;
  name: string;
  type: "channel" | "dm";
  avatar?: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  online?: boolean;
}

export interface ChatFileItem {
  id: string;
  name: string;
  size: string;
  type: "pdf" | "image" | "code" | "video" | "doc";
  sender: string;
  date: string;
}

export interface ChatMemberItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "online" | "away" | "offline";
  email: string;
}
`, "utf-8");
  count++;

  // 2. Service Métier Autonome : chatService.ts
  await fs.writeFile(path.join(projDir, "src", "services", "chatService.ts"), `import { Message, Conversation, ChatFileItem, ChatMemberItem } from "../types";

const INITIAL_CONVERSATIONS: Conversation[] = [
  { id: "c1", name: "général", type: "channel", lastMessage: "Bienvenue sur le chat d'équipe !", lastTime: "12:45", unreadCount: 0 },
  { id: "c2", name: "projets-tech", type: "channel", lastMessage: "Le déploiement de la version v2.4 est validé", lastTime: "14:10", unreadCount: 1 },
  { id: "u1", name: "Alice Martin", type: "dm", avatar: "👩‍💻", lastMessage: "Peux-tu relire le PRD s'il te plaît ?", lastTime: "14:22", unreadCount: 0, online: true },
  { id: "u2", name: "Thomas Roux", type: "dm", avatar: "👨‍💼", lastMessage: "Merci pour les retours !", lastTime: "Hier", unreadCount: 0, online: false },
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  c1: [
    { id: "m1", conversationId: "c1", authorName: "Alice Martin", authorAvatar: "👩‍💻", isMe: false, content: "Bonjour à tous ! Prêts pour le sprint ?", timestamp: "14:15", status: "read" },
    { id: "m2", conversationId: "c1", authorName: "Moi", authorAvatar: "🚀", isMe: true, content: "Oui, le serveur Vite est lancé sur localhost:5173 et tout est câblé !", timestamp: "14:16", status: "read" },
  ],
  c2: [
    { id: "m3", conversationId: "c2", authorName: "Thomas Roux", authorAvatar: "👨‍💼", isMe: false, content: "Les tests d'intégration sont passés au vert.", timestamp: "13:50", status: "read" },
    { id: "m4", conversationId: "c2", authorName: "Thomas Roux", authorAvatar: "👨‍💼", isMe: false, content: "Le déploiement de la version v2.4 est validé", timestamp: "14:10", status: "read" },
  ],
  u1: [
    { id: "m5", conversationId: "u1", authorName: "Alice Martin", authorAvatar: "👩‍💻", isMe: false, content: "Peux-tu relire le PRD s'il te plaît ?", timestamp: "14:22", status: "read" },
  ],
  u2: [
    { id: "m6", conversationId: "u2", authorName: "Thomas Roux", authorAvatar: "👨‍💼", isMe: false, content: "Merci pour les retours !", timestamp: "Hier", status: "read" },
  ]
};

const INITIAL_FILES: ChatFileItem[] = [
  { id: "1", name: "PRD_Architecture_v2.pdf", size: "2.4 Mo", type: "pdf", sender: "Alice Martin", date: "Aujourd'hui à 11:20" },
  { id: "2", name: "mockup_dashboard_dark.png", size: "4.1 Mo", type: "image", sender: "Thomas Roux", date: "Hier à 16:45" },
  { id: "3", name: "specs_api_websocket.ts", size: "18 Ko", type: "code", sender: "Moi", date: "21 Septembre" },
  { id: "4", name: "demo_screencast_v1.mp4", size: "14.8 Mo", type: "video", sender: "Alice Martin", date: "20 Septembre" },
];

const INITIAL_MEMBERS: ChatMemberItem[] = [
  { id: "1", name: "Alice Martin", role: "Product Manager", avatar: "👩‍💻", status: "online", email: "alice@company.com" },
  { id: "2", name: "Thomas Roux", role: "Lead Frontend", avatar: "👨‍💼", status: "away", email: "thomas@company.com" },
  { id: "3", name: "Sarah K.", role: "UI/UX Designer", avatar: "🎨", status: "online", email: "sarah@company.com" },
  { id: "4", name: "Alexandre Dev", role: "Backend Architect", avatar: "⚙️", status: "offline", email: "alex@company.com" },
  { id: "5", name: "Moi", role: "Développeur Fullstack", avatar: "🚀", status: "online", email: "admin@company.com" },
];

export class ChatService {
  private static STORAGE_PREFIX = "forgeai_chat_";

  static getConversations(): Conversation[] {
    const raw = localStorage.getItem(this.STORAGE_PREFIX + "convs");
    if (!raw) {
      localStorage.setItem(this.STORAGE_PREFIX + "convs", JSON.stringify(INITIAL_CONVERSATIONS));
      return INITIAL_CONVERSATIONS;
    }
    return JSON.parse(raw);
  }

  static getMessages(convId: string): Message[] {
    const raw = localStorage.getItem(this.STORAGE_PREFIX + "msgs_" + convId);
    if (!raw) {
      const initial = INITIAL_MESSAGES[convId] || [];
      localStorage.setItem(this.STORAGE_PREFIX + "msgs_" + convId, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  }

  static sendMessage(convId: string, content: string, attachments?: { name: string; size: string; type: string }[]): { newMsg: Message; replyPromise: Promise<Message> } {
    const msgs = this.getMessages(convId);
    const newMsg: Message = {
      id: Date.now().toString(),
      conversationId: convId,
      authorName: "Moi",
      authorAvatar: "🚀",
      isMe: true,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
      attachments,
    };
    msgs.push(newMsg);
    localStorage.setItem(this.STORAGE_PREFIX + "msgs_" + convId, JSON.stringify(msgs));

    const convs = this.getConversations();
    const target = convs.find(c => c.id === convId);
    if (target) {
      target.lastMessage = content;
      target.lastTime = newMsg.timestamp;
      localStorage.setItem(this.STORAGE_PREFIX + "convs", JSON.stringify(convs));
    }

    const replyPromise = new Promise<Message>((resolve) => {
      setTimeout(() => {
        const replyMsgs = this.getMessages(convId);
        const replyMsg: Message = {
          id: (Date.now() + 1).toString(),
          conversationId: convId,
          authorName: target?.type === "channel" ? "Bot Assistant" : target?.name || "Collaborateur",
          authorAvatar: target?.type === "channel" ? "🤖" : target?.avatar || "💬",
          isMe: false,
          content: 'Reçu ! Traitement de : "' + content.slice(0, 40) + '..." en direct.',
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "read",
        };
        replyMsgs.push(replyMsg);
        localStorage.setItem(this.STORAGE_PREFIX + "msgs_" + convId, JSON.stringify(replyMsgs));
        resolve(replyMsg);
      }, 1000);
    });

    return { newMsg, replyPromise };
  }

  static getFiles(): ChatFileItem[] {
    const raw = localStorage.getItem(this.STORAGE_PREFIX + "files");
    if (!raw) {
      localStorage.setItem(this.STORAGE_PREFIX + "files", JSON.stringify(INITIAL_FILES));
      return INITIAL_FILES;
    }
    return JSON.parse(raw);
  }

  static addFile(file: ChatFileItem): void {
    const files = this.getFiles();
    files.unshift(file);
    localStorage.setItem(this.STORAGE_PREFIX + "files", JSON.stringify(files));
  }

  static getMembers(): ChatMemberItem[] {
    const raw = localStorage.getItem(this.STORAGE_PREFIX + "members");
    if (!raw) {
      localStorage.setItem(this.STORAGE_PREFIX + "members", JSON.stringify(INITIAL_MEMBERS));
      return INITIAL_MEMBERS;
    }
    return JSON.parse(raw);
  }

  static addMember(member: ChatMemberItem): void {
    const members = this.getMembers();
    members.push(member);
    localStorage.setItem(this.STORAGE_PREFIX + "members", JSON.stringify(members));
  }
}
`, "utf-8");
  count++;

  // 3. Composant : ConversationSidebar.tsx
  await fs.writeFile(path.join(projDir, "src", "components", "ConversationSidebar.tsx"), `import React from "react";
import { Conversation } from "../types";
import { Hash, Plus } from "lucide-react";

interface Props {
  conversations: Conversation[];
  activeConvId: string;
  onSelect: (conv: Conversation) => void;
  accentColor?: string;
}

export const ConversationSidebar: React.FC<Props> = ({ conversations, activeConvId, onSelect, accentColor = "#3B82F6" }) => {
  const channels = conversations.filter(c => c.type === "channel");
  const directMessages = conversations.filter(c => c.type === "dm");

  return (
    <aside style={{ borderRight: "1px solid rgba(255,255,255,0.08)", background: "rgba(11, 15, 25, 0.7)", padding: "16px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h3 style={{ margin: 0, fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Canaux d'Équipe</h3>
          <span style={{ fontSize: "11px", color: accentColor, cursor: "pointer" }}><Plus size={14} /></span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {channels.map(c => {
            const isActive = activeConvId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => onSelect(c)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: isActive ? accentColor : "transparent",
                  color: isActive ? "#fff" : "#cbd5e1",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
                  <Hash size={15} style={{ opacity: isActive ? 1 : 0.6 }} />
                  <span style={{ fontSize: "13px", fontWeight: isActive ? 700 : 500 }}>{c.name}</span>
                </div>
                {c.unreadCount > 0 && (
                  <span style={{ fontSize: "10px", background: "#ef4444", color: "#fff", padding: "1px 6px", borderRadius: 10, fontWeight: 700 }}>{c.unreadCount}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 style={{ margin: "0 0 8px", fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Messages Privés</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {directMessages.map(c => {
            const isActive = activeConvId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => onSelect(c)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: isActive ? accentColor : "transparent",
                  color: isActive ? "#fff" : "#cbd5e1",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
                  <span>{c.avatar}</span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: isActive ? 700 : 500 }}>{c.name}</div>
                    <div style={{ fontSize: "10px", opacity: 0.7, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.lastMessage}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
`, "utf-8");
  count++;

  // 4. Composant : MessageBubble.tsx
  await fs.writeFile(path.join(projDir, "src", "components", "MessageBubble.tsx"), `import React from "react";
import { Message } from "../types";
import { CheckCheck, FileText, Download } from "lucide-react";

interface Props {
  message: Message;
  accentColor?: string;
}

export const MessageBubble: React.FC<Props> = ({ message, accentColor = "#3B82F6" }) => {
  return (
    <div style={{ display: "flex", justifyContent: message.isMe ? "flex-end" : "flex-start", gap: 8, marginBottom: 12 }}>
      {!message.isMe && <span style={{ fontSize: "20px" }}>{message.authorAvatar}</span>}
      <div style={{ maxWidth: "68%", background: message.isMe ? accentColor : "rgba(255,255,255,0.06)", color: "#fff", padding: "10px 14px", borderRadius: 14, borderTopRightRadius: message.isMe ? 2 : 14, borderTopLeftRadius: !message.isMe ? 2 : 14, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        {!message.isMe && <div style={{ fontSize: "11px", fontWeight: 700, color: "#93c5fd", marginBottom: 2 }}>{message.authorName}</div>}
        <div style={{ fontSize: "13px", lineHeight: 1.5, wordBreak: "break-word" }}>{message.content}</div>

        {message.attachments && message.attachments.length > 0 && (
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            {message.attachments.map((att, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.25)", padding: "6px 10px", borderRadius: 6, fontSize: "11px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><FileText size={13} /> {att.name} ({att.size})</span>
                <Download size={13} style={{ cursor: "pointer" }} onClick={() => alert("Téléchargement de " + att.name)} />
              </div>
            ))}
          </div>
        )}

        <div style={{ fontSize: "10px", opacity: 0.7, marginTop: 4, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4 }}>
          <span>{message.timestamp}</span>
          {message.isMe && <CheckCheck size={12} color="#93c5fd" />}
        </div>
      </div>
    </div>
  );
};
`, "utf-8");
  count++;

  // 5. Composant : MessageInputBar.tsx
  await fs.writeFile(path.join(projDir, "src", "components", "MessageInputBar.tsx"), `import React, { useState } from "react";
import { Send, Smile, Paperclip } from "lucide-react";

interface Props {
  onSendMessage: (text: string, attachments?: { name: string; size: string; type: string }[]) => void;
  accentColor?: string;
}

export const MessageInputBar: React.FC<Props> = ({ onSendMessage, accentColor = "#3B82F6" }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText("");
  };

  const handleAttachDemo = () => {
    onSendMessage("Fichier partagé dans la conversation :", [
      { name: "rapport_technique_v1.pdf", size: "1.2 Mo", type: "pdf" }
    ]);
  };

  return (
    <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.08)", background: "rgba(11, 15, 25, 0.9)", display: "flex", gap: 10, alignItems: "center" }}>
      <button onClick={handleAttachDemo} title="Joindre un fichier" style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center" }}>
        <Paperclip size={18} />
      </button>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Écrivez votre message... (Entrée pour envoyer)"
        style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: "13px", outline: "none" }}
      />
      <button onClick={() => setText(prev => prev + " 🚀")} title="Ajouter un emoji" style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center" }}>
        <Smile size={18} />
      </button>
      <button onClick={handleSend} style={{ background: accentColor, border: "none", borderRadius: 8, padding: "10px 18px", color: "#fff", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "13px" }}>
        <Send size={14} /> Envoyer
      </button>
    </div>
  );
};
`, "utf-8");
  count++;

  // 6. Feature : ChatMessenger.tsx
  await fs.writeFile(path.join(projDir, "src", "features", "ChatMessenger.tsx"), `import React, { useState, useEffect } from "react";
import { Message, Conversation } from "../types";
import { ChatService } from "../services/chatService";
import { ConversationSidebar } from "../components/ConversationSidebar";
import { MessageBubble } from "../components/MessageBubble";
import { MessageInputBar } from "../components/MessageInputBar";
import { Hash, Circle } from "lucide-react";

export const ChatMessenger: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const convs = ChatService.getConversations();
    setConversations(convs);
    if (convs.length > 0) {
      setActiveConv(convs[0]);
      setMessages(ChatService.getMessages(convs[0].id));
    }
  }, []);

  const handleSelectConv = (conv: Conversation) => {
    setActiveConv(conv);
    setMessages(ChatService.getMessages(conv.id));
  };

  const handleSend = (text: string, attachments?: { name: string; size: string; type: string }[]) => {
    if (!activeConv) return;
    const { newMsg, replyPromise } = ChatService.sendMessage(activeConv.id, text, attachments);
    setMessages(prev => [...prev, newMsg]);

    replyPromise.then(replyMsg => {
      setMessages(prev => [...prev, replyMsg]);
    });
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", height: "calc(100vh - 120px)", background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, overflow: "hidden" }}>
      {conversations.length > 0 && (
        <ConversationSidebar
          conversations={conversations}
          activeConvId={activeConv?.id || ""}
          onSelect={handleSelectConv}
          accentColor="${primaryColor}"
        />
      )}

      <section style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", background: "rgba(15, 23, 42, 0.5)" }}>
        {activeConv && (
          <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
            {activeConv.type === "channel" ? <Hash size={18} color="${primaryColor}" /> : <span style={{ fontSize: "18px" }}>{activeConv.avatar}</span>}
            <div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#f8fafc" }}>{activeConv.name}</div>
              <div style={{ fontSize: "11px", color: "#34d399", display: "flex", alignItems: "center", gap: 4 }}>
                <Circle size={7} fill="#34d399" color="#34d399" /> Connecté · Temps réel actif
              </div>
            </div>
          </div>
        )}

        <div style={{ padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", flex: 1 }}>
          {messages.map(m => (
            <MessageBubble key={m.id} message={m} accentColor="${primaryColor}" />
          ))}
        </div>

        <MessageInputBar onSendMessage={handleSend} accentColor="${primaryColor}" />
      </section>
    </div>
  );
};
`, "utf-8");
  count++;

  // 7. Feature : ChatFiles.tsx
  await fs.writeFile(path.join(projDir, "src", "features", "ChatFiles.tsx"), `import React, { useState, useEffect } from "react";
import { ChatFileItem } from "../types";
import { ChatService } from "../services/chatService";
import { Files, Download, FileText, Image, Film, Search, Upload } from "lucide-react";

export const ChatFiles: React.FC = () => {
  const [files, setFiles] = useState<ChatFileItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setFiles(ChatService.getFiles());
  }, []);

  const handleSimulateUpload = () => {
    const newFile: ChatFileItem = {
      id: Date.now().toString(),
      name: "document_projet_" + (files.length + 1) + ".pdf",
      size: "3.2 Mo",
      type: "pdf",
      sender: "Moi",
      date: "À l'instant",
    };
    ChatService.addFile(newFile);
    setFiles(ChatService.getFiles());
  };

  const filtered = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "10px 0" }}>
      <div style={{ background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px 28px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div>
          <h2 style={{ fontSize: "20px", color: "#f8fafc", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 10 }}>
            <Files size={20} color="${primaryColor}" /> Fichiers & Pièces Jointes Partagés
          </h2>
          <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>Documents, maquettes et médias synchronisés sur les canaux de discussion.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "8px 12px" }}>
            <Search size={14} color="#94a3b8" />
            <input placeholder="Filtrer un document..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: "transparent", border: "none", color: "#fff", fontSize: "12px", outline: "none" }} />
          </div>
          <button onClick={handleSimulateUpload} style={{ background: "${primaryColor}", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: "12px", display: "flex", alignItems: "center", gap: 6 }}>
            <Upload size={14} /> Partager un fichier
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(file => (
          <div key={file.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ background: "rgba(59, 130, 246, 0.15)", borderRadius: 10, padding: 10, color: "#60a5fa" }}>
                {file.type === "image" ? <Image size={18} /> : file.type === "video" ? <Film size={18} /> : <FileText size={18} />}
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc" }}>{file.name}</div>
                <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: 2 }}>{file.size} · Partagé par {file.sender} · {file.date}</div>
              </div>
            </div>
            <button onClick={() => alert("Téléchargement du fichier " + file.name + "...")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1", padding: "8px 14px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "12px" }}>
              <Download size={13} /> Télécharger
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
`, "utf-8");
  count++;

  // 8. Feature : ChatMembers.tsx
  await fs.writeFile(path.join(projDir, "src", "features", "ChatMembers.tsx"), `import React, { useState, useEffect } from "react";
import { ChatMemberItem } from "../types";
import { ChatService } from "../services/chatService";
import { Users, Circle, UserPlus } from "lucide-react";

export const ChatMembers: React.FC = () => {
  const [members, setMembers] = useState<ChatMemberItem[]>([]);

  useEffect(() => {
    setMembers(ChatService.getMembers());
  }, []);

  const handleInvite = () => {
    const name = prompt("Nom du nouveau collaborateur :");
    if (!name) return;
    const newM: ChatMemberItem = {
      id: Date.now().toString(),
      name,
      role: "Collaborateur Invité",
      avatar: "👋",
      status: "online",
      email: name.toLowerCase().replace(/\\s+/g, ".") + "@company.com",
    };
    ChatService.addMember(newM);
    setMembers(ChatService.getMembers());
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "10px 0" }}>
      <div style={{ background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px 28px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div>
          <h2 style={{ fontSize: "20px", color: "#f8fafc", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 10 }}>
            <Users size={20} color="${primaryColor}" /> Membres & Annuaire d'Équipe
          </h2>
          <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>Statuts de présence en direct, rôles et contacts des collaborateurs.</p>
        </div>
        <button onClick={handleInvite} style={{ background: "${primaryColor}", color: "#fff", border: "none", padding: "10px 18px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: "12px", display: "flex", alignItems: "center", gap: 6 }}>
          <UserPlus size={14} /> Inviter un membre
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 14 }}>
        {members.map(m => (
          <div key={m.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: "24px", position: "relative" }}>
                {m.avatar}
                <Circle size={10} fill={m.status === "online" ? "#10b981" : m.status === "away" ? "#f59e0b" : "#64748b"} color={m.status === "online" ? "#10b981" : m.status === "away" ? "#f59e0b" : "#64748b"} style={{ position: "absolute", bottom: -2, right: -2 }} />
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc" }}>{m.name}</div>
                <div style={{ fontSize: "11px", color: "#94a3b8" }}>{m.role}</div>
              </div>
            </div>
            <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: m.status === "online" ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)", color: m.status === "online" ? "#34d399" : "#94a3b8" }}>
              {m.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
`, "utf-8");
  count++;

  // 9. Main App.tsx : 100% Câblé et Autonome
  await fs.writeFile(path.join(projDir, "src", "App.tsx"), `import React, { useState } from "react";
import { ChatMessenger } from "./features/ChatMessenger";
import { ChatFiles } from "./features/ChatFiles";
import { ChatMembers } from "./features/ChatMembers";
import { AnimatedGradient } from "./animation/AnimatedGradient";
import { AnimatedLogo } from "./animation/AnimatedLogo";
import { MessageSquare, Files, Users, Activity } from "lucide-react";

export function App() {
  const [currentTab, setCurrentTab] = useState<"chat" | "files" | "members">("chat");

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f19", color: "#f8fafc", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", position: "relative", overflowX: "hidden" }}>
      <AnimatedGradient intensity={0.55} />
      <header style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", background: "rgba(11, 15, 25, 0.85)", backdropFilter: "blur(14px)", position: "sticky", top: 0, zIndex: 50, padding: "10px 24px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <AnimatedLogo label="${pack.name}" />
            <span style={{ fontSize: "10px", background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>Messagerie Temps Réel</span>
          </div>

          <nav style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", overflowX: "auto" }}>
            <button onClick={() => setCurrentTab("chat")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, fontSize: "12px", fontWeight: currentTab === "chat" ? 700 : 500, cursor: "pointer", background: currentTab === "chat" ? "${primaryColor}" : "transparent", color: currentTab === "chat" ? "#fff" : "#94a3b8", border: "none" }}><MessageSquare size={14} /> Messagerie Directe</button>
            <button onClick={() => setCurrentTab("files")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, fontSize: "12px", fontWeight: currentTab === "files" ? 700 : 500, cursor: "pointer", background: currentTab === "files" ? "${primaryColor}" : "transparent", color: currentTab === "files" ? "#fff" : "#94a3b8", border: "none" }}><Files size={14} /> Fichiers Partagés</button>
            <button onClick={() => setCurrentTab("members")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, fontSize: "12px", fontWeight: currentTab === "members" ? 700 : 500, cursor: "pointer", background: currentTab === "members" ? "${primaryColor}" : "transparent", color: currentTab === "members" ? "#fff" : "#94a3b8", border: "none" }}><Users size={14} /> Membres & Équipe</button>
          </nav>

          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "11px", color: "#34d399", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)", padding: "4px 10px", borderRadius: 20 }}><Activity size={12} /> Connecté</span>
        </div>
      </header>

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px 20px" }}>
        {currentTab === "chat" && <ChatMessenger />}
        {currentTab === "files" && <ChatFiles />}
        {currentTab === "members" && <ChatMembers />}
      </main>
    </div>
  );
}

export default App;
`, "utf-8");
  count++;

  return count;
}



// Rétrocompatibilité
export const assembleStorefrontApp = assembleFinalApplication;
