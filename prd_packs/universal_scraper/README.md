> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Data Engineering, Extraction de Données et Web Scraping.
> Ce document est le PRD (Product Requirements Document) du **PACK UNIVERSAL SCRAPER SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface de Contrôle Technique (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 🕷️ PACK UNIVERSAL SCRAPER (Extracteur de Données)

Ce pack force la création d'interfaces de gestion pour des robots (Scrapers/Crawlers). Il ne s'agit pas de sites grand public, mais de tableaux de bord pour superviser la collecte massive de données.

---

## 🎯 La Mission Principale (Tour de Contrôle Scraping)

**Mission :** Développer un tableau de bord (Control Panel) permettant de configurer des cibles de scraping, lancer des jobs et visualiser les données extraites.

### 🧩 Core Features Architecturaux Requis :
1. **Gestionnaire de Cibles (Target Manager) :** Interface pour ajouter une URL, définir des sélecteurs CSS ou XPath à extraire, et configurer la fréquence.
2. **Monitoring des Tâches (Job Queue) :** Liste des scrapers en cours de fonctionnement avec statuts (Running, Failed, Completed) et logs en direct.
3. **Visualiseur de Données (Data Grid) :** Tableau dense affichant les résultats JSON extraits prêts à être exportés (CSV/JSON).
4. **Gestion des Proxies :** Interface pour ajouter et vérifier la santé (Health check) d'une liste d'IPs.

---

## 🎨 Vision UI/UX & Design System Scraper
* **Directives pour Stitch :** Interface typée "DevOps". Utilise des consoles noires pour afficher les logs de scraping, des polices Monospace pour les sélecteurs CSS, et des badges de statut bien visibles (Vert = Ok, Rouge = Banni).

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*À utiliser quand l'utilisateur souhaite créer un outil pour "aspirer" des sites.*

[INSTRUCTION IA]
Génère une architecture de Dashboard de Scraping :
- Interface de logs défilants (Terminal-like UI).
- Tableaux de données complexes.
- Modales de configuration avancée (User-Agents, Delays, Proxies).

[STRUCTURE REQUISE]
- `src/features/scraper/pages/ScraperDashboard.tsx`
- `src/features/scraper/components/TargetConfigForm.tsx`
- `src/features/scraper/components/LiveLogsConsole.tsx`
- `src/features/scraper/components/ExtractedDataGrid.tsx`
