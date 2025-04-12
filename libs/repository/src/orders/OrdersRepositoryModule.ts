import { Order } from '@app/database/entity/OrderEntity'
import { OrdersRepository } from '@app/repository/orders/OrdersRepository'
import { OrdersRepositoryImpl } from '@app/repository/orders/OrdersRepositoryImpl'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

const ClassProvider = {provide: OrdersRepository, useClass: OrdersRepositoryImpl}

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  exports: [ClassProvider],
  providers: [ClassProvider],
})
export class OrdersRepositoryModule {}
