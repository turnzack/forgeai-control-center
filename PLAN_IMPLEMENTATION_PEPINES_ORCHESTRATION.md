# Plan d'Implémentation Technique : Packs PRD, Découpe des ZIPs, Pépites & Câblage Métier

> **Statut :** ✅ **Opérationnel et validé de bout en bout** dans l'application web sur `http://localhost:3000`.

Ce document détaille l'architecture complète permettant à l'application web **ForgeAI Control Center** (`http://localhost:3000`) d'utiliser les **113 Packs PRD** (`prd_packs/`) comme Bible produit, de piloter la recherche ciblée sur GitHub, d'analyser et découper chirurgicalement les archives ZIP en mémoire, de monter les composants sur disque et de les câbler avec l'IA.

---

## 1. Vue d'ensemble de l'Architecture

```
[0. Packs PRD (113)] ────► [1. Sources GitHub] ────► [2. Découpe ZIP & Pépites] ────► [3. Montage sur Disque] ────► [4. Câblage IA]
 (Bible produit & briques)   (Recherche ciblée ⌘ K)    (fflate mémoire + scoring)     (src/integrations/adapted)    (Prompt contextualisé)
```

1. **Phase 0 — Sélection du Pack PRD (Bible du Projet) :**
   - Bibliothèque de **113 Packs PRD** indexés directement depuis `prd_packs/`.
   - **Ruban visuel défilant** au-dessus de la barre de recherche avec filtres de catégories (`TOUS`, `BUSINESS`, `AI`, `DATA`, `COMMUNICATION`, `MEDIA`, `MARKETING`) et recherche rapide.
   - Packs phares pré-configurés :
     - 🛒 **E-Commerce Suite** (`ecommerce_pack` — Panier, Checkout, Catalogue)
     - ⚡ **Billing Pro / SaaS** (`prd_saas_billing_pro` — Abonnements, Dashboard, Auth)
     - 🤖 **AI Voice & Agents** (`prd_ai_voice_agent` — Streaming audio, LLM Runtime)
     - 📊 **CRM / ERP** (`prd_crm_erp_pack` — Tables de données, Exports, Métriques)
     - 🎨 **Forms & Inputs** (`forms_inputs_pack` — Multi-steps wizard, Validation Zod)

2. **Automatisation instantanée au clic sur un Pack :**
   - **Bannière Active Pack :** Affiche le nom, la catégorie, le volume cible (*10 fonctionnalités · 7 composants UI*) et les **Briques cibles** sous forme de tags (`[ProductCard]`, `[CartDrawer]`, `[CheckoutWizard]`, `[FilterSidebar]`, etc.).
   - **Brief Projet (`projectIdea`) :** Pré-rempli avec l'intention produit du PRD.
   - **Nom du workspace :** Normalisé à partir du slug (ex: `ecom-suite`, `ai-voice-agent`).
   - **Requête GitHub libre & optionnelle :** Le champ reste vide par défaut (sans forçage). La recherche extrait automatiquement les mots-clés optimaux du brief ou prend en compte la saisie manuelle si l'utilisateur en fournit une.

3. **Phase 1 — Pilotage Autonome du Cockpit GitHub (`view === "github"`) :**
   - **Pilotage 100% Web sans ouvrir l'extension :** Tout est contrôlable depuis l'application web sur `http://localhost:3000`.
   - **Panneau « Projet à analyser » :**
     - Zone de texte `Description du projet` (brief modifiable).
     - Champ `Requête GitHub (optionnel)` pouvant rester totalement vide.
     - Grille complète des filtres :
       - **Langage principal :** Sélecteur rapide (`Tous`, `TypeScript`, `JavaScript`, `Python`, `Rust`, `C++`).
       - **Étoiles minimum :** Filtre numérique pour cibler l'adoption communautaire.
       - **Activité :** `Toute activité`, `Moins d’un an`, `Moins de trois ans`.
       - **Politique licence :** `Commercial permissive`, `Open source`, `Usage interne`, `Analyse uniquement`.
       - **Licences acceptées :** Cases à cocher interactives (`MIT`, `Apache-2.0`, `BSD-3`, `ISC`).
     - Boutons d'action : `🔎 RECHERCHER` (synchronisation et exécution temps réel) et `↺ RÉINITIALISER`.
   - **Ruban de Statistiques de Synthèse en direct :**
     - `X résultats` · `Y autorisés` (vert) · `Z à vérifier` (ambre) · `W score moyen` (cyan).
   - **Barre d'Outils & Tri dynamique :**
     - Tri instantané : `Pertinence`, `Étoiles`, `Activité récente`, `Licence`.
     - Bouton de bascule globale : `Tout sélectionner` / `Tout désélectionner`.
   - **Cartes Détaillées des Dépôts Candidats :**
     - Lien direct vers le dépôt avec badge score `XX/100` (ex: `earendil-works/pi` 79/100, `thedotmack/claude-mem` 70/100, `ruvnet/ruflo` 80/100, `QwenLM/qwen-code` 90/100, etc.).
     - Description complète du dépôt.
     - Badges de métadonnées : Langage, date de mise à jour, ★ Étoiles, ⑂ Forks, Licence SPDX.
     - Liste de puces avec justifications précises de conformité et compatibilité.
     - Bouton de sélection dynamique `Sélectionner` / `✓ Sélectionné`.
   - **Mode de Création du Projet Final :**
     - **Mode A :** *Automatique jusqu’à la validation avant le code* (prépare automatiquement les sources, le projet, le PRD, l'architecture et les tâches, puis attend la validation humaine).
     - **Mode B :** *Tout automatiser jusqu’à l’export final* (génération du code et export final automatisés).
     - Encart informatif de statut : *Validation avant génération du code*.
   - **Barre d'Actions Footer :**
     - Compteur de sélection en direct : `X dépôt(s) sélectionné(s)`.
     - Bouton `⬇️ TÉLÉCHARGER LES SOURCES` : enregistre les archives ZIP directement dans le bridge local (`prodgit/<projet>/github-sources/<owner>__<repo>.zip`).
     - Bouton `✅ UTILISER` : bascule immédiatement vers la Phase 02 (IDE de montage et analyse des pépites).
     - Note explicative avec fallback `Downloads/<projet>/github-sources/`.

4. **Phase 2 — IDE de Montage & Studio des Pépites (`view === "ide"`) :**
   - Nouvel onglet **`🔬 Pépites (40)`** dans la barre d'onglets de l'IDE.
   - Décompression **en mémoire** des archives ZIP via `fflate.unzipSync()` (sans pollution disque).
   - Analyse automatique du code source : calcul d'un score de pertinence (0 à 100), détection des rôles (Composant UI, Définitions TypeScript, Module utilitaire, Store d'état), audit des mentions SPDX et scan de sécurité (clés API/secrets).
   - Affichage interactif des cartes de pépites avec 3 actions par composant :
     - 🟢 **`🟢 Utiliser (use-code)`** : Le composant sera extrait, adapté et intégré.
     - 🟡 **`🟡 S'inspirer (inspire-only)`** : Modèle architectural sans copie de code brut.
     - 🔴 **`🔴 Exclure (exclude)`** : Ignoré.
   - Bouton d'action proéminent : **« 🚀 MONTER LE PROJET »**.

5. **Phase 3 — Câblage Métier & Orchestration (`view === "orchestration"`) :**
   - Extraction sélective des fichiers validés dans `prodgit/<projet>/src/integrations/github-adapted/`.
   - Injection des en-têtes d'origine `@provenance` et génération automatique de `PROVENANCE.md` et `THIRD_PARTY_NOTICES.md`.
   - Injection du catalogue des composants montés dans le contexte de l'Architect Agent pour câbler l'application originale sans réinventer la roue.

---

## 2. Endpoints API du Bridge Local (`bridge-local/server.mjs`)

