import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'nap-modal-backdrop',
    template: ''
})
export class ModalBackdropComponent {
    @HostBinding('attr.class') bindingClass = 'modal-backdrop fade show';
}
