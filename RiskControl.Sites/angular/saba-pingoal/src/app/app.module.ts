import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FilterModule } from './filter/filter.module';
import * as moment from 'moment';
import { DATE_CONFIG, ReportDate } from './common';
import { AppService } from './app.service';
import { NavbarModule, NavbarService } from 'nap-components/navbar';
import { SpinnerModule } from 'nap-components/spinner';
import { ModalModule } from '../components/modal';
import { ToastModule } from 'nap-components/toast';
import { AuthenticationModule } from 'nap-components/authentication';
import { HttpModule } from 'nap-components/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FilterModule,
    HttpModule.forRoot(),
    SpinnerModule.forRoot(),
    ToastModule.forRoot(),
    NavbarModule.forRoot(),
    ModalModule.forRoot(),
    AuthenticationModule
  ],
  providers: [
    AppService,
        {
            provide: APP_INITIALIZER,
            useFactory: initConfiguration,
            deps: [AppService],
            multi: true
        }
  ],
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

export function initConfiguration(service: AppService): Function {
  return () => new Promise(resolve => {
      service.getBalanceup().subscribe((model: { today: moment.MomentInput | undefined; balanceUpRange: { balanceUpDay: moment.MomentInput | undefined; moveBetsDay: moment.MomentInput | undefined; }; }) => {
          const today = moment.utc(model.today);
          const balanceUpDate = moment.utc(model.balanceUpRange.balanceUpDay);
          const moveBetDate = moment.utc(model.balanceUpRange.moveBetsDay);
          DATE_CONFIG.reportDate = new ReportDate(today, balanceUpDate, moveBetDate);
          resolve(true);
      });
  });
}
