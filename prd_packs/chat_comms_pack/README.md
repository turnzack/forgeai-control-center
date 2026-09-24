> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé dans les applications de Messagerie en temps réel et de Communication (ex: WhatsApp, Slack, Discord).
> Ce document est le PRD (Product Requirements Document) du **PACK CHAT & COMMS SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Visionnaire, Moderne et Ultra-Réactive (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 💬 PACK CHAT & COMMS (Architecture de Messagerie)

Ce pack force la création d'interfaces de communication fluides. Les composants doivent être pensés pour un rafraîchissement en temps réel, avec une excellente gestion du défilement (Scroll to bottom) et une ergonomie irréprochable sur mobile comme sur desktop.

---

## 🎯 1. Les 10 Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les 10 briques métiers (Missions) que tu peux câbler et générer :

### 👤 1. Chat Basique 1:1 (`prd_mobile_chat_basic`)
**Mission :** Interface de discussion classique entre deux utilisateurs.
**Design Requis :** Bulles de texte asymétriques (Messages alignés à gauche pour le correspondant, à droite pour l'utilisateur).
**Composants à générer :** `ChatScreen.tsx`, `MessageBubble.tsx`

### 👥 2. Chat de Groupe (`prd_mobile_chat_group`)
**Mission :** Conversation à plusieurs avec gestion des identités.
**Design Requis :** En-tête de groupe affichant le nombre de membres, avatars miniatures à côté de chaque bulle de message.
**Composants à générer :** `GroupChatHeader.tsx`, `GroupMemberList.tsx`

### 🧵 3. Conversations Threadées (`prd_mobile_chat_threaded`)
**Mission :** Système de réponses spécifiques (façon Slack ou Discord threads).
**Design Requis :** Aperçu du thread sous le message parent, et panneau latéral pour développer la discussion imbriquée.
**Composants à générer :** `ThreadPreview.tsx`, `ThreadedMessage.tsx`

### 😂 4. Réactions aux Messages (`prd_mobile_chat_reactions`)
**Mission :** Permettre l'ajout d'emojis sous les messages.
**Design Requis :** Menu "Popover" d'emojis au clic long ou survol, et barre de compteurs de réactions sous la bulle de texte.
**Composants à générer :** `MessageReactionBar.tsx`, `ReactionPicker.tsx`

### 📎 5. Envoi de Pièces Jointes (`prd_mobile_chat_attachments`)
**Mission :** Interface pour envoyer des images, vidéos ou fichiers.
**Design Requis :** Barre de prévisualisation au-dessus du champ de texte pour voir les fichiers avant envoi, et bulles de messages affichant les miniatures (Previews).
**Composants à générer :** `AttachmentBar.tsx`, `AttachmentPreview.tsx`

### 🎙️ 6. Notes Vocales (`prd_mobile_chat_voice_notes`)
**Mission :** Enregistrement et lecture de messages vocaux.
**Design Requis :** Bouton "Hold-to-record" (Maintenir pour enregistrer) dynamique, et bulles avec mini waveform pour la lecture audio.
**Composants à générer :** `VoiceRecordButton.tsx`, `VoiceMessageBubble.tsx`

### 🟢 7. Présence & Statut (`prd_mobile_chat_presence`)
**Mission :** Indicateurs d'activité en temps réel.
**Design Requis :** Points d'état (vert pour en ligne) subtils sur les avatars, et animation "typing..." (en train d'écrire) à trois petits points sautillants.
**Composants à générer :** `TypingIndicator.tsx`, `PresenceDot.tsx`

### 📥 8. Liste de Boîte de Réception (`prd_mobile_chat_inbox_list`)
**Mission :** L'écran d'accueil listant toutes les conversations actives.
**Design Requis :** Liste d'items avec avatar, nom en gras, dernier message tronqué et indicateur de messages non lus (badge numéroté).
**Composants à générer :** `ChatList.tsx`, `ChatListItem.tsx`

### 🤖 9. Bot de Support (`prd_mobile_chat_support_bot`)
**Mission :** Interface de chat pour le service client avec assistance IA.
**Design Requis :** Badges "Bot" explicites, et boutons de "Quick Replies" (réponses rapides) au-dessus du champ de texte.
**Composants à générer :** `SupportChat.tsx`, `QuickReplyButtons.tsx`

### 📢 10. Canal d'Annonces (`prd_mobile_chat_announcement`)
**Mission :** Canal en lecture seule façon Telegram pour des diffusions.
**Design Requis :** Champ de saisie masqué pour les membres, bannières épinglées en haut de l'écran pour les messages vitaux.
**Composants à générer :** `AnnouncementChannel.tsx`, `PinnedBanner.tsx`

---

## 🎨 2. Vision UI/UX & Design System Global pour les Chats
* **Directives pour Stitch :** Une interface de chat doit être rassurante. Utilise des teintes douces (ex: bleu clair pour tes messages, gris pour les autres). 
* **Animations :** Implémente obligatoirement `framer-motion` pour l'apparition des nouvelles bulles venant du bas (pop-in up).
* **Ergonomie :** L'input area (zone de saisie) doit rester fixe en bas (Sticky Bottom) peu importe le scroll.

## ⚙️ 3. Directives de Câblage (VFS)
*Les composants doivent être prévus pour s'intégrer avec des services WebSockets (Socket.io, Pusher, Supabase). Séparer la couche UI (les bulles) de la logique métier (l'envoi). Utilise des hooks dédiés comme `useChat()`.*

---
### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi un clone de WhatsApp pour mon entreprise", tu dois injecter instantanément `prd_mobile_chat_inbox_list` + `prd_mobile_chat_basic` + `prd_mobile_chat_presence`. L'objectif est d'avoir une application complète, avec la liste des discussions à gauche et la fenêtre de chat active à droite (sur desktop) ou en navigation push (sur mobile).*