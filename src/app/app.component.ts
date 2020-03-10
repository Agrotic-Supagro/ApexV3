import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  navigate: any;
  constructor(
    private platform: Platform,
    private auth: AuthenticationService,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.sideMenu();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  public logout() {
    this.auth.logout();
  }
  sideMenu() {
    this.navigate =
    [
      {
        title : 'Accueil',
        url   : '/home',
        icon  : 'home'
      },
      {
        title : 'La méthode des apex',
        url   : '/about',
        icon  : 'leaf'
      },
      {
        title : 'Tutoriel ApeX Vigne',
        url   : '/tutorial',
        icon  : 'help-circle'
      },
      {
        title : 'Compte et données',
        url   : '/account',
        icon  : 'person'
      },
      {
        title : 'A propos',
        url   : '/contact',
        icon  : 'information-circle'
      }
    ];
  }
}
