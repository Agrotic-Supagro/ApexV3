import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StadePhenologiquePage } from './stade-phenologique.page';

const routes: Routes = [
  {
    path: '',
    component: StadePhenologiquePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StadePhenologiquePageRoutingModule {}
