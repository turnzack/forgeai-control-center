> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Cybersécurité et Architectures d'Authentification (IAM).
> Ce document est le PRD (Product Requirements Document) du **PACK AUTH GATEWAY SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Architecture Sécurisée Inviolable**, tout en respectant strictement les règles métier ci-dessous.

# 🔐 PACK AUTH GATEWAY (Sécurité & Connexion)

Ce pack ne génère pas de pages marketing, mais force la création d'un système de sécurité absolu (Guards, RBAC, Sessions).

---

## 🎯 La Mission Principale (Gateway Security)

**Mission :** Sécuriser l'accès à l'application via des méthodes d'authentification modernes (Magic Links, Social Login, OAuth, JWT).
Le logiciel généré doit repousser toute tentative d'accès non-autorisé et gérer les rôles finement.

### 🧩 Core Features Architecturaux Requis :
1. **Login & Register Flow :** Interface propre, séparation des étapes (Email d'abord, mot de passe ensuite).
2. **Social Providers :** Boutons "Continuer avec Google / GitHub" standardisés.
3. **Route Guards :** Composants de type "Middleware" qui wrappent l'application React pour expulser les utilisateurs non-connectés.
4. **RBAC (Role-Based Access Control) :** Gestion de permissions (Admin, User, Guest).

---

## ⚙️ Spécifications de sécurité passerelles (Règle d'Or)

*La contrainte suivante, ajoutée par le Directeur Technique, est absolue :*

[INSTRUCTION IA]
Génère une architecture d'Authentification Inviolable :
- Centralise les validations de droits (Guards/Middleware). 
- N'expose JAMAIS de clés API publiques côté client, ni de secrets JWT.
- Gère la persistance de la session de manière sécurisée (HttpOnly Cookies si Backend couplé, ou mémoire si token éphémère).
- Fournis une interface de Login/Signup élégante (Split screen ou Modal centrée avec Glassmorphism).

[STRUCTURE REQUISE]
- `src/core/auth/pages/LoginPage.tsx`
- `src/core/auth/pages/RegisterPage.tsx`
- `src/core/auth/components/AuthGuard.tsx`
- `src/core/auth/components/SocialLoginButtons.tsx`
- `src/core/auth/contexts/AuthContext.tsx`
- `src/core/auth/hooks/useSession.ts`