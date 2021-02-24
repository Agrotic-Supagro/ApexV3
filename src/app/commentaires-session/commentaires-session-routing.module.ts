import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommentairesSessionPage } from './commentaires-session.page';

const routes: Routes = [
  {
    path: '',
    component: CommentairesSessionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommentairesSessionPageRoutingModule {}
