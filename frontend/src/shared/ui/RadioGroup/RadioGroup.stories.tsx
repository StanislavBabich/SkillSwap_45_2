import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import '../../../app/styles/globals.css';

import { Radio } from '@/shared/ui/Radio';
import { RadioGroup } from './RadioGroup';

const meta = {
  title: 'Shared/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    label: { control: 'text' },
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    required: { control: 'boolean' },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'category',
    defaultValue: 'all',
    children: (
      <>
        <Radio value="all" label="All" />
        <Radio value="wantToLearn" label="Want to learn" />
        <Radio value="canTeach" label="Can teach" />
      </>
    ),
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Filters',
    name: 'filters',
    defaultValue: 'all',
    children: (
      <>
        <Radio value="all" label="All" />
        <Radio value="wantToLearn" label="Want to learn" />
        <Radio value="canTeach" label="Can teach" />
      </>
    ),
  },
};

export const WithError: Story = {
  args: {
    name: 'filters',
    label: 'Filters',
    defaultValue: 'all',
    error: 'Please select one of the options',
    children: (
      <>
        <Radio value="all" label="All" />
        <Radio value="wantToLearn" label="Want to learn" />
        <Radio value="canTeach" label="Can teach" />
      </>
    ),
  },
};

export const Required: Story = {
  args: {
    name: 'filters',
    label: 'Filters',
    required: true,
    defaultValue: 'all',
    children: (
      <>
        <Radio value="all" label="All" />
        <Radio value="wantToLearn" label="Want to learn" />
        <Radio value="canTeach" label="Can teach" />
      </>
    ),
  },
};

const ControlledTemplate = () => {
  const [selected, setSelected] = useState('option1');
  return (
    <div>
      <RadioGroup
        label="Controlled group"
        name="controlled"
        value={selected}
        onChange={(val) => setSelected(val)}
        children={
          <>
            <Radio value="option1" label="Option 1" />
            <Radio value="option2" label="Option 2" />
            <Radio value="option3" label="Option 3" />
          </>
        }
      />
      <p>
        Selected: {selected}
        <button type="button" onClick={() => setSelected('')}>
          Reset
        </button>
      </p>
    </div>
  );
};

export const Controlled: Story = {
  args: {
    name: 'controlled',
    value: 'option1',
  },
  render: () => <ControlledTemplate />,
};

export const Uncontrolled: Story = {
  args: {
    label: "Author's gender",
    name: 'gender',
    defaultValue: 'any',
    orientation: 'horizontal',
    children: (
      <>
        <Radio value="any" label="Doesn't matter" />
        <Radio value="male" label="Male" />
        <Radio value="female" label="Female" />
      </>
    ),
  },
};
