# Version canonique

La version canonique du build est la variante avancée située historiquement dans `kirov5-extension/` à la racine de l’archive. Elle a été copiée dans le dossier racine du livrable `forgeai-extension/`.

Les variantes `KIROV TENSION/` et `kirov5-extension/kirov5-extension/` sont des copies historiques et ne sont pas chargées par le build. Cette décision évite les divergences de code et les doubles modifications.

Le fichier `tabs.js` manquant dans la variante avancée a été restauré depuis la copie racine afin que le popup puisse charger sa navigation.