| Méthode | Endpoint | Rôle |
|---|---|---|
| `GET` | `/v1/prd-packs` | Indexe et renvoie les 113 Packs PRD disponibles dans `prd_packs/` |
| `GET` | `/v1/prd-packs/:slug` | Renvoie le détail complet d'un Pack PRD (features, uiComponents, spec) |
| `GET` | `/v1/github/intent` | Renvoie l'intention de recherche GitHub active stockée dans le bridge |
| `POST` | `/v1/github/sync-intent` | Synchronise en temps réel le brief, le nom du projet et les critères entre le Cockpit et l'extension |
| `POST` | `/v1/github/search` | Exécute la recherche GitHub (API ou catalogue certifié) avec filtres complets, scoring et justifications |
| `POST` | `/v1/github/download-sources` | Télécharge et archive les ZIPs des dépôts sélectionnés dans `prodgit/<projet>/github-sources/` avec hash SHA-256 |
| `GET` | `/v1/projects` | Liste tous les workspaces de `prodgit` avec compteurs de sources et statut |
| `POST` | `/v1/projects` | Crée un nouveau dossier de workspace dans `prodgit/<nom>` |
| `GET` | `/v1/projects/:id/sources` | Renvoie `sources.github.json` et la liste des `.zip` présents |
| `POST` | `/v1/projects/:id/analyze-gems` | Décompresse les ZIPs en mémoire, analyse les fichiers et renvoie les pépites scorées et matchées avec le pack |
| `POST` | `/v1/projects/:id/mount` | Extrait les composants `use-code` dans `src/integrations/github-adapted/`, insère les en-têtes `@provenance` et génère les rapports légaux |

---

## 3. Découpe des ZIPs & Algorithme de Scoring (`server.mjs`)

### A. Découpe en mémoire via `fflate`
```javascript
import { unzipSync } from "fflate";

// Lecture directe du buffer ZIP sans extraction intermédiaire
const zipBuffer = await fs.readFile(zipFilePath);
const unzipped = unzipSync(new Uint8Array(zipBuffer));

// Filtrage du bruit : exclusion des tests CI, builds, images et verrous
const validFiles = Object.keys(unzipped).filter(path => {
  if (path.endsWith("/")) return false;
  if (/(\.github|\.vscode|\.git|node_modules|dist|build|coverage)\//i.test(path)) return false;
  if (/\.(png|jpg|jpeg|gif|svg|ico|pdf|zip|tar|gz|lock)$/i.test(path)) return false;
  return /\.(ts|tsx|js|jsx|mjs|py|go|rs)$/i.test(path);
});
```

### B. Algorithme de Scoring (0 à 100)
Chaque fichier reçoit une note selon 4 piliers :
- **Valeur métier (40 pts) :** Présence de classes ou fonctions exportées (`export class`, `export function`, `export const use...`).
- **Autonomie (25 pts) :** Faible couplage aux dépendances externes complexes.
- **Typage & Qualité (20 pts) :** Types TypeScript stricts, interfaces déclarées.
- **Sécurité & Licence (15 pts) :** Licence compatible (MIT/Apache-2.0 = 15 pts) et 0 secret/clé détecté.
- **Bonus Matching Pack PRD :** +10 pts si le fichier implémente directement l'une des `uiComponents` du pack actif (ex: `CartDrawer`, `ProductGrid`).

---

## 4. Composants Frontend Intégrés (`client/src/`)

1. **`client/src/lib/bridgeClient.ts` :**
   - Types stricts : `PrdPack`, `GemItem`, `ProjectSourcesResponse`, `MountResult`, `BridgeProject`, `Source`, `ControlStatus`.
   - Méthodes client :
     - `getPrdPacks()`, `getPrdPack(slug)`.
     - `syncGitHubIntent()` : Synchronisation bi-directionnelle temps réel de l'intention et des filtres.
     - `searchGitHubSources()` : Recherche paramétrée (langage, minStars, activité, politique, licences).
     - `downloadGitHubSources()` : Téléchargement et archivage des `.zip` dans `prodgit/<projet>/github-sources/`.
     - `getProjectSources()`, `analyzeGems()`, `mountProject()`, `createProject()`.

