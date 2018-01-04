import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
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
    message: string;

    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private passwordService: PasswordService
    ) {
        this.createForm();
    }

    private createForm() {
        this.oldPassword = this.formBuilder.control('', [Validators.required, Validators.minLength(6)]);
        this.newPassword = this.formBuilder.control('', [Validators.required, Validators.minLength(6)]);
        this.confirmPassword = this.formBuilder.control('', [Validators.required, Validators.minLength(6), () => this.matchPassword()]);
        this.form = this.formBuilder.group({
            oldPassword: this.oldPassword,
            newPassword: this.newPassword,
            confirmPassword: this.confirmPassword
        });
    }

    private matchPassword(): ValidationErrors | null {
        if (this.newPassword.value !== this.oldPassword.value) {
            return { 'matchPassword': true };
        } else {
            return null;
        }
    }

    save() {
        this.message = '';
        if (this.form.valid) {
            const oldPassword = this.authenticationService.encryptPassword(this.oldPassword.value);
            const newPassword = this.authenticationService.encryptPassword(this.newPassword.value);
            this.passwordService.save(oldPassword, newPassword)
                .subscribe(response => {
                    this.message = 'Your changes were saved!';
                });;
        } else {
            if (this.oldPassword.errors) {
                if (this.oldPassword.errors.required) {
                    this.message = 'Old password is required!';
                } else if (this.oldPassword.errors.minlength) {
                    this.message = 'Old password must have at least 6 characters!';
                }
            } else if (this.message === '' && this.newPassword.errors) {
                if (this.newPassword.errors.required) {
                    this.message = 'New password is required!';
                } else if (this.newPassword.errors.minlength) {
                    this.message = 'New password must have at least 6 characters!';
                }
            } else if (this.message === '' && this.confirmPassword.errors) {
                if (this.confirmPassword.errors.required) {
                    this.message = 'Confirm password is required!';
                } else if (this.confirmPassword.errors.minlength) {
                    this.message = 'Confirm password must have at least 6 characters!';
                } else if (this.confirmPassword.errors.matchPassword) {
                    this.message = `'New Password' and 'Confirm Password' do not match!`;
                }
            }
        }
    }

    ngOnInit() {
        const loginTicket = this.authenticationService.loginTicket;
        if (loginTicket) {
            this.username = loginTicket.username;
        }
    }
}
