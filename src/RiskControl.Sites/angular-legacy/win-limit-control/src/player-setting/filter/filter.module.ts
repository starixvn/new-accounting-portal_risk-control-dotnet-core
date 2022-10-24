import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from 'nap-components/http';
import { DropdownTreeviewSelectModule } from 'nap-components/dropdown-treeview-select';
import { DropdownTypeaheadModule } from 'nap-components/dropdown-typeahead';
import { FilterComponent } from './filter.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule.forRoot(),
        DropdownTreeviewSelectModule,
        DropdownTypeaheadModule
    ],
    declarations: [
        FilterComponent
    ],
    exports: [
        FilterComponent
    ]
})
export class FilterModule { }
