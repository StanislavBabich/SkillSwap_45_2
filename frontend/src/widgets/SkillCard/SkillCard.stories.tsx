import type { Meta, StoryObj } from '@storybook/react-vite';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import type { RootState } from '@/app/store';
import type { Category, Subcategory } from '@/entities/category/types';
import type { City } from '@/entities/city/types';
import type { Skill } from '@/entities/skill/types';
import type { User } from '@/entities/user/types';
import { categoriesReducer } from '@/features/categories/slice';
import { citiesReducer } from '@/features/cities/slice';
import { exchangesReducer } from '@/features/exchanges/slice';
import { favoritesReducer } from '@/features/favorites/slice';
import { filtersReducer } from '@/features/filters/slice';
import { requestsReducer } from '@/features/requests/slice';
import { skillsReducer } from '@/features/skills/slice';
import { usersReducer } from '@/features/users/slice';
import '@/app/styles/globals.css';

import { SkillCard } from './SkillCard';

const mockCities: City[] = [
  { id: 1, name: 'Saint Petersburg' },
  { id: 2, name: 'Moscow' },
];

const mockCategories: Category[] = [
  { id: 1, name: 'Business and career', color: 'var(--color-tag-business)', icon: 'briefcase' },
  { id: 3, name: 'Foreign languages', color: 'var(--color-tag-language)', icon: 'global' },
  { id: 4, name: 'Education and development', color: 'var(--color-tag-education)', icon: 'book' },
  { id: 5, name: 'Health and lifestyle', color: 'var(--color-tag-health)', icon: 'lifestyle' },
];

const mockSubcategories: Subcategory[] = [
  { id: 9, name: 'English', categoryId: 3 },
  { id: 6, name: 'Time management', categoryId: 1 },
  { id: 36, name: 'Meditation', categoryId: 5 },
  { id: 30, name: 'Personal development', categoryId: 4 },
  { id: 31, name: 'Learning skills', categoryId: 4 },
];

const mockUsers: User[] = [
  {
    id: 1,
    avatarUrl: '/vite.svg',
    name: 'Ivan',
    email: 'ivan@example.com',
    about: 'Description',
    cityId: 1,
    dateOfBirth: '1991-07-20',
    gender: 'male',
    registrationDate: '2024-01-01',
    skillInterests: [6, 36, 30, 31],
    passwordHash: 'hash',
  },
  {
    id: 2,
    avatarUrl: '/vite.svg',
    name: 'Anna',
    email: 'anna@example.com',
    about: 'Description',
    cityId: 2,
    dateOfBirth: '1997-10-02',
    gender: 'female',
    registrationDate: '2024-01-02',
    skillInterests: [9],
    passwordHash: 'hash',
  },
];

const mockSkills: Skill[] = [
  {
    id: 1,
    userId: 1,
    name: 'English',
    subcategoryId: 9,
    description: 'Skill description',
    images: [],
    likes: [2],
  },
];

const createStoryStore = () => {
  const usersState = {
    items: mockUsers,
    currentUserId: 2,
    isLoading: false,
    status: 'succeeded',
    error: null,
  } as RootState['users'];

  const preloadedState: RootState = {
    users: usersState,
    skills: {
      items: mockSkills,
      isLoading: false,
      status: 'succeeded',
      error: null,
    },
    cities: {
      items: mockCities,
      isLoading: false,
      status: 'succeeded',
      error: null,
    },
    categories: {
      categories: mockCategories,
      subcategories: mockSubcategories,
      isLoading: false,
      status: 'succeeded',
      error: null,
    },
    filters: {
      search: '',
      skillType: 'all',
      gender: 'any',
      selectedCategoryIds: [],
      selectedCityIds: [],
    },
    favorites: {
      byOwnerId: {},
    },
    requests: {
      items: [],
    },
    exchanges: {
      items: [],
    },
  };

  return configureStore({
    reducer: {
      users: usersReducer,
      skills: skillsReducer,
      cities: citiesReducer,
      categories: categoriesReducer,
      filters: filtersReducer,
      favorites: favoritesReducer,
      requests: requestsReducer,
      exchanges: exchangesReducer,
    },
    preloadedState,
  });
};

const meta = {
  title: 'Widgets/SkillCard',
  component: SkillCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <Provider store={createStoryStore()}>
        <div style={{ width: 700, padding: 16 }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'compact', 'featured'] },
    className: { control: 'text' },
    skillId: { control: 'number' },
  },
} satisfies Meta<typeof SkillCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    skillId: 1,
    variant: 'default',
  },
};
