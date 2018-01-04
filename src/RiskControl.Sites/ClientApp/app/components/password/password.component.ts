import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { PasswordService } from './password.service';

@Component({
    selector: 'password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.scss'],
    providers: [
        PasswordService
    ]
})
export class PasswordComponent implements OnInit {
    username: string;
    form: FormGroup;
    oldPassword: FormControl;
    newPassword: FormControl;
    confirmPassword: FormControl;

    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private passwordService: PasswordService
    ) {
        this.createForm();
    }

    private createForm() {
        this.oldPassword = this.formBuilder.control('', [Validators.required]);
        this.newPassword = this.formBuilder.control('', [Validators.required]);
        this.confirmPassword = this.formBuilder.control('', [Validators.required]);
        this.form = this.formBuilder.group({
            oldPassword: this.oldPassword,
            newPassword: this.newPassword,
            confirmPassword: this.confirmPassword
        });
    }

    save() {
        const oldPassword = this.authenticationService.encryptPassword(this.oldPassword.value);
        const newPassword = this.authenticationService.encryptPassword(this.newPassword.value);
        this.passwordService.save(oldPassword, newPassword)
            .subscribe(response => {
                console.log(response);
            });;
    }

    ngOnInit() {
        const loginTicket = this.authenticationService.loginTicket;
        if (loginTicket) {
            this.username = loginTicket.username;
        }
    }
}
