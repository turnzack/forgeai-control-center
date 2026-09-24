import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { wireProjectIndustrially } from "../bridge-local/industrial_gems_wirer.mjs";
import { resolvePrdPack, detectArchetype } from "../bridge-local/universal_app_generator.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODGIT_DIR = path.resolve(__dirname, "..", "prodgit");

async function main() {
  console.log("===============================================================");
  console.log("🚀 ORCHESTRATEUR INDUSTRIEL : CÂBLAGE AUTOMATISÉ DE TOUS LES PROJETS");
  console.log("===============================================================\n");

  const entries = await fs.readdir(PRODGIT_DIR, { withFileTypes: true });
  const projectDirs = entries
    .filter(e => e.isDirectory() && !e.name.startsWith("."))
    .map(e => e.name);

  console.log(`📁 ${projectDirs.length} projets détectés dans prodgit/ :`, projectDirs.join(", "), "\n");

  const results = [];

  for (const projName of projectDirs) {
    const projDir = path.join(PRODGIT_DIR, projName);
    console.log(`⚡ [${projName}] Démarrage du câblage industriel...`);

    try {
      // 1. Détecter l'archétype sans régénérer l'App.tsx existant
      const pack = await resolvePrdPack(projDir);
      const archetype = detectArchetype(pack);
      console.log(`   ✓ Archétype : ${archetype} | Pack : ${pack.name}`);

      // 2. Câblage industriel des pépites montées SEULEMENT
      //    (GemsStudio, GemsExplorer, ProvenanceAuditView, gemsManifest)
      //    Sans toucher à l'App.tsx déjà existant et câblé
      const wireRes = await wireProjectIndustrially(projDir, projName);
      console.log(`   ✓ Pépites montées indexées et câblées : ${wireRes.gemsCount}`);

      // 3. Test de compilation TypeScript
      let tscStatus = "Non applicable";
      if (
        fsSync.existsSync(path.join(projDir, "package.json")) &&
        fsSync.existsSync(path.join(projDir, "tsconfig.json"))
      ) {
        try {
          execSync("pnpm exec tsc --noEmit", { cwd: projDir, stdio: "pipe" });
          tscStatus = "✅ 0 erreur (100% Clean)";
        } catch (tscErr) {
          const errOut = tscErr.stderr?.toString() || tscErr.stdout?.toString() || tscErr.message || "";
          tscStatus = `⚠️ ${errOut.slice(0, 120)}`;
        }
      }
      console.log(`   ✓ Statut TypeScript : ${tscStatus}\n`);

      results.push({
        project: projName,
        archetype,
        packName: pack.name,
        gemsCount: wireRes.gemsCount,
        tscStatus,
        status: "SUCCESS",
      });
    } catch (err) {
      console.error(`   ❌ Erreur sur ${projName} :`, err.message);
      results.push({
        project: projName,
        status: "ERROR",
        error: err.message,
      });
    }
  }

  console.log("===============================================================");
  console.log("📊 RÉSUMÉ GLOBAL DU CÂBLAGE INDUSTRIEL");
  console.log("===============================================================");
  console.table(results);
}

main().catch(err => {
  console.error("Erreur fatale :", err);
  process.exit(1);
});
