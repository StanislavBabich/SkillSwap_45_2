import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { NotificationPayload } from './notification.types';

@WebSocketGateway()
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  private readonly server: Server;

  constructor(private readonly wsJwtGuard: WsJwtGuard) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const payload = await this.wsJwtGuard.verify(client);
      await client.join(payload.sub);
    } catch {
      client.disconnect(true);
    }
  }

  /*
   * Когда будут сделаны задачи Бориса
дописть сюда 
create → уведомление receiver;
accept → уведомление sender;
reject → уведомление sender;
   */
  notifyUser(userId: string, payload: NotificationPayload): void {
    this.server.to(userId).emit('notificateNewRequest', payload);
  }
}
