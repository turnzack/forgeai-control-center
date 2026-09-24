/**
 * @provenance
 * Source Repository: https://github.com/chakra-ui/chakra-ui
 * Original File: chakra-ui-main/apps/www/app/shipped/quote-card.tsx
 * License: MIT
 * Adapted by: ForgeAI Studio Builder for saas-pack
 * Generated: 2026-09-24T00:34:56.364Z
 */

import { Box, Image, Stack, Text } from "@chakra-ui/react"

interface QuoteCardProps {
  quote: string
  description?: string
  image?: string
  gradientFrom?: string
  gradientVia?: string
  gradientTo?: string
  color?: string
}

export const QuoteCard = (props: QuoteCardProps) => {
  const {
    quote,
    description,
    image,
    gradientFrom,
    gradientVia,
    gradientTo,
    color,
  } = props
  const hasGradient = Boolean(gradientFrom || gradientVia || gradientTo)

  return (
    <Stack
      gap="6"
      p="8"
      rounded="2xl"
      position="relative"
      {...(hasGradient
        ? {
            bgGradient: "to-r",
            gradientFrom,
            gradientVia,
            gradientTo,
            color: color ?? "white",
          }
        : { bg: "teal.subtle" })}
    >
      <Text textStyle="3xl" fontWeight="semibold" pe={image ? "10" : "0"}>
        "{quote}"
      </Text>
      {description && (
        <Text textStyle="lg" pe={image ? "10" : "0"}>
          {description}
        </Text>
      )}
      {image && (
        <Image
          src={image}
          alt={description || ""}
          h="10"
          position="absolute"
          bottom="4"
          right="4"
          rounded="full"
        />
      )}
    </Stack>
  )
}
