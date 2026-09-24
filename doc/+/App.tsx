import { useEffect, useState } from 'react';
import { DashboardView } from './features/dashboard/DashboardView';
import { BillingView } from './features/billing/BillingView';
import { TeamView } from './features/team/TeamView';
import { saasService } from './services/saasService';
import type { SaasState } from './types/saas';
export function App() { const [state, setState] = useState<SaasState | null>(null); const [tab, setTab] = useState('dashboard'); useEffect(() => { saasService.getState().then(setState); }, []); if (!state) return <main>Chargement…</main>; const refresh = (promise: Promise<SaasState>) => promise.then(setState); return <main><header><h1>ForgeAI SaaS</h1><nav>{['dashboard', 'billing', 'team'].map((item) => <button key={item} onClick={() => setTab(item)}>{item}</button>)}</nav></header>{tab === 'dashboard' && <DashboardView state={state} />}{tab === 'billing' && <BillingView state={state} onPlan={(id) => refresh(saasService.changePlan(id, 'monthly'))} />}{tab === 'team' && <TeamView state={state} onInvite={() => refresh(saasService.inviteMember('Nouveau membre', 'member@example.com', 'developer'))} onRemove={(id) => refresh(saasService.removeMember(id))} />}</main>; }
