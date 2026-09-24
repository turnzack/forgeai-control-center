> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé dans les infrastructures Full-Stack et les environnements de déploiement universels.
> Ce document est le PRD (Product Requirements Document) du **PACK FORGE UNIVERSELLE SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Architecture Robuste, Cross-Platform et Agnostique**, tout en respectant strictement les règles métier ci-dessous.

# 🛠️ PACK FORGE UNIVERSELLE (Le Socle Backend/Frontend Absolu)

Ce pack ne se concentre pas uniquement sur l'UI, mais force la création d'une **stack technique complète** (Backend + Frontend) prête à être déployée n'importe où, avec une tolérance zéro pour les erreurs d'environnement.

---

## 🎯 La Mission Principale (Architecture Elite)

**Mission :** Générer un projet Full-Stack performant, léger et universel.
Le système généré doit être capable de tourner aussi bien sur un PC Windows local que sur un serveur Linux en production sans nécessiter de lourdes configurations.

### 🧩 Core Features Architecturaux Requis :
1. **Frontend Ultra-Rapide :** Utilisation de Vite (React ou VueJS) pour un build instantané et un Hot-Module Replacement (HMR) performant.
2. **Backend Haute Performance :** API développée en FastAPI (Python), servie via Uvicorn.
3. **Base de Données Légère :** Utilisation stricte de SQLite local pour éviter les dépendances externes (pas de PostgreSQL ni de Docker requis pour lancer l'app).
4. **Script de Lancement Universel :** Génération d'un fichier `launcher.bat` (Windows) et `launcher.sh` (Linux/Mac) exécutant `python -m uvicorn app.main:app --host 0.0.0.0 --port 8088 --reload`.

---

## ⚙️ Adaptabilité de Code OS et Environnement

*La contrainte suivante est absolue et prévaut sur toutes les autres considérations techniques :*

[INSTRUCTION IA]
Génère un code **100% agnostique** :
- **Chemins de fichiers :** Évite absolument les chemins absolus (Windows/Linux). Utilise systématiquement `os.path.join` (Python) ou `path.join` (Node.js) avec des résolutions relatives (`__dirname`, `import.meta.url`).
- **Compatibilité Cross-Platform :** Assure que les scripts d'installation (`npm run dev:all`) fonctionnent indifféremment sous PowerShell, Bash, ou CMD.
- **Variables d'Environnement :** Prépare un fichier `.env.example` propre. Aucune clé ou chemin en dur n'est toléré dans le code source.

[STRUCTURE REQUISE]
- `/backend/app/main.py` (Point d'entrée FastAPI)
- `/backend/app/database.py` (Connexion SQLite)
- `/frontend/vite.config.ts` (Configuration du proxy vers le port 8088)
- `/frontend/src/App.tsx` (Interface utilisateur principale)
- `/launcher.bat` & `/launcher.sh` (Scripts de démarrage universels)
- `/requirements.txt` & `/package.json` (Gestion des dépendances isolées)