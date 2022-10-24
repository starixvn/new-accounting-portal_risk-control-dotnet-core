import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { NumericTextboxModule } from 'nap-components/numeric-textbox';
import { DropdownTypeaheadModule } from 'nap-components/dropdown-typeahead';
import { DropdownSelectModule } from 'nap-components/dropdown-select';
import { HttpModule } from 'nap-components/http';
import { DateModule } from 'nap-components/date';
import { NumberFormatModule } from 'nap-components/number-format';
import { LegendModule, LegendService } from 'nap-components/legend';
import { ModalModule } from 'components/modal';
import { FilterComponent } from './filter.component';
import { FilterService } from './filter.service';
import { ExcludeTestPipe } from './exclude-test.pipe';
import { ExcludeTest2Pipe } from './exclude-test2.pipe';
import { ProductTreeviewPipe } from './product-treeview.pipe';
import { GametypeTreeviewPipe } from './gametype-treeview.pipe';
import { DeviceTreeviewPipe } from './device-treeview.pipe';
import { UserNameSuggestionModule } from './user-name-suggestion';
import { SpecificMemberFilterComponent } from './specific-member-filter.component';
import { SiteTreeviewPipe } from './site-treeview.pipe';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        DateModule,
        NumericTextboxModule,
        HttpModule.forRoot(),
        NumberFormatModule,
        LegendModule.forRoot(),
        UserNameSuggestionModule,
        TreeviewModule.forRoot(),
        ModalModule.forRoot(),
        DropdownTypeaheadModule,
        DropdownSelectModule
    ],
    declarations: [
        FilterComponent,
        SpecificMemberFilterComponent,
        ExcludeTestPipe,
        ExcludeTest2Pipe,
        ProductTreeviewPipe,
        GametypeTreeviewPipe,
        DeviceTreeviewPipe,
        SiteTreeviewPipe
    ],
    providers: [
        FilterService
    ],
    exports: [
        FilterComponent, SpecificMemberFilterComponent
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
