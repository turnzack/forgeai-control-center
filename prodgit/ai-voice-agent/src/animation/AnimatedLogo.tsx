/**
 * @provenance
 * Source: Motion-inspired SVG adaptation
 * License: MIT
 * Adapted by: ForgeAI Studio
 * Generated: 2026-09-24T02:24:57.543Z
 */

import React from "react";

interface AnimatedLogoProps {
  label?: string;
}

export function AnimatedLogo({ label = "ForgeAI" }: AnimatedLogoProps) {
  return (
    <svg
      width="190"
      height="56"
      viewBox="0 0 190 56"
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id="forgeai-logo-gradient" x1="0" x2="1">
          <stop offset="0%" stopColor="var(--color-primary)" />
          <stop offset="100%" stopColor="var(--color-accent)" />
        </linearGradient>
      </defs>
      <g>
        <circle
          cx="28"
          cy="28"
          r="18"
          fill="none"
          stroke="url(#forgeai-logo-gradient)"
          strokeWidth="4"
          strokeDasharray="8 7"
          style={{
            transformOrigin: "28px 28px",
            animation: "forgeai-logo-spin 8s linear infinite",
          }}
        />
        <circle cx="28" cy="28" r="7" fill="url(#forgeai-logo-gradient)" />
        <text
          x="58"
          y="35"
          fill="currentColor"
          fontSize="22"
          fontWeight="800"
        >
          {label}
        </text>
      </g>
      <style>{`
        @keyframes forgeai-logo-spin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          circle:first-child { animation: none; }
        }
      `}</style>
    </svg>
  );
}
