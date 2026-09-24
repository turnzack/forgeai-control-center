/**
 * @provenance
 * Source: shadcn/ui utils adaptation
 * License: MIT
 * Adapted by: ForgeAI Studio
 * Generated: 2026-09-24T03:00:32.603Z
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
