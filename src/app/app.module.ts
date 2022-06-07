import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Network } from '@ionic-native/network/ngx';

import { ParcelleApexPageModule } from './parcelle-apex/parcelle-apex.module';
import { StadePhenologiquePageModule } from './stade-phenologique/stade-phenologique.module';
import { ParcelleInputPageModule } from '../app/parcelle-input/parcelle-input.module';
// import { ParcelleInfoPageModule } from './parcelle-info/parcelle-info.module';
import { SessionInfoPageModule } from './session-info/session-info.module';
import { ApexInformationComponent } from './apex-information/apex-information.component';
import { CommentairesSessionPageModule } from './commentaires-session/commentaires-session.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FTP } from '@awesome-cordova-plugins/ftp/ngx';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent, ApexInformationComponent],
  entryComponents: [ApexInformationComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    // ParcelleInputPageModule,
    // ParcelleApexPageModule,
    StadePhenologiquePageModule,
    CommentairesSessionPageModule,
    SessionInfoPageModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    FTP,
    StatusBar,
    SplashScreen,
    SQLite,
    Vibration,
    Geolocation,
    BackgroundGeolocation,
    EmailComposer,
    Device,
    ScreenOrientation,
    Network,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}


