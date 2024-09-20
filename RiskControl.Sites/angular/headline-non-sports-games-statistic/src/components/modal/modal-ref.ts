import { Injectable, ViewContainerRef, ComponentRef, ViewRef } from '@angular/core';
import { ModalWindowComponent } from './modal-window.component';
import { ModalBackdropComponent } from './modal-backdrop.component';

@Injectable()
export class ModalRef {
    constructor(
        public viewContainerRef: ViewContainerRef,
        public windowComponentRef: ComponentRef<ModalWindowComponent>,
        public backdropComponentRef: ComponentRef<ModalBackdropComponent>,
        public contentViewRef?: ViewRef
    ) {
        windowComponentRef.instance.close.subscribe(() => this.close());
    }

    close() {
        if (this.windowComponentRef) {
            this.removeModalElements();
        }
    }

    private removeModalElements() {
        this.viewContainerRef.remove(this.viewContainerRef.indexOf(this.windowComponentRef.hostView));
        this.viewContainerRef.remove(this.viewContainerRef.indexOf(this.backdropComponentRef.hostView));
        if (this.contentViewRef) {
            this.viewContainerRef.remove(this.viewContainerRef.indexOf(this.contentViewRef));
        }

        this.windowComponentRef = undefined;
        this.backdropComponentRef = undefined;
        this.contentViewRef = undefined;
    }
}
