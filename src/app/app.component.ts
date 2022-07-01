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

  //Trad var
  warning : string = "";
  message : string = "";
  okBtn : string = "";
    
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
    SplashScreen.hide();
    //Count the seconds since app launched
    //var counter = setInterval(this.incrementTime, 1000);
  }

  incrementTime(){
    GlobalConstants.incrementElapsedSeconds();
  }

  _translateLanguage(): void {
    this._translate.use(GlobalConstants.getLanguageSelected());
    this._translate.get('warning').subscribe( res => {
      this.warning = res;
    })
    this._translate.get('languagesMsg').subscribe( res => {
      this.message = res;
    })
    this._translate.get('okBtn').subscribe( res => {
      this.okBtn = res;
      this.checkTradFiles();
    })
  }

  async checkTradFiles(){
    if(GlobalConstants.getTradFilesNeverDownloaded()){
      const alert = await this.alertCtrl.create({
        header: this.warning,
        message: this.message,
        buttons: [this.okBtn]
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
        title : "home",
        url   : '/home',
        icon  : 'home'
      },
      {
        title : "apexMethd",
        url   : '/method',
        icon  : 'leaf'
      },
      {
        title : "tutoApex",
        url   : '/tutorial',
        icon  : 'library'
      },
      {
        title : "account",
        url   : '/account',
        icon  : 'person'
      },
      {
        title : "contact",
        url   : '/contact',
        icon  : 'mail'
      },
      {
        title : "about",
        url   : '/about',
        icon  : 'information-circle'
      }
    ];
  }
}
