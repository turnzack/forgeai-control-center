# Persistance de la recherche GitHub

La version 5.4.2 conserve l’état de l’espace **Sources GitHub** dans `chrome.storage.local`. La requête, la description du projet, les filtres de langage, d’étoiles, d’activité et de licence, le tri, les résultats et les dépôts sélectionnés sont restaurés lorsque le popup est recréé après un changement de page ou l’ouverture d’un autre onglet.

Le bouton **RÉINITIALISER** supprime cet état et revient à une recherche vide. Les résultats sont conservés localement dans le profil Chrome utilisé par l’extension ; ils ne sont pas envoyés à un service supplémentaire.
