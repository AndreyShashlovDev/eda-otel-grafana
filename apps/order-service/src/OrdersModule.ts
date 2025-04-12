import { OrdersRepositoryModule } from '@app/repository/orders/OrdersRepositoryModule'
import { RepositoryModule } from '@app/repository/RepositoryModule'
import { TelemetryModule } from '@app/telemetry/PrometheusModule'
import { Module } from '@nestjs/common'
import { OrdersController } from './OrdersController'
import { OrdersService } from './OrdersService'

@Module({
  imports: [
    RepositoryModule,
    OrdersRepositoryModule,
    TelemetryModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
