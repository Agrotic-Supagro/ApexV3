import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommentairesSessionPageRoutingModule } from './commentaires-session-routing.module';

import { CommentairesSessionPage } from './commentaires-session.page';

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
    IonicModule,
    CommentairesSessionPageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [CommentairesSessionPage]
})
export class CommentairesSessionPageModule {}
