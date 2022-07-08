import { Injectable, NgZone } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { BackgroundGeolocation,
  BackgroundGeolocationEvents,
  BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GlobalConstants } from '../common/global-constants';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings/ngx';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LocationTrackerService {

  public watch: any;
  public lat = 0;
  public lng = 0;

  // activateLocRights  = { key : "activateLocRights", value : ""};
  rightsMsg  = { key : "rightsMsg", value : ""};
  // okBtn  = { key : "okBtn", value : ""};
  // cancel  = { key : "cancel", value : ""};
  tabOfVars = [ this.rightsMsg];

  constructor(
    public zone: NgZone,
    public geolocation: Geolocation,
    public backgroundGeolocation: BackgroundGeolocation,
    public openNativeSettings: OpenNativeSettings,
    public alertCtrl: AlertController,
    public _translate: TranslateService
  ) { 
    this._translateLanguage();
  }

  askToTurnOnGPS() {
    return this.backgroundGeolocation.checkStatus();
  }

  _translateLanguage(): void {
    this._translate.use(GlobalConstants.getLanguageSelected());
    for(const elem of this.tabOfVars){
      this._translate.get(elem.key).subscribe( res => {
        elem.value = res;
      })
    }
  }

  startTracking() {
    console.log('start tracking');
    const config = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 20,
      debug: false,
      enableHighAccuracy : true,
      stopOnTerminate: true, // enable this to clear background location settings when the app terminates
      interval: 1000,
      startOnBoot: true,
      pauseLocationUpdates : true,
    };

    this.backgroundGeolocation.configure(config).then(() => {
      this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.location)
        .subscribe((location: BackgroundGeolocationResponse) => {
          console.log('>> Longitude : ' + location.longitude);
          console.log('>> Latitude : ' + location.latitude);
          this.zone.run(() => {
            this.lat = location.latitude;
            this.lng = location.longitude;
          });
          this.backgroundGeolocation.finish(); // FOR IOS ONLY
        });
    });

    this.backgroundGeolocation.start();

    this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.authorization)
        .subscribe(async (auth: BackgroundGeolocationResponse) => {
          console.log("Auth for GeoLocation has changed : "+auth);
          if(auth as unknown == 0){
            var showSettings = confirm(this.rightsMsg.value);
            if (showSettings) {
              return this.openNativeSettings.open("application_details");
            }
          }
    });

    //In order to not show up the notification when app is in background
    this.backgroundGeolocation
    .on(BackgroundGeolocationEvents.background)
    .subscribe((background: BackgroundGeolocationResponse) => {
      console.log("APP is now in background, stoping the tracking");
      this.backgroundGeolocation.stop();
      //Checking Updates of trad files every 24h if app stays in background
      // console.log("Time elapsed (in sec) since last update : "+GlobalConstants.getElapsedSeconds());
      // if(GlobalConstants.getElapsedSeconds() >= 86400){
      //   console.log("24h since last update, reloading the app to check updates on server (trad files)");
      //   window.location.reload();
      //   SplashScreen.show();
      // }
    });

    this.backgroundGeolocation
    .on(BackgroundGeolocationEvents.foreground)
    .subscribe((background: BackgroundGeolocationResponse) => {
      console.log("APP is now in foreground, starting the tracking");
      this.backgroundGeolocation.start();
    });

    // If you wish to turn OFF background-tracking, call the #stop method.
    //this.backgroundGeolocation.stop();

    const options = {
      frequency: 2000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options)
    .subscribe((data) => {

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = data.coords.latitude;
        this.lng = data.coords.longitude;
      });

    });
  }

  getLongitude() {
    return this.lng;
  }

  getLatitude() {
    return this.lat;
  }

  stopTracking() {
    this.lng = null;
    this.lat = null;
    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();
  }

}
