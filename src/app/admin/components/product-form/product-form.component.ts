import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import {Product} from '../../../models/product';
import {CategoryService} from '../../../services/category.service';
import {ProductService} from '../../../services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit, OnDestroy {
  categories$: Observable<any>;
  product: Product = {
    title: '',
    category: '',
    price: null,
    imageUrl: ''
  };
  productId: string;
  subscription = new Subscription();
  // form
  myForm;
  titleControl: AbstractControl;
  priceControl: AbstractControl;
  categoryControl: AbstractControl;
  imageControl: AbstractControl;

  constructor(private categoryService: CategoryService,
              private productService: ProductService,
              private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder) {
    this.buildForm();
  }

  ngOnInit() {
    this.categories$ = this.categoryService.getCategories();
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.productService.getProduct(this.productId).take(1).subscribe((product: Product) => {
        this.product = product;
        this.buildForm();
      });
    }
  }

  buildForm() {
    this.myForm = this.formBuilder.group({
      title: [this.product ? this.product.title : '', Validators.required],
      price: [this.product ? this.product.price : '', [Validators.required, Validators.min(0)]],
      category: [this.productId ? this.product.category : '', Validators.required],
      imageUrl: [this.product ? this.product.imageUrl : '', Validators.required]
    });

    this.titleControl = this.myForm.controls['title'];
    this.priceControl = this.myForm.controls['price'];
    this.categoryControl = this.myForm.controls['category'];
    this.imageControl = this.myForm.controls['imageUrl'];
  }
  save(product) {
    if (this.productId) {
      this.subscription.add(this.productService.update(this.productId, product).subscribe(
        resp => this.router.navigate(['/admin/products']),
        err => {
          console.log('update product failed', err);
        }));
    } else {
      this.subscription.add(this.productService.create(product).subscribe(
        resp => this.router.navigate(['/admin/products']),
        err => {
          console.log('create product failed', err);
        }));
    }

  }
  delete() {
    this.subscription.add(this.productService.delete(this.productId).subscribe(
      resp => this.router.navigate(['/admin/products']),
      err => {
        console.log('delete product failed', err);
      }));
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
