# UI SCREEN SPECIFICATIONS & AI GENERATION — Neonstack Arcade

## 1. Spécification Écran SCR-001 : /
- **Route** : `/`
- **Objectif** : écran central pour l'expérience **Jeu Vidéo & Arcade** dans Neonstack Arcade.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `GameCanvas`, `ScoreHUD`, `LeaderboardTable`, `SettingsPanel`, `GameOverModal`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 2. Spécification Écran SCR-002 : /play
- **Route** : `/play`
- **Objectif** : écran central pour l'expérience **Jeu Vidéo & Arcade** dans Neonstack Arcade.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `GameCanvas`, `ScoreHUD`, `LeaderboardTable`, `SettingsPanel`, `GameOverModal`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 3. Spécification Écran SCR-003 : /leaderboard
- **Route** : `/leaderboard`
- **Objectif** : écran central pour l'expérience **Jeu Vidéo & Arcade** dans Neonstack Arcade.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `GameCanvas`, `ScoreHUD`, `LeaderboardTable`, `SettingsPanel`, `GameOverModal`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 4. Spécification Écran SCR-004 : /achievements
- **Route** : `/achievements`
- **Objectif** : écran central pour l'expérience **Jeu Vidéo & Arcade** dans Neonstack Arcade.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `GameCanvas`, `ScoreHUD`, `LeaderboardTable`, `SettingsPanel`, `GameOverModal`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).


---

## 5. Prompt Industriel Google Stitch
```text
# STITCH PROMPT — Neonstack Arcade

Contexte produit :
Neonstack Arcade - Arcade rétro néon avec 10 jeux dans le domaine Jeu Vidéo & Arcade.

Objectif :
Offrir une interface complète, spécialisée et authentique permettant aux utilisateurs de réaliser leurs tâches métier.

Layout :
- Shell applicatif moderne avec navigation contextuelle.
- Section de statistiques ou de contenu principal selon l'écran.
- Grille de cartes réactives ou table moderne avec pagination.

Composants obligatoires :
GameCanvas, ScoreHUD, LeaderboardTable, SettingsPanel, GameOverModal, AchievementToast, PauseOverlay.

Style visuel :
- Palette : Fond #0A0A0F, primaire #EF4444, accent #06FFFF.
- Typographie : Press Start 2P.
- Néon, arcade rétro-futuriste. Police pixel/mono (Press Start 2P pour les scores, Inter pour les menus). Fond noir (#0A0A0F), accents néon rouge (#EF4444) et cyan (#06FFFF). Glows CSS, scanlines optionnelles, animations de combo éclatantes. Boutons avec effet pressé rétro.

Contraintes :
- Zéro lorem ipsum, libellés explicites en français.
- Conformité WCAG AA.
- Responsive mobile-first.
```

---

## 6. Prompt Industriel Gemini 3.1 (Nano Banana Pro / Imagen 4)
```text
Génère une illustration haute fidélité pour l'onboarding de Neonstack Arcade.

Contexte produit :
Application Jeu Vidéo & Arcade moderne, élégante et professionnelle.

Sujet :
Métaphore visuelle représentant GameSession et l'interaction utilisateur dans le domaine Jeu Vidéo & Arcade.

Style :
Rendu 3D isométrique épuré ou illustration vectorielle haut de gamme, sans surcharge.

Palette :
Dominante #EF4444, accents #06FFFF, reflets doux sur fond #0A0A0F.

Format :
16:9 pour intégration en bannière d'accueil.

Contraintes :
- Pas de texte incrusté, pas de watermark.
- Respect rigoureux des codes du design system.
- Cohérence avec l'un visuel du domaine Jeu Vidéo & Arcade.
```
