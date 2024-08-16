import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../types/product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor() {}

  httpClient = inject(HttpClient);

  getProduct() {
    return this.httpClient.get<Product[]>(environment.apiUrl + '/products');
  }

  addProduct(product: Product) {
    return this.httpClient.post<Product>(
      environment.apiUrl + '/products',
      product
    );
  }

  getProducts(id:string) {
    return this.httpClient.get<Product>(environment.apiUrl + '/products/' + id);
  }

  updateProduct(id:string, product:Product) {
    return this.httpClient.put<Product>(environment.apiUrl + '/products/' + id, product);
  }
}
