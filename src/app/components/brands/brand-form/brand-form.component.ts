import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Brand } from '../../../types/brand';
import { BrandsService } from '../../../services/brands.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-brand-form',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './brand-form.component.html',
  styleUrl: './brand-form.component.scss',
})
export class BrandFormComponent {
  constructor(
    private brandService: BrandsService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToastrService
  ) {}
  name!: string;
  id!: string;
  // brandService = inject(BrandsService);
  // router = inject(Router);
  brand!: Brand;

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.brandService.getBrands(id).subscribe((result) => {
        this.brand = result;
        this.name = result.name;
      });
    }
  }

  addBrand() {
    if (!this.name) {
      this.toaster.error('Please enter brand name');
      return;
    }
    let brand: Brand = {
      id: this.id,
      name: this.name,
    };
    this.brandService.addBrand(brand).subscribe((result) => {
      this.toaster.success('Brand added Successfully');
      this.router.navigateByUrl('/brands');
    });
  }

  updateBrand() {
    if (!this.name) {
      this.toaster.error('Please enter brand name');
      return;
    }
    let brand: Brand = {
      id: this.brand.id,
      name: this.name,
    };
    this.brandService.updateBrand(brand).subscribe((result) => {
      this.toaster.success('Brand Updated Successfully');
      this.router.navigateByUrl('/brands');
    });
  }
}
