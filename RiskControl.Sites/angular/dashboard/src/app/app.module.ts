
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import * as moment from 'moment';
import { HttpModule } from 'nap-components/http';
import { DateModule } from 'nap-components/date';
import { ChartsModule } from 'nap-components/chart';
import { LegendModule, LegendService } from 'nap-components/legend';
import { NumberFormatModule } from 'nap-components/number-format';
import { NavbarModule, NavbarService } from 'nap-components/navbar';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { ReportDate, DATE_CONFIG } from './date.config';
import { SpinnerModule } from 'nap-components/spinner';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule.forRoot(),
    NavbarModule.forRoot(),
    SpinnerModule.forRoot(),
    LegendModule.forRoot(),
    DateModule,
    ChartsModule,
    NumberFormatModule
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
  constructor(private readonly navbarService: NavbarService,
              private readonly legendService: LegendService) {
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

    legendService.resolveUrl = (id) => {
      return `https://reports.oneops.net/Reports-Legend-API/api/legend/${id}`;
    };
  }
}

// tslint:disable-next-line: ban-types
export function initConfiguration(service: AppService): Function {
  return () => new Promise(resolve => {
    service.getBalanceup().subscribe(model => {
      const today = moment.utc(model.today);
      const balanceUpDate = moment.utc(model.balanceUpRange.balanceUpDay);
      DATE_CONFIG.reportDate = new ReportDate(today, balanceUpDate);
      resolve(true);
    });
  });
}

