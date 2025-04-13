import { MetricsController } from '@app/telemetry/metrics/MetricsController'
import { OrderMetricsModule } from '@app/telemetry/metrics/order/OrderMetricsModule'
import { OrderMetricsService } from '@app/telemetry/metrics/order/OrderMetricsService'
import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { PrometheusModule } from '@willsoto/nestjs-prometheus'

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
      },
    }),
    TerminusModule,
  ],
  controllers: [MetricsController],
})
export class TelemetryModule {}
