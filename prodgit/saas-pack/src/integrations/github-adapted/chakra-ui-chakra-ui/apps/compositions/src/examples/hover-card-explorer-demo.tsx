/**
 * @provenance
 * Source Repository: https://github.com/chakra-ui/chakra-ui
 * Original File: chakra-ui-main/apps/compositions/src/examples/hover-card-explorer-demo.tsx
 * License: MIT
 * Adapted by: ForgeAI Studio Builder for saas-pack
 * Generated: 2026-09-24T00:34:55.953Z
 */

import {
  Avatar,
  HStack,
  HoverCard,
  Icon,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react"
import { LuChartLine } from "react-icons/lu"

export const HoverCardExplorerDemo = () => {
  return (
    <HoverCard.Root size="sm" open>
      <HoverCard.Trigger asChild>
        <Link href="#">@chakra_ui</Link>
      </HoverCard.Trigger>

      <HoverCard.Positioner>
        <HoverCard.Content>
          <HoverCard.Arrow />
          <Stack gap="4" direction="row">
            <Avatar.Root>
              <Avatar.Image src="https://pbs.twimg.com/profile_images/1244925541448286208/rzylUjaf_400x400.jpg" />
              <Avatar.Fallback name="Chakra UI" />
            </Avatar.Root>
            <Stack gap="3">
              <Stack gap="1">
                <Text textStyle="sm" fontWeight="semibold">
                  Chakra UI
                </Text>
                <Text textStyle="sm" color="fg.muted">
                  The most powerful toolkit for building modern web
                  applications.
                </Text>
              </Stack>
              <HStack color="fg.subtle">
                <Icon size="sm">
                  <LuChartLine />
                </Icon>
                <Text textStyle="xs">2.5M Downloads</Text>
              </HStack>
            </Stack>
          </Stack>
        </HoverCard.Content>
      </HoverCard.Positioner>
    </HoverCard.Root>
  )
}
