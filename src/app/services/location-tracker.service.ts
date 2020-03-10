import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation,
  BackgroundGeolocationEvents,
  BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';

@Injectable({
  providedIn: 'root'
})
export class LocationTrackerService {

  public watch: any;
  public lat = 0;
  public lng = 0;

  constructor(
    public zone: NgZone,
    public backgroundGeolocation: BackgroundGeolocation
  ) { }

  startTracking() {
    const config = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 20,
      debug: false,
      enableHighAccuracy : true,
      stopOnTerminate: false, // enable this to clear background location settings when the app terminates
      interval: 2000
    };

    this.backgroundGeolocation.configure(config).then(() => {
      this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.location)
        .subscribe((location: BackgroundGeolocationResponse) => {
          console.log(location.latitude);
          this.zone.run(() => {
            this.lat = location.latitude;
            this.lng = location.longitude;
          });

          // this.backgroundGeolocation.finish(); // FOR IOS ONLY
        });
    });

    this.backgroundGeolocation.start();

    /*const options = {
      frequency: 2000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });

    });*/
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
