import { CommonFilterModule } from './../../common/common-filter.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { HttpModule } from 'nap-components/http';
import { DateModule } from 'nap-components/date';
import { DropdownSelectModule } from 'nap-components/dropdown-select';
import { DropdownTypeaheadModule } from 'nap-components/dropdown-typeahead';
import { DropdownTreeviewSelectModule } from 'nap-components/dropdown-treeview-select';
import { LegendModule, LegendService } from 'nap-components/legend';
import { FilterComponent } from './filter.component';
import { GametypeTreeviewPipe } from '../../common/filter/gametype-treeview.pipe';
import { ProductTreeviewPipe } from 'common/filter/product-treeview.pipe';
@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule.forRoot(),
        DateModule,
        LegendModule.forRoot(),
        TreeviewModule,
        DropdownTreeviewSelectModule,
        DropdownTypeaheadModule,
        DropdownSelectModule,
        CommonFilterModule
    ],
    declarations: [
        FilterComponent,
        GametypeTreeviewPipe
    ],
    exports: [
        FilterComponent
    ]
})

export class FilterModule {
    constructor(
        private readonly legendService: LegendService
    ) {
        legendService.resolveUrl = (id) => {
            return `https://reports.oneops.net/Reports-Legend-API/api/legend/${id}`;
        };
    }
}
