import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParcelleInputPageRoutingModule } from './parcelle-input-routing.module';

import { ParcelleInputPage } from './parcelle-input.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParcelleInputPageRoutingModule
  ],
  declarations: [ParcelleInputPage]
})
export class ParcelleInputPageModule {}
