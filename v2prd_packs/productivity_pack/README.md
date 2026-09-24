> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé dans les applications de Productivité et d'Organisation.
> Ce document est le PRD (Product Requirements Document) du **PACK PRODUCTIVITÉ SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Visionnaire, Minimaliste et Ultra-Performante (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 📈 PACK PRODUCTIVITÉ (Outils Focus & Organisation)

Ce pack force la création d'applications "Focus-First". Le design doit encourager l'action rapide (Quick Actions, Swipes, Shortcuts clavier). L'ergonomie doit rivaliser avec des références comme Notion, Todoist, ou Linear.

---

## 🎯 1. Les Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les briques métiers (Missions) que tu peux câbler et générer :

### ✅ 1. Todo Mini-Kanban (`prd_prod_todo_kanban`)
**Mission :** To-do list évoluée en mini-Kanban mobile.
**Design Requis :** Vue hybride (Liste verticale + glisser-déposer). 

### 🔀 2. Tâches avec Swipes (`prd_prod_swipe_tasks`)
**Mission :** Liste tâches avec actions swipe (done, delete).
**Design Requis :** Animations fluides `framer-motion` lors d'un glissement vers la droite (Validation vert) ou vers la gauche (Suppression rouge).

### ⏰ 3. Gestionnaire de Rappels (`prd_prod_reminders`)
**Mission :** Création/gestion de rappels temporels.
**Design Requis :** Sélecteur de date/heure très rapide et clair.

### 📅 4. Agenda Hybride (`prd_prod_agenda_view`)
**Mission :** Vue agenda journalière, agenda liste.
**Design Requis :** Timeline verticale avec les blocs de temps pleins.

### 📝 5. Capture Rapide (Notes) (`prd_prod_quick_notes`)
**Mission :** Notes rapides (capture instantanée).
**Design Requis :** Champ de saisie omniprésent, similaire au Spotlight Mac.

### 🍅 6. Focus Pomodoro (`prd_prod_pomodoro`)
**Mission :** Pomodoro / Focus mode.
**Design Requis :** Compte à rebours massif au centre, design Zen/Dark mode pour la concentration.

### 🌱 7. Habit Tracker (`prd_prod_habit_tracker`)
**Mission :** Tracker d’habitudes.
**Design Requis :** Grilles façon "Github Contributions" ou chaînes de cercles cochés.

### 📄 8. Scanner de Documents (`prd_prod_doc_scanner`)
**Mission :** Scanner de documents (photo → crop).
**Design Requis :** Interface de cadrage avec superposition.

### 📁 9. Explorateur de Fichiers (`prd_prod_file_explorer`)
**Mission :** Explorateur de fichiers interne.
**Design Requis :** Vue Liste et Vue Grille (Dossiers, icônes).

### ✂️ 10. Gestionnaire de Snippets (`prd_prod_snippets`)
**Mission :** Gestion snippets/copier-coller.
**Design Requis :** Liste filtrable instantanément avec boutons "Copier" persistants.

---

## 🎨 2. Vision UI/UX & Design System Productivité
* **Directives pour Stitch :** Les apps de productivité doivent être les plus rapides possibles. Utilise massivement des "Raccourcis Clavier" (Keyboard shortcuts) visibles dans l'UI (ex: `⌘ + N` pour Nouvelle Tâche).
* **Densité :** L'espacement (`gap` et `padding`) doit être modéré. Trop d'espace nuit à la productivité, pas assez nuit à la lisibilité.
* **Micro-interactions :** Lorsqu'une tâche est accomplie, il faut une petite récompense visuelle (changement de couleur, légère animation de validation).

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée une app pour gérer mon temps de travail", fusionne le Tracker Pomodoro, la Todo List avec Swipe, et l'Agenda. Fournis immédiatement la structure React contextuelle pour l'état (State Management) de ces composants interconnectés.*

[INSTRUCTION IA]
Génère une architecture d'application de productivité :
- Implémentation du Drag & Drop ou des gestes Swipe (Framer Motion).
- Gestion d'état local poussée (ex: Zustand ou React Context).
- Des listes optimisées (Virtualization si nécessaire) pour gérer des milliers de tâches sans ralentissement.
- Création de Layouts focalisés (Distraction-free mode).

[STRUCTURE REQUISE]
- `src/features/productivity/pages/FocusDashboard.tsx`
- `src/features/productivity/components/TaskItem.tsx`
- `src/features/productivity/components/QuickAddInput.tsx`
- `src/features/productivity/hooks/useTasks.ts`
- `src/shared/utils/timeFormat.ts`