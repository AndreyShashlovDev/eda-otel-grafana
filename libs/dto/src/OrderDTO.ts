import { OrderStatus } from '@app/database/entity/OrderEntity'
import { Type } from 'class-transformer'
import { IsArray, IsNumber, IsObject, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator'

export class OrderItemDto {
  @IsString()
  productId: string

  @IsString()
  name: string

  @IsNumber()
  @Min(0)
  price: number

  @IsNumber()
  @Min(1)
  quantity: number

  constructor(productId: string, name: string, price: number, quantity: number) {
    this.productId = productId
    this.name = name
    this.price = price
    this.quantity = quantity
  }
}

export class CreateOrderDto {
  @IsString()
  userId: string

  @IsArray()
  @ValidateNested({each: true})
  @Type(() => OrderItemDto)
  items: OrderItemDto[]

  @IsNumber()
  @Min(0)
  total: number

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>

  constructor(userId: string, items: OrderItemDto[], total: number, metadata: Record<string, any>) {
    this.userId = userId
    this.items = items
    this.total = total
    this.metadata = metadata
  }
}

export class CreateOrderResponseDto {
  @IsUUID()
  orderId: string

  message: string

  constructor(orderId: string, message: string) {
    this.orderId = orderId
    this.message = message
  }
}

export class GetOrderDto {
  @IsUUID()
  orderId: string

  constructor(orderId: string) {
    this.orderId = orderId
  }
}

export class OrderResponseDto {

  @IsUUID()
  id: string

  @IsString()
  userId: string

  @IsArray()
  items: OrderItemDto[]

  @IsNumber()
  total: number

  status: OrderStatus

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>

  createdAt: Date
  updatedAt: Date

  constructor(
    id: string,
    userId: string,
    items: OrderItemDto[],
    total: number,
    status: OrderStatus,
    metadata: Record<string, any>,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id
    this.userId = userId
    this.items = items
    this.total = total
    this.status = status
    this.metadata = metadata
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
