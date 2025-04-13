import { KafkaModule } from '@app/kafka/KafkaModule'
import { ClassProvider, Module } from '@nestjs/common'
import { OrdersRepository } from './OrdersRepository'
import { OrdersRepositoryImpl } from './OrdersRepositoryImpl'

const Provider: ClassProvider = {
  provide: OrdersRepository,
  useClass: OrdersRepositoryImpl
}

@Module({
  imports: [KafkaModule],
  providers: [Provider],
  exports: [Provider]
})
export class OrdersRepositoryModule {}
