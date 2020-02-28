import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParcelleApexPageRoutingModule } from './parcelle-apex-routing.module';

import { ParcelleApexPage } from './parcelle-apex.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParcelleApexPageRoutingModule
  ],
  declarations: [ParcelleApexPage]
})
export class ParcelleApexPageModule {}
