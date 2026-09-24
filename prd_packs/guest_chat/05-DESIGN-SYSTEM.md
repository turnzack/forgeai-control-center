# DESIGN SYSTEM & GUIDELINES — Guest Chat

## 1. Direction artistique
Épuré, conversationnel, mobile-first. Sans-serif (Inter), bulles arrondies, fond blanc (#FFFFFF), messages envoyés en bleu (#3B82F6) à droite, reçus en gris clair (#F1F5F9) à gauche. Sidebar conversations à gauche, zone chat centrale, header avec avatar et statut. Animations douces.

## 2. Tokens Sémantiques

### Palette de Couleurs
- **Primary** : `#3B82F6` (boutons d'action, accents visuels, états actifs).
- **Accent** : `#10B981` (badges, notifications, highlights secondaires).
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
- `ConversationList (avatar, nom, dernier message, horodatage, badge non lus, preview)`
- `MessageBubble (contenu, heure, statut lu, réactions, menu actions au hover)`
- `MessageInput (textarea auto-resize, emoji picker, upload fichiers, bouton envoi)`
- `TypingIndicator (bulles animées sous le nom du conversation qui tape)`
- `PresenceDot (point vert/gris indiquant le statut en ligne)`
- `MessageThread (réponses à un message, indentation, compteur)`
- `EmojiPicker (grille d'emojis avec recherche, skins tones)`

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
