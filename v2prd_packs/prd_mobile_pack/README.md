> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé dans le développement Mobile Natif et PWA (Progressive Web Apps).
> Ce document est le PRD (Product Requirements Document) du **PACK MOBILE SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Visionnaire, Moderne et Ultra-Fluide (UI/UX)** capable d'imiter le comportement d'une application iOS/Android native directement dans un navigateur, tout en respectant strictement les règles métier ci-dessous.

# 📱 PACK MOBILE (Architecture App-Like)

Ce pack force la création d'interfaces qui ne se comportent pas comme des sites web, mais comme de véritables applications natives mobiles. L'objectif est de supprimer le "scroll" infini des pages web classiques pour le remplacer par un système de navigation en profondeur (Stack) et des onglets (Tabs).

---

## 🎯 1. La Mission Principale (Mobile Tab Navigation)

**Mission :** Créer un système de navigation fluide et intuitif pour applications mobiles.
L'application générée doit être optimisée pour l'ergonomie à une main (Bottom-first design) et offrir des transitions instantanées.

### 🧩 Core Features Architecturaux Requis :
1. **Bottom Tab Bar (Onglets principaux) :** Une barre de navigation persistante en bas de l'écran avec 3 à 5 icônes distinctes.
2. **Stack Navigation (Profondeur) :** Une navigation en "piles" (Stack). Lorsqu'on clique sur un élément d'une liste, la nouvelle vue doit "glisser" par-dessus la vue actuelle (Slide in from right).
3. **Gestures (Swipe to back) :** Possibilité de glisser depuis le bord gauche de l'écran pour revenir en arrière.
4. **Header Natif (Top Bar) :** Une barre supérieure fixe affichant le titre de l'écran actuel et un bouton de retour si nécessaire.

---

## 🎨 2. Vision UI/UX & Design System Global Mobile
* **Directives pour Stitch :** Une interface mobile doit maximiser l'espace. Les marges extérieures de l'écran (`padding`) doivent être constantes (ex: `px-4` ou `px-5`).
* **Animations :** Utilise `framer-motion` pour reproduire les transitions d'iOS (Push/Pop). Lorsqu'un nouvel écran s'ouvre, l'écran précédent s'assombrit légèrement et recule.
* **Typographie & Touch Targets :** Les polices doivent être grandes (`text-base` ou `text-lg`). Tous les éléments cliquables doivent mesurer au minimum `44x44px` (Touch target size d'Apple) pour éviter les erreurs de clic avec le pouce.
* **Sécurité & Safe Areas :** Gérer les "Safe Areas" des iPhones (encoches/Notch et barre d'accueil en bas) via les classes CSS `pb-safe` et `pt-safe`.

## ⚙️ 3. Directives de Câblage (VFS)
**Composants React obligatoires à implémenter :**
- `TabNavigator.tsx` (Conteneur principal gérant l'état de l'onglet actif)
- `StackNavigator.tsx` (Gestionnaire d'historique de navigation)
- `HomeScreen.tsx` (Écran principal par défaut)
- `TabBarIcon.tsx` (Composant d'icône avec état actif/inactif coloré)

*L'utilisation de React Router DOM (v6+) avec une configuration optimisée pour le mobile, ou une implémentation locale de gestion d'état est requise.*

---
### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Lorsque l'utilisateur demandera "Crée moi la structure de mon app mobile type Instagram", tu devras utiliser ce PRD Mobile comme squelette. Tu injecteras une Tab Bar en bas (Accueil, Recherche, Ajouter, Profil) et tu t'assureras que le défilement vertical n'affecte que le contenu intérieur (overflow-y-auto) sans faire bouger les barres de navigation natives.*