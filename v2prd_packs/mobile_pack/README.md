> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Développement Mobile-First et React Native / PWA.
> Ce document est le PRD (Product Requirements Document) du **PACK MOBILE SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Tactile Native-Like (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 📱 PACK MOBILE (Composants Tactiles & Navigation)

Ce pack force la création d'expériences conçues exclusivement pour être manipulées au doigt. Il s'assure que l'application web ressemble et se comporte exactement comme une application native (iOS/Android).

---

## 🎯 La Mission Principale (Architecture Mobile-First)

**Mission :** Générer une interface utilisateur optimisée pour les écrans étroits et les interactions tactiles.

### 🧩 Core Features Architecturaux Requis :
1. **Bottom Navigation Bar :** Barre de navigation fixée en bas de l'écran avec 3 à 5 icônes principales (Accueil, Recherche, Profil, etc.).
2. **Cibles Tactiles Larges (Touch Targets) :** Tous les boutons et liens interactifs doivent faire au minimum 44px de hauteur (`h-11` ou `min-h-[44px]`) pour éviter les "Missclicks".
3. **Gestures (Swipe) :** Implémentation d'éléments réagissant au balayage (Swipe-to-delete sur des éléments de liste, Swipe pour fermer une modale).
4. **Header Rétractable :** Le header supérieur disparaît doucement lorsqu'on scrolle vers le bas pour maximiser l'espace de lecture.

---

## 🎨 Vision UI/UX & Design System Mobile
* **Directives pour Stitch :** Les polices doivent être très lisibles. Évite les petites tailles de police. Le design doit être contenu dans un div central (`max-w-md mx-auto`) pour que l'app mobile soit présentable même si elle est ouverte sur un grand écran de bureau.
* **Feedbacks Haptiques Visuels :** Au clic sur un élément de liste, l'élément doit avoir un effet de "Ripple" (onde) ou un changement de fond rapide (`active:bg-slate-100`) pour confirmer l'action.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*À utiliser chaque fois que l'utilisateur précise vouloir une "Application Mobile" plutôt qu'un "Site Web".*

[INSTRUCTION IA]
Génère une architecture Mobile Native-like :
- Utilisation des icônes `lucide-react` avec un trait (stroke-width) épais pour bien ressortir sur mobile.
- Pas de "Hovers" CSS (`hover:`) car ils ne fonctionnent pas sur les écrans tactiles, privilégie les états `:active`.
- Désactive la sélection de texte (User-select none) sur l'interface (menus, boutons) pour éviter l'effet "loupe bleue" d'iOS.

[STRUCTURE REQUISE]
- `src/core/mobile/layout/MobileAppShell.tsx`
- `src/core/mobile/components/BottomNav.tsx`
- `src/core/mobile/components/TouchableListRow.tsx`
- `src/core/mobile/components/SwipeActionContainer.tsx`