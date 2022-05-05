import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from 'nap-components/http';
import { NavbarModule, NavbarService } from 'nap-components/navbar';
import { ToastModule } from 'nap-components/toast';
import { SpinnerModule } from 'nap-components/spinner';
import { AuthenticationModule } from 'nap-components/authentication';
import { FilterModule } from './filter';
import { AppComponent } from './app.component';
import { GridModule } from './grid/grid.module';
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpModule.forRoot(),
    NavbarModule.forRoot(),
    ToastModule.forRoot(),
    SpinnerModule.forRoot(),
    AuthenticationModule,
    FilterModule,
    GridModule
  ],
  declarations: [AppComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private readonly navbarService: NavbarService) {
    navbarService.url = 'state-api/application/header';
    navbarService.userMenus = [
      {
        name: 'Change Password',
        link: 'Auth/ChangePassword'
      },
      {
        name: 'Sign Out',
        link: 'Auth/LogOut'
      }
    ];
  }
}
