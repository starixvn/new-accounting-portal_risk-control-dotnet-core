import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Helper } from './helper';

interface SelectText {
    text: string;
    children?: SelectText[];
}

export class DropdownTreeviewSelectHelper {
    constructor(
        private dropdownTreeviewSelectElement: DebugElement
    ) { }

    hasAllItem(): boolean {
        const allLabel = this.dropdownTreeviewSelectElement.queryAll(By.css('.treeview-header .label-item'));
        return allLabel !== null;
    }

    getItemContents(): SelectText[] {
        const result: SelectText[] = [];
        const treeviewItemElements = this.dropdownTreeviewSelectElement.queryAll(By.css('.treeview-container > ngx-treeview-item'));
        return treeviewItemElements.map(element => this.getSelectText(element));
    }

    getTextOfSelectItem(): string {
        const dropdownButton = this.dropdownTreeviewSelectElement.query(By.css('button'));
        return dropdownButton.nativeElement.textContent.trim();
    }

    selectItemByText(selectText: string) {
        const labels = this.dropdownTreeviewSelectElement.queryAll(By.css('.treeview-container label'));
        const selectLabels = labels.filter(label => label.nativeElement.textContent.trim() === selectText);
        if (selectLabels.length === 1) {
            Helper.raiseClickEvent(selectLabels[0].nativeElement);
        }
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
        const labelElement = treeviewItem.query(By.css('.label-group'));
        return labelElement.nativeElement.textContent.trim();
    }

    private getLabelItemContent(treeviewItem: DebugElement) {
        const labelElement = treeviewItem.query(By.css('.label-item'));
        return labelElement.nativeElement.textContent.trim();
    }
}
