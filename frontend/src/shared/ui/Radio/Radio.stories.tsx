import type { Meta, StoryObj } from '@storybook/react-vite';

import '../../../app/styles/globals.css';

import { Radio } from './Radio';

const meta = {
  title: 'Shared/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    value: { control: 'text' },
    label: { control: 'text' },
    description: { control: 'text' },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'radio-group',
    value: 'option1',
    label: 'Option 1',
  },
};

export const Checked: Story = {
  args: {
    name: 'radio-group',
    value: 'option2',
    label: 'Option 2',
    defaultChecked: true,
  },
};

export const WithLabel: Story = {
  args: {
    name: 'radio-group',
    value: 'option3',
    label: 'Выбери этот вариант',
  },
};

export const WithDescription: Story = {
  args: {
    name: 'radio-group',
    value: 'option4',
    label: 'Вариант с описанием',
    description: 'Дополнительная информация о том, что означает этот выбор',
  },
};
