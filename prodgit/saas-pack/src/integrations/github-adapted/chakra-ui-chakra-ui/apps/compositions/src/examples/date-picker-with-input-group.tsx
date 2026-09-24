/**
 * @provenance
 * Source Repository: https://github.com/chakra-ui/chakra-ui
 * Original File: chakra-ui-main/apps/compositions/src/examples/date-picker-with-input-group.tsx
 * License: MIT
 * Adapted by: ForgeAI Studio Builder for saas-pack
 * Generated: 2026-09-24T00:34:55.909Z
 */

"use client"

import { DatePicker, InputGroup, Portal } from "@chakra-ui/react"
import { LuCalendar, LuChevronsUpDown } from "react-icons/lu"

export const DatePickerWithInputGroup = () => {
  return (
    <DatePicker.Root maxWidth="20rem">
      <DatePicker.Label>Date</DatePicker.Label>
      <InputGroup
        as={DatePicker.Control}
        startElement={<LuCalendar />}
        endElement={
          <DatePicker.Trigger>
            <LuChevronsUpDown />
          </DatePicker.Trigger>
        }
      >
        <DatePicker.Input />
      </InputGroup>
      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content>
            <DatePicker.View view="day">
              <DatePicker.Header />
              <DatePicker.DayTable />
            </DatePicker.View>
            <DatePicker.View view="month">
              <DatePicker.Header />
              <DatePicker.MonthTable />
            </DatePicker.View>
            <DatePicker.View view="year">
              <DatePicker.Header />
              <DatePicker.YearTable />
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker.Root>
  )
}
