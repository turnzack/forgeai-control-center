# DESIGN SYSTEM & GUIDELINES — ContenuPro

## 1. Direction artistique
Lecture chaleureuse et confortable. Titres serif (Lora/Georgia), interligne généreux (1.75), largeur max-w-2xl pour le corps de l'article. Fond clair #FDFBF7 (ivoire), accents ambre #D97706. Cartes éditoriales avec ombres subtiles et hover lift, typographie soignée, drop cap optionnelle.

## 2. Tokens Sémantiques

### Palette de Couleurs
- **Primary** : `#D97706` (boutons d'action, accents visuels, états actifs).
- **Accent** : `#059669` (badges, notifications, highlights secondaires).
- **Background** : Light `#FDFBF7`, Dark `#191918`.
- **Surfaces** : Light `#FFFFFF`, Dark `#1E293B`.
- **Text** : `#1C1917`, Muted `#404651`.

### Typographie
- Police principale : `Lora`, sans-serif (fallback système).
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
- `ArticleCard (thumbnail, titre, extrait, auteur, date, badge catégorie, temps de lecture)`
- `ArticleList (paginée, filtrable par catégorie/tag, vue grille ou liste)`
- `ArticleDetail (contenu, bio auteur, articles liés, boutons partage social)`
- `CategorySidebar (catégories hiérarchiques avec compteurs d'articles)`
- `SearchBar (recherche full-text avec dropdown de résultats surlignés)`
- `TagCloud (tags cliquables proportionnels au nombre d'articles)`
- `ReadingProgressBar (barre fixe en haut indiquant la progression de lecture)`

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
