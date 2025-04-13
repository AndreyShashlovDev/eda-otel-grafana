import { OrderMetricsModule } from '@app/telemetry/metrics/order/OrderMetricsModule'
import { TelemetryModule } from '@app/telemetry/metrics/PrometheusModule'
import { Module } from '@nestjs/common'
import { OrdersController } from './OrdersController'
import { OrdersService } from './OrdersService'
import { OrdersRepositoryModule } from '../repository/orders/OrdersRepositoryModule'

@Module({
  imports: [
    OrdersRepositoryModule,
    TelemetryModule,
    OrderMetricsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
