export interface SaasPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  maxUsers: number;
  recommended?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Developer" | "Viewer";
  avatar: string;
  joinedAt: string;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  planName: string;
  customerName?: string;
  customerEmail?: string;
}

export interface SaasState {
  currentPlanId: string;
  billingCycle: "monthly" | "yearly";
  mrr: number;
  arr: number;
  activeUsersCount: number;
  team: TeamMember[];
  invoices: Invoice[];
  usage: {
    apiCalls: number;
    apiLimit: number;
    storageUsedGb: number;
    storageLimitGb: number;
  };
}

export const SAAS_PLANS: SaasPlan[] = [
  {
    id: "starter",
    name: "Starter",
    priceMonthly: 29,
    priceYearly: 290,
    maxUsers: 3,
    features: ["Jusqu'à 3 collaborateurs", "10 000 requêtes API / mois", "Support standard par email", "SSL Dédié & SLA 99.9%"],
  },
  {
    id: "pro",
    name: "Professionnel",
    priceMonthly: 79,
    priceYearly: 790,
    maxUsers: 10,
    recommended: true,
    features: ["Jusqu'à 10 collaborateurs", "100 000 requêtes API / mois", "Support prioritaire 24/7", "Webhooks Stripe & SSO SAML", "Analytics avancés & Export CSV"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: 199,
    priceYearly: 1990,
    maxUsers: 50,
    features: ["Collaborateurs illimités", "Requêtes API illimitées", "Account Manager dédié", "Audit logs & Chiffrement bancaire", "Déploiement sur-mesure sur Cloud privé"],
  },
];

const INITIAL_TEAM: TeamMember[] = [
  { id: "1", name: "Alexandre Martin", email: "alexandre@entreprise.fr", role: "Owner", avatar: "AM", joinedAt: "12 Janvier 2026" },
  { id: "2", name: "Sophie Bernard", email: "sophie.b@entreprise.fr", role: "Admin", avatar: "SB", joinedAt: "03 Février 2026" },
  { id: "3", name: "Thomas Dubois", email: "thomas.dev@entreprise.fr", role: "Developer", avatar: "TD", joinedAt: "18 Mars 2026" },
];

const INITIAL_INVOICES: Invoice[] = [
  { id: "inv-01", number: "FAC-2026-003", date: "01 Septembre 2026", amount: 79.0, status: "paid", planName: "Professionnel", customerName: "Acme Corp", customerEmail: "billing@acme.com" },
  { id: "inv-02", number: "FAC-2026-002", date: "01 Août 2026", amount: 79.0, status: "paid", planName: "Professionnel", customerName: "CyberPulse SAS", customerEmail: "finance@cyberpulse.io" },
  { id: "inv-03", number: "FAC-2026-001", date: "01 Juillet 2026", amount: 29.0, status: "paid", planName: "Starter", customerName: "Studio Orbit", customerEmail: "hello@orbit.design" },
];

export class SaasService {
  private static readonly STORAGE_KEY = "forgeai_saas_state";
  private static listeners: Array<(state: SaasState) => void> = [];

  static subscribe(listener: (state: SaasState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private static notify(state: SaasState): void {
    this.listeners.forEach((l) => l(state));
  }

  static getState(): SaasState {
    if (typeof window === "undefined") return this.getDefaultState();
    try {
      const raw = window.localStorage.getItem(this.STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    const def = this.getDefaultState();
    this.save(def);
    return def;
  }

  private static getDefaultState(): SaasState {
    return {
      currentPlanId: "pro",
      billingCycle: "monthly",
      mrr: 79,
      arr: 948,
      activeUsersCount: 1420,
      team: INITIAL_TEAM,
      invoices: INITIAL_INVOICES,
      usage: {
        apiCalls: 64230,
        apiLimit: 100000,
        storageUsedGb: 14.8,
        storageLimitGb: 50.0,
      },
    };
  }

  static changePlan(planId: string, cycle: "monthly" | "yearly" = "monthly"): SaasState {
    const state = this.getState();
    const plan = SAAS_PLANS.find((p) => p.id === planId) || SAAS_PLANS[1];
    const price = cycle === "monthly" ? plan.priceMonthly : plan.priceYearly / 12;

    state.currentPlanId = planId;
    state.billingCycle = cycle;
    state.mrr = price;
    state.arr = price * 12;

    const newInvoice: Invoice = {
      id: "inv-" + Date.now(),
      number: "FAC-2026-" + String(state.invoices.length + 1).padStart(3, "0"),
      date: "Aujourd'hui",
      amount: cycle === "monthly" ? plan.priceMonthly : plan.priceYearly,
      status: "paid",
      planName: plan.name,
      customerName: "Espace Workspace",
      customerEmail: "admin@saas.io"
    };
    state.invoices = [newInvoice, ...state.invoices];

    this.save(state);
    return state;
  }

  static inviteMember(name: string, email: string, role: TeamMember["role"] = "Developer"): SaasState {
    const state = this.getState();
    const initials = name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const newMember: TeamMember = {
      id: "user-" + Date.now(),
      name,
      email,
      role,
      avatar: initials || "U",
      joinedAt: "À l'instant",
    };

    state.team = [...state.team, newMember];
    this.save(state);
    return state;
  }

  static removeMember(id: string): SaasState {
    const state = this.getState();
    state.team = state.team.filter((m) => m.id !== id);
    this.save(state);
    return state;
  }

  static incrementApiUsage(calls = 100): SaasState {
    const state = this.getState();
    state.usage.apiCalls = Math.min(state.usage.apiLimit, state.usage.apiCalls + calls);
    this.save(state);
    return state;
  }

  private static save(state: SaasState): void {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
      } catch (_) {}
    }
    this.notify(state);
  }
}
