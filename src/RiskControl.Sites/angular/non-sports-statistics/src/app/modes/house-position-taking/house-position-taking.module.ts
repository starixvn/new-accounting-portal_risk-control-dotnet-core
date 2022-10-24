import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'components/modal';
import { GridModule } from 'components/grid';
import { HousePositionTakingComponent } from './house-position-taking.component';
import { HousePositionTakingService } from './house-position-taking.service';

@NgModule({
    imports: [
        CommonModule,
        GridModule,
        ModalModule.forRoot()
    ],
    exports: [
        HousePositionTakingComponent
    ],
    declarations: [
        HousePositionTakingComponent
    ],
    entryComponents: [
        HousePositionTakingComponent
    ]
})
export class HousePositionTakingModule {
    static forRoot(): ModuleWithProviders<HousePositionTakingModule> {
        return {
            ngModule: HousePositionTakingModule,
            providers: [
                HousePositionTakingService
            ]
        };
    }
}
