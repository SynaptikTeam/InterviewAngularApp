import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthService {
  currentUser$ = new BehaviorSubject<any>(0);

  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              private router: Router) {
    this.getUser();
  }
  getUser() {
    const token = localStorage.getItem('token');
    if (token) {
      const jwt = new JwtHelper();
      this.currentUser$.next(jwt.decodeToken(token));
    }
    else {
      this.currentUser$.next(null);
    }
    return this.currentUser$;
  }
  login(credentials) {
    return this.http.post('/api/authenticate', JSON.stringify(credentials))
      .map(response => {

        if (response && response['token']) {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
          localStorage.setItem('token', response['token']);
          localStorage.setItem('returnUrl', returnUrl);
          this.getUser();

          return true;
        } else  {
          return false;
        }
      });
  }

  logout() {
    localStorage.removeItem('token');
    this.getUser();
    this.router.navigate(['/']);
  }

  isLoggedIn() {
    return tokenNotExpired('token');
  }
}

