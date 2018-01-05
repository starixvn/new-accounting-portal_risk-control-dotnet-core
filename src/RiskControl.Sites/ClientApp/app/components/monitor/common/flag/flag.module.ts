import { NgModule } from '@angular/core';
import { FlagPipe } from './flag.pipe';

@NgModule({
    declarations: [
        FlagPipe
    ],
    exports: [
        FlagPipe
    ]
})
export class FlagModule { }
