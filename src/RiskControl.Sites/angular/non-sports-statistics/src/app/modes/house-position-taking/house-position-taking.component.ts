import { Component } from '@angular/core';
import { ModalContext } from 'components/modal';
import { HousePositionTakingModel } from './house-position-taking.model';

@Component({
    selector: 'nap-house-position-taking',
    templateUrl: './house-position-taking.component.html'
})
export class HousePositionTakingComponent {
    model: HousePositionTakingModel;

    constructor(
        private readonly modalContext: ModalContext
    ) {
        this.model = modalContext.data as HousePositionTakingModel;
    }

    close() {
        this.modalContext.close();
    }
}
