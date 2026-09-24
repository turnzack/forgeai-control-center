# UI SCREEN SPECIFICATIONS & AI GENERATION — Guest Chat

## 1. Spécification Écran SCR-001 : /
- **Route** : `/`
- **Objectif** : écran central pour l'expérience **Chat & Messagerie Temps Réel** dans Guest Chat.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `ConversationList`, `MessageBubble`, `MessageInput`, `TypingIndicator`, `PresenceDot`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 2. Spécification Écran SCR-002 : /chat
- **Route** : `/chat`
- **Objectif** : écran central pour l'expérience **Chat & Messagerie Temps Réel** dans Guest Chat.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `ConversationList`, `MessageBubble`, `MessageInput`, `TypingIndicator`, `PresenceDot`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 3. Spécification Écran SCR-003 : /chat/:conversationId
- **Route** : `/chat/:conversationId`
- **Objectif** : écran central pour l'expérience **Chat & Messagerie Temps Réel** dans Guest Chat.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `ConversationList`, `MessageBubble`, `MessageInput`, `TypingIndicator`, `PresenceDot`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 4. Spécification Écran SCR-004 : /contacts
- **Route** : `/contacts`
- **Objectif** : écran central pour l'expérience **Chat & Messagerie Temps Réel** dans Guest Chat.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `ConversationList`, `MessageBubble`, `MessageInput`, `TypingIndicator`, `PresenceDot`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).


---

## 5. Prompt Industriel Google Stitch
```text
# STITCH PROMPT — Guest Chat

Contexte produit :
Guest Chat - Chat invité sans inscription dans le domaine Chat & Messagerie Temps Réel.

Objectif :
Offrir une interface complète, spécialisée et authentique permettant aux utilisateurs de réaliser leurs tâches métier.

Layout :
- Shell applicatif moderne avec navigation contextuelle.
- Section de statistiques ou de contenu principal selon l'écran.
- Grille de cartes réactives ou table moderne avec pagination.

Composants obligatoires :
ConversationList, MessageBubble, MessageInput, TypingIndicator, PresenceDot, MessageThread, EmojiPicker.

Style visuel :
- Palette : Fond #FFFFFF, primaire #3B82F6, accent #10B981.
- Typographie : Inter.
- Épuré, conversationnel, mobile-first. Sans-serif (Inter), bulles arrondies, fond blanc (#FFFFFF), messages envoyés en bleu (#3B82F6) à droite, reçus en gris clair (#F1F5F9) à gauche. Sidebar conversations à gauche, zone chat centrale, header avec avatar et statut. Animations douces.

Contraintes :
- Zéro lorem ipsum, libellés explicites en français.
- Conformité WCAG AA.
- Responsive mobile-first.
```

---

## 6. Prompt Industriel Gemini 3.1 (Nano Banana Pro / Imagen 4)
```text
Génère une illustration haute fidélité pour l'onboarding de Guest Chat.

Contexte produit :
Application Chat & Messagerie Temps Réel moderne, élégante et professionnelle.

Sujet :
Métaphore visuelle représentant Message et l'interaction utilisateur dans le domaine Chat & Messagerie Temps Réel.

Style :
Rendu 3D isométrique épuré ou illustration vectorielle haut de gamme, sans surcharge.

Palette :
Dominante #3B82F6, accents #10B981, reflets doux sur fond #FFFFFF.

Format :
16:9 pour intégration en bannière d'accueil.

Contraintes :
- Pas de texte incrusté, pas de watermark.
- Respect rigoureux des codes du design system.
- Cohérence avec l'un visuel du domaine Chat & Messagerie Temps Réel.
```
