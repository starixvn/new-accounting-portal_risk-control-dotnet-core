import { Component } from '@angular/core';
import { ModalContext } from '../modal/modal-context';
import { GridContext } from '../grid';

@Component({
    selector: 'nap-grid-modal',
    templateUrl: './grid-modal.component.html'
})
export class GridModalComponent {
    gridOptions: GridOptions;
    gridContext: GridContext = {
        isAutoResize: false
    };

    constructor(
        private readonly modalContext: ModalContext
    ) {
        this.gridOptions = modalContext.data as GridOptions;
    }

    close() {
        this.modalContext.close();
    }
}
