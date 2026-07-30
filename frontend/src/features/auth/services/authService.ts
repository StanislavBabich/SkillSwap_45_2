import { storage } from '@/shared/lib/storage';
import bcrypt from 'bcryptjs';
import type { StoredAuthUser, AuthUser, LoginCredentials, RegisterData } from '../types';

const SALT_ROUNDS = 10;
const MOCK_TOKEN = 'skillswap-auth-token';

export class AuthService {
  // Хеширование пароля
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  // Проверка пароля
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Проверка уникальности email
  static checkEmailUnique(users: StoredAuthUser[], email: string): boolean {
    const normalized = email.trim().toLowerCase();
    return !users.some((u) => u.email.toLowerCase() === normalized);
  }

  // Регистрация нового пользователя
  static async register(userData: RegisterData): Promise<AuthUser> {
    const users = storage.loadUsers();

    if (!this.checkEmailUnique(users, userData.email)) {
      throw new Error('Пользователь с таким email уже существует');
    }

    if (userData.password.length < 8) {
      throw new Error('Пароль должен быть не менее 8 символов');
    }

    const passwordHash = await this.hashPassword(userData.password);

    const newUser: StoredAuthUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      email: userData.email.trim().toLowerCase(),
      name: userData.name,
      passwordHash,
      about: userData.about || '',
      cityId: userData.cityId || 0,
      gender: userData.gender || 'other',
      dateOfBirth: userData.dateOfBirth || '',
      registrationDate: new Date().toISOString().split('T')[0],
      skillInterests: userData.skillInterests || [],
      avatarSeed: userData.avatarSeed || null,
      avatar: null,
    };

    users.push(newUser);
    storage.saveUsers(users);

    const { passwordHash: _, ...safeUser } = newUser;
    storage.setCurrentUser(safeUser);
    storage.setToken(MOCK_TOKEN);
    return safeUser;
  }

  // Вход пользователя
  static async login({ email, password }: LoginCredentials): Promise<AuthUser | null> {
    const users = storage.loadUsers();
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) return null;

    const isValid = await this.verifyPassword(password, user.passwordHash);
    if (!isValid) return null;

    const { passwordHash: _, ...safeUser } = user;
    
    storage.setCurrentUser(safeUser);
    storage.setToken(MOCK_TOKEN);
    
    return safeUser;
  }

  // Выход
  static logout(): void {
    storage.clearCurrentUser();
    storage.setToken('');
  }

  // Текущий пользователь
  static getCurrentUser(): AuthUser | null {
    return storage.getCurrentUser();
  }

  // Проверка авторизации
  static isAuthenticated(): boolean {
    return storage.getCurrentUser() !== null;
  }
}
