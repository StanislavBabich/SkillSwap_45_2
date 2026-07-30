import { AuthService } from './authService';
import bcrypt from 'bcryptjs';
import { storage } from '@/shared/lib/storage';
import type { StoredAuthUser, RegisterData, LoginCredentials } from '../types';

// Моки bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn(async (password: string) => `hashed_${password}`),
  compare: jest.fn(async (password: string, hash: string) => hash === `hashed_${password}`),
}));

// Моки storage
jest.mock('@/shared/lib/storage', () => {
  const users: StoredAuthUser[] = [];
  let currentUser: StoredAuthUser | null = null;
  let token: string = '';

  return {
    storage: {
      loadUsers: jest.fn(() => users),
      saveUsers: jest.fn((newUsers: StoredAuthUser[]) => {
        users.length = 0;
        users.push(...newUsers);
      }),
      getCurrentUser: jest.fn(() => currentUser),
      setCurrentUser: jest.fn((user) => {
        currentUser = user;
      }),
      clearCurrentUser: jest.fn(() => {
        currentUser = null;
      }),
      setToken: jest.fn((t: string) => {
        token = t;
      }),
      getToken: jest.fn(() => token),
    },
  };
});

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // полностью сбрасываем хранилище
    (storage.loadUsers as jest.Mock).mockReturnValue([]);
    (storage.getCurrentUser as jest.Mock).mockReturnValue(null);
    (storage.getToken as jest.Mock).mockReturnValue('');
  });

  // hashPassword

  test('hashPassword should return hashed string', async () => {
    const hash = await AuthService.hashPassword('mypassword');
    expect(hash).toBe('hashed_mypassword');
    expect(bcrypt.hash).toHaveBeenCalledWith('mypassword', 10);
  });

  // verifyPassword

  test('verifyPassword should return true when hash matches', async () => {
    const result = await AuthService.verifyPassword('test', 'hashed_test');
    expect(result).toBe(true);
  });

  test('verifyPassword should return false when hash mismatches', async () => {
    const result = await AuthService.verifyPassword('wrong', 'hashed_test');
    expect(result).toBe(false);
  });

  // checkEmailUnique

  test('checkEmailUnique returns true for new email', () => {
    const users: StoredAuthUser[] = [
      { id: 1, email: 'user@mail.com', name: 'A', passwordHash: 'x' },
    ];
    expect(AuthService.checkEmailUnique(users, 'NEW@mail.com')).toBe(true);
  });

  test('checkEmailUnique returns false for existing email (case/whitespace insensitive)', () => {
    const users: StoredAuthUser[] = [
      { id: 1, email: 'user@mail.com', name: 'A', passwordHash: 'x' },
    ];
    expect(AuthService.checkEmailUnique(users, ' USER@mail.com ')).toBe(false);
  });

  // register

  test('register: creates user, saves to storage, sets token', async () => {
    (storage.loadUsers as jest.Mock).mockReturnValue([]);

    const data: RegisterData = {
      email: 'test@mail.com',
      password: '12345678',
      name: 'Test User',
      skillInterests: [],
    };

    const user = await AuthService.register(data);

    expect(user).toMatchObject({
      id: 1,
      email: 'test@mail.com',
      name: 'Test User',
    });

    expect('passwordHash' in user).toBe(false);
    expect(storage.saveUsers).toHaveBeenCalledTimes(1);
    expect(storage.setCurrentUser).toHaveBeenCalled();
    expect(storage.setToken).toHaveBeenCalledWith('skillswap-auth-token');
  });

  test('register: increments id correctly', async () => {
    (storage.loadUsers as jest.Mock).mockReturnValue([
      { id: 5, email: 'a@mail.com', name: 'A', passwordHash: 'x' },
    ]);

    const data: RegisterData = {
      email: 'new@mail.com',
      password: '12345678',
      name: 'New',
      skillInterests: [],
    };

    const user = await AuthService.register(data);

    expect(user.id).toBe(6);
  });

  test('register: normalizes email', async () => {
    (storage.loadUsers as jest.Mock).mockReturnValue([]);

    const data: RegisterData = {
      email: '  TEST@MAIL.COM  ',
      password: '12345678',
      name: 'User',
      skillInterests: [],
    };

    const user = await AuthService.register(data);
    expect(user.email).toBe('test@mail.com');
  });

  test('register: throws when email already exists', async () => {
    (storage.loadUsers as jest.Mock).mockReturnValue([
      { id: 1, email: 'test@mail.com', name: 'A', passwordHash: 'xxx' },
    ]);

    const data: RegisterData = {
      email: 'test@mail.com',
      password: '12345678',
      name: 'X',
      skillInterests: [],
    };

    await expect(AuthService.register(data)).rejects.toThrow(
      'Пользователь с таким email уже существует'
    );
  });

  test('register: rejects short password', async () => {
    const data: RegisterData = {
      email: 'new@mail.com',
      password: '123',
      name: 'X',
      skillInterests: [],
    };

    await expect(AuthService.register(data)).rejects.toThrow(
      'Пароль должен быть не менее 8 символов'
    );
  });

  // login

  test('login: returns user and sets token', async () => {
    const storedUser: StoredAuthUser = {
      id: 1,
      email: 'login@mail.com',
      name: 'User',
      passwordHash: 'hashed_12345678',
    };

    (storage.loadUsers as jest.Mock).mockReturnValue([storedUser]);

    const creds: LoginCredentials = {
      email: 'login@mail.com',
      password: '12345678',
    };

    const user = await AuthService.login(creds);

    expect(user).not.toBeNull();
    expect(user?.email).toBe('login@mail.com');
    expect(storage.setCurrentUser).toHaveBeenCalled();
    expect(storage.setToken).toHaveBeenCalledWith('skillswap-auth-token');
  });

  test('login: normalizes email before search', async () => {
    const storedUser: StoredAuthUser = {
      id: 1,
      email: 'login@mail.com',
      name: 'User',
      passwordHash: 'hashed_12345678',
    };

    (storage.loadUsers as jest.Mock).mockReturnValue([storedUser]);

    const creds: LoginCredentials = {
      email: '  LOGIN@mail.com ',
      password: '12345678',
    };

    const user = await AuthService.login(creds);
    expect(user).not.toBeNull();
  });

  test('login: returns null when user not found', async () => {
    (storage.loadUsers as jest.Mock).mockReturnValue([]);

    const creds: LoginCredentials = {
      email: 'xx@mail.com',
      password: '12345678',
    };

    expect(await AuthService.login(creds)).toBeNull();
  });

  test('login: returns null when password incorrect', async () => {
    const storedUser: StoredAuthUser = {
      id: 1,
      email: 'login@mail.com',
      name: 'User',
      passwordHash: 'hashed_12345678',
    };

    (storage.loadUsers as jest.Mock).mockReturnValue([storedUser]);

    const user = await AuthService.login({
      email: 'login@mail.com',
      password: 'wrongpass',
    });

    expect(user).toBeNull();
  });

  // logout

  test('logout clears current user and token', () => {
    AuthService.logout();

    expect(storage.clearCurrentUser).toHaveBeenCalled();
    expect(storage.setToken).toHaveBeenCalledWith('');

    // Дополнительная проверка состояния
    expect(storage.getToken()).toBe('');
  });

  // getCurrentUser / isAuthenticated

  test('getCurrentUser returns user', () => {
    (storage.getCurrentUser as jest.Mock).mockReturnValue({ id: 1 });

    expect(AuthService.getCurrentUser()).toEqual({ id: 1 });
  });

  test('isAuthenticated works correctly', () => {
    (storage.getCurrentUser as jest.Mock).mockReturnValue({ id: 1 });
    expect(AuthService.isAuthenticated()).toBe(true);

    (storage.getCurrentUser as jest.Mock).mockReturnValue(null);
    expect(AuthService.isAuthenticated()).toBe(false);
  });
});
