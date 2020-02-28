import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParcelleInfoPage } from './parcelle-info.page';

const routes: Routes = [
  {
    path: '',
    component: ParcelleInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParcelleInfoPageRoutingModule {}
