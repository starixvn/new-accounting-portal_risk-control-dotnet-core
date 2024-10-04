import { Injectable, EventEmitter, ElementRef } from '@angular/core';

@Injectable()
export class GridService {
    heightPadding = 25;

    resizeEvent = new EventEmitter();

    calculateGridExpandHeight(grid: ElementRef, gridOptions: GridOptions): number {
        let jqueryElement = $(grid.nativeElement);
        if (gridOptions !== undefined && gridOptions.showTitle) {
            jqueryElement = jqueryElement.parent();
        }

        return jqueryElement.offset()!.top + this.heightPadding;
    }
}
