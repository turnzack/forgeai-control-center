# PRD — Video Pack (Product Requirements Document)

## 1. Objectif Produit
Fournir une brique logicielle Grade Gold dans le domaine **Vidéo & Streaming** (archétype `VIDEO`), utilisable immédiatement en production. Le produit adresse le problème suivant : Les plateformes vidéo génériques offrent un lecteur basique sans chapitres, pas de chat live, pas de sélecteur de qualité adaptatif, et des commentaires séparés du contexte de la vidéo.

## 2. Fonctionnalités Spécifiées

### F01 — Lecteur vidéo HTML5 avec contrôles custom (play, seek, volume, fullscreen, PiP)
- **Objectif** : Lecteur vidéo HTML5 avec contrôles custom (play, seek, volume, fullscreen, PiP).
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `VideoPlayer`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F02 — Chapitres vidéo cliquables avec preview thumbnail au hover sur la seek bar
- **Objectif** : Chapitres vidéo cliquables avec preview thumbnail au hover sur la seek bar.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `VideoPlayer`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F03 — Sélecteur de qualité adaptatif (Auto, 1080p, 720p, 480p, 360p) via HLS.js
- **Objectif** : Sélecteur de qualité adaptatif (Auto, 1080p, 720p, 480p, 360p) via HLS.js.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `VideoPlayer`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F04 — Chat live temps réel (WebSocket) avec emotes et modération
- **Objectif** : Chat live temps réel (WebSocket) avec emotes et modération.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `VideoPlayer`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F05 — Commentaires sous la vidéo avec tri (récents, populaires) et réponses
- **Objectif** : Commentaires sous la vidéo avec tri (récents, populaires) et réponses.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `VideoPlayer`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F06 — Marquer un timestamp dans un commentaire (lien cliquable qui seek la vidéo)
- **Objectif** : Marquer un timestamp dans un commentaire (lien cliquable qui seek la vidéo).
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `VideoPlayer`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F07 — Playlist de lecture automatique (autoplay next)
- **Objectif** : Playlist de lecture automatique (autoplay next).
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `VideoPlayer`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F08 — Statut live avec badge LIVE rouge et compteur de viewers
- **Objectif** : Statut live avec badge LIVE rouge et compteur de viewers.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `VideoPlayer`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F09 — HLS adaptive streaming avec fallback MP4
- **Objectif** : HLS adaptive streaming avec fallback MP4.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `VideoPlayer`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F10 — Chapitres auto-générés depuis les timestamps de la description
- **Objectif** : Chapitres auto-générés depuis les timestamps de la description.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `VideoPlayer`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

## 3. Pages de l'application
- `/`
- `/watch/:id`
- `/channel/:username`
- `/upload`
- `/live/:id`
- `/trending`
- `/subscriptions`

## 4. Endpoints API
- `GET /api/videos?sort=&category=&page=`
- `GET /api/videos/:id`
- `POST /api/videos/upload`
- `GET /api/videos/:id/comments?sort=`
- `POST /api/videos/:id/comments`
- `WS /ws/live/:id (chat messages, viewer count)`

## 5. Store global (state shape)
```typescript
currentVideo, videos[], comments[], liveChat[], chapters[], user, subscriptions[]
```

## 6. Interfaces TypeScript principales
```typescript
Video {id, title, description, videoUrl, thumbnailUrl, duration, chapters[], viewsCount, likesCount, publishedAt, channelId}, Comment {id, videoId, authorId, body, likesCount, replies[], timestamp}, ChatMessage {id, liveId, authorId, body, emotes[], createdAt}
```

## 7. Contraintes Non Fonctionnelles
- **Accessibilité** : conformité WCAG AA (navigation clavier complète, contrastes validés, ARIA approprié).
- **Sécurité** : headers CSP stricts, protection CSRF, requêtes préparées D1 contre les injections SQL, sanitisation XSS des entrées utilisateur.
- **Performance** : bundle JS < 200 KB gzip, lazy-loading des routes, cache HTTP stale-while-revalidate.
- **Observabilité** : logs structurés JSON, métriques temps-réel, Sentry pour les erreurs front.
- **Internationalisation** : interface en français par défaut, structure i18n prête (fr, en).
