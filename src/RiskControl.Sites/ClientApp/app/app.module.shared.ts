import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { LocalStorageService } from './services/local-storage.service';
import { AuthenticationService } from './services/authentication.service';
import { TokenInterceptor } from './services/token-interceptor';
import { AuthGuard } from './guards/auth.guard';

import { AppComponent } from './components/app/app.component';
import { LoginComponent } from './components/login/login.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { PasswordComponent } from './components/password/password.component';
import { NonSportGameStatisticsComponent } from './components/non-sport-game-statistics/non-sport-game-statistics.component';
import { WinLimitControlFileDownLoadComponent } from './components/win-limit-control/file-download/file-download.component';
import { CurrencySettingComponent, CurrencySettingModule } from './components/currency-setting';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        LoginComponent,
        HomeComponent,
        PasswordComponent,
        NonSportGameStatisticsComponent,
        WinLimitControlFileDownLoadComponent
    ],
    providers: [
        LocalStorageService,
        AuthenticationService,
        AuthGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        }
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        CurrencySettingModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
            { path: 'password', component: PasswordComponent, canActivate: [AuthGuard] },
            { path: 'NonSportGameStatistics/Main/Index', component: NonSportGameStatisticsComponent, canActivate: [AuthGuard] },
            { path: 'WinLimitControl/FileDownLoad/Index', component: WinLimitControlFileDownLoadComponent, canActivate: [AuthGuard] },
            { path: 'WinLimitControl/CurrencySetting/Index', component: CurrencySettingComponent, canActivate: [AuthGuard] },
            { path: '**', redirectTo: 'home' }
        ])
    ]
})
export class AppModuleShared { }
