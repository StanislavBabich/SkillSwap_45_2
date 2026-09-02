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
    children: 'Headline',
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
      <Headline level={1}>Level 1 — Headline</Headline>
      <Headline level={2}>Level 2 — Headline</Headline>
      <Headline level={3}>Level 3 — Headline</Headline>
      <Headline level={4}>Level 4 — Headline</Headline>
      <Headline level={5}>Level 5 — Headline</Headline>
      <Headline level={6}>Level 6 — Headline</Headline>
    </div>
  ),
};

export const CardTitleExample: Story = {
  name: 'Card title example',
  args: {
    level: 3,
    children: 'Playing drums',
  },
};

export const WithAriaLabel: Story = {
  name: 'With aria-label',
  args: {
    level: 2,
    'aria-label': 'Filters',
    children: 'Filters',
  },
};
