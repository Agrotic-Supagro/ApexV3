import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SessionInfoPageRoutingModule } from './session-info-routing.module';

import { SessionInfoPage } from './session-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SessionInfoPageRoutingModule
  ],
  declarations: [SessionInfoPage]
})
export class SessionInfoPageModule {}
