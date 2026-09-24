/**
 * ══════════════════════════════════════════════════════════════════════════
 * FORGEAI STUDIO — ANIMATION & DESIGN SYSTEM COUCHE COMMUNE
 * Gestion des Design Tokens de Motion, Accessibilité (prefers-reduced-motion),
 * Composants procéduraux SVG/CSS, Container animé et Objets 3D immersifs.
 * Conforme aux règles d'or AGENTS.md (En-têtes @provenance, SPDX MIT)
 * ══════════════════════════════════════════════════════════════════════════
 */

import fs from "fs/promises";
import path from "path";

const provenance = (source) => `/**
 * @provenance
 * Source: ${source}
 * License: MIT
 * Adapted by: ForgeAI Studio
 * Generated: ${new Date().toISOString()}
 */\n`;

async function writeFile(projectPath, relativePath, content) {
  const filePath = path.join(projectPath, relativePath);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf8");
}

export async function ensureAnimationDesignSystem(
  projectPath,
  { archetype = "universal_app", pack = {}, projectName = "ForgeAI App" } = {}
) {
  const primary = pack.designTokens?.primary || "#7C3AED";
  const accent = pack.designTokens?.accent || "#EC4899";
  const background = pack.designTokens?.background || "#0B0F19";

  // 1. Tokens CSS enrichis (couleurs, surfaces, ombres, motion et accessibilité)
  await writeFile(
    projectPath,
    "src/design-system/tokens.css",
    `${provenance("ForgeAI Studio semantic design tokens")}
:root {
  /* Couleurs de marque */
  --color-primary: ${primary};
  --color-accent: ${accent};
  --color-background: ${background};

  /* Tokens sémantiques */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #38bdf8;

  /* Surfaces & Fonds */
  --surface-card: rgba(255, 255, 255, 0.03);
  --surface-modal: rgba(0, 0, 0, 0.75);
  --surface-overlay: rgba(15, 23, 42, 0.95);

  /* Bordures */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.15);

  /* Ombres */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 20px rgba(236, 72, 153, 0.4);

  /* Tokens de Motion */
  --motion-fast: 160ms;
  --motion-normal: 320ms;
  --motion-slow: 700ms;
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-smooth: cubic-bezier(0.22, 1, 0.36, 1);
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-fast: 1ms;
    --motion-normal: 1ms;
    --motion-slow: 1ms;
  }

  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 1ms !important;
  }
}
`
  );

  // 2. Configuration d'animation centralisée (animation-config.ts)
  await writeFile(
    projectPath,
    "src/design-system/animation-config.ts",
    `${provenance("ForgeAI Studio motion config")}
export const MOTION_CONFIG = {
  fast: "var(--motion-fast)",
  normal: "var(--motion-normal)",
  slow: "var(--motion-slow)",
  easeSpring: "var(--ease-spring)",
  easeSmooth: "var(--ease-smooth)",
} as const;

export type MotionSpeed = keyof typeof MOTION_CONFIG;
export type MotionEase = "spring" | "smooth";

export function getTransition(
  speed: MotionSpeed = "normal",
  properties: string[] = ["opacity", "transform"]
) {
  return \`\${properties.join(", ")} \${MOTION_CONFIG[speed]} \${MOTION_CONFIG.easeSmooth}\`;
}

export function getAnimation(
  name: string,
  duration: MotionSpeed = "normal",
  iteration: number | "infinite" = "infinite"
) {
  return \`\${name} \${MOTION_CONFIG[duration]} \${MOTION_CONFIG.easeSpring} \${iteration}\`;
}
`
  );

  // 3. Hook d'Accessibilité useReducedMotion
  await writeFile(
    projectPath,
    "src/hooks/useReducedMotion.ts",
    `${provenance("ForgeAI Studio accessibility layer")}
import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => {
      media.removeEventListener?.("change", update);
    };
  }, []);

  return reducedMotion;
}
`
  );

  // 4. Hook Utilitaire useAnimation
  await writeFile(
    projectPath,
    "src/hooks/useAnimation.ts",
    `${provenance("ForgeAI Studio animation hook")}
import { useReducedMotion } from "./useReducedMotion";

export interface AnimationOptions {
  name: string;
  duration?: "fast" | "normal" | "slow";
  delay?: number;
  iteration?: number | "infinite";
}

export function useAnimation({
  name,
  duration = "normal",
  delay = 0,
  iteration = 1,
}: AnimationOptions) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return {
      animation: "none",
      transition: "none",
    };
  }

  const durationMap = {
    fast: "var(--motion-fast)",
    normal: "var(--motion-normal)",
    slow: "var(--motion-slow)",
  };

  return {
    animation: \`\${name} \${durationMap[duration]} var(--ease-spring) \${iteration === "infinite" ? "infinite" : iteration}\`,
    animationDelay: \`\${delay}ms\`,
  };
}
`
  );

  // 5. Composant AnimatedContainer.tsx
  await writeFile(
    projectPath,
    "src/animation/AnimatedContainer.tsx",
    `${provenance("ForgeAI Studio animated container")}
import React from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

export interface AnimatedContainerProps {
  children: React.ReactNode;
  animation?: "fade-in" | "slide-up" | "scale-in" | "none";
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedContainer({
  children,
  animation = "fade-in",
  delay = 0,
  className = "",
  style,
}: AnimatedContainerProps) {
  const reducedMotion = useReducedMotion();

  const computedStyle: React.CSSProperties = {
    animation: reducedMotion || animation === "none"
      ? "none"
      : \`\${animation}-keyframes var(--motion-normal) var(--ease-smooth) forwards\`,
    animationDelay: \`\${delay}ms\`,
    ...style,
  };

  return (
    <>
      <div className={className} style={computedStyle}>
        {children}
      </div>
      {!reducedMotion && animation !== "none" && (
        <style>{\`
          @keyframes fade-in-keyframes {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slide-up-keyframes {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes scale-in-keyframes {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        \`}</style>
      )}
    </>
  );
}
`
  );

  // 6. AnimatedGradient.tsx
  await writeFile(
    projectPath,
    "src/animation/AnimatedGradient.tsx",
    `${provenance("Motion-inspired SVG/CSS adaptation")}
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
      <style>{\`
        @keyframes forgeai-gradient-drift {
          from { transform: translate3d(-12%, -10%, 0) scale(1); }
          to { transform: translate3d(35%, 12%, 0) scale(1.18); }
        }
      \`}</style>
    </div>
  );
}
`
  );

  // 7. AnimatedLogo.tsx
  await writeFile(
    projectPath,
    "src/animation/AnimatedLogo.tsx",
    `${provenance("Motion-inspired SVG adaptation")}
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
      <style>{\`
        @keyframes forgeai-logo-spin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          circle:first-child { animation: none; }
        }
      \`}</style>
    </svg>
  );
}
`
  );

  // 8. ParticleField.tsx
  await writeFile(
    projectPath,
    "src/animation/ParticleField.tsx",
    `${provenance("ForgeAI Studio procedural SVG adaptation")}
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
              : \`forgeai-particle-pulse 3s ease-in-out \${particle.delay}s infinite\`,
          }}
        />
      ))}
      <style>{\`
        @keyframes forgeai-particle-pulse {
          0%, 100% { opacity: 0.15; transform: scale(0.7); }
          50% { opacity: 0.9; transform: scale(1.4); }
        }
      \`}</style>
    </svg>
  );
}
`
  );

  // 9. AnimatedCube.tsx
  await writeFile(
    projectPath,
    "src/components/3d/AnimatedCube.tsx",
    `${provenance("ForgeAI Studio CSS 3D adaptation")}
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
        <div style={{ ...faceStyle, transform: \`translateZ(\${size / 2}px)\` }}>
          UI
        </div>
        <div
          style={{
            ...faceStyle,
            transform: \`rotateY(180deg) translateZ(\${size / 2}px)\`,
          }}
        >
          AI
        </div>
        <div
          style={{
            ...faceStyle,
            transform: \`rotateY(90deg) translateZ(\${size / 2}px)\`,
          }}
        >
          3D
        </div>
        <div
          style={{
            ...faceStyle,
            transform: \`rotateY(-90deg) translateZ(\${size / 2}px)\`,
          }}
        >
          SVG
        </div>
      </div>
      <style>{\`
        @keyframes forgeai-cube-rotate {
          from { transform: rotateX(-18deg) rotateY(0deg); }
          to { transform: rotateX(-18deg) rotateY(360deg); }
        }
      \`}</style>
    </div>
  );
}
`
  );

  // 10. Utilitaire cn() (src/lib/utils.ts)
  await writeFile(
    projectPath,
    "src/lib/utils.ts",
    `${provenance("shadcn/ui utils adaptation")}
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`
  );

  // 11. Composant UI Button (src/components/ui/button.tsx)
  await writeFile(
    projectPath,
    "src/components/ui/button.tsx",
    `${provenance("shadcn/ui Button adaptation")}
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
`
  );

  // 12. Composant UI Card (src/components/ui/card.tsx)
  await writeFile(
    projectPath,
    "src/components/ui/card.tsx",
    `${provenance("shadcn/ui Card adaptation")}
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
`
  );

  // 13. Composant UI Input (src/components/ui/input.tsx)
  await writeFile(
    projectPath,
    "src/components/ui/input.tsx",
    `${provenance("shadcn/ui Input adaptation")}
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
`
  );

  // 14. Composant UI Tabs (src/components/ui/tabs.tsx)
  await writeFile(
    projectPath,
    "src/components/ui/tabs.tsx",
    `${provenance("shadcn/ui Tabs adaptation")}
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
`
  );

  // 15. Barrel export centralisé (src/design-system/index.ts)
  await writeFile(
    projectPath,
    "src/design-system/index.ts",
    `${provenance("ForgeAI Studio design-system barrel")}
export * from "./animation-config";
export { useReducedMotion } from "../hooks/useReducedMotion";
export { useAnimation } from "../hooks/useAnimation";
export { AnimatedContainer } from "../animation/AnimatedContainer";
export { AnimatedGradient } from "../animation/AnimatedGradient";
export { AnimatedLogo } from "../animation/AnimatedLogo";
export { ParticleField } from "../animation/ParticleField";
export { AnimatedCube } from "../components/3d/AnimatedCube";
export { Button } from "../components/ui/button";
export { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
export { Input } from "../components/ui/input";
export { Tabs } from "../components/ui/tabs";
export { cn } from "../lib/utils";
`
  );

  return { projectName, archetype, generated: true };
}
