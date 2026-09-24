/* Artifact Writer — writes validated files to disk via chrome.downloads
   KIROV5 v5.1.1 — FIX: extensions React correctes (plus de .txt forcés) */

class ArtifactWriter {
  /* MIME types that preserve the real file extension in chrome.downloads */
  static MIME_BY_EXT = {
    html: "text/html;charset=utf-8",
    htm: "text/html;charset=utf-8",
    css: "text/css;charset=utf-8",
    js: "text/javascript;charset=utf-8",
    mjs: "text/javascript;charset=utf-8",
    cjs: "text/javascript;charset=utf-8",
    jsx: "text/javascript;charset=utf-8",
    ts: "text/typescript;charset=utf-8",
    tsx: "text/typescript;charset=utf-8",
    json: "application/json;charset=utf-8",
    md: "text/markdown;charset=utf-8",
    markdown: "text/markdown;charset=utf-8",
    yaml: "text/yaml;charset=utf-8",
    yml: "text/yaml;charset=utf-8",
    svg: "image/svg+xml;charset=utf-8",
    xml: "application/xml;charset=utf-8",
    map: "application/json;charset=utf-8",
    txt: "text/plain;charset=utf-8",
    env: "text/plain;charset=utf-8",
    gitignore: "text/plain;charset=utf-8",
    conf: "text/plain;charset=utf-8",
    config: "text/plain;charset=utf-8",
  };

  /* Map language tags / bare basenames → proper React/Vite extension */
  static LANG_TO_EXT = {
    typescript: "ts",
    ts: "ts",
    tsx: "tsx",
    javascript: "js",
    js: "js",
    jsx: "jsx",
    html: "html",
    css: "css",
    scss: "scss",
    sass: "sass",
    less: "less",
    json: "json",
    markdown: "md",
    md: "md",
    yaml: "yaml",
    yml: "yml",
    svg: "svg",
    xml: "xml",
    text: "txt",
    plain: "txt",
  };

  /* Bare names that MUST keep a specific extension (React/Vite project) */
  static CANONICAL_BASENAMES = {
    "index.html": "index.html",
    "package.json": "package.json",
    "package-lock.json": "package-lock.json",
    "tsconfig.json": "tsconfig.json",
    "tsconfig.app.json": "tsconfig.app.json",
    "tsconfig.node.json": "tsconfig.node.json",
    "vite.config.ts": "vite.config.ts",
    "vite.config.js": "vite.config.js",
    "tailwind.config.js": "tailwind.config.js",
    "tailwind.config.ts": "tailwind.config.ts",
    "postcss.config.js": "postcss.config.js",
    "postcss.config.cjs": "postcss.config.cjs",
    "eslint.config.js": "eslint.config.js",
    ".gitignore": ".gitignore",
    ".env": ".env",
    ".env.example": ".env.example",
    "readme.md": "README.md",
    "readme": "README.md",
  };

