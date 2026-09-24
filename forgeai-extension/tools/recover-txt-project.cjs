#!/usr/bin/env node
/**
 * KIROV5 v5.1.1 — Recover a project written as .txt into a React/Vite tree.
 *
 * Usage:
 *   node recover-txt-project.js <sourceDir> [destDir]
 *
 * Example:
 *   node recover-txt-project.js ~/Downloads/bn ~/Downloads/bn-react
 */
const fs = require("fs");
const path = require("path");

const LANG_TO_EXT = {
  typescript: "ts", ts: "ts", tsx: "tsx",
  javascript: "js", js: "js", jsx: "jsx",
  html: "html", css: "css", json: "json",
  markdown: "md", md: "md", yaml: "yaml", yml: "yml",
};

const CANONICAL = {
  "index.html": "index.html",
  "package.json": "package.json",
  "tsconfig.json": "tsconfig.json",
  "vite.config.ts": "vite.config.ts",
  "vite.config.js": "vite.config.js",
  "tailwind.config.js": "tailwind.config.js",
  "postcss.config.js": "postcss.config.js",
  "readme.md": "README.md",
  "readme.txt": "README.md",
  "state.txt": "state.json",
  "state.json": "state.json",
};

const SPEC_MAP = {
  "00_project_meta.txt": "00_PROJECT_META.md",
  "01_prd.txt": "01_PRD.md",
  "02_architecture.txt": "02_ARCHITECTURE.md",
  "03_skills.txt": "03_SKILLS.yaml",
  "04_tasks.txt": "04_TASKS.md",
  "05_file_tree.txt": "05_FILE_TREE.md",
  "06_prompt_workflow.txt": "06_PROMPT_WORKFLOW.md",
  "07_validation_rules.txt": "07_VALIDATION_RULES.md",
  "08_orders.txt": "08_ORDERS.md",
  "readme.txt": "README.md",
};

function inferExt(basename, content, dir) {
  const name = String(basename || "");
  const c = String(content || "");
  const d = String(dir || "").toLowerCase();
  const head = c.slice(0, 400);

  if (SPEC_MAP[name.toLowerCase()]) return null; // handled separately
  if (/<!doctype html|<html/i.test(c)) return "html";
  if (/^package$/i.test(name) || (c.trim().startsWith("{") && /"name"\s*:/.test(c))) return "json";
  if (/^tsconfig/i.test(name) || /^state$/i.test(name)) return "json";
  if (/^vite\.config$/i.test(name)) return "ts";
  if (/^tailwind\.config$/i.test(name) || /^postcss\.config$/i.test(name)) return "js";
  if (/^index$/i.test(name) && /@tailwind|@import|^\s*:root\s*\{/m.test(c)) return "css";
  if (
    /@tailwind\s+(base|components|utilities)/.test(c) ||
    (/^\s*[.#*a-z][\w-]*\s*\{/m.test(c) && !/^(import |export |const |function )/m.test(head))
  ) return "css";

  const hasJsx =
    /(?:return\s*\(?\s*|[=(:]\s*)<[A-Z][A-Za-z0-9]*[\s/>]/.test(c) ||
    /<\/[A-Za-z][A-Za-z0-9]*>/.test(c) ||
    /React\.createElement/.test(c) ||
    /\bcreateRoot\b|\bReactDOM\b/.test(c) ||
    /return\s+<[A-Za-z]/.test(c);

  if (/components|pages|layouts|views/i.test(d) || /^(App|main)$/i.test(name) || /^[A-Z][A-Za-z0-9]+$/.test(name))
    return "tsx";
  if (/hooks|utils|store|services|types|lib|data|helpers/i.test(d) || /^use[A-Z]/.test(name))
    return "ts";
  if (hasJsx) return "tsx";
  if (/^(interface |type |enum |export type |import type )/m.test(c)) return "ts";
  if (/^import |^export |function |const /m.test(c)) return "ts";
  if (/^#\s/m.test(c)) return "md";
  if (/^[a-zA-Z0-9_-]+:\s/m.test(c) && !/function |const |import /.test(c)) return "yaml";
  return "ts";
}

function normalizeRel(relPath, content) {
  const parts = relPath.replace(/\\/g, "/").split("/");
  let base = parts.pop();
  const dir = parts.join("/");
  const low = base.toLowerCase();

  if (SPEC_MAP[low]) {
    return SPEC_MAP[low];
  }
  if (CANONICAL[low]) {
    return dir ? `${dir}/${CANONICAL[low]}` : CANONICAL[low];
  }

  let name = base;
  if (/\.txt$/i.test(name)) name = name.replace(/\.txt$/i, "");

  const EXT_RE = /\.(tsx|ts|jsx|js|mjs|cjs|css|scss|html|json|md|yaml|yml|svg)$/i;
  if (EXT_RE.test(name)) {
    if (/\.ts$/i.test(name) && /(?:return\s*\(?\s*|[=(:]\s*)<[A-Z]|<\/[A-Za-z]|createRoot|ReactDOM/.test(content)) {
      name = name.replace(/\.ts$/i, ".tsx");
    }
    return dir ? `${dir}/${name}` : name;
  }

  const ext = inferExt(name, content, dir);
  if (ext) name = `${name}.${ext}`;
  return dir ? `${dir}/${name}` : name;
}

function walk(dir, base = dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, base, out);
    else out.push(path.relative(base, full));
  }
  return out;
}

function main() {
  const src = process.argv[2];
  const dest = process.argv[3] || (src ? src.replace(/\/$/, "") + "-react" : null);
  if (!src || !dest) {
    console.error("Usage: node recover-txt-project.js <sourceDir> [destDir]");
    process.exit(1);
  }
  if (!fs.existsSync(src)) {
    console.error("Source not found:", src);
    process.exit(1);
  }

  fs.mkdirSync(dest, { recursive: true });
  const files = walk(src);
  const mapping = [];

  for (const rel of files) {
    const srcPath = path.join(src, rel);
    const content = fs.readFileSync(srcPath, "utf8");
    const newRel = normalizeRel(rel, content);
    const destPath = path.join(dest, newRel);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, content, "utf8");
    mapping.push({ from: rel, to: newRel });
    console.log(`${rel}  →  ${newRel}`);
  }

  fs.writeFileSync(
    path.join(dest, "_recovery_map.json"),
    JSON.stringify({ source: src, dest, mapping, recoveredAt: new Date().toISOString() }, null, 2)
  );
  console.log(`\n✅ ${mapping.length} fichiers récupérés → ${dest}`);
  console.log("Ensuite: cd " + dest + " && npm install && npm run dev");
}

main();
