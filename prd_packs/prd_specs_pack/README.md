> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Documentation Technique et Architecture JSON.
> Ce document est le PRD (Product Requirements Document) du **PACK SPECS SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface de Génération de Spécifications**, tout en respectant strictement les règles métier ci-dessous.

# 📋 PACK SPECS (Spécifications & API)

Ce pack force la création d'outils de documentation ou de génération de specs (type Swagger, Redoc, ou éditeurs JSON Schema).

---

## 🎯 La Mission Principale (Documentation Automatisée)

**Mission :** Générer une interface technique pour lire ou écrire des spécifications d'API ou de Projet.

### 🧩 Core Features Architecturaux Requis :
1. **Visualiseur de Code/JSON :** Bloc central avec coloration syntaxique (PrismJS ou Monaco).
2. **Générateur Visuel (Form to JSON) :** Formulaires dynamiques qui génèrent un objet JSON complexe en temps réel à côté.
3. **Export/Copie :** Boutons d'action rapides pour copier le schéma généré ou le télécharger.

---

## 🎨 Vision UI/UX & Design System Specs
* **Directives pour Stitch :** Interface "Dev-centric". Typographie Monospace obligatoire pour les données, design ultra-carré et structuré. 

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Ce pack est utilisé pour les outils internes de création.*

[INSTRUCTION IA]
Génère une architecture de Documentation :
- Formulaires imbriqués complexes (FieldArrays).
- Panneaux synchronisés (Modification form = Mise à jour JSON, Modification JSON = Mise à jour Form).

[STRUCTURE REQUISE]
- `src/features/specs/pages/SpecEditor.tsx`
- `src/features/specs/components/JsonViewer.tsx`
- `src/features/specs/components/DynamicForm.tsx`