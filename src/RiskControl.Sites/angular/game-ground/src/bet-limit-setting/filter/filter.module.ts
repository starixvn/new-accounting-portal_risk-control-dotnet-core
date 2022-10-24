import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { HttpModule } from 'nap-components/http';
import { DropdownSelectModule } from 'nap-components/dropdown-select';
import { DropdownTypeaheadModule } from 'nap-components/dropdown-typeahead';
import { DropdownTreeviewSelectModule } from 'nap-components/dropdown-treeview-select';
import { FilterComponent } from './filter.component';
import { CommonFilterModule } from 'common/common-filter.module';
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule.forRoot(),
    TreeviewModule,
    DropdownTreeviewSelectModule,
    DropdownTypeaheadModule,
    DropdownSelectModule,
    CommonFilterModule
  ],
  declarations: [FilterComponent],
  exports: [FilterComponent]
})
export class FilterModule {}
