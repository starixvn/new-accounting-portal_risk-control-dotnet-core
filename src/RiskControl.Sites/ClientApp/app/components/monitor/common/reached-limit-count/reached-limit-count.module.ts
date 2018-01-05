import { NgModule } from '@angular/core';
import { ReachedLimitCountPipe } from './reached-limit-count.pipe';

@NgModule({
    declarations: [
        ReachedLimitCountPipe
    ],
    exports: [
        ReachedLimitCountPipe
    ]
})
export class ReachedLimitCountModule { }
