import { ORDER_TOPICS } from '@app/dto/events/OrderEvents'
import { CreateOrderDto, CreateOrderResponseDto, OrderResponseDto } from '@app/dto/OrderDTO'
import { Track } from '@app/telemetry/decorators/MethodDecorators'
import { TrackAll, TrackParam } from '@app/telemetry/decorators/ParamDecorators'
import { OrderMetricsService } from '@app/telemetry/OrderMetricsService'
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { firstValueFrom, timeout } from 'rxjs'

@Injectable()
export class ApiOrdersService implements OnModuleInit {
  private readonly logger = new Logger(ApiOrdersService.name)

  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly metricsService: OrderMetricsService,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(ORDER_TOPICS.CREATE_ORDER)
    this.kafkaClient.subscribeToResponseOf(ORDER_TOPICS.GET_ORDER)

    await this.kafkaClient.connect()
    this.logger.log('Connected to Kafka')
  }

  @Track('createOrder')
  async createOrder(
    @TrackAll('order') createOrderDto: CreateOrderDto
  ): Promise<CreateOrderResponseDto> {
    this.logger.debug(`Creating order for user ${createOrderDto.userId}`)

    const requestId = crypto.randomUUID()

    this.metricsService.incrementOrdersCreated(createOrderDto.userId)

    const startTime = Date.now()

    const result = await firstValueFrom(
      this.kafkaClient
        .send(ORDER_TOPICS.CREATE_ORDER, {
          ...createOrderDto,
          _requestId: requestId,
          _timestamp: Date.now().toString(),
        })
        .pipe(timeout(10000)),
    )

    const processingTime = (Date.now() - startTime) / 1000

    this.metricsService.observeProcessingTime(processingTime)

    this.logger.debug(`Order created with ID: ${result.id} in ${processingTime}s`)

    return {
      orderId: result.id,
      message: 'Order has been created and is being processed',
    }
  }

  @Track('getOrderById')
  async getOrderById(
    @TrackParam() id: string
  ): Promise<OrderResponseDto> {
    this.logger.debug(`Getting order with ID: ${id}`)

    const requestId = crypto.randomUUID()

    return await firstValueFrom(
      this.kafkaClient
        .send(ORDER_TOPICS.GET_ORDER, {
          orderId: id,
          _requestId: requestId,
          _timestamp: Date.now().toString(),
        })
        .pipe(timeout(5000)),
    )
  }
}
