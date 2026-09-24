> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Systèmes Compétitifs et Classements Hautes Performances.
> Ce document est le PRD (Product Requirements Document) du **PACK GAME LEADERBOARD SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Gamifiée et Compétitive (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 🏆 PACK GAME LEADERBOARD (Classement Global)

Ce pack force la création d'architectures de classement. Qu'il s'agisse d'un jeu vidéo, d'un tableau des meilleurs vendeurs (Sales), ou d'un concours, l'objectif est d'afficher des scores et de générer de l'engagement par la compétition.

---

## 🎯 La Mission Principale (Classement Temps Réel)

**Mission :** Générer un système de classement mondial ou entre amis avec gestion des rangs.
L'interface doit gérer l'affichage de dizaines d'utilisateurs tout en mettant en valeur le joueur actuel (Sticky User Rank).

### 🧩 Core Features Architecturaux Requis :
1. **Top 3 Podium :** Un podium visuel pour les 3 premiers (Or, Argent, Bronze). Les avatars sont plus grands.
2. **Tableau des Scores (Leaderboard List) :** Liste virtuelle des joueurs suivants (Rang 4 à 100+).
3. **Rang de l'Utilisateur (Sticky Rank) :** Une barre ancrée en bas de l'écran affichant la position exacte de l'utilisateur connecté (ex: "Vous êtes #452").
4. **Filtres Temporels :** Boutons "Aujourd'hui", "Cette Semaine", "Global" (All-time).

---

## 🎨 Vision UI/UX & Design System Leaderboard
* **Directives pour Stitch :** Les classements doivent être animés. Lorsqu'un score change, la ligne de l'utilisateur doit glisser vers le haut ou le bas via `framer-motion` (Layout animations).
* **Couleurs & Gloire :** Utilise des dégradés métalliques pour les médailles (Gradients CSS `linear-gradient` or/argent/bronze) et des effets de brillance (Glow) sur le premier du classement.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi un classement pour voir qui fait le plus de ventes", adapte le thème de jeu vidéo vers un thème d'entreprise (Leaderboard Sales), mais garde la mécanique du podium et du rang collant.*

[INSTRUCTION IA]
Génère une architecture de Classement Compétitif :
- Composants liste optimisés (pour gérer beaucoup de joueurs sans ralentissement).
- Hooks pour trier dynamiquement les données (`useLeaderboard`).
- Affichage différencié (Mise en gras/couleur) si le rang affiché est celui de l'utilisateur.

[STRUCTURE REQUISE]
- `src/features/leaderboard/pages/LeaderboardPage.tsx`
- `src/features/leaderboard/components/PodiumTop3.tsx`
- `src/features/leaderboard/components/LeaderboardList.tsx`
- `src/features/leaderboard/components/StickyUserRank.tsx`