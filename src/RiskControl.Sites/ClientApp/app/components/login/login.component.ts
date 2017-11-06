const CryptoJS = require('./libs/CryptoJS') as CryptoJSInterface;
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { LoginModel } from './login.model';
import { CustomValidators } from './custom-validators';

interface CryptoJSInterface {
    CfsEnCode(input: string): string;
}

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [
        AuthenticationService
    ]
})
export class LoginComponent implements OnInit {
    returnUrl: string;
    form: FormGroup;
    username: FormControl;
    password: FormControl;

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
        const loginModel: LoginModel = {
            Username: this.username.value,
            Password: CryptoJS.CfsEnCode(this.password.value)
        };
        this.authenticationService.logIn(loginModel).subscribe(result => {
            this.router.navigate([this.returnUrl]);
        });
    }
}
