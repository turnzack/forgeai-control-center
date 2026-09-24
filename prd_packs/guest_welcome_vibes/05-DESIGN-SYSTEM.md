# DESIGN SYSTEM & GUIDELINES — Welcome Vibes

## 1. Direction artistique
Moderne, conversion-orienté, premium. Gradients violet→fuchsia, titres gras en Inter Display, fond blanc avec sections alternées (violet clair #FAF5FF). Hero avec mockup produit en perspective. Animations subtiles au scroll (fade-up). Boutons CTA avec glow.

## 2. Tokens Sémantiques

### Palette de Couleurs
- **Primary** : `#7C3AED` (boutons d'action, accents visuels, états actifs).
- **Accent** : `#EC4899` (badges, notifications, highlights secondaires).
- **Background** : Light `#FAF5FF`, Dark `#191819`.
- **Surfaces** : Light `#FFFFFF`, Dark `#1E293B`.
- **Text** : `#1E1B4B`, Muted `#41476b`.

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
- `HeroSection (headline, sous-titre, CTA primaire/secondaire, visuel mockup)`
- `FeatureGrid (3 colonnes : icône, titre, description, hover lift)`
- `PricingTable (3 plans, comparaison features, badge populaire, toggle mensuel/annuel)`
- `TestimonialCard (citation, avatar, nom, entreprise, note étoiles)`
- `FAQAccordion (questions repliables, recherche)`
- `WaitlistForm (email, early access tier, compteur de participants)`
- `StickyCTA (bandeau fixe mobile avec bouton conversion)`

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
