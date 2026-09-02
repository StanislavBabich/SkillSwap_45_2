import { storage } from '@/shared/lib/storage';
import type { AuthUser, LoginCredentials } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export class AuthService {
  static async registerViaApi(email: string, password: string, name: string): Promise<{ accessToken: string; user: AuthUser }> {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Sign-up failed');
    }
    return res.json();
  }

  static async login(credentials: LoginCredentials): Promise<AuthUser | null> {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) return null;

      const data = await res.json();
      
      // Сохраняем существующий avatarSeed, если он был в localStorage
      const existingUser = storage.getCurrentUser();
      const avatarSeed = existingUser?.avatarSeed ?? null;

      storage.setToken(data.accessToken);
      storage.setCurrentUser({
        ...data.user,
        avatarSeed, // не теряем seed при логине
      });
      
      return data.user;
    } catch {
      return null;
    }
  }

  static logout(): void {
    storage.clearCurrentUser();
  }

  static getCurrentUser(): AuthUser | null {
    return storage.getCurrentUser();
  }

  static isAuthenticated(): boolean {
    return storage.getCurrentUser() !== null && storage.getToken() !== null;
  }
}