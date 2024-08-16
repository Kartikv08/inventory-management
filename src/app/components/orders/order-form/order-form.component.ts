import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Order } from '../../../types/order';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../types/product';
import { MatButtonModule } from '@angular/material/button';
import { OrderService } from '../../../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss',
})
export class OrderFormComponent {
  constructor(
    private formbuilder: FormBuilder,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster : ToastrService
  ) {}

  selectedProduct?: Product;
  products: Product[] = [];
  order!: Order;
  orderForm = this.formbuilder.group<Order>({
    orderNo: '',
    productId: '',
    quantity: null,
    salePrice: null,
    discount: null,
    totalAmount: null,
  });

  ngOnInit() {
    let id = this.route.snapshot.params['id'];
    if (id) {
      this.orderService.getOrders(id).subscribe((result) => {
        this.order = result;
        this.orderForm.patchValue(this.order);
        this.productService.getProduct().subscribe((result) => {
          this.products = result;
          this.selectedProduct = this.products.find(
            (x) => x.id == this.order.productId
          );
        });
        this.orderForm.controls.productId.disable();
      });
    } else {
      this.productService.getProduct().subscribe((result) => {
        this.products = result;
        this.selectedProduct = this.products.find(
          (x) => x.id == this.order.productId
        );
      });
    }
    this.orderForm.controls.orderNo.addValidators(Validators.required);
    this.orderForm.controls.productId.addValidators(Validators.required);
    this.orderForm.controls.quantity.addValidators(Validators.required);
    this.updateTotalAmount();
  }

  productSelected(productId: string) {
    this.selectedProduct = this.products.find((x) => x.id == productId);
    if (this.selectedProduct) {
      this.orderForm.controls.salePrice.enable();
      this.orderForm.controls.salePrice.setValue(
        this.selectedProduct?.salePrice!
      );
      this.orderForm.controls.salePrice.disable();
    }
  }

  updateTotalAmount() {
    this.orderForm.valueChanges.subscribe(() => {
      this.orderForm.controls.totalAmount.enable({ emitEvent: false });
      if (
        this.orderForm.getRawValue().productId &&
        this.orderForm.value.quantity
      ) {
        let total =
          this.selectedProduct?.salePrice! * this.orderForm.value.quantity -
          (this.orderForm.value.discount || 0);
        this.orderForm.controls.totalAmount.setValue(total, {
          emitEvent: false,
        });
      }
      this.orderForm.controls.totalAmount.disable({ emitEvent: false });
    });
  }

  addOrder() {
    if (this.orderForm.invalid) {
      this.toaster.error('Please Provide all the details');
      return;
    }
    let formValue = this.orderForm.getRawValue() as Order;
    if (formValue.quantity! > this.selectedProduct!.availableQuantity) {
      this.toaster.error(
        'Only ' +
          this.selectedProduct?.availableQuantity! +
          ' unit is left in the inventory'
      );
      return;
    }
    this.orderService.addOrder(formValue).subscribe(() => {
      this.selectedProduct!.availableQuantity -= formValue.quantity!;
      this.productService
        .updateProduct(this.selectedProduct!.id!, this.selectedProduct!)
        .subscribe();
      this.toaster.success('Your order added successfully');
      this.router.navigateByUrl('/orders');
    });
  }

  updateOrder() {
    if (this.orderForm.invalid) {
      this.toaster.error('Please Provide all the details');
      return;
    }
    let formValue = this.orderForm.getRawValue() as Order;
    if (
      formValue.quantity! >
      this.selectedProduct!.availableQuantity + this.order.quantity!
    ) {
      this.toaster.error(
        'Only ' +
          this.selectedProduct?.availableQuantity! +
          ' unit is left in the inventory'
      );
      return;
    }
    this.orderService.updateOrder(this.order.id!, formValue).subscribe(() => {
      this.selectedProduct!.availableQuantity -=
        formValue.quantity! - this.order.quantity!;
      this.productService
        .updateProduct(this.selectedProduct!.id!, this.selectedProduct!)
        .subscribe();
        this.toaster.success('Your order updated successfully');
      this.router.navigateByUrl('/orders');
    });
  }
}
