import { Order, OrderStatus } from '@app/database/entity/OrderEntity'
import { CreateOrderDto } from '@app/dto/OrderDTO'
import { OrdersRepository } from '@app/repository/orders/OrdersRepository'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class OrdersRepositoryImpl extends OrdersRepository {

  private readonly logger = new Logger(OrdersRepository.name)

  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
  ) {
    super()
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      this.logger.debug(`Creating order for user ${createOrderDto.userId}`)

      const order = this.orderRepository.create({
        userId: createOrderDto.userId,
        items: createOrderDto.items,
        total: createOrderDto.total,
        status: OrderStatus.CREATED,
        metadata: createOrderDto.metadata || {},
      })

      const savedOrder = await this.orderRepository.save(order)
      this.logger.debug(`Order created with ID: ${savedOrder.id}`)

      return savedOrder
    } catch (error) {
      this.logger.error(`Error creating order: ${error.message}`, error.stack)
      throw error
    }
  }

  async findById(id: string): Promise<Order | null> {
    try {
      this.logger.debug(`Finding order with ID: ${id}`)
      return await this.orderRepository.findOne({where: {id}})
    } catch (error) {
      this.logger.error(`Error finding order ${id}: ${error.message}`, error.stack)
      throw error
    }
  }

  async updateStatus(id: string, status: OrderStatus, metadata?: Record<string, unknown>): Promise<Order> {
    try {
      this.logger.debug(`Updating order ${id} status to ${status}`)

      const order = await this.findById(id)
      if (!order) {
        throw new Error(`Order with ID ${id} not found`)
      }

      order.status = status

      if (metadata) {
        order.metadata = {
          ...order.metadata,
          ...metadata,
        }
      }

      return await this.orderRepository.save(order)
    } catch (error) {
      this.logger.error(`Error updating order ${id} status: ${error.message}`, error.stack)
      throw error
    }
  }

  async save(order: Order): Promise<Order> {
    try {
      return await this.orderRepository.save(order)
    } catch (error) {
      this.logger.error(`Error saving order: ${error.message}`, error.stack)
      throw error
    }
  }
}
