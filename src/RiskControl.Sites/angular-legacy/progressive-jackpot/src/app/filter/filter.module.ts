import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from 'nap-components/http';
import { DropdownSelectModule } from 'nap-components/dropdown-select';
import { FilterComponent } from './filter.component';
import { FilterService } from './filter.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule.forRoot(),
    DropdownSelectModule
  ],
  declarations: [
    FilterComponent
  ],
  providers: [
    FilterService
  ],
  exports: [
    FilterComponent
  ]
})
export class FilterModule { }
