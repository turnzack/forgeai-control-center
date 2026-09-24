> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Marketing Digital, Funnels de Conversion et Growth Hacking.
> Ce document est le PRD (Product Requirements Document) du **PACK MARKETING SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Taillée pour Vendre, Capturer et Convertir (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 🎯 PACK MARKETING (Funnels & Campagnes)

Ce pack force la création d'infrastructures de conversion agressives et optimisées. L'objectif n'est pas de faire un beau site, mais de faire un site qui transforme les visiteurs en leads (prospects) ou en acheteurs.

---

## 🎯 1. Les Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les briques (Missions) que tu peux générer :

### 🚀 1. Campagne Promotionnelle (`prd_mkt_promo_campaign`)
**Mission :** Page pour une campagne spécifique (promo, bundle).
**Design Requis :** Urgence visuelle (Bandeau rouge), Countdown timer, Prix barrés énormes.

### 🎙️ 2. Landing Webinar (`prd_mkt_webinar`)
**Mission :** Landing webinar (talk, date, speakers).
**Design Requis :** Formulaire de capture d'email bloquant "above the fold" (visible directement), têtes des intervenants en rond.

### 🎪 3. Conférence Multi-Tracks (`prd_mkt_conference`)
**Mission :** Page conférence/summit multi-tracks.
**Design Requis :** Grille d'agenda interactive (par jour, par salle), système de billetterie.

### 📘 4. Lead Magnet (`prd_mkt_lead_magnet`)
**Mission :** Landing pour lead magnet (ebook, template).
**Design Requis :** Mockup 3D du livre à gauche, promesse + 3 bullet points + Formulaire à droite (Split Screen).

### 🤔 5. Quiz Qualificatif (`prd_mkt_quiz_funnel`)
**Mission :** Landing avec quiz pour qualifier leads.
**Design Requis :** Typeform-like. Une question par écran, très grand, avec une jauge de progression. L'email est demandé à la TOUTE fin.

### 🎟️ 6. Waitlist VIP (`prd_mkt_vip_waitlist`)
**Mission :** Waitlist VIP / accès limité.
**Design Requis :** Effet de rareté (Scarcity). Affichage du type "2450 personnes sont devant vous".

### 🤝 7. Programme de Parrainage (`prd_mkt_referral`)
**Mission :** Page programme de parrainage.
**Design Requis :** "Give $10, Get $10". Dashboard montrant les invitations réussies, et lien unique à copier.

### 📚 8. Lancement d'Ebook (`prd_mkt_ebook_launch`)
**Mission :** Landing pour lancement ebook / guide.
**Design Requis :** Chapitrage détaillé (Sommaire), témoignages de lecteurs influents.

### 🤝 9. Sponsoring (`prd_mkt_sponsorship`)
**Mission :** Page sponsoring pour un produit ou event.
**Design Requis :** Chiffres clés du trafic, grille des tarifs publicitaires.

### 📈 10. Upsell Post-Achat (`prd_mkt_post_purchase_upsell`)
**Mission :** Page d'upsell après achat (One-Click Upsell).
**Design Requis :** "Attendez, votre commande n'est pas terminée !". Bouton Vert géant "Ajouter à ma commande pour 10€".

---

## 🎨 2. Vision UI/UX & Design System Marketing
* **Directives pour Stitch :** Les pages marketing suivent des règles psychologiques. Pas de liens de navigation vers le reste du site (Leaking) : l'utilisateur ne doit avoir que deux choix (Convertir ou Fermer).
* **Copie & Typographie :** La hiérarchie H1 > H2 > Bullet points doit scanner parfaitement. Les CTA (Call to Action) doivent contraster violemment avec le reste de la page (ex: Bouton Jaune sur fond Bleu Nuit).

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi un entonnoir pour vendre mon E-book", fusionne `prd_mkt_ebook_launch` avec `prd_mkt_post_purchase_upsell`.*

[INSTRUCTION IA]
Génère une infrastructure de Funnel Marketing :
- Suppression complète des menus de navigation haut/bas (Header/Footer minimalistes).
- Implémentation de "Social Proof" (Bandeaux "Vu dans Forbes", Trustpilot étoiles).
- Formulaires optimisés pour la conversion (Autofocus sur le premier champ, label clairs).

[STRUCTURE REQUISE]
- `src/features/marketing/pages/FunnelLanding.tsx`
- `src/features/marketing/pages/UpsellPage.tsx`
- `src/features/marketing/components/CountdownTimer.tsx`
- `src/features/marketing/components/LeadCaptureForm.tsx`