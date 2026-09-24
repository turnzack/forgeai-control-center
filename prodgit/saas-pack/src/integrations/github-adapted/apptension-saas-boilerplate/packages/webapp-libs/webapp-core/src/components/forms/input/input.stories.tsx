/**
 * @provenance
 * Source Repository: https://github.com/apptension/saas-boilerplate
 * Original File: saas-boilerplate-master/packages/webapp-libs/webapp-core/src/components/forms/input/input.stories.tsx
 * License: MIT
 * Adapted by: ForgeAI Studio Builder for saas-pack
 * Generated: 2026-09-24T00:34:53.659Z
 */

import { Meta, StoryObj } from '@storybook/react';

import { Input } from './input.component';

type Story = StoryObj<typeof Input>;

const meta: Meta<typeof Input> = {
  title: 'Core/Forms/Input',
  component: Input,
};

export default meta;

export const Default: Story = {
  args: { type: 'text' },
};

export const Labeled: Story = {
  args: { type: 'text', label: 'Enter your name here' },
};

export const Required: Story = {
  args: { type: 'text', label: 'Enter your name here', required: true },
};

export const WithPlaceholder: Story = {
  args: { type: 'text', placeholder: 'Enter your name here' },
};

export const Invalid: Story = {
  args: { type: 'text', error: 'Invalid value', label: 'Enter your name here' },
};

export const Disabled: Story = {
  args: {
    type: 'text',
    disabled: true,
    placeholder: 'This is disabled',
    label: 'Enter your name here',
  },
};
