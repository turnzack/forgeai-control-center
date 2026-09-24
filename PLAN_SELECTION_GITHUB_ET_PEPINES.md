# PLAN — SÉLECTION GITHUB & PÉPITES RÉUTILISABLES
**Version de référence pour le cockpit `prodgit`**

---

## 🎯 Objectif
Décrire précisément comment un pack PRD ou un prompt devient une recherche GitHub, comment les dépôts sont filtrés et notés, puis comment les composants réutilisables sont importés sans confondre découverte, validation de licence et intégration au projet.

> [!IMPORTANT]
> **Point juridique fondamental :** Une licence SPDX reconnue n’est pas une certification juridique de tout le contenu du dépôt. Le système affiche un statut technique (*approuvé, avertissement, rejeté ou inconnu*) et réserve la validation finale des images, polices, exemples et dépendances à une revue humaine.

---

## 1. Modèle mental du système

Le cockpit manipule trois concepts distincts :
- **Workspace :** dossier local ouvert, par exemple `prodgit/crm-erp-pack`.
- **Pack PRD :** intention fonctionnelle sélectionnée dans la bibliothèque, par exemple `CRM/ERP Pack`.
- **Cible :** produit ou sous-système auquel les résultats sont destinés, par exemple `E-Commerce Suite` ou `Skill UI/UX`.

Ces valeurs doivent être synchronisées. Cliquer sur un dossier ne doit pas conserver une cible par défaut provenant d’un ancien pack. Le dossier actif doit d’abord être identifié, puis le pack, le brief des agents et la requête GitHub doivent être recalculés.

### État Central Recommandé :
```typescript
interface SessionContext {
  workspacePath: string;
  workspaceId: string;
  activePackId: string | null;
  targetId: string | null;
  userPrompt: string;
  generatedQuery: string;
  searchSessionId: string;
  selectedCandidates: CandidateRepo[];
  mountedComponents: MountedComponent[];
}
```

---

## 2. Cycle complet de sélection (10 Étapes)

| N° | Étape | Entrée | Traitement | Sortie |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Synchroniser** | Clic dossier ou pack | Identifier workspace, pack et cible | Contexte actif cohérent |
| **2** | **Comprendre** | Pack PRD + prompt | Extraire domaine, framework, contraintes | Intention structurée |
| **3** | **Générer** | Intention structurée | Construire requête GitHub et filtres | Query versionnée |
| **4** | **Chercher** | Query + page | Appeler Search repositories | Dépôts candidats |
| **5** | **Filtrer** | Candidats | SPDX, archivage, activité, forks | Candidats admissibles |
| **6** | **Scorer** | Métadonnées + texte | Calculer pertinence UI | Classement /100 |
| **7** | **Inspecter** | Dépôt choisi | README, licence, arborescence, dépendances | Fiche d’audit |
| **8** | **Préparer** | Dépôt approuvé | Télécharger archive, extraire, isoler | Source locale |
| **9** | **Monter** | Source locale | Manifest et provenance immuable | Composant disponible |
| **10** | **Utiliser** | Composant monté | Validation build, tests et adaptation | Intégration projet |

---

## 3. Synchronisation pack / workspace

Le problème observé — *Workspace : prodgit/crm-erp-pack · Cible : E-Commerce Suite* — provenait d’un état partiellement synchronisé : le dossier était CRM/ERP, tandis que la carte active restait E-Commerce Suite.

### Règle de résolution :
1. Normaliser le chemin du dossier.
2. Chercher le pack dont le `workspaceId`, `slug` ou manifeste correspond.
3. Si une correspondance existe, activer ce pack automatiquement.
4. Recalculer `targetId`, `brief`, `query` et `filtres`.
5. Si aucune correspondance n’existe, afficher **« pack à confirmer »** au lieu d’inventer une cible.

