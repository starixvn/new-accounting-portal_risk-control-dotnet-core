import { Input, Output, Component, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { ModalOptions } from './modal-options';

@Component({
    selector: 'nap-modal-window',
    templateUrl: './modal-window.component.html',
    styleUrls: [
        './modal-window.component.scss'
    ]
})
export class ModalWindowComponent {
    @Input() windowClass: string;
    @Input() width: number;
    @Input() height: number;
    @Input() backdrop: boolean;
    @Output() close = new EventEmitter();
    @HostBinding('attr.class') bindingClass = 'modal fade show' + (this.windowClass ? ` ${this.windowClass}` : '');
    @HostBinding('attr.role') bindingRole = 'dialog';
    @HostBinding('attr.tabindex') bindingTabindex = '-1';
    @HostBinding('style.display') bindingStyle = 'block';
    @HostListener('click') click() {
        if (this.backdrop) {
            this.close.emit();
        }
    }

    set options(options: ModalOptions) {
        if (options) {
            const size = options.size;
            if (size) {
                this.width = size.width;
                this.height = size.height;
            }
            this.windowClass = options.windowClass;
            this.backdrop = options.backdrop;
        }
    }
}
