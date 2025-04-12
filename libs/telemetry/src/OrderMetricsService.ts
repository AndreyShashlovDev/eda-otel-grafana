import { OrderStatus } from '@app/database/entity/OrderEntity'
import { OrderMetricsName } from '@app/telemetry/MetricsProviders'
import { Injectable } from '@nestjs/common'
import { InjectMetric } from '@willsoto/nestjs-prometheus'
import { Counter, Gauge, Histogram } from 'prom-client'

@Injectable()
export class OrderMetricsService {

  constructor(
    @InjectMetric(OrderMetricsName.OrderCreateTotal) private ordersCreatedCounter: Counter<string>,
    @InjectMetric(OrderMetricsName.OrdersProcessingTime) private ordersProcessingTime: Histogram<string>,
    @InjectMetric(OrderMetricsName.OrdersByStatus) private ordersByStatusGauge: Gauge<string>,
  ) {}

  incrementOrdersCreated(userId: string): void {
    this.ordersCreatedCounter.inc({userId})
  }

  updateOrderStatusMetric(status: OrderStatus, delta: number = 1): void {
    this.ordersByStatusGauge.inc({status}, delta)
  }

  observeProcessingTime(processingTime: number): void {
    this.ordersProcessingTime.observe(processingTime)
  }
}
