import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
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
import { StadePhenologiquePageModule } from './stade-phenologique/stade-phenologique.module';
// import { ParcelleInfoPageModule } from './parcelle-info/parcelle-info.module';
import { SessionInfoPageModule } from './session-info/session-info.module';
import { ApexInformationComponent } from './apex-information/apex-information.component';
import { CommentairesSessionPageModule } from './commentaires-session/commentaires-session.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FTP } from '@awesome-cordova-plugins/ftp/ngx';
import { GlobalConstants } from './common/global-constants';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FtpServerService } from './services/ftp-server.service';
import { DeviceService } from './services/device.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings/ngx';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, GlobalConstants.getPathForHttpLoader(), ".json");
}

export function initTradContent(ftpServerService: FtpServerService) {
  var file = new File();
  var deviceService : DeviceService = new DeviceService(file);
  var nativeStorage : NativeStorage = new NativeStorage();

  return () => nativeStorage.getItem('languageSelected')
    .then(data => {
      console.log("Users changed the language, using this one : "+data);
      return ftpServerService.downloadTradContent(data)
      .then(() => {
      })
      .catch(async error => {
        console.log("Error during download of trad content "+error);
        if (GlobalConstants.getTradFilesNeverDownloaded()) {
          console.log("Trad files have never been downloaded, using local trad content");
          //Local path for trad files
          GlobalConstants.setPathForHttpLoader("/assets/i18n/");
          //Local path for coutry icons 
          GlobalConstants.setPathForCountryIcons("/assets/imgs/");
          //Local supported Languages
          GlobalConstants.resetSupportedLanguages();
          GlobalConstants.setSupportedLanguages("Français", "fr");
          GlobalConstants.setSupportedLanguages("English", "en");
          if(data == "fr"){
            GlobalConstants.setLanguageSelected("fr");
          }
          else{
            GlobalConstants.setLanguageSelected("en");
          }
        }
      })
    },
    error => {
      console.log("Users didn't changed the language, using device\'s one");
      return deviceService.getDeviceLanguage()
      .then( async devLang => {
        console.log("langage du device : "+devLang);
        return ftpServerService.downloadTradContent(devLang)
        .then(() => {
        })
        .catch(async error => {
          console.log("Error during download of trad content "+error);
          if (GlobalConstants.getTradFilesNeverDownloaded()) {
            console.log("Trad files have never been downloaded, using local trad content");
            //Local path for trad files
            GlobalConstants.setPathForHttpLoader("/assets/i18n/");
            //Local path for coutry icons 
            GlobalConstants.setPathForCountryIcons("/assets/imgs/");
            //Local supported Languages
            GlobalConstants.resetSupportedLanguages();
            GlobalConstants.setSupportedLanguages("Français", "fr");
            GlobalConstants.setSupportedLanguages("English", "en");
            if(devLang == "fr"){
              GlobalConstants.setLanguageSelected("fr");
            }
            else{
              GlobalConstants.setLanguageSelected("en");
            }
          }
        })
      })
    })
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
    OpenNativeSettings,
    File,
    FTP,
    StatusBar,
    SQLite,
    Vibration,
    Geolocation,
    BackgroundGeolocation,
    EmailComposer,
    Device,
    ScreenOrientation,
    NativeStorage,
    Network,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FtpServerService,
    {
      provide: APP_INITIALIZER,
      useFactory: initTradContent,
      deps: [FtpServerService],
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}


