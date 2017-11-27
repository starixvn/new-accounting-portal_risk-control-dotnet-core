import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from 'nap-components/http';

import { LocalStorageService } from './services/local-storage.service';
import { AuthenticationService } from './services/authentication.service';
import { AuthGuard } from './guards/auth.guard';

import { AppComponent } from './components/app/app.component';
import { LoginComponent } from './components/login/login.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { PasswordComponent } from './components/password/password.component';
import { NonSportGameStatisticsComponent } from './components/non-sport-game-statistics/non-sport-game-statistics.component';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        LoginComponent,
        HomeComponent,
        PasswordComponent,
        NonSportGameStatisticsComponent
    ],
    providers: [
        LocalStorageService,
        AuthenticationService,
        AuthGuard
    ],
    imports: [
        CommonModule,
        HttpModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
            { path: 'password', component: PasswordComponent, canActivate: [AuthGuard] },
            { path: 'NonSportGameStatistics/Main/Index', component: NonSportGameStatisticsComponent, canActivate: [AuthGuard] },
            { path: '**', redirectTo: 'home' }
        ])
    ]
})
export class AppModuleShared {
}
