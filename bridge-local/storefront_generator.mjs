import fs from "fs/promises";
import path from "path";

/**
 * Générateur Universel de Vitrine Finale (Phase 3)
 * Assemble automatiquement les briques du PRD en une application opérationnelle.
 */
export async function assembleStorefrontApp(projDir, projectName, packSlug = "ecommerce_pack") {
  const dirsToCreate = [
    path.join(projDir, "src", "types"),
    path.join(projDir, "src", "services"),
    path.join(projDir, "src", "components"),
    path.join(projDir, "src", "features"),
    path.join(projDir, "src", "integrations"),
  ];
  for (const d of dirsToCreate) {
    await fs.mkdir(d, { recursive: true });
  }

  let filesCreated = 0;

  // 1. src/types/index.ts
  const typesContent = `/**
 * Modèle de données & contrats TypeScript
 * Pack : E-Commerce Suite (${packSlug || "ecommerce_pack"})
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
  attributes: {
    size?: string[];
    color?: string[];
  };
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
}

export interface ProjectMetadata {
  id: string;
  name: string;
  packSlug: string;
  version: string;
  features: string[];
  mountedGemsCount: number;
}
`;
  await fs.writeFile(path.join(projDir, "src", "types", "index.ts"), typesContent, "utf-8");
  filesCreated++;

  // 2. src/services/mockData.ts
  const mockDataContent = `import { Product } from "../types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-01",
    slug: "casque-sans-fil-anc-pro",
    name: "Casque Audio Spatial ANC Pro",
    price: 249.99,
    compareAtPrice: 299.99,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80"
    ],
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
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"
    ],
    category: "Objets Connectés",
    brand: "ZenithTech",
    attributes: { color: ["Titane", "Carbone", "Or Rose"], size: ["40mm", "44mm"] },
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
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80"
    ],
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
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"
    ],
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

export const CATEGORIES = [
  "Tous",
  "Audio & Tech",
  "Objets Connectés",
  "Informatique",
  "Maroquinerie & Voyage"
];
`;
  await fs.writeFile(path.join(projDir, "src", "services", "mockData.ts"), mockDataContent, "utf-8");
  filesCreated++;

  // 3. src/components/ProductCard.tsx
  const productCardContent = `import React from "react";
import { Product } from "../types";
import { ShoppingBag, Star, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetail: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetail,
}) => {
  return (
    <div className="product-card">
      <div className="product-image-wrap" onClick={() => onViewDetail(product)}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        {product.isPromo && (
          <span className="promo-tag">PROMO</span>
        )}
        <button
          className="quick-view-btn"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail(product);
          }}
          title="Aperçu rapide"
        >
          <Eye size={15} />
        </button>
      </div>

      <div className="product-info">
        <div className="product-category">{product.category} · {product.brand}</div>
        <h3 className="product-title" onClick={() => onViewDetail(product)}>
          {product.name}
        </h3>

        <div className="product-rating">
          <Star size={13} className="star-filled" />
          <span className="rating-val">{product.rating}</span>
          <span className="rating-count">({product.reviewCount})</span>
        </div>

        <div className="product-footer">
          <div className="product-price-box">
            <span className="product-price">{product.price.toFixed(2)} €</span>
            {product.compareAtPrice && (
              <span className="product-compare-price">{product.compareAtPrice.toFixed(2)} €</span>
            )}
          </div>

          <button
            className="add-to-cart-btn"
            onClick={() => onAddToCart(product)}
            title="Ajouter au panier"
          >
            <ShoppingBag size={15} />
            <span>Ajouter</span>
          </button>
        </div>
      </div>
    </div>
  );
};
`;
  await fs.writeFile(path.join(projDir, "src", "components", "ProductCard.tsx"), productCardContent, "utf-8");
  filesCreated++;

  // 4. src/components/FilterSidebar.tsx
  const filterSidebarContent = `import React from "react";
import { FilterState } from "../types";
import { CATEGORIES } from "../services/mockData";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  totalResults: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <div className="filter-title">
          <SlidersHorizontal size={16} />
          <span>Filtres</span>
          <span className="results-pill">{totalResults}</span>
        </div>
        <button className="reset-btn" onClick={onReset} title="Réinitialiser">
          <RotateCcw size={13} />
        </button>
      </div>

      <div className="filter-group">
        <label className="filter-group-label">Catégories</label>
        <div className="category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={\`cat-pill \${filters.category === cat ? "cat-pill-active" : ""}\`}
              onClick={() => onChange({ ...filters, category: cat })}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <div className="price-label-row">
          <label className="filter-group-label">Prix maximum</label>
          <span className="price-display">{filters.maxPrice} €</span>
        </div>
        <input
          type="range"
          min="30"
          max="350"
          step="10"
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="price-slider"
        />
        <div className="slider-ticks">
          <span>30 €</span>
          <span>150 €</span>
          <span>350 €</span>
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-group-label">Trier par</label>
        <select
          className="sort-select"
          value={filters.sortBy}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value as any })}
        >
          <option value="popular">Popularité & Notes</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="rating">Meilleures évaluations</option>
        </select>
      </div>
    </aside>
  );
};
`;
  await fs.writeFile(path.join(projDir, "src", "components", "FilterSidebar.tsx"), filterSidebarContent, "utf-8");
  filesCreated++;

  // 5. src/components/CartDrawer.tsx
  const cartDrawerContent = `import React from "react";
import { CartItem } from "../types";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal > 100 || items.length === 0 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <div className="cart-title">
            <ShoppingBag size={18} />
            <span>Mon Panier ({items.reduce((acc, item) => acc + item.quantity, 0)})</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={42} className="muted-icon" />
            <p>Votre panier est vide pour le moment.</p>
            <button className="continue-shopping-btn" onClick={onClose}>
              Découvrir les produits
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {items.map((item) => (
                <div key={item.product.id} className="cart-item-row">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="cart-item-img"
                  />
                  <div className="cart-item-details">
                    <div className="cart-item-name">{item.product.name}</div>
                    <div className="cart-item-unit-price">{item.product.price.toFixed(2)} €</div>

                    <div className="cart-item-qty-row">
                      <div className="qty-controls">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() => onRemoveItem(item.product.id)}
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-summary-line">
                <span>Sous-total</span>
                <b>{subtotal.toFixed(2)} €</b>
              </div>
              <div className="cart-summary-line">
                <span>Livraison</span>
                <b>{shipping === 0 ? <span className="free-tag">Offerte</span> : \`\${shipping.toFixed(2)} €\`}</b>
              </div>
              <div className="cart-summary-total">
                <span>Total TTC</span>
                <span className="total-amount">{total.toFixed(2)} €</span>
              </div>

              <button className="checkout-btn" onClick={onProceedCheckout}>
                <span>Commander ({total.toFixed(2)} €)</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
`;
  await fs.writeFile(path.join(projDir, "src", "components", "CartDrawer.tsx"), cartDrawerContent, "utf-8");
  filesCreated++;

  // 6. src/components/CheckoutWizard.tsx
  const checkoutWizardContent = `import React, { useState } from "react";
import { CartItem } from "../types";
import { X, CheckCircle2, Truck, CreditCard, ShieldCheck, ArrowRight } from "lucide-react";

interface CheckoutWizardProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: () => void;
}

export const CheckoutWizard: React.FC<CheckoutWizardProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [shippingData, setShippingData] = useState({
    fullName: "Alexandre Dupont",
    street: "14 Rue de la République",
    city: "Paris",
    postalCode: "75001",
    country: "France",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setStep(3);
        onOrderSuccess();
      }, 1200);
    }
  };

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-header">
          <div className="wizard-steps-indicator">
            <div className={\`step-dot \${step >= 1 ? "step-dot-active" : ""}\`}>
              <Truck size={14} />
              <span>1. Livraison</span>
            </div>
            <div className="step-line" />
            <div className={\`step-dot \${step >= 2 ? "step-dot-active" : ""}\`}>
              <CreditCard size={14} />
              <span>2. Paiement</span>
            </div>
            <div className="step-line" />
            <div className={\`step-dot \${step >= 3 ? "step-dot-active" : ""}\`}>
              <CheckCircle2 size={14} />
              <span>3. Confirmation</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="checkout-body">
          {step === 1 && (
            <div className="step-content">
              <h3>Adresse de Livraison</h3>
              <p className="step-desc">Indiquez l’adresse où expédier votre commande.</p>

              <div className="form-grid">
                <div className="form-field full-width">
                  <label>Nom complet</label>
                  <input
                    value={shippingData.fullName}
                    onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                  />
                </div>
                <div className="form-field full-width">
                  <label>Adresse (Rue et numéro)</label>
                  <input
                    value={shippingData.street}
                    onChange={(e) => setShippingData({ ...shippingData, street: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Ville</label>
                  <input
                    value={shippingData.city}
                    onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Code Postal</label>
                  <input
                    value={shippingData.postalCode}
                    onChange={(e) => setShippingData({ ...shippingData, postalCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="checkout-footer-row">
                <div className="total-badge">Total : <b>{total.toFixed(2)} €</b></div>
                <button className="primary-btn" onClick={handleNextStep}>
                  Continuer vers le paiement <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <h3>Mode de Paiement Sécurisé</h3>
              <p className="step-desc">Test d’environnement — aucun prélèvement bancaire réel.</p>

              <div className="payment-card-box">
                <div className="payment-method-item selected">
                  <CreditCard size={20} className="text-accent" />
                  <div>
                    <b>Carte Bancaire Virtuelle</b>
                    <small>•••• •••• •••• 4242 (Mode Démonstration Actif)</small>
                  </div>
                  <ShieldCheck size={18} className="text-success" />
                </div>
              </div>

              <div className="checkout-footer-row">
                <button className="secondary-btn" onClick={() => setStep(1)} disabled={isProcessing}>
                  Retour
                </button>
                <button className="primary-btn" onClick={handleNextStep} disabled={isProcessing}>
                  {isProcessing ? "Validation en cours…" : \`Payer \${total.toFixed(2)} €\`}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content success-step">
              <div className="success-icon-wrap">
                <CheckCircle2 size={48} />
              </div>
              <h3>Commande Validée avec Succès !</h3>
              <p className="step-desc">
                Merci <b>{shippingData.fullName}</b> pour votre commande.
                Un email de confirmation et de suivi a été généré.
              </p>
              <div className="order-summary-box">
                <div>Numéro de commande : <b>#ECOM-2026-8842</b></div>
                <div>Montant réglé : <b>{total.toFixed(2)} €</b></div>
                <div>Articles commandés : <b>{items.length}</b></div>
              </div>
              <button className="primary-btn full-width" onClick={onClose}>
                Retourner à la boutique
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
`;
  await fs.writeFile(path.join(projDir, "src", "components", "CheckoutWizard.tsx"), checkoutWizardContent, "utf-8");
  filesCreated++;

  // 7. src/components/ProductDetailModal.tsx
  const productDetailContent = `import React from "react";
import { Product } from "../types";
import { X, Star, ShoppingBag, Check, Shield, Truck } from "lucide-react";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-grid">
          <div className="modal-gallery">
            <img src={product.images[0]} alt={product.name} className="main-modal-img" />
            {product.images.length > 1 && (
              <div className="thumb-row">
                {product.images.map((img, i) => (
                  <img key={i} src={img} alt="Thumbnail" className="thumb-img" />
                ))}
              </div>
            )}
          </div>

          <div className="modal-details">
            <span className="badge">{product.category}</span>
            <h2 className="modal-title">{product.name}</h2>

            <div className="product-rating">
              <Star size={15} className="star-filled" />
              <span className="rating-val">{product.rating}</span>
              <span className="rating-count">({product.reviewCount} avis certifiés)</span>
            </div>

            <div className="modal-price-box">
              <span className="modal-price">{product.price.toFixed(2)} €</span>
              {product.compareAtPrice && (
                <span className="modal-compare-price">{product.compareAtPrice.toFixed(2)} €</span>
              )}
            </div>

            <p className="modal-description">{product.description}</p>

            <div className="modal-perks">
              <div className="perk-item">
                <Truck size={15} />
                <span>Livraison offerte dès 100 €</span>
              </div>
              <div className="perk-item">
                <Shield size={15} />
                <span>Garantie constructeur 2 ans</span>
              </div>
              <div className="perk-item">
                <Check size={15} />
                <span>En stock ({product.stock} exemplaires)</span>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="primary-btn add-to-cart-large"
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
              >
                <ShoppingBag size={18} />
                <span>Ajouter au panier</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
`;
  await fs.writeFile(path.join(projDir, "src", "components", "ProductDetailModal.tsx"), productDetailContent, "utf-8");
  filesCreated++;

  // 8. src/features/Storefront.tsx
  const storefrontContent = `import React, { useState, useMemo } from "react";
import { Product, CartItem, FilterState } from "../types";
import { MOCK_PRODUCTS } from "../services/mockData";
import { ProductCard } from "../components/ProductCard";
import { FilterSidebar } from "../components/FilterSidebar";
import { CartDrawer } from "../components/CartDrawer";
import { CheckoutWizard } from "../components/CheckoutWizard";
import { ProductDetailModal } from "../components/ProductDetailModal";
import { ShoppingBag, Search, Sparkles, ShieldCheck, Zap } from "lucide-react";

export const Storefront: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    category: "Tous",
    maxPrice: 350,
    sortBy: "popular",
    searchQuery: "",
  });

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      if (filters.category !== "Tous" && p.category !== filters.category) return false;
      if (p.price > filters.maxPrice) return false;
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchDesc = p.description.toLowerCase().includes(query);
        const matchBrand = p.brand.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchBrand) return false;
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "price-asc") return a.price - b.price;
      if (filters.sortBy === "price-desc") return b.price - a.price;
      if (filters.sortBy === "rating") return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    });
  }, [filters]);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="storefront-shell">
      <header className="storefront-header">
        <div className="storefront-brand">
          <div className="storefront-orb"><Sparkles size={18} /></div>
          <div>
            <b>NOVA<span>STORE</span></b>
            <small>E-Commerce Suite</small>
          </div>
        </div>

        <div className="storefront-search-bar">
          <Search size={16} />
          <input
            type="text"
            placeholder="Rechercher un produit, une marque, une catégorie…"
            value={filters.searchQuery}
            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
          />
        </div>

        <div className="storefront-header-actions">
          <button
            className="cart-trigger-btn"
            onClick={() => setIsCartOpen(true)}
            title="Ouvrir le panier"
          >
            <ShoppingBag size={18} />
            <span>Panier</span>
            {totalCartCount > 0 && (
              <span className="cart-badge-count">{totalCartCount}</span>
            )}
          </button>
        </div>
      </header>

      <section className="storefront-hero">
        <div className="hero-badge">
          <Zap size={14} /> COLLECTION SAISON 2026
        </div>
        <h1>L'Excellence Tech & Lifestyle au Meilleur Prix</h1>
        <p>
          Découvrez notre sélection de produits haut de gamme assemblée avec les composants du Pack PRD E-Commerce.
          Livraison express offerte dès 100 € d'achats.
        </p>
        <div className="hero-highlights">
          <span><ShieldCheck size={14} /> Garantie 2 ans</span>
          <span>•</span>
          <span>Paiement sécurisé</span>
          <span>•</span>
          <span>Retour gratuit 30 jours</span>
        </div>
      </section>

      <div className="storefront-layout">
        <FilterSidebar
          filters={filters}
          onChange={setFilters}
          onReset={() =>
            setFilters({
              category: "Tous",
              maxPrice: 350,
              sortBy: "popular",
              searchQuery: "",
            })
          }
          totalResults={filteredProducts.length}
        />

        <main className="storefront-main-content">
          <div className="products-grid-header">
            <h2>Catalogue Produits <span>({filteredProducts.length})</span></h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-products-box">
              <p>Aucun produit ne correspond à vos filtres actuels.</p>
              <button
                className="secondary-btn"
                onClick={() =>
                  setFilters({
                    category: "Tous",
                    maxPrice: 350,
                    sortBy: "popular",
                    searchQuery: "",
                  })
                }
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onAddToCart={handleAddToCart}
                  onViewDetail={setSelectedProductDetail}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutWizard
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderSuccess={() => setCartItems([])}
      />

      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};
`;
  await fs.writeFile(path.join(projDir, "src", "features", "Storefront.tsx"), storefrontContent, "utf-8");
  filesCreated++;

  console.log(`[Storefront Generator] 🏪 Vitrine complète assemblée pour ${projectName} (${filesCreated} fichiers créés)`);
  return {
    success: true,
    projectName,
    filesCreated,
    message: "Vitrine finale et composants assemblés avec succès.",
  };
}
