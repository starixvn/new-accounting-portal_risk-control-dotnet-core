import { Pipe, PipeTransform } from "@angular/core";
import { TreeviewItem } from "ngx-treeview";
import { ProductGameType } from "./filter.model";
import * as _ from 'lodash';

@Pipe({
  name: 'napProductTreeview'
})
export class ProductTreeviewPipe implements PipeTransform {
  transform(allProductGameTypes: ProductGameType[]): TreeviewItem[] {

    if (_.isNil(allProductGameTypes)) {
      return undefined;
    }

    const products = _.uniqBy(allProductGameTypes, 'ProductId', 'ProductName');
    const items: TreeviewItem[] = [];

    if (_.isNil(products)) {
      return items;
    }

    products.forEach(product => {
      const treeItem = new TreeviewItem({
        text: product.ProductName,
        value: product.ProductId
      });

      items.push(treeItem);
    });

    return items;
  }
}
