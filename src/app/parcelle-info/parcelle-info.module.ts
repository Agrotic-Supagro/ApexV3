import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParcelleInfoPageRoutingModule } from './parcelle-info-routing.module';

import { ParcelleInfoPage } from './parcelle-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParcelleInfoPageRoutingModule
  ],
  declarations: [ParcelleInfoPage]
})
export class ParcelleInfoPageModule {}
