import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from 'nap-components/http';
import { ModalModule } from 'components/modal';
import { GridModule } from 'components/grid';
import { ProductDetailComponent } from './product-detail.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    HttpModule.forRoot(),
    ModalModule.forRoot(),
    GridModule
  ],
  exports: [
      ProductDetailComponent
  ],
  declarations: [
    ProductDetailComponent
  ],
  entryComponents: [
    ProductDetailComponent
  ],
  providers: []
})
export class ProductDetailModule { }
