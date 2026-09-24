# UI SCREEN SPECIFICATIONS & AI GENERATION — ÉvénementPack

## 1. Spécification Écran SCR-001 : /
- **Route** : `/`
- **Objectif** : écran central pour l'expérience **Gestion d'Événements & Billetterie** dans ÉvénementPack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `EventCard`, `EventDetail`, `TicketSelector`, `QRCodeScanner`, `ProgrammeTimeline`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 2. Spécification Écran SCR-002 : /events
- **Route** : `/events`
- **Objectif** : écran central pour l'expérience **Gestion d'Événements & Billetterie** dans ÉvénementPack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `EventCard`, `EventDetail`, `TicketSelector`, `QRCodeScanner`, `ProgrammeTimeline`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 3. Spécification Écran SCR-003 : /events/:slug
- **Route** : `/events/:slug`
- **Objectif** : écran central pour l'expérience **Gestion d'Événements & Billetterie** dans ÉvénementPack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `EventCard`, `EventDetail`, `TicketSelector`, `QRCodeScanner`, `ProgrammeTimeline`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 4. Spécification Écran SCR-004 : /checkout/:eventId
- **Route** : `/checkout/:eventId`
- **Objectif** : écran central pour l'expérience **Gestion d'Événements & Billetterie** dans ÉvénementPack.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `EventCard`, `EventDetail`, `TicketSelector`, `QRCodeScanner`, `ProgrammeTimeline`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).


---

## 5. Prompt Industriel Google Stitch
```text
# STITCH PROMPT — ÉvénementPack

Contexte produit :
ÉvénementPack - Pack de gestion d'événements dans le domaine Gestion d'Événements & Billetterie.

Objectif :
Offrir une interface complète, spécialisée et authentique permettant aux utilisateurs de réaliser leurs tâches métier.

Layout :
- Shell applicatif moderne avec navigation contextuelle.
- Section de statistiques ou de contenu principal selon l'écran.
- Grille de cartes réactives ou table moderne avec pagination.

Composants obligatoires :
EventCard, EventDetail, TicketSelector, QRCodeScanner, ProgrammeTimeline, CountdownTimer, OrganizerDashboard.

Style visuel :
- Palette : Fond #FFFFFF, primaire #E11D48, accent #7C3AED.
- Typographie : Inter.
- Festif, vivant, premium. Sans-serif (Inter), fond blanc, accents rose (#E11D48) et complémentaires. Cards événement avec cover image et hover zoom. Countdown en gros chiffres mono. QR scanner plein écran sur mobile avec overlay vert/rouge. Programme en timeline verticale.

Contraintes :
- Zéro lorem ipsum, libellés explicites en français.
- Conformité WCAG AA.
- Responsive mobile-first.
```

---

## 6. Prompt Industriel Gemini 3.1 (Nano Banana Pro / Imagen 4)
```text
Génère une illustration haute fidélité pour l'onboarding de ÉvénementPack.

Contexte produit :
Application Gestion d'Événements & Billetterie moderne, élégante et professionnelle.

Sujet :
Métaphore visuelle représentant Event et l'interaction utilisateur dans le domaine Gestion d'Événements & Billetterie.

Style :
Rendu 3D isométrique épuré ou illustration vectorielle haut de gamme, sans surcharge.

Palette :
Dominante #E11D48, accents #7C3AED, reflets doux sur fond #FFFFFF.

Format :
16:9 pour intégration en bannière d'accueil.

Contraintes :
- Pas de texte incrusté, pas de watermark.
- Respect rigoureux des codes du design system.
- Cohérence avec l'un visuel du domaine Gestion d'Événements & Billetterie.
```
