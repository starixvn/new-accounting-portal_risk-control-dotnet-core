import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export class CustomValidators {
    static noWhitespace(control: AbstractControl): ValidationErrors | null {
        const isWhitespace = (control.value || '').trim().length === 0;
        return isWhitespace ? { 'whitespace': true } : null;
    }
}
