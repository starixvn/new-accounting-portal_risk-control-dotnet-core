import { Pipe, PipeTransform } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';
import { RuleTitle } from '../../fail-safe-system-setting/filter/filter.model';
import * as _ from 'lodash';

@Pipe({
  name: 'ruleTitleTreeview'
})
export class RuleTitleTreeviewPipe implements PipeTransform {

  transform(ruleTitle: RuleTitle[]): TreeviewItem[] {
    const treeViewItems: TreeviewItem[] = [];
    if (_.isNil(ruleTitle)) {
      return [];
    }
    ruleTitle.forEach(item => {
      const value = new TreeviewItem({ text: item.ruleTitle, value: item.ruleId, checked: true });
      treeViewItems.push(value);
    });

    return treeViewItems;
  }

}
