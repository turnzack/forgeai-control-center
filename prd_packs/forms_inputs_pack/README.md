> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Composants Contrôlés (Forms) et Expérience Utilisateur (UX).
> Ce document est le PRD (Product Requirements Document) du **PACK FORMS & INPUTS SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire des **Composants de Saisie Parfaits (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# ✍️ PACK FORMS & INPUTS (Saisie Complexe)

Ce pack ne génère pas de pages complètes, mais force la création d'inputs de très haute qualité (OTP, Auto-complete, Steppers, Sliders). L'objectif est de supprimer la friction lors de la saisie de données.

---

## 🎯 1. Les Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les briques (Missions) que tu peux générer :

### 📱 1. Wizard Mobile (`prd_form_wizard_mobile`)
**Mission :** Formulaire multi-écran (wizard mobile).
**Design Requis :** Une question par écran. Clavier natif toujours ouvert, gros bouton "Suivant" attaché au-dessus du clavier.

### ⌨️ 2. Keyboard-Aware Container (`prd_form_keyboard_aware`)
**Mission :** Container keyboard-aware (scroll + avoid).
**Design Requis :** Viewport qui se redimensionne dynamiquement quand le clavier virtuel apparaît (Mobile-first).

### 📍 3. Auto-complétion d'Adresse (`prd_form_address_autocomplete`)
**Mission :** Formulaire adresse avec auto-complétion.
**Design Requis :** Input de recherche appelant l'API Google Places ou Mapbox. Remplissage automatique des champs (Ville, Code Postal).

### 💳 4. Paiement CB (`prd_form_cc_payment`)
**Mission :** Flow paiement CB mobile.
**Design Requis :** Formatage automatique des espaces (`1234 5678`), passage automatique au champ "Date" quand les 16 chiffres sont entrés.

### 📅 5. Date / Time Picker Mobile (`prd_form_datetime_picker`)
**Mission :** Date/heure picker mobile-friendly.
**Design Requis :** Rouleaux (Wheels) inspirés de l'UI iOS natif ou grand calendrier plein écran.

### 🔢 6. Stepper Quantité (`prd_form_quantity_stepper`)
**Mission :** Inputs avec stepper (quantité, temps).
**Design Requis :** Boutons `[-]` et `[+]` géants avec le chiffre centré. Maintien du bouton pour augmenter rapidement.

### ⭐ 7. Rating (Étoiles) (`prd_form_rating`)
**Mission :** Rating UX (étoiles, smileys).
**Design Requis :** 5 étoiles interactives. Au clic sur la 5ème, animation de célébration (Confetti).

### 🏷️ 8. Sélecteur Multi-Tags (`prd_form_multi_tags`)
**Mission :** Sélecteur de tags multi-sélection.
**Design Requis :** Input texte. À l'appui sur "Entrée", le texte se transforme en petite "Pilule" (Badge) effaçable avec une croix `x`.

### 🔍 9. Recherche avec Suggestions (`prd_form_search_suggest`)
**Mission :** Barre de recherche avec suggestions.
**Design Requis :** Dropdown de suggestions s'ouvrant en direct (Debounce) sous l'input.

### 🖋️ 10. Signature Tactile (`prd_form_signature`)
**Mission :** Capture signature tactile.
**Design Requis :** Canvas HTML5 vide avec la mention "Signez ici", et un bouton "Effacer".

---

## 🎨 2. Vision UI/UX & Design System Inputs
* **Directives pour Stitch :** La taille des cibles tactiles (Touch targets) doit être de minimum `44px` par `44px` (`min-h-11`).
* **Validation :** Le feedback (Rouge pour erreur, Vert pour succès) doit apparaître pendant la frappe (onChange/onBlur), pas seulement au clic final.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*À utiliser dès qu'un utilisateur demande un composant de saisie avancé.*

[INSTRUCTION IA]
Génère des Inputs React robustes :
- Utilisation des `forwardRef` pour permettre l'intégration avec `react-hook-form`.
- Props d'état (disabled, loading, error, success).
- Accessibilité parfaite (attributs `aria-invalid`, `aria-describedby`).

[STRUCTURE REQUISE]
- `src/shared/components/inputs/SearchAutocomplete.tsx`
- `src/shared/components/inputs/TagSelector.tsx`
- `src/shared/components/inputs/CreditCardInput.tsx`