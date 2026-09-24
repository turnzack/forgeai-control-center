import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";

const PORT = Number(process.env.FORGEAI_BRIDGE_PORT || 5006);
const ROOT = path.resolve(process.env.FORGEAI_WORKSPACES_DIR || path.join(os.homedir(), "Downloads", "ForgeAI", "workspaces"));
const running = new Map();

function safeSegment(value) {
  const result = String(value || "").trim();
  if (!result || result === "." || result === ".." || /[\\/]/.test(result)) throw new Error("Nom de projet invalide");
  return result;
}
function safeFilePath(value) {
  const normalized = String(value || "").replaceAll("\\", "/").replace(/^\/+/, "");
  if (!normalized || normalized.split("/").some((part) => !part || part === "." || part === "..")) throw new Error("Chemin de fichier invalide");
  return normalized;
}
async function body(req) {
  let text = "";
  for await (const chunk of req) text += chunk;
  return text ? JSON.parse(text) : {};
}
function send(res, status, payload) {
  const text = JSON.stringify(payload);
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "GET,POST,OPTIONS" });
  res.end(text);
}
async function writeFiles(projectName, files) {
  const root = path.join(ROOT, safeSegment(projectName));
  await fs.mkdir(root, { recursive: true });
  let count = 0;
  for (const file of files) {
    const relative = safeFilePath(file.path);
    const target = path.join(root, relative);
    if (!target.startsWith(`${root}${path.sep}`)) throw new Error("Chemin hors workspace refusé");
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, String(file.content ?? ""), "utf8");
    count += 1;
  }
  return { success: true, mode: "local-bridge", count, projectName, root, message: `${count} fichier(s) écrits dans ${root}` };
}
async function tree(dir, relative = "") {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return Promise.all(entries.sort((a, b) => a.name.localeCompare(b.name)).map(async (entry) => {
    const child = relative ? `${relative}/${entry.name}` : entry.name;
    return entry.isDirectory() ? { name: entry.name, path: child, type: "directory", children: await tree(path.join(dir, entry.name), child) } : { name: entry.name, path: child, type: "file" };
  }));
}
function runCommand(projectName, command) {
  const allowed = new Set(["pnpm install", "pnpm dev", "npm install", "npm run dev"]);
  if (!allowed.has(command)) throw new Error("Commande refusée. Autorisées : pnpm install, pnpm dev, npm install, npm run dev.");
  const cwd = path.join(ROOT, safeSegment(projectName));
  const isDev = command.endsWith(" dev");
  const child = spawn(command.split(" ")[0], command.split(" ").slice(1), { cwd, detached: isDev, stdio: "pipe", shell: false, env: { ...process.env, PORT: process.env.FORGEAI_DEV_PORT || "5173" } });
  running.set(projectName, child);
  let output = "";
  child.stdout?.on("data", (chunk) => { output = `${output}${chunk}`.slice(-8000); });
  child.stderr?.on("data", (chunk) => { output = `${output}${chunk}`.slice(-8000); });
  if (isDev) child.unref();
  return { success: true, accepted: true, status: isDev ? "started" : "running", pid: child.pid, output, message: `${command} lancé pour ${projectName}` };
}

await fs.mkdir(ROOT, { recursive: true });
const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 204, {});
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "127.0.0.1"}`);
    if (req.method === "GET" && ["/health", "/api/bridge/health", "/bridge/health"].includes(url.pathname)) return send(res, 200, { ok: true, bridge: "ForgeAI Local Bridge", root: ROOT, port: PORT });
    const project = url.pathname.match(/^\/v1\/projects\/([^/]+)(?:\/(tree|files|command))?$/);
    if (!project) return send(res, 404, { success: false, message: "Endpoint introuvable" });
    const projectName = decodeURIComponent(project[1]);
    const operation = project[2];
    const projectRoot = path.join(ROOT, safeSegment(projectName));
    if (req.method === "GET" && !operation) return send(res, 200, { name: projectName, root: projectRoot });
    if (req.method === "GET" && operation === "tree") return send(res, 200, await tree(projectRoot));
    if (req.method !== "POST") return send(res, 405, { success: false, message: "Méthode non supportée" });
    const payload = await body(req);
    if (operation === "files") return send(res, 200, await writeFiles(projectName, payload.files || []));
    if (operation === "command") return send(res, 200, runCommand(projectName, payload.command));
    return send(res, 400, { success: false, message: "Opération manquante" });
  } catch (error) { return send(res, 400, { success: false, message: error instanceof Error ? error.message : String(error) }); }
});
server.listen(PORT, "127.0.0.1", () => console.log(`[ForgeAI Local Bridge] http://127.0.0.1:${PORT} — workspace ${ROOT}`));
