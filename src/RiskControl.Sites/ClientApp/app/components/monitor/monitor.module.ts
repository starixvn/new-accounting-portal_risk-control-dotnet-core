import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterModule } from './filter';
import { GridModule } from './grid';
import { MonitorComponent } from './monitor.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        CommonModule,
        FilterModule,
        GridModule
    ],
    declarations: [
        MonitorComponent
    ]
})
export class MonitorModule { }
