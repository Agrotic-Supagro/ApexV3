import { ParcelleApexPageModule } from './parcelle-apex/parcelle-apex.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { ParcelleInputPageModule } from '../app/parcelle-input/parcelle-input.module';
import { ParcelleInfoPageModule } from './parcelle-info/parcelle-info.module';
import { SessionInfoPageModule } from './session-info/session-info.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    ParcelleInputPageModule,
    ParcelleApexPageModule,
    ParcelleInfoPageModule,
    SessionInfoPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    Vibration,
    Geolocation,
    BackgroundGeolocation,
    EmailComposer,
    Device,
    ScreenOrientation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
