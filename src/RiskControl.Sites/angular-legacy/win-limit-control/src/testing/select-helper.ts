import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

export class SelectHelper {
    constructor(
        private selectElement: DebugElement
    ) { }

    getOptionContents(): string[] {
        const optionElements = this.selectElement.queryAll(By.css('option'));
        return optionElements.map(element => element.nativeElement.textContent.trim());
    }

    getTextOfSelectElement(): string {
        const value = this.selectElement.nativeElement.value;
        if (value) {
            const options = this.selectElement.queryAll(By.css('option'));
            const selectOptions = options.filter(option => option.nativeElement.value === value);
            if (selectOptions.length === 1) {
                return selectOptions[0].nativeElement.textContent.trim();
            }
        }

        return '';
    }

    selectOptionByText(selectText: string) {
        const options = this.selectElement.queryAll(By.css('option'));
        const selectOptions = options.filter(option => option.nativeElement.textContent.trim() === selectText);
        if (selectOptions.length === 1) {
            const value = selectOptions[0].nativeElement.value;
            this.selectElement.nativeElement.value = value;
            this.selectElement.nativeElement.dispatchEvent(new Event('change'));
        }
    }
}
