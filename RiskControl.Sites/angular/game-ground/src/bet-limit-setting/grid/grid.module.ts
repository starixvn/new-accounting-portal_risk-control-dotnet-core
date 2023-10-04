import { NgModule, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from 'nap-components/http';
import { NumberFormatModule } from 'nap-components/number-format';
import { BreadcrumbModule } from 'nap-components/breadcrumb';
import { ConfirmationModule } from 'nap-components/confirmation';
import { NoteModule } from 'nap-components/note';
import { GridComponent } from './grid.component';
import { NumericTextboxModule } from 'nap-components/numeric-textbox';
@Injectable()
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule.forRoot(),
    BreadcrumbModule,
    ConfirmationModule.forRoot(),
    NumberFormatModule,
    NoteModule,
    NumericTextboxModule
  ],
  declarations: [GridComponent],
  exports: [GridComponent],
  providers: []
})
export class GridModule {}
