const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const popupSource = fs.readFileSync(path.join(root, 'popup.js'), 'utf8');
assert.match(popupSource, /forgeai_github_search_state_v1/);
assert.match(popupSource, /githubRestoreSearchState/);
assert.match(popupSource, /githubPersistSearchState/);
assert.match(popupSource, /chrome\.storage\.local\.remove\(GITHUB_SEARCH_STATE_KEY\)/);

const localStore = {};
const chrome = {
  storage: {
    local: {
      get: (keys, callback) => {
        const result = Array.isArray(keys)
          ? Object.fromEntries(keys.map((key) => [key, localStore[key]]))
          : typeof keys === 'string' ? { [keys]: localStore[keys] } : { ...localStore };
        if (callback) { callback(result); return undefined; }
        return Promise.resolve(result);
      },
      set: (value, callback) => { Object.assign(localStore, value); if (callback) callback(); return Promise.resolve(); },
      remove: (keys, callback) => { (Array.isArray(keys) ? keys : [keys]).forEach((key) => delete localStore[key]); if (callback) callback(); return Promise.resolve(); },
    },
    runtime: { lastError: null },
  },
  runtime: { lastError: null },
};
const context = vm.createContext({ console, URL, Date, Math, Set, Map, String, Number, Boolean, Array, Object, JSON, chrome, globalThis: {} });
function load(file) { vm.runInContext(fs.readFileSync(path.join(root, 'lib', file), 'utf8'), context, { filename: file }); }

load('github_schemas.js');
load('license_policy.js');
load('repository_metadata.js');
load('constants.js');
load('pack-registry.js');
load('project_sources.js');
load('source_manifest.js');
load('github_source_pipeline.js');
load('github_source_downloader.js');
const { LicensePolicy, RepositoryMetadata, GitHubSchemas, ProjectSources, GitHubSourcePipeline } = context.globalThis;
const { GitHubSourceDownloader } = context.globalThis;

assert.equal(LicensePolicy.evaluate('MIT', 'commercial-permissive').status, 'allowed');
assert.equal(LicensePolicy.evaluate('GPL-3.0-only', 'commercial-permissive').status, 'blocked');
assert.equal(LicensePolicy.evaluate('MPL-2.0', 'commercial-permissive').status, 'review');
assert.equal(LicensePolicy.evaluate('NOASSERTION', 'commercial-permissive').status, 'review');

const caps = RepositoryMetadata.extractCapabilities('Monaco editor Electron multi-agent LLM sandbox');
assert.ok(caps.some((cap) => cap.id === 'code-editor'));
const repo = RepositoryMetadata.normalizeRepo({
  id: 1,
  full_name: 'example/forge',
  html_url: 'https://github.com/example/forge',
  name: 'forge',
  default_branch: 'main',
  description: 'Electron Monaco multi-agent LLM editor',
  language: 'TypeScript',
  topics: ['electron', 'llm'],
  stargazers_count: 1000,
  forks_count: 50,
  open_issues_count: 2,
  archived: false,
  fork: false,
  updated_at: '2026-09-01T00:00:00Z',
  pushed_at: '2026-09-01T00:00:00Z',
});
const scored = RepositoryMetadata.score(repo, caps, { licenseStatus: 'allowed', now: Date.parse('2026-09-21T00:00:00Z') });
assert.ok(scored.score >= 0 && scored.score <= 100);
assert.equal(scored.scoreBreakdown.license, 20);
assert.equal(GitHubSchemas.isRepoName('example/forge'), true);
assert.equal(GitHubSchemas.isGithubUrl('https://github.com/example/forge'), true);
assert.equal(GitHubSchemas.isGithubUrl('javascript:alert(1)'), false);

const source = GitHubSourcePipeline.toSourceRecord({
  fullName: 'example/forge',
  url: 'https://github.com/example/forge',
  defaultBranch: 'main',
  description: 'Référence pour un éditeur multi-agent.',
  language: 'TypeScript',
  topics: ['electron', 'llm'],
  pushedAt: '2026-09-01T00:00:00Z',
  capabilities: caps,
  reasons: ['Correspondance forte avec les capacités demandées.'],
  score: 88,
  scoreBreakdown: scored.scoreBreakdown,
  licenseCheck: { spdxId: 'MIT', name: 'MIT License', repositoryLicenseChecked: true },
  licenseDecision: { status: 'allowed', policy: 'commercial-permissive', reason: 'MIT est compatible.' },
});
GitHubSchemas.assertSource(source);
assert.equal(source.action, 'reference-only');
assert.equal(source.dependencyLicensesChecked, false);
assert.equal(GitHubSourceDownloader.archiveUrl(source), 'https://codeload.github.com/example/forge/zip/refs/heads/main');
assert.match(GitHubSourceDownloader.WARNING, /consultation uniquement/i);

