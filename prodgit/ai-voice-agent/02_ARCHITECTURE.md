# 02 — Architecture Technique & Câblage

## 1. Stack Technique
- **Runtime :** Node.js / Browser ES2022
- **Core :** React 18 + Vite + TypeScript
- **Styling :** CSS Tokens HSL / Tailwind compatible
- **Icons :** Lucide-React

## 2. Cartographie des Intégrations GitHub
Toutes les briques extraites sont encapsulées dans `src/integrations/github-adapted/` et exposées via `src/integrations/index.ts`.
Elles ne doivent jamais être modifiées sans mise à jour du fichier `PROVENANCE.md` associé.
