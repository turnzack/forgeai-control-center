> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé dans le B2B SaaS (Software as a Service) et les architectures Cloud scalables.
> Ce document est le PRD (Product Requirements Document) du **PACK SAAS MASTER SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Visionnaire, Moderne et Monétisable (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 📦 PACK SAAS MASTER (L'Architecture de Monétisation)

Ce pack force la création des piliers vitaux de toute entreprise SaaS : La sécurité (Auth), l'argent (Billing) et la visualisation de données (Analytics). L'objectif est de générer une plateforme multi-tenant prête à accueillir des milliers d'utilisateurs payants.

---

## 🎯 1. Les Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les 3 piliers (Missions) que tu peux câbler et générer :

### 🔐 1. Auth Gateway (Portail de Sécurité)
**Mission :** Gérer l'entrée sécurisée de l'application SaaS (inviolable, élégante et multi-tenant).
**Design Requis :** Page de login de type "Split-Screen" (Formulaire minimaliste à gauche, visuel de la marque ou témoignage client à droite).
**Composants à générer :** `LoginForm.tsx`, `SignupForm.tsx`, `AuthPage.tsx`
**Métier :** Hooks d'authentification (`useAuth.ts`), service d'API (`auth.service.ts`), rôles (Admin, Member).

### 💳 2. Billing & Stripe (La Monétisation)
**Mission :** Gestion des abonnements SaaS, des paiements récurrents et des notifications Push.
**Design Requis :** Grille de tarification (Pricing Table) avec "Toggle" Mensuel/Annuel et mise en valeur du plan le plus rentable (Plan "Pro" au centre avec ombre portée et ruban "Populaire").
**Composants à générer :** `PricingTable.tsx`, `NotificationBanner.tsx`
**Métier :** Intégration API Stripe (`stripe.ts`), gestion de l'état de l'abonnement (`useSubscription.ts`).

### 📊 3. Dashboard Analytics (La Valeur Client)
**Mission :** Visualisation de données complexes en temps réel pour une prise de décision rapide.
**Design Requis :** Grille (Bento) de statistiques (KPI Cards en haut) et larges graphiques interactifs en dessous avec sélecteurs temporels (7j, 30j, 1 an).
**Composants à générer :** `AnalyticsChart.tsx`, `StatsGrid.tsx`, `Dashboard.tsx`
**Métier :** Scripts d'exportation de données (`export-data.ts`).

---

## 🎨 2. Vision UI/UX & Design System SaaS
* **Directives pour Stitch :** Un SaaS doit inspirer la confiance absolue. Le design doit être ultra-propre : ombres douces (Drop shadows très légères), bordures fines (`border-slate-200`), et couleurs de marque concentrées uniquement sur les boutons d'action (Primary CTA).
* **Navigation :** Sidebar fixe contenant les paramètres de l'entreprise (Workspace), la facturation et le profil de l'utilisateur.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi un logiciel SaaS pour analyser les données de ventes avec Stripe intégré", tu dois immédiatement mobiliser l'Auth Gateway pour bloquer l'accès, le Dashboard Analytics pour afficher la valeur, et la page Billing pour qu'il puisse faire payer ses clients.*

[INSTRUCTION IA]
Génère l'interface d'une application SaaS B2B complète :
- Une page de connexion élégante protégeant l'accès à la plateforme.
- Une navigation (Sidebar) incluant un "Tenant Switcher" (Sélecteur d'entreprise).
- Une page Dashboard affichant 4 KPI Cards (MRR, Churn, Active Users) et un graphique en ligne principal.
- Une page "Settings / Facturation" incluant une Pricing Table fonctionnelle avec toggle Annuel/Mensuel.
- Hooks personnalisés : `useAuth()`, `useSubscription()`.

[STRUCTURE REQUISE]
- `src/features/saas/pages/AuthPage.tsx`
- `src/features/saas/pages/DashboardPage.tsx`
- `src/features/saas/pages/BillingSettings.tsx`
- `src/features/saas/components/PricingTable.tsx`
- `src/features/saas/components/AnalyticsChart.tsx`
- `src/features/saas/hooks/useAuth.ts`
- `src/features/saas/hooks/useSubscription.ts`
- `src/shared/types/saas.ts` (interfaces User, Tenant, Subscription)