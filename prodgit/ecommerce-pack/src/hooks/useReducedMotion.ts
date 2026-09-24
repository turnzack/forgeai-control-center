/**
 * @provenance
 * Source: ForgeAI Studio accessibility layer
 * License: MIT
 * Adapted by: ForgeAI Studio
 * Generated: 2026-09-24T03:22:58.375Z
 */

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
