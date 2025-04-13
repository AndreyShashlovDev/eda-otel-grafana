import { OrderMetricsModule } from '@app/telemetry/metrics/order/OrderMetricsModule'
import { TelemetryModule } from '@app/telemetry/metrics/PrometheusModule'
import { Module } from '@nestjs/common'
import { OrdersRepositoryModule } from '../../repository/orders/OrdersRepositoryModule'
import { ApiOrdersController } from './ApiOrdersController'
import { ApiOrdersService } from './ApiOrdersService'

@Module({
  imports: [TelemetryModule, OrderMetricsModule, OrdersRepositoryModule],
  providers: [ApiOrdersService],
  controllers: [ApiOrdersController],
})
export class ApiOrdersModule {}
