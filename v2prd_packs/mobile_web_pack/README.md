> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en PWA (Progressive Web Apps) et Mobile Web.
> Ce document est le PRD (Product Requirements Document) du **PACK MOBILE WEB SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Tactile Native-Like (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 📱 PACK MOBILE WEB (Composants PWA)

Ce pack force la création d'expériences conçues exclusivement pour être consultées sur un téléphone. L'objectif est d'imiter parfaitement le comportement d'une application iOS ou Android (Taps, Swipes, Bottom Sheets).

---

## 🎯 1. Les Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les briques (Missions) que tu peux générer :

### 🚀 1. App Landing Mobile (`prd_mweb_landing`)
**Mission :** Landing mobile-first pour une app.
**Design Requis :** Boutons d'App Store géants. Mockup d'iPhone rogné en bas de l'écran.

### 🎓 2. Onboarding Swipable (`prd_mweb_onboarding`)
**Mission :** Onboarding mobile avec écrans swipables.
**Design Requis :** Carrousel de 3 étapes avec "Pagination Dots" (Points de progression) en bas, et un bouton "Skip" en haut à droite.

### 🏠 3. Shell Bottom Nav (`prd_mweb_shell`)
**Mission :** Shell mobile avec bottom nav.
**Design Requis :** Barre de navigation inférieure fixe avec des icônes réagissant au clic (Animation d'échelle `scale-95`).

### 🔑 4. Login Fullscreen (`prd_mweb_login`)
**Mission :** Ecran login fullscreen mobile.
**Design Requis :** Clavier virtuel qui ne cache pas le bouton de connexion (Keyboard avoiding view).

### 📖 5. Stories View (`prd_mweb_stories`)
**Mission :** Vue stories type Instagram.
**Design Requis :** Image/Vidéo prenant 100% de l'écran. Appuyer à gauche/droite navigue entre les slides. Barre de progression en haut.

### 💬 6. Interface Chat (`prd_mweb_chat`)
**Mission :** Ecran chat style messagerie.
**Design Requis :** Bulles de chat avec queues (Tails). L'input textuel reste ancré au-dessus du clavier lors de la frappe.

### ♾️ 7. Feed Mobile (`prd_mweb_feed`)
**Mission :** Feed infini mobile (scroll).
**Design Requis :** Cartes occupant presque toute la largeur (`w-[95%]`). Loader circulaire natif au "Pull-to-refresh".

### 👤 8. Profil Compact (`prd_mweb_profile`)
**Mission :** Page profil mobile compacte.
**Design Requis :** Avatar qui se rétrécit lors du scroll vers le bas (Header collapsable).

### ⚙️ 9. Settings Stack (`prd_mweb_settings`)
**Mission :** Stack de pages settings mobile.
**Design Requis :** Liste d'options avec des flèches "Chevrons" pointant vers la droite. Boutons on/off (Toggles) iOS style.

### 💰 10. Paywall Mobile (`prd_mweb_paywall`)
**Mission :** Écran paywall abonnement.
**Design Requis :** Écran surgissant du bas (Bottom up), liste d'avantages cochés en vert, énorme bouton d'achat "S'abonner avec Apple/Google Pay".

---

## 🎨 2. Vision UI/UX & Design System Mobile
* **Directives pour Stitch :** Évite les ombres complexes (`shadow-2xl`) qui ralentissent le rendu mobile. Préfère les bordures ultra-fines (`border-zinc-100`) et les fonds gris très clairs (`bg-zinc-50`).
* **Typographie :** Les polices doivent être grandes. Un texte de base (Body) ne doit jamais être en dessous de `16px` pour éviter le zoom automatique d'iOS sur les formulaires.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi une web app mobile pour tchatter", fusionne `prd_mweb_shell` avec `prd_mweb_chat`.*

[INSTRUCTION IA]
Génère une architecture Mobile-First absolue :
- Conteneur `w-full max-w-md mx-auto h-screen` pour simuler l'écran mobile même sur desktop.
- Désactivation du select textuel (`select-none`) sur les éléments d'interface pour éviter les comportements natifs étranges.
- Utilisation des `<meta name="theme-color">` pour colorer la barre de statut du navigateur.

[STRUCTURE REQUISE]
- `src/features/mobile/pages/MobileAppContainer.tsx`
- `src/features/mobile/components/BottomTabBar.tsx`
- `src/features/mobile/components/SwipeableOnboarding.tsx`