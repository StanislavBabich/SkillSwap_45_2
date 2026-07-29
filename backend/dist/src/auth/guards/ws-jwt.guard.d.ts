import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { AccessTokenPayload } from '../auth.types';
export declare class WsJwtGuard {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    verify(client: Socket): Promise<AccessTokenPayload>;
}
