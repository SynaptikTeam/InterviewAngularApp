import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories() {
    return this.http.get('api/categories').map(response => {
      return response['categories'];
    });
  }
  create(product) {
    return this.http.post('/api/products',  product );
  }
  getAll() {
    return this.http.get('/api/products');
  }
  getProduct(productId) {
    return this.http.get('/api/products/' + productId);
  }
}
