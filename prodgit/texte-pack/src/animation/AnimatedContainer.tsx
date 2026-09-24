/**
 * @provenance
 * Source: ForgeAI Studio animated container
 * License: MIT
 * Adapted by: ForgeAI Studio
 * Generated: 2026-09-24T03:00:32.600Z
 */

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
      : `${animation}-keyframes var(--motion-normal) var(--ease-smooth) forwards`,
    animationDelay: `${delay}ms`,
    ...style,
  };

  return (
    <>
      <div className={className} style={computedStyle}>
        {children}
      </div>
      {!reducedMotion && animation !== "none" && (
        <style>{`
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
        `}</style>
      )}
    </>
  );
}
