import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from 'nap-components/http';
import { DropdownTreeviewSelectModule } from 'nap-components/dropdown-treeview-select';
import { DropdownTypeaheadModule } from 'nap-components/dropdown-typeahead';
import { FilterComponent } from './filter.component';
import { SiteTreeviewPipe } from '../../common/filter/site-treeview.pipe';
import { SelectDropDownModule } from '../../common/filterable-select';
import { TreeviewModule } from 'ngx-treeview';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule.forRoot(),
        DropdownTreeviewSelectModule,
        DropdownTypeaheadModule,
        TreeviewModule.forRoot(),
        SelectDropDownModule
    ],
    declarations: [
        FilterComponent,
        SiteTreeviewPipe
    ],
    exports: [
        FilterComponent
    ]
})
export class FilterModule { }
