/**
 * @provenance
 * Source: ForgeAI Studio CSS 3D adaptation
 * License: MIT
 * Adapted by: ForgeAI Studio
 * Generated: 2026-09-24T03:00:32.602Z
 */

import React from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface AnimatedCubeProps {
  size?: number;
}

export function AnimatedCube({ size = 160 }: AnimatedCubeProps) {
  const reducedMotion = useReducedMotion();
  const faceStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "grid",
    placeItems: "center",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    background:
      "linear-gradient(135deg, rgba(124, 58, 237, 0.4), rgba(236, 72, 153, 0.3))",
    backfaceVisibility: "hidden",
    color: "#ffffff",
    fontWeight: 800,
    fontSize: "14px",
    userSelect: "none",
  };

  return (
    <div
      aria-label="Objet 3D animé"
      role="img"
      style={{
        width: size * 1.7,
        height: size * 1.7,
        display: "grid",
        placeItems: "center",
        perspective: 800,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          position: "relative",
          transformStyle: "preserve-3d",
          animation: reducedMotion
            ? "none"
            : "forgeai-cube-rotate 10s linear infinite",
        }}
      >
        <div style={{ ...faceStyle, transform: `translateZ(${size / 2}px)` }}>
          UI
        </div>
        <div
          style={{
            ...faceStyle,
            transform: `rotateY(180deg) translateZ(${size / 2}px)`,
          }}
        >
          AI
        </div>
        <div
          style={{
            ...faceStyle,
            transform: `rotateY(90deg) translateZ(${size / 2}px)`,
          }}
        >
          3D
        </div>
        <div
          style={{
            ...faceStyle,
            transform: `rotateY(-90deg) translateZ(${size / 2}px)`,
          }}
        >
          SVG
        </div>
      </div>
      <style>{`
        @keyframes forgeai-cube-rotate {
          from { transform: rotateX(-18deg) rotateY(0deg); }
          to { transform: rotateX(-18deg) rotateY(360deg); }
        }
      `}</style>
    </div>
  );
}
