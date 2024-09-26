import { Pipe, PipeTransform } from '@angular/core';
import { CasinoType, Product } from './member-wl-analysis-report.model';
import { TreeviewItem } from 'ngx-treeview';
import * as _ from 'lodash';

@Pipe({
  name: 'productTreeview'
})
export class ProductTreeviewPipe implements PipeTransform {

  transform(products: Product[]): TreeviewItem[] {
    if (_.isNil(products)) {
      return undefined;
    }

    const liveCasinoProducts: TreeviewItem[] = [];
    const rngCasinoProducts: TreeviewItem[] = [];
    const nonCasinoProducts: TreeviewItem[] = [];

    products.forEach(product => {
        const item = new TreeviewItem({ text: product.productName, value: product.productId });
        switch (product.casinoType) {
            case CasinoType.None:
                nonCasinoProducts.push(item);
                break;
            case CasinoType.RNG:
                rngCasinoProducts.push(item);
                break;
            case CasinoType.SLI:
                liveCasinoProducts.push(item);
                break;
        }
    });
    const result: TreeviewItem[] = [];
    if (liveCasinoProducts.length > 0) {
        result.push(new TreeviewItem({
            text: 'Live Casino',
            value: undefined,
            children: liveCasinoProducts
        }));
    }
    if (rngCasinoProducts.length > 0) {
        result.push(new TreeviewItem({
            text: 'RNG Casino',
            value: undefined,
            children: rngCasinoProducts
        }));
    }
    return result.concat(nonCasinoProducts);
  }

}
