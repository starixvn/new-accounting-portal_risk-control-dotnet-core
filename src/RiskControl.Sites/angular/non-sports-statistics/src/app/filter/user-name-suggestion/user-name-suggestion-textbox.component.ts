import { Component, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { RoleId } from '../../common';
import { UserNameSuggestionComponent } from './user-name-suggestion.component';

@Component({
    selector: 'nap-user-name-suggestion-textbox',
    templateUrl: './user-name-suggestion-textbox.component.html',
    styleUrls: [
        './user-name-suggestion-textbox.component.scss'
    ]
})
export class UserNameSuggestionTextboxComponent {
    @Input() roleId: RoleId;
    @Output() complete = new EventEmitter<string[]>();
    @ViewChild('suggestion', { static: true }) suggestionComponent: UserNameSuggestionComponent;
    text: string;
    isOpen = false;

    @HostListener('click', ['$event']) click(event: MouseEvent) {
        event.stopPropagation();
    }

    reset() {
        this.suggestionComponent.reset();
    }

    onFocus() {
        this.isOpen = true;
        setTimeout(() => {
            this.suggestionComponent.focusInput();
        });
    }

    onInputComplete(userNames: string[]) {
        this.isOpen = false;
        const joinUserNames = userNames.join(',');
        if (this.text !== joinUserNames) {
            this.text = joinUserNames;
            this.complete.emit(userNames);
        }
    }
}
