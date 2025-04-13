import { ORDER_TOPICS } from '@app/dto/events/OrderEvents'
import { CreateOrderDto, GetOrderDto, OrderResponseDto } from '@app/dto/OrderDTO'
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { Observable } from 'rxjs'
import { OrdersRepository } from './OrdersRepository'

@Injectable()
export class OrdersRepositoryImpl extends OrdersRepository implements OnModuleInit {

  private readonly logger = new Logger(OrdersRepositoryImpl.name)

  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {
    super()
  }

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(ORDER_TOPICS.CREATE_ORDER)
    this.kafkaClient.subscribeToResponseOf(ORDER_TOPICS.GET_ORDER)

    await this.kafkaClient.connect()
    this.logger.log('Connected to Kafka')
  }

  public createOrder(order: CreateOrderDto): Observable<OrderResponseDto> {
    return this.kafkaClient.send(ORDER_TOPICS.CREATE_ORDER, {...order})
  }

  public getOrder(order: GetOrderDto): Observable<OrderResponseDto> {
    return this.kafkaClient.send(ORDER_TOPICS.GET_ORDER, {...order})
  }
}
