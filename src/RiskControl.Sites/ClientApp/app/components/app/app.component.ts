import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../login/authentication.service';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [
        AuthenticationService
    ]
})
export class AppComponent implements OnInit {
    isLoggedIn: boolean;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    ngOnInit() {
        this.isLoggedIn = this.authenticationService.isLoggedIn();
        if (!this.isLoggedIn) {
            this.router.navigate(['/login']);
        }
    }
}
