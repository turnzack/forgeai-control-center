// INJECTEUR PRD (ELITE FORGE G8 PACK)
(function() {
    'use strict';
    
    const PRDS = {
        main: `[CONTEXTE CACHÉ - PRD ELITE FORGE G8]
# INSTRUCTIONS PRINCIPALES — SKILL UX/UI 
Tu es un product designer senior spécialisé dans les applications mobiles complexes, les dashboards techniques et les interfaces de gestion d'agents IA. Tu dois appliquer toutes les règles suivantes pendant la génération : 
- Créer une seule application cohérente. 
- Créer une seule direction artistique, pas plusieurs variantes. 
- Ne jamais générer plusieurs versions de la même page. 
- Ne jamais remplacer plusieurs écrans par trois variantes de la page d'accueil. 
- Chaque onglet de navigation doit avoir sa propre page principale. 
- Chaque fonctionnalité importante doit avoir son propre écran. 
- Les écrans doivent être reliés par une navigation fonctionnelle. 
- Conserver exactement la même charte graphique sur tous les écrans. 
- Concevoir une vraie application complète, pas seulement une landing page. 
- Prévoir les états loading, empty, error, success, offline et disabled. 
- Utiliser des données réalistes et ne jamais utiliser de lorem ipsum. 
- Utiliser des composants réutilisables et cohérents. 
- Ne pas créer de page dupliquée portant le même contenu qu'une autre page. 
- Si une page secondaire est nécessaire, elle doit être accessible depuis l'écran concerné. 
- Ne pas demander de confirmation avant de générer les écrans. 
- Générer tous les écrans listés dans ce prompt. 

# PROJET 
Crée une application mobile appelée « Elite Forge G8 ». Elite Forge G8 est un cockpit mobile destiné à piloter des agents IA, des automatisations, des outils et des données techniques depuis un smartphone. L'application doit être conçue comme un produit complet avec plusieurs sections accessibles depuis une barre de navigation inférieure. 

# DIRECTION ARTISTIQUE UNIQUE 
Utilise uniquement la direction artistique suivante : 
Nom du style : Aurora Command. 
Caractéristiques visuelles : 
- Interface mobile premium en mode sombre. 
- Ambiance de cockpit technique futuriste. 
- Fond noir bleuté profond. 
- Dégradés subtils bleu, violet et cyan évoquant une aurore boréale. 
- Cartes semi-transparentes avec effet glassmorphism modéré. 
- Lueurs cyan discrètes autour des éléments importants. 
- Typographie moderne, lisible et professionnelle. 
- Utiliser la police Outfit si elle est disponible. 
- Coins légèrement arrondis. 
- Icônes simples et élégantes. 
- Contraste élevé et excellente lisibilité. 
- Style professionnel, pas de décoration excessive. 
- Ne pas générer de variante Gemini Pure. 
- Ne pas générer de variante Industrial Glow. 
- Ne pas générer de troisième version visuelle. 
- Ne pas présenter plusieurs designs alternatifs. 
Le design doit être facilement reproductible avec React Native, Expo et TypeScript. 

# NAVIGATION PRINCIPALE OBLIGATOIRE 
Créer exactement les onglets principaux suivants dans la bottom tab bar : 
1. Cockpit 
2. Agents 
3. Skills 
4. Activité 
5. Profil 
Chaque onglet doit ouvrir une page différente avec un contenu différent. Ne pas utiliser la page Cockpit comme contenu par défaut pour les autres onglets. 

# ÉCRANS À GÉNÉRER 
## Onglet 1 — Cockpit 
Créer une page d'accueil dashboard appelée « Cockpit ». Cette page doit contenir : 
- Un header avec le nom Elite Forge G8. 
- Le statut global du système. 
- Le nombre d'agents actifs. 
- Le nombre de tâches en cours. 
- Le nombre d'erreurs récentes. 
- Une carte de monitoring en temps réel. 
- Une liste des dernières exécutions. 
- Une section d'actions rapides. 
- Un bouton pour créer un agent. 
- Un bouton pour démarrer une automatisation. 
- Un état loading. 
- Un état vide. 
- Un état système hors ligne. 
Cette page est la seule page de dashboard global. 

## Onglet 2 — Agents 
Créer une page dédiée « Agents ». Cette page doit contenir : 
- La liste complète des agents IA. 
- Une recherche. 
- Des filtres par statut. 
- Des filtres par modèle. 
- Des cartes d'agents. 
- Le statut de chaque agent : actif, pause, erreur ou hors ligne. 
- Le modèle utilisé par chaque agent. 
- La dernière activité. 
- Un bouton pour créer un agent. 
- Un écran « Détails de l'agent ». 
- Un écran « Créer un agent ». 
- Un écran « Modifier un agent ». 
- Un écran de confirmation de suppression. 
- Un état vide lorsqu'aucun agent n'existe. 
La page Agents ne doit pas reproduire le contenu de la page Cockpit. 

## Onglet 3 — Skills 
Créer une page dédiée « Skills ». Cette page doit contenir : 
- La liste des skills disponibles. 
- Les skills installés. 
- Les skills recommandés. 
- Une recherche de skills. 
- Des catégories. 
- Des badges indiquant les skills actifs. 
- Un bouton pour ajouter un skill. 
- Un écran « Détails du skill ». 
- Un écran « Installer un skill ». 
- Un écran « Configurer un skill ». 
- Un écran « Créer un skill ». 
- Un état vide lorsqu'aucun skill n'est installé. 
La page Skills doit avoir une mise en page différente de Cockpit et Agents. 

## Onglet 4 — Activité 
Créer une page dédiée « Activité ». Cette page doit contenir : 
- L'historique des exécutions. 
- Les conversations récentes. 
- Les tâches terminées. 
- Les tâches en erreur. 
- Les événements système. 
- Des filtres par date. 
- Des filtres par agent. 
- Des filtres par statut. 
- Une timeline d'activité. 
- Une page « Détails d'une exécution ». 
- Une page « Détails d'une erreur ». 
- Un état vide lorsqu'il n'y a aucune activité. 
La page Activité doit être une timeline ou un journal technique, et non une copie du dashboard. 

## Onglet 5 — Profil 
Créer une page dédiée « Profil ». Cette page doit contenir : 
- Les informations de l'utilisateur. 
- L'espace de travail actif. 
- Les préférences générales. 
- Les préférences de notification. 
- Les paramètres de sécurité. 
- La gestion des modèles IA. 
- La gestion des clés API. 
- Le thème de l'application. 
- Le stockage et la synchronisation. 
- Un bouton de déconnexion. 
- Un écran « Paramètres de sécurité ». 
- Un écran « Gestion des clés API ». 
- Un écran « Notifications ». 
- Un écran « Apparence ». 
La page Profil doit être une page de paramètres et ne doit pas ressembler à la page Cockpit. 

# RÈGLES DE NAVIGATION 
Créer les connexions suivantes : 
- Cockpit → Détails d'une exécution. 
- Cockpit → Créer un agent. 
- Cockpit → Agents. 
- Agents → Détails d'un agent. 
- Agents → Créer un agent. 
- Agents → Modifier un agent. 
- Skills → Détails d'un skill. 
- Skills → Installer un skill. 
- Skills → Configurer un skill. 
- Activité → Détails d'une exécution. 
- Activité → Détails d'une erreur. 
- Profil → Paramètres de sécurité. 
- Profil → Gestion des clés API. 
- Profil → Notifications. 
- Profil → Apparence. 
La bottom tab bar doit rester visible sur les cinq pages principales. Les écrans secondaires peuvent utiliser une navigation retour claire. 

# COMPOSANTS À UTILISER 
Créer une bibliothèque visuelle cohérente avec : 
- AppShell. 
- BottomTabBar. 
- Header. 
- GlassCard. 
- MetricCard. 
- AgentCard. 
- SkillCard. 
- ActivityTimeline. 
- StatusBadge. 
- SearchBar. 
- FilterChip. 
- PrimaryButton. 
- SecondaryButton. 
- EmptyState. 
- LoadingState. 
- ErrorState. 
- ConfirmationModal. 
- BottomSheet. 
- FormInput. 
- Toggle. 
- SegmentedControl. 
Tous les composants doivent utiliser les mêmes couleurs, espacements, rayons, tailles de texte et états interactifs. 

# CONTRAINTES TECHNIQUES 
- Design mobile-first. 
- Compatible iOS et Android. 
- Structure compatible React Native et Expo. 
- Ne pas utiliser de composants uniquement disponibles sur le web. 
- Prévoir des zones tactiles suffisamment grandes. 
- Prévoir le scroll sur les petits écrans. 
- Prévoir les états pressed, disabled, loading et error. 
- Utiliser une hiérarchie de navigation claire. 
- Ne pas créer de pages dupliquées. 
- Ne pas créer trois variantes de l'application. 
- Ne pas créer trois variantes du Cockpit. 
- Ne pas fusionner Agents, Skills, Activité et Profil dans la page Cockpit. 

# PROCESSUS DE GÉNÉRATION OBLIGATOIRE 
Avant de générer les interfaces, vérifie mentalement les points suivants : 
1. Il existe exactement cinq onglets principaux. 
2. Chaque onglet possède une page différente. 
3. La page Cockpit est uniquement le dashboard global. 
4. Les pages Agents, Skills, Activité et Profil ne copient pas Cockpit. 
5. Chaque écran secondaire possède une fonction précise. 
6. Une seule direction artistique est utilisée. 
7. Tous les écrans sont reliés par la navigation. 
8. Aucun écran important n'est remplacé par une variante visuelle. 
Ensuite, génère toute l'application complète avec tous les écrans listés ci-dessus et relie-les dans un prototype interactif.
[FIN DU CONTEXTE CACHÉ]`
    };

    function injectText(text, name) {
        const input = document.querySelector('textarea') || document.querySelector('[contenteditable="true"]');
        if (input) {
            input.value = text + "\\n\\n" + input.value;
            const badge = document.createElement('div');
            badge.style = "position:fixed; top:60px; right:20px; background:#00D1FF; color:black; padding:5px 10px; border-radius:5px; font-weight:bold; z-index:9999;";
            badge.innerText = "✅ PRD Injecté : " + name;
            document.body.appendChild(badge);
            setTimeout(() => badge.remove(), 4000);
        }
    }
})();
