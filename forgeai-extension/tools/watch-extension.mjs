#!/usr/bin/env node
/**
 * ForgeAI Extension Watcher
 * Surveille forgeai-extension/ et copie automatiquement les fichiers modifiÃ©s
 * dans le dossier de sortie (EXTENSION_OUT_DIR ou forgeai-extension-dist/).
 * Affiche un rÃ©sumÃ© Ã  chaque changement pour faciliter le rechargement Chrome.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", ".."); // remonte de tools/ puis forgeai-extension/
const SRC = path.join(ROOT, "forgeai-extension");
const OUT = path.resolve(process.env.EXTENSION_OUT_DIR || path.join(ROOT, "forgeai-extension-dist"));

/* â”€â”€ Couleurs ANSI â”€â”€ */
const C = {
  reset: "\x1b[0m", cyan: "\x1b[36m", green: "\x1b[32m",
  yellow: "\x1b[33m", red: "\x1b[31m", dim: "\x1b[2m", bold: "\x1b[1m",
};

function log(icon, msg, color = C.reset) {
  const time = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  console.log(`${C.dim}[${time}]${C.reset} ${icon} ${color}${msg}${C.reset}`);
}

/* â”€â”€ Copie rÃ©cursive initiale â”€â”€ */
function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    try {
      fs.copyFileSync(src, dest);
    } catch (err) {
      if (err.code === "EBUSY" || err.code === "EPERM" || err.code === "EACCES") {
        try {
          const buf = fs.readFileSync(src);
          fs.writeFileSync(dest, buf);
        } catch (_) {}
      } else {
        throw err;
      }
    }
  }
}

/* â”€â”€ Copie d'un fichier unique avec log â”€â”€ */
function copyFile(src, reason = "modifiÃ©") {
  const rel = path.relative(SRC, src);
  const dest = path.join(OUT, rel);
  try {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    log("ðŸ“„", `${rel}  â†’  dist/  (${reason})`, C.green);
  } catch (err) {
    log("âŒ", `Erreur copie ${rel}: ${err.message}`, C.red);
  }
}

/* â”€â”€ Suppression d'un fichier â”€â”€ */
function removeFile(src) {
  const rel = path.relative(SRC, src);
  const dest = path.join(OUT, rel);
  try {
    if (fs.existsSync(dest)) fs.unlinkSync(dest);
    log("ðŸ—‘ï¸", `${rel}  supprimÃ© de dist/`, C.yellow);
  } catch (err) {
    log("âŒ", `Erreur suppression ${rel}: ${err.message}`, C.red);
  }
}

/* â”€â”€ Debounce simple pour Ã©viter les doubles Ã©vÃ©nements â”€â”€ */
const pending = new Map();
function debounce(key, fn, ms = 80) {
  if (pending.has(key)) clearTimeout(pending.get(key));
  pending.set(key, setTimeout(() => { pending.delete(key); fn(); }, ms));
}

/* â”€â”€ Lancement â”€â”€ */
console.log(`\n${C.bold}${C.cyan}â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—`);
console.log(`\n${C.bold}${C.cyan}â•”â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â•—`);
console.log(`â•‘  ForgeAI Extension Watcher               â•‘`);
console.log(`â•šâ• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• â• ${C.reset}\n`);
log("ðŸ“ ", `Source  : ${SRC}`, C.dim);
log("ðŸ“¦", `Sortie  : ${OUT}`, C.dim);
console.log();

/* Copie initiale complète */
log("⏳", "Copie initiale de l'extension...", C.yellow);
copyRecursive(SRC, OUT);
log("✅", `Extension copiée dans ${path.relative(ROOT, OUT)}/`, C.green);

if (process.argv.includes("--once") || process.argv.includes("--build")) {
  log("🚀", "Build de l'extension terminé avec succès (--once).", C.green);
  process.exit(0);
}

console.log();
log("👀", "Surveillance active — rechargez l'extension dans Chrome après chaque ✅", C.cyan);
log("ðŸ”—", "chrome://extensions/  â†’  bouton Recharger", C.dim);
console.log();

/* Watcher rÃ©cursif */
const watcher = fs.watch(SRC, { recursive: true }, (event, filename) => {
  if (!filename) return;
  const fullPath = path.join(SRC, filename);
  debounce(fullPath, () => {
    if (!fs.existsSync(fullPath)) {
      removeFile(fullPath);
    } else {
      const stat = fs.statSync(fullPath);
      if (stat.isFile()) copyFile(fullPath, event);
    }
  });
});

watcher.on("error", (err) => log("âŒ", `Watcher erreur : ${err.message}`, C.red));
process.on("SIGINT", () => { watcher.close(); log("ðŸ‘‹", "Watcher arrÃªtÃ©.", C.yellow); process.exit(0); });

