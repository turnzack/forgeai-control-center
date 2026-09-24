import { Metric, SubscriptionPlan, Invoice, TeamMember } from "../types";

export const MOCK_METRICS: Metric[] = [
  {
    id: "mrr",
    label: "Monthly Recurring Revenue (MRR)",
    value: "48 290 €",
    trend: +14.2,
    description: "Croissance nette mensuelle pondérée par le churn",
    history: [32, 35, 38, 41, 44, 48]
  },
  {
    id: "active_subs",
    label: "Abonnements Actifs",
    value: "1 248",
    trend: +8.7,
    description: "Comptes Pro & Entreprise en production",
    history: [890, 950, 1020, 1140, 1248]
  },
  {
    id: "churn_rate",
    label: "Taux de Churn",
    value: "1.42 %",
    trend: -0.3,
    description: "Attrition mensuelle en baisse continue",
    history: [2.1, 1.9, 1.8, 1.6, 1.42]
  },
  {
    id: "arpu",
    label: "Revenu Moyen par Compte (ARPU)",
    value: "38.70 €",
    trend: +5.1,
    description: "Augmentation tirée par les add-ons d'équipe",
    history: [34, 35, 36, 37.5, 38.7]
  }
];

export const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: "starter",
    name: "Starter",
    priceMonthly: 29,
    priceYearly: 290,
    features: ["Jusqu'à 3 membres d'équipe", "Analytics standards", "Export CSV", "Support par email"],
    activeUsers: 340
  },
  {
    id: "pro",
    name: "Pro Scaling",
    priceMonthly: 79,
    priceYearly: 790,
    features: ["Membres d'équipe illimités", "Analytics temps réel & Webhooks", "Multi-tenant & Audit Log", "Support prioritaire 24/7"],
    recommended: true,
    activeUsers: 780
  },
  {
    id: "enterprise",
    name: "Entreprise",
    priceMonthly: 249,
    priceYearly: 2490,
    features: ["SLA garanti 99.99%", "Déploiement VPC / On-Premise", "Gestionnaire de compte dédié", "Clés API avec rotation"],
    activeUsers: 128
  }
];

export const MOCK_INVOICES: Invoice[] = [
  { id: "inv-101", number: "INV-2026-001", amount: 79.00, status: "paid", date: "2026-09-15", customerName: "Acme Corp", customerEmail: "billing@acme.com" },
  { id: "inv-102", number: "INV-2026-002", amount: 249.00, status: "paid", date: "2026-09-18", customerName: "CyberPulse SAS", customerEmail: "finance@cyberpulse.io" },
  { id: "inv-103", number: "INV-2026-003", amount: 29.00, status: "pending", date: "2026-09-21", customerName: "Studio Orbit", customerEmail: "hello@orbit.design" },
  { id: "inv-104", number: "INV-2026-004", amount: 79.00, status: "paid", date: "2026-09-22", customerName: "FinTech Cloud", customerEmail: "accounts@fintechcloud.com" }
];

export const MOCK_TEAM: TeamMember[] = [
  { id: "u-1", name: "Alexandre Dupont", email: "alex@company.com", role: "Owner", avatar: "AD" },
  { id: "u-2", name: "Sarah Kaci", email: "sarah@company.com", role: "Admin", avatar: "SK" },
  { id: "u-3", name: "Marc Tessier", email: "marc@company.com", role: "Developer", avatar: "MT" }
];
