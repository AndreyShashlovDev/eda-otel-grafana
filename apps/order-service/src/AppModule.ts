import { ConfigModule } from '@app/config/ConfigModule'
import { OrderMetricsService } from '@app/telemetry/metrics/order/OrderMetricsService'
import { TelemetryModule } from '@app/telemetry/metrics/PrometheusModule'
import { TracingModule } from '@app/telemetry/tracing/TracingModule'
import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { NotificationsModule } from './notifications/NotificationsModule'
import { OrdersModule } from './api/OrdersModule'

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
  providers: [],
})
export class AppModule {}
