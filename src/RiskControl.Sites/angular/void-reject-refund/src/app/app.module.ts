import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import * as moment from 'moment';
import { AppComponent } from './app.component';
import { FilterModule } from './filter/filter.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DateModule } from 'nap-components/date';
import { HttpModule } from 'nap-components/http';
import { SpinnerModule } from 'nap-components/spinner';
import { LegendModule } from 'nap-components/legend';
import { NavbarModule, NavbarService } from 'nap-components/navbar';
import { GridModule } from './grid/grid.module';
import { ToastModule } from 'nap-components/toast';
import { DATE_CONFIG, ReportDate } from './common/date-config';
import { AppService } from './app.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FilterModule,
    // tslint:disable-next-line: deprecation
    NgbModule,
    DateModule,
    HttpModule.forRoot(),
    NavbarModule.forRoot(),
    SpinnerModule.forRoot(),
    LegendModule.forRoot(),
    ToastModule.forRoot(),
    GridModule
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
      service.getBalanceup().subscribe(model => {
          const today = moment.utc(model.today);
          const balanceUpDate = moment.utc(model.balanceUpRange.balanceUpDay);
          DATE_CONFIG.reportDate = new ReportDate(today, balanceUpDate);
          resolve(true);
      });
  });
}
