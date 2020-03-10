import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { DatabaseService } from '../services/database.service';
import { Platform, MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

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
    public menuCtrl: MenuController,
    private router: Router,
    private auth: AuthenticationService,
    private database: DatabaseService
    ) {
    this.plt.ready().then(() => {
      this.storage.get('TOKEN_KEY').then(val => {
        this.database.getCurrentUser(val).then(data => {
          this.user = data;
          console.log(this.user.email);
        });
      });
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
   }
  public logout() {
    this.auth.logout();
  }
  public tuto() {
    this.router.navigateByUrl('/tutorial');
  }
  public openParcelleApex() {
    this.router.navigateByUrl('/parcelle-apex');
  }
  public openParcelleInput() {
    this.router.navigateByUrl('/parcelle-input');
  }
}
