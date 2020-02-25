import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable, of, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { DatabaseService } from './database.service';

const TOKEN_KEY = 'TOKEN_KEY';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // AUTH_SERVER_ADDRESS = 'http://localhost:80/api';
  AUTH_SERVER_ADDRESS = 'http://www.agrotic.org/apexv3-sync';
  authenticationState = new BehaviorSubject(false);
  registerState = new BehaviorSubject(false);
  db: SQLiteObject;
  isOpen = false;

  constructor(private plt: Platform,
              private  httpClient: HttpClient,
              private  storage: Storage,
              private router: Router,
              private sqlite: SQLite,
              private database: DatabaseService
    ) {
    this.plt.ready().then(() => {
      this.isOpen = true;
      // this.createDatabaseApexV3();
      this.database.open();
    });
  }

  checkToken() {
    /* this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        this.authenticationState.next(true);
      }
    }); */
  }

  login(credentials: {email: string, mot_de_passe: string}): Observable< any > {
    return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/login.php`, credentials).pipe(
      tap(async (res: any) => {
        if (res.status) {
          await this.storage.set(TOKEN_KEY, res.jwt);
          this.authenticationState.next(true);
          const data = {
            jwt: res.jwt,
            email: credentials.email,
            mot_de_passe: credentials.mot_de_passe
          };
          this.database.updateJWT(data);
        }
      })
    );
  }

  register(registrationForm): Observable< any > {
    this.database.addUser(registrationForm);
    return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/create_user.php`, registrationForm)
    .pipe(
      tap(async (res: any) => {
        if (res.status) {
          this.registerState.next(true);
        }
      })
    );
  }

  resetPassword(data): Observable< any > {
    return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/reset_password.php`, data)
    .pipe(
      tap(async (res: any) => {
        return res;
      })
    );
  }

  logout() {
    this.storage.clear();
    this.router.navigate(['login']);
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }
}
