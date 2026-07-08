import { UserRole } from '../users/user.enums';

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
  role: string;
  refreshToken?: string;
};
