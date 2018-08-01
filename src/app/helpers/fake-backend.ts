import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/materialize';
import 'rxjs/add/operator/dematerialize';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // array in local storage for registered users
    const products: any[] = JSON.parse(localStorage.getItem('products')) || [];
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik51Y2xldXMgQWRtaW4iLCJhZG1pbiI6dHJ1ZX0.X29IhaRyXvJh6821XMTIwiBwBrUO39ei5vrL_HqI9kk';
    const productsLength = JSON.parse(localStorage.getItem('products')) || []

    // wrap in delayed observable to simulate server api call
    return Observable.of(null).mergeMap(() => {

        // authenticate
        if (request.url.endsWith('/api/authenticate') && request.method !== 'GET') {
          const body = JSON.parse(request.body);
          if (body.email === 'nucleus@global.com' && body.password === '1234') {
            return Observable.of(new HttpResponse({ status: 200, body: { token: token } }));
          } else {
            return Observable.throw('Username or password is incorrect');
          }
        }
        if (request.url.endsWith('api/categories') && request.method === 'GET') {
          const categories = [
            {
              name: "Bread",
              value: "bread"
            },
            {
              name: "Dairy",
              value: "dairy"
            },
            {
              name: "Fruits",
              value: "fruits"
            },
            {
              name: "Seasonings and Spices",
              value: "seasonings"
            },
            {
              name: "Vegetables",
              value: "vegetables"
            }
          ];
          return Observable.of(new HttpResponse({ status: 200, body: { categories } }));

        }
        // add products
        if (request.url.endsWith('api/products') && request.method === 'POST') {
          if (request.headers.get('Authorization') === 'Bearer ' + token) {
            const product = request.body;
            product.id =  Math.floor(Math.random() * 6500 + 1);
            products.push(product);

            localStorage.setItem('products', JSON.stringify(products));
            return Observable.of(new HttpResponse({status: 200}));
          } else {
            // return 401 not authorised if token is null or invalid
            return Observable.throw('Unauthorised');
          }
        }
        // get products
        if (request.url.endsWith('api/products') && request.method === 'GET') {
          return Observable.of(new HttpResponse({ status: 200, body: products }));
        }
        // get product by id
        if (request.url.match(/\/api\/products\/\d+$/) && request.method === 'GET') {
          if (request.headers.get('Authorization') === 'Bearer ' + token) {
            // find user by id in users array
            const urlParts = request.url.split('/');
            const id = parseInt(urlParts[urlParts.length - 1]);
            const matchedProducts = products.filter(elem =>  elem.id === id);
            const product = matchedProducts.length ? matchedProducts[0] : null;

            return Observable.of(new HttpResponse({ status: 200, body: product }));
          } else {
            // return 401 not authorised if token is null or invalid
            return Observable.throw('Unauthorised');
          }
        }
        // update product
        if (request.url.match(/\/api\/products\/\d+$/) && request.method === 'PUT') {
          if (request.headers.get('Authorization') === 'Bearer ' + token) {
            // find user by id in users array
            const newProduct = request.body;
            const urlParts = request.url.split('/');
            const id = parseInt(urlParts[urlParts.length - 1]);
            for ( let i in products) {
              if (products[i].id === id) {
                products[i] = newProduct;
                products[i].id = id;
                break;
              }
            }
            localStorage.setItem('products', JSON.stringify(products));
            return Observable.of(new HttpResponse({ status: 200, body: newProduct }));
          } else {
            // return 401 not authorised if token is null or invalid
            return Observable.throw('Unauthorised');
          }
        }
        // delete product
        if (request.url.match(/\/api\/products\/\d+$/) && request.method === 'DELETE') {
          // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
          if (request.headers.get('Authorization') === 'Bearer ' + token) {
            // find user by id in users array
            const urlParts = request.url.split('/');
            const id = parseInt(urlParts[urlParts.length - 1], 10);
            for ( let i in products) {

              if (products[i].id === id) {
                // delete user
                products.splice(parseInt(i, 10), 1);
                localStorage.setItem('products', JSON.stringify(products));
                break;
              }
            }

            // respond 200 OK
            return Observable.of(new HttpResponse({ status: 200 }));
          } else {
            // return 401 not authorised if token is null or invalid
            return Observable.throw('Unauthorised');
          }
        }
        // pass through any requests not handled above
        return next.handle(request);

      })

      // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .materialize()
      .delay(500)
      .dematerialize();
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
