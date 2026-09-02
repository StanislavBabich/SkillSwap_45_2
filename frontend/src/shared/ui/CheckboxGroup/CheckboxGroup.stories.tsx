import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import '../../../app/styles/globals.css';

import { Checkbox } from '@/shared/ui/Checkbox';
import { CheckboxGroup } from './CheckboxGroup';

const meta = {
  title: 'Shared/CheckboxGroup',
  component: CheckboxGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const sixCheckboxes = (
  <>
    <div><Checkbox value="business" /><span>Business and career</span></div>
    <div><Checkbox value="art" /><span>Creativity and art</span></div>
    <div><Checkbox value="languages" /><span>Foreign languages</span></div>
    <div><Checkbox value="education" /><span>Education and development</span></div>
    <div><Checkbox value="health" /><span>Health and lifestyle</span></div>
    <div><Checkbox value="home" /><span>Home and comfort</span></div>
  </>
);

export const Default: Story = {
  args: {
    name: 'skills',
    defaultValue: [],
    children: sixCheckboxes,
  },
};

export const WithLabel: Story = {
  args: {
    name: 'skills',
    label: 'Skills',
    defaultValue: [],
    children: sixCheckboxes,
  },
};

export const WithError: Story = {
  args: {
    name: 'skills',
    label: 'Skills',
    defaultValue: [],
    error: 'Select at least one item',
    children: sixCheckboxes,
  },
};

export const Disabled: Story = {
  args: {
    name: 'settings',
    label: 'Settings',
    defaultValue: ['business'],
    disabled: true,
    children: sixCheckboxes,
  },
};

export const Required: Story = {
  args: {
    name: 'required',
    label: 'Required selection',
    required: true,
    defaultValue: [],
    children: sixCheckboxes,
  },
};

export const Controlled = () => {
  const [values, setValues] = useState<string[]>(['art']);

  return (
    <div>
      <CheckboxGroup
        name="controlled"
        label="Controlled group"
        value={values}
        onChange={setValues}
      >
        {sixCheckboxes}
      </CheckboxGroup>

      <p>Selected: {values.join(', ') || 'none'}</p>

      <button type="button" onClick={() => setValues([])}>
        Reset
      </button>
    </div>
  );
};

export const Uncontrolled: Story = {
  args: {
    name: 'categories',
    label: 'Categories',
    defaultValue: ['languages'],
    children: sixCheckboxes,
  },
};

export const WithMaxSelections: Story = {
  args: {
    name: 'interests',
    label: 'Interests',
    description: 'You can select no more than 3 items',
    defaultValue: ['business'],
    maxSelections: 3,
    showCounter: true,
    children: sixCheckboxes,
  },
};
