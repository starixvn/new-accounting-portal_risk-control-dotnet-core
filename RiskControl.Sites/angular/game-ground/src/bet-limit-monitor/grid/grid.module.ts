import { NgModule, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpModule } from 'nap-components/http';
import { NumberFormatModule } from 'nap-components/number-format';
import { BreadcrumbModule } from 'nap-components/breadcrumb';
import { PaginationModule, PaginationConfig } from 'nap-components/pagination';
import { GridComponent } from './grid.component';

@Injectable()
export class CustomPaginationConfig extends PaginationConfig {
    pageSizes = [50, 100, 200, 300, 500];
    itemsPerPage = 50;
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule.forRoot(),
        BreadcrumbModule,
        NgxPaginationModule,
        NumberFormatModule,
        PaginationModule.forRoot()
    ],
    declarations: [
        GridComponent
    ],
    exports: [
        GridComponent
    ],
    providers: [
        { provide: PaginationConfig, useClass: CustomPaginationConfig }
    ]
})
export class GridModule { }
