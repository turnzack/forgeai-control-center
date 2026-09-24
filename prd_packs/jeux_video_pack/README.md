> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé dans le Game Design Web (WebGL, Canvas, Gamification).
> Ce document est le PRD (Product Requirements Document) du **PACK JEUX VIDÉO SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Visionnaire, Hautement Interactive et Performante (60 FPS)**, tout en respectant strictement les règles métier ci-dessous.

# 🎮 PACK JEUX VIDÉO (Moteur & Gamification)

Ce pack force la création d'expériences ludiques directement dans le navigateur. Il ne s'agit pas de sites statiques, mais de véritables applications interactives utilisant les boucles de rendu (Render Loops), la gestion des inputs (Clavier, Gamepad) et des systèmes de récompense.

---

## 🎯 La Mission Principale

Si l'utilisateur demande à implémenter ce pack, voici les 2 briques métiers (Missions) que tu peux câbler et générer :

### 🕹️ 1. Moteur de Jeu 2D (`prd_game_engine_2d`)
**Mission :** Créer l'architecture de base d'un jeu vidéo web (RPG vu de haut ou Jeu de Plateforme).
**Design Requis :** Thématique forte (Pixel Art rétro 16-bits OU Neon Cyberpunk). Interface de contrôle tactile sur mobile (Joypad virtuel).
**Composants à générer :** `GameCanvas.tsx` (le conteneur principal Canvas/WebGL), `SpriteRenderer.ts` (logique de dessin), `Joypad.tsx` (contrôles tactiles).

### 🏆 2. Système de Leaderboard (`prd_game_leaderboard`)
**Mission :** Tableau des scores compétitif en temps réel.
**Design Requis :** Fortement gamifié avec des animations "arcade". Médailles scintillantes (Or, Argent, Bronze), surbrillance du joueur actuel (User Rank).
**Composants à générer :** `LeaderboardTable.tsx`, `UserRank.tsx`

---

## 🎨 Vision UI/UX & Design System Global (Gaming)
* **Directives pour Stitch :** Le design doit être percutant. Utilise des polices d'arcade (ex: `Press Start 2P` ou des polices très "Tech/Sci-Fi"). Les boutons doivent avoir un retour haptique visuel (s'enfoncer au clic).
* **Performances :** Le Canvas doit être redimensionnable (Responsive) tout en conservant son ratio d'aspect (Aspect-Ratio lock) pour ne pas déformer les sprites.
* **Animations :** Utilise des effets de particules CSS ou Canvas pour les victoires ou les prises de points.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Je veux créer un petit jeu RPG jouable dans le navigateur avec un classement mondial", tu dois fusionner `prd_game_engine_2d` et `prd_game_leaderboard` pour structurer l'architecture entière. Veille à séparer strictement l'état de React (UI du Leaderboard) de la boucle de jeu principale (Canvas `requestAnimationFrame`).*

[INSTRUCTION IA]
Génère la structure d'un jeu web 2D avec classement :
- Un conteneur Canvas plein écran ou centré avec un ratio 16:9.
- Une boucle de rendu (useGameLoop hook) indépendante des re-renders React.
- Une UI superposée (Overlay) en HTML/Tailwind affichant le score, la vie, et un bouton "Pause".
- Une modale "Game Over" qui affiche le Leaderboard.

[STRUCTURE REQUISE]
- `src/features/game/components/GameCanvas.tsx`
- `src/features/game/components/HUD.tsx`
- `src/features/game/components/LeaderboardModal.tsx`
- `src/features/game/hooks/useGameLoop.ts`
- `src/features/game/hooks/useInput.ts`
- `src/features/game/types/engine.ts`