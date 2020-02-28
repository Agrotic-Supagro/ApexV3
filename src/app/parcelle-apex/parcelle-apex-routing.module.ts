import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParcelleApexPage } from './parcelle-apex.page';

const routes: Routes = [
  {
    path: '',
    component: ParcelleApexPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParcelleApexPageRoutingModule {}
