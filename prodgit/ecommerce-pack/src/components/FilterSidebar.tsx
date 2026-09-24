import React from "react";
import { FilterState } from "../types";
import { CATEGORIES } from "../services/mockData";
import { SlidersHorizontal, RotateCcw, Check, ShieldCheck } from "lucide-react";

export const FilterSidebar: React.FC<{
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onReset: () => void;
  totalResults: number;
}> = ({ filters, onChange, onReset, totalResults }) => (
  <aside style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 20 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <SlidersHorizontal size={16} color="#10b981" />
        <b style={{ fontSize: "14px", color: "#f8fafc" }}>Filtres Catalogue</b>
        <span style={{ fontSize: "10px", background: "rgba(16,185,129,0.2)", color: "#34d399", padding: "1px 6px", borderRadius: 10, fontWeight: 700 }}>{totalResults}</span>
      </div>
      <button onClick={onReset} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: "11px" }}>
        <RotateCcw size={12} /> Reset
      </button>
    </div>

    <div>
      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#cbd5e1", marginBottom: 6, textTransform: "uppercase" }}>Trier par</label>
      <select value={filters.sortBy} onChange={(e) => onChange({ ...filters, sortBy: e.target.value as any })} style={{ width: "100%", background: "#0b0f19", border: "1px solid rgba(255,255,255,0.12)", color: "#f8fafc", padding: "8px 10px", borderRadius: 8, fontSize: "12px" }}>
        <option value="popular">Pertinence & Popularité</option>
        <option value="price-asc">Prix : Moins cher au plus cher</option>
        <option value="price-desc">Prix : Plus cher au moins cher</option>
        <option value="rating">Meilleures Évaluations (★)</option>
      </select>
    </div>

    <div>
      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#cbd5e1", marginBottom: 8, textTransform: "uppercase" }}>Catégories</label>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {CATEGORIES.map((cat) => {
          const isSelected = filters.category === cat;
          return (
            <button key={cat} onClick={() => onChange({ ...filters, category: cat })} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 10px", borderRadius: 6, fontSize: "12px", background: isSelected ? "rgba(16,185,129,0.15)" : "transparent", color: isSelected ? "#34d399" : "#94a3b8", border: isSelected ? "1px solid rgba(16,185,129,0.3)" : "1px solid transparent", cursor: "pointer", textAlign: "left" }}>
              <span>{cat}</span>
              {isSelected && <Check size={13} color="#34d399" />}
            </button>
          );
        })}
      </div>
    </div>

    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <label style={{ fontSize: "11px", fontWeight: 700, color: "#cbd5e1", textTransform: "uppercase" }}>Prix Maximum</label>
        <span style={{ fontSize: "12px", fontWeight: 800, color: "#10b981" }}>{filters.maxPrice} €</span>
      </div>
      <input type="range" min="30" max="350" step="10" value={filters.maxPrice} onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })} style={{ width: "100%", accentColor: "#10b981" }} />
    </div>

    <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.18)", borderRadius: 8, padding: "8px 10px", fontSize: "10px", color: "#34d399", display: "flex", alignItems: "center", gap: 6 }}>
      <ShieldCheck size={14} /> <span>Module adapté : <b>Boundless FilterForm (MIT)</b></span>
    </div>
  </aside>
);