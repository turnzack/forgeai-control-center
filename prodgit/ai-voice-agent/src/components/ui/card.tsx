/**
 * @provenance
 * Source: shadcn/ui Card adaptation
 * License: MIT
 * Adapted by: ForgeAI Studio
 * Generated: 2026-09-24T02:24:57.555Z
 */

import * as React from "react";
import { cn } from "../../lib/utils";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("forgeai-ui-card", className)}
      style={{
        background: "var(--surface-card, rgba(255, 255, 255, 0.03))",
        border: "1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))",
        borderRadius: 14,
        padding: "20px",
        backdropFilter: "blur(14px)",
        boxShadow: "var(--shadow-md, 0 4px 8px rgba(0, 0, 0, 0.4))",
        ...style,
      }}
      {...props}
    />
  )
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => (
    <div ref={ref} className={cn("forgeai-ui-card-header", className)} style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14, ...style }} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, style, ...props }, ref) => (
    <h3 ref={ref} className={cn("forgeai-ui-card-title", className)} style={{ fontSize: "16px", fontWeight: 800, color: "#f8fafc", margin: 0, ...style }} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => (
    <div ref={ref} className={cn("forgeai-ui-card-content", className)} style={{ ...style }} {...props} />
  )
);
CardContent.displayName = "CardContent";
