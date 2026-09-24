> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Typographie, Édition de Contenu et Interfaces WYSIWYG.
> Ce document est le PRD (Product Requirements Document) du **PACK TEXTE SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Concentrée, Minimaliste et Éditoriale (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# ✍️ PACK TEXTE (Édition & WYSIWYG)

Ce pack force la création d'interfaces de rédaction avancées (façon Notion, Medium ou Google Docs). Le texte est la donnée la plus vitale, l'interface doit donc offrir une expérience de frappe fluide, sans latence.

---

## 🎯 1. Les Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici la brique métier (Mission) principale :

### 📝 1. Éditeur Riche (Notion-like) (`prd_text_wysiwyg`)
**Mission :** Éditeur de texte riche (WYSIWYG) type Notion.
**Design Requis :** Page blanche épurée, centrage du contenu (`max-w-prose`). Menu flottant (Slash commands `/` pour ajouter des blocs). Barre d'outils contextuelle (Bubble menu) qui apparaît lors de la sélection de texte.

---

## 🎨 2. Vision UI/UX & Design System Texte
* **Directives pour Stitch :** La typographie est reine. Utilise des polices de haute qualité (Inter, Serif, Mono) avec un Line-height de `1.6` pour une lisibilité parfaite.
* **Marges (Whitespace) :** Les marges sont le luxe de l'édition. Utilise de grands `padding` autour de la zone de texte pour aérer la vue. 
* **Distraction-Free :** En mode frappe, la navigation et les barres d'outils latérales doivent s'estomper (fade out).

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi un éditeur de note moderne avec des raccourcis", tu dois utiliser `prd_text_wysiwyg` et implémenter Tiptap ou un équivalent.*

[INSTRUCTION IA]
Génère une architecture d'Édition de Texte :
- Implémentation de Tiptap, Slate.js ou ProseMirror.
- Gestion d'un "Menu Slash" activé par la touche `/` (Commande flottante).
- Formatage du texte persistant (gras, italique, titres).
- Sauvegarde automatique (Auto-save) debouncée (ex: `useDebounce`).

[STRUCTURE REQUISE]
- `src/features/editor/components/NotionLikeEditor.tsx`
- `src/features/editor/components/SlashMenu.tsx`
- `src/features/editor/components/BubbleToolbar.tsx`
- `src/features/editor/hooks/useEditorState.ts`