import React, { useState } from "react";
import { Product } from "../types";
import { MOCK_PRODUCTS } from "../services/mockData";
import { Star, ShoppingCart, ShieldCheck, Truck, ArrowLeft, Heart, Share2, Check, Plus, Sliders, X, Box } from "lucide-react";

interface ProductDetailPageProps {
  productId?: string;
  onBackToCatalog: () => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  activeFeatureHighlight?: string | null;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId, onBackToCatalog, onAddToCart, activeFeatureHighlight }) => {
  const product: Product = MOCK_PRODUCTS.find(p => p.id === productId) || MOCK_PRODUCTS[0];
  const [selectedImage, setSelectedImage] = useState(product.images[0] || "");
  const [sizes, setSizes] = useState<string[]>(product.attributes.size || ["S", "M", "L", "XL"]);
  const [colors, setColors] = useState<string[]>(product.attributes.color || ["Noir", "Gris", "Argent"]);
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "M");
  const [selectedColor, setSelectedColor] = useState(colors[0] || "Noir");
  const [currentStock, setCurrentStock] = useState<number>(product.stock || 48);
  const [warehouseLocation, setWarehouseLocation] = useState<string>("Zone Logistique B-12");
  const [modalMode, setModalMode] = useState<"none" | "add-variant" | "edit-inventory">("none");
  const [newSizeInput, setNewSizeInput] = useState("");
  const [newColorInput, setNewColorInput] = useState("");
  const [stockInput, setStockInput] = useState(currentStock.toString());
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart({ ...product, stock: currentStock }, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleSaveNewVariant = () => {
    if (newSizeInput.trim() && !sizes.includes(newSizeInput.trim().toUpperCase())) {
      setSizes(prev => [...prev, newSizeInput.trim().toUpperCase()]);
      setSelectedSize(newSizeInput.trim().toUpperCase());
    }
    if (newColorInput.trim() && !colors.includes(newColorInput.trim())) {
      setColors(prev => [...prev, newColorInput.trim()]);
      setSelectedColor(newColorInput.trim());
    }
    setNewSizeInput("");
    setNewColorInput("");
    setModalMode("none");
  };

  const handleSaveInventory = () => {
    const val = parseInt(stockInput, 10);
    if (!isNaN(val) && val >= 0) setCurrentStock(val);
    setModalMode("none");
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "10px 0" }}>
      <button onClick={onBackToCatalog} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: "#94a3b8", fontSize: "13px", cursor: "pointer", marginBottom: 20 }}>
        <ArrowLeft size={16} /> Retour au catalogue
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 40, background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 32 }}>
        <div>
          <div style={{ width: "100%", height: "420px", borderRadius: 12, overflow: "hidden", background: "#0b0f19", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 16 }}>
            <img src={selectedImage || product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>

        <div>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#10b981", background: "rgba(16,185,129,0.15)", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>{product.category}</span>
          <h1 style={{ fontSize: "26px", color: "#f8fafc", margin: "8px 0" }}>{product.name}</h1>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, margin: "16px 0" }}>
            <span style={{ fontSize: "32px", fontWeight: 900, color: "#10b981" }}>{product.price.toFixed(2)} €</span>
            {product.compareAtPrice && <span style={{ fontSize: "18px", color: "#64748b", textDecoration: "line-through" }}>{product.compareAtPrice.toFixed(2)} €</span>}
          </div>
          <p style={{ fontSize: "13px", lineHeight: "1.6", color: "#cbd5e1", marginBottom: 20 }}>{product.description}</p>

          {/* Tailles & Bouton d'ajout de variante Medusa */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#cbd5e1" }}>Taille : <span style={{ color: "#10b981" }}>{selectedSize}</span></label>
              <button onClick={() => setModalMode("add-variant")} style={{ background: "rgba(99, 102, 241, 0.15)", color: "#a5b4fc", border: "1px solid rgba(99, 102, 241, 0.3)", borderRadius: 4, padding: "2px 8px", fontSize: "10px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}><Plus size={11} /> Ajouter Variante (Medusa UI)</button>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {sizes.map(sz => (
                <button key={sz} onClick={() => setSelectedSize(sz)} style={{ padding: "8px 16px", borderRadius: 6, fontSize: "12px", fontWeight: 700, cursor: "pointer", background: selectedSize === sz ? "#10b981" : "rgba(255,255,255,0.05)", color: selectedSize === sz ? "#000" : "#cbd5e1", border: selectedSize === sz ? "1px solid #10b981" : "1px solid rgba(255,255,255,0.1)" }}>{sz}</button>
              ))}
            </div>
          </div>

          {/* Couleurs */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#cbd5e1", marginBottom: 8 }}>Couleur : <span style={{ color: "#10b981" }}>{selectedColor}</span></label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {colors.map(col => (
                <button key={col} onClick={() => setSelectedColor(col)} style={{ padding: "6px 14px", borderRadius: 6, fontSize: "12px", cursor: "pointer", background: selectedColor === col ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)", color: selectedColor === col ? "#34d399" : "#cbd5e1", border: selectedColor === col ? "1px solid #10b981" : "1px solid rgba(255,255,255,0.1)" }}>{col}</button>
              ))}
            </div>
          </div>

          {/* Module Gestionnaire d'Inventaire Medusa */}
          <div style={{ background: "rgba(11, 15, 25, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 10, padding: 14, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8" }}>RÉFÉRENCE SKU : <code style={{ color: "#38bdf8" }}>ECOM-{product.id}-{selectedSize}-{selectedColor.slice(0, 3).toUpperCase()}</code></div>
              <button onClick={() => setModalMode("edit-inventory")} style={{ background: "transparent", border: "none", color: "#38bdf8", cursor: "pointer", fontSize: "11px", display: "flex", alignItems: "center", gap: 4 }}><Sliders size={12} /> Ajuster Stock (Medusa)</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: "12px", color: "#cbd5e1" }}>
              <div>📦 Disponibilité : <b style={{ color: currentStock > 0 ? "#10b981" : "#ef4444" }}>{currentStock} unités</b></div>
              <div>🏢 Emplacement : <b style={{ color: "#f8fafc" }}>{warehouseLocation}</b></div>
            </div>
          </div>

          <button onClick={handleAdd} disabled={currentStock <= 0} style={{ width: "100%", padding: "16px", borderRadius: 10, fontSize: "15px", fontWeight: 800, background: added ? "#059669" : "#10b981", color: "#000", border: "none", cursor: currentStock > 0 ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            {added ? <><Check size={18} /> Ajouté au panier !</> : <><ShoppingCart size={18} /> Ajouter au Panier</>}
          </button>
        </div>
      </div>

      {/* Modale d'ajout de variante Medusa */}
      {modalMode === "add-variant" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#0b0f19", border: "1px solid rgba(99,102,241,0.4)", borderRadius: 14, padding: 24, maxWidth: "440px", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <b style={{ color: "#f8fafc", fontSize: "15px" }}>Ajouter une Variante (Medusa UI)</b>
              <button onClick={() => setModalMode("none")} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={18} /></button>
            </div>
            <input type="text" placeholder="Nouvelle taille (ex: XXL)" value={newSizeInput} onChange={e => setNewSizeInput(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: "8px 12px", color: "#fff", marginBottom: 10 }} />
            <input type="text" placeholder="Nouvelle couleur (ex: Vert Émeraude)" value={newColorInput} onChange={e => setNewColorInput(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: "8px 12px", color: "#fff", marginBottom: 16 }} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setModalMode("none")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1", borderRadius: 6, padding: "8px 16px", cursor: "pointer" }}>Annuler</button>
              <button onClick={handleSaveNewVariant} style={{ background: "#10b981", color: "#000", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 700, cursor: "pointer" }}>Ajouter</button>
            </div>
          </div>
        </div>
      )}

      {/* Modale d'ajustement de stock Medusa */}
      {modalMode === "edit-inventory" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#0b0f19", border: "1px solid rgba(56,189,248,0.4)", borderRadius: 14, padding: 24, maxWidth: "440px", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <b style={{ color: "#f8fafc", fontSize: "15px" }}>Modifier l'Inventaire (Medusa UI)</b>
              <button onClick={() => setModalMode("none")} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={18} /></button>
            </div>
            <input type="number" min="0" value={stockInput} onChange={e => setStockInput(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: "8px 12px", color: "#fff", marginBottom: 10 }} />
            <input type="text" value={warehouseLocation} onChange={e => setWarehouseLocation(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: "8px 12px", color: "#fff", marginBottom: 16 }} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setModalMode("none")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1", borderRadius: 6, padding: "8px 16px", cursor: "pointer" }}>Annuler</button>
              <button onClick={handleSaveInventory} style={{ background: "#38bdf8", color: "#000", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 700, cursor: "pointer" }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};