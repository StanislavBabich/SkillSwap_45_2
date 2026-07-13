import { UserRole } from '../users/user.enums';
import { Request } from 'express';

export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

export type RefreshTokenPayload = {
  sub: string;
};

export type TJwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
  refreshToken?: string;
};

export type AuthRequest = Request & {
  user: TJwtPayload;
};
