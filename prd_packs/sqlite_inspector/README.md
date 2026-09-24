> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Bases de Données, SQL et Outils d'Administration.
> Ce document est le PRD (Product Requirements Document) du **PACK SQLITE INSPECTOR SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Technique d'Exploration de Données (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 🗄️ PACK SQLITE INSPECTOR (Admin de Base de Données)

Ce pack force la création d'un outil interne semblable à phpMyAdmin, DBeaver ou TablePlus, mais fonctionnant directement dans le navigateur.

---

## 🎯 La Mission Principale (DB Explorer)

**Mission :** Générer une interface d'administration de base de données permettant de lire, écrire et exécuter des requêtes SQL personnalisées.

### 🧩 Core Features Architecturaux Requis :
1. **Explorateur de Schéma (Sidebar) :** Liste latérale affichant toutes les tables de la base de données. Au clic, déploie la liste des colonnes et de leurs types (VARCHAR, INT).
2. **Éditeur SQL (Query Editor) :** Éditeur de texte avancé (type Monaco Editor) pour écrire des requêtes `SELECT`, `UPDATE` avec coloration syntaxique et bouton "Exécuter".
3. **Tableau de Résultats (Result Grid) :** Table de données (DataGrid) massive affichant le résultat de la requête, avec possibilité d'éditer une cellule (Inline editing).
4. **Visualiseur de Relations :** Génération d'un diagramme Entité-Association (ERD) basique montrant comment les tables sont connectées.

---

## 🎨 Vision UI/UX & Design System SQLite
* **Directives pour Stitch :** C'est un outil d'ingénieur pur et dur. L'espace d'affichage de la donnée est la seule chose qui compte. L'éditeur SQL doit être sombre, le tableau des résultats doit être clair et très compact (Padding minimal).

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*À utiliser quand l'utilisateur veut un outil pour inspecter ses données locales.*

[INSTRUCTION IA]
Génère une architecture d'Admin BDD :
- Composants de "Split-pane" permettant d'agrandir l'éditeur SQL au détriment du tableau des résultats.
- Interface de DataTable virtuellement scrollable pour ne pas planter avec 10 000 lignes de résultats.

[STRUCTURE REQUISE]
- `src/features/database/pages/SqlInspector.tsx`
- `src/features/database/components/TableListSidebar.tsx`
- `src/features/database/components/SqlQueryEditor.tsx`
- `src/features/database/components/ResultDataTable.tsx`