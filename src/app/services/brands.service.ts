import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Brand } from '../types/brand';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  constructor(private httpClient: HttpClient) {}

  // httpClient = inject(HttpClient);

  getBrand() {
    return this.httpClient.get<Brand[]>(environment.apiUrl + '/brands');
  }

  addBrand(brand: Brand) {
    return this.httpClient.post<Brand>(environment.apiUrl + '/brands', brand);
  }

  updateBrand(brand: Brand) {
    return this.httpClient.put<Brand>(environment.apiUrl + '/brands/' + brand.id, brand);
  }

  getBrands(brandId: string) {
    return this.httpClient.get<Brand>(environment.apiUrl + '/brands/'+ brandId);
  }
}
