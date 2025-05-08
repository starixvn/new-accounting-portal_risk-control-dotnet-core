import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from 'nap-components/http';
import { ToastModule } from 'nap-components/toast';
import { FilterComponent } from './filter.component';
import { TreeviewModule } from 'ngx-treeview';
import { SiteTreeviewPipe } from '../../common/filter/site-treeview.pipe';
import { SelectDropDownModule } from '../../common/filterable-select';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule.forRoot(),
        ToastModule.forRoot(),
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
