import { Controller, Get } from '@nestjs/common';
import { PrometheusController } from '@willsoto/nestjs-prometheus';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

@Controller('metrics')
export class MetricsController extends PrometheusController {
  constructor(
    private health: HealthCheckService,
  ) {
    super();
  }

  @Get('health')
  @HealthCheck()
  check() {
    return this.health.check([]);
  }
}
