/**
 * @provenance
 * Source Repository: https://github.com/apptension/saas-boilerplate
 * Original File: saas-boilerplate-master/packages/webapp-libs/webapp-core/src/components/forms/radioButton/radioButton.stories.tsx
 * License: MIT
 * Adapted by: ForgeAI Studio Builder for saas-pack
 * Generated: 2026-09-24T00:34:53.664Z
 */

import { Meta, StoryFn, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';

import { Form, FormControl, FormField, FormItem } from '..';
import { RadioGroup } from '../../ui/radio-group';
import { RadioButton } from './radioButton.component';

type Story = StoryObj<typeof RadioButton>;

type FormValues = {
  field: string;
};

const Template: StoryFn = ({ checked, ...args }) => {
  const exampleValue = 'value';
  const defaultValues: Partial<FormValues> = {
    field: checked ? exampleValue : undefined,
  };
  const form = useForm<FormValues>({
    defaultValues,
  });
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="field"
        render={({ field }) => (
          <FormItem>
            <RadioGroup onValueChange={field.onChange}>
              <FormItem>
                <FormControl>
                  <RadioButton value={exampleValue} {...args} />
                </FormControl>
              </FormItem>
            </RadioGroup>
          </FormItem>
        )}
      ></FormField>
    </Form>
  );
};

const meta: Meta<typeof RadioButton> = {
  title: 'Core/Forms/RadioButton',
  component: RadioButton,
  render: Template,
};

export default meta;

export const Default: Story = {
  args: {
    children: 'Value',
  },
};

export const Checked: Story = {
  args: {
    ...Default.args,
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    ...Default.args,
    disabled: true,
    checked: true,
  },
};
