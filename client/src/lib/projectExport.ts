import { zipSync, strToU8 } from "fflate";
import { bridgeClient, type ProjectFile } from "./bridgeClient";

export function normalizeProjectPath(path: string) {
  const normalized = String(path || "").replaceAll("\\", "/").replace(/^\/+/, "");
  if (!normalized || normalized.split("/").some((segment) => segment === ".." || segment === ".")) {
    throw new Error(`Chemin de fichier invalide : ${path}`);
  }
  return normalized;
}

export function createProjectZip(projectName: string, files: ProjectFile[]) {
  const archive: Record<string, Uint8Array> = {};
  for (const file of files) archive[normalizeProjectPath(file.path)] = strToU8(String(file.content ?? ""));
  return zipSync(archive, { level: 6 });
}

export function downloadProjectZip(projectName: string, files: ProjectFile[]) {
  const bytes = createProjectZip(projectName, files);
  const blob = new Blob([bytes], { type: "application/zip" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${normalizeProjectPath(projectName || "forgeai-project")}.zip`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function writeWithLocalBridge(projectName: string, files: ProjectFile[]) {
  return bridgeClient.writeFiles(projectName, files);
}

export async function publishProjectToGitHub(projectName: string, files: ProjectFile[], options: { repo?: string; branch?: string; commitMessage?: string } = {}) {
  return bridgeClient.publishGitHub(projectName, files, options);
}

export async function writeWithDirectoryPicker(projectName: string, files: ProjectFile[]) {
  const picker = (window as Window & { showDirectoryPicker?: () => Promise<any> }).showDirectoryPicker;
  if (!picker) throw new Error("Le navigateur ne permet pas la sélection de dossier. Utilisez le Bridge local ou ZIP.");
  const root = await picker();
  const projectDirectory = await root.getDirectoryHandle(projectName, { create: true });
  for (const file of files) {
    const parts = normalizeProjectPath(file.path).split("/");
    const filename = parts.pop()!;
    let directory = projectDirectory;
    for (const part of parts) directory = await directory.getDirectoryHandle(part, { create: true });
    const handle = await directory.getFileHandle(filename, { create: true });
    const writable = await handle.createWritable();
    await writable.write(String(file.content ?? ""));
    await writable.close();
  }
  return { success: true, count: files.length, projectName, mode: "directory-picker" } as const;
}
