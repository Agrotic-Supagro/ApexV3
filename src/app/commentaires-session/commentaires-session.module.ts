import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommentairesSessionPageRoutingModule } from './commentaires-session-routing.module';

import { CommentairesSessionPage } from './commentaires-session.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommentairesSessionPageRoutingModule
  ],
  declarations: [CommentairesSessionPage]
})
export class CommentairesSessionPageModule {}
