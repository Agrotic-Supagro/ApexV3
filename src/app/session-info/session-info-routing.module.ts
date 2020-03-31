import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SessionInfoPage } from './session-info.page';

const routes: Routes = [
  {
    path: '',
    component: SessionInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionInfoPageRoutingModule {}
