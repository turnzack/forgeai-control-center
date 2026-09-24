# PRD Packs

PRD Packs are **project templates** for AIOS Studio. Each pack is a self-contained
JSON description of a project archetype — its name, description, icon, recommended
stack, feature flags, page list, and category — that users can pick from the
landing sidebar to instantly launch a tailored orchestration session.

## What is a PRD Pack?

A PRD (Product Requirements Document) pack is a small JSON manifest that captures
the *intent* and *shape* of a typical project. Rather than starting from a blank
prompt, the user selects a pack and AIOS Studio immediately bootstraps the right
Hermes orchestration context:

- the **defaultIntent** is sent as the user's first message,
- the **stack** field tells the orchestrator which scaffolder to use,
- the **features** array toggles which Hermes skills get pre-loaded
  (e.g. `dashboard`, `auth`, `api`, `store`),
- the **pages** array seeds the ForgeScaffolder route generator,
- the **icon** and **color** drive the card rendering in the sidebar.

## How they are used

1. The user opens AIOS Studio and sees the landing panel.
2. The sidebar lists the available packs (icon + name + description).
3. Clicking a pack fills the input bar with the pack's `defaultIntent` and
   tags the orchestration session with the pack's `slug`, `stack`, `features`
   and `pages`.
4. Pressing Enter (or clicking Run) launches the Hermes orchestration pipeline
   with that context — the orchestrator builds the matching project, scaffolds
   the requested pages, and provisions the requested features.

## Available packs

| Slug | Name | Category | Icon |
| --- | --- | --- | --- |
| `e_commerce` | E-commerce | business | ShoppingCart |
| `saas` | SaaS Dashboard | business | LayoutDashboard |
| `blog` | Blog | content | PenTool |
| `portfolio` | Portfolio | creative | Palette |
| `task_manager` | Gestion de tâches | productivity | CheckSquare |
| `landing` | Landing Page | marketing | Rocket |

### Categories

- **business** — revenue-generating apps (e-commerce, SaaS)
- **content** — editorial / publishing sites (blog)
- **creative** — showcase / personal brand sites (portfolio)
- **productivity** — internal tools and work apps (task manager)
- **marketing** — conversion-focused single-purpose pages (landing)

## Pack schema

Every `pack.json` follows the same shape:

```jsonc
{
  "slug": "lowercase_snake_case_id",     // unique identifier
  "name": "Human readable name",          // sidebar label
  "description": "Short pitch",           // sidebar sublabel
  "icon": "LucideIconName",               // icon component name
  "color": "from-xxx to-yyy",             // tailwind gradient classes
  "defaultIntent": "First prompt sent",   // orchestrator seed
  "stack": "web-react-vite",              // scaffolder target
  "features": ["dashboard", "api", ...],  // hermes skills to pre-load
  "pages": ["/", "/..."],                 // routes to scaffold
  "category": "business|content|creative|productivity|marketing"
}
```

## Layout

```
prd_packs/
├── README.md                      (this file)
├── e_commerce_pack/pack.json
├── saas_pack/pack.json
├── blog_pack/pack.json
├── portfolio_pack/pack.json
├── task_manager_pack/pack.json
├── landing_pack/pack.json
├── hermes_moa_presets/            (unrelated — MoA presets)
└── stealth_bridge_v11_2/          (unrelated — browser extension)
```
