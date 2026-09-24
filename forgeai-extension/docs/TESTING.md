# Installation et tests

Chargez le dossier de l’extension depuis `chrome://extensions` en mode développeur. Ouvrez ensuite le popup et sélectionnez l’onglet **Sources**. Une recherche doit afficher la description, la technologie, la date de mise à jour, la licence et le score de correspondance de chaque dépôt.

Sélectionnez uniquement une source autorisée, puis cliquez sur **UTILISER**. Si aucun projet actif n’existe, l’extension crée le projet à partir de la description. Vérifiez que `SOURCES_GITHUB.md` et `sources.github.json` sont présents dans les artefacts. Vérifiez aussi que le PRD, l’architecture et les tâches s’exécutent, tandis que l’étape de code reste en attente de validation.

Après avoir contrôlé les documents produits, cliquez sur **VALIDER & GÉNÉRER L’APPLICATION** et acceptez la confirmation. Le projet final doit contenir `SOURCES_GITHUB.md`, `sources.github.json`, `DEPENDENCY_AUDIT.md` et un `README.md` qui liste les références utilisées.

Pour tester le téléchargement local, sélectionnez une à huit sources autorisées, cliquez sur **TÉLÉCHARGER LES SOURCES**, confirmez l’action, puis contrôlez le dossier `Downloads/<projet>/github-sources/`. Il doit contenir une archive ZIP par dépôt et un `sources.github.json` avec la taille, la branche, l’URL d’archive et le hash SHA-256. Le journal du popup doit afficher le hash de chaque archive.

Les tests statiques se lancent depuis le dossier de l’extension avec la commande suivante :

```bash
node tests/run-tests.cjs
```

Le test ne nécessite pas de réseau. Il couvre la politique de licence, le score, les schémas, les artefacts de provenance, le blocage avant `codegen`, la création automatique du projet et l’audit des dépendances.
