import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Product } from '../../types/product';
import { ProductService } from '../../services/product.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  constructor(private productService: ProductService, private route:ActivatedRoute) {}
  dataSource!: MatTableDataSource<Product>;
  products: Product[] = [];
  displayedColumns = [
    'name',
    'details',
    'brandId',
    'salePrice',
    'purchasePrice',
    'availableQuantity',
    'action',
  ];
  @ViewChild(MatPaginator) paginator! : MatPaginator;
  @ViewChild(MatSort) sort! : MatSort;

  ngOnInit() {
    this.productService.getProduct().subscribe((result) => {
      this.products = result;
      this.initTable();
    });
  }

  initTable() {
    this.dataSource = new MatTableDataSource(this.products);
    this.dataSource.sort=this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.paginator.firstPage();
  }
}
