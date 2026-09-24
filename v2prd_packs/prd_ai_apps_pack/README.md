> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé dans le Machine Learning, les LLMs et les interfaces conversationnelles.
> Ce document est le PRD (Product Requirements Document) du **PACK AI APPS SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Visionnaire, Cybernétique et Haute Performance**, tout en respectant strictement les règles métier ci-dessous.

# 🤖 PACK AI APPS (Chat & Copilotes Intelligents)

Ce pack force la création d'interfaces IA de pointe (façon ChatGPT, Claude ou Cursor). L'application générée doit exceller dans la gestion du streaming de texte en temps réel, le rendu de code complexe, et la gestion du contexte utilisateur.

---

## 🎯 La Mission Principale (AI Chat Copilot)

**Mission :** Interface de chat intelligente capable de streamer des réponses, gérer des fichiers et maintenir un contexte long.
L'application ne doit pas être un simple chat figé, mais un véritable "Copilote" interactif et réactif.

### 🧩 Core Features Architecturaux Requis :
1. **Streaming SSE (Server-Sent Events) :** Le texte doit apparaître lettre par lettre de manière fluide, sans saccades.
2. **Markdown Rendering Avancé :** Rendu parfait du Markdown incluant la coloration syntaxique des blocs de code (Code highlighting), les tableaux HTML, et le rendu mathématique (LaTeX).
3. **Persistance Locale :** L'historique des conversations doit être sauvegardé dans le navigateur (LocalStorage ou IndexedDB).
4. **Gestion des Pièces Jointes :** Upload de fichiers via drag-and-drop dans la zone de texte pour les "lire" avec l'IA.
5. **Safety Guard (Ordre CTO) :** Mécanismes de protection contre les injections de prompt et assainissement (Sanitization) de l'HTML rendu.

---

## 🎨 Vision UI/UX & Design System AI
* **Directives pour Stitch :** Le design d'une interface IA doit évoquer l'intelligence et la clarté. Utilise un design "Layout 2 Colonnes" classique (Historique à gauche, Chat principal à droite).
* **Feedback Visuel :** Utilise des "Skeleton screens" ou des animations de réflexion ("Thinking...") pendant l'attente du premier byte de réponse.
* **Typographie :** Distingue clairement le texte de l'utilisateur (Police standard) et la réponse de l'IA (Fond légèrement différent, typographie très propre pour la lecture longue).

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi un clone de ChatGPT personnalisé pour mon métier", tu dois déployer cette architecture exacte. Veille particulièrement à séparer la logique de rendu Markdown de l'état du Streaming.*

[INSTRUCTION IA]
Génère l'interface d'un assistant IA complet et réactif :
- Un panneau latéral gauche (Sidebar) contenant l'historique des chats.
- Une zone de conversation principale avec gestion du scroll automatique vers le bas (Scroll-to-bottom).
- Une zone de saisie (Input Area) auto-extensible avec bouton "Envoyer" et bouton "Joindre un fichier".
- Des bulles de messages capables de rendre du code formaté avec un bouton "Copier".
- Utilisation de React Markdown ou équivalent pour le rendu.
- Hooks personnalisés : `useChatStream()`, `useChatHistory()`.

[STRUCTURE REQUISE]
- `src/features/ai/pages/CopilotDashboard.tsx`
- `src/features/ai/components/ChatWindow.tsx`
- `src/features/ai/components/MessageBubble.tsx`
- `src/features/ai/components/MarkdownRenderer.tsx`
- `src/features/ai/components/ChatInput.tsx`
- `src/features/ai/hooks/useChatStream.ts`
- `src/features/ai/api/ai.service.ts`
- `src/shared/types/ai.ts` (interfaces Message, ChatSession, Attachment)