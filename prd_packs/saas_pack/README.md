> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en SaaS B2B, Multi-Tenancy et Architectures Monétisées.
> Ce document est le PRD (Product Requirements Document) du **PACK SAAS SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Monétisable et Scalable (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 🚀 PACK SAAS (Architecture Multi-Tenants & Billing)

Ce pack fusionne les concepts de Multi-Tenants (Plusieurs entreprises sur la même base de code) et de facturation (Billing). C'est le cœur d'une application B2B.

---

## 🎯 La Mission Principale (Plateforme SaaS)

**Mission :** Générer les fondations d'un logiciel vendu sous forme d'abonnement.
Il faut isoler les données des entreprises (Workspaces) et gérer les barrières de paiement (Paywalls).

### 🧩 Core Features Architecturaux Requis :
1. **Workspace Switcher :** Menu déroulant permettant à un utilisateur d'appartenir à plusieurs équipes ("Mon Entreprise A", "Agence B") et de passer de l'une à l'autre.
2. **Facturation Complexe (Billing) :** Vue gérant la facturation basée sur l'usage (ex: Prix = 10$ + 0.10$ par email envoyé) avec gestion des Add-ons.
3. **Roles & Invitations :** Interface permettant d'inviter un collaborateur via email (Admin, Éditeur, Lecteur).

---

## 🎨 Vision UI/UX & Design System SaaS
* **Directives pour Stitch :** Les logiciels SaaS privilégient la clarté. Utilise un design en mode "Layout Dashboard" (Sidebar + Header de contexte). 
* **Paywalls :** Lorsqu'un utilisateur essaie de cliquer sur une fonctionnalité "Pro", affiche une modale élégante expliquant pourquoi il doit upgrader.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi un SaaS pour les agences web", implémente immédiatement le Workspace Switcher.*

[INSTRUCTION IA]
Génère une architecture SaaS Multi-Tenant :
- Contexte React (`WorkspaceProvider`) qui enveloppe l'application pour maintenir l'ID de l'entreprise active dans l'URL (ex: `/org/123/dashboard`).
- Intercepteurs pour injecter cet ID dans les requêtes futures.
- Tableaux de gestion d'équipe et des quotas.

[STRUCTURE REQUISE]
- `src/core/saas/contexts/WorkspaceContext.tsx`
- `src/core/saas/components/WorkspaceSelector.tsx`
- `src/core/saas/components/TeamInviteModal.tsx`
- `src/core/saas/pages/BillingDashboard.tsx`