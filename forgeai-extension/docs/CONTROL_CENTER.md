# ForgeAI Control Center

La version 5.3.3 ajoute un relais entre le cockpit local et l’extension. Le cockpit peut être lancé sur `http://localhost/*` ou `http://127.0.0.1/*`. Le content script relaie uniquement les requêtes dont la source est `forgeai-control-center`.

Le relais expose le statut de l’extension via `GET /v1/control/status` et transmet au Bridge les endpoints de santé, projets, arborescence et commandes. Les commandes autorisées par le relais sont limitées à `pnpm install` et `pnpm dev` côté interface ; le Bridge doit appliquer sa propre liste blanche et exécuter les commandes dans le projet actif.

Le statut de l’extension retourne l’étape courante, les étapes terminées, le nombre de sources, le mode d’automatisation, l’état de validation et la liste des artefacts. Le cockpit utilise ces informations pour mettre à jour le pipeline visuel.

## Parcours local

1. Recharger l’extension ForgeAI Studio Builder v5.3.3 dans `chrome://extensions`.
2. Démarrer le Bridge sur `127.0.0.1:5006`.
3. Démarrer le Control Center sur `http://localhost:5173`.
4. Ouvrir le projet final depuis le cockpit après `pnpm install` puis `pnpm dev`.

Le contrôle est volontairement désactivé lorsque le Bridge n’est pas joignable. Le cockpit n’exécute pas de commande directement dans le navigateur.
