#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createHash } from 'node:crypto';

const run = promisify(execFile);
const argv = process.argv.slice(2);
const option = (name, fallback = undefined) => {
  const index = argv.indexOf(`--${name}`);
  return index >= 0 ? argv[index + 1] ?? true : fallback;
};
const archive = option('archive');
const output = path.resolve(String(option('out', './generated-projects/saas-pack')));
const pack = String(option('pack', 'saas'));
const maxModules = Number(option('max-modules', 100));

if (!archive) {
  console.error('Usage: node tools/forge-pipeline.mjs --archive ./source.zip --out ./generated-projects/my-saas --pack saas');
  process.exit(2);
}

const excluded = [
  /(^|\\|\/)node_modules($|\\|\/)/i, /(^|\\|\/)(dist|out|build|coverage|\.next)($|\\|\/)/i,
  /(^|\\|\/)(\.env|\.env\.|id_rsa|.*\.pem$)/i, /(^|\\|\/)(\.git|\.cache)($|\\|\/)/i,
  /\.(png|jpe?g|gif|webp|mp4|mov|zip|rar|7z|woff2?|ttf|ico)$/i
];
const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.md']);
const roleKeywords = [
  ['ui', /component|components|ui|button|card|modal|input|table|layout/i],
  ['hook', /hook|use[A-Z]/],
  ['service', /service|api|client|repository|adapter/i],
  ['store', /store|state|context|reducer/i],
  ['model', /type|schema|model|contract/i]
];
const businessKeywords = pack === 'saas'
  ? [/saas|billing|subscription|invoice|plan|team|member|organization|tenant|usage|dashboard|stripe/i]
  : [new RegExp(pack, 'i')];
const secretPattern = /(sk_live_|sk_test_|api[_-]?key\s*[:=]|secret\s*[:=]|password\s*[:=]|bearer\s+[a-z0-9._-]{20,})/i;

async function exists(file) { try { await fs.access(file); return true; } catch { return false; } }
async function walk(dir, base = dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    const relative = path.relative(base, absolute).split(path.sep).join('/');
    if (entry.isDirectory()) result.push(...await walk(absolute, base));
    else result.push({ absolute, relative });
  }
  return result;
}
async function sha256(file) {
  const data = await fs.readFile(file);
  return createHash('sha256').update(data).digest('hex');
}
function scoreFile(file, text) {
  const extension = path.extname(file.relative).toLowerCase();
  const lines = text.split(/\r?\n/).length;
  let score = 0;
  const reasons = [];
  if (extension === '.ts' || extension === '.tsx') { score += 10; reasons.push('typescript'); }
  if (lines >= 40 && lines <= 500) { score += 10; reasons.push('atomic-size'); }
  if (/\.test\.|\.spec\.|__tests__/i.test(file.relative)) { score += 5; reasons.push('test-associated'); }
  if (businessKeywords.some((pattern) => pattern.test(file.relative) || pattern.test(text))) { score += 15; reasons.push('prd-match'); }
  if (roleKeywords.some(([, pattern]) => pattern.test(file.relative))) { score += 10; reasons.push('recognised-role'); }
  if (secretPattern.test(text)) return { score: -50, decision: 'exclude', reasons: ['secret-detected'] };
  return { score, decision: score >= 15 ? 'adapt' : 'exclude', reasons };
}
function detectRole(file) {
  return roleKeywords.find(([, pattern]) => pattern.test(file.relative))?.[0] ?? 'unknown';
}
async function extractArchive(input, destination) {
  const extension = path.extname(input).toLowerCase();
  if (extension === '.zip') await run('unzip', ['-q', input, '-d', destination]);
  else if (extension === '.rar') await run('unrar', ['x', '-idq', input, destination]);
  else throw new Error('Format non supporté. Utilisez une archive .zip ou .rar.');
}
async function copyWithProvenance(source, target, record) {
  const content = await fs.readFile(source, 'utf8');
  const header = `/**\n * @provenance\n * Source archive : ${record.archive}\n * Chemin source  : ${record.sourcePath}\n * SHA-256       : ${record.sha256}\n * Adaptation    : ForgeAI Studio Component Adapter\n * Date          : ${record.adaptedAt}\n */\n\n`;
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, `${header}${content}`, 'utf8');
}
async function write(file, content) { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, content, 'utf8'); }

