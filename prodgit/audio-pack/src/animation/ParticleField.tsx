/**
 * @provenance
 * Source: ForgeAI Studio procedural SVG adaptation
 * License: MIT
 * Adapted by: ForgeAI Studio
 * Generated: 2026-09-24T02:25:57.668Z
 */

import React, { useMemo } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

export function ParticleField() {
  const reducedMotion = useReducedMotion();
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        x: (index * 37) % 100,
        y: (index * 61) % 100,
        r: 1 + (index % 3),
        delay: (index % 8) * 0.35,
      })),
    []
  );

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.5,
      }}
    >
      {particles.map((particle) => (
        <circle
          key={particle.id}
          cx={particle.x}
          cy={particle.y}
          r={particle.r / 10}
          fill="var(--color-accent)"
          style={{
            animation: reducedMotion
              ? "none"
              : `forgeai-particle-pulse 3s ease-in-out ${particle.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes forgeai-particle-pulse {
          0%, 100% { opacity: 0.15; transform: scale(0.7); }
          50% { opacity: 0.9; transform: scale(1.4); }
        }
      `}</style>
    </svg>
  );
}
