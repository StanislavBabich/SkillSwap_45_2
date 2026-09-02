import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import '@/app/styles/globals.css';

import { Select, type SelectOption } from './Select';

const genderOptions: SelectOption[] = [
  { value: 'not-set', label: 'Not specified' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

const cityOptions: SelectOption[] = [
  { value: 'msk', label: 'Moscow' },
  { value: 'spb', label: 'Saint Petersburg' },
  { value: 'sam', label: 'Samara' },
  { value: 'srt', label: 'Saratov' },
];

const meta = {
  title: 'Shared/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['short', 'standard', 'long'] },
  },
  args: {
    placeholder: 'Select a value',
    size: 'standard',
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Uncontroll: Story = {
  args: {
    label: 'Gender',
    options: genderOptions,
    defaultValue: genderOptions[0]?.value,
  },
};

export const Controll: Story = {
  render: (args) => {
    const [value, setValue] = useState('');

    return (
      <Select
        {...args}
        label="City"
        options={cityOptions}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const Disable: Story = {
  args: {
    label: 'City',
    options: cityOptions,
    disabled: true,
  },
};

export const Error: Story = {
  render: (args) => {
    const [value, setValue] = useState('');

    return (
      <Select
        {...args}
        label="City"
        options={cityOptions}
        value={value}
        onChange={setValue}
        error={!value ? 'Required field' : undefined}
      />
    );
  },
};

export const UnknowController: Story = {
  args: {
    label: 'City',
    options: cityOptions,
    value: 'unknown-value',
    unknownValuePlaceholder: 'Value not found',
  },
};

export const Size: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Select {...args} label="City" options={cityOptions} size="short" />
      <Select {...args} label="City" options={cityOptions} size="standard" />
      <Select {...args} label="City" options={cityOptions} size="long" />
    </div>
  ),
};
