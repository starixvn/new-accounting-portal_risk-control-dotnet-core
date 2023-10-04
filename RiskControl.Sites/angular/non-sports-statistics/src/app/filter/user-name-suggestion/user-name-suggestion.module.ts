import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from 'nap-components/http';
import { UserNameSuggestionTextboxComponent } from './user-name-suggestion-textbox.component';
import { UserNameSuggestionComponent } from './user-name-suggestion.component';
import { UserNameSuggestionService } from './user-name-suggestion.service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule.forRoot()
    ],
    declarations: [
        UserNameSuggestionComponent,
        UserNameSuggestionTextboxComponent
    ],
    providers: [
        UserNameSuggestionService
    ],
    exports: [
        UserNameSuggestionComponent,
        UserNameSuggestionTextboxComponent
    ]
})
export class UserNameSuggestionModule { }
