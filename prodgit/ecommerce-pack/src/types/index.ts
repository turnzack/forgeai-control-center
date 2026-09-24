/**
 * Modèle de données & contrats TypeScript — 🛒 PACK E-COMMERCE
 * Domaine : ECOMMERCE
 */

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  brand: string;
  attributes: { size?: string[]; color?: string[] };
  stock: number;
  rating: number;
  reviewCount: number;
  description: string;
  isPromo?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered";
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
}

export interface FilterState {
  category: string;
  maxPrice: number;
  sortBy: "popular" | "price-asc" | "price-desc" | "rating";
  searchQuery: string;
  inStockOnly?: boolean;
  promoOnly?: boolean;
}
