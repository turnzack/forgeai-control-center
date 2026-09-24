import fs from "fs";
import path from "path";
import fetch from "node-fetch"; // or built-in fetch if Node 18+

export async function downloadRepoArchive(owner: string, repo: string, ref: string = "HEAD", packId: string = "app_web_pack"): Promise<string> {
  const zipUrl = `https://github.com/${owner}/${repo}/archive/${ref}.zip`;
  const workspaceRoot = process.env.WORKSPACE_ROOT || path.join(process.cwd(), "prodgit", packId.replace(/_/g, '-'));
  const sourcesDir = path.join(workspaceRoot, "github-sources");

  if (!fs.existsSync(sourcesDir)) {
    fs.mkdirSync(sourcesDir, { recursive: true });
  }

  const zipPath = path.join(sourcesDir, `${owner}-${repo}-${ref.replace(/[\/\\:]/g, '-')}.zip`);

  const response = await fetch(zipUrl);
  if (!response.ok) {
    throw new Error(`Erreur téléchargement GitHub: ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();
  fs.writeFileSync(zipPath, Buffer.from(buffer));

  return zipPath;
}

export async function mountComponent(owner: string, repo: string, commit: string, spdxId: string, packId: string = "app_web_pack"): Promise<string> {
  const workspaceRoot = process.env.WORKSPACE_ROOT || path.join(process.cwd(), "prodgit", packId.replace(/_/g, '-'));
  const mountDir = path.join(workspaceRoot, "src", "integrations", "github-adapted", `${owner}-${repo}`);

  if (!fs.existsSync(mountDir)) {
    fs.mkdirSync(mountDir, { recursive: true });
  }

  const provenance = {
    source: "github",
    repository: `${owner}/${repo}`,
    commit: commit,
    license: spdxId,
    sourceUrl: `https://github.com/${owner}/${repo}`,
    auditedAt: new Date().toISOString()
  };

  const provenancePath = path.join(mountDir, "provenance.json");
  fs.writeFileSync(provenancePath, JSON.stringify(provenance, null, 2));

  // Création des dossiers standard
  if (!fs.existsSync(path.join(mountDir, "components"))) {
    fs.mkdirSync(path.join(mountDir, "components"));
  }

  return mountDir;
}
