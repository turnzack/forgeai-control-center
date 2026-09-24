> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Architecture Mobile (PWA, React Native) et Modèles de Navigation.
> Ce document est le PRD (Product Requirements Document) du **PACK MOBILE SHELL SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Structurelle Mobile Parfaite (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 📱 PACK MOBILE SHELL (Structure Mobile)

Ce pack ne génère pas de métier, mais l'enveloppe structurelle (Le Shell) d'une application mobile. L'objectif est de recréer les paradigmes de navigation d'iOS ou d'Android dans un contexte Web ou cross-platform.

---

## 🎯 1. Les Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les briques (Missions) que tu peux générer :

### 🗂️ 1. Bottom Tabs (`prd_shell_bottom_tabs`)
**Mission :** Shell mobile avec bottom-tabs et header dynamique.
**Design Requis :** Barre de navigation fixée en bas de l'écran avec 3 à 5 icônes.

### 🍔 2. Drawer Latéral (`prd_shell_drawer`)
**Mission :** Shell avec drawer latéral (burger menu).
**Design Requis :** Menu Hamburger en haut à gauche qui fait glisser un panneau latéral (Swipe) recouvrant l'écran (avec un overlay noir transparent).

### ➡️ 3. Navigation Stack (`prd_shell_stack`)
**Mission :** Navigation en stack (push/pop) avec headers animés.
**Design Requis :** Le nouvel écran glisse depuis la droite par-dessus l'ancien. Le header affiche automatiquement un bouton de retour "<".

### 🧙 4. Flow Multi-Écrans (Wizard) (`prd_shell_wizard`)
**Mission :** Shell pour flow multi-écrans type wizard.
**Design Requis :** Pas de menu général, juste un parcours fléché "Étape 1 sur 4" avec un bouton Suivant/Précédent fixe en bas.

### 🔐 5. Routes Protégées (`prd_shell_protected`)
**Mission :** Gestion des routes protégées/logged-out.
**Design Requis :** Écran de chargement initial (Splash screen), puis redirection fluide vers Login ou App.

### 🖥️ 6. Split View (Tablette) (`prd_shell_split_view`)
**Mission :** Master/detail sur tablette (split).
**Design Requis :** Liste fixe à gauche (Master), contenu détaillé dynamiquement affiché à droite (Detail).

### 📤 7. Stack de Modales (`prd_shell_modals`)
**Mission :** Stack de modales mobile-style (bottom sheet + full).
**Design Requis :** Panneaux qui glissent du bas vers le haut (Bottom Sheets) qu'on peut fermer en tirant vers le bas (Swipe-to-dismiss).

### 📶 8. Offline Global (`prd_shell_offline`)
**Mission :** Shell avec gestion offline globale.
**Design Requis :** Petit bandeau rouge en haut "Aucune connexion internet".

### 🔗 9. Deeplinks (`prd_shell_deeplinks`)
**Mission :** Gestion deeplinks / liens dynamiques.
**Design Requis :** Interception d'URLs pour ouvrir directement un écran profond.

### 🎬 10. Intro / Onboarding (`prd_shell_onboarding`)
**Mission :** Sequence d’intro/apprentissage avant app.
**Design Requis :** 3 écrans glissants (Swipe horizontal) avec de belles images expliquant l'app, terminant par un bouton "Démarrer".

---

## 🎨 2. Vision UI/UX & Design System Mobile Shell
* **Directives pour Stitch :** Une PWA (Progressive Web App) parfaite ne doit jamais ressembler à un site web. Empêche le rebond élastique natif (Overscroll behavior), cache les barres de défilement, et gère les Safe Areas (Encoches iPhone).
* **Fixation :** Utilise `h-screen` et `overflow-hidden` sur le conteneur principal `body` pour empêcher le scroll global de la page web.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée une app mobile", c'est la base indispensable (Bottom tabs).*

[INSTRUCTION IA]
Génère une architecture logicielle Mobile-First (PWA) :
- Squelette gérant le Safe Area Inset (`pt-safe-top`, `pb-safe-bottom`).
- Barre de navigation inférieure (Bottom Navigation) parfaitement fixe.
- Composants de Swipe et Gestures (Framer Motion : `drag="y"`).

[STRUCTURE REQUISE]
- `src/core/shell/components/AppShell.tsx`
- `src/core/shell/components/BottomTabs.tsx`
- `src/core/shell/components/MobileHeader.tsx`
- `src/core/shell/components/BottomSheet.tsx`