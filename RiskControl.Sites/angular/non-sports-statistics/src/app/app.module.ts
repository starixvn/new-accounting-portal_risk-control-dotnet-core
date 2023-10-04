import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import * as moment from 'moment';
import { SpinnerModule } from 'nap-components/spinner';
import { ToastModule } from 'nap-components/toast';
import { HttpModule as NapHttpModule } from 'nap-components/http';
import { NavbarModule, NavbarService } from 'nap-components/navbar';
import { AuthenticationModule } from 'nap-components/authentication';
import { ModalModule } from 'components/modal';
import { DATE_CONFIG, ReportDate } from './common';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { FilterModule } from './filter';
import { ModeModule } from './modes/mode.module';

@NgModule({
    imports: [
        BrowserModule,
        NapHttpModule.forRoot(),
        SpinnerModule.forRoot(),
        ToastModule.forRoot(),
        NavbarModule.forRoot(),
        ModalModule.forRoot(),
        AuthenticationModule,
        FilterModule,
        ModeModule
    ],
    declarations: [
        AppComponent
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
            const moveBetDate = moment.utc(model.balanceUpRange.moveBetsDay);
            DATE_CONFIG.reportDate = new ReportDate(today, balanceUpDate, moveBetDate);
            resolve(true);
        });
    });
}
