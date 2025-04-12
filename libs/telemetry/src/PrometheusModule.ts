import { MetricsController } from '@app/telemetry/MetricsController'
import { orderMetricsProviders } from '@app/telemetry/MetricsProviders'
import { OrderMetricsService } from '@app/telemetry/OrderMetricsService'
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
  providers: [
    ...orderMetricsProviders,
    OrderMetricsService
  ],
  controllers: [MetricsController],
  exports: [OrderMetricsService],
})
export class TelemetryModule {}
