import { NgModule, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpModule } from 'nap-components/http';
import { NumberFormatModule } from 'nap-components/number-format';
import { BreadcrumbModule } from 'nap-components/breadcrumb';
import { GridComponent } from './grid.component';
import { NapDatePipe } from './date.pipe';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule.forRoot(),
    BreadcrumbModule,
    NumberFormatModule
  ],
  declarations: [
    GridComponent,
    NapDatePipe
  ],
  exports: [
    GridComponent
  ]
})
export class GridModule { }
