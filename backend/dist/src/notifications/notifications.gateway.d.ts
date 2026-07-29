import { OnGatewayConnection } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { NotificationPayload } from './notification.types';
export declare class NotificationsGateway implements OnGatewayConnection {
    private readonly wsJwtGuard;
    private readonly server;
    constructor(wsJwtGuard: WsJwtGuard);
    handleConnection(client: Socket): Promise<void>;
    notifyUser(userId: string, payload: NotificationPayload): void;
}
