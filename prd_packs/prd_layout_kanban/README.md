> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Productivité, Drag & Drop et Gestion de Flux (Workflow).
> Ce document est le PRD (Product Requirements Document) du **PACK LAYOUT KANBAN SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface de type Board (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 📋 PACK LAYOUT KANBAN (Board & Drag-Drop)

Ce pack force la création d'architectures visuelles complexes horizontales (façon Trello, Jira, ou Notion Boards). C'est le design par excellence pour la gestion de projet et le pipeline CRM.

---

## 🎯 La Mission Principale (Architecture Kanban)

**Mission :** Générer un tableau à colonnes avec défilement horizontal infini et cartes déplaçables.
Le composant central est un Layout qui repousse les limites du CSS traditionnel pour gérer le scroll imbriqué.

### 🧩 Core Features Architecturaux Requis :
1. **Board Container :** Le parent doit prendre 100% de la hauteur restante de l'écran (`h-[calc(100vh-header)]`) et scroller horizontalement (`overflow-x-auto`).
2. **Kanban Columns :** Colonnes verticales fixes en largeur (ex: `w-72` ou `w-80`) qui scrollent verticalement en interne (`overflow-y-auto`).
3. **Kanban Cards :** Les tickets ou cartes à l'intérieur des colonnes.
4. **Drag & Drop (Optionnel mais recommandé) :** Prévoir la structure d'état permettant de déplacer une carte d'une colonne à l'autre.

---

## 🎨 Vision UI/UX & Design System Kanban
* **Directives pour Stitch :** Le défi d'un Kanban est d'éviter le scroll de la page entière (Body scroll). Le seul scroll doit se faire dans le Board (X) et dans les colonnes (Y).
* **Couleurs :** Les colonnes ont généralement un fond très léger (ex: `bg-slate-100` ou `bg-slate-800` en mode sombre), tandis que les cartes ont un fond plein (`bg-white`) avec une ombre (`shadow-sm`) pour donner un effet de "papier posé sur un bureau".

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi un CRM pour gérer mes prospects", le Layout Kanban avec les colonnes (Nouveau, Contacté, Gagné, Perdu) est l'architecture parfaite à déployer.*

[INSTRUCTION IA]
Génère une architecture de Layout Kanban avancée :
- Structure CSS Flexbox imbriquée (`flex-row` pour le Board, `flex-col` pour la Colonne).
- Gestion stricte des hauteurs (Ne jamais utiliser `height: 100%` qui fait casser le flex, mais plutôt `flex-1` et `min-h-0`).
- État local (React State) mockant 3 colonnes ("À faire", "En cours", "Terminé") et 5 cartes.
- Structure prête pour `dnd-kit` ou `@hello-pangea/dnd`.

[STRUCTURE REQUISE]
- `src/features/kanban/pages/KanbanBoardPage.tsx`
- `src/features/kanban/components/KanbanColumn.tsx`
- `src/features/kanban/components/KanbanCard.tsx`
- `src/features/kanban/hooks/useKanbanBoard.ts`