> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Monétisation B2B et Systèmes de Facturation.
> Ce document est le PRD (Product Requirements Document) du **PACK SAAS BILLING PRO SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface de Facturation Transparente et Sécurisée (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 🧾 PACK SAAS BILLING PRO (Facturation Avancée)

Ce pack force la création d'interfaces de gestion financière (façon Stripe Customer Portal). C'est le centre de contrôle où le client gère son argent, ses factures et ses limites d'usage.

---

## 🎯 La Mission Principale (Gestion Financière B2B)

**Mission :** Générer un portail client sécurisé pour la gestion des abonnements, des factures et des moyens de paiement.
L'interface doit être austère, inspirer la confiance, et éviter tout jargon inutile.

### 🧩 Core Features Architecturaux Requis :
1. **Plan Actuel (Current Plan) :** Widget montrant l'abonnement en cours, la date du prochain prélèvement, et un bouton "Upgrade/Downgrade".
2. **Usage & Limites (Usage-based billing) :** Barres de progression montrant l'utilisation des quotas du mois (ex: "8 400 / 10 000 Emails envoyés").
3. **Historique des Factures :** Tableau listant les factures passées avec statuts (Payée, Échouée) et bouton de téléchargement PDF.
4. **Moyens de Paiement :** Liste des cartes bancaires sauvegardées (masquées: `**** **** **** 4242`) avec option de modification.

---

## 🎨 Vision UI/UX & Design System Billing
* **Directives pour Stitch :** Aucune couleur criarde. Utilise des nuances de gris, du texte noir, et du vert/rouge uniquement pour les statuts (Succès/Échec).
* **Sécurité Perçue :** Ajoute des icônes de cadenas et mentionne clairement les prestataires (Powered by Stripe / SSL Secured).

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée une page pour que mes clients voient leurs factures", utilise ce layout sécurisé.*

[INSTRUCTION IA]
Génère une architecture de Facturation SaaS :
- Interfaces tabulaires strictes (DataTables) pour les factures.
- Gestion des états complexes d'abonnement (Past Due, Canceled, Trialling).
- Modales de confirmation drastiques avant d'annuler un abonnement (Churn prevention).

[STRUCTURE REQUISE]
- `src/features/billing/pages/BillingPortal.tsx`
- `src/features/billing/components/CurrentPlanCard.tsx`
- `src/features/billing/components/UsageProgress.tsx`
- `src/features/billing/components/InvoiceTable.tsx`