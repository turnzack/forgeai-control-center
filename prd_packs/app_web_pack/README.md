> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé dans les Web Applications (SaaS, Outils de productivité, Dashboards). 
> Ce document est le PRD (Product Requirements Document) du **PACK APP WEB SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Visionnaire, Moderne et Ultra-Optimisée (UI/UX)**, conçue pour un usage professionnel et intensif, tout en respectant strictement les règles métier ci-dessous.

# 🚀 PACK APP WEB (Fondations d'Applications Modernes)

Ce pack force la création des fondations structurelles incontournables pour toute Web App d'envergure. Des pages d'authentification scindées aux tableaux Kanban, ce pack garantit une ergonomie "Desktop-Class" au sein du navigateur.

---

## 🎯 1. Les 10 Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les 10 briques métiers (Missions) que tu peux câbler et générer :

### 📊 1. Dashboard Starter (`tmpl_app_dashboard_starter`)
**Mission :** Tableau de bord générique pour application métier.
**Design Requis :** Layout professionnel avec des "Cards" de métriques rapides (3 à 4 cartes de KPI en haut).
**Composants à générer :** `DashboardShell.tsx`, `StatsRow.tsx`

### 🔐 2. Page d'Authentification (Split Layout) (`tmpl_app_auth_split`)
**Mission :** Template de page de connexion / inscription haut de gamme.
**Design Requis :** "Split Screen" (Écran divisé en deux) : d'un côté un Hero visuel ou une citation inspirante, de l'autre le formulaire de login épuré.
**Composants à générer :** `AuthSplitLayout.tsx`, `AuthSidePanel.tsx`

### ⚙️ 3. Centre de Paramètres (`tmpl_app_settings_center`)
**Mission :** Page de configuration utilisateur et préférences.
**Design Requis :** Navigation par onglets (Tabs) sur la gauche ou le haut, sections encadrées dans des "Cards" claires pour la sécurité, la facturation, etc.
**Composants à générer :** `SettingsTabs.tsx`, `SettingsCard.tsx`

### 🔔 4. Centre de Notifications (`tmpl_app_notifications_center`)
**Mission :** Boîte de réception globale des alertes (Notifications).
**Design Requis :** "Three-pane layout" (Architecture à 3 panneaux) façon client e-mail moderne ou Slack.
**Composants à générer :** `NotificationList.tsx`, `NotificationDetail.tsx`

### 👤 5. Profil Public (`tmpl_app_profile_public`)
**Mission :** Page de profil visible publiquement pour un utilisateur (réseaux sociaux, biographie, statistiques).
**Design Requis :** Header riche en haut (Bannière + Avatar superposé) suivi de cartes de contenu.
**Composants à générer :** `ProfileHeader.tsx`, `ProfileStats.tsx`

### 📥 6. Layout Inbox / Messagerie (`tmpl_app_inbox_layout`)
**Mission :** Interface d'application style boîte mail ou CRM.
**Design Requis :** Sidebar de dossiers + Liste de fils de discussion (Thread list) + Panneau de détail du message à droite.
**Composants à générer :** `InboxShell.tsx`, `ThreadList.tsx`

### 📋 7. Tableau Kanban (`tmpl_app_kanban_board`)
**Mission :** Application de productivité et de gestion de projet.
**Design Requis :** Colonnes interactives avec gestion de glisser-déposer (Drag-and-Drop) pour des cartes de tâches.
**Composants à générer :** `KanbanColumn.tsx`, `TaskCard.tsx`

### ⏱️ 8. To-Do Minimaliste (`tmpl_app_todo_minimal`)
**Mission :** Application de liste de tâches centrée sur la concentration.
**Design Requis :** Interface mono-colonne ultra épurée. Focus maximal sur l'UX de saisie (validation par Entrée, suppression rapide).
**Composants à générer :** `TodoList.tsx`, `TodoItem.tsx`

### 📓 9. Éditeur de Notes (`tmpl_app_notes_editor`)
**Mission :** Application de prise de notes structurées (Style Notion ou Obsidian "Light").
**Design Requis :** Barre latérale (Sidebar) pour l'arborescence, et zone d'édition par blocs (Blocks).
**Composants à générer :** `NoteBlock.tsx`, `NoteSidebar.tsx`

### 📅 10. Vue Calendrier (`tmpl_app_calendar_view`)
**Mission :** Interface d'agenda et de planification de temps.
**Design Requis :** Grille de calendrier avec toggle pour basculer de "Mois" à "Semaine". Popover au clic sur un événement.
**Composants à générer :** `CalendarShell.tsx`, `EventPopover.tsx`

---

## 🎨 2. Vision UI/UX & Design System Global pour les Web Apps
* **Directives pour Stitch :** Les Web Apps professionnelles nécessitent une **densité d'information maîtrisée**. Utilise des bordures discrètes (`border-slate-200` / `dark:border-slate-800`), des fonds gris très légers pour contraster avec des cartes blanches pures. 
* **Typographie :** Utilise des polices très lisibles (Inter, Roboto) avec une hiérarchie stricte. Les titres doivent être sobres.
* **Micro-interactions :** Ajoute des états de "Hover" subtils sur toutes les lignes de tableaux, les tâches Kanban ou les notifications pour encourager le clic.

## ⚙️ 3. Directives de Câblage (VFS)
*Chacun de ces composants doit être typé de manière stricte (TypeScript). Pour les composants complexes comme le Drag-and-Drop (Kanban) ou l'Éditeur de Blocs, prévois une architecture d'état solide (ex: Context API, Redux, ou Zustand).*

---
### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Lorsque l'utilisateur sélectionnera ce pack "App Web" dans l'interface, tu dois identifier sa demande et piocher dans ces briques. Par exemple, s'il demande "Fais moi une app de gestion de projet", tu devras immédiatement associer `tmpl_app_auth_split` + `tmpl_app_kanban_board` + `tmpl_app_settings_center` pour lui offrir un produit fini d'exception, prêt à la production.*