import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../../fail-safe-system-setting/filter/filter.model';
import { TreeviewItem } from 'ngx-treeview';
import * as _ from 'lodash';

@Pipe({
  name: 'productTreeview'
})
export class ProductTreeviewPipe implements PipeTransform {

  transform(products: Product[]): TreeviewItem[] {
    const treeViewItems: TreeviewItem[] = [];
    if (_.isNil(products)) {
      return [];
    }
    products.forEach(product => {
      const item = new TreeviewItem({ text: product.productName, value: product.productId, checked: product.checked});
      treeViewItems.push(item);
    })

    return treeViewItems;
  }

}
