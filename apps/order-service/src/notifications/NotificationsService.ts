import { OrderStatus } from '@app/database/entity/OrderEntity'
import {
  ORDER_TOPICS,
  OrderCreatedEvent,
  OrderProcessedEvent,
  OrderStatusUpdatedEvent
} from '@app/dto/events/OrderEvents'
import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

@Injectable()
export class NotificationsService {

  private readonly logger = new Logger(NotificationsService.name)

  @OnEvent(ORDER_TOPICS.ORDER_CREATED)
  handleOrderCreatedEvent(event: OrderCreatedEvent) {
    this.logger.log(`Order created notification: Order ${event.id} created for user ${event.userId}`)
    this.sendUserNotification(event.userId, `Your order ${event.id} has been created and is being processed.`)
  }

  @OnEvent(ORDER_TOPICS.ORDER_STATUS_UPDATED)
  handleOrderStatusUpdatedEvent(event: OrderStatusUpdatedEvent) {
    this.logger.log(`Order status updated notification: Order ${event.id} status changed to ${event.status}`)
  }

  @OnEvent(ORDER_TOPICS.ORDER_PROCESSED)
  handleOrderProcessedEvent(event: OrderProcessedEvent) {
    this.logger.log(`Order processed notification: Order ${event.id} has been ${event.status}`)

    if (event.status === OrderStatus.COMPLETED) {
      this.logger.log(`Sending completion notification for order ${event.id}`)

    } else if (event.status === OrderStatus.FAILED) {

      this.logger.log(`Sending failure notification for order ${event.id}`)
    }
  }

  private sendUserNotification(userId: string, message: string): void {
    this.logger.debug(`[Mock Notification] To User ${userId}: ${message}`)
  }
}
