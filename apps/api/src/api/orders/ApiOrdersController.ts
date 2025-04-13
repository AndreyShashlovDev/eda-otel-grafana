import { CreateOrderDto, CreateOrderResponseDto, OrderResponseDto } from '@app/dto/OrderDTO'
import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common'
import { ApiOrdersService } from './ApiOrdersService'

@Controller('orders')
@UseInterceptors(ClassSerializerInterceptor)
export class ApiOrdersController {

  constructor(private readonly ordersService: ApiOrdersService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<CreateOrderResponseDto> {
    return this.ordersService.createOrder(createOrderDto)
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<OrderResponseDto> {
    return this.ordersService.getOrderById(id)
  }
}
