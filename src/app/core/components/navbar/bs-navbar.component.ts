import { Component, OnInit } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.css']
})
export class BsNavbarComponent implements OnInit {
 user$: BehaviorSubject<any>;
  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.user$ = this.auth.getUser();
  }
  logout() {
    this.auth.logout();
  }
}
