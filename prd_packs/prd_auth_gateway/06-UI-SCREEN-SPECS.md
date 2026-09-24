# UI SCREEN SPECIFICATIONS & AI GENERATION — Auth Gateway

## 1. Spécification Écran SCR-001 : /login
- **Route** : `/login`
- **Objectif** : écran central pour l'expérience **Authentification & Sécurité** dans Auth Gateway.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `AuthForm`, `TwoFactorSetup`, `SessionList`, `ApiKeyTable`, `AuditLogTable`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 2. Spécification Écran SCR-002 : /register
- **Route** : `/register`
- **Objectif** : écran central pour l'expérience **Authentification & Sécurité** dans Auth Gateway.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `AuthForm`, `TwoFactorSetup`, `SessionList`, `ApiKeyTable`, `AuditLogTable`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 3. Spécification Écran SCR-003 : /2fa
- **Route** : `/2fa`
- **Objectif** : écran central pour l'expérience **Authentification & Sécurité** dans Auth Gateway.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `AuthForm`, `TwoFactorSetup`, `SessionList`, `ApiKeyTable`, `AuditLogTable`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 4. Spécification Écran SCR-004 : /forgot-password
- **Route** : `/forgot-password`
- **Objectif** : écran central pour l'expérience **Authentification & Sécurité** dans Auth Gateway.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `AuthForm`, `TwoFactorSetup`, `SessionList`, `ApiKeyTable`, `AuditLogTable`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).


---

## 5. Prompt Industriel Google Stitch
```text
# STITCH PROMPT — Auth Gateway

Contexte produit :
Auth Gateway - Passerelle d'authentification SSO dans le domaine Authentification & Sécurité.

Objectif :
Offrir une interface complète, spécialisée et authentique permettant aux utilisateurs de réaliser leurs tâches métier.

Layout :
- Shell applicatif moderne avec navigation contextuelle.
- Section de statistiques ou de contenu principal selon l'écran.
- Grille de cartes réactives ou table moderne avec pagination.

Composants obligatoires :
AuthForm, TwoFactorSetup, SessionList, ApiKeyTable, AuditLogTable, PasswordResetForm, OAuthButtons.

Style visuel :
- Palette : Fond #F8FAFC, primaire #059669, accent #0EA5E9.
- Typographie : Inter.
- Sérieux, rassurant, sécurisé. Sans-serif (Inter), fond blanc cassé (#F8FAFC), accents vert (#059669) symbolisant la sécurité. Cards avec border-l vert, icônes bouclier. Code TOTP en mono. Aucune fuite visuelle de données sensibles.

Contraintes :
- Zéro lorem ipsum, libellés explicites en français.
- Conformité WCAG AA.
- Responsive mobile-first.
```

---

## 6. Prompt Industriel Gemini 3.1 (Nano Banana Pro / Imagen 4)
```text
Génère une illustration haute fidélité pour l'onboarding de Auth Gateway.

Contexte produit :
Application Authentification & Sécurité moderne, élégante et professionnelle.

Sujet :
Métaphore visuelle représentant Session et l'interaction utilisateur dans le domaine Authentification & Sécurité.

Style :
Rendu 3D isométrique épuré ou illustration vectorielle haut de gamme, sans surcharge.

Palette :
Dominante #059669, accents #0EA5E9, reflets doux sur fond #F8FAFC.

Format :
16:9 pour intégration en bannière d'accueil.

Contraintes :
- Pas de texte incrusté, pas de watermark.
- Respect rigoureux des codes du design system.
- Cohérence avec l'un visuel du domaine Authentification & Sécurité.
```
