# ForgeAI Studio Builder — Control Center

Le projet est désormais organisé en **deux phases complémentaires** :

1. **Sources GitHub** : recherche orientée besoin, tri par pertinence, description, licence, date de mise à jour et score de correspondance. Les dépôts sélectionnés forment le pack de provenance `SOURCES_GITHUB.md` et `sources.github.json`.
2. **IDE de montage de projet** : blueprint e-commerce, arborescence, modules Storefront / Catalogue / Panier & checkout / Back-office / Assistant shopping, agents spécialisés et aperçu avant génération.

La phase d’orchestration exécute Product, Architect, Planning, Code et QA Agents. Une validation humaine reste obligatoire avant la génération du code final. Le résultat est un **projet original** : les dépôts GitHub servent de références de contexte et de compatibilité, pas de code copié automatiquement.

## Cloudflare Workers AI

Le serveur appelle le REST API Workers AI sur `https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/{MODEL}` avec `Authorization: Bearer {API_TOKEN}`. Les variables sont :

- `CLOUDFLARE_ACCOUNT_ID` — identifiant de compte Cloudflare ;
- `CLOUDFLARE_API_TOKEN` — token Workers AI conservé côté serveur ;
- `CLOUDFLARE_AI_MODEL` — modèle par défaut, `@cf/meta/llama-3.1-8b-instruct`.

Le Bridge local est inclus dans cette archive. Depuis le dossier qui contient `package.json`, lancez-le avec `pnpm bridge`. Si votre dossier est `E:\forgeai-control-center`, utilisez `E:` puis `cd \\forgeai-control-center` ; ne tapez pas `cd E:\forgeai-control-center-complete` si ce dossier n’existe pas.

Les identifiants peuvent être ajoutés **plus tard** depuis la page **Paramètres** du cockpit. Tant qu’ils ne sont pas installés côté serveur, l’IDE reste utilisable en mode plan local et affiche explicitement le mode démonstration.

## Lancer le cockpit

```bash
pnpm install
pnpm dev
```

Le script utilise `cross-env`, donc la même commande fonctionne dans Windows CMD, PowerShell, macOS et Linux. Après extraction d’une archive complète, exécutez ces commandes depuis la racine qui contient `package.json`, puis ouvrez l’URL affichée par le serveur.

Le cockpit est servi par le serveur fullstack sur le port disponible à partir de `3000`. Le pipeline local du projet final peut ensuite lancer `pnpm install` puis `pnpm dev` dans le workspace e-commerce sur `localhost:5174` via le Bridge ForgeAI.

## Bridge local et exports universels

Depuis **Fichiers & artefacts**, chaque projet futur dispose des mêmes actions : **Écrire sur le disque**, **Exporter en ZIP**, **Publier sur GitHub**, **Installer les dépendances** et **Lancer l’application**. Le cockpit envoie d’abord les fichiers au Bridge local `127.0.0.1:5006`. Si le Bridge n’est pas disponible, l’utilisateur peut choisir un dossier avec le sélecteur natif du navigateur. Le ZIP est généré dans le navigateur et inclut les artefacts de provenance.

Le Bridge fourni dans `forgeai-studio-builder-extension/bridge-local/server.mjs` écrit par défaut sous `Downloads/ForgeAI/workspaces/<projet>`, renvoie l’arborescence et n’accepte que les commandes `pnpm install`, `pnpm dev`, `npm install` et `npm run dev`. Le bouton GitHub réutilise la configuration GitHub déjà enregistrée dans l’extension et publie tout le workspace dans un commit.

## Tests

```bash
pnpm run check
pnpm test
pnpm run build
```

## Aperçu live et configuration GitHub

L’onglet **Aperçu** de l’IDE embarque `http://localhost:5174` dans une iframe et propose un rafraîchissement ainsi qu’une ouverture dans un onglet séparé. Le cockpit sonde le Bridge local toutes les cinq secondes et affiche son état dans la barre supérieure.

La page **Paramètres** permet de configurer le dépôt, la branche et le token GitHub. La lecture ne renvoie jamais le token : seul l’état « Token configuré » est affiché. L’écriture est relayée à l’extension, qui conserve le secret dans `chrome.storage.local` et le réutilise lors de la publication du projet.
