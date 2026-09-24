> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Applications de Santé, Quantified Self et Fitness.
> Ce document est le PRD (Product Requirements Document) du **PACK HEALTH & FITNESS SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Apaisante, Analytique et Motivante (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 🏥 PACK HEALTH & FITNESS (Santé & Sport)

Ce pack force la création d'applications axées sur le bien-être, le tracking biométrique ou les entraînements (façon Apple Health, Strava ou Calm). 

---

## 🎯 1. Les Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les briques (Missions) que tu peux générer :

### 👣 1. Suivi des Pas (`prd_health_step_tracker`)
**Mission :** Suivi pas/journée.
**Design Requis :** Anneau de progression (Activity Ring) circulaire.

### 💧 2. Rappels d'Hydratation (`prd_health_hydration`)
**Mission :** Rappels hydratation.
**Design Requis :** Jauge en forme de bouteille/verre qui se remplit d'eau visuellement.

### 🏋️ 3. Entraînements (`prd_health_workout_plan`)
**Mission :** Planning entraînements.
**Design Requis :** Liste d'exercices avec minuteur de repos intégré (Rest timer).

### 😌 4. Journal d'Humeur (`prd_health_mood_journal`)
**Mission :** Journal humeur quotidien.
**Design Requis :** Sélecteur d'emojis rapides et zone de texte de journal intime.

### 😴 5. Tracking de Sommeil (`prd_health_sleep_tracker`)
**Mission :** Tracking sommeil (manuel/auto).
**Design Requis :** Graphique à barres horizontales (Éveillé, Paradoxal, Profond) en mode sombre.

### 🥗 6. Log Alimentation (`prd_health_macro_tracker`)
**Mission :** Log alimentation (macro).
**Design Requis :** Macro-calculateur (Protéines, Glucides, Lipides) en graphiques donut.

### 😮‍💨 7. Respiration Guidée (`prd_health_breathing`)
**Mission :** Exercices respiration guidés.
**Design Requis :** Cercle qui s'agrandit (Inhale) et se rétrécit (Exhale) fluidement au centre de l'écran.

### 🧘 8. Méditation (`prd_health_meditation`)
**Mission :** Sessions audio méditation.
**Design Requis :** Lecteur audio apaisant, fonds avec dégradés animés lents (Gradients mesh).

### 🎯 9. Objectifs Multi-Metrics (`prd_health_goals`)
**Mission :** Objectifs santé multi-metrics.
**Design Requis :** Dashboard global réunissant Poids, Tension, ou Mensurations.

### 🤒 10. Journal de Symptômes (`prd_health_symptoms`)
**Mission :** Suivi symptômes/journal santé.
**Design Requis :** Body-map interactif (cliquer sur la zone douloureuse) ou tags rapides.

---

## 🎨 2. Vision UI/UX & Design System Health
* **Directives pour Stitch :** Les applications de santé mentale nécessitent des couleurs pastels, des typographies rondes et beaucoup d'espace respirable. Les apps de sport nécessitent des couleurs fluo (Jaune, Vert pomme) sur fond sombre.
* **Accessibilité :** Grand contraste indispensable.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée une app de fitness et de méditation", fusionne `prd_health_workout_plan` avec `prd_health_breathing`.*

[INSTRUCTION IA]
Génère une architecture d'application de Santé & Bien-être :
- Composants de graphiques de santé (Chart.js / Recharts) ronds et "Friendly".
- Interfaces d'entrée de données (Data Entry) extrêmement rapides pour ne pas démotiver l'utilisateur.
- Animations de "respiration" ou de "flow" (CSS Keyframes lents).

[STRUCTURE REQUISE]
- `src/features/health/pages/HealthDashboard.tsx`
- `src/features/health/components/ActivityRings.tsx`
- `src/features/health/components/MacroDonut.tsx`
- `src/features/health/components/BreathingCircle.tsx`