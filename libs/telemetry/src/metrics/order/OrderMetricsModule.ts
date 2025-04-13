import { OrderMetricsName } from '@app/telemetry/metrics/order/OrderMetricsName'
import { OrderMetricsService } from '@app/telemetry/metrics/order/OrderMetricsService'
import { Module } from '@nestjs/common'
import { makeCounterProvider, makeGaugeProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus'

@Module({
  providers: [
    makeCounterProvider({
      name: OrderMetricsName.OrderCreateTotal,
      help: 'Total number of created orders',
      labelNames: ['userId'],
    }),

    makeHistogramProvider({
      name: OrderMetricsName.OrdersProcessingTime,
      help: 'Order processing time in seconds',
      buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
    }),

    makeGaugeProvider({
      name: OrderMetricsName.OrdersByStatus,
      help: 'Number of orders by status',
      labelNames: ['status'],
    }),

    OrderMetricsService
  ],
  exports: [OrderMetricsService]
})
export class OrderMetricsModule {}
