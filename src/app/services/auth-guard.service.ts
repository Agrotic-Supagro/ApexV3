import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Storage } from '@ionic/storage';

const TOKEN_KEY = 'TOKEN_KEY';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private  storage: Storage) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    this.storage.get(TOKEN_KEY).then(val => {
      if (val != null) {
        return true;
      } else {
        this.router.navigate(['login']);
        return false;
      }}, err => {
      console.log('Storage error : ', err);
      });
    return true;
  }
}
