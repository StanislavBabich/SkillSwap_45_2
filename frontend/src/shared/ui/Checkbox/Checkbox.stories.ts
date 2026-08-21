import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from '@shared/ui/Checkbox';

const meta = {
  title: 'Shared/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['subcategory', 'category'],
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SubcategoryActive: Story = {
  args: {
    variant: 'subcategory',
    defaultChecked: true,
    'aria-label': 'Subcategory checkbox',
  },
};

export const CategoryActive: Story = {
  args: {
    variant: 'category',
    defaultChecked: true,
    'aria-label': 'Category checkbox',
  },
};

export const Inactive: Story = {
  args: {
    variant: 'subcategory',
    'aria-label': 'Inactive checkbox',
  },
};