const markdown = ProjectSources.toMarkdown('forge-test', [source]);
assert.match(markdown, /Description/);
assert.match(markdown, /Technologie/);
assert.match(markdown, /Mise à jour/);
assert.match(markdown, /Correspondance avec le besoin/);
assert.match(markdown, /références documentaires uniquement/i);
const json = JSON.parse(ProjectSources.toJSON('forge-test', [source]));
assert.equal(json.referenceOnly, true);
assert.equal(json.sources[0].repository, 'example/forge');

const architectureContext = GitHubSourcePipeline.buildArchitectureContext([source], 'commercial-permissive');
assert.match(architectureContext, /Contexte de références GitHub approuvées/);
assert.match(architectureContext, /implémentation originale/);

const compliantAudit = GitHubSourcePipeline.auditDependencies([
  { path: 'package.json', content: JSON.stringify({ dependencies: { react: '^18.3.1' }, devDependencies: { vite: '^5.4.0' } }) },
]);
assert.equal(compliantAudit.valid, true);
assert.match(compliantAudit.markdown, /Conforme/);
const invalidAudit = GitHubSourcePipeline.auditDependencies([
  { path: 'package.json', content: JSON.stringify({ dependencies: { '@example/forge': 'github:example/forge' } }) },
]);
assert.equal(invalidAudit.valid, false);
assert.match(invalidAudit.message, /source non verrouillée/i);

console.log('PASS: license policy, scoring, provenance artifacts, original-source context and dependency audit');

;(async () => {
  localStore.kirov_pack = {
    projectName: 'Forge Test',
    projectDescription: 'Éditeur multi-agent pour développeurs.',
    documents: { '00_PROJECT_META.md': '# Meta' },
    state: {
      currentStep: 0,
      completedSteps: [],
      lockedSteps: {},
      accessLog: [],
      artifacts: {},
      codeFiles: [],
      folderName: 'forge_test',
      execMode: 'api',
      webAi: 'deepseek',
    },
  };
  const prepared = await GitHubSourcePipeline.prepareProject({
    policy: 'commercial-permissive',
    autoCreate: false,
    sources: [source],
  });
  assert.equal(prepared.success, true);
  assert.equal(prepared.created, false);
  assert.match(localStore.kirov_pack.state.artifacts['SOURCES_GITHUB.md'], /Sources GitHub/);
  assert.ok(localStore.kirov_pack.state.artifacts['sources.github.json']);
  assert.equal(localStore.kirov_pack.state.codegenApproval.status, 'pending');
  localStore.kirov_pack.state.currentStep = 9;
  assert.equal(GitHubSourcePipeline.requiresCodegenApproval(localStore.kirov_pack), true);
  console.log('PASS: selected sources are persisted, injected into provenance artifacts and gated before codegen');

  delete localStore.kirov_pack;
  context.globalThis.Orchestrator = {
    createProject: async (projectName, projectDescription, options) => {
      const pack = {
        projectName,
        projectDescription,
        documents: {},
        state: {
          currentStep: 0,
          completedSteps: [],
          lockedSteps: {},
          accessLog: [],
          artifacts: {},
          codeFiles: [],
          folderName: options.folderName || 'auto_project',
          execMode: options.execMode || 'api',
          webAi: options.webAi || 'deepseek',
        },
      };
      localStore.kirov_pack = pack;
      return { success: true, pack };
    },
  };
  vm.runInContext('var Orchestrator = globalThis.Orchestrator;', context);
  const autoPrepared = await GitHubSourcePipeline.prepareProject({
    projectIdea: 'Créer un IDE multi-agent TypeScript.',
    autoCreate: true,
    policy: 'commercial-permissive',
    sources: [source],
  });
  assert.equal(autoPrepared.created, true);
  assert.equal(localStore.kirov_pack.projectDescription, 'Créer un IDE multi-agent TypeScript.');
  console.log('PASS: automatic project creation from selected sources');

  const fullAutoPrepared = await GitHubSourcePipeline.prepareProject({
    projectDescription: 'Créer une application originale avec les références sélectionnées.',
    autoCreate: false,
    automationMode: 'full-auto',
    policy: 'commercial-permissive',
    sources: [source],
  });
  assert.equal(fullAutoPrepared.pack.state.sourcePipeline.automationMode, 'full-auto');
  assert.equal(fullAutoPrepared.pack.state.codegenApproval.status, 'approved');
  console.log('PASS: mode A/B automation gate selection');
})().catch((error) => { console.error(error); process.exitCode = 1; });
