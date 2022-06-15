import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Capacitor } from '@capacitor/core';
import { GlobalConstants } from '../common/global-constants';

import { File } from '@awesome-cordova-plugins/file/ngx';

export function HttpLoaderFactory(http: HttpClient) {

  var file = new File();
  console.log("Capacitor conversion : "+Capacitor.convertFileSrc(GlobalConstants.getDevicePATH()));
  console.log("Capacitor conversionbis : "+Capacitor.convertFileSrc(file.dataDirectory));

  return new TranslateHttpLoader(http, Capacitor.convertFileSrc(GlobalConstants.getDevicePATH()), ".json");
}



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
