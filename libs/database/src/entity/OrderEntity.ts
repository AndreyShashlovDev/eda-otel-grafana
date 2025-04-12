import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export enum OrderStatus {
  CREATED = 'CREATED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

@Entity('orders')
export class Order {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({type: 'varchar', length: 100})
  userId: string

  @Column({type: 'jsonb'})
  items: any[]

  @Column({type: 'decimal', precision: 10, scale: 2})
  total: number

  @Column({
    type: 'text',
    enum: OrderStatus,
    default: OrderStatus.CREATED,
  })
  status: OrderStatus

  @Column({type: 'jsonb', nullable: true})
  metadata: Record<string, any>

  @CreateDateColumn({type: 'timestamptz'})
  createdAt: Date

  @UpdateDateColumn({type: 'timestamptz'})
  updatedAt: Date

  constructor(
    userId: string,
    items: any[],
    total: number,
    status: OrderStatus,
    metadata: Record<string, any>,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.userId = userId
    this.items = items
    this.total = total
    this.status = status
    this.metadata = metadata
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
