# Architecture du module Sources GitHub

Le popup collecte les filtres et envoie `SEARCH_GITHUB_FOR_PROJECT`. Le service worker interroge l’API GitHub, vérifie la licence du dépôt, calcule un score et renvoie des données normalisées. Le popup ne recalcule pas le score et n’insère pas les descriptions externes avec `innerHTML`.

Après sélection, le popup envoie `PREPARE_PROJECT_WITH_GITHUB_SOURCES`. `GitHubSourcePipeline` applique les garde-fous de licence et de volume, crée le projet si nécessaire, puis passe les sources à `ProjectSources`. Le module stocke les références par identifiant de projet dans `chrome.storage.local`, génère le manifeste avec `SourceManifest` et ajoute `SOURCES_GITHUB.md` ainsi que `sources.github.json` au pack actif.

L’orchestrateur injecte le contexte de provenance dans l’étape d’architecture. Le pipeline enchaîne alors le PRD, l’architecture et les tâches, mais bloque l’étape `codegen` tant que `APPROVE_SOURCE_CODEGEN` n’a pas été reçue. Lors de la génération, le prompt rappelle que les références ne doivent pas être copiées. Un audit de `package.json` crée `DEPENDENCY_AUDIT.md` et bloque l’export si une dépendance utilise une URL, un dépôt git, `latest`, `*` ou un doublon de groupe.

Les appels GitHub utilisent `github_client.js`, la limitation `rate_limiter.js`, la normalisation `repository_metadata.js`, les décisions de licence `license_policy.js` et les garde-fous `github_schemas.js`.
