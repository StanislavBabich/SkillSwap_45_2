import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import '@/app/styles/globals.css';

import { Select, type SelectOption } from './Select';

const genderOptions: SelectOption[] = [
  { value: 'not-set', label: 'Не указан' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
];

const cityOptions: SelectOption[] = [
  { value: 'msk', label: 'Москва' },
  { value: 'spb', label: 'Санкт-Петербург' },
  { value: 'sam', label: 'Самара' },
  { value: 'srt', label: 'Саратов' },
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
    placeholder: 'Выберите значение',
    size: 'standard',
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Uncontroll: Story = {
  args: {
    label: 'Пол',
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
        label="Город"
        options={cityOptions}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const Disable: Story = {
  args: {
    label: 'Город',
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
        label="Город"
        options={cityOptions}
        value={value}
        onChange={setValue}
        error={!value ? 'Обязательное поле' : undefined}
      />
    );
  },
};

export const UnknowController: Story = {
  args: {
    label: 'Город',
    options: cityOptions,
    value: 'unknown-value',
    unknownValuePlaceholder: 'Значение не найдено',
  },
};

export const Size: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Select {...args} label="Город" options={cityOptions} size="short" />
      <Select {...args} label="Город" options={cityOptions} size="standard" />
      <Select {...args} label="Город" options={cityOptions} size="long" />
    </div>
  ),
};
