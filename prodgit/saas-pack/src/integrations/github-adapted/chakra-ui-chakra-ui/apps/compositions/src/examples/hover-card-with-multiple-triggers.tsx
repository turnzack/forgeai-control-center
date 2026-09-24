/**
 * @provenance
 * Source Repository: https://github.com/chakra-ui/chakra-ui
 * Original File: chakra-ui-main/apps/compositions/src/examples/hover-card-with-multiple-triggers.tsx
 * License: MIT
 * Adapted by: ForgeAI Studio Builder for saas-pack
 * Generated: 2026-09-24T00:34:56.002Z
 */

"use client"

import { HStack, HoverCard, Link, Portal, Text } from "@chakra-ui/react"

const people = {
  ananya: "Ananya builds design systems.",
  jules: "Jules works on accessibility.",
  nico: "Nico writes the docs.",
}

export const HoverCardWithMultipleTriggers = () => {
  return (
    <HoverCard.Root size="sm">
      <HStack gap="4">
        <HoverCard.Trigger asChild value="ananya">
          <Link href="#">@ananya</Link>
        </HoverCard.Trigger>
        <HoverCard.Trigger asChild value="jules">
          <Link href="#">@jules</Link>
        </HoverCard.Trigger>
        <HoverCard.Trigger asChild value="nico">
          <Link href="#">@nico</Link>
        </HoverCard.Trigger>
      </HStack>
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content maxWidth="240px">
            <HoverCard.Arrow />
            <HoverCard.Context>
              {(api) => (
                <Text textStyle="sm">
                  {people[api.triggerValue as keyof typeof people]}
                </Text>
              )}
            </HoverCard.Context>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  )
}
