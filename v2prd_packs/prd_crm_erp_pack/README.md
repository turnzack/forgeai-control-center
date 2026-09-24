> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé dans les logiciels d'entreprise, les B2B SaaS, CRM et ERP.
> Ce document est le PRD (Product Requirements Document) du **PACK CRM & ERP SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Visionnaire, Data-Heavy et Ultra-Optimisée (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 🏢 PACK CRM & ERP (Gestion d'Entreprise)

Ce pack force la création d'interfaces d'administration complexes (Admin Dashboards), capables de gérer d'énormes quantités de données sans perdre en fluidité. La priorité est la densité d'information, les filtres avancés, et les actions en masse (Bulk actions).

---

## 🎯 La Mission Principale (CRM Contact Manager)

**Mission :** Gestion centralisée des relations clients avec historique complet et segmentation métier.
Le logiciel généré doit être un véritable outil de travail quotidien pour des équipes de vente (Sales) ou de support, similaire à Salesforce, Hubspot ou Linear.

### 🧩 Core Features Architecturaux Requis :
1. **Base de données Contacts & Entreprises :** Tableaux de données (DataTables) avec tri par colonnes, pagination et recherche en temps réel.
2. **Historique d'activités (Timeline) :** Un journal détaillé pour chaque contact traçant les appels, emails, et notes ajoutées.
3. **Tags et Filtres avancés :** Système de tags colorés et filtres combinables (ex: "Clients VIP" AND "Inactifs depuis 30 jours").
4. **Import / Export :** Boutons d'actions globales pour la manipulation de données (Excel / CSV).

---

## 🎨 Vision UI/UX & Design System Global (Entreprise)
* **Directives pour Stitch :** Les logiciels d'entreprise nécessitent un design "Data-Heavy". Le padding doit être réduit (ex: `px-2 py-1` dans les tableaux) pour afficher le maximum de lignes à l'écran.
* **Composants d'Interaction :** Utilise des menus déroulants (Dropdowns) sophistiqués, des popovers pour l'édition rapide (Inline editing) au lieu d'ouvrir de lourdes pages, et des Modales (Dialogs) pour les créations d'entités.
* **Design :** Sidebar fixe à gauche pour la navigation globale (Dashboard, Contacts, Entreprises, Paramètres).

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande à créer un CRM, tu dois te baser sur cette architecture stricte et générer les composants suivants pour assurer la scalabilité.*

[INSTRUCTION IA]
Génère l'interface d'un CRM B2B de niveau production :
- Tableau de bord principal avec statistiques de ventes/contacts.
- Grille/Tableau des contacts complexe (avec avatars, tags, rôles, boutons d'action rapide).
- Panneau latéral (Slide-over / Drawer) pour visualiser les détails d'un contact sans quitter la liste.
- Gestion de l'état des contacts via React Context ou un Store global.
- Hooks personnalisés : `useContacts()`, `useFilters()`.
- Données mock réalistes (minimum 15 contacts générés pour prouver le design data-heavy).

[STRUCTURE REQUISE]
- `src/features/crm/pages/CrmDashboard.tsx`
- `src/features/crm/pages/ContactList.tsx`
- `src/features/crm/components/ContactDataTable.tsx`
- `src/features/crm/components/ContactDetailDrawer.tsx`
- `src/features/crm/components/ActivityTimeline.tsx`
- `src/features/crm/hooks/useContacts.ts`
- `src/features/crm/api/crm.ts`
- `src/shared/types/crm.ts` (interfaces Contact, Activity, Tag)