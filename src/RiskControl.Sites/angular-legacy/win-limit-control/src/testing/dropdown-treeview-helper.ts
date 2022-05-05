import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Helper } from './helper';

interface SelectText {
    text: string;
    children?: SelectText[];
}

export class DropdownTreeviewHelper {
    constructor(
        private dropdownTreeviewElement: DebugElement
    ) { }

    getDropdownText(): string {
        const dropdownButton = this.dropdownTreeviewElement.query(By.css('button'));
        return dropdownButton.nativeElement.textContent.trim();
    }

    hasAllItem(): boolean {
        const allLabel = this.dropdownTreeviewElement.queryAll(By.css('.treeview-header .label-item'));
        return allLabel !== null;
    }

    getItemContents(): SelectText[] {
        const result: SelectText[] = [];
        const treeviewItemElements = this.dropdownTreeviewElement.queryAll(By.css('.treeview-container > ngx-treeview-item'));
        return treeviewItemElements.map(element => this.getSelectText(element));
    }

    private getSelectText(treeviewItem: DebugElement): SelectText {
        const childTreeviewItems = treeviewItem.queryAll(By.css('.treeview-item > div > ngx-treeview-item'));
        if (childTreeviewItems.length > 0) {
            const labelContent = this.getLabelGroupContent(treeviewItem);
            const children = childTreeviewItems.map(item => this.getSelectText(item));
            return {
                text: labelContent,
                children: children
            };
        } else {
            const labelContent = this.getLabelItemContent(treeviewItem);
            return {
                text: labelContent
            };
        }
    }

    private getLabelGroupContent(treeviewItem: DebugElement) {
        const labelElement = treeviewItem.query(By.css('.form-check-label'));
        return labelElement.nativeElement.textContent.trim();
    }

    private getLabelItemContent(treeviewItem: DebugElement) {
        const labelElement = treeviewItem.query(By.css('.form-check-label'));
        return labelElement.nativeElement.textContent.trim();
    }
}
