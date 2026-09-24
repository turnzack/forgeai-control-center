/**
 * @provenance
 * Source: ForgeAI Studio motion config
 * License: MIT
 * Adapted by: ForgeAI Studio
 * Generated: 2026-09-24T02:24:57.537Z
 */

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
  return `${properties.join(", ")} ${MOTION_CONFIG[speed]} ${MOTION_CONFIG.easeSmooth}`;
}

export function getAnimation(
  name: string,
  duration: MotionSpeed = "normal",
  iteration: number | "infinite" = "infinite"
) {
  return `${name} ${MOTION_CONFIG[duration]} ${MOTION_CONFIG.easeSpring} ${iteration}`;
}
