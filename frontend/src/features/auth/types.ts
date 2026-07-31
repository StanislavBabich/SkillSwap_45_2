export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  about?: string;
  cityId?: number;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  skillInterests: number[];
  avatarSeed?: string | null;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  avatarSeed?: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

export type StoredAuthUser = AuthUser & {
  passwordHash: string;
  about?: string;
  cityId?: number;
  gender?: string;
  dateOfBirth?: string;
  registrationDate?: string;
  skillInterests?: number[];
  avatarSeed?: string | null;
};