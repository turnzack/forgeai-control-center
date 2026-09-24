> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Ingénierie de Prompt et Outils LLM.
> Ce document est le PRD (Product Requirements Document) du **PACK PROMPT & SKILLS SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Visionnaire, Technique et Puissante (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 🧠 PACK PROMPT & SKILLS (Studio IA)

Ce pack force la création d'interfaces techniques destinées aux "Prompt Engineers" et aux créateurs d'Agents IA. L'interface doit permettre de coder, tester, évaluer et versionner des prompts et des outils (skills).

---

## 🎯 1. Les Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les briques métiers (Missions) que tu peux câbler et générer :

### 📚 1. Bibliothèque de Prompts (`prd_prompt_library`)
**Mission :** Bibliothèque de prompts (tags, versions).
**Design Requis :** Liste filtrable avec aperçu partiel du code.

### ✍️ 2. Éditeur Paramétrable (`prd_prompt_editor`)
**Mission :** Éditeur de prompts paramétrables.
**Design Requis :** Éditeur de code (type Monaco) avec détection et surbrillance des variables (ex: `{{user_input}}`).

### 🧪 3. Testeur Multi-Inputs (`prd_prompt_tester_multi`)
**Mission :** Tester un prompt sur plusieurs inputs.
**Design Requis :** Vue divisée : Prompt en haut, Grille de tests en bas (Input -> Output de l'IA).

### ⚖️ 4. A/B Testing Prompts (`prd_prompt_ab_test`)
**Mission :** A/B test prompts sur mêmes cas.
**Design Requis :** Comparatif côte à côte (Split screen) de deux réponses d'IA pour le même input.

### 🧩 5. Templates System (`prd_prompt_templates`)
**Mission :** Pack de templates prompts (code, UX, PRD).
**Design Requis :** Grille de démarrage (Starter templates) façon Canva.

### 🛠️ 6. Éditeur de Manifest / Outils (`prd_prompt_skill_manifest`)
**Mission :** Éditeur de manifest de skill (tools, schemas JSON).
**Design Requis :** Éditeur JSON interactif ou formulaire de génération de schéma strict.

### 🌐 7. Registre des Agents (`prd_prompt_agent_registry`)
**Mission :** Registre de skills/agents disponibles.
**Design Requis :** Tableau de bord listant les agents avec leur statut (Actif, Maintenance).

### ⚡ 8. Testeur Rapide de Skill (`prd_prompt_skill_tester`)
**Mission :** Tester un skill (input/output JSON) rapidement.
**Design Requis :** Console type "Postman" pour exécuter une fonction métier simulée par l'IA.

### 🕸️ 9. Graphe de Dépendances (`prd_prompt_dependency_graph`)
**Mission :** Visualiser dépendances entre skills/outils.
**Design Requis :** Graphe nodal visuel (Node-based UI façon React Flow).

### 📊 10. Statistiques d'Usage (`prd_prompt_analytics`)
**Mission :** Stats usage prompts (succès, temps, coûts en Tokens).
**Design Requis :** Graphiques de consommation d'API, coûts ($) et latence (ms).

---

## 🎨 2. Vision UI/UX & Design System Prompt Engineering
* **Directives pour Stitch :** Les outils d'IA nécessitent une interface ultra-technique. Le "Dark Mode" est la norme absolue, rappelant les IDE (VS Code). 
* **Composants :** Intègre massivement des éditeurs de code (Monaco Editor ou CodeMirror), des consoles de logs noires, et des affichages de données brutes JSON formatées.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi un studio pour concevoir mes prompts et voir combien ils me coûtent", tu injecteras `prd_prompt_editor` + `prd_prompt_tester_multi` + `prd_prompt_analytics`.*

[INSTRUCTION IA]
Génère une interface de Studio d'Intelligence Artificielle (IDE) :
- Panneaux redimensionnables (Split-panes).
- Éditeurs de texte brut (Monospaced font) pour les Prompts.
- Formulaires de tests et consoles d'affichage de flux JSON.
- Graphiques d'analytique métier liés aux LLMs.

[STRUCTURE REQUISE]
- `src/features/ai-studio/pages/PromptEditorPage.tsx`
- `src/features/ai-studio/pages/AITesterPage.tsx`
- `src/features/ai-studio/components/CodeMirrorEditor.tsx`
- `src/features/ai-studio/components/PromptVariablesForm.tsx`
- `src/features/ai-studio/components/TokenCostChart.tsx`