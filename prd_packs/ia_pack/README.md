> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé dans les Interfaces Conversationnelles Audio et le Realtime AI (ex: OpenAI Realtime API).
> Ce document est le PRD (Product Requirements Document) du **PACK IA VOICE AGENT SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Visionnaire, Magique et Hautement Sensorielle (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 🗣️ PACK IA (Voice Agent & Audio Streaming)

Ce pack force la création d'interfaces vocales futuristes (façon Siri iOS 18, ou le mode vocal de ChatGPT). L'application générée doit sublimer la voix, offrir un retour visuel instantané sur l'écoute et la parole de l'IA, et gérer la latence réseau avec grâce.

---

## 🎯 La Mission Principale (AI Voice Agent)

**Mission :** Créer une interface de chat vocal avec streaming audio bidirectionnel.
Le logiciel généré ne doit pas être un simple enregistreur vocal statique, mais une expérience fluide où l'IA peut être interrompue et où la voix se transforme en lumière/ondes.

### 🧩 Core Features Architecturaux Requis :
1. **Streaming Audio (Realtime) :** Intégration de l'API WebRTC ou WebSocket pour la transmission de la voix sans délai.
2. **Visualiseur Audio (Audio Visualizer) :** Une onde sonore dynamique (Waveform) ou une sphère pulsante (Orb) qui réagit à la fréquence et au volume de la voix de l'utilisateur ET de l'IA.
3. **Contrôle d'État (VAD) :** Détection d'Activité Vocale (Voice Activity Detection) pour savoir visuellement quand l'utilisateur parle, quand l'IA écoute, et quand l'IA répond.
4. **Micro Flottant :** Un bouton d'action principal (FAB) massif permettant d'activer/désactiver le micro rapidement.

---

## 🎨 Vision UI/UX & Design System Voice AI
* **Directives pour Stitch :** Une interface vocale doit être minimaliste pour laisser place à la voix. Le mode sombre (Dark Mode) est **obligatoire** (fonds noirs profonds, `#000000` ou `#0a0a0a`) pour faire ressortir les couleurs néon de l'Audio Visualizer (Siri-like gradients : Cyan, Magenta, Purple).
* **Animations :** Utilise `framer-motion` et/ou l'API Canvas WebGL pour rendre l'onde sonore vivante et fluide à 60fps.
* **Ergonomie :** L'interface doit être centrée. L'utilisateur n'a pas besoin de lire beaucoup de texte, son attention doit être portée sur le visualiseur central.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande à créer une application de coaching vocal ou un agent conversationnel audio type film "Her", tu dois injecter cette architecture. Concentre-toi sur la boucle de rendu Canvas et la gestion du flux audio (MediaStream API).*

[INSTRUCTION IA]
Génère l'interface d'un Agent Vocal IA de nouvelle génération :
- Un fond sombre et immersif.
- Un composant central `AudioVisualizer` utilisant Canvas ou des divs animés via CSS/Framer Motion pour réagir au son (état "Listening", "Thinking", "Speaking").
- Un gros bouton d'action en bas pour Mute / Unmute.
- Une console de transcription (Optionnelle) affichant le texte reconnu en direct, avec un effet de fondu (fade).
- Gestion de l'état audio via un hook React dédié.

[STRUCTURE REQUISE]
- `src/features/voice/pages/VoiceAgentPage.tsx`
- `src/features/voice/components/AudioVisualizer.tsx`
- `src/features/voice/components/VoiceButton.tsx`
- `src/features/voice/components/LiveTranscript.tsx`
- `src/features/voice/hooks/useAudioStream.ts`
- `src/features/voice/hooks/useVAD.ts` (Détection de voix)
- `src/shared/utils/audioContext.ts`