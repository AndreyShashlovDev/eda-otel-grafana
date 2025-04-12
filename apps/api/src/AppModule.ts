import { ConfigModule } from '@app/config/ConfigModule'
import { KafkaModule } from '@app/kafka/KafkaModule'
import { orderMetricsProviders } from '@app/telemetry/MetricsProviders'
import { OrderMetricsService } from '@app/telemetry/OrderMetricsService'
import { TelemetryModule } from '@app/telemetry/PrometheusModule'
import { TracingModule } from '@app/telemetry/TracingModule'
import { Module } from '@nestjs/common'
import { ApiOrdersController } from './ApiOrdersController'
import { ApiOrdersService } from './ApiOrdersService'

@Module({
  imports: [
    ConfigModule,
    TracingModule.forRoot('api-gateway'),
    KafkaModule,
    TelemetryModule,
  ],
  providers: [
    ...orderMetricsProviders,
    OrderMetricsService,
    ApiOrdersService,
  ],
  controllers: [ApiOrdersController],
  exports: [OrderMetricsService],
})
export class AppModule {}
