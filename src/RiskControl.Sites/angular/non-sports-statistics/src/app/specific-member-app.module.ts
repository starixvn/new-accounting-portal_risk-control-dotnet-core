import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import * as moment from 'moment';
import { SpinnerModule } from 'nap-components/spinner';
import { ToastModule } from 'nap-components/toast';
import { HttpModule as NapHttpModule } from 'nap-components/http';
import { NavbarModule, NavbarService } from 'nap-components/navbar';
import { AuthenticationModule } from 'nap-components/authentication';
import { ModalModule } from 'components/modal';
import { AppService } from './app.service';
import { FilterModule } from './filter';
import { ModeModule } from './modes/mode.module';
import { SpecificMemberAppComponent } from './specific-member-app.component';
import { initConfiguration } from './app.module';

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
        SpecificMemberAppComponent
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
    bootstrap: [SpecificMemberAppComponent]
})
export class SpecificMemberAppModule {
    constructor(private readonly navbarService: NavbarService) {
        navbarService.url = 'state-api/application/header';
        navbarService.userMenus = [
            {
                name: 'Change Password',
                link: 'UserInfo/ChangePassword'
            },
            {
                name: 'Sign Out',
                link: 'UserLogin/Login/LogOut'
            }
        ];
    }
}
