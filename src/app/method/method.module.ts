import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MethodPageRoutingModule } from './method-routing.module';

import { MethodPage } from './method.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MethodPageRoutingModule
  ],
  declarations: [MethodPage]
})
export class MethodPageModule {}
