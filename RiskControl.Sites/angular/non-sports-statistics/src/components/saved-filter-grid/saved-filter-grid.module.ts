import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavedFilterGridComponent } from './saved-filter-grid.component';



@NgModule({
  declarations: [SavedFilterGridComponent],
  imports: [
    CommonModule
  ],
  exports: [
    SavedFilterGridComponent
  ]
})
export class SavedFilterGridModule { }
