import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandsService } from '../../../services/brands.service';
import { Brand } from '../../../types/brand';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../types/product';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private builder: FormBuilder,
    private brandService: BrandsService,
    private productService: ProductService,
    private toaster : ToastrService
  ) {}

  brands: Brand[] = [];
  product!: Product;

  productForm: FormGroup = this.builder.group({
    name: ['', [Validators.required]],
    details: [''],
    brandId: ['', [Validators.required]],
    salePrice: ['', [Validators.required]],
    purchasePrice: ['', [Validators.required]],
    availableQuantity: ['', [Validators.required]],
  });

  ngOnInit() {
    let id = this.route.snapshot.params['id'];
    this.brandService.getBrand().subscribe((result) => (this.brands = result));
    if (id) {
      this.productService.getProducts(id).subscribe((result) => {
        this.product = result;
        this.productForm.patchValue(this.product);
      });
    }
  }

  addProduct() {
    console.log(this.productForm.value, 'Product');
    if (this.productForm.invalid) {
      this.toaster.error('Please provide all the details!');
      return;
    }
    let product: Product = this.productForm.value;
    this.productService.addProduct(product).subscribe((result) => {
      this.toaster.success('Your product is added successfully');
      this.router.navigateByUrl('/products');
    });
  }

  updateProduct() {
    if (this.productForm.invalid) {
      this.toaster.error('Please provide all the details!');
      return;
    }
    let product: Product = this.productForm.value;
    this.productService
      .updateProduct(this.product.id, product)
      .subscribe((result) => {
        this.toaster.success('Your product is updated successfully');
        this.router.navigateByUrl('/products');
      });
  }
}
