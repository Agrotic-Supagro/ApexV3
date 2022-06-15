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
      this.downloadTradFiles()
      .then((res) => {
        console.log("downloadTradFiles() finished"+res);
      })
      .catch(error => {
        console.log("Error during downloadTradFiles() : "+error+"\n If it's device's first connection, using local trad file(s).");
      })
    });
  }

  async downloadTradFiles(){
    console.log("Entered downloadTradFiles()");
    return this.ftpService.checkOrCreateAssetsDirectories()
    .then( () => { 
      return this.ftpService.connectToServer(GlobalConstants.getHost(),GlobalConstants.getUsername(), GlobalConstants.getPassword())
    })
    .catch(error => {
      throw error;
    })
    .then( () => {
      return this.ftpService.checkUpdates(GlobalConstants.getServerPATH())
    })
    .catch(error => {
      throw error;
    })
    .then( async tab => {
      for(const element of tab) {
        if(element[1]) {
          await this.ftpService.downloadFile(GlobalConstants.getDevicePATH()+element[0], GlobalConstants.getServerPATH()+element[0])
          //a confimer? demain
          .then((res) => {
            console.log("res dl : "+res);
          })
          .catch(error => {
            throw error;
          });
        }
      }
      return "DL FINISHED";
    })
    .catch(error => {
      throw error;
    })
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
