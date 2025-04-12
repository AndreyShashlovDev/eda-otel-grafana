import { OrderStatus } from '@app/database/entity/OrderEntity'

export abstract class OrderEvent {

  constructor(
    public readonly id: string,
    public readonly occurredAt: Date = new Date(),
    public readonly eventId: string = crypto.randomUUID(),
  ) {}
}

export class OrderCreatedEvent extends OrderEvent {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly items: any[],
    public readonly total: number,
    public readonly metadata?: Record<string, any>,
  ) {
    super(id)
  }
}

export class OrderStatusUpdatedEvent extends OrderEvent {
  constructor(
    public readonly id: string,
    public readonly status: OrderStatus,
    public readonly reason?: string,
    public readonly metadata?: Record<string, any>,
  ) {
    super(id)
  }
}

export class OrderProcessedEvent extends OrderEvent {
  constructor(
    public readonly id: string,
    public readonly status: OrderStatus.COMPLETED | OrderStatus.FAILED,
    public readonly processingDetails: any,
  ) {
    super(id)
  }
}

export class OrderCancelledEvent extends OrderEvent {
  constructor(
    public readonly id: string,
    public readonly reason: string,
    public readonly cancelledBy: string,
  ) {
    super(id)
  }
}

export const ORDER_TOPICS = {
  CREATE_ORDER: 'create.order',
  GET_ORDER: 'get.order',
  ORDER_CREATED: 'order.created',
  ORDER_STATUS_UPDATED: 'order.status.updated',
  ORDER_PROCESSED: 'order.processed',
  ORDER_CANCELLED: 'order.cancelled',
} as const
