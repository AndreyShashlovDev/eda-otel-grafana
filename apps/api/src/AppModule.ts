import { ConfigModule } from '@app/config/ConfigModule'
import { TracingModule } from '@app/telemetry/tracing/TracingModule'
import { Module } from '@nestjs/common'
import { ApiOrdersModule } from './api/orders/ApiOrdersModule'

@Module({
  imports: [
    ConfigModule,
    TracingModule.forRoot('api-gateway'),
    ApiOrdersModule,
  ],
  providers: []
})
export class AppModule {}
