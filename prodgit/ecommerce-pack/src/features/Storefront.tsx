import React, { useState, useMemo } from "react";
import { Product, CartItem, FilterState } from "../types";
import { MOCK_PRODUCTS } from "../services/mockData";
import { FilterSidebar } from "../components/FilterSidebar";
import { ProductCard } from "../components/ProductCard";
import { CartDrawer } from "../components/CartDrawer";
import { Sparkles, Search, ShoppingBag, ChevronRight, Home, Flame, Star, ShieldCheck } from "lucide-react";

interface StorefrontProps {
  onSelectProduct?: (product: Product) => void;
}

export const Storefront: React.FC<StorefrontProps> = ({ onSelectProduct }) => {
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filters, setFilters] = useState<FilterState>({
    category: "Tous",
    maxPrice: 350,
    sortBy: "popular",
    searchQuery: "",
    inStockOnly: false,
    promoOnly: false,
  });

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      if (filters.category !== "Tous" && p.category !== filters.category) return false;
      if (p.price > filters.maxPrice) return false;
      if (filters.searchQuery && !p.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
      if (filters.inStockOnly && p.stock <= 0) return false;
      if (filters.promoOnly && !p.isPromo) return false;
      return true;
    });

    if (filters.sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [products, filters]);

  const promoProducts = useMemo(() => {
    return products.filter((p) => p.isPromo || p.compareAtPrice);
  }, [products]);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  return (
    <div className="storefront-root">
      {/* Fil d'Ariane Boundless BreadCrumbs */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "12px", color: "#94a3b8", marginBottom: 16 }}>
        <button onClick={() => setFilters({ ...filters, category: "Tous" })} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: 0 }}>
          <Home size={13} /> Boutique
        </button>
        <ChevronRight size={13} />
        <span style={{ color: filters.category === "Tous" ? "#10b981" : "#cbd5e1", fontWeight: filters.category === "Tous" ? 700 : 500 }}>Catalogue</span>
        {filters.category !== "Tous" && (
          <>
            <ChevronRight size={13} />
            <span style={{ color: "#10b981", fontWeight: 700 }}>{filters.category}</span>
          </>
        )}
        <span style={{ marginLeft: "auto", fontSize: "11px", color: "#34d399", background: "rgba(16,185,129,0.12)", padding: "2px 8px", borderRadius: 12, border: "1px solid rgba(16,185,129,0.25)" }}>
          ⚡ 40 Briques Actives (Boundless + Medusa)
        </span>
      </div>

      <header className="storefront-nav">
        <div className="storefront-brand">
          <Sparkles size={20} color="#10b981" />
          <b>🛒 PACK E-COMMERCE</b>
        </div>
        <div className="storefront-search">
          <Search size={15} />
          <input placeholder="Rechercher par nom, marque, catégorie..." value={filters.searchQuery} onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })} />
        </div>
        <button className="cart-trigger-btn" onClick={() => setCartOpen(true)}>
          <ShoppingBag size={18} />
          <span>Panier ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
        </button>
      </header>

      <main className="storefront-layout">
        <FilterSidebar filters={filters} onChange={setFilters} onReset={() => setFilters({ category: "Tous", maxPrice: 350, sortBy: "popular", searchQuery: "", inStockOnly: false, promoOnly: false })} totalResults={filteredProducts.length} />

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <section className="products-grid">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onViewDetail={(item) => onSelectProduct ? onSelectProduct(item) : alert(`Détails : ${item.name} (${item.price} €)`)} />
            ))}
          </section>

          {/* Pagination Interactive Boundless */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 18px" }}>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>Affichage de <b>{filteredProducts.length}</b> produit(s)</span>
            <div style={{ display: "flex", gap: 6 }}>
              {[1, 2].map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)} style={{ width: 32, height: 32, borderRadius: 6, border: currentPage === page ? "1px solid #10b981" : "1px solid rgba(255,255,255,0.1)", background: currentPage === page ? "#10b981" : "rgba(255,255,255,0.05)", color: currentPage === page ? "#000" : "#cbd5e1", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}>{page}</button>
              ))}
            </div>
          </div>

          {/* Carrousel Promotions Recommandées Boundless ProductsSlider */}
          <div style={{ background: "rgba(15,23,42,0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Flame size={18} color="#f59e0b" />
              <b style={{ fontSize: "14px", color: "#f8fafc" }}>Offres & Promotions Recommandées (Boundless Slider)</b>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
              {promoProducts.slice(0, 4).map((item) => (
                <div key={item.id} onClick={() => onSelectProduct && onSelectProduct(item)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 12, cursor: "pointer" }}>
                  <div style={{ width: "100%", height: 110, borderRadius: 8, overflow: "hidden", marginBottom: 8 }}><img src={item.images[0]} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#f8fafc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}><span style={{ fontSize: "13px", fontWeight: 800, color: "#10b981" }}>{item.price.toFixed(2)} €</span><span style={{ fontSize: "10px", color: "#f59e0b", display: "flex", alignItems: "center", gap: 2 }}><Star size={11} fill="#f59e0b" /> {item.rating}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <CartDrawer isOpen={cartOpen} items={cart} onClose={() => setCartOpen(false)} onUpdateQuantity={(id, delta) => setCart(prev => prev.map(i => i.product.id === id ? { ...i, quantity: i.quantity + delta } : i).filter(i => i.quantity > 0))} onRemoveItem={(id) => setCart(prev => prev.filter(i => i.product.id !== id))} onProceedCheckout={() => alert("Tunnel de commande prêt !")} />
    </div>
  );
};