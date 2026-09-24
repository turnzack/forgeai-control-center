/* Source artifact helper kept separate from UI and GitHub transport. */
const SourceManifest = (() => {
  async function build(projectId) {
    const sources = await ProjectSources.get(projectId);
    return { projectId, sources, markdown: ProjectSources.toMarkdown(projectId, sources), json: ProjectSources.toJSON(projectId, sources) };
  }
  return { build };
})();

globalThis.SourceManifest = SourceManifest;
