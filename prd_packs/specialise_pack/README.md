> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Marketing Digital et Création de Sites Vitrines Haut de Gamme.
> Ce document est le PRD (Product Requirements Document) du **PACK SPÉCIALISÉ SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Visionnaire, Ciblant une niche précise (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 🌟 PACK SPÉCIALISÉ (Landings de Niche)

Ce pack force la création de pages marketing hyper-optimisées pour des cibles ou des industries très précises. Le design ne doit pas être générique, il doit transpirer l'identité du secteur visé.

---

## 🎯 1. Les Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les briques (Missions) que tu peux générer :

### 🐧 1. Projet Open-Source (`prd_spec_opensource`)
**Mission :** Landing pour projet open-source.
**Design Requis :** Terminal mockups, Copier-coller de commandes `npm install`, liens GitHub omniprésents, ambiance "Dev".

### 💼 2. Page Carrière / Jobs (`prd_spec_careers`)
**Mission :** Page carrière / jobs.
**Design Requis :** Photos d'équipe (Culture d'entreprise), liste de postes vacants avec filtres, valeurs de l'entreprise.

### 🎨 3. Agence Créative (`prd_spec_creative_agency`)
**Mission :** Landing agence créative.
**Design Requis :** Très grosse typographie, asymétrie, folio de projets (Case studies), curseur de souris personnalisé, design "Brutaliste" ou ultra-minimaliste.

### 🔄 4. Page de Migration (`prd_spec_migration_offer`)
**Mission :** Page offre "migration depuis X".
**Design Requis :** Comparatif biaisé "Ancien monde vs Nouveau monde", outils d'import en un clic.

### 🔒 5. Audit de Sécurité (`prd_spec_security_audit`)
**Mission :** Landing service d'audit sécurité.
**Design Requis :** Mode sombre exclusif (Dark mode), typos monospace (Hackers vibe), logos de certifications de sécurité.

### 🏢 6. Cabinet de Conseil (`prd_spec_consulting`)
**Mission :** Landing cabinet de conseil.
**Design Requis :** Corporate, luxueux, beaucoup d'espace blanc, typos Serifs élégantes, photos de personnes en costume/professionnelles.

### 👨‍💻 7. Dev Freelance Sénior (`prd_spec_freelance_dev`)
**Mission :** Landing dev freelance sénior.
**Design Requis :** Portfolio personnel, stack technologique (Icônes), disponibilité (Dispo/Indispo), testimonials clients.

### ❤️ 8. Organisation Non-Profit (`prd_spec_non_profit`)
**Mission :** Landing organisation non-profit (ONG/Association).
**Design Requis :** Grandes images d'impact émotionnel, gros bouton "Faire un don", compteur de fonds levés.

### 📱 9. App Store Showcase (`prd_spec_app_showcase`)
**Mission :** Page style App Store pour app.
**Design Requis :** Énorme Mockup d'iPhone au centre, QR Code pour télécharger, liens Apple/Google Store.

### ⏳ 10. Page "Coming Soon" (`prd_spec_coming_soon`)
**Mission :** Page "Coming Soon" très travaillée.
**Design Requis :** Input Email pour la liste d'attente (Waitlist), flou en arrière-plan, promesse forte.

---

## 🎨 2. Vision UI/UX & Design System Spécialisé
* **Directives pour Stitch :** La clé de ce pack est **l'empathie visuelle**. Si on cible des développeurs (Open-Source), l'UI doit être sombre, avec du code. Si on cible une association (Non-Profit), l'UI doit être chaleureuse et lumineuse.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi un site pour mon agence de webdesign", utilise `prd_spec_creative_agency` et mets le paquet sur des animations Framer Motion très extravagantes, des grandes images de portfolio et une typo énorme.*

[INSTRUCTION IA]
Génère une Landing Page spécialisée de niche :
- Design System adapté à l'industrie cible (Couleurs, Typographie).
- Composants de "Social Proof" (Preuve sociale) pertinents pour la cible.
- Formulaire de conversion (CTA) clair et adapté (ex: "Join Waitlist", "View Jobs", "Hire Me").

[STRUCTURE REQUISE]
- `src/features/landing/pages/NicheLandingPage.tsx`
- `src/features/landing/components/HeroSpecialized.tsx`
- `src/features/landing/components/SocialProofRow.tsx`
- `src/features/landing/components/ConversionSection.tsx`