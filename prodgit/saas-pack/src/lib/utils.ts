/**
 * @provenance
 * Source: shadcn/ui utils adaptation
 * License: MIT
 * Adapted by: ForgeAI Studio
 * Generated: 2026-09-24T09:30:35.927Z
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
