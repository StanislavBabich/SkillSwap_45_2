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
        <Radio value="all" label="Всё" />
        <Radio value="wantToLearn" label="Хочу научиться" />
        <Radio value="canTeach" label="Могу научить" />
      </>
    ),
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Фильтры',
    name: 'filters',
    defaultValue: 'all',
    children: (
      <>
        <Radio value="all" label="Всё" />
        <Radio value="wantToLearn" label="Хочу научиться" />
        <Radio value="canTeach" label="Могу научить" />
      </>
    ),
  },
};

export const WithError: Story = {
  args: {
    name: 'filters',
    label: 'Фильтры',
    defaultValue: 'all',
    error: 'Пожалуйста, выберите один из вариантов',
    children: (
      <>
        <Radio value="all" label="Всё" />
        <Radio value="wantToLearn" label="Хочу научиться" />
        <Radio value="canTeach" label="Могу научить" />
      </>
    ),
  },
};

export const Required: Story = {
  args: {
    name: 'filters',
    label: 'Фильтры',
    required: true,
    defaultValue: 'all',
    children: (
      <>
        <Radio value="all" label="Всё" />
        <Radio value="wantToLearn" label="Хочу научиться" />
        <Radio value="canTeach" label="Могу научить" />
      </>
    ),
  },
};

const ControlledTemplate = () => {
  const [selected, setSelected] = useState('option1');
  return (
    <div>
      <RadioGroup
        label="Управляемая группа"
        name="controlled"
        value={selected}
        onChange={(val) => setSelected(val)}
        children={
          <>
            <Radio value="option1" label="Вариант 1" />
            <Radio value="option2" label="Вариант 2" />
            <Radio value="option3" label="Вариант 3" />
          </>
        }
      />
      <p>
        Выбрано: {selected}
        <button type="button" onClick={() => setSelected('')}>
          Сбросить
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
    label: 'Пол автора',
    name: 'gender',
    defaultValue: 'any',
    orientation: 'horizontal',
    children: (
      <>
        <Radio value="any" label="Не имеет значения" />
        <Radio value="male" label="Мужской" />
        <Radio value="female" label="Женский" />
      </>
    ),
  },
};
