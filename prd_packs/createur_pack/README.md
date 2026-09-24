> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé dans la "Creator Economy" et le Personal Branding.
> Ce document est le PRD (Product Requirements Document) du **PACK CRÉATEUR SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Narcissique, Minimaliste et Hautement Personnalisée (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 🎨 PACK CRÉATEUR (Portfolio & Linktree)

Ce pack force la création de présences numériques pour des individus (Créateurs de contenu, Développeurs, Artistes). Le produit doit mettre en valeur la personne avant tout, souvent via de grands portraits, des biographies pointues et des liens rapides.

---

## 🎯 1. Les Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les briques (Missions) que tu peux générer :

### 👤 1. Portfolio Minimaliste (`prd_creator_portfolio`)
**Mission :** Portfolio minimaliste (projets, stack, about).
**Design Requis :** Beaucoup d'espaces blancs. Typographie massive pour le nom. Grille de projets avec un effet "Reveal" au survol.

### 🔗 2. Link in Bio (Linktree-like) (`prd_creator_linktree`)
**Mission :** Linktree-like version dark premium.
**Design Requis :** Layout mobile centré même sur desktop. Avatar rond massif en haut, suivi d'une pile de gros boutons très contrastés (Glassmorphism ou Neo-brutalisme).

### ✍️ 3. Blog Personnel (`prd_creator_blog`)
**Mission :** Blog personnel avec page auteur.
**Design Requis :** Mise en page asymétrique, signature dessinée à la main en bas d'article, flux RSS mis en évidence.

### 🎙️ 4. Hub Podcast / Émission (`prd_creator_podcast`)
**Mission :** Page émission/podcast.
**Design Requis :** Lecteur audio persistant collé en bas de l'écran, liste des épisodes avec timestamps.

### 🎓 5. Landing Formation Solo (`prd_creator_course`)
**Mission :** Landing pour une formation solo.
**Design Requis :** Vidéo d'introduction de l'auteur, "Social Proof" via des témoignages Twitter intégrés.

### 👥 6. Membership Communautaire (`prd_creator_membership`)
**Mission :** Landing pour membership communautaire (ex: Patreon).
**Design Requis :** Grille des Tiers (Tiers de paiement) avec des avantages clairement listés par niveaux.

### 📸 7. Galerie Photo Responsive (`prd_creator_gallery`)
**Mission :** Galerie photo responsive.
**Design Requis :** Masonry layout sans gouttières (Gap 0) pour une immersion totale.

### 📄 8. CV Interactif (`prd_creator_interactive_resume`)
**Mission :** CV/Resume interactif.
**Design Requis :** Timeline (Ligne du temps) verticale pour les expériences, barres de progression pour les compétences.

### 📚 9. Promo de Livre (`prd_creator_book_promo`)
**Mission :** Page pour promo d'un livre/auteur.
**Design Requis :** Mockup 3D du livre au centre, 3 chapitres gratuits téléchargeables en échange d'un email.

### ☕ 10. Sponsor Me (`prd_creator_sponsor`)
**Mission :** Page "Sponsor me" pour créateur (Buy me a coffee).
**Design Requis :** Curseur dynamique (Slider) pour choisir un montant de don, animations de confettis au succès.

---

## 🎨 2. Vision UI/UX & Design System Créateur
* **Directives pour Stitch :** Le design doit être extrêmement "Opinionated". Utilise des polices de caractères qui ont une forte personnalité (Fraunces, Space Grotesk, Syne).
* **Animations :** Utilise Framer Motion pour des animations d'entrée spectaculaires (`initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}`).

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi un site pour mettre tous mes liens sociaux", utilise `prd_creator_linktree` en Dark Mode.*

[INSTRUCTION IA]
Génère une architecture de Personal Branding :
- Composants visuels riches et auto-centrés (Avatars, Biographies).
- Intégration de flux sociaux mockés (Derniers tweets, dernière vidéo YouTube).
- Boutons d'action rapides et évidents (Contacter, Suivre, Acheter).

[STRUCTURE REQUISE]
- `src/features/creator/pages/LinktreePage.tsx`
- `src/features/creator/components/AvatarHeader.tsx`
- `src/features/creator/components/SocialLinkButton.tsx`