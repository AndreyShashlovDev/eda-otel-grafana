import { Module } from '@nestjs/common'
import { NotificationsService } from './NotificationsService'

@Module({
  providers: [NotificationsService],
})
export class NotificationsModule {}