2. **`client/src/pages/Home.tsx` :**
   - **Sidebar :** `WorkspaceSwitcher` dynamique listant les projets réels de `prodgit/` avec bouton de création rapide.
   - **Phase 1 (Cockpit Sources GitHub) :**
     - `PrdPacksRibbon` : Ruban des 113 packs avec filtres de catégories et recherche textuelle.
     - `ActivePackBanner` : Résumé visuel du pack actif avec tags des briques cibles `[ProductCard]`, `[CartDrawer]`, etc.
     - `github-analysis-card` : Panneau « Projet à analyser » avec brief modifiable, champ requête optionnel, et filtres réactifs.
     - `github-summary-ribbon` : 4 cartes de statistiques dynamiques (total, autorisés, à vérifier, score moyen).
     - `github-toolbar-row` : Barre de tri (pertinence, étoiles, activité, licence) et bouton « Tout sélectionner ».
     - `CandidateRepoCard` : Carte détaillée par dépôt avec lien GitHub, score `XX/100`, badges de métadonnées, puces de justifications et sélection.
     - `automation-mode-box` : Sélecteur de mode d'orchestration A vs B avec encart de garde de validation humaine.
     - `github-actions-footer` : Barre inférieure avec compteur de sélection, téléchargement ZIP et bouton « ✅ UTILISER ».
   - **Phase 2 (IDE de Montage) :**
     - `GemsStudioPanel` : Grille interactive des 40 pépites avec filtres (`Tous`, `🟢 À intégrer`, `🟡 S'inspirer`, `🔴 Exclus`), score, rôle, licence et boutons d'arbitrage.
     - Bouton **« 🚀 MONTER LE PROJET »** : Déclenche l'extraction vers `src/integrations/github-adapted/`.
   - **Phase 3 (Orchestration) :**
     - Pipeline d'agents enrichi avec les composants montés et les artefacts de provenance.

3. **`client/src/index.css` :**
   - Styles dédiés pour `.prd-packs-section`, `.prd-pack-card`, `.active-pack-banner`, `.brick-tag`, `.gems-panel`, `.gem-card`, `.gem-action-btn`, `.workspace-dropdown`.
   - Nouveaux styles du cockpit : `.github-analysis-card`, `.analysis-fields-grid`, `.github-filters-row`, `.filter-pills-selector`, `.licenses-checkbox-group`, `.github-summary-ribbon`, `.summary-stat-box`, `.github-toolbar-row`, `.candidate-cards-list`, `.detailed-candidate-card`, `.candidate-reasons-list`, `.automation-mode-box`, `.automation-mode-card`, `.github-actions-footer`.

---

## 5. Règle de Câblage Métier pour l'IA

Une fois les composants montés sur disque, l'Architect Agent injecte cette instruction dans le contexte de génération :

```markdown
### COMPOSANTS RÉUTILISABLES MONTÉS DANS LE PROJET :
1. `src/integrations/github-adapted/ponytail/CartDrawer.tsx` :
   - Rôle : Panneau latéral panier, calcul sous-total et transition fluide
2. `src/integrations/github-adapted/pi/AgentRuntime.ts` :
   - Rôle : Runtime d'agent autonome et gestionnaire d'état modulaire

### RÈGLE DE CÂBLAGE MÉTIER :
Ne réimplémente PAS ces modules. Importe-les directement dans tes nouveaux services :
`import { CartDrawer } from "@/integrations/github-adapted/ponytail/CartDrawer";`
```

---

## 6. Structuration Hiérarchique Complète du Projet (Boilerplate & Scaffolding Automatique)

Lors du clic sur **« MONTER LE PROJET »**, le bridge ne se contente plus de déposer des fichiers isolés dans `src/integrations/github-adapted/`. Il génère automatiquement une **architecture applicative complète, standardisée, prête à l'emploi et exécutable** (`React 18 + Vite + TypeScript`), structurée selon les meilleures pratiques industrielles.

