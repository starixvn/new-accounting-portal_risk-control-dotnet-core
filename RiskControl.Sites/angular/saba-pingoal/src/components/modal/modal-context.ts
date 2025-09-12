import { Injectable } from '@angular/core';

@Injectable()
export class ModalContext {
    data!: Object;

    static create(data: Object): ModalContext {
        const modalContext = new ModalContext();
        modalContext.data = data;
        return modalContext;
    }

    close(): void { }
}
