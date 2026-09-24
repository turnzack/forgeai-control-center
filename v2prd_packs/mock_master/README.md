> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Mocking de Données, TDD (Test Driven Development) et Architecture Frontend-First.
> Ce document est le PRD (Product Requirements Document) du **PACK MOCK MASTER SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Architecture Indépendante du Backend**, tout en respectant strictement les règles métier ci-dessous.

# 🎭 PACK MOCK MASTER (Architecture de Fausses Données)

Ce pack force la création d'architectures capables de tourner 100% en local sans aucun serveur Backend (Serveurless/API-less). C'est vital pour tester des interfaces (UI) avant le développement des vraies bases de données.

---

## 🎯 La Mission Principale (Indépendance Front-end)

**Mission :** Générer une couche de données fictives (Mock Data Layer) réaliste et persistante côté client.

### 🧩 Core Features Architecturaux Requis :
1. **Mock API Interceptors :** Utilisation d'outils comme MSW (Mock Service Worker) ou MirageJS pour intercepter les requêtes `fetch/axios` et renvoyer de fausses réponses JSON (Délais réseaux simulés inclus).
2. **Générateur de Data (Faker) :** Génération de données réalistes (Noms, Avatars, Adresses) à la volée.
3. **Local Persistance :** Sauvegarde des fausses données mutées (POST, PUT, DELETE) dans le `localStorage` ou `IndexedDB` pour que le rechargement de page ne réinitialise pas tout.

---

## 🎨 Vision UI/UX & Design System Mocks
* **Directives pour Stitch :** Prévois un "DevTool" caché (ex: Raccourci `Ctrl+Shift+M`) qui fait apparaître un panneau de contrôle en bas de l'écran pour "Réinitialiser la fausse base de données" ou "Simuler une erreur 500".

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*À utiliser pour initialiser n'importe quel projet sans dépendance backend.*

[INSTRUCTION IA]
Génère une architecture Mock-First :
- Fichiers contenant de grands JSON réalistes (Fixtures).
- Fonctions simulant des appels API asynchrones (ex: `await delay(500)`).
- Structure prête à être échangée par de vraies requêtes réseau (Interface / Typage strict) une fois le backend prêt.

[STRUCTURE REQUISE]
- `src/mocks/handlers.ts`
- `src/mocks/db.ts` (Données initiales)
- `src/api/apiClient.ts` (Interface qui tape sur les mocks pour l'instant)