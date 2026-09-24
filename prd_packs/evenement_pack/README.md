> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Événementiel et Expérientiel.
> Ce document est le PRD (Product Requirements Document) du **PACK ÉVÉNEMENT SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Dynamique et Urgente (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 🎟️ PACK ÉVÉNEMENT (Conférences & Billetterie)

Ce pack force la création de plateformes événementielles. Le temps (Timers) et les intervenants (Speakers) sont au centre de l'expérience.

---

## 🎯 1. Les Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les briques (Missions) que tu peux générer :

### 🎤 1. Site de Conférence (`prd_event_conference`)
**Mission :** Site complet conférence (home + agenda + speakers).
**Design Requis :** Hero Banner avec le lieu/date énorme, suivi de grilles de speakers avec effet de survol.

### 📅 2. Landing Meetup (`prd_event_meetup`)
**Mission :** Landing meetup simple.
**Design Requis :** Interface propre affichant la Map (Localisation) et un bouton "RSVP".

### 🌐 3. Sommet en Ligne (`prd_event_online_summit`)
**Mission :** Page sommet en ligne (sessions + replays).
**Design Requis :** Lecteur vidéo intégré, chat latéral en direct, liste des sessions à venir en bas.

### 💻 4. Landing Hackathon (`prd_event_hackathon`)
**Mission :** Landing hackathon.
**Design Requis :** Typographie monospaced, compte à rebours avant le kickoff, liste des sponsors techniques.

### 🚀 5. Lancement Produit Live (`prd_event_product_launch`)
**Mission :** Page live de lancement produit (stream embed).
**Design Requis :** Effet "Keynote Apple". Fond noir absolu, lecteur vidéo immense.

### 🎪 6. Expo Virtuelle (`prd_event_virtual_expo`)
**Mission :** Landing expo virtuelle (stands, sponsors).
**Design Requis :** Grille des logos de sponsors (Gold, Silver, Bronze) cliquables.

### 💳 7. Achat de Billets (`prd_event_ticketing`)
**Mission :** Page achat billets (pricing + détails).
**Design Requis :** Cartes de prix (Early Bird, Regular, VIP) avec un stepper pour le paiement.

### 📸 8. Récapitulatif Post-Event (`prd_event_recap`)
**Mission :** Page récap après event (photos, replays).
**Design Requis :** Galerie photo Masonry et statistiques clés ("1000 participants, 45 talks").

---

## 🎨 2. Vision UI/UX & Design System Événement
* **Directives pour Stitch :** Les sites événementiels utilisent des polices gigantesques pour les dates et le lieu. 
* **Boutons :** Les Call-to-Action (S'inscrire / Acheter un billet) doivent être "Sticky" (Flottants en haut ou en bas de l'écran) pour ne jamais être perdus de vue lors du scroll.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi un site pour le prochain séminaire", fusionne l'Agenda, les Speakers et le formulaire RSVP.*

[INSTRUCTION IA]
Génère une architecture Événementielle :
- Gestion du temps : Affichage contextuel ("Commence dans 2 jours", "En direct", "Terminé").
- Composant d'Agenda : Système de Tabs pour naviguer entre les jours (Jour 1, Jour 2).
- Section Speakers : Grille de cartes avec photos détourées.

[STRUCTURE REQUISE]
- `src/features/events/pages/EventHome.tsx`
- `src/features/events/components/SpeakerGrid.tsx`
- `src/features/events/components/AgendaTabs.tsx`
- `src/features/events/components/TicketingCard.tsx`