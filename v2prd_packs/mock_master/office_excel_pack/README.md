> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Interfaces Tableurs et Gestion de Données Massives.
> Ce document est le PRD (Product Requirements Document) du **PACK OFFICE EXCEL SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Complexe de type Tableur (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 📊 PACK OFFICE EXCEL (Clone de Tableur)

Ce pack force la création d'interfaces inspirées par Microsoft Excel ou Google Sheets. L'objectif est la manipulation de grilles infinies, les formules mathématiques et la navigation au clavier.

---

## 🎯 La Mission Principale (Architecture Tableur)

**Mission :** Générer une interface en grille (Grid) hautement interactive.
L'application doit permettre la saisie rapide (Inline editing) et la sélection de plages de cellules (Range selection).

### 🧩 Core Features Architecturaux Requis :
1. **Grille Excel (Data Grid) :** Tableau avec les lettres (A, B, C) en haut et les chiffres (1, 2, 3) à gauche.
2. **Édition Rapide (Inline Edit) :** Double-clic sur une cellule pour l'éditer en place sans ouvrir de modale.
3. **Barre de Formules :** Champ textuel en haut (`fx = ...`) synchronisé avec la cellule active.
4. **Navigation au Clavier :** Déplacement avec les flèches, `Tab` pour passer à droite, `Entrée` pour valider et passer en dessous.

---

## 🎨 Vision UI/UX & Design System Excel
* **Directives pour Stitch :** Les bordures des cellules doivent être ultra fines et grises (`border-gray-200`). La cellule sélectionnée doit avoir une bordure épaisse et colorée (ex: Vert Excel ou Bleu Google Sheets).
* **Performance :** L'interface doit être austère, maximisant l'espace pour les données.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi un clone d'Excel", déploie cette architecture vitale.*

[INSTRUCTION IA]
Génère une architecture Tableur (Spreadsheet) :
- Optimisation vitale : Le rendu de milliers de cellules fera planter React. Utilise obligatoirement la virtualisation (Virtual Scrolling / Canvas rendering).
- État local lourd : Gestion de la sélection (Start Cell, End Cell).
- Composants sans marges (Gap 0, Margin 0) pour recréer la sensation d'une grille continue.

[STRUCTURE REQUISE]
- `src/features/spreadsheet/pages/ExcelSheet.tsx`
- `src/features/spreadsheet/components/VirtualGrid.tsx`
- `src/features/spreadsheet/components/FormulaBar.tsx`
- `src/features/spreadsheet/components/Cell.tsx`
