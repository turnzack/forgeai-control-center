# Pipeline de provenance GitHub

## Objectif

Le module `lib/github_source_pipeline.js` transforme une sélection de dépôts GitHub en un contexte de conception traçable. Les dépôts retenus restent des **références documentaires**. Le pipeline ne clone pas de dépôt, ne copie pas de code et ne transforme pas un dépôt sélectionné en dépendance npm.

## Parcours utilisateur

L’utilisateur recherche des dépôts, puis les trie par **pertinence**, activité récente, popularité ou licence. Chaque résultat affiche sa description, sa technologie, sa date de mise à jour, sa licence et les raisons de sa correspondance avec le besoin. Seuls les résultats dont la licence est `allowed` par la politique active peuvent être sélectionnés pour l’automatisation.

Lorsque l’utilisateur clique sur **UTILISER**, le pipeline crée le projet si aucun projet actif n’existe. Il conserve ensuite les sources pour ce projet, génère `SOURCES_GITHUB.md`, génère `sources.github.json` et place ces artefacts dans le pack. Le contexte de l’architecte reçoit les informations approuvées afin de justifier les choix techniques sans reprendre de code tiers.

Le pipeline lance le PRD, l’architecture et les tâches. Il s’arrête ensuite à l’étape de génération du code. Le bouton **VALIDER & GÉNÉRER L’APPLICATION** exige une confirmation explicite avant que le code soit demandé au modèle.

L’utilisateur peut choisir le mode **A — approval-gate**, qui conserve cet arrêt avant le code, ou le mode **B — full-auto**, qui autorise automatiquement la génération et l’export final après les contrôles de licences et de dépendances.

## Contrôles de cohérence

| Contrôle | Comportement | Résultat en cas d’échec |
|---|---|---|
| Licence de la source | La sélection automatique accepte uniquement le statut `allowed`. | La source ne peut pas être sélectionnée. |
| Taille du contexte | Huit sources au maximum sont retenues pour un projet. | La préparation est refusée. |
| Originalité | Les prompts indiquent que les sources sont documentaires uniquement. | Le modèle reçoit une instruction explicite de produire une implémentation originale. |
| Dépendances | `package.json` est contrôlé après la génération. | Les URL, dépôts git, versions `latest`, versions `*` et doublons de groupe bloquent l’export. |
| Validation humaine | La génération du code exige une confirmation dans l’interface. | Le pipeline reste à l’étape `codegen`. |

## Artefacts exportés

`SOURCES_GITHUB.md` présente les références, leur description, leur technologie, leur activité, leur licence et leur correspondance avec le besoin. `sources.github.json` fournit la même provenance sous forme structurée. `DEPENDENCY_AUDIT.md` documente le contrôle appliqué au `package.json`. Le `README.md` du projet final reprend les références sélectionnées et renvoie vers les fichiers de provenance.

> La détection de licence du dépôt est une présélection. Elle ne remplace pas une vérification juridique des dépendances transitives, des avis de copyright ou des obligations de redistribution.

Les métadonnées de dépôt et la licence sont récupérées à partir de l’API REST GitHub. [1]

## Références

[1]: https://docs.github.com/en/rest "Documentation de l’API REST GitHub"
