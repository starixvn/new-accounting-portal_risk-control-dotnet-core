import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { TreeviewItem } from 'ngx-treeview';
import { ProductGameType } from './filter.model';

@Pipe({
  name: 'napGametypeTreeview'
})
export class GametypeTreeviewPipe implements PipeTransform {
  transform(allProductGameTypes: ProductGameType[], products: number[]): TreeviewItem[] {

    if (_.isNil(allProductGameTypes)) {
      return undefined;
    }

    const items: TreeviewItem[] = [];
    if (_.isNil(products)) {
      return items;
    }



    products.forEach(product => {
      const productGameTypes = allProductGameTypes.filter(
        gameType => gameType.productId === product
      );

      const treeItem = new TreeviewItem({
        text: productGameTypes[0].productName,
        value: productGameTypes[0].productId
      });

      if (productGameTypes.length > 0) {
        treeItem.children = productGameTypes.map(gameType => {
          const item = new TreeviewItem({
            text: gameType.bettypeName,
            value: gameType.bettype
          });
          return item;
        });
      }

      items.push(treeItem);
    });

    return items;
  }
}
