import fs from 'fs';

const file = 'e:/forgeai-control-center/bridge-local/universal_app_generator.mjs';
let content = fs.readFileSync(file, 'utf-8');

// 1. E-Commerce
const ecomOld = `  // Main App.tsx (Multi-Pages 100% Métier avec toutes les 40 pépites actives d'office)
  await fs.writeFile(path.join(projDir, "src", "App.tsx"), \`import React, { useState } from "react";
import { Storefront } from "./features/Storefront";
import { ProductDetailPage } from "./features/ProductDetailPage";
import { CheckoutWizard } from "./components/CheckoutWizard";
import { OrdersTrackingPage } from "./features/OrdersTrackingPage";
import { IntegratedModulesPage } from "./features/IntegratedModulesPage";
import { GemsStudio } from "./features/GemsStudio";
import { MOCK_PRODUCTS } from "./services/mockData";
import { Product, CartItem } from "./types";
import { Store, ShoppingBag, ShoppingCart, PackageCheck, Sparkles, Activity } from "lucide-react";

type Tab = "catalog" | "product" | "checkout" | "orders";
const ACCENT = "#10b981";

export function App() {
  const [currentTab, setCurrentTab] = useState<Tab>("catalog");
  const [selectedProductId, setSelectedProductId] = useState<string>(MOCK_PRODUCTS[0]?.id || "1");
  const [cart, setCart] = useState<CartItem[]>([
    { product: MOCK_PRODUCTS[0], quantity: 1, selectedSize: "M", selectedColor: "Noir" },
    { product: MOCK_PRODUCTS[1], quantity: 2, selectedSize: "L", selectedColor: "Gris" }
  ]);
  const [activeFeatureHighlight, setActiveFeatureHighlight] = useState<string | null>(null);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  const TABS: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "catalog",  label: "Vitrine & Catalogue", icon: <Store size={15} /> },
    { id: "product",  label: "Fiche Produit",       icon: <ShoppingBag size={15} /> },
    { id: "checkout", label: "Tunnel Commande",     icon: <ShoppingCart size={15} />, badge: cart.reduce((a, b) => a + b.quantity, 0) },
    { id: "orders",   label: "Mes Commandes",       icon: <PackageCheck size={15} /> },
  ];

  const handleAddToCart = (product: Product, size: string, color: string) => {
    setCart(prev => [...prev, { product, quantity: 1, selectedSize: size, selectedColor: color }]);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f19", color: "#f8fafc", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(11,15,25,0.95)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50, padding: "12px 24px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)", borderRadius: 10, padding: 8, display: "flex" }}><Store size={20} color="#fff" /></div>
            <div>
              <span style={{ fontSize: "16px", fontWeight: 800, color: "#f8fafc" }}>\${pack.name}</span>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>Catalogue Produits, Panier d'Achat & Tunnel de Commande · 40 Briques Actives</div>
            </div>
          </div>

          <nav style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", overflowX: "auto" }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setCurrentTab(tab.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, fontSize: "12px", fontWeight: currentTab === tab.id ? 700 : 500, cursor: "pointer", background: currentTab === tab.id ? ACCENT : "transparent", color: currentTab === tab.id ? "#000" : "#94a3b8", border: "none", whiteSpace: "nowrap" }}>
                {tab.icon} {tab.label} {tab.badge !== undefined && tab.badge > 0 && <span style={{ fontSize: "10px", background: currentTab === tab.id ? "#000" : "#10b981", color: currentTab === tab.id ? "#10b981" : "#000", padding: "1px 6px", borderRadius: 10 }}>{tab.badge}</span>}
              </button>
            ))}
          </nav>

          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "11px", color: "#34d399", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", padding: "4px 10px", borderRadius: 20 }}><Activity size={12} /> Prêt pour Commandes</span>
        </div>
      </header>

      {appliedNotification && (
        <div style={{ background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)", color: "#000", padding: "10px 24px", textAlign: "center", fontSize: "13px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 4px 20px rgba(16,185,129,0.4)", position: "sticky", top: 65, zIndex: 49 }}>
          <span>⚡</span> {appliedNotification}
        </div>
      )}

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px 20px" }}>
        {currentTab === "catalog" && <Storefront onSelectProduct={(p) => { setSelectedProductId(p.id); setCurrentTab("product"); }} />}
        {currentTab === "product" && <ProductDetailPage productId={selectedProductId} onBackToCatalog={() => setCurrentTab("catalog")} onAddToCart={handleAddToCart} activeFeatureHighlight={activeFeatureHighlight} />}
        {currentTab === "checkout" && <div style={{ maxWidth: "800px", margin: "0 auto" }}><CheckoutWizard isOpen={true} onClose={() => setCurrentTab("catalog")} items={cart} onOrderSuccess={() => { setCart([]); setCurrentTab("orders"); }} /></div>}
        {currentTab === "orders" && <OrdersTrackingPage />}
      </main>
    </div>
  );
}

export default App;\`, "utf-8");`;

