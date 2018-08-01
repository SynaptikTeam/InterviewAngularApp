import { Injectable } from '@angular/core';
import {Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuard {

  constructor(private auth: AuthService,
              private router: Router) { }

  canActivate(route, state: RouterStateSnapshot) {
    return this.auth.currentUser$.map(user => {
      if (user) {
        return true;
      } else {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
      }
    });
  }
}
