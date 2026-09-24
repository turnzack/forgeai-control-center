# HermesMoA — Presets JSON

Ce dossier contient les **presets statiques** (assets déclaratifs) pour le composant
[`HermesMoA`](../../src/lib/hermes/HermesMoA.ts) du système Hermes.

Ils décrivent, sous forme de JSON validés par un schéma Draft-07, les paramètres
d'orchestration d'un appel Mixture-of-Agents :

| Champ                 | Type     | Description                                                       |
|-----------------------|----------|-------------------------------------------------------------------|
| `numAgents`           | `number` | Nombre d'agents travailleurs exécutés en parallèle.               |
| `aggregationStrategy` | `string` | Stratégie d'agrégation : `best_score` \| `llm_judge` \| `majority_vote`. |
| `llmJudgeModel`       | `string` | Modèle utilisé comme juge LLM (uniquement pour `llm_judge`).      |
| `maxBudgetUsd`        | `number` | Budget maximal en USD pour l'ensemble de l'appel MoA.             |
| `timeoutMs`           | `number` | Timeout global en millisecondes.                                  |

## Les 3 presets

### 1. `moa_preset_default.json` — Default
- **3 agents**, stratégie **`best_score`**, budget **0.05 $**, timeout **20 s**.
- Cas d'usage : équilibre coût / qualité pour la majorité des prompts.
- Mapping vers `HermesMoA` : correspond au preset interne **`balanced`**
  (3 modèles : `glm-4-flash` + `glm-4.5` + `glm-4.6`, agrégateur `glm-4.6`).

### 2. `moa_preset_quality.json` — Quality
- **5 agents**, stratégie **`llm_judge`** (judge = `glm-4.6`), budget **0.15 $**, timeout **40 s**.
- Cas d'usage : prompts complexes nécessitant une synthèse LLM de haute qualité.
- Mapping vers `HermesMoA` : étend le preset interne **`thorough`** en ajoutant
  deux agents supplémentaires et en remplaçant la simple synthèse par un juge LLM
  explicite basé sur `glm-4.6`.

### 3. `moa_preset_budget.json` — Budget
- **2 agents**, stratégie **`majority_vote`**, budget **0.02 $**, timeout **12 s**.
- Cas d'usage : prompts simples où l'on veut minimiser le coût.
- Mapping vers `HermesMoA` : correspond au preset interne **`budget`**
  (2 modèles `glm-4-flash` via workers `stitch` + `deepseek`, agrégateur `glm-4.5`).

## Conventions de mapping

Le code applicatif (`HermesMoA.invoke`) charge actuellement les presets depuis
l'objet interne `PRESETS` (`balanced`, `thorough`, `budget`). Ces fichiers JSON
sont la **source de vérité déclarative** destinée à remplacer progressivement
cet objet codé en dur :

```
preset_default.json   ──►  PRESETS.balanced
preset_quality.json   ──►  PRESETS.thorough   (+ llm_judge)
preset_budget.json    ──►  PRESETS.budget
```

Les stratégies d'agrégation nouvelles (`best_score`, `llm_judge`,
`majority_vote`) décrivent le **mode de sélection** de la réponse finale parmi
les propositions des N agents :

- **`best_score`** : sélection de la proposition ayant le meilleur score
  heuristique (longueur + diversité + présence de blocs de code).
- **`llm_judge`** : un LLM tiers (`llmJudgeModel`) choisit et réécrit la
  meilleure réponse.
- **`majority_vote`** : vote majoritaire par similarité (utile quand
  `numAgents` est petit, ici 2 → on retombe sur la plus longue réponse).

## Validation

Chaque fichier est auto-documenté par son `$schema` JSON Schema Draft-07. Pour
vérifier qu'ils sont bien formés :

```bash
python3 -c "import json; json.load(open('moa_preset_default.json'))"
python3 -c "import json; json.load(open('moa_preset_quality.json'))"
python3 -c "import json; json.load(open('moa_preset_budget.json'))"
```