```typescript
function resolveContext(workspacePath: string, packs: PrdPack[]) {
  const normalized = workspacePath.replace(/\\/g, "/").split("/").pop() || "";
  const match = packs.find(p => p.slug === normalized || p.name.toLowerCase().includes(normalized.toLowerCase()));
  return match
    ? { workspacePath, activePackId: match.slug, targetId: match.slug, brief: match.description }
    : { workspacePath, activePackId: null, targetId: null, brief: null };
}
```

---

## 4. Pack ou prompt : génération de requête

Un pack fournit un socle contrôlé. Le prompt utilisateur ajoute ou modifie l’intention. Il faut conserver les deux séparément pour rendre la recherche explicable.

| Contexte | Requête de base générée |
| :--- | :--- |
| **CRM / ERP** | `crm erp pipeline kanban deal react typescript license:mit` |
| **UI/UX Design System** | `design system ui kit components react typescript license:mit` |
| **SaaS Billing** | `saas billing stripe subscription metrics react typescript license:mit` |
| **IA Vocal & Agent** | `ai voice agent chat assistant webrtc react typescript license:mit` |

### Exemple de contrat JSON :
```json
{
  "packId": "composant_pack",
  "targetId": "skill-uiux",
  "prompt": "composants accessibles pour design system",
  "keywords": ["design system", "ui kit", "components", "react", "typescript"],
  "licenses": ["MIT", "Apache-2.0", "BSD-3-Clause"],
  "query": "design system ui kit components react typescript license:mit"
}
```

---

## 5. Recherche GitHub et opérateurs

Le backend appelle `/search/repositories` avec une requête encodée.
- Opérateurs : `AND`, `OR`, `NOT`, `espace` (équivalent à `AND`).
- Qualifiers : `license:`, `language:`, `stars:`, `forks:`, `pushed:`, `created:`, `is:archived`, `is:fork`, `in:name`, `in:description`, `in:readme`.

```text
(react OR vue OR svelte) component library license:MIT
design system language:TypeScript stars:>=100 NOT is:archived
ui kit in:readme pushed:>=2025-01-01 license:Apache-2.0
```

---

## 6. Filtrage SPDX et audit

Le filtrage se fait en plusieurs niveaux :
- **Recherche :** qualifier `license:MIT` pour réduire les candidats.
- **Métadonnées :** inspecter `repository.license.spdx_id`.
- **Fichier :** appeler `/repos/{owner}/{repo}/license` et comparer l'identifiant.
- **Contenu :** signaler les fichiers atypiques, assets ou sous-dossiers avec notices différentes.
- **Dépendances :** analyser la SBOM SPDX quand elle est disponible.
- **Décision :** `approved`, `warning`, `rejected` ou `unknown`.

```text
approved : identifiant SPDX autorisé et sources cohérentes.
warning  : licence détectée mais dépendances, assets ou sources discordantes.
rejected : licence interdite par la politique du projet (Copyleft strict non désiré).
unknown  : NOASSERTION, licence absente ou non reconnue.
```

---

## 7. Score des pépites UI

Intitulé : **« Score de pertinence pour ce pack »**.

| Critère | Poids | Signaux analysés |
| :--- | :--- | :--- |
| **Correspondance** | **30%** | Nom, description, topics, README |
| **Signaux UI** | **25%** | ui, ux, components, design-system, Storybook, Tailwind, React |
| **Activité** | **15%** | pushed_at, archive, fréquence des releases |
| **Licence** | **15%** | SPDX autorisé, fichier cohérent |
| **Maturité** | **15%** | Étoiles, forks (échelle logarithmique), documentation |

$$\text{Score} = (\text{Pertinence} \times 0.30) + (\text{Signaux UI} \times 0.25) + (\text{Activité} \times 0.15) + (\text{Licence} \times 0.15) + (\text{Maturité} \times 0.15)$$

---

## 8. Les « 40 pépites »

Les 40 ne sont pas 40 archives téléchargées arbitrairement. Ce sont les **40 candidats ayant passé les filtres et obtenu les meilleurs scores dans la session courante**.

