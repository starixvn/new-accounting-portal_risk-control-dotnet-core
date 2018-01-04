import { NgModule } from '@angular/core';
import { FilterModule } from './filter';
import { GridModule } from './grid';
import { CurrencySettingComponent } from './currency-setting.component';

@NgModule({
    imports: [
        FilterModule,
        GridModule
    ],
    exports: [
        CurrencySettingComponent
    ],
    declarations: [
        CurrencySettingComponent
    ]
})
export class CurrencySettingModule { }
