import { ORDER_TOPICS } from '@app/dto/events/OrderEvents'
import { CreateOrderDto } from '@app/dto/OrderDTO'
import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { OrdersService } from './OrdersService'

@Controller()
export class OrdersController {

  private readonly logger = new Logger(OrdersController.name)

  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern(ORDER_TOPICS.CREATE_ORDER)
  async createOrder(@Payload() payload: CreateOrderDto & {
    _requestId: string;
    _timestamp: string;
    _traceId: string;
  }) {
    const {_requestId, _timestamp, _traceId, ...createOrderDto} = payload
    const headers = {requestId: _requestId, timestamp: _timestamp, traceId: _traceId}

    this.logger.debug(`Received create order request: ${JSON.stringify(headers)}`)
    return this.ordersService.createOrder(createOrderDto, headers)
  }

  @MessagePattern(ORDER_TOPICS.GET_ORDER)
  async getOrder(
    @Payload('value') payload: { orderId: string },
    @Payload('headers') headers: Record<string, any>,
  ) {
    this.logger.debug(`Received get order request for ID ${payload.orderId}: ${JSON.stringify(headers)}`)
    return this.ordersService.getOrderById(payload.orderId, headers)
  }
}
