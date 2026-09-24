> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en IA Conversationnelle et Interfaces Vocales (Voice UI).
> Ce document est le PRD (Product Requirements Document) du **PACK AI VOICE AGENT SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Minimaliste et Organique (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 🎙️ PACK AI VOICE AGENT (Agent Vocal IA)

Ce pack force la création d'expériences vocales pures. L'écran devient secondaire, le son et le retour visuel de la voix (Visualizer) deviennent l'interface principale.

---

## 🎯 La Mission Principale (Assistant Vocal)

**Mission :** Interface d'interaction vocale en temps réel (type Siri, Alexa ou OpenAI Voice).
L'interface doit réagir aux ondes sonores de l'utilisateur de façon fluide (60fps).

### 🧩 Core Features Architecturaux Requis :
1. **Onde Sonore (Siri Wave) :** Une courbe animée qui s'agite selon l'intensité vocale détectée par le micro.
2. **Bouton Micro Principal :** Un énorme bouton "Tap to speak" ou "Hold to speak" qui gère les permissions micro.
3. **Statut de l'Agent :** Texte subtil ou changement de couleur indiquant : Écoute, Traitement, Parole.

---

## 🎨 Vision UI/UX & Design System Voice UI
* **Directives pour Stitch :** Le design doit être extrêmement pur. Souvent centré au milieu de l'écran. Un fond très sombre avec une touche de couleur (Glow) autour de l'onde sonore.
* **Effets :** Utilisation de filtres CSS `backdrop-blur` et `box-shadow` pour les états actifs.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée une app pour parler à une IA en audio", c'est l'architecture unique à suivre.*

[INSTRUCTION IA]
Génère une architecture d'Agent Vocal :
- Intégration de l'API MediaRecorder ou WebRTC.
- Animation Canvas ou CSS SVG pour l'onde sonore (Waveform).
- Gestion absolue des erreurs de permissions (Micro refusé).

[STRUCTURE REQUISE]
- `src/features/voice/pages/AgentPage.tsx`
- `src/features/voice/components/SiriWaveform.tsx`
- `src/features/voice/components/MicrophoneToggle.tsx`