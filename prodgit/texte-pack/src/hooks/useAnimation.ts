/**
 * @provenance
 * Source: ForgeAI Studio animation hook
 * License: MIT
 * Adapted by: ForgeAI Studio
 * Generated: 2026-09-24T03:00:32.599Z
 */

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
    animation: `${name} ${durationMap[duration]} var(--ease-spring) ${iteration === "infinite" ? "infinite" : iteration}`,
    animationDelay: `${delay}ms`,
  };
}
