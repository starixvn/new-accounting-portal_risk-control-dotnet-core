import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpModule } from 'nap-components/http';
import { ModalModule } from 'components/modal';
import { GridModule } from 'components/grid';
import { CurrencyComponent } from './currency.component';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        HttpModule.forRoot(),
        ModalModule.forRoot(),
        GridModule
    ],
    exports: [
        CurrencyComponent
    ],
    declarations: [
        CurrencyComponent
    ],
    entryComponents: [
        CurrencyComponent
    ],
    providers: []
})
export class CurrencyModule { }