### Processus :
1. Récupérer plusieurs pages si nécessaire.
2. Dédupliquer avec `full_name`.
3. Exclure forks ou archives selon la politique.
4. Valider la licence technique.
5. Calculer le score et ses sous-scores.
6. Garder les 40 meilleurs.
7. Afficher les raisons et les avertissements.
8. Ne télécharger automatiquement que les dépôts explicitement sélectionnés.

---

## 9. Pagination et limite de recherche

- **UI :** « Charger plus » plutôt qu’un numéro de page infini.
- **Backend :** Plafonner `page × per_page` à 1 000 (fenêtre maximale de l'API Search REST).
- **Format de réponse :**
```json
{
  "totalCount": 12640,
  "returned": 40,
  "page": 1,
  "perPage": 40,
  "hasNextPage": true,
  "limitedByGitHub": true,
  "warning": "Tous les résultats ne sont pas parcourables avec cette requête (limite 1000)."
}
```

---

## 10. Téléchargement, isolation et provenance

Après sélection, le Bridge télécharge l’archive ZIP dans un espace temporaire, vérifie la taille et le contenu, puis l’extrait dans un dossier isolé.

### Arborescence :
```text
prodgit/<projet>/github-sources/<owner>-<repo>.zip
src/integrations/github-adapted/<owner>-<repo>/
├── components/
├── adapters/
└── provenance.json
```

### En-tête de provenance immuable :
```typescript
/**
 * @provenance source=github
 * @repository owner/repo
 * @commit abc1234567890
 * @license MIT
 * @source https://github.com/owner/repo
 * @auditedAt 2026-09-22T18:30:00Z
 */
```

---

## 11. Manifest et intégration

```typescript
export type MountedComponent = {
  id: string;
  repository: string;
  commit: string;
  sourcePath: string;
  exportName?: string;
  framework: "react" | "vue" | "svelte" | "unknown";
  license: { spdxId: string | null; status: "approved" | "warning" | "rejected" | "unknown" };
  score: number;
  status: "mounted" | "needs-adaptation" | "blocked";
};
```

---

## 12. Cycle d'États et Transitions

```text
DISCOVERED ➔ LICENSE_CHECKED ➔ SCORED ➔ SELECTED ➔ DOWNLOADED ➔ EXTRACTED ➔ AUDITED ➔ ADAPTED ➔ MOUNTED
                                                                                        └── REJECTED
                                                                                        └── NEEDS_REVIEW
```

---

## 13. Endpoints API du Moteur

- `GET /api/github/search?q=...&page=1&perPage=40`
- `POST /api/github/audit-license`
- `POST /api/github/select`
- `POST /api/github/download`
- `POST /api/github/extract`
- `POST /api/github/mount`
- `GET /api/github/sessions/:id`
- `GET /api/github/components`

---

## 14. Checklist d’acceptation

- [x] Le clic sur un workspace synchronise automatiquement le pack correspondant.
- [x] La requête générée est visible et modifiable.
- [x] Les licences utilisent des identifiants SPDX normalisés.
- [x] Les résultats sans licence sont marqués `unknown`, jamais `approved`.
- [x] Le score explique ses sous-critères (`scoreBreakdown`).
- [x] Les 40 résultats sont dédupliqués et reproductibles.
- [x] L'interface annonce les limites de pagination GitHub (1 000 max).
- [x] Le commit SHA, l’URL, la licence et la date d’audit sont conservés.
- [x] Aucun script non audité du dépôt n'est exécuté automatiquement.
- [x] Le manifest expose uniquement les composants réellement montés.
- [x] Un test de compilation (`tsc --noEmit`) est validé avant mise à disposition.

---

## 15. Résumé opérationnel

$$\text{Contexte Actif} \rightarrow \text{Intention Pack/Prompt} \rightarrow \text{Requête GitHub} \rightarrow \text{Candidats} \rightarrow \text{Filtres SPDX} \rightarrow \text{Score UI/UX} \rightarrow \text{Sélection des 40} \rightarrow \text{Audit} \rightarrow \text{Isolation} \rightarrow \text{Provenance} \rightarrow \text{Manifest} \rightarrow \text{Validation 0 Erreur}$$
