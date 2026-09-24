/**
 * @provenance
 * Source: shadcn/ui Button adaptation
 * License: MIT
 * Adapted by: ForgeAI Studio
 * Generated: 2026-09-24T03:00:32.604Z
 */

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantStyles: Record<string, React.CSSProperties> = {
      default: { background: "var(--color-primary, #3B82F6)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 4px 14px rgba(59, 130, 246, 0.35)" },
      destructive: { background: "#ef4444", color: "#ffffff", border: "none" },
      outline: { background: "transparent", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.15)" },
      secondary: { background: "rgba(255,255,255,0.06)", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.08)" },
      ghost: { background: "transparent", color: "#94a3b8", border: "none" },
      link: { background: "transparent", color: "var(--color-primary, #3B82F6)", textDecoration: "underline", border: "none" },
    };

    const sizeStyles: Record<string, React.CSSProperties> = {
      default: { padding: "8px 16px", fontSize: "13px" },
      sm: { padding: "4px 10px", fontSize: "11px" },
      lg: { padding: "12px 24px", fontSize: "15px" },
      icon: { padding: "8px", width: "36px", height: "36px", display: "inline-flex", alignItems: "center", justifyContent: "center" },
    };

    return (
      <button
        ref={ref}
        className={cn("forgeai-ui-btn", className)}
        style={{
          borderRadius: 8,
          fontWeight: 700,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          transition: "all 0.15s ease",
          ...variantStyles[variant],
          ...sizeStyles[size],
          ...props.style,
        }}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
