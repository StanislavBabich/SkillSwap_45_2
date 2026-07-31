import { storage } from '@/shared/lib/storage';
import type { AuthUser, LoginCredentials } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export class AuthService {
  // Регистрация через API (используется в RegisterPage)
  static async registerViaApi(email: string, password: string, name: string): Promise<{ accessToken: string; user: AuthUser }> {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Ошибка регистрации');
    }
    return res.json();
  }

  // Вход через API
  static async login(credentials: LoginCredentials): Promise<AuthUser | null> {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) return null;

      const data = await res.json();
      
      storage.setToken(data.accessToken);
      storage.setCurrentUser(data.user);
      
      return data.user;
    } catch {
      return null;
    }
  }

  // Выход
  static logout(): void {
    storage.clearCurrentUser();
  }

  // Текущий пользователь
  static getCurrentUser(): AuthUser | null {
    return storage.getCurrentUser();
  }

  // Проверка авторизации
  static isAuthenticated(): boolean {
    return storage.getCurrentUser() !== null && storage.getToken() !== null;
  }
}