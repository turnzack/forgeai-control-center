# DESIGN SYSTEM & GUIDELINES — Audio Pack

## 1. Direction artistique
Moderne, immersive, orange vibrante. Sans-serif (Inter), fond sombre préférable (#0F0F0F) pour la lecture nocturne, accents orange (#F97316). Waveform en gradient orange→rouge. Player en glassmorphism avec blur. Animations fluides sur les transitions de piste.

## 2. Tokens Sémantiques

### Palette de Couleurs
- **Primary** : `#F97316` (boutons d'action, accents visuels, états actifs).
- **Accent** : `#EF4444` (badges, notifications, highlights secondaires).
- **Background** : Light `#0F0F0F`, Dark `#0a0a0a`.
- **Surfaces** : Light `#FFFFFF`, Dark `#1E293B`.
- **Text** : `#FAFAFA`, Muted `#afb7c2`.

### Typographie
- Police principale : `Inter`, sans-serif (fallback système).
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
- `AudioPlayer (play/pause, seek bar, volume, time, boutons repeat/shuffle)`
- `WaveformView (canvas avec peaks, position courante, regions cliquables)`
- `QueueDrawer (panneau latéral avec drag-and-drop reorder et suppression)`
- `PlaylistCard (cover, titre, nb morceaux, durée totale, bouton play)`
- `TrackRow (titre, artiste, durée, bouton favori, menu actions)`
- `Uploader (drag-drop zone, barre de progression, metadata editor)`
- `MiniPlayer (barre fixe en bas avec morceau courant et contrôles essentiels)`

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
