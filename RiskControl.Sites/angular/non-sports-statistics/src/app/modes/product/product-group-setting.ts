import { FilterModel } from "app/filter";
import { CasinoSetting } from "./casino-setting";

export class ProductGroupSetting extends CasinoSetting {

    isViewSubProduct(isDrillDownCurrency: boolean): boolean {
        return true;
    }
    updateFilterModel(filterModel: FilterModel): void {
        return;
    }
}
