import { DatabaseModule } from '@app/database/DatabaseModule'
import { Order } from '@app/database/entity/OrderEntity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrdersRepository } from './OrdersRepository'
import { OrdersRepositoryImpl } from './OrdersRepositoryImpl'

const ClassProvider = {provide: OrdersRepository, useClass: OrdersRepositoryImpl}

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Order])],
  exports: [ClassProvider],
  providers: [ClassProvider],
})
export class OrdersRepositoryModule {}
