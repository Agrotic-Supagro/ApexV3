import { User } from './../services/user-service';
import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { DatabaseService } from '../services/database.service';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const TOKEN_KEY = 'TOKEN_KEY';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user;

  constructor(
    private plt: Platform,
    private storage: Storage,
    private auth: AuthenticationService,
    private database: DatabaseService
    ) {
    /*this.plt.ready().then(() => {
      this.storage.get(TOKEN_KEY).then(val => {
        this.database.getCurrentUser(val).then(data => {
          this.user = data;
        });
      });
    });*/
  }

  public logout() {
    this.auth.logout();
  }
}
