# DESIGN SYSTEM & GUIDELINES — Mobile Social

## 1. Direction artistique
Moderne, social, vivant. Sans-serif (Inter), fond blanc avec sidebar gauche et droite (#FAFAFA). Posts en cartes blanches avec ombres subtiles, accents violet (#8B5CF6). Animations de like (cœur qui pulse), transitions fluides. Avatars ronds avec border gradient pour les comptes vérifiés.

## 2. Tokens Sémantiques

### Palette de Couleurs
- **Primary** : `#8B5CF6` (boutons d'action, accents visuels, états actifs).
- **Accent** : `#EC4899` (badges, notifications, highlights secondaires).
- **Background** : Light `#FAFAFA`, Dark `#191919`.
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
- `PostCard (auteur, contenu, image, actions like/comment/share, compteur, timestamp)`
- `FeedList (scroll infini avec skeletons pendant le chargement)`
- `PostComposer (textarea, upload image, toggle public/privé, bouton publier)`
- `NotificationDropdown (liste avec icône type, avatar, timestamp, mark-as-read)`
- `ProfileHeader (couverture, avatar, bio, stats followers/following/posts, bouton follow)`
- `CommentThread (réponses imbriquées, like par commentaire, pagination)`
- `TrendingSidebar (hashtags populaires, suggestions de comptes à suivre)`

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