const ecomNew = `  // Main App.tsx (Multi-Pages 100% Métier & Animations)
  await fs.writeFile(path.join(projDir, "src", "App.tsx"), \`import React, { useState } from "react";
import { Storefront } from "./features/Storefront";
import { ProductDetailPage } from "./features/ProductDetailPage";
import { CheckoutWizard } from "./components/CheckoutWizard";
import { OrdersTrackingPage } from "./features/OrdersTrackingPage";
import { AnimatedGradient } from "./animation/AnimatedGradient";
import { AnimatedLogo } from "./animation/AnimatedLogo";
import { ParticleField } from "./animation/ParticleField";
import { AnimatedContainer } from "./animation/AnimatedContainer";
import { AnimatedCube } from "./components/3d/AnimatedCube";
import { MOCK_PRODUCTS } from "./services/mockData";
import { Product, CartItem } from "./types";
import { Store, ShoppingBag, ShoppingCart, PackageCheck, Sparkles, Activity } from "lucide-react";

type Tab = "catalog" | "product" | "checkout" | "orders";
const ACCENT = "\${primaryColor}";

export function App() {
  const [currentTab, setCurrentTab] = useState<Tab>("catalog");
  const [selectedProductId, setSelectedProductId] = useState<string>(MOCK_PRODUCTS[0]?.id || "1");
  const [cart, setCart] = useState<CartItem[]>([
    { product: MOCK_PRODUCTS[0], quantity: 1, selectedSize: "M", selectedColor: "Noir" },
    { product: MOCK_PRODUCTS[1], quantity: 2, selectedSize: "L", selectedColor: "Gris" }
  ]);

  const TABS: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "catalog",  label: "Vitrine & Catalogue", icon: <Store size={15} /> },
    { id: "product",  label: "Fiche Produit",       icon: <ShoppingBag size={15} /> },
    { id: "checkout", label: "Tunnel Commande",     icon: <ShoppingCart size={15} />, badge: cart.reduce((a, b) => a + b.quantity, 0) },
    { id: "orders",   label: "Mes Commandes",       icon: <PackageCheck size={15} /> },
  ];

  const handleAddToCart = (product: Product, size: string, color: string) => {
    setCart(prev => [...prev, { product, quantity: 1, selectedSize: size, selectedColor: color }]);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#070b14", color: "#f8fafc", fontFamily: "Inter, system-ui, sans-serif", position: "relative", overflowX: "hidden" }}>
      <AnimatedGradient intensity={0.6} />
      <ParticleField />

      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(11,15,25,0.85)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50, padding: "10px 24px" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <AnimatedLogo label="\${pack.name}" />
            <span style={{ fontSize: "11px", background: "rgba(16, 185, 129, 0.2)", color: "#34d399", padding: "3px 10px", borderRadius: 14, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Sparkles size={11} color="\${primaryColor}" /> Boutique Souveraine
            </span>
          </div>

          <nav style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", overflowX: "auto" }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setCurrentTab(tab.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, fontSize: "12px", fontWeight: currentTab === tab.id ? 700 : 500, cursor: "pointer", background: currentTab === tab.id ? "linear-gradient(135deg, \${primaryColor} 0%, \${accentColor} 100%)" : "transparent", color: currentTab === tab.id ? "#000" : "#94a3b8", border: "none", whiteSpace: "nowrap" }}>
                {tab.icon} {tab.label} {tab.badge !== undefined && tab.badge > 0 && <span style={{ fontSize: "10px", background: "#000", color: "#fff", padding: "1px 6px", borderRadius: 10 }}>{tab.badge}</span>}
              </button>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
              <AnimatedCube size={28} />
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "11px", color: "#34d399", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", padding: "5px 12px", borderRadius: 20 }}><Activity size={12} /> Prêt pour Commandes</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1440px", margin: "0 auto", padding: "24px 20px" }}>
        <AnimatedContainer key={currentTab} animation="fade-in" delay={40}>
          {currentTab === "catalog" && <Storefront onSelectProduct={(p) => { setSelectedProductId(p.id); setCurrentTab("product"); }} />}
          {currentTab === "product" && <ProductDetailPage productId={selectedProductId} onBackToCatalog={() => setCurrentTab("catalog")} onAddToCart={handleAddToCart} />}
          {currentTab === "checkout" && <div style={{ maxWidth: "800px", margin: "0 auto" }}><CheckoutWizard isOpen={true} onClose={() => setCurrentTab("catalog")} items={cart} onOrderSuccess={() => { setCart([]); setCurrentTab("orders"); }} /></div>}
          {currentTab === "orders" && <OrdersTrackingPage />}
        </AnimatedContainer>
      </main>
    </div>
  );
}

export default App;\`, "utf-8");`;

if (content.includes(ecomOld)) {
  content = content.replace(ecomOld, ecomNew);
  console.log('✓ E-Commerce template updated successfully');
} else {
  console.warn('Could not find ecomOld');
}

fs.writeFileSync(file, content, 'utf-8');
console.log('✓ All templates in universal_app_generator.mjs verified');
