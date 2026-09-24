/**
 * @provenance
 * Source Repository: https://github.com/chakra-ui/chakra-ui
 * Original File: chakra-ui-main/apps/www/components/search-button.tsx
 * License: MIT
 * Adapted by: ForgeAI Studio Builder for saas-pack
 * Generated: 2026-09-24T00:34:56.488Z
 */

import {
  Button,
  ButtonProps,
  Icon,
  IconButton,
  Kbd,
  Span,
} from "@chakra-ui/react"
import { forwardRef } from "react"
import { LuSearch } from "react-icons/lu"

export const SearchButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function SearchButton(props, ref) {
    return (
      <Button variant="subtle" color="fg.muted!" ref={ref} {...props}>
        <Icon ms="-1">
          <LuSearch />
        </Icon>
        <Span
          ms="1"
          fontWeight="normal"
          flex="1"
          minW="0"
          textAlign="start"
          textOverflow="ellipsis"
          overflow="hidden"
        >
          Search...
        </Span>
        <Kbd
          variant="outline"
          bg="bg"
          fontSize="0.8em"
          letterSpacing="widest"
          me="-1"
        >
          ⌘K
        </Kbd>
      </Button>
    )
  },
)

export const MobileSearchButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function SearchButton(props, ref) {
    return (
      <IconButton variant="ghost" size="sm" ref={ref} {...props}>
        <LuSearch />
      </IconButton>
    )
  },
)
