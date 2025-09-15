import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import * as _ from 'lodash';
import { RoleId } from '../../common';
import { UserNameSuggestionService } from './user-name-suggestion.service';

class SelectUserName {
  readonly userName: string;
  isActive: boolean;

  constructor(userName: string, isActive = false) {
    this.userName = userName;
    this.isActive = isActive;
  }
}

@Component({
  selector: 'nap-user-name-suggestion',
  templateUrl: './user-name-suggestion.component.html',
  styleUrls: [
    './user-name-suggestion.component.scss'
  ]
})

export class UserNameSuggestionComponent {
  @ViewChild('input', { static: true }) input!: ElementRef;
  @ViewChild('hiddenInput', { static: true }) hiddenInput!: ElementRef;
  @Input() roleId = RoleId.Member;
  @Output() complete = new EventEmitter<string[]>();
  suggestionIndex = -1;
  userName = '';
  selectedUserNames: SelectUserName[] = [];
  suggestedUserNames: string[] = [];
  private lastSelectUserName: SelectUserName | undefined;
  private isPasted = false;

  @HostListener('click', ['$event']) click(event: MouseEvent) {
    this.focusInput();
    event.stopPropagation();
  }
  @HostListener('document:click') documentClick() {
    this.completeInput();
  }

  constructor(
    private readonly service: UserNameSuggestionService
  ) { }

  get hasSuggestion(): boolean {
    return !_.isNil(this.suggestedUserNames) && this.suggestedUserNames.length > 0;
  }

  reset() {
    this.selectedUserNames = [];
    this.completeInput();
  }

  focusInput() {
    const inputElement: HTMLInputElement = this.input.nativeElement;
    inputElement.focus();
  }

  onCloseClick(index: number) {
    _.pullAt(this.selectedUserNames, [index]);
    this.focusHiddenInputAndHideSuggestion();
  }

  onSelectClick(selectUserName: SelectUserName, event: MouseEvent) {
    if (event.ctrlKey) {
      selectUserName.isActive = !selectUserName.isActive;
    } else if (event.shiftKey) {
      if (this.lastSelectUserName) {
        const firstIndex = this.selectedUserNames.indexOf(this.lastSelectUserName);
        const lastIndex = this.selectedUserNames.indexOf(selectUserName);
        const minIndex = Math.min(firstIndex, lastIndex);
        const maxIndex = Math.max(firstIndex, lastIndex);
        this.selectedUserNames.forEach((userName, index) => {
          userName.isActive = index >= minIndex && index <= maxIndex;
        });
      } else {
        selectUserName.isActive = true;
      }
    } else {
      this.selectedUserNames.forEach(item => {
        item.isActive = item === selectUserName;
      });
    }

    this.lastSelectUserName = selectUserName;
    event.stopPropagation();
    this.focusHiddenInputAndHideSuggestion();
  }

  onInputPaste() {
    this.isPasted = true;
  }

  onInputFocus() {
    this.lastSelectUserName = undefined;
    if (this.selectedUserNames) {
      this.selectedUserNames.forEach(selectUserName => selectUserName.isActive = false);
    }
  }

  onHiddenKeydown(event: KeyboardEvent) {
    switch (event.code) {
      case 'Backspace':
      case 'Delete':
        _.remove(this.selectedUserNames, selectUserName => {
          return selectUserName.isActive;
        });

        if (this.selectedUserNames.length === 0) {
          this.focusInput();
        }

        event.preventDefault();
        return;
      default:
        this.handleEventSelectAll(event);
    }
  }

  onInputKeydown(event: KeyboardEvent) {
    this.isPasted = event.ctrlKey && event.key === 'v';
    switch (event.code) {
      case 'Escape':
        this.hideSuggestion();
        event.preventDefault();
        return;
      case 'ArrowDown':
        if (this.hasSuggestion) {
          this.suggestionIndex = Math.min(this.suggestedUserNames.length - 1, this.suggestionIndex + 1);
          event.preventDefault();
        }
        return;
      case 'ArrowUp':
        if (this.hasSuggestion) {
          this.suggestionIndex = Math.max(0, this.suggestionIndex - 1);
          event.preventDefault();
        }
        return;
      case 'Enter':
      case 'NumpadEnter':
        if (this.suggestionIndex !== -1) {
          this.onItemClick(this.suggestedUserNames[this.suggestionIndex]);
          event.preventDefault();
        } else {
          if (this.userName !== '') {
            this.addSelectedUserNameAndHideSuggestion(this.userName);
            this.userName = '';
            event.preventDefault();
          }
        }
        return;
      case 'Backspace':
        if (this.userName === '') {
          this.selectedUserNames.pop();
        }
        return;
      case 'Tab':
      case 'Comma':
        if (this.userName !== '') {
          this.addSelectedUserNameAndHideSuggestion(this.userName);
          this.userName = '';
          event.preventDefault();
        }
        return;
      default:
        this.handleEventSelectAll(event);
    }
  }

  onModelChange(userName: string) {
    const separators = [','];
    let index = 0;
    for (let i = 0; i < userName.length; i++) {
      const char = userName[i];
      if (separators.indexOf(char) !== -1) {
        const text = userName.substring(index, i);
        if (text !== '') {
          this.addSelectedUserNameAndHideSuggestion(text);
          index = i + 1;
        }
      }
    }

    if (index !== 0) {
      userName = userName.substring(index);
    }

    if (this.isPasted && userName !== '') {
      this.addSelectedUserNameAndHideSuggestion(userName);
      userName = '';
    }

    if (this.userName !== userName) {
      setTimeout(() => {
        this.userName = userName;
      });
    }

    const term = userName;
    if (term.length >= 2) {
      this.search(term);
    } else {
      this.hideSuggestion();
    }
  }

  onItemClick(userName: string) {
    this.userName = '';
    this.addSelectedUserNameAndHideSuggestion(userName);
  }

  onBlur(event: MouseEvent | KeyboardEvent) {
    if (document.activeElement !== this.hiddenInput.nativeElement
      && document.activeElement !== this.input.nativeElement) {
      this.completeInput();
    }
  }

  private completeInput() {
    if (this.userName !== '') {
      this.addSelectedUserNameAndHideSuggestion(this.userName);
      this.userName = '';
    }

    const userNames = this.selectedUserNames.map(selectUserName => selectUserName.userName);
    this.complete.emit(userNames);
  }

  private handleEventSelectAll(event: KeyboardEvent) {
    if (event.ctrlKey && event.code === 'KeyA' && this.userName === '') {
      this.selectedUserNames.forEach(selectUserName => selectUserName.isActive = true);
      event.preventDefault();
      this.focusHiddenInputAndHideSuggestion();
    }
  }

  private focusHiddenInputAndHideSuggestion() {
    const hiddenElement: HTMLInputElement = this.hiddenInput.nativeElement;
    hiddenElement.focus();
    this.hideSuggestion();
  }

  private addSelectedUserNameAndHideSuggestion(userName: string) {
    this.selectedUserNames.push(new SelectUserName(userName.trim()));
    this.hideSuggestion();
  }

  private hideSuggestion() {
    this.suggestionIndex = -1;
    this.suggestedUserNames = [];
  }

  private search(term: string) {
    this.service.getUsernameSuggestion(term, this.roleId).subscribe(userNames => {
      if (this.userName === term) {
        this.suggestedUserNames = userNames;
      }
    });
  }
}
