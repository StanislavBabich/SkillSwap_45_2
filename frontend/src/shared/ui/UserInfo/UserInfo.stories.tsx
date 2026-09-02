import type { Meta, StoryObj } from '@storybook/react-vite';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import type { City } from '@/entities/city/types';
import type { User } from '@/entities/user/types';
import '@/app/styles/globals.css';

import { UserInfo } from './UserInfo';

const mockUsers: User[] = [
  {
    id: 101,
    avatarUrl: '/vite.svg',
    name: 'Ivan',
    email: 'ivan@example.com',
    about: 'I love learning and sharing knowledge',
    cityId: 1,
    dateOfBirth: '1992-06-15',
    gender: 'male',
    registrationDate: '2024-01-01',
    skillInterests: [],
    passwordHash: 'hash',
  },
  {
    id: 102,
    avatarUrl: '/vite.svg',
    name: 'Anna',
    email: 'anna@example.com',
    about: 'I study languages and UX',
    cityId: 2,
    dateOfBirth: '2004-09-20',
    gender: 'female',
    registrationDate: '2024-02-01',
    skillInterests: [],
    passwordHash: 'hash',
  },
];

const mockCities: City[] = [
  { id: 1, name: 'Saint Petersburg' },
  { id: 2, name: 'Moscow' },
];

const createStoryStore = () =>
  configureStore({
    reducer: {
      users: (
        state = {
          items: mockUsers,
          isLoading: false,
          status: 'succeeded' as const,
          error: null as string | null,
        }
      ) => state,
      skills: (
        state = {
          items: [],
          isLoading: false,
          status: 'idle' as const,
          error: null as string | null,
        }
      ) => state,
      cities: (
        state = {
          items: mockCities,
          isLoading: false,
          status: 'succeeded' as const,
          error: null as string | null,
        }
      ) => state,
      categories: (
        state = {
          categories: [],
          subcategories: [],
          isLoading: false,
          status: 'idle' as const,
          error: null as string | null,
        }
      ) => state,
      filters: (
        state = {
          search: '',
          skillType: 'all' as const,
          gender: 'any' as const,
          selectedCategoryIds: [],
          selectedCityIds: [],
        }
      ) => state,
      favorites: (state = { byOwnerId: {} }) => state,
      requests: (state = { items: [] }) => state,
      exchanges: (state = { items: [] }) => state,
    },
  });

const meta = {
  title: 'Shared/UserInfo',
  component: UserInfo,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <Provider store={createStoryStore()}>
        <div style={{ padding: 16, background: 'var(--base-color)' }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    showCity: { control: 'boolean' },
    showAge: { control: 'boolean' },
    className: { control: 'text' },
    userId: { control: 'number' },
  },
} satisfies Meta<typeof UserInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    userId: 101,
    size: 'md',
    orientation: 'horizontal',
    showCity: true,
    showAge: true,
  },
};

export const Small: Story = {
  args: {
    userId: 101,
    size: 'sm',
    orientation: 'horizontal',
    showCity: true,
    showAge: true,
  },
};

export const LargeVertical: Story = {
  args: {
    userId: 102,
    size: 'lg',
    orientation: 'vertical',
    showCity: true,
    showAge: true,
  },
};

export const NameOnly: Story = {
  args: {
    userId: 101,
    size: 'md',
    orientation: 'horizontal',
    showCity: false,
    showAge: false,
  },
};
