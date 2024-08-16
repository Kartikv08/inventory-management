import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BrandsService } from '../../services/brands.service';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  totalOrders!: number;
  totalProducts!: number;
  totalBrands!: number;
  brandService = inject(BrandsService);
  orderService = inject(OrderService);
  productService = inject(ProductService);

  ngOnInit() {
    this.getBrand();
    this.getOrder();
    this.getProduct();
  }

  getBrand() {
    this.brandService
      .getBrand()
      .subscribe((result) => (this.totalBrands = result.length));
  }

  getOrder() {
    this.orderService
      .getOrder()
      .subscribe((result) => (this.totalOrders = result.length));
  }

  getProduct() {
    this.productService
      .getProduct()
      .subscribe((result) => (this.totalProducts = result.length));
  }
}
