import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Order } from '../../types/order';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { OrderService } from '../../services/order.service';
import { MatInputModule } from '@angular/material/input';
import { ProductService } from '../../services/product.service';
import { Product } from '../../types/product';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private toaster: ToastrService
  ) {}
  dataSource!: MatTableDataSource<Order>;
  orders: Order[] = [];
  products: Product[] = [];
  displayedColumns = [
    'orderNo',
    'productId',
    'quantity',
    'salePrice',
    'discount',
    'totalAmount',
    'action',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.productService
      .getProduct()
      .subscribe((result) => (this.products = result));
    console.log(this.products, 'prod');
    this.orderService.getOrder().subscribe((result) => {
      this.orders = result;
      this.initTable();
    });
  }

  initTable() {
    this.dataSource = new MatTableDataSource(this.orders);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.paginator.firstPage();
  }

  getProductName(id: string) {
    return this.products.find((x) => x.id == id)?.name;
  }

  cancelOrder(order: Order) {
    this.orderService.deleteOrder(order.id!).subscribe(() => {
      this.toaster.success('Order Canceled');
      this.productService.getProducts(order.productId).subscribe((product) => {
        product.availableQuantity +=
          +product.availableQuantity + +order.quantity!;
        this.productService.updateProduct(product!.id!, product!).subscribe();
      });
      this.orders = this.orders.filter((x) => x.id != order.id);
      this.dataSource.data = this.orders;
    });
  }
}
