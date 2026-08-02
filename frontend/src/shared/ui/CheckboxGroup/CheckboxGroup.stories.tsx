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
    <div><Checkbox value="business" /><span>Бизнес и карьера</span></div>
    <div><Checkbox value="art" /><span>Творчество и искусство</span></div>
    <div><Checkbox value="languages" /><span>Иностранные языки</span></div>
    <div><Checkbox value="education" /><span>Образование и развитие</span></div>
    <div><Checkbox value="health" /><span>Здоровье и лайфстайл</span></div>
    <div><Checkbox value="home" /><span>Дом и уют</span></div>
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
    label: 'Навыки',
    defaultValue: [],
    children: sixCheckboxes,
  },
};

export const WithError: Story = {
  args: {
    name: 'skills',
    label: 'Навыки',
    defaultValue: [],
    error: 'Выберите хотя бы один пункт',
    children: sixCheckboxes,
  },
};

export const Disabled: Story = {
  args: {
    name: 'settings',
    label: 'Настройки',
    defaultValue: ['business'],
    disabled: true,
    children: sixCheckboxes,
  },
};

export const Required: Story = {
  args: {
    name: 'required',
    label: 'Обязательный выбор',
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
        label="Управляемая группа"
        value={values}
        onChange={setValues}
      >
        {sixCheckboxes}
      </CheckboxGroup>

      <p>Выбрано: {values.join(', ') || 'ничего'}</p>

      <button type="button" onClick={() => setValues([])}>
        Сбросить
      </button>
    </div>
  );
};

export const Uncontrolled: Story = {
  args: {
    name: 'categories',
    label: 'Категории',
    defaultValue: ['languages'],
    children: sixCheckboxes,
  },
};

export const WithMaxSelections: Story = {
  args: {
    name: 'interests',
    label: 'Интересы',
    description: 'Можно выбрать не более 3 пунктов',
    defaultValue: ['business'],
    maxSelections: 3,
    showCounter: true,
    children: sixCheckboxes,
  },
};
