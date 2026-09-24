/**
 * @provenance
 * Source Repository: https://github.com/chakra-ui/chakra-ui
 * Original File: chakra-ui-main/apps/compositions/src/ui/stepper-input.tsx
 * License: MIT
 * Adapted by: ForgeAI Studio Builder for saas-pack
 * Generated: 2026-09-24T00:34:56.314Z
 */

import { HStack, IconButton, NumberInput } from "@chakra-ui/react"
import * as React from "react"
import { LuMinus, LuPlus } from "react-icons/lu"

export interface StepperInputProps extends NumberInput.RootProps {
  label?: React.ReactNode
}

export const StepperInput = React.forwardRef<HTMLDivElement, StepperInputProps>(
  function StepperInput(props, ref) {
    const { label, ...rest } = props
    return (
      <NumberInput.Root {...rest} unstyled ref={ref}>
        {label && <NumberInput.Label>{label}</NumberInput.Label>}
        <HStack gap="2">
          <DecrementTrigger />
          <NumberInput.ValueText textAlign="center" fontSize="lg" minW="3ch" />
          <IncrementTrigger />
        </HStack>
      </NumberInput.Root>
    )
  },
)

const DecrementTrigger = React.forwardRef<
  HTMLButtonElement,
  NumberInput.DecrementTriggerProps
>(function DecrementTrigger(props, ref) {
  return (
    <NumberInput.DecrementTrigger {...props} asChild ref={ref}>
      <IconButton variant="outline" size="sm">
        <LuMinus />
      </IconButton>
    </NumberInput.DecrementTrigger>
  )
})

const IncrementTrigger = React.forwardRef<
  HTMLButtonElement,
  NumberInput.IncrementTriggerProps
>(function IncrementTrigger(props, ref) {
  return (
    <NumberInput.IncrementTrigger {...props} asChild ref={ref}>
      <IconButton variant="outline" size="sm">
        <LuPlus />
      </IconButton>
    </NumberInput.IncrementTrigger>
  )
})
