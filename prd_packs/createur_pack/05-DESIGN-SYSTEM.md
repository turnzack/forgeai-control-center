# DESIGN SYSTEM & GUIDELINES — Créateur Portfolio

## 1. Direction artistique
Élégant, créatif, minimaliste. Sans-serif display (Sora) pour les titres, Inter pour le corps. Fond blanc cassé (#FAFAFA), accents cyan (#0EA5E9). Grille asymétrique type masonry, grandes typographies, hover sur les projets avec overlay dégradé. Mode sombre optionnel.

## 2. Tokens Sémantiques

### Palette de Couleurs
- **Primary** : `#0EA5E9` (boutons d'action, accents visuels, états actifs).
- **Accent** : `#8B5CF6` (badges, notifications, highlights secondaires).
- **Background** : Light `#FAFAFA`, Dark `#191919`.
- **Surfaces** : Light `#FFFFFF`, Dark `#1E293B`.
- **Text** : `#0F172A`, Muted `#39455a`.

### Typographie
- Police principale : `Sora`, sans-serif (fallback système).
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
- `ProjectCard (image, titre, tags techno, année, hover overlay avec résumé)`
- `ProjectGrid (grille filtrable par techno/type, vue mosaïque)`
- `ProjectDetail (galerie, description, stack, rôle, liens démo/code, navigation prev/next)`
- `SkillBar (nom de la compétence, niveau en %, barre animée au scroll)`
- `AboutSection (photo, bio, parcours timeline, CV download)`
- `ContactForm (nom, email, sujet, message, validation temps réel)`
- `TestimonialSlider (carrousel auto avec notes et logos)`

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
