import { NgModule } from '@angular/core';
import { FloorPipe } from './floor.pipe';

@NgModule({
    declarations: [
        FloorPipe
    ],
    exports: [
        FloorPipe
    ]
})
export class FloorModule { }
