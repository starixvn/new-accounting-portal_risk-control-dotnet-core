import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from 'nap-components/http';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { GroupSettingComponent } from './group-setting.component';
import { GroupSettingService } from './group-setting.service';

@NgModule({
    imports: [
        CommonModule,
        HttpModule.forRoot(),
        NgbModalModule
    ],
    declarations: [
        GroupSettingComponent
    ],
    entryComponents: [
        GroupSettingComponent
    ],
    exports: [
        GroupSettingComponent
    ]
})
export class GroupSettingModule {
    static forRoot(): ModuleWithProviders<GroupSettingModule> {
        return {
            ngModule: GroupSettingModule,
            providers: [
                GroupSettingService
            ]
        };
    }
}
