import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '@/features/auth';
import { AUTH_SESSION_EVENT } from '@/shared/lib/storage';
import type { AuthState, LoginCredentials, RegisterData } from '../types';

interface UseAuthReturn extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: () => boolean;
  refreshSession: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate();

  const [user, setUser] = useState<AuthState['user']>(null);
  const [isLoading, setIsLoading] = useState<AuthState['isLoading']>(false);
  const [error, setError] = useState<AuthState['error']>(null);

  const refreshSession = useCallback(() => {
    const sessionUser = AuthService.getCurrentUser();
    setUser(sessionUser);
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorage = () => {
      refreshSession();
    };
    const handleSessionChanged = () => {
      refreshSession();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(AUTH_SESSION_EVENT, handleSessionChanged);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(AUTH_SESSION_EVENT, handleSessionChanged);
    };
  }, [refreshSession]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await AuthService.login(credentials); 
      
      if (user) {
        setUser(user);
        return true;
      } else {
        setError('Неверный email или пароль');
        return false;
      }
    } catch (unknownError) {
      if (unknownError instanceof Error) {
        setError(unknownError.message);
      } else {
        setError('Не удалось выполнить вход');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const registeredUser = await AuthService.register(data);
      setUser(registeredUser);
      return true;
    } catch (unknownError) {
      if (unknownError instanceof Error) {
        setError(unknownError.message);
      } else {
        setError('Не удалось выполнить регистрацию');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
    navigate('/');
  }, [navigate]);

  const isAuthenticated = useCallback((): boolean => AuthService.isAuthenticated(), []);

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    refreshSession,
  };
};
