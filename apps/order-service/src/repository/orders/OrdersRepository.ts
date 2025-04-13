import { Order, OrderStatus } from '@app/database/entity/OrderEntity'
import { CreateOrderDto } from '@app/dto/OrderDTO'

export abstract class OrdersRepository {

  abstract create(createOrderDto: CreateOrderDto): Promise<Order>

  abstract findById(id: string): Promise<Order | null>

  abstract updateStatus(id: string, status: OrderStatus, metadata?: Record<string, unknown>): Promise<Order>
}
