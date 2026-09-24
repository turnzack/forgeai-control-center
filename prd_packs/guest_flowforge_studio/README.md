# 🏆 Flowforge Studio — SPÉCIFICATION DEV SENIOR LEAD & BOILERPLATE GOLD
## [PRD PACK OFFICIEL — ARCHITECTURE PRODUCTION-READY]

> **DIRECTIVE SYSTÈME SENIOR LEAD ENGINEER**  
> Tu agis en tant que **Staff Principal Engineer & Solutions Architect**. Ce document définit le cahier des charges technique inébranlable pour la conception et le déploiement du pack **guest_flowforge_studio** au Grade Gold. Chaque composant généré doit être 100% exécutable, typé strictement et compatible avec nos boilerplates Cloudflare Hono / Vite React.

---

## 📐 1. OBJECTIFS & PROPOSITION DE VALEUR

- **Stabilité de production** : zéro code temporaire, zéro mock statique fragile.
- **Architecture scalable** : séparation stricte de la logique métier (hooks / services), de l’accès aux données (APIs / D1 / KV) et des vues UI réactives.
- **Compatibilité universelle** : conçu pour s’intégrer nativement dans les architectures Edge (Cloudflare Pages/Workers) et les applications Web modernes (React 18+, Vite, Next.js).
- **Domaine d'application** : SaaS Platform, Workflow Orchestration & Productivity.
- **Pack réutilisable** : sert de modèle de production pour les équipes de dev et les orchestrateurs IA.

---

## 🛠 2. STACK TECHNIQUE & STANDARDS D’IMPLÉMENTATION

- **Langage & typage** : TypeScript 5.5+ (`strict: true`, Zod pour la validation runtime).
- **Frontend & UI** : React 18+, Tailwind CSS avec tokens sémantiques, Lucide Icons, support natif Dark/Light.
- **Backend & Edge services** : Hono v4, Cloudflare D1 (SQLite relationnel), Cloudflare KV & R2.
- **Performance & sécurité** : lazy loading, gestion optimiste de l’état, assainissement strict des entrées.
- **IA & design** : Google Stitch pour la génération d’UI interactive, Gemini 3.1 (Nano Banana Pro, Imagen 4) pour les assets graphiques haute fidélité.

---

## 📦 3. STRUCTURE DU PACK PROJET

Ce pack suit la structure standardisée du Plan Directeur pour être exploitable par l'ensemble des agents IA spécialisés :

```text
guest_flowforge_studio/
├── 00-PACK-MANIFEST.md
├── 01-PROJECT-BRIEF.md
├── 02-PRD.md
├── 03-BUSINESS-LOGIC.md
├── 04-USER-FLOWS.md
├── 05-DESIGN-SYSTEM.md
├── 06-UI-SCREEN-SPECS.md
├── 07-TECHNICAL-ARCHITECTURE.md
├── 08-DATA-MODEL.md
├── 09-API-CONTRACTS.md
├── 10-AI-IMAGE-GUIDELINES.md
├── 11-DEV-RULES.md
├── 12-SECURITY-RULES.md
├── 13-TESTING-STRATEGY.md
├── 14-SPRINT-PLAN.md
├── 15-TASKLIST.md
├── 16-WALKTHROUGH.md
├── 17-ACCEPTANCE-CRITERIA.md
├── 18-CHANGELOG.md
├── 19-AI-CONTEXT.md
├── 20-PROMPT-ROUTER.md
├── prompts/
│   ├── 01-product-architect.md
│   ├── 02-ux-ui-designer.md
│   ├── 03-stitch-ui-generator.md
│   ├── 04-senior-frontend-engineer.md
│   ├── 05-backend-engineer.md
│   ├── 06-test-engineer.md
│   ├── 07-reviewer.md
│   └── 08-release-manager.md
```

---

## 🧭 4. BRIEF PROJET & PRD

### 4.1 Brief projet (`01-PROJECT-BRIEF.md`)
- **Nom du produit** : Flowforge Studio Platform
- **Résumé** : Solution hautement performante dédiée à SaaS Platform, Workflow Orchestration & Productivity.
- **Problème utilisateur** : Absence de système intégré, fiable, rapide et respectant les contraintes Zero-Trust et Edge-First.
- **Personas** : Ingénieurs, Chefs de projet, Utilisateurs finaux exigeants.
- **Plateformes cibles** : Web Desktop & Mobile PWA.
- **Style visuel** : Professionnel, sobre, design system Forge AI, dashboard bento-grid, tables avec filtres puissants.

### 4.2 PRD (`02-PRD.md`)
- **F01 — Gestion & Indexation Principale** : Filtrage, pagination déterministe, recherche floue instantanée.
- **F02 — Mutation & Synchronisation Edge** : Validation Zod, synchronisation optimiste, gestion des pannes réseau.
- **F03 — Observabilité & Sécurité** : Logs d'audit, quotas d'appels, politique CORS stricte.

---

## 🤖 5. RÔLES ET RÈGLES SYSTÈME DES ASSISTANTS

### 5.1 Règles transversales (valables pour tous)
- Ne jamais inventer une règle métier absente du PRD.
- Ne jamais générer une fonctionnalité non listée dans le PRD.
- Ne jamais remplacer une vraie intégration par un mock silencieux.
- Ne jamais produire de code sans types ni validation.
- Ne jamais créer un écran sans états loading (Skeleton), empty, error et success.
- Tout composant UI doit utiliser les tokens du design system.

