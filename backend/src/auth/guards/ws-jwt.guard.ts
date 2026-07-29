import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { AccessTokenPayload } from '../auth.types';

@Injectable()
export class WsJwtGuard {
  constructor(private readonly jwtService: JwtService) {}

  async verify(client: Socket): Promise<AccessTokenPayload> {
    const token = client.handshake.query?.token;

    if (typeof token !== 'string' || !token) {
      throw new UnauthorizedException('WebSocket JWT token is missing');
    }

    try {
      return await this.jwtService.verifyAsync<AccessTokenPayload>(token);
    } catch {
      throw new UnauthorizedException(
        'WebSocket JWT token is invalid or expired',
      );
    }
  }
}
