# UI SCREEN SPECIFICATIONS & AI GENERATION — IA Studio

## 1. Spécification Écran SCR-001 : /
- **Route** : `/`
- **Objectif** : écran central pour l'expérience **Assistant IA & Chatbot** dans IA Studio.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `ChatMessage`, `StreamingCursor`, `ConversationSidebar`, `SettingsDrawer`, `AttachmentUploader`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 2. Spécification Écran SCR-002 : /chat
- **Route** : `/chat`
- **Objectif** : écran central pour l'expérience **Assistant IA & Chatbot** dans IA Studio.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `ChatMessage`, `StreamingCursor`, `ConversationSidebar`, `SettingsDrawer`, `AttachmentUploader`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 3. Spécification Écran SCR-003 : /chat/:id
- **Route** : `/chat/:id`
- **Objectif** : écran central pour l'expérience **Assistant IA & Chatbot** dans IA Studio.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `ChatMessage`, `StreamingCursor`, `ConversationSidebar`, `SettingsDrawer`, `AttachmentUploader`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).

## 4. Spécification Écran SCR-004 : /settings
- **Route** : `/settings`
- **Objectif** : écran central pour l'expérience **Assistant IA & Chatbot** dans IA Studio.
- **Layout** : header contextuel, zone de contenu principale responsive, navigation secondaire contextuelle.
- **Composants** : `ChatMessage`, `StreamingCursor`, `ConversationSidebar`, `SettingsDrawer`, `AttachmentUploader`.
- **Données** : fetch via les endpoints API listés dans le PRD, état géré dans le store global.
- **Interactions** : hover states, transitions 150ms, feedback de chargement (skeleton), état vide illustré.
- **Responsive** : mobile (1 colonne), tablette (2 colonnes), desktop (3-4 colonnes ou sidebar + contenu).


---

## 5. Prompt Industriel Google Stitch
```text
# STITCH PROMPT — IA Studio

Contexte produit :
IA Studio - Studio d'intégration de modèles IA dans le domaine Assistant IA & Chatbot.

Objectif :
Offrir une interface complète, spécialisée et authentique permettant aux utilisateurs de réaliser leurs tâches métier.

Layout :
- Shell applicatif moderne avec navigation contextuelle.
- Section de statistiques ou de contenu principal selon l'écran.
- Grille de cartes réactives ou table moderne avec pagination.

Composants obligatoires :
ChatMessage, StreamingCursor, ConversationSidebar, SettingsDrawer, AttachmentUploader, CitationPill, TokenUsageIndicator.

Style visuel :
- Palette : Fond #0F0F1A, primaire #D946EF, accent #8B5CF6.
- Typographie : Inter.
- Moderne, futuriste, premium. Sans-serif (Inter), fond sombre (#0F0F1A) ou clair (#FAFAFA) selon préférence, accents fuchsia (#D946EF). Messages IA en cards avec border gradient. Animations de streaming douces. Mode focus possible (cacher la sidebar). Code blocks avec syntax highlighting.

Contraintes :
- Zéro lorem ipsum, libellés explicites en français.
- Conformité WCAG AA.
- Responsive mobile-first.
```

---

## 6. Prompt Industriel Gemini 3.1 (Nano Banana Pro / Imagen 4)
```text
Génère une illustration haute fidélité pour l'onboarding de IA Studio.

Contexte produit :
Application Assistant IA & Chatbot moderne, élégante et professionnelle.

Sujet :
Métaphore visuelle représentant Conversation et l'interaction utilisateur dans le domaine Assistant IA & Chatbot.

Style :
Rendu 3D isométrique épuré ou illustration vectorielle haut de gamme, sans surcharge.

Palette :
Dominante #D946EF, accents #8B5CF6, reflets doux sur fond #0F0F1A.

Format :
16:9 pour intégration en bannière d'accueil.

Contraintes :
- Pas de texte incrusté, pas de watermark.
- Respect rigoureux des codes du design system.
- Cohérence avec l'un visuel du domaine Assistant IA & Chatbot.
```
