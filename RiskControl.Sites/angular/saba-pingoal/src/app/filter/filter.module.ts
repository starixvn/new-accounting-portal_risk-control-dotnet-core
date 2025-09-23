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
import { ModalModule } from '../../components/modal';
import { FilterComponent } from './filter.component';
import { FilterService } from './filter.service';
import { ConfirmationModule } from 'nap-components/confirmation';
import { UserNameSuggestionModule } from './user-name-suggestion';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        DateModule,
        NumericTextboxModule,
        HttpModule.forRoot(),
        NumberFormatModule,
        LegendModule.forRoot(),
        TreeviewModule.forRoot(),
        ModalModule.forRoot(),
        DropdownTypeaheadModule,
        DropdownSelectModule,
        ConfirmationModule.forRoot(),
        UserNameSuggestionModule
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
export class FilterModule {
    constructor(
        private readonly legendService: LegendService
    ) {
        legendService.resolveUrl = (id) => {
            return `https://reports.oneops.net/Reports-Legend-API/api/legend/${id}`;
        };
    }
}
