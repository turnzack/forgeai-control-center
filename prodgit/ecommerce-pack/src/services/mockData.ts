import { Product } from "../types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-01",
    slug: "casque-sans-fil-anc-pro",
    name: "Casque Audio Spatial ANC Pro",
    price: 249.99,
    compareAtPrice: 299.99,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"],
    category: "Audio & Tech",
    brand: "AuraSound",
    attributes: { color: ["Noir Mat", "Argent", "Bleu Nuit"] },
    stock: 24,
    rating: 4.8,
    reviewCount: 142,
    description: "Réduction de bruit active adaptative hybride, audio haute résolution 24-bit et autonomie de 40 heures.",
    isPromo: true
  },
  {
    id: "prod-02",
    slug: "montre-connectee-zenith-pulse",
    name: "Montre Connectée Zenith Pulse",
    price: 189.00,
    compareAtPrice: 229.00,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"],
    category: "Objets Connectés",
    brand: "ZenithTech",
    attributes: { color: ["Titane", "Carbone", "Or Rose"] },
    stock: 18,
    rating: 4.7,
    reviewCount: 89,
    description: "Écran AMOLED Always-On, suivi cardiofréquencemètre en continu, GPS intégré et étanchéité 50m.",
    isPromo: true
  },
  {
    id: "prod-03",
    slug: "clavier-mecanique-rgb-tactile",
    name: "Clavier Mécanique Lumina 75%",
    price: 139.50,
    images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80"],
    category: "Informatique",
    brand: "VortexKeys",
    attributes: { color: ["Blanc Glacé", "Gris Anthracite"] },
    stock: 35,
    rating: 4.9,
    reviewCount: 210,
    description: "Switches tactiles lubrifiés en usine, châssis aluminium CNC et connectivité triple-mode.",
    isPromo: false
  },
  {
    id: "prod-04",
    slug: "sac-a-dos-urbain-etanche",
    name: "Sac à Dos Urbain Nomad Waterproof",
    price: 89.90,
    compareAtPrice: 119.00,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"],
    category: "Maroquinerie & Voyage",
    brand: "NomadCraft",
    attributes: { color: ["Noir Tactique", "Vert Olive"] },
    stock: 42,
    rating: 4.6,
    reviewCount: 67,
    description: "Tissu Cordura imperméable, compartiment ordinateur 16 pouces et poche anti-RFID.",
    isPromo: true
  }
];

export const CATEGORIES = ["Tous", "Audio & Tech", "Objets Connectés", "Informatique", "Maroquinerie & Voyage"];
