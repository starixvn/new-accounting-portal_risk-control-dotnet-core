import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { HttpModule } from 'nap-components/http';
import { DateModule } from 'nap-components/date';
import { DropdownSelectModule } from 'nap-components/dropdown-select';
import { DropdownTypeaheadModule } from 'nap-components/dropdown-typeahead';
import { DropdownTreeviewSelectModule } from 'nap-components/dropdown-treeview-select';
import { FilterComponent } from './filter.component';
import { SiteTreeviewPipe } from '../../common/filter/site-treeview.pipe';
import { SelectDropDownModule } from '../../common/filterable-select';
import { MemberWlAnalysisReportModule } from '../member-wl-analysis-report/member-wl-analysis-report.module';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule.forRoot(),
        DateModule,
        TreeviewModule,
        DropdownTreeviewSelectModule,
        DropdownTypeaheadModule,
        DropdownSelectModule,
        MemberWlAnalysisReportModule,
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
