import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'components/modal';
import { GridModule } from 'components/grid';
import { AssociatedAccountComponent } from './associated-account.component';
import { AssociatedAccountService } from './associated-account.service';

@NgModule({
    imports: [
        CommonModule,
        GridModule,
        ModalModule.forRoot()
    ],
    exports: [
        AssociatedAccountComponent
    ],
    declarations: [
        AssociatedAccountComponent
    ],
    entryComponents: [
        AssociatedAccountComponent
    ]
})
export class AssociatedAccountModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AssociatedAccountModule,
            providers: [
                AssociatedAccountService
            ]
        };
    }
}