const workdir = await fs.mkdtemp(path.join(os.tmpdir(), 'forgeai-pipeline-'));
try {
  await extractArchive(path.resolve(archive), workdir);
  const allFiles = await walk(workdir);
  const inventory = [];
  const candidates = [];
  for (const file of allFiles) {
    const stat = await fs.stat(file.absolute);
    const record = { path: file.relative, bytes: stat.size, extension: path.extname(file.relative), excluded: excluded.some((pattern) => pattern.test(file.relative)) };
    if (!record.excluded && sourceExtensions.has(record.extension.toLowerCase())) {
      const text = await fs.readFile(file.absolute, 'utf8');
      const result = scoreFile(file, text);
      record.lines = text.split(/\r?\n/).length;
      record.hash = await sha256(file.absolute);
      record.role = detectRole(file);
      record.score = result.score;
      record.decision = result.decision;
      record.reasons = result.reasons;
      if (result.decision === 'adapt') candidates.push({ ...record, absolute: file.absolute });
    } else record.decision = 'exclude';
    inventory.push(record);
  }
  candidates.sort((a, b) => b.score - a.score || a.path.localeCompare(b.path));
  const selected = candidates.slice(0, maxModules);
  await fs.rm(output, { recursive: true, force: true });
  await run(process.execPath, [path.resolve(new URL('./generate-project.mjs', import.meta.url).pathname), '--mode', 'fullstack-production', '--out', output, '--name', path.basename(output)]);

  const integrationRoot = path.join(output, 'apps/web/src/integrations/github-adapted');
  const manifest = [];
  for (const item of selected) {
    const safeName = item.path.replace(/[^a-zA-Z0-9._/-]/g, '_');
    const target = path.join(integrationRoot, safeName);
    const provenance = { archive: path.basename(archive), sourcePath: item.path, sha256: item.hash, adaptedAt: new Date().toISOString() };
    await copyWithProvenance(item.absolute, target, provenance);
    manifest.push({ id: safeName, role: item.role, score: item.score, sourcePath: item.path, targetPath: path.relative(output, target).split(path.sep).join('/'), sha256: item.hash, reasons: item.reasons });
  }

  const sourceRoot = path.join(output, 'apps/web/src');
  await write(path.join(sourceRoot, 'integrations/index.ts'), `export const NATIVE_MODULE_MANIFEST = ${JSON.stringify(manifest, null, 2)} as const;\nexport const MOUNTED_MANIFEST = NATIVE_MODULE_MANIFEST.filter((module) => module.score >= 15);\n`);
  await write(path.join(sourceRoot, 'services/adapters/ISaasStorageAdapter.ts'), `import type { SaasState, TeamMember } from '@forgeai/contracts';\n\nexport interface ISaasStorageAdapter {\n  getState(): Promise<SaasState>;\n  changePlan(planId: string, cycle: 'monthly' | 'yearly'): Promise<SaasState>;\n  inviteMember(name: string, email: string, role: TeamMember['role']): Promise<SaasState>;\n  removeMember(id: string): Promise<SaasState>;\n}\n`);
  await write(path.join(output, 'packages/contracts/src/saas.ts'), `import { z } from 'zod';\n\nexport const planIdSchema = z.enum(['starter', 'pro', 'enterprise']);\nexport const roleSchema = z.enum(['owner', 'admin', 'developer', 'viewer']);\nexport const saasStateSchema = z.object({ currentPlanId: planIdSchema, billingCycle: z.enum(['monthly', 'yearly']), mrr: z.number(), arr: z.number(), activeUsersCount: z.number(), team: z.array(z.object({ id: z.string(), name: z.string(), email: z.string().email(), role: roleSchema })), invoices: z.array(z.object({ id: z.string(), number: z.string(), amount: z.number(), status: z.enum(['paid', 'pending', 'failed']) })), usage: z.object({ apiCalls: z.number(), apiLimit: z.number(), storageUsedGb: z.number(), storageLimitGb: z.number() }) });\nexport type SaasState = z.infer<typeof saasStateSchema>;\nexport type TeamMember = SaasState['team'][number];\n`);
  await write(path.join(output, 'apps/web/src/types/saas.ts'), `export type PlanId = 'starter' | 'pro' | 'enterprise';\nexport type Role = 'owner' | 'admin' | 'developer' | 'viewer';\nexport type TeamMember = { id: string; name: string; email: string; role: Role };\nexport type SaasState = { currentPlanId: PlanId; billingCycle: 'monthly' | 'yearly'; mrr: number; arr: number; activeUsersCount: number; team: TeamMember[]; invoices: { id: string; number: string; amount: number; status: 'paid' | 'pending' | 'failed' }[]; usage: { apiCalls: number; apiLimit: number; storageUsedGb: number; storageLimitGb: number } };\n`);
  await write(path.join(output, 'apps/web/src/services/adapters/ISaasStorageAdapter.ts'), `import type { SaasState, TeamMember } from '../../types/saas';\n\nexport interface ISaasStorageAdapter {\n  getState(): Promise<SaasState>;\n  changePlan(planId: string, cycle: 'monthly' | 'yearly'): Promise<SaasState>;\n  inviteMember(name: string, email: string, role: TeamMember['role']): Promise<SaasState>;\n  removeMember(id: string): Promise<SaasState>;\n}\n`);
  await write(path.join(output, 'apps/web/src/services/local-storage/LocalStorageSaasAdapter.ts'), `import type { ISaasStorageAdapter } from '../adapters/ISaasStorageAdapter';\nimport type { SaasState, TeamMember } from '../../types/saas';\nconst key = 'forgeai_generated_saas_state';\nconst initial: SaasState = { currentPlanId: 'pro', billingCycle: 'monthly', mrr: 79, arr: 948, activeUsersCount: 1420, team: [{ id: 'owner', name: 'Alexandre Martin', email: 'alexandre@entreprise.fr', role: 'owner' }], invoices: [{ id: 'inv-1', number: 'FAC-2026-001', amount: 79, status: 'paid' }], usage: { apiCalls: 64230, apiLimit: 100000, storageUsedGb: 14.8, storageLimitGb: 50 } };\nconst read = () => { try { return JSON.parse(localStorage.getItem(key) ?? 'null') as SaasState | null; } catch { return null; } };\nconst save = (state: SaasState) => localStorage.setItem(key, JSON.stringify(state));\nexport class LocalStorageSaasAdapter implements ISaasStorageAdapter {\n  async getState() { const state = read() ?? initial; save(state); return state; }\n  async changePlan(planId: string, cycle: 'monthly' | 'yearly') { const state = await this.getState(); const monthly = planId === 'starter' ? 29 : planId === 'enterprise' ? 199 : 79; const next = { ...state, currentPlanId: planId as SaasState['currentPlanId'], billingCycle: cycle, mrr: cycle === 'monthly' ? monthly : Math.round((monthly * 10) / 12), arr: cycle === 'monthly' ? monthly * 12 : monthly * 10 }; save(next); return next; }\n  async inviteMember(name: string, email: string, role: TeamMember['role']) { const state = await this.getState(); const next = { ...state, team: [...state.team, { id: crypto.randomUUID(), name, email, role }] }; save(next); return next; }\n  async removeMember(id: string) { const state = await this.getState(); const next = { ...state, team: state.team.filter((member) => member.id !== id) }; save(next); return next; }\n}\n`);
  await write(path.join(output, 'apps/web/src/services/saasService.ts'), `import { LocalStorageSaasAdapter } from './local-storage/LocalStorageSaasAdapter';\nimport type { ISaasStorageAdapter } from './adapters/ISaasStorageAdapter';\nexport const saasService: ISaasStorageAdapter = new LocalStorageSaasAdapter();\n`);
  await write(path.join(output, 'apps/web/src/features/dashboard/DashboardView.tsx'), `import type { SaasState } from '../../types/saas';\nexport function DashboardView({ state }: { state: SaasState }) { return <section><h2>Dashboard</h2><div className="grid"><article><strong>MRR</strong><b>€{state.mrr.toFixed(2)}</b></article><article><strong>ARR</strong><b>€{state.arr.toFixed(2)}</b></article><article><strong>Utilisateurs actifs</strong><b>{state.activeUsersCount}</b></article><article><strong>API</strong><b>{state.usage.apiCalls.toLocaleString()} / {state.usage.apiLimit.toLocaleString()}</b></article></div></section>; }\n`);
  await write(path.join(output, 'apps/web/src/features/billing/BillingView.tsx'), `import type { SaasState } from '../../types/saas';\nexport function BillingView({ state, onPlan }: { state: SaasState; onPlan: (id: string) => void }) { return <section><h2>Billing</h2><p>Plan actif : <strong>{state.currentPlanId}</strong></p><div className="grid">{['starter', 'pro', 'enterprise'].map((plan) => <button key={plan} className="card" onClick={() => onPlan(plan)}>Passer à {plan}</button>)}</div><h3>Factures</h3><ul>{state.invoices.map((invoice) => <li key={invoice.id}>{invoice.number} — €{invoice.amount} — {invoice.status}</li>)}</ul></section>; }\n`);
  await write(path.join(output, 'apps/web/src/features/team/TeamView.tsx'), `import type { SaasState } from '../../types/saas';\nexport function TeamView({ state, onInvite, onRemove }: { state: SaasState; onInvite: () => void; onRemove: (id: string) => void }) { return <section><h2>Équipe</h2><button onClick={onInvite}>Inviter un membre de démonstration</button><ul>{state.team.map((member) => <li key={member.id}>{member.name} — {member.role} <button onClick={() => onRemove(member.id)}>Retirer</button></li>)}</ul></section>; }\n`);
  await write(path.join(output, 'apps/web/src/App.tsx'), `import { useEffect, useState } from 'react';\nimport { DashboardView } from './features/dashboard/DashboardView';\nimport { BillingView } from './features/billing/BillingView';\nimport { TeamView } from './features/team/TeamView';\nimport { saasService } from './services/saasService';\nimport type { SaasState } from './types/saas';\nexport function App() { const [state, setState] = useState<SaasState | null>(null); const [tab, setTab] = useState('dashboard'); useEffect(() => { saasService.getState().then(setState); }, []); if (!state) return <main>Chargement…</main>; const refresh = (promise: Promise<SaasState>) => promise.then(setState); return <main><header><h1>ForgeAI SaaS</h1><nav>{['dashboard', 'billing', 'team'].map((item) => <button key={item} onClick={() => setTab(item)}>{item}</button>)}</nav></header>{tab === 'dashboard' && <DashboardView state={state} />}{tab === 'billing' && <BillingView state={state} onPlan={(id) => refresh(saasService.changePlan(id, 'monthly'))} />}{tab === 'team' && <TeamView state={state} onInvite={() => refresh(saasService.inviteMember('Nouveau membre', 'member@example.com', 'developer'))} onRemove={(id) => refresh(saasService.removeMember(id))} />}</main>; }\n`);
  await write(path.join(output, 'apps/web/src/main.tsx'), `import { createRoot } from 'react-dom/client';\nimport { App } from './App';\nimport './styles.css';\ncreateRoot(document.getElementById('root')!).render(<App />);\n`);
  await write(path.join(output, 'apps/web/src/styles.css'), `:root { font-family: Inter, system-ui, sans-serif; color: #e8eefc; background: #0b1020; } body { margin: 0; } main { max-width: 1100px; margin: auto; padding: 3rem; } header { display: flex; align-items: center; justify-content: space-between; gap: 2rem; } nav, .grid { display: flex; gap: 1rem; flex-wrap: wrap; } button, .card, article { border: 1px solid #33415f; border-radius: 12px; background: #121b31; color: inherit; padding: .8rem 1rem; cursor: pointer; } article { display: grid; gap: .5rem; min-width: 150px; } article b { font-size: 1.5rem; } section { margin-top: 3rem; } li { margin: .8rem 0; }\n`);
  await write(path.join(output, 'apps/web/src/features/README.md'), `# Business feature wiring\n\nGenerated pack: ${pack}\n\nEnabled domains:\n- dashboard: KPIs, MRR, ARR and usage\n- billing: plans, subscriptions and invoices\n- team: members, roles and invitations\n\nEach future screen must consume ISaasStorageAdapter rather than localStorage directly.\n`);
  await write(path.join(output, 'INVENTORY.json'), JSON.stringify({ archive: path.basename(archive), pack, generatedAt: new Date().toISOString(), files: inventory }, null, 2));
  await write(path.join(output, 'CANDIDATES.json'), JSON.stringify({ maxModules, selected: manifest, excludedCount: inventory.length - candidates.length }, null, 2));
  await write(path.join(output, 'PROVENANCE_REPORT.md'), `# Provenance report\n\nArchive: \`${path.basename(archive)}\`\n\nSelected modules: ${manifest.length}\n\n| Module | Role | Score | Source |\n|---|---|---:|---|\n${manifest.map((item) => `| \`${item.id}\` | ${item.role} | ${item.score} | \`${item.sourcePath}\` |`).join('\n')}\n`);
  await write(path.join(output, 'THIRD_PARTY_NOTICES.md'), `# Third-party notices\n\nThis report was generated from the audited archive manifest. Review each licence before public distribution.\n\n${manifest.map((item) => `- ${item.sourcePath}: licence metadata required`).join('\n')}\n`);
  console.log(JSON.stringify({ ok: true, archive: path.resolve(archive), output, inventory: inventory.length, selected: selected.length, excluded: inventory.length - selected.length }, null, 2));
} finally {
  await fs.rm(workdir, { recursive: true, force: true });
}
