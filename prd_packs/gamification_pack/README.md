> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Gamification, Rétention Utilisateur et Behavioural Design.
> Ce document est le PRD (Product Requirements Document) du **PACK GAMIFICATION SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Engageante et Addictive (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 🎮 PACK GAMIFICATION (Rétention & Engagement)

Ce pack force la création de mécaniques ludiques (façon Duolingo ou Strava) pour augmenter la rétention. L'objectif est de récompenser les actions de l'utilisateur avec du feedback visuel fort, des sons virtuels ou des jauges de progression.

---

## 🎯 1. Les Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les briques (Missions) que tu peux générer :

### 🌟 1. XP et Niveaux (`prd_gami_xp_levels`)
**Mission :** XP, niveaux et progression.
**Design Requis :** Jauge circulaire ou barre d'expérience se remplissant de manière fluide.

### 🏅 2. Badges et Succès (`prd_gami_badges_achievements`)
**Mission :** Badges, succès, collections.
**Design Requis :** Vitrine de médailles (Cartes grisées si verrouillées, dorées et brillantes si débloquées).

### 🔥 3. Streaks (Séries) (`prd_gami_streaks`)
**Mission :** Streak journaliers/hebdo.
**Design Requis :** Icône de flamme animée affichant le nombre de jours consécutifs.

### 🏆 4. Classement (Leaderboard) (`prd_gami_leaderboard`)
**Mission :** Classement (amis, global).
**Design Requis :** Liste ordonnée avec podium (Top 3 mis en valeur).

### 📜 5. Système de Quêtes (`prd_gami_quests`)
**Mission :** Système de missions/quests.
**Design Requis :** Cartes de quêtes journalières (ex: "Complète 3 leçons").

### 🎡 6. Roue de la Fortune (`prd_gami_spin_wheel`)
**Mission :** Roue des récompenses (spin).
**Design Requis :** Animation CSS transform: rotate complexe avec easing.

### 📋 7. Checklists Gamifiées (`prd_gami_checklist`)
**Mission :** Checklists gamifiées avec points.
**Design Requis :** "Ding!" visuel (Pop) de score à chaque case cochée.

### 👾 8. Minijeux Intégrés (`prd_gami_minigame`)
**Mission :** Minijeu simple (tap, swipe, avoid).
**Design Requis :** Boucle de jeu simple, Game Over screen, Retry.

### ⏳ 9. Événements Limités (`prd_gami_limited_events`)
**Mission :** Événements limités dans le temps.
**Design Requis :** Thème temporaire (Halloween, Noël) et compte à rebours massif.

### 🧑‍🎤 10. Avatar Customisable (`prd_gami_avatars`)
**Mission :** Avatar customisable (skin, accessoires).
**Design Requis :** Paper-doll system (Superposition d'images transparentes).

---

## 🎨 2. Vision UI/UX & Design System Gamification
* **Directives pour Stitch :** Le design doit être coloré, joyeux et rebondissant. Utilise des ombres portées épaisses (ex: `box-shadow: 0 4px 0 #CBD5E1`) pour donner un aspect "Bouton physique/jouet".
* **Animations :** Indispensable. Implémente `canvas-confetti` pour les victoires et des effets "Jelly" sur les boutons cliqués.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée une app d'apprentissage de langues type Duolingo", fusionne `prd_gami_streaks`, `prd_gami_xp_levels` et `prd_gami_quests`.*

[INSTRUCTION IA]
Génère une architecture d'application gamifiée :
- Un contexte React global (GamificationProvider) pour gérer les points d'XP et les niveaux partout dans l'app.
- Des composants de jauge de progression avec interpolation (Transition douce des valeurs).
- Intégration de Lottie Animations ou Framer Motion pour les récompenses.

[STRUCTURE REQUISE]
- `src/features/gamification/contexts/GamificationContext.tsx`
- `src/features/gamification/components/XpBar.tsx`
- `src/features/gamification/components/StreakFlame.tsx`
- `src/features/gamification/components/BadgeGrid.tsx`