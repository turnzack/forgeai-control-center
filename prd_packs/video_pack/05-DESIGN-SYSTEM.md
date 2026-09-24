# DESIGN SYSTEM & GUIDELINES — Video Pack

## 1. Direction artistique
Dark mode par défaut, focus sur la vidéo. Sans-serif (Inter), fond noir (#0A0A0A), accents rouge (#DC2626) pour le live et les CTAs. Lecteur cinématique en 16:9 avec contrôles qui fade-out après 3s. Sidebar chat à droite, commentaires en dessous. Cards vidéo avec hover preview animé.

## 2. Tokens Sémantiques

### Palette de Couleurs
- **Primary** : `#DC2626` (boutons d'action, accents visuels, états actifs).
- **Accent** : `#F59E0B` (badges, notifications, highlights secondaires).
- **Background** : Light `#0A0A0A`, Dark `#0a0a0a`.
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
- `VideoPlayer (canvas vidéo, contrôles custom, chapitres overlay, quality menu)`
- `ChapterList (timestamps cliquables avec titres et durées)`
- `LiveChat (messages temps réel, input, emotes, modération tools)`
- `CommentSection (tri, réponses imbriquées, like/dislike, signaler)`
- `QualitySelector (menu déroulant avec auto + résolutions)`
- `VideoCard (thumbnail, durée overlay, titre, créateur, vues, date)`
- `UpNextPanel (prochaine vidéo avec countdown et skip)`

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
