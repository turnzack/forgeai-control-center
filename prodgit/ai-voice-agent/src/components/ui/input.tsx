/**
 * @provenance
 * Source: shadcn/ui Input adaptation
 * License: MIT
 * Adapted by: ForgeAI Studio
 * Generated: 2026-09-24T02:24:57.556Z
 */

import * as React from "react";
import { cn } from "../../lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", style, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn("forgeai-ui-input", className)}
      style={{
        width: "100%",
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 8,
        padding: "10px 14px",
        color: "#ffffff",
        fontSize: "13px",
        outline: "none",
        boxSizing: "border-box",
        ...style,
      }}
      {...props}
    />
  )
);
Input.displayName = "Input";