  /**
   * Write all pack artifacts + code files.
   * @param {object} options
   * @param {string} [options.folderName] - subfolder name under Downloads
   * @param {boolean} [options.saveAs] - prompt user for location
   */
  static async writeAll(options = {}) {
    const pack = await PackRegistry.getPack();
    if (!pack) {
      return { success: false, message: "Aucun pack actif à écrire." };
    }

    const results = [];
    const safeName =
      options.folderName ||
      pack.state.folderName ||
      pack.projectName.replace(/[^a-zA-Z0-9_-]/g, "_") ||
      "kirov_project";

    // 1. Spec documents (artifacts preferred, else pack documents)
    for (const filename of PACK_FILES) {
      let content =
        pack.state.artifacts[filename] || pack.documents[filename] || "";
      if (!content) continue;
      // Unwrap if artifact was stored as outer JSON envelope
      content = this.unwrapArtifactContent(content, filename);
      const ok = await this.downloadText(
        content,
        `${safeName}/${filename}`,
        options.saveAs
      );
      results.push({ filename, success: ok, type: "spec" });
    }

    // 2. state.json
    const stateJson = JSON.stringify(
      {
        ...pack.state,
        projectName: pack.projectName,
        projectDescription: pack.projectDescription,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
    const stateOk = await this.downloadText(
      stateJson,
      `${safeName}/state.json`,
      false
    );
    results.push({ filename: "state.json", success: stateOk, type: "meta" });

    // 3. Code files from codegen — NORMALIZE paths to React extensions
    let codeFiles = pack.state.codeFiles || [];
    if (!codeFiles.length) {
      // Fallback: try last captured files from storage
      try {
        const stored = await chrome.storage.local.get([
          STORAGE_KEYS.CAPTURED_FILES,
        ]);
        codeFiles = stored[STORAGE_KEYS.CAPTURED_FILES] || [];
      } catch (_) {}
    }
    // Also try parse from CODE_GENERATION artifacts
    if (!codeFiles.length) {
      const raw =
        pack.state.artifacts["CODE_GENERATION.json"] ||
        pack.state.artifacts["CODE_GENERATION.raw.md"] ||
        "";
      if (raw) codeFiles = this.parseCodeFiles(raw);
    }

    codeFiles = this.normalizeCodeFiles(codeFiles);

    for (const file of codeFiles) {
      if (!file.path || file.content == null) continue;
      const rel = String(file.path).replace(/^\//, "").replace(/\\/g, "/");
      const path = `${safeName}/${rel}`;
      const ok = await this.downloadText(String(file.content), path, false);
      results.push({ filename: file.path, success: ok, type: "code" });
    }

    // 4. README
    const readme = this.buildReadme(pack, codeFiles);
    const readmeOk = await this.downloadText(
      readme,
      `${safeName}/README.md`,
      false
    );
    results.push({ filename: "README.md", success: readmeOk, type: "meta" });

    pack.state.status = "complete";
    pack.state.updatedAt = new Date().toISOString();
    pack.state.exportFolder = safeName;
    pack.state.codeFiles = codeFiles; // persist normalized paths
    await PackRegistry.savePack(pack);

    const successCount = results.filter((r) => r.success).length;
    const codeCount = results.filter((r) => r.type === "code" && r.success)
      .length;
    return {
      success: successCount > 0,
      message: `${successCount}/${results.length} fichiers écrits dans Downloads/${safeName}/ (${codeCount} code React)`,
      results,
      folderName: safeName,
      codeFileCount: codeCount,
    };
  }

  /** Write an array of {path, content} files into folderName */
  static async writeFiles(files, folderName, saveAs = false) {
    const results = [];
    const safe = (folderName || "kirov_project").replace(
      /[^a-zA-Z0-9_-]/g,
      "_"
    );
    const normalized = this.normalizeCodeFiles(files || []);
    for (const file of normalized) {
      if (!file.path) continue;
      const rel = String(file.path).replace(/^\//, "").replace(/\\/g, "/");
      const path = `${safe}/${rel}`;
      const ok = await this.downloadText(
        String(file.content ?? ""),
        path,
        saveAs && results.length === 0
      );
      results.push({ filename: file.path, success: ok });
    }
    return {
      success: results.some((r) => r.success),
      results,
      folderName: safe,
    };
  }

  static buildReadme(pack, codeFiles) {
    const sourceReferences = Array.isArray(pack.state?.sourceReferences)
      ? pack.state.sourceReferences
      : [];
    return [
      `# ${pack.projectName}`,
      "",
      pack.projectDescription || "",
      "",
      `Généré par KIROV5 Orchestrator v5.1.1 — ${new Date().toISOString()}`,
      "",
      "## Stack",
      "",
      "- React 18 + TypeScript + Vite",
      "- Tailwind CSS",
      "- HashRouter (react-router-dom)",
      "",
      "## Démarrage",
      "",
      "```bash",
      "npm install",
      "npm run dev",
      "```",
      "",
      "## Spécifications",
      "",
      ...PACK_FILES.map(
        (f) => `- \`${f}\`${pack.state.artifacts[f] ? " ✅" : ""}`
      ),
      "",
      "## Code source",
      "",
      codeFiles.length
        ? codeFiles.map((f) => `- \`${f.path}\``).join("\n")
        : "_Aucun fichier code généré._",
      "",
      "## Pipeline",
      "",
      `- Étapes complétées: ${(pack.state.completedSteps || []).join(", ")}`,
      `- Status: ${pack.state.status}`,
      "",
      "## Références GitHub utilisées",
      "",
      sourceReferences.length
        ? sourceReferences.map((source) => `- [${source.repository}](${source.url}) — ${source.license} (${source.licenseStatus}), score ${source.score}/100 — référence documentaire uniquement.`).join("\n")
        : "_Aucune référence GitHub n’a été sélectionnée pour ce projet._",
      "",
      sourceReferences.length
        ? "Le détail de la provenance et des limites est disponible dans `SOURCES_GITHUB.md` et `sources.github.json`."
        : "",
      "",
    ].join("\n");
  }

  /* ── MIME / download ── */

  static mimeForPath(filename) {
    const base = String(filename || "").split("/").pop() || "";
    // files without extension (e.g. .gitignore)
    if (base.startsWith(".") && !base.slice(1).includes(".")) {
      return this.MIME_BY_EXT.gitignore || "text/plain;charset=utf-8";
    }
    const parts = base.split(".");
    if (parts.length < 2) return "application/octet-stream";
    const ext = parts.pop().toLowerCase();
    return this.MIME_BY_EXT[ext] || "application/octet-stream";
  }

  static async downloadText(content, filename, saveAs = false) {
    try {
      // Sanitize path: no leading slash, forward slashes only, no ..
      let safePath = String(filename || "file.txt")
        .replace(/\\/g, "/")
        .replace(/^\/+/, "")
        .replace(/\.\.\//g, "")
        .replace(/\/{2,}/g, "/");

      // CRITICAL: never let Chrome rewrite the extension.
      // Use the correct MIME for the extension so chrome.downloads
      // keeps .tsx / .ts / .css / .json / .md instead of forcing .txt
      const mime = this.mimeForPath(safePath);
      const blob = new Blob([String(content ?? "")], { type: mime });
      const dataUrl = await this.blobToDataUrl(blob);
      const downloadId = await this.downloadFile(dataUrl, safePath, saveAs);
      return !!downloadId;
    } catch (e) {
      console.error("[ArtifactWriter] download error:", filename, e);
      return false;
    }
  }

  static blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  static downloadFile(dataUrl, filename, saveAs = false) {
    return new Promise((resolve) => {
      try {
        chrome.downloads.download(
          {
            url: dataUrl,
            filename,
            saveAs: !!saveAs,
            conflictAction: "overwrite",
          },
          (downloadId) => {
            if (chrome.runtime.lastError) {
              console.warn(
                "[ArtifactWriter]",
                chrome.runtime.lastError.message,
                filename
              );
              resolve(null);
            } else {
              resolve(downloadId);
            }
          }
        );
      } catch (e) {
        resolve(null);
      }
    });
  }

  /* ── Path normalization (React / Vite) ── */

  /**
   * Normalize a single file path to a valid React/Vite source path.
   * Fixes: missing extension, .txt forced, wrong casing, bare names.
   */
  static normalizePath(rawPath, content = "", language = "") {
    if (!rawPath) return rawPath;
    let path = String(rawPath)
      .trim()
      .replace(/\\/g, "/")
      .replace(/^\/+/, "")
      .replace(/^\.\//, "")
      .replace(/\*\*/g, "")
      .replace(/`/g, "")
      .replace(/^["']|["']$/g, "");

    // Strip project-root prefix if LLM duplicated folder name
    // e.g. "bn/src/App.tsx" when writing into folder bn → keep "src/App.tsx"
    // (handled by caller usually; keep path as-is for multi-segment)

    // Remove trailing junk
    path = path.replace(/[:\s]+$/, "");

    const segments = path.split("/");
    let basename = segments.pop() || path;
    const dir = segments.join("/");

    // Canonical known basenames (case-insensitive)
    const lower = basename.toLowerCase();
    if (this.CANONICAL_BASENAMES[lower]) {
      basename = this.CANONICAL_BASENAMES[lower];
      return dir ? `${dir}/${basename}` : basename;
    }

    // If extension is .txt — strip it and re-infer
    if (/\.txt$/i.test(basename)) {
      basename = basename.replace(/\.txt$/i, "");
    }

    // Already has a valid source extension? keep it (with small fixes)
    const EXT_RE =
      /\.(tsx|ts|jsx|js|mjs|cjs|css|scss|sass|less|html|json|md|yaml|yml|svg|xml|map|env)$/i;
    if (EXT_RE.test(basename)) {
      // Fix wrong extensions based on content
      if (/\.ts$/i.test(basename) && /<[A-Za-z]|<\/[A-Za-z]/.test(content)) {
        basename = basename.replace(/\.ts$/i, ".tsx");
      }
      if (/\.js$/i.test(basename) && /<[A-Za-z]|<\/[A-Za-z]/.test(content)) {
        basename = basename.replace(/\.js$/i, ".jsx");
      }
      // main.js → main.tsx, App.js → App.tsx when JSX present
      if (/^(main|App|index)\.jsx?$/i.test(basename) && /from ['"]react['"]|<[A-Z]/.test(content)) {
        basename = basename.replace(/\.jsx?$/i, ".tsx");
      }
      return dir ? `${dir}/${basename}` : basename;
    }

    // No extension — infer from language, content, or basename conventions
    const lang = String(language || "").toLowerCase().trim();
    let ext = this.LANG_TO_EXT[lang] || "";

    if (!ext) {
      ext = this.inferExtension(basename, content, dir);
    }

    if (ext) basename = `${basename}.${ext}`;
    return dir ? `${dir}/${basename}` : basename;
  }

  static inferExtension(basename, content, dir = "") {
    const name = String(basename || "");
    const c = String(content || "");
    const d = String(dir || "").toLowerCase();
    const head = c.slice(0, 400);

    // By well-known basenames
    if (/^index\.html$/i.test(name) || (name.toLowerCase() === "index" && /<!doctype html|<html/i.test(c)))
      return "html";
    if (/^package$/i.test(name) || (name === "package" && c.trim().startsWith("{")))
      return "json";
    if (/^tsconfig/i.test(name)) return "json";
    if (/^vite\.config$/i.test(name)) return "ts";
    if (/^tailwind\.config$/i.test(name)) return "js";
    if (/^postcss\.config$/i.test(name)) return "js";
    if (/^readme$/i.test(name)) return "md";
    // src/index without extension + tailwind/css → index.css
    if (/^index$/i.test(name) && (/@tailwind|@import|^\s*:root\s*\{/m.test(c) || /styles|css/i.test(d)))
      return "css";

    // CSS first (before JS heuristics)
    if (/^\s*<!doctype html|^\s*<html/i.test(c)) return "html";
    if (
      /@tailwind\s+(base|components|utilities)/.test(c) ||
      (/^\s*@import\s+['"]/m.test(c) && !/from ['"]/.test(head)) ||
      (/^\s*[.#*a-z][\w-]*\s*\{/m.test(c) && !/^(import |export |const |function |let |var |type |interface )/m.test(head))
    ) {
      return "css";
    }

    // Real JSX/TSX markers — exclude TypeScript generics (create<Foo>(), Array<Bar>)
    // Generics sit right after an identifier: word<Type
    // JSX is preceded by return / = / ( / : or is a closing tag
    const hasJsx =
      /(?:return\s*\(?\s*|[=(:]\s*)<[A-Z][A-Za-z0-9]*[\s/>]/.test(c) ||
      /<\/[A-Za-z][A-Za-z0-9]*>/.test(c) ||
      /React\.createElement/.test(c) ||
      /\bcreateRoot\b/.test(c) ||
      /\bReactDOM\b/.test(c) ||
      // bare component return without paren: return <div
      /return\s+<[A-Za-z]/.test(c);

    // Directory / name conventions
    // Components / pages / layouts / PascalCase entry → always tsx
    if (/components|pages|layouts|views/i.test(d) || /^(App|main)$/i.test(name) || /^[A-Z][A-Za-z0-9]+$/.test(name)) {
      return "tsx";
    }
    // hooks / utils / store / types / services / data → ALWAYS .ts
    // (TypeScript generics like create<GameStore>() must NOT force .tsx)
    if (/hooks|utils|store|services|types|lib|data|helpers/i.test(d) || /^use[A-Z]/.test(name)) {
      return "ts";
    }

    if (hasJsx) return "tsx";

    if (/^\s*\{[\s\S]*"name"\s*:/.test(c) || /^\s*\{[\s\S]*"scripts"\s*:/.test(c))
      return "json";
    if (/^(interface |type |enum |export (type|interface)|import type )/m.test(c))
      return "ts";
    if (/^import |^export |function |const |let |=>/m.test(c)) return "ts";
    if (/^#\s|^\*\*/m.test(c)) return "md";
    if (/^[a-zA-Z0-9_-]+:\s/m.test(c) && !/function |const |import /.test(c))
      return "yaml";

    if (/styles|css/i.test(d)) return "css";

    return "ts"; // safe default for a TS React project
  }

  /** Normalize a whole list of code files */
  static normalizeCodeFiles(files) {
    if (!Array.isArray(files)) return [];
    const seen = new Set();
    const out = [];
    for (const f of files) {
      if (!f || f.path == null) continue;
      const path = this.normalizePath(f.path, f.content || "", f.language || "");
      if (!path) continue;
      // Skip junk
      if (/\.(vue|pyc|class|exe|dll)$/i.test(path)) continue;
      if (seen.has(path)) continue;
      seen.add(path);
      out.push({
        path,
        content: f.content == null ? "" : String(f.content),
        language: f.language || this.extOf(path),
      });
    }
    return out;
  }

  static extOf(path) {
    const m = String(path).match(/\.([a-z0-9]+)$/i);
    return m ? m[1].toLowerCase() : "";
  }

  /* ── Unwrap artifact envelopes ── */

  /**
   * Specs are sometimes stored as the full LLM JSON:
   * {"status":"ok","document":"...","content":"# real md..."}
   * Extract the inner content when present.
   */
  static unwrapArtifactContent(raw, filename) {
    if (!raw || typeof raw !== "string") return String(raw ?? "");
    let s = raw.trim();
    // Already looks like proper markdown/yaml
    if (s.startsWith("#") || s.startsWith("project:") || s.startsWith("---")) {
      return s;
    }
    // Try parse as JSON envelope
    try {
      let cleaned = s;
      const fence = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
      if (fence) cleaned = fence[1].trim();
      const obj = JSON.parse(cleaned);
      if (obj && typeof obj.content === "string" && obj.content.length > 20) {
        // content itself may be escaped string with \n
        return obj.content;
      }
      if (obj && obj.files) {
        return JSON.stringify(obj, null, 2);
      }
    } catch (_) {
      /* try extract */
    }
    // Regex extract "content":"..."
    const m = s.match(
      /"content"\s*:\s*"((?:[^"\\]|\\.)*)"/
    );
    if (m) {
      try {
        return JSON.parse(`"${m[1]}"`);
      } catch (_) {
        return m[1]
          .replace(/\\n/g, "\n")
          .replace(/\\t/g, "\t")
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, "\\");
      }
    }
    // Double-encoded: starts with {"status"
    if (s.startsWith("{") && s.includes('"content"')) {
      const first = s.indexOf("{");
      const last = s.lastIndexOf("}");
      if (first !== -1 && last > first) {
        try {
          const obj = JSON.parse(s.slice(first, last + 1));
          if (typeof obj.content === "string") return obj.content;
        } catch (_) {}
      }
    }
    return s;
  }

  /* ── Parse code files from various LLM output formats ── */
  static parseCodeFiles(content) {
    if (!content) return [];
    let cleaned = String(content).trim();

    // Strip markdown fences wrapping whole payload
    const fence = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fence && /"files"\s*:|"path"\s*:/.test(fence[1])) {
      cleaned = fence[1].trim();
    }

    // Direct JSON
    try {
      const p = JSON.parse(cleaned);
      if (p.files && Array.isArray(p.files)) {
        return this.normalizeCodeFiles(p.files);
      }
      if (Array.isArray(p) && p[0]?.path) {
        return this.normalizeCodeFiles(p);
      }
      // Nested: {status, content: "{files:[...]}"} or {content: {files}}
      if (p.content) {
        if (typeof p.content === "string") {
          const inner = this.parseCodeFiles(p.content);
          if (inner.length) return inner;
        } else if (p.content.files) {
          return this.normalizeCodeFiles(p.content.files);
        }
      }
    } catch (_) {}

    // Extract JSON object containing "files"
    const filesKey = cleaned.search(/"files"\s*:\s*\[/);
    if (filesKey !== -1) {
      // Walk back to nearest {
      let start = cleaned.lastIndexOf("{", filesKey);
      // Prefer the outermost that still parses
      for (let s = start; s >= 0; s = cleaned.lastIndexOf("{", s - 1)) {
        const candidate = this.tryExtractJson(cleaned, s);
        if (candidate?.files && Array.isArray(candidate.files)) {
          return this.normalizeCodeFiles(candidate.files);
        }
        if (s === 0) break;
      }
    }

    // Generic first { ... last }
    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");
    if (first !== -1 && last > first) {
      try {
        const p = JSON.parse(cleaned.slice(first, last + 1));
        if (p.files && Array.isArray(p.files)) {
          return this.normalizeCodeFiles(p.files);
        }
        if (typeof p.content === "string" && p.content.includes("path")) {
          const inner = this.parseCodeFiles(p.content);
          if (inner.length) return inner;
        }
      } catch (_) {}
    }

    // Regex fallback for individual file objects (non-greedy content)
    const files = [];
    const re =
      /\{\s*"path"\s*:\s*"((?:[^"\\]|\\.)*)"\s*,\s*"content"\s*:\s*"((?:[^"\\]|\\.)*)"(?:\s*,\s*"language"\s*:\s*"((?:[^"\\]|\\.)*)")?\s*\}/g;
    let m;
    while ((m = re.exec(cleaned)) !== null) {
      try {
        files.push({
          path: JSON.parse(`"${m[1]}"`),
          content: JSON.parse(`"${m[2]}"`),
          language: m[3] ? JSON.parse(`"${m[3]}"`) : undefined,
        });
      } catch (_) {
        files.push({
          path: m[1],
          content: m[2]
            .replace(/\\n/g, "\n")
            .replace(/\\t/g, "\t")
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, "\\"),
          language: m[3] || undefined,
        });
      }
    }
    if (files.length) return this.normalizeCodeFiles(files);

    // Fichier: path blocks (French KIROV format)
    const blockRe =
      /(?:Fichier|File)\s*:\s*[`"]?([^\n`"]+)[`"]?\s*\n```[\w+-]*\n([\s\S]*?)```/gi;
    let bm;
    while ((bm = blockRe.exec(cleaned)) !== null) {
      files.push({ path: bm[1].trim(), content: bm[2] });
    }
    if (files.length) return this.normalizeCodeFiles(files);

    // ```tsx path/to/File.tsx ... ``` or ```tsx title=...
    const fencePathRe =
      /```(\w+)?\s*(?:(?:file|path|title)=)?[`"]?([^\n`"]+\.[a-zA-Z0-9]+)[`"]?\s*\n([\s\S]*?)```/g;
    let fm;
    while ((fm = fencePathRe.exec(cleaned)) !== null) {
      const lang = fm[1] || "";
      const p = fm[2].trim();
      if (/^(json|javascript|typescript|tsx|jsx|html|css|bash|shell|yaml|yml|md|markdown)$/i.test(p))
        continue;
      files.push({ path: p, content: fm[3], language: lang });
    }
    if (files.length) return this.normalizeCodeFiles(files);

    return [];
  }

  static tryExtractJson(text, startIdx) {
    // Brace-matching JSON extract from startIdx
    let depth = 0;
    let inString = false;
    let escape = false;
    for (let i = startIdx; i < text.length; i++) {
      const c = text[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (c === "\\") {
        escape = true;
        continue;
      }
      if (c === '"') {
        inString = !inString;
        continue;
      }
      if (inString) continue;
      if (c === "{") depth++;
      else if (c === "}") {
        depth--;
        if (depth === 0) {
          try {
            return JSON.parse(text.slice(startIdx, i + 1));
          } catch (_) {
            return null;
          }
        }
      }
    }
    return null;
  }
}
