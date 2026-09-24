# DESIGN SYSTEM & GUIDELINES — IA Studio

## 1. Direction artistique
Moderne, futuriste, premium. Sans-serif (Inter), fond sombre (#0F0F1A) ou clair (#FAFAFA) selon préférence, accents fuchsia (#D946EF). Messages IA en cards avec border gradient. Animations de streaming douces. Mode focus possible (cacher la sidebar). Code blocks avec syntax highlighting.

## 2. Tokens Sémantiques

### Palette de Couleurs
- **Primary** : `#D946EF` (boutons d'action, accents visuels, états actifs).
- **Accent** : `#8B5CF6` (badges, notifications, highlights secondaires).
- **Background** : Light `#0F0F1A`, Dark `#0a0a0a`.
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
- `ChatMessage (avatar IA/utilisateur, contenu markdown rendu, copier, régénérer)`
- `StreamingCursor (curseur clignotant pendant la génération de la réponse)`
- `ConversationSidebar (historique, recherche, nouveau chat, rename)`
- `SettingsDrawer (modèle, température slider, max tokens, system prompt textarea)`
- `AttachmentUploader (drag-drop images/PDF avec preview et suppression)`
- `CitationPill (numéro + source au hover, clic ouvre la source)`
- `TokenUsageIndicator (compteur input/output tokens et coût estimé)`

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
