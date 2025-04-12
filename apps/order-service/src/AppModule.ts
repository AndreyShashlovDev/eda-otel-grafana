import { ConfigModule } from '@app/config/ConfigModule'
import { orderMetricsProviders } from '@app/telemetry/MetricsProviders'
import { OrderMetricsService } from '@app/telemetry/OrderMetricsService'
import { TelemetryModule } from '@app/telemetry/PrometheusModule'
import { TracingModule } from '@app/telemetry/TracingModule'
import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { NotificationsModule } from './notifications/NotificationsModule'
import { OrdersModule } from './OrdersModule'

@Module({
  imports: [
    ConfigModule,
    TelemetryModule,
    TracingModule.forRoot('order-service'),
    EventEmitterModule.forRoot({
      global: true,
      maxListeners: 20,
      ignoreErrors: false,
    }),
    OrdersModule,
    NotificationsModule,
  ],
  providers: [
    ...orderMetricsProviders,
    OrderMetricsService,
  ],
  exports: [OrderMetricsService],
})
export class AppModule {}
