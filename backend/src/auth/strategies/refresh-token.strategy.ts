import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { jwtConfig, TJwtConfig } from '../../config/jwt.config';
import type { RefreshTokenPayload } from '../auth.types';

function getRefreshTokenFromRequest(req: Request): string | null {
  const body = req.body as { refreshToken?: unknown };
  if (typeof body.refreshToken === 'string') {
    return body.refreshToken;
  }

  const cookies = req.cookies as { refreshToken?: unknown } | undefined;
  if (typeof cookies?.refreshToken === 'string') {
    return cookies.refreshToken;
  }

  return null;
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly config: TJwtConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => getRefreshTokenFromRequest(req),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.refreshSecret ?? 'default-refresh-secret',
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: RefreshTokenPayload) {
    const refreshToken = getRefreshTokenFromRequest(req) ?? '';
    return { id: payload.sub, refreshToken };
  }
}
