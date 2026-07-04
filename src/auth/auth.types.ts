import { UserRole } from '../users/entities/user.enums';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export type JwtExpiresIn = `${number}${'s' | 'm' | 'h' | 'd' | 'w' | 'y'}`;
