import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpModule } from 'nap-components/http';
import { ModalModule } from 'components/modal';
import { GridModule } from 'components/grid';
import { DeviceComponent } from './device.component';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        HttpModule.forRoot(),
        ModalModule.forRoot(),
        GridModule
    ],
    exports: [
        DeviceComponent
    ],
    declarations: [
        DeviceComponent
    ],
    entryComponents: [
        DeviceComponent
    ],
    providers: []
})
export class DeviceModule { }
