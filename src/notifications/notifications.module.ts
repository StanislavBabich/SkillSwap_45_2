import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  imports: [AuthModule],
  providers: [NotificationsGateway],
  // Когда будут сделаны задачи Бориса RequestsModule добавить NotificationsModule в imports:

  exports: [NotificationsGateway],
})
export class NotificationsModule {}
