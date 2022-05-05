import { CasinoType } from '../../common';
import { ProductSetting } from './product-setting';
import { ProductLevel } from './product.model';

export abstract class CasinoSetting extends ProductSetting {
    casinoType: CasinoType;

    constructor(typeId: number, typeName: string) {
        super(typeId, typeName, [
            ProductLevel.CasinoTypeViewProduct
        ]);
        this.casinoType = typeId;
    }

    hasDrillDownProduct(): boolean {
        if (this.level === ProductLevel.CasinoTypeViewProduct) {
            return true;
        }

        return super.hasDrillDownProduct();
    }

    abstract isViewSubProduct(isDrillDownCurrency: boolean): boolean;
}