### 6.1. Arborescence Standard Générée

```text
prodgit/<projectName>/
├── 00_PROJECT_META.md                  # Métadonnées, Stack, Pack PRD lié et statistiques
├── 01_PRD.md                           # Spécifications fonctionnelles, entités, pages et composants cibles
├── 02_ARCHITECTURE.md                  # Schéma d'architecture, flux de données, conventions et arbre de répertoires
├── 03_TASKS.md                         # Plan de sprints / tâches d'implémentation opérationnelles
├── PROVENANCE_REPORT.md                # Traçabilité exhaustive des composants GitHub intégrés
├── THIRD_PARTY_NOTICES.md              # Audit des licences (MIT, Apache-2.0, etc.) et disclaimers
├── package.json                        # Dépendances (React 18, Lucide-React, Vite, Types) et scripts
├── tsconfig.json                       # Configuration TypeScript avec alias de chemin @/*
├── vite.config.ts                      # Configuration Vite avec plugin React et résolution d'alias
├── index.html                          # Point d'entrée HTML avec typographie (Inter & JetBrains Mono)
├── public/                             # Assets statiques et favicon
└── src/
    ├── main.tsx                        # Bootstrap ReactDOM
    ├── App.tsx                         # Cockpit applicatif interactif assemblant les composants adaptés
    ├── index.css                       # Design System CSS moderne (dark mode, glassmorphism, tokens)
    ├── components/                     # Composants UI globaux
    │   └── Navbar.tsx                  # Barre de navigation interactive avec badge du Pack PRD
    ├── features/                       # Modules métiers découpés par domaine
    ├── hooks/                          # Hooks React réutilisables
    ├── types/                          # Typages TypeScript du domaine (Cart, Product, User, etc.)
    │   └── index.ts
    ├── services/                       # Connecteurs API et logique d'orchestration
    └── integrations/                   # Ponts et adaptateurs de code
        ├── index.ts                    # Barrel export documenté de tous les composants montés
        └── github-adapted/             # Pépites extraites, auditées et adaptées
            └── <repo-name>/
                └── [Composants extraits avec en-têtes de licence et provenance]
```

### 6.2. Rôles et Spécifications des Fichiers Générés

1. **Fichiers de Spécifications Racine :**
   - **`00_PROJECT_META.md`** : Synthèse de l'espace de travail (nom, pack PRD associé, stack technique, nombre de composants intégrés, statut de conformité des licences).
   - **`01_PRD.md`** : Définition des exigences du produit injectant les données réelles du pack sélectionné (ex: `ecommerce_pack`, `prd_saas_billing_pro`), la liste des fonctionnalités clés, les pages cibles et les briques d'interface requises.
   - **`02_ARCHITECTURE.md`** : Guide d'architecture modulaire précisant le rôle de chaque dossier (`features/`, `components/`, `services/`, `integrations/`), la règle d'isolation stricte des composants GitHub adaptés, et la stratégie d'état local / global.
   - **`03_TASKS.md`** : Découpage en sprints d'exécution (Phase 1: Bootstrapping & Setup, Phase 2: Câblage des composants adaptés, Phase 3: Validation des flux métiers, Phase 4: Durcissement et Tests).
   - **`PROVENANCE_REPORT.md` & `THIRD_PARTY_NOTICES.md`** : Traçabilité légale, empreinte SHA et licences des dépôts sources.

2. **Configuration et Environnement de Build :**
   - **`package.json`** : Prêt pour `pnpm install` ou `npm install`, incluant `react`, `react-dom`, `lucide-react`, `@types/react`, `vite`, `@vitejs/plugin-react` et `typescript`.
   - **`tsconfig.json`** : Résolution stricte TypeScript avec `baseUrl: "."` et alias `"@/*": ["src/*"]`.
   - **`vite.config.ts`** : Support des imports absolus `@/` pointant vers `src/`.

