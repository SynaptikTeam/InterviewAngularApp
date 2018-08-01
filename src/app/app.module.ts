import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import {ServiceWorkerModule} from '@angular/service-worker';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CustomFormsModule} from 'ng2-validation';
import {environment} from '../environments/environment';
import {AdminOrdersComponent} from './admin/components/admin-orders/admin-orders.component';
import {AdminProductsComponent} from './admin/components/admin-products/admin-products.component';
import {HomeComponent} from './core/components/home/home.component';
import {LoginComponent} from './core/components/login/login.component';
import {BsNavbarComponent} from './core/components/navbar/bs-navbar.component';
import { AppComponent } from './app.component';
import {fakeBackendProvider, JwtInterceptor} from './helpers/index';
import {AuthGuard} from './services/auth-guard.service';
import {AuthService} from './services/auth.service';
import {CategoryService} from './services/category.service';
import {ProductService} from './services/product.service';
import {CheckoutComponent} from './shopping/components/checkout/checkout.component';
import {MyOrdersComponent} from './shopping/components/my-orders/my-orders.component';
import {OrderSuccessComponent} from './shopping/components/order-success/order-success.component';
import {ProductCardComponent} from './shopping/components/product-card/product-card.component';
import {ProductsComponent} from './shopping/components/products/products.component';
import {ShoppingCartComponent} from './shopping/components/shopping-cart/shopping-cart.component';
import { ProductFormComponent } from './admin/components/product-form/product-form.component';


@NgModule({
  declarations: [
    AppComponent,
    AppComponent,
    BsNavbarComponent,
    HomeComponent,
    ProductsComponent,
    ShoppingCartComponent,
    CheckoutComponent,
    OrderSuccessComponent,
    MyOrdersComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    LoginComponent,
    ProductFormComponent,
    ProductCardComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path: '', component: ProductsComponent},
      {path: 'products', component: ProductsComponent},
      {path: 'shopping-cart', component: ShoppingCartComponent},
      {path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard]},
      {path: 'order-success', component: OrderSuccessComponent, canActivate: [AuthGuard]},
      {path: 'login', component: LoginComponent},
      {path: 'admin/products/new', component: ProductFormComponent, canActivate: [AuthGuard]},
      {path: 'admin/products/:id', component: ProductFormComponent, canActivate: [AuthGuard]},
      {path: 'admin/products', component: AdminProductsComponent, canActivate: [AuthGuard]},
      {path: 'admin/orders', component: AdminOrdersComponent, canActivate: [AuthGuard]},
      {path: 'my/orders', component: MyOrdersComponent, canActivate: [AuthGuard]},
    ]),
    NgbModule.forRoot(),
    FormsModule,
    HttpClientModule,
    CustomFormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    fakeBackendProvider,
    AuthGuard,
    CategoryService,
    ProductService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
