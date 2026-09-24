> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Géolocalisation, Cartographie et Interfaces Map-First.
> Ce document est le PRD (Product Requirements Document) du **PACK LOCAL & MAPS SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Cartographique Performante (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 🌍 PACK LOCAL & MAPS (Géolocalisation & Cartes)

Ce pack force la création d'applications "Map-First" (façon Airbnb, Uber ou Google Maps). L'écran est dominé par la carte géographique, et l'interface vient se superposer par-dessus (Overlays).

---

## 🎯 1. Les Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les briques (Missions) que tu peux générer :

### 🗺️ 1. Explorateur Carte (`prd_map_explorer`)
**Mission :** Écran map explorateur (scroll + map).
**Design Requis :** Écran divisé (Split-screen). Carte interactive à gauche/haut, liste d'items (Lieux/Biens immobiliers) à droite/bas.

### 📍 2. Sélecteur de Localisation (`prd_map_location_picker`)
**Mission :** Sélecteur de localisation.
**Design Requis :** Pin au centre de l'écran, l'utilisateur déplace la carte sous le pin.

### 🚗 3. Aperçu d'Itinéraire (`prd_map_route_preview`)
**Mission :** Preview d’itinéraire (voiture, marche).
**Design Requis :** Ligne polyline (Bleue) dessinée entre point A et B avec temps de trajet.

### 🏢 4. Lieux à Proximité (`prd_map_nearby`)
**Mission :** Découverte "à proximité".
**Design Requis :** Bouton "Autour de moi", clustering de marqueurs si trop denses.

### 🚧 5. Geofencing (`prd_map_geofences`)
**Mission :** Gestion zones géo (geofences).
**Design Requis :** Outil de dessin de polygones sur la carte.

### ✅ 6. Check-in Géolocalisé (`prd_map_checkin`)
**Mission :** Check-in/out géolocalisé.
**Design Requis :** Bouton qui s'active uniquement si la position GPS de l'utilisateur est dans un rayon valide.

### 🏪 7. Store Locator (`prd_map_store_locator`)
**Mission :** Localisateur de magasins mobile.
**Design Requis :** Barre de recherche en haut, carte, et liste horizontale glissante (Swipe) des magasins.

### 🚕 8. Suivi VTC / Course (`prd_map_live_tracking`)
**Mission :** Suivi course (type VTC).
**Design Requis :** Petite voiture/icône animée glissant sur la route (Interpolation de coordonnées).

### ⛅ 9. Météo Contextuelle (`prd_map_weather_overlay`)
**Mission :** Overlay météo contextuelle.
**Design Requis :** Filtres visuels (Pluie, Nuages) ou petites cartes widgets superposées à la map.

### 🔒 10. UI Permissions (`prd_map_permissions`)
**Mission :** UI permission emplacement.
**Design Requis :** Écran d'explication "Pourquoi nous avons besoin de votre GPS" avant de lancer l'alerte du navigateur.

---

## 🎨 2. Vision UI/UX & Design System Maps
* **Directives pour Stitch :** Les boutons par-dessus la carte doivent être des composants "Flottants" (FAB, Floating Action Buttons) avec une ombre lourde pour se détacher du fond visuellement bruyant de la carte.
* **Layout :** Utilise `h-screen` et `w-screen` pour le conteneur, avec `overflow-hidden`.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi un clone d'Uber", tu dois fusionner `prd_map_live_tracking`, `prd_map_route_preview` et `prd_map_location_picker`.*

[INSTRUCTION IA]
Génère une architecture Cartographique :
- Conteneur Mapbox GL JS, Leaflet ou Google Maps API.
- Gestion de l'état (State) de la vue carte (Latitude, Longitude, Zoom).
- Intégration de l'API `navigator.geolocation` pour le positionnement.
- Cartes (Cards) d'information synchronisées (Hover on list = Highlight on map).

[STRUCTURE REQUISE]
- `src/features/maps/pages/MapExplorerPage.tsx`
- `src/features/maps/components/InteractiveMap.tsx`
- `src/features/maps/components/FloatingSearchBar.tsx`
- `src/features/maps/hooks/useGeolocation.ts`