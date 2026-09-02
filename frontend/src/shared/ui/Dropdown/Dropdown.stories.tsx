import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Dropdown } from './Dropdown';
import type { DropdownProps } from './Dropdown';

type StoryArgs = DropdownProps & {
  initialValue?: string[];
};

const skillCategories = [
  { value: 'business', label: 'Business and career' },
  { value: 'creative', label: 'Creativity and art' },
  { value: 'languages', label: 'Foreign languages' },
  { value: 'education', label: 'Education and development' },
  { value: 'home', label: 'Home and comfort' },
  { value: 'health', label: 'Health and lifestyle' },
];

const ControlledDropdown = ({
  initialValue = [],
  helperText,
  onChange,
  ...args
}: StoryArgs) => {
  const [selected, setSelected] = useState<string[]>(initialValue);

  useEffect(() => {
    setSelected(initialValue);
  }, [initialValue]);

  const handleChange = (nextValues: string[]) => {
    setSelected(nextValues);
    onChange?.(nextValues);
  };

  return (
    <Dropdown
      {...args}
      value={selected}
      onChange={handleChange}
      helperText={helperText ?? `Selected: ${selected.length}`}
    />
  );
};

const meta = {
  title: 'Shared/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Dropdown with single and multiple selection support.',
      },
    },
  },
  args: {
    options: skillCategories,
    mode: 'multiple',
    placeholder: 'Select a category',
    label: 'Skill category',
    initialValue: [],
    disabled: false,
  },
  argTypes: {
    mode: {
      control: 'radio',
      options: ['single', 'multiple'],
      description: 'Selection mode',
    },
    initialValue: {
      control: 'object',
      description: 'Initially selected values for the interactive story',
    },
    options: {
      control: 'object',
    },
    value: {
      table: { disable: true },
    },
    defaultValue: {
      table: { disable: true },
    },
  },
  render: (args) => <ControlledDropdown {...args} />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SingleSelect: Story = {
  args: {
    mode: 'single',
    label: 'Single selection',
    initialValue: ['creative'],
  },
};

export const MultipleSelect: Story = {
  args: {
    mode: 'multiple',
    label: 'Multiple selection',
    initialValue: ['business', 'languages'],
  },
};

export const WithDisabledOptions: Story = {
  args: {
    label: 'With disabled options',
    options: [
      { value: 'business', label: 'Business and career' },
      { value: 'creative', label: 'Creativity and art', disabled: true },
      { value: 'languages', label: 'Foreign languages' },
      { value: 'education', label: 'Education and development', disabled: true },
    ],
  },
};

export const WithError: Story = {
  args: {
    label: 'Error state',
    error: 'This field is required',
    helperText: 'Select at least one category',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Dropdown',
    disabled: true,
    initialValue: ['business'],
  },
};
