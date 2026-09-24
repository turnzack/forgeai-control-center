# DESIGN SYSTEM & GUIDELINES — Layout Pack

## 1. Direction artistique
Minimaliste, neutre, mettant les composants en valeur. Sans-serif (Inter), fond blanc (#FFFFFF) et gris très clair (#FAFAFA) pour les zones de preview. Accents neutres (zinc #71717A) pour ne pas parasiter les composants montrés. Sidebar gauche par catégorie, contenu central preview, props droite.

## 2. Tokens Sémantiques

### Palette de Couleurs
- **Primary** : `#71717A` (boutons d'action, accents visuels, états actifs).
- **Accent** : `#6366F1` (badges, notifications, highlights secondaires).
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
- `ComponentCatalog (grille par catégorie avec preview, nom, status badge)`
- `Playground (panneau props à gauche, rendu live à droite, code en bas)`
- `PropsTable (nom, type, défaut, description, requis badge)`
- `TokenExplorer (catégories tokens, swatches couleurs, sliders spacing)`
- `ThemeSwitcher (toggle clair/sombre avec persist localStorage)`
- `StateMatrix (grille des états default/hover/focus/disabled/error/loading)`
- `CodeBlockWithCopy (multi-langage React/Vue/HTML, bouton copier avec feedback)`

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
