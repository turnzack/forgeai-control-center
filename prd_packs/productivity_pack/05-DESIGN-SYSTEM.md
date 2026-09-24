# DESIGN SYSTEM & GUIDELINES — Productivity Hub

## 1. Direction artistique
Productif, ergonomique, coloré. Sans-serif (Inter), fond gris très clair (#F1F5F9), accents ambre/rose (#F59E0B / #E11D48). Cartes blanches avec border-l coloré par priorité. Drag-and-drop avec placeholder bleu. Densité d'information optimisée, raccourcis clavier partout.

## 2. Tokens Sémantiques

### Palette de Couleurs
- **Primary** : `#F59E0B` (boutons d'action, accents visuels, états actifs).
- **Accent** : `#E11D48` (badges, notifications, highlights secondaires).
- **Background** : Light `#F1F5F9`, Dark `#181818`.
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
- `KanbanBoard (colonnes avec compteurs, drag-and-drop, ajout de carte inline)`
- `TaskCard (titre, badges priorité/étiquettes, avatars assignés, due date, checklist progress)`
- `TaskDetailModal (description, sous-tâches, commentaires, pièces jointes, activité)`
- `FilterBar (filtres assigné/priorité/étiquette, recherche, tri)`
- `CalendarView (mois avec tâches en pastilles, drag pour replanifier)`
- `QuickAddBar (champ en bas pour créer une tâche rapidement avec /commandes)`
- `AvatarStack (avatars superposés des assignés, +N pour le débordement)`

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
