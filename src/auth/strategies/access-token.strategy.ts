import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConfig, TJwtConfig } from '../../config/jwt.config';
import type { TJwtPayload, TJwtUser } from '../auth.types';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly config: TJwtConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.accessSecret ?? 'default-secret',
    });
  }

  validate(payload: TJwtPayload): TJwtUser {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
