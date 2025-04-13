import { ORDER_TOPICS } from '@app/dto/events/OrderEvents'
import { CreateOrderDto, GetOrderDto, OrderResponseDto } from '@app/dto/OrderDTO'
import {
  ClassSerializerInterceptor,
  Controller,
  Logger,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { OrdersService } from './OrdersService'

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({transform: true}))
export class OrdersController {

  private readonly logger = new Logger(OrdersController.name)

  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern(ORDER_TOPICS.CREATE_ORDER)
  async createOrder(@Payload() payload: CreateOrderDto): Promise<OrderResponseDto> {
    this.logger.debug(`Received create order request: ${JSON.stringify(payload)}`)
    return this.ordersService.createOrder(payload)
  }

  @MessagePattern(ORDER_TOPICS.GET_ORDER)
  async getOrder(@Payload() payload: GetOrderDto) {
    return this.ordersService.getOrderById(payload.orderId)
  }
}
