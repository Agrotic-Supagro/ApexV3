import { Component } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { LocationTrackerService } from './services/location-tracker.service';
import { GlobalConstants } from './common/global-constants';
import { TranslateService } from '@ngx-translate/core';
import { SplashScreen } from '@capacitor/splash-screen';

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
    private statusBar: StatusBar,
    private locationTracker: LocationTrackerService,
    private screenOrientation: ScreenOrientation,
    private alertCtrl: AlertController,
    private _translate: TranslateService,

  ) {
    this.sideMenu();
    this.initializeApp();
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.locationTracker.startTracking();
    });
  }

  ngOnInit(){
    this._translateLanguage();
    this.checkTradFiles();
    SplashScreen.hide();
    //Count the seconds since app launched
    var counter = setInterval(this.incrementTime, 1000);
  }

  incrementTime(){
    GlobalConstants.incrementElapsedSeconds();
  }

  _translateLanguage(): void {
    this._translate.use(GlobalConstants.getLanguageSelected());
  }

  async checkTradFiles(){
    if(GlobalConstants.getTradFilesNeverDownloaded()){
      const alert = await this.alertCtrl.create({
        header: 'Attention',
        message: 'Pour bénéficier de tous les langages de l\'application, ' +
        'veuillez vous connecter à Internet.',
        buttons: ['OK']
      });
      await alert.present();
    }
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
        url   : '/method',
        icon  : 'leaf'
      },
      {
        title : 'Tutoriel ApeX-Vigne',
        url   : '/tutorial',
        icon  : 'library'
      },
      {
        title : 'Compte et données',
        url   : '/account',
        icon  : 'person'
      },
      {
        title : 'Contact',
        url   : '/contact',
        icon  : 'mail'
      },
      {
        title : 'A propos',
        url   : '/about',
        icon  : 'information-circle'
      }
    ];
  }
}
