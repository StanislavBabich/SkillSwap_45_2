import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Dropdown } from './Dropdown';
import type { DropdownProps } from './Dropdown';

type StoryArgs = DropdownProps & {
  initialValue?: string[];
};

const skillCategories = [
  { value: 'business', label: 'Бизнес и карьера' },
  { value: 'creative', label: 'Творчество и искусство' },
  { value: 'languages', label: 'Иностранные языки' },
  { value: 'education', label: 'Образование и развитие' },
  { value: 'home', label: 'Дом и уют' },
  { value: 'health', label: 'Здоровье и лайфстайл' },
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
      helperText={helperText ?? `Выбрано: ${selected.length}`}
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
        component: 'Выпадающий список с поддержкой одиночного и множественного выбора.',
      },
    },
  },
  args: {
    options: skillCategories,
    mode: 'multiple',
    placeholder: 'Выберите категорию',
    label: 'Категория навыка',
    initialValue: [],
    disabled: false,
  },
  argTypes: {
    mode: {
      control: 'radio',
      options: ['single', 'multiple'],
      description: 'Режим выбора',
    },
    initialValue: {
      control: 'object',
      description: 'Начально выбранные значения для интерактивной истории',
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
    label: 'Одиночный выбор',
    initialValue: ['creative'],
  },
};

export const MultipleSelect: Story = {
  args: {
    mode: 'multiple',
    label: 'Множественный выбор',
    initialValue: ['business', 'languages'],
  },
};

export const WithDisabledOptions: Story = {
  args: {
    label: 'С недоступными опциями',
    options: [
      { value: 'business', label: 'Бизнес и карьера' },
      { value: 'creative', label: 'Творчество и искусство', disabled: true },
      { value: 'languages', label: 'Иностранные языки' },
      { value: 'education', label: 'Образование и развитие', disabled: true },
    ],
  },
};

export const WithError: Story = {
  args: {
    label: 'Состояние ошибки',
    error: 'Поле обязательно для заполнения',
    helperText: 'Выберите хотя бы одну категорию',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Отключенный Dropdown',
    disabled: true,
    initialValue: ['business'],
  },
};
