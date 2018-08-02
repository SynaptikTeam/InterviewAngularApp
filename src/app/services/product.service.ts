import {HttpClient, HttpRequest, HttpXhrBackend} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ProductService {
  constructor(private http: HttpClient) { }

  create() {
    return this.http.post('/api/products',   product);
  }
  getAll() {
    return this.http.get('/api/products');
  }
  getProduct(productId) {
    return this.http.get('/api/products/' + productId);
  }
  update(productId, product) {
    return this.http.put('/api/products/' + productId, product);
  }
  delete(productId) {
    return this.http.delete('/api/products/' + productId);
  }
}
