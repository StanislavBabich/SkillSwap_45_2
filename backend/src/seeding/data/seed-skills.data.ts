import { UsersData } from './seed-users.data';

export interface SeedCreateSkill {
  title: string;
  description: string;
  categoryName: string;
  ownerEmail: string;
}

export const SkillsData: SeedCreateSkill[] = [
  {
    title: 'Современный Frontend на React',
    description: 'Компоненты, состояние, маршрутизация и работа с API.',
    categoryName: 'Frontend',
    ownerEmail: UsersData[0].email,
  },
  {
    title: 'Основы UX/UI-дизайна',
    description: 'Исследование пользователей, прототипы и дизайн-системы.',
    categoryName: 'UX/UI',
    ownerEmail: UsersData[1].email,
  },
];
