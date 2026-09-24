/**
 * @provenance
 * Source Repository: https://github.com/chakra-ui/chakra-ui
 * Original File: chakra-ui-main/apps/www/components/stackblitz-button.tsx
 * License: MIT
 * Adapted by: ForgeAI Studio Builder for saas-pack
 * Generated: 2026-09-24T00:34:56.526Z
 */

"use client"

import { openInStackblitzReact } from "@/lib/stackblitz"
import { Button } from "@chakra-ui/react"
import { StackblitzIcon } from "./framework-icon"

export const StackblitzButton = ({ exampleId }: { exampleId: string }) => {
  const handleClick = () => {
    const id = exampleId.split("/").slice(-1).join("/")
    openInStackblitzReact(id)
  }
  return (
    <Button
      size="sm"
      colorPalette="gray"
      variant="ghost"
      aria-label="Open in Stackblitz"
      onClick={handleClick}
    >
      <StackblitzIcon />
      Stackblitz
    </Button>
  )
}
