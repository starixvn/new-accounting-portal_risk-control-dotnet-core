import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpModule } from 'nap-components/http';
import { ModalModule } from 'components/modal';
import { GridModule } from 'components/grid';
import { UserNameComponent } from './user-name.component';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        HttpModule.forRoot(),
        ModalModule.forRoot(),
        GridModule
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
