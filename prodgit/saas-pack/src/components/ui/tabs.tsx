/**
 * @provenance
 * Source: shadcn/ui Tabs adaptation
 * License: MIT
 * Adapted by: ForgeAI Studio
 * Generated: 2026-09-24T01:35:31.288Z
 */

import React, { useState } from "react";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
}

export const Tabs: React.FC<TabsProps> = ({ items, defaultTab }) => {
  const [active, setActive] = useState(defaultTab || items[0]?.id);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
      <div style={{ display: "flex", gap: 6, background: "rgba(255, 255, 255, 0.04)", padding: 4, borderRadius: 10, border: "1px solid rgba(255, 255, 255, 0.06)", overflowX: "auto" }}>
        {items.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 8,
              fontSize: "12px",
              fontWeight: active === t.id ? 700 : 500,
              cursor: "pointer",
              background: active === t.id ? "var(--color-primary, #3B82F6)" : "transparent",
              color: active === t.id ? "#ffffff" : "#94a3b8",
              border: "none",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <div>
        {items.find((t) => t.id === active)?.content}
      </div>
    </div>
  );
};
