/**
 * @provenance
 * Source: Motion-inspired SVG/CSS adaptation
 * License: MIT
 * Adapted by: ForgeAI Studio
 * Generated: 2026-09-24T02:25:57.587Z
 */

import React from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface AnimatedGradientProps {
  className?: string;
  intensity?: number;
}

export function AnimatedGradient({
  className = "",
  intensity = 1,
}: AnimatedGradientProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        opacity: intensity,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "55vw",
          height: "55vw",
          minWidth: 320,
          minHeight: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, var(--color-primary), transparent 68%)",
          filter: "blur(70px)",
          opacity: 0.38,
          transform: reducedMotion ? "none" : "translate3d(-12%, -10%, 0)",
          animation: reducedMotion ? "none" : "forgeai-gradient-drift 12s ease-in-out infinite alternate",
        }}
      />
      <style>{`
        @keyframes forgeai-gradient-drift {
          from { transform: translate3d(-12%, -10%, 0) scale(1); }
          to { transform: translate3d(35%, 12%, 0) scale(1.18); }
        }
      `}</style>
    </div>
  );
}
