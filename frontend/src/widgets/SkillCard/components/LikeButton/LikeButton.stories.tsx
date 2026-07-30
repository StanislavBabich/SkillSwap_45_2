import type { Meta, StoryObj } from '@storybook/react-vite';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import type { RootState } from '@/app/store';
import type { EntityId } from '@/entities/base';
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

import { LikeButton } from './LikeButton';

const mockUsers: User[] = [
  {
    id: 1,
    avatarUrl: '/vite.svg',
    name: 'Иван',
    email: 'ivan@example.com',
    about: 'Описание',
    cityId: 1,
    dateOfBirth: '1991-07-20',
    gender: 'male',
    registrationDate: '2024-01-01',
    skillInterests: [],
    passwordHash: 'hash',
  },
  {
    id: 2,
    avatarUrl: '/vite.svg',
    name: 'Анна',
    email: 'anna@example.com',
    about: 'Описание',
    cityId: 2,
    dateOfBirth: '1997-10-02',
    gender: 'female',
    registrationDate: '2024-01-02',
    skillInterests: [],
    passwordHash: 'hash',
  },
];

const createStoryStore = (likes: EntityId[], currentUserId: EntityId | null = 1) => {
  const mockSkills: Skill[] = [
    {
      id: 1,
      userId: 2,
      name: 'Английский язык',
      subcategoryId: 9,
      description: 'Описание навыка',
      images: [],
      likes,
    },
  ];

  const usersState = {
    items: mockUsers,
    currentUserId,
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
      items: [],
      isLoading: false,
      status: 'idle',
      error: null,
    },
    categories: {
      categories: [],
      subcategories: [],
      isLoading: false,
      status: 'idle',
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
  title: 'Widgets/SkillCard/LikeButton',
  component: LikeButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    isFavorite: { control: 'boolean' },
    skillId: { control: 'number' },
  },
  args: {
    skillId: 1,
    size: 'md',
  },
} satisfies Meta<typeof LikeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (StoryComponent) => (
      <Provider store={createStoryStore([2])}>
        <StoryComponent />
      </Provider>
    ),
  ],
};

export const LikedByCurrentUser: Story = {
  args: {
    size: 'sm',
  },

  decorators: [
    (StoryComponent) => (
      <Provider store={createStoryStore([1, 2])}>
        <StoryComponent />
      </Provider>
    ),
  ],
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
  decorators: [
    (StoryComponent) => (
      <Provider store={createStoryStore([2])}>
        <StoryComponent />
      </Provider>
    ),
  ],
};

export const Guest: Story = {
  decorators: [
    (StoryComponent) => (
      <Provider store={createStoryStore([1, 2], null)}>
        <StoryComponent />
      </Provider>
    ),
  ],
};
