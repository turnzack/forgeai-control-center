# 01 — Cahier des Charges (PRD) : AI Voice Agent

## 1. Intention Produit
Agent vocal IA pour support client dans le domaine **Assistant IA & Chatbot**. Application spécialisée manipulant l'entité `Conversation` avec 10 fonctionnalités métier authentiques, palette #D946EF/#8B5CF6, police Inter.

## 2. Fonctionnalités Clés Cibles (10)
1. **F01: Chat IA avec streaming des réponses**
2. **F02: Historique des conversations persistant avec titres**
3. **F03: Réglages avancés**
4. **F04: Support des pièces jointes (images, PDF)**
5. **F05: Citations des sources avec liens cliquables**
6. **F06: Mode RAG**
7. **F07: Fork d'une conversation pour explorer une**
8. **F08: Export Markdown/JSON de la conversation et**
9. **F09: Synthèse vocale (TTS) et reconnaissance (STT)**
10. **F10: Détection d'intention et transfert à un**

## 3. Composants UI & Briques Cibles (7)
- `[ChatMessage (avatar IA/utilisateur, contenu markdown rendu, copier, régénérer)]`
- `[StreamingCursor (curseur clignotant pendant la génération de la réponse)]`
- `[ConversationSidebar (historique, recherche, nouveau chat, rename)]`
- `[SettingsDrawer (modèle, température slider, max tokens, system prompt textarea)]`
- `[AttachmentUploader (drag-drop images/PDF avec preview et suppression)]`
- `[CitationPill (numéro + source au hover, clic ouvre la source)]`
- `[TokenUsageIndicator (compteur input/output tokens et coût estimé)]`

