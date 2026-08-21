import type { Meta, StoryObj } from '@storybook/react-vite';

import { Headline } from '@/shared/ui/Headline';
import type { HeadlineProps } from '@/shared/ui/Headline';

import '@/app/styles/globals.css';

const meta = {
  title: 'Shared/Headline',
  component: Headline,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    level: { control: 'select', options: [1, 2, 3, 4, 5, 6] },
    'aria-label': { control: 'text' },
    className: { control: 'text' },
  },
  args: {
    level: 2,
    children: 'Заголовок',
  },
} satisfies Meta<HeadlineProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
};

export const AllLevels: Story = {
  name: 'All levels',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Headline level={1}>Level 1 — Заголовок</Headline>
      <Headline level={2}>Level 2 — Заголовок</Headline>
      <Headline level={3}>Level 3 — Заголовок</Headline>
      <Headline level={4}>Level 4 — Заголовок</Headline>
      <Headline level={5}>Level 5 — Заголовок</Headline>
      <Headline level={6}>Level 6 — Заголовок</Headline>
    </div>
  ),
};

export const CardTitleExample: Story = {
  name: 'Card title example',
  args: {
    level: 3,
    children: 'Игра на барабанах',
  },
};

export const WithAriaLabel: Story = {
  name: 'With aria-label',
  args: {
    level: 2,
    'aria-label': 'Фильтры',
    children: 'Фильтры',
  },
};
