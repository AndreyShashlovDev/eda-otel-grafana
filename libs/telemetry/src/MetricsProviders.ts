import { makeCounterProvider, makeGaugeProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus'

export const OrderMetricsName = {
  OrderCreateTotal: 'orders_created_total',
  OrdersProcessingTime: 'orders_processing_time',
  OrdersByStatus: 'orders_by_status',
} as const

export const orderMetricsProviders = [
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
]