## 4. Composants GitHub Dérivés Intégrés (40)
- **companion.actions.ts** (`Module utilitaire`, licence `MIT`) depuis [Avinash1286/Voice-Based-Learning-Companion](https://github.com/Avinash1286/Voice-Based-Learning-Companion)
- **flow-manager.ts** (`Module utilitaire`, licence `MIT`) depuis [Gaurav890/vocal-stack](https://github.com/Gaurav890/vocal-stack)
- **recorder.ts** (`Module utilitaire`, licence `MIT`) depuis [Gaurav890/vocal-stack](https://github.com/Gaurav890/vocal-stack)
- **normalizer.ts** (`Module utilitaire`, licence `MIT`) depuis [Gaurav890/vocal-stack](https://github.com/Gaurav890/vocal-stack)
- **deploy.ts** (`Définitions TypeScript`, licence `MIT`) depuis [guillaumehussong/standard-vocal-mcp](https://github.com/guillaumehussong/standard-vocal-mcp)
- **eval.ts** (`Client API / Réseau`, licence `MIT`) depuis [guillaumehussong/standard-vocal-mcp](https://github.com/guillaumehussong/standard-vocal-mcp)
- **server.ts** (`Définitions TypeScript`, licence `MIT`) depuis [guillaumehussong/standard-vocal-mcp](https://github.com/guillaumehussong/standard-vocal-mcp)
- **versioning.ts** (`Module utilitaire`, licence `MIT`) depuis [guillaumehussong/standard-vocal-mcp](https://github.com/guillaumehussong/standard-vocal-mcp)
- **ApplicationForm.tsx** (`Module utilitaire`, licence `MIT`) depuis [hoshank/VocalApply](https://github.com/hoshank/VocalApply)
- **ShortlistWidget.tsx** (`Module utilitaire`, licence `MIT`) depuis [hoshank/VocalApply](https://github.com/hoshank/VocalApply)
- **matchOpenings.ts** (`Définitions TypeScript`, licence `MIT`) depuis [hoshank/VocalApply](https://github.com/hoshank/VocalApply)
- **guardrails.ts** (`Module utilitaire`, licence `MIT`) depuis [iammohith/Voice-First-Aura-Real-Estate-Agent-V-FAREA](https://github.com/iammohith/Voice-First-Aura-Real-Estate-Agent-V-FAREA)
- **site-header.tsx** (`Module utilitaire`, licence `MIT`) depuis [nisarahmad78/VOCALIQ](https://github.com/nisarahmad78/VOCALIQ)
- **GraphMemoryViewer.tsx** (`Client API / Réseau`, licence `MIT`) depuis [PriyanshuKr-2027/VOCALL---An-Voice-Calling-Agent](https://github.com/PriyanshuKr-2027/VOCALL---An-Voice-Calling-Agent)
- **CandidateStageTile.tsx** (`Module utilitaire`, licence `MIT`) depuis [RiyanshiVerma-11/Vocalis-AI](https://github.com/RiyanshiVerma-11/Vocalis-AI)
- **TalkingFaceAvatar.tsx** (`Définitions TypeScript`, licence `MIT`) depuis [RiyanshiVerma-11/Vocalis-AI](https://github.com/RiyanshiVerma-11/Vocalis-AI)
- **CandidateHeroBanner.tsx** (`Module utilitaire`, licence `MIT`) depuis [RiyanshiVerma-11/Vocalis-AI](https://github.com/RiyanshiVerma-11/Vocalis-AI)
- **CandidateSidebar.tsx** (`Définitions TypeScript`, licence `MIT`) depuis [RiyanshiVerma-11/Vocalis-AI](https://github.com/RiyanshiVerma-11/Vocalis-AI)
- **CandidatePipelineTable.tsx** (`Module utilitaire`, licence `MIT`) depuis [RiyanshiVerma-11/Vocalis-AI](https://github.com/RiyanshiVerma-11/Vocalis-AI)
- **RecruiterSidebar.tsx** (`Définitions TypeScript`, licence `MIT`) depuis [RiyanshiVerma-11/Vocalis-AI](https://github.com/RiyanshiVerma-11/Vocalis-AI)
- **StateProportionVisualizer.tsx** (`Module utilitaire`, licence `MIT`) depuis [RiyanshiVerma-11/Vocalis-AI](https://github.com/RiyanshiVerma-11/Vocalis-AI)
- **turnForkService.ts** (`Définitions TypeScript`, licence `MIT`) depuis [RiyanshiVerma-11/Vocalis-AI](https://github.com/RiyanshiVerma-11/Vocalis-AI)
- **jargonBooster.ts** (`Agent / Runtime`, licence `MIT`) depuis [RiyanshiVerma-11/Vocalis-AI](https://github.com/RiyanshiVerma-11/Vocalis-AI)
- **resumeParser.ts** (`Agent / Runtime`, licence `MIT`) depuis [RiyanshiVerma-11/Vocalis-AI](https://github.com/RiyanshiVerma-11/Vocalis-AI)
- **rubricParser.ts** (`Client API / Réseau`, licence `MIT`) depuis [RiyanshiVerma-11/Vocalis-AI](https://github.com/RiyanshiVerma-11/Vocalis-AI)
- **api-key.middleware.ts** (`Module utilitaire`, licence `MIT`) depuis [thequantcoder/VOCAL-IQ](https://github.com/thequantcoder/VOCAL-IQ)
- **auth.service.ts** (`Store / État`, licence `MIT`) depuis [thequantcoder/VOCAL-IQ](https://github.com/thequantcoder/VOCAL-IQ)
- **automations.service.ts** (`Store / État`, licence `MIT`) depuis [thequantcoder/VOCAL-IQ](https://github.com/thequantcoder/VOCAL-IQ)
- **stripe-webhook.ts** (`Définitions TypeScript`, licence `MIT`) depuis [thequantcoder/VOCAL-IQ](https://github.com/thequantcoder/VOCAL-IQ)
- **biometrics.service.ts** (`Store / État`, licence `MIT`) depuis [thequantcoder/VOCAL-IQ](https://github.com/thequantcoder/VOCAL-IQ)
- **instant-dial.service.ts** (`Store / État`, licence `MIT`) depuis [thequantcoder/VOCAL-IQ](https://github.com/thequantcoder/VOCAL-IQ)
- **outbound.service.ts** (`Store / État`, licence `MIT`) depuis [thequantcoder/VOCAL-IQ](https://github.com/thequantcoder/VOCAL-IQ)
- **coach.service.ts** (`Store / État`, licence `MIT`) depuis [thequantcoder/VOCAL-IQ](https://github.com/thequantcoder/VOCAL-IQ)
- **copilot.service.ts** (`Store / État`, licence `MIT`) depuis [thequantcoder/VOCAL-IQ](https://github.com/thequantcoder/VOCAL-IQ)
- **developer-apps.service.ts** (`Store / État`, licence `MIT`) depuis [thequantcoder/VOCAL-IQ](https://github.com/thequantcoder/VOCAL-IQ)
- **form-extraction.service.ts** (`Client API / Réseau`, licence `MIT`) depuis [thequantcoder/VOCAL-IQ](https://github.com/thequantcoder/VOCAL-IQ)
- **forms.routes.ts** (`Store / État`, licence `MIT`) depuis [thequantcoder/VOCAL-IQ](https://github.com/thequantcoder/VOCAL-IQ)
- **forms.service.ts** (`Store / État`, licence `MIT`) depuis [thequantcoder/VOCAL-IQ](https://github.com/thequantcoder/VOCAL-IQ)
- **fraud.service.ts** (`Store / État`, licence `MIT`) depuis [thequantcoder/VOCAL-IQ](https://github.com/thequantcoder/VOCAL-IQ)
- **feature-flags.service.ts** (`Store / État`, licence `MIT`) depuis [thequantcoder/VOCAL-IQ](https://github.com/thequantcoder/VOCAL-IQ)