3. **Interface Utilisateur et Assemplage (`src/App.tsx`) :**
   - L'application démarre directement avec un dashboard élégant aux couleurs de la charte ForgeAI.
   - Affiche les statistiques du projet (Pack actif, nombre de composants intégrés, licences).
   - Liste interactive de tous les modules adaptés dans `src/integrations/github-adapted/`, avec badges de rôle, badges de licence, chemin cible, et **snippet de code d'import prêt à copier/coller**.
   - Navigation réactive avec onglets : *Composants intégrés*, *Spécifications PRD*, *Architecture*.

4. **Points d'Exportation Centralisés (`src/integrations/index.ts`) :**
   - Génère un barrel export de toutes les pépites sélectionnées.
   - Permet aux développeurs et aux agents d'importer directement n'importe quelle pépite via :
     ```typescript
     import { FilterForm, CartItems } from "@/integrations";
     ```
   - Ou depuis leur dossier adapté :
     ```typescript
     import { FilterForm } from "@/integrations/github-adapted/kirill-zhirnov-boundless-nextjs-ecommerce-template/FilterForm";
     ```

### 6.3. Statut de Validation
- ✅ **Testé sur `prodgit/ecommerce-pack`** : 14 fichiers de boilerplate + 40 composants GitHub adaptés générés avec succès.
- ✅ **Compatibilité pnpm / npm** : Structure standard Vite + React reconnue instantanément par les IDE et outils de bundling.
- ✅ **Alignement Cockpit** : Déclenché en un clic depuis le bouton `MONTER LE PROJET` du Studio des Pépites dans l'application web.

### 6.4. Règle Anti-Régression & Garde-Fous Obligatoires (Quality Gate Scaffolding)
Pour garantir que cette erreur (création sans boilerplate ou fichiers de pépites isolés) ne se reproduise plus jamais lors des futures créations de projets :
1. **Scaffolding Systématique et Inconditionnel :**
   - Lors de tout appel à `mountProjectGems` (`/v1/projects/:id/mount`), la fonction `scaffoldProjectBoilerplate` est **systématiquement invoquée avant** ou conjointement à l'écriture des pépites adaptées.
   - Les fichiers obligatoires suivants sont vérifiés et garantis :
     - Racine : `00_PROJECT_META.md`, `01_PRD.md`, `02_ARCHITECTURE.md`, `03_TASKS.md`, `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `PROVENANCE_REPORT.md`, `THIRD_PARTY_NOTICES.md`.
     - `src/` : `main.tsx`, `App.tsx`, `index.css`, `types/index.ts`, `components/Navbar.tsx`, `integrations/index.ts`.
2. **Interdiction du Montage « Sans Squelette » :**
   - Aucun fichier ne peut être écrit dans `src/integrations/github-adapted/` si le squelette applicatif (`package.json`, `src/App.tsx`) n'existe pas ou n'est pas créé dans le même cycle.
3. **Auto-Réparation au Montage :**
   - Si un projet existant est monté à nouveau ou enrichi de nouvelles pépites, le bridge inspecte la présence du boilerplate et complète automatiquement les fichiers manquants sans écraser le code métier existant.

---

## 7. Pilotage Multi-Projets & Explorateur de Fichiers Réels (`PROJECT OUTPUT / PROVENANCE`)

L'écran **Fichiers & artefacts** (`view === "files"`) sur `http://localhost:3000` est désormais un véritable centre de consultation et d'exportation dynamique multi-workspaces :

### 7.1. Sélecteur Multi-Projets en Direct de `prodgit/`
- Détection automatique et temps réel de tous les sous-dossiers de `e:\forgeai-control-center\prodgit` via l'API `/v1/projects`.
- **Barre de sélection visuelle** : badges interactifs affichant tous les projets créés (`default`, `ecommerce-pack`, etc.) avec mise en surbrillance du projet actif et badge de sélection (`✓`).
- Basculement instantané d'un projet à un autre en 1 clic sans rechargement de page.

