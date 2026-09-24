# DESIGN SYSTEM & GUIDELINES — Mariob Quest

## 1. Direction artistique
Néon, arcade rétro-futuriste. Police pixel/mono (Press Start 2P pour les scores, Inter pour les menus). Fond noir (#0A0A0F), accents néon rouge (#EF4444) et cyan (#06FFFF). Glows CSS, scanlines optionnelles, animations de combo éclatantes. Boutons avec effet pressé rétro.

## 2. Tokens Sémantiques

### Palette de Couleurs
- **Primary** : `#EF4444` (boutons d'action, accents visuels, états actifs).
- **Accent** : `#06FFFF` (badges, notifications, highlights secondaires).
- **Background** : Light `#0A0A0F`, Dark `#0a0a0a`.
- **Surfaces** : Light `#FFFFFF`, Dark `#1E293B`.
- **Text** : `#FAFAFA`, Muted `#afb7c2`.

### Typographie
- Police principale : `Press Start 2P`, sans-serif (fallback système).
- Hiérarchie :
  - `H1` : `font-bold text-3xl tracking-tight`
  - `H2` : `font-semibold text-xl tracking-tight`
  - `H3` : `font-medium text-lg`
  - `Body` : `text-sm leading-relaxed`
  - `Caption` : `text-xs text-muted-foreground`

### Rayons & Ombres
- Conteneurs : `rounded-xl border shadow-sm`
- Boutons : `rounded-lg font-medium transition-all duration-150`
- Cards : `rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow`

### Espacements
- Base 4px (Tailwind default scale).
- Section padding : `py-12 md:py-16 lg:py-24`.
- Container : `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.

## 3. Composants UI du domaine
- `GameCanvas (zone de jeu HTML5 avec renderer, score HUD overlay)`
- `ScoreHUD (score actuel, high-score, vies, niveau, combo)`
- `LeaderboardTable (rang, joueur, score, delta avec le joueur précédent)`
- `SettingsPanel (sliders volume, toggle musique/effets, sélecteur difficulté, contrôles)`
- `GameOverModal (score final, nouveau record badge, boutons retry/menu/leaderboard)`
- `AchievementToast (notification animée quand un achievement est débloqué)`
- `PauseOverlay (reprendre, recommencer, options, quitter)`

## 4. États des Composants Interactifs
- **Idle** : aspect stable, contraste conforme WCAG AA.
- **Hover** : accentuation lumineuse (`hover:opacity-90`) ou bordure colorée.
- **Active / Pressed** : `scale-[0.98]` pour un retour haptique visuel.
- **Disabled** : `opacity-50 cursor-not-allowed`.
- **Loading** : spinner SVG intégré ou skeleton pulse animé.
- **Error** : bordure rouge `border-red-500` + message d'erreur en `text-red-600`.
- **Focus** : ring accessible `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`.

## 5. Iconographie
- Bibliothèque : Lucide React (icônes linéaires, cohérentes).
- Taille standard : 16px (inline), 20px (boutons), 24px (navigation).
- Pas d'emojis dans l'UI fonctionnelle.

## 6. Mode Sombre
- Variables CSS : `--background`, `--foreground`, `--primary`, `--accent`...
- Toggle persistant via localStorage, préférence système par défaut.
- Toutes les couleurs doivent avoir un variant dark validé (contraste AA).
