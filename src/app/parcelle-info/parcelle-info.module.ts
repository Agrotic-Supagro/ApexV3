import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';

import { IonicModule } from '@ionic/angular';

import { ParcelleInfoPageRoutingModule } from './parcelle-info-routing.module';

import { ParcelleInfoPage } from './parcelle-info.page';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { GlobalConstants } from '../common/global-constants';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, GlobalConstants.getPathForHttpLoader(), ".json");
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    IonicModule,
    ParcelleInfoPageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [ParcelleInfoPage]
})
export class ParcelleInfoPageModule {}
