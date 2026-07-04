export type TJwtPayload = {
  sub: string;
  email: string;
  role: string;
  refreshToken?: string;
};
