# ForgeAI Local Bridge

Bridge local générique pour tous les workspaces créés depuis ForgeAI Studio Builder.

## Démarrage

```bash
node bridge-local/server.mjs
```

Par défaut, il écoute sur `127.0.0.1:5006` et écrit dans :

```text
Downloads/ForgeAI/workspaces/<projet>/
```

Modifier l’emplacement :

```bash
FORGEAI_WORKSPACES_DIR="$HOME/Projects/forgeai" node bridge-local/server.mjs
```

## API utilisée par le cockpit

- `GET /health` — état du Bridge ;
- `POST /v1/projects/<projet>/files` — écrit `{ files: [{ path, content }] }` ;
- `GET /v1/projects/<projet>/tree` — renvoie l’arborescence ;
- `POST /v1/projects/<projet>/command` — accepte uniquement `pnpm install`, `pnpm dev`, `npm install` et `npm run dev`.

Le Bridge protège les chemins contre `..`, crée les sous-dossiers et force le port `5173` pour les commandes `dev`. Le cockpit propose aussi le sélecteur de dossier du navigateur si le Bridge n’est pas lancé.

## Exports

Le cockpit offre trois sorties pour chaque futur projet :

1. **Écrire sur le disque** — Bridge local ou dossier choisi ;
2. **Exporter en ZIP** — archive autonome incluant `SOURCES_GITHUB.md` et `sources.github.json` ;
3. **Publier sur GitHub** — via le token et le dépôt configurés dans l’extension.
