import { UserGender } from '../../users/user.enums';

export interface SeedCreateUser {
  name: string;
  email: string;
  password: string;
  about?: string;
  birthdate?: string;
  city?: string;
  gender?: UserGender;
}

export const UsersData: SeedCreateUser[] = [
  {
    name: 'Иван Петров',
    email: 'ivan.petrov@example.com',
    password: 'Test12345',
    about: 'Frontend-разработчик, готов делиться опытом.',
    birthdate: '1995-04-12',
    city: 'Москва',
    gender: UserGender.MALE,
  },
  {
    name: 'Анна Смирнова',
    email: 'anna.smirnova@example.com',
    password: 'Test12345',
    about: 'UX/UI-дизайнер, изучаю разработку интерфейсов.',
    birthdate: '1997-09-23',
    city: 'Санкт-Петербург',
    gender: UserGender.FEMALE,
  },
];
