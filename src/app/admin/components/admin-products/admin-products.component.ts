import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ProductService} from '../../../services/product.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products$: Observable<any>
  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.products$ = this.productService.getAll();
  }

}
