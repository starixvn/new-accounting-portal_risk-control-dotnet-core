const CryptoJS = require('./libs/CryptoJS') as CryptoJSInterface;
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { LoginModel, LoginTicket } from './login.model';
import { CustomValidators } from './custom-validators';
import { Observable } from 'rxjs/Observable';

interface CryptoJSInterface {
    CfsEnCode(input: string): string;
}

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    returnUrl: string;
    form: FormGroup;
    username: FormControl;
    password: FormControl;
    loading = false;
    errorMessage: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.createForm();
    }

    createForm() {
        this.username = this.formBuilder.control('', [Validators.required, CustomValidators.noWhitespace]);
        this.password = this.formBuilder.control('', [Validators.required]);
        this.form = this.formBuilder.group({
            username: this.username,
            password: this.password
        });
    }

    ngOnInit() {
        // reset login status
        this.authenticationService.logOut();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    logIn() {
        this.loading = true;
        const username = this.username.value.trim();
        const password = CryptoJS.CfsEnCode(this.password.value.trim());
        this.authenticationService.logIn(username, password)
            .subscribe(
            data => {
                this.router.navigate([this.returnUrl]);
            },
            error => {
                this.errorMessage = error.text();
                this.loading = false;
            });
    }
}