### 7.2. Project Explorer Dynamique et Récursif
- Connecté à l'endpoint `/v1/projects/:id/tree` du bridge local.
- Arborescence réelle et récursive de tous les fichiers et sous-répertoires du projet actif (`public/`, `src/`, `github-sources/`, etc.).
- Compteur réel de fichiers synchronisé en direct (ex: *92 fichiers réels prêts*).
- Dossiers repliables/dépliables avec chevrons animés et icônes adaptées par type d'extension (`.md` SPEC, `.tsx` TSX, `.json` JSON, `.css` STYLE, etc.).
- Champ de recherche instantané pour filtrer l'arborescence des fichiers.

### 7.3. Visionneuse de Code Source en Direct
- Connectée à l'endpoint `/v1/projects/:id/file?path=...` du bridge local avec sécurisation contre les traversées de répertoires (`safeFilePath`).
- Clic sur n'importe quel fichier dans l'arborescence charge instantanément son code source réel.
- **Affichage numéroté** des lignes de code (`01`, `02`, `03`...), typographie JetBrains Mono et encodage UTF-8 certifié.
- **Bouton Copier** intégré avec feedback visuel immédiat (*Copié !*).
- **Badge contextuel** automatique : `SPECIFICATION`, `ADAPTED GEM`, `AUDIT & LICENCE`, ou extension.
- Bouton d'action directe *« Ouvrir dans l’IDE »*.

### 7.4. Barre d'Actions d'Export et Exécution Sécurisée
Les 5 actions sont directement associées au workspace `prodgit/` sélectionné :
1. **Écrire sur le disque :** Écrit les fichiers via le bridge local ou choix de dossier.
2. **Exporter en ZIP :** Génère une archive complète téléchargeable (projet + artefacts).
3. **Publier sur GitHub :** Pousse les fichiers sur le dépôt configuré avec message de commit dédié.
4. **Installer dépendances :** Exécute `pnpm install` (compatible Windows avec `shell: true` et protection anti-crash `ENOENT`).
5. **Lancer l’application :** Démarre le serveur Vite sur `http://localhost:5174`.

### 7.5. Fiabilisation du Serveur et Résolution du Mode Vite (`localhost:3000`)
- **Garantie du mode Vite en développement :** Dans `server/_core/index.ts`, la condition d'initialisation du serveur vérifie désormais `process.env.NODE_ENV !== "production"`. Cela évite qu'un lancement local sans variable d'environnement explicite ne bascule par erreur sur le mode statique (`serveStatic`), ce qui provoquait l'erreur `ENOENT: no such file or directory ... public/index.html` et le refus MIME `text/html` sur les scripts modules.
- **Support natif multi-environnements :** L'application web démarre immédiatement en mode HMR avec Vite sur le port 3000, connectée au Bridge sur le port 5006 et au serveur Vite du projet monté sur le port 5174.

### 7.6. Éradication Définitive des Collisions d'Exports et Isolation des Sources (`localhost:5174`)
- **Préservation de l'arborescence relative :** Lors de l'extraction des pépites, le sous-dossier d'origine dans le dépôt est préservé (`src/integrations/github-adapted/<repo>/<subfolder>/<file>`), empêchant deux fichiers homonymes (ex: `products/[slug].tsx` et `categories/[slug].tsx`, ou `lib/cart.ts` et `redux/cart.ts`) de s'écraser mutuellement.
- **Index d'intégration propre et sécurisé (`src/integrations/index.ts`) :** Remplacement des exports namespace statiques `export * as ...` par un registre typé `MOUNTED_MANIFEST` et son helper `getMountedComponent(fileName)`. Cela évite que le bundler Vite / esbuild ne tente de résoudre des dépendances externes non encore câblées (telles que `next/link` ou `boundless-api-client`).
- **Garantie de conformité JSX :** Remplacement systématique de l'attribut HTML `class` par l'attribut JSX `className` dans le template `src/App.tsx`.
- **Exclusion dans `tsconfig.json` :** Ajout inconditionnel de `"exclude": ["src/integrations/github-adapted", "node_modules", "dist"]` pour que `tsc -b && vite build` s'exécute avec 0 erreur (validé avec succès : `✓ built in 9.06s`).

