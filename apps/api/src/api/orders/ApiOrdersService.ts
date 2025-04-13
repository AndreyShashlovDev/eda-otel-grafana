import { CreateOrderDto, CreateOrderResponseDto, GetOrderDto, OrderResponseDto } from '@app/dto/OrderDTO'
import { OrderMetricsService } from '@app/telemetry/metrics/order/OrderMetricsService'
import { Track } from '@app/telemetry/tracing/decorators/MethodDecorators'
import { TrackAll, TrackParam } from '@app/telemetry/tracing/decorators/ParamDecorators'
import { TracingService } from '@app/telemetry/tracing/TracingService'
import { Injectable, Logger } from '@nestjs/common'
import { firstValueFrom, timeout } from 'rxjs'
import { OrdersRepository } from '../../repository/orders/OrdersRepository'

@Injectable()
export class ApiOrdersService {
  private readonly logger = new Logger(ApiOrdersService.name)

  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly metricsService: OrderMetricsService,
    private readonly tracingService: TracingService,
  ) {}

  @Track('createOrder')
  async createOrder(
    @TrackAll('order') createOrderDto: CreateOrderDto
  ): Promise<CreateOrderResponseDto> {
    this.logger.debug(`Creating order for user ${createOrderDto.userId}`)

    this.metricsService.incrementOrdersCreated(createOrderDto.userId)

    const startTime = Date.now()

    const result = await firstValueFrom(
      this.ordersRepository.createOrder(createOrderDto)
        .pipe(timeout(10000))
    )

    this.tracingService.getCurrentSpan().setAttribute('order.id', result.id)

    const processingTime = (Date.now() - startTime) / 1000

    this.metricsService.observeProcessingTime(processingTime)

    this.logger.debug(`Order created with ID: ${result.id} in ${processingTime}s`)

    return new CreateOrderResponseDto(result.id, 'Order has been created and is being processed')
  }

  @Track('getOrderById')
  async getOrderById(
    @TrackParam() id: string
  ): Promise<OrderResponseDto> {
    this.logger.debug(`Getting order with ID: ${id}`)

    return firstValueFrom(
      this.ordersRepository.getOrder(new GetOrderDto(id))
        .pipe(timeout(5000)),
    )
  }
}
