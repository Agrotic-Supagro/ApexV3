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

export function HttpLoaderFactory(http: HttpClient) {

  // if(GlobalConstants.getFirstConnection()){
  //   console.log("First connection, loading local trad files ");
  //   return new TranslateHttpLoader(http, "../../assets/i18n/", ".json");
  // } 
  // else{
    console.log("je suis la coucou");
    return new TranslateHttpLoader(http, GlobalConstants.getPathForHttpLoader(), ".json");
  // }
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
