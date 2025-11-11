import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './toast.component';
import { ToastService } from './toast.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ToastComponent
    ],
    exports: [
        ToastComponent
    ]
})
export class ToastModule {
    static forRoot(): ModuleWithProviders<ToastModule> {
        return {
            ngModule: ToastModule,
            providers: [
                ToastService
            ]
        };
    }
}
