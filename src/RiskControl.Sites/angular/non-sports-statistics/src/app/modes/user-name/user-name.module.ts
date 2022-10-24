import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpModule } from 'nap-components/http';
import { ModalModule } from 'components/modal';
import { GridModule } from 'components/grid';
import { HousePositionTakingModule } from '../house-position-taking';
import { AssociatedAccountModule } from '../associated-account';
import { UserNameComponent } from './user-name.component';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        HttpModule.forRoot(),
        ModalModule.forRoot(),
        GridModule,
        AssociatedAccountModule.forRoot(),
        HousePositionTakingModule.forRoot()
    ],
    exports: [
        UserNameComponent
    ],
    declarations: [
        UserNameComponent
    ],
    entryComponents: [
        UserNameComponent
    ],
    providers: []
})
export class UserNameModule { }