### 5.2 Rôles spécialisés
- **Product Architect** : découpage fonctionnel atomique et matrice exigences/tests.
- **UX/UI Designer** : tokens de design system, composants atomiques et accessibilité WCAG AA.
- **Senior Frontend Engineer** : architecture React/Vite modulaire, hooks dédiés, typage strict.
- **Senior Backend Engineer** : Hono v4, Cloudflare D1 avec transactions et requêtes préparées.
- **AI Integration Engineer (Gemini / Stitch)** : génération d'UI via Stitch et d'assets via Gemini 3.1.
- **Test Engineer & Reviewer** : couverture des scénarios d'erreur, tests de charge et audit de conformité.

---

## 🎨 6. DESIGN SYSTEM & SPÉCIFICATIONS UI

### 6.1 Design System (`05-DESIGN-SYSTEM.md`)
- **Palette** : Primaire `#4F46E5`, Accent `#06B6D4`, Background `#F8FAFC` (Light) / `#0F172A` (Dark).
- **Typographie** : Inter / system-ui, échelle modulaire stricte (`text-xs` à `text-4xl`).
- **Espacements & Rayons** : Grille 4px/8px, `rounded-xl` par défaut pour les conteneurs et cartes.

### 6.2 Spécifications des écrans (`06-UI-SCREEN-SPECS.md`)
- **Écran SCR-001** : `Project Dashboard & Workflows` (Route : `/dashboard`)
- **Écran SCR-002** : `Item Inspector & Settings Drawer` (Route : `/items/:id`)

---

## 🧵 7. UTILISER GOOGLE STITCH AVEC CES SPÉCIFICATIONS

### Prompt Stitch pour l'écran SCR-001 :
```text
# STITCH PROMPT — SCR-001 Project Dashboard & Workflows

Contexte produit :
Application SaaS Platform, Workflow Orchestration & Productivity grade Gold pour utilisateurs professionnels.

Objectif :
Permettre de visualiser, filtrer et gérer les flux de données en temps réel.

Layout :
- Shell applicatif avec navigation latérale et header contextuel.
- Contenu principal structuré en grille bento ou table réactive.

Composants requis :
TopNav, StatsOverview, FilterBar, DataGrid/CardDeck, SkeletonLoader, ErrorBanner, EmptyState.

États obligatoires :
- Nominal avec données réelles.
- Chargement avec skeletons animés.
- Vide (Empty State) avec call-to-action d'onboarding.
- Erreur avec bouton Retry explicite.

Style visuel :
- Couleurs : Fond clair/sombre, accent #4F46E5.
- Typographie Inter, densité optimale, micro-bordures élégantes.
```

---

## 🖼 8. GÉNÉRATION D’IMAGES AVEC GEMINI 3.1 & NANO BANANA PRO

### Template de Prompt Gemini 3.1 :
```text
Génère une image de type SaaS Concept Illustration pour le module Flowforge Studio.

Contexte produit :
SaaS Platform, Workflow Orchestration & Productivity - Interface logicielle moderne et professionnelle.

Sujet :
Graphiques décisionnels 3D isométriques épurés représentant l'orchestration de données

Style :
Épuré, ultra haute définition, éclairage soigné, rendu 3D subtil ou flat tech moderne.

Palette :
Dominante #4F46E5 avec touches d'accent #06B6D4.

Composition :
Cadrage équilibré, espace négatif suffisant pour intégration dans un layout d'interface, pas de bruit visuel.

Format :
16:9 (Hero banner) ou 1:1 (Card asset).

Contraintes impératives :
- Cohérence totale avec le design system du pack.
- Sans texte, sans watermark, sans logo tiers.
- Utilisable directement en asset SVG/PNG haute résolution.
```

---

## 🏗 9. ARCHITECTURE TECHNIQUE NON-GÉNÉRIQUE

- **Frontend** : React 18 + Vite (ou Next.js App Router).
- **Backend Edge** : Hono v4 sur Cloudflare Workers / Pages.
- **Base de données** : Cloudflare D1 avec clés étrangères et indexes dédiés.
- **Validation** : Zod pour chaque requête entrante et contrat JSON sortant.

---

## 🧪 10. BOILERPLATE CONCRET NON-GÉNÉRIQUE DU PACK

```typescript
// features/guest_flowforge_studio/types/index.ts
import { z } from 'zod';

export const guest_flowforge_studio_Schema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  status: z.enum(['active', 'pending', 'archived']),
  metadata: z.record(z.unknown()).optional(),
});

export type GuestFlowforgeStudioEntity = z.infer<typeof guest_flowforge_studio_Schema>;
```

```typescript
// features/guest_flowforge_studio/hooks/useGuestFlowforgeStudio.ts
import { useState, useEffect, useCallback } from 'react';
import type { GuestFlowforgeStudioEntity } from '../types';

export function useGuestFlowforgeStudio() {
  const [data, setData] = useState<GuestFlowforgeStudioEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/guest_flowforge_studio');
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const json = await res.json();
      setData(json.items || []);
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue lors du chargement');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { data, isLoading, error, refetch: fetchItems };
}
```

---

## ⚡ 11. INSTRUCTIONS D’EXÉCUTION ONE-SHOT POUR L'IA (DEV PROMPT)

1. Valider le contrat Zod et le modèle de données D1.
2. Développer les routes API Hono sécurisées (`/api/guest_flowforge_studio`).
3. Générer les composants UI réactifs avec Tailwind CSS en respectant le Design System.
4. Intégrer les prompts Stitch pour les wireframes et Gemini pour les illustrations d'onboarding.
5. Vérifier la conformité de build `vite build` sans aucune erreur de typage.
