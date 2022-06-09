import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { LocationTrackerService } from './services/location-tracker.service';
import { FtpServerService } from './services/ftp-server.service';
import { GlobalConstants } from './common/global-constants';
import { File } from '@awesome-cordova-plugins/file/ngx';


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
    private statusBar: StatusBar,
    private locationTracker: LocationTrackerService,
    private screenOrientation: ScreenOrientation,
    private ftpService : FtpServerService,
    private file : File,
  ) {
    this.sideMenu();
    this.initializeApp();
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.locationTracker.startTracking();
      this.splashScreen.hide();
      this.initFTP();
      console.log("External root directory :"+this.file.externalRootDirectory);
      console.log("App root directory :"+this.file.dataDirectory);
    });
  }

  initFTP(){
    this.ftpService.connectToServer(GlobalConstants.getHost(),GlobalConstants.getUsername(), GlobalConstants.getPassword())
    .then( () => this.ftpService.downloadTradFile(this.file.dataDirectory+GlobalConstants.getFrPATH(), GlobalConstants.getFrDistPATH()))
    .then( () => this.ftpService.downloadTradFile(this.file.dataDirectory+GlobalConstants.getEnPATH(), GlobalConstants.getEnDistPATH()))
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
