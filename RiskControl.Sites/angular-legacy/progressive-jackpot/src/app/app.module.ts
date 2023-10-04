import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from 'nap-components/http';
import { NavbarModule, NavbarService } from 'nap-components/navbar';
import { ToastModule } from 'nap-components/toast';
import { SpinnerModule } from 'nap-components/spinner';
import { FilterModule } from './filter';
import { GridModule } from './grid';
import { AppComponent } from './app.component';
import { CustomNavbarService } from './custom-navbar.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CommonModule,
    HttpModule.forRoot(),
    NavbarModule.forRoot(),
    ToastModule.forRoot(),
    SpinnerModule.forRoot(),
    FilterModule,
    GridModule
  ],
  providers: [
    { provide: NavbarService, useClass: CustomNavbarService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
