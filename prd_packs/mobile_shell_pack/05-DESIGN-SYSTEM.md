# DESIGN SYSTEM & GUIDELINES — Mobile Shell

## 1. Direction artistique
Mobile-first, natif, fluide. Sans-serif (Inter), fond blanc (#FFFFFF), accents teal (#06B6D4). Bottom nav fixe avec blur backdrop. Transitions entre écrans en slide horizontal. Tap targets minimum 44×44px. Safe areas iOS (notch) gérées via env(safe-area-inset-*).

## 2. Tokens Sémantiques

### Palette de Couleurs
- **Primary** : `#06B6D4` (boutons d'action, accents visuels, états actifs).
- **Accent** : `#8B5CF6` (badges, notifications, highlights secondaires).
- **Background** : Light `#FFFFFF`, Dark `#191919`.
- **Surfaces** : Light `#FFFFFF`, Dark `#1E293B`.
- **Text** : `#0F172A`, Muted `#39455a`.

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
- `BottomNav (4-5 onglets avec icône, label, badge, indicateur actif animé)`
- `TopAppBar (titre, icône retour, action droite, search trigger)`
- `SwipeableListItem (contenu + actions révélées au swipe gauche/droit)`
- `PullToRefresh (spinner natif déclenché au scroll vers le haut)`
- `OnboardingCarousel (3 slides, dots indicator, skip, commencer)`
- `PushPermissionPrompt (modal expliquant la valeur des notifications)`
- `OfflineBanner (bandeau discret quand le réseau est indisponible)`

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
