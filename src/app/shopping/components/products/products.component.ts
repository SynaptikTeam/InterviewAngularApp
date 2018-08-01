import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {Product} from '../../../models/product';
import {CategoryService} from '../../../services/category.service';
import {ProductService} from '../../../services/product.service';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[];
  categories$: Observable<any>;
  categorySelected;
  subscription = new Subscription();

  constructor(private productService: ProductService,
              private categoryService: CategoryService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.subscription.add(
      this.productService.getAll().switchMap((products: Product[]) => {
          this.products = products;
          return this.route.queryParamMap;
        })
        .subscribe(params => {
          this.categorySelected = params.get('category');
          this.filteredProducts = (this.categorySelected) ?
            this.products.filter(p => p.category === this.categorySelected) :
            this.products;
        }));
    this.categories$ = this.categoryService.getCategories();
  }
  ngOnDestroy () {
    this.subscription.unsubscribe();
  }
}
