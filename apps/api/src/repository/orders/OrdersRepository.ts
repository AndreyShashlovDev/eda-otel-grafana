import { CreateOrderDto, CreateOrderResponseDto, GetOrderDto, OrderResponseDto } from '@app/dto/OrderDTO'
import { Observable } from 'rxjs'

export abstract class OrdersRepository {

  public abstract createOrder(order: CreateOrderDto): Observable<OrderResponseDto>

  public abstract getOrder(order: GetOrderDto): Observable<OrderResponseDto>
}
