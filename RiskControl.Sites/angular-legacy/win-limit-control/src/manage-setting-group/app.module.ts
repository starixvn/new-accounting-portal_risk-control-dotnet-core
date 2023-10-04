import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from 'nap-components/http';
import { NavbarModule, NavbarService } from 'nap-components/navbar';
import { ToastModule } from 'nap-components/toast';
import { SpinnerModule } from 'nap-components/spinner';
import { AuthenticationModule } from 'nap-components/authentication';
import { AppComponent } from './app.component';
import { ConfirmationModule } from 'nap-components/confirmation';
import { CustomNavbarService } from '../common/navbar/custom-navbar.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpModule.forRoot(),
    NavbarModule.forRoot(),
    ToastModule.forRoot(),
    SpinnerModule.forRoot(),
    ConfirmationModule.forRoot(),
    AuthenticationModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    { provide: NavbarService, useClass: CustomNavbarService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
