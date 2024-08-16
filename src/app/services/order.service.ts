import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Order } from '../types/order';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor() {}
  httpClient = inject(HttpClient);

  getOrder() {
    return this.httpClient.get<Order[]>(environment.apiUrl + '/orders');
  }

  addOrder(order: Order) {
    return this.httpClient.post<Order>(environment.apiUrl + '/orders', order);
  }

  getOrders(id: string) {
    return this.httpClient.get<Order>(environment.apiUrl + '/orders/' + id);
  }

  updateOrder(id: string, order: Order) {
    return this.httpClient.put<Order>(
      environment.apiUrl + '/orders/' + id,
      order
    );
  }

  deleteOrder(id:string) {
    return this.httpClient.delete<Order[]>(environment.apiUrl + '/orders/' + id);
  }
}
