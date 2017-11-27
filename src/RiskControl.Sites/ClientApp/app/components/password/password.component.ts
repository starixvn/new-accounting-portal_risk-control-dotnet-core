import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
    selector: 'password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
    username: string;

    constructor(
        private authenticationService: AuthenticationService
    ) { }

    ngOnInit() {
        const loginTicket = this.authenticationService.loginTicket;
        if (loginTicket) {
            this.username = loginTicket.username;
        }
    }
}
