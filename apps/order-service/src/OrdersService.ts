import { Order, OrderStatus } from '@app/database/entity/OrderEntity'
import {
  ORDER_TOPICS,
  OrderCreatedEvent,
  OrderProcessedEvent,
  OrderStatusUpdatedEvent
} from '@app/dto/events/OrderEvents'
import { CreateOrderDto } from '@app/dto/OrderDTO'
import { OrdersRepository } from '@app/repository/orders/OrdersRepository'
import { Track } from '@app/telemetry/decorators/MethodDecorators'
import { TrackAll, TrackFields, TrackParam } from '@app/telemetry/decorators/ParamDecorators'
import { OrderMetricsService } from '@app/telemetry/OrderMetricsService'
import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name)

  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly metricsService: OrderMetricsService,
  ) {}

  @Track('createOrder')
  async createOrder(
    @TrackAll('order') createOrderDto: CreateOrderDto,
    @TrackFields(['requestId', 'traceId'], 'headers') headers?: Record<string, unknown>
  ): Promise<{ id: string; status: OrderStatus }> {
    const order = await this.ordersRepository.create(createOrderDto)

    this.metricsService.incrementOrdersCreated(order.userId)
    this.metricsService.updateOrderStatusMetric(OrderStatus.CREATED)

    const orderCreatedEvent = new OrderCreatedEvent(
      order.id,
      order.userId,
      order.items,
      order.total,
      order.metadata,
    )

    this.eventEmitter.emit(ORDER_TOPICS.ORDER_CREATED, orderCreatedEvent)

    this.processOrder(order.id).catch(error => {
      this.logger.error(`Error processing order ${order.id}: ${error.message}`, error.stack)
    })

    return {
      id: order.id,
      status: order.status,
    }
  }

  @Track('getOrderById')
  async getOrderById(
    @TrackParam() id: string,
    @TrackFields(['requestId', 'traceId'], 'headers') headers?: Record<string, any>
  ): Promise<Order> {
    const order = await this.ordersRepository.findById(id)

    if (!order) {
      this.logger.warn(`Order with ID ${id} not found`)
      throw new NotFoundException(`Order with ID ${id} not found`)
    }

    return order
  }

  @Track('updateOrderStatus')
  async updateOrderStatus(
    @TrackParam() id: string,
    @TrackParam() status: OrderStatus,
    @TrackFields(['processingStarted', 'processingCompleted'], 'metadata') metadata?: Record<string, any>
  ): Promise<Order> {
    const order = await this.ordersRepository.updateStatus(id, status, metadata)

    this.metricsService.updateOrderStatusMetric(status)

    const statusUpdatedEvent = new OrderStatusUpdatedEvent(
      order.id,
      status,
      undefined,
      metadata,
    )

    this.eventEmitter.emit(ORDER_TOPICS.ORDER_STATUS_UPDATED, statusUpdatedEvent)

    return order
  }

  @Track('processOrder')
  private async processOrder(
    @TrackParam() orderId: string,
    parentTraceId?: string
  ): Promise<void> {
    const startTime = Date.now()

    try {
      this.logger.debug(`Starting processing for order ${orderId}`)

      await this.updateOrderStatus(orderId, OrderStatus.PROCESSING, {
        processingStarted: new Date().toISOString(),
      })

      await new Promise(resolve => setTimeout(resolve, 2000))

      const order = await this.updateOrderStatus(orderId, OrderStatus.COMPLETED, {
        processingCompleted: new Date().toISOString(),
      })

      const processingTime = (Date.now() - startTime) / 1000

      this.metricsService.observeProcessingTime(processingTime)

      const orderProcessedEvent = new OrderProcessedEvent(
        order.id,
        OrderStatus.COMPLETED,
        {
          processingTime: `${processingTime}s`,
          completedAt: new Date().toISOString(),
        },
      )

      this.eventEmitter.emit(ORDER_TOPICS.ORDER_PROCESSED, orderProcessedEvent)
      this.logger.debug(`Order ${orderId} has been processed successfully in ${processingTime}s`)
    } catch (error) {
      this.logger.error(`Error processing order ${orderId}: ${error.message}`, error.stack)

      const order = await this.updateOrderStatus(orderId, OrderStatus.FAILED, {
        error: error.message,
        failedAt: new Date().toISOString(),
      })

      const orderProcessedEvent = new OrderProcessedEvent(
        order.id,
        OrderStatus.FAILED,
        {
          error: error.message,
          failedAt: new Date().toISOString(),
        },
      )

      this.eventEmitter.emit(ORDER_TOPICS.ORDER_PROCESSED, orderProcessedEvent)
    }
  }
}
