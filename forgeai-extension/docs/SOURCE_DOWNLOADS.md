# Téléchargement local des sources GitHub

L’action **Télécharger les sources** enregistre une archive ZIP de chaque dépôt sélectionné dans `Downloads/<projet>/github-sources/`. L’action est distincte de **UTILISER** : télécharger une source pour la consulter ne l’intègre pas au code généré.

Le téléchargement est limité à huit sources et accepte uniquement les dépôts dont la licence est `allowed` et vérifiée par GitHub. Chaque archive est téléchargée depuis l’archive de la branche sélectionnée. L’extension calcule ensuite son empreinte **SHA-256** avant de l’enregistrer. Elle produit aussi `sources.github.json` dans le même dossier avec le dépôt, la branche, l’URL d’archive, la taille, l’empreinte, la licence et l’avertissement de référence documentaire.

L’extension ne clone pas l’historique Git et ne copie pas les archives dans l’application finale. Les archives sont destinées à la consultation locale et à la traçabilité. La vérification des licences des dépendances contenues dans un dépôt téléchargé reste une étape séparée.
