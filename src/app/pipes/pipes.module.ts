import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatesExtraPipe } from './dates-extra.pipe';



@NgModule({
  declarations: [DatesExtraPipe],
  imports: [
    CommonModule
  ],
  exports: [DatesExtraPipe],
})
export class PipesModule { }
