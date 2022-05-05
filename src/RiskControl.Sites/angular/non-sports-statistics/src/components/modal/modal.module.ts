import { NgModule, ModuleWithProviders } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ModalContainerDirective } from './modal-container.directive';
import { ModalWindowComponent } from './modal-window.component';
import { ModalBackdropComponent } from './modal-backdrop.component';
import { ModalService } from './modal.service';
import { ModalStackService } from './modal-stack.service';

@NgModule({
    imports: [
        BrowserModule
    ],
    declarations: [
        ModalContainerDirective,
        ModalWindowComponent,
        ModalBackdropComponent
    ],
    entryComponents: [
        ModalWindowComponent,
        ModalBackdropComponent
    ],
    exports: [
        ModalContainerDirective
    ]
})

export class ModalModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ModalModule,
            providers: [
                ModalService,
                ModalStackService
            ]
        };
    }
}
