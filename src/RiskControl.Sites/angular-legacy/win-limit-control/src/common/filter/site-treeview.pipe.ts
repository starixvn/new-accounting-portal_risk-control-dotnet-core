import { Pipe, PipeTransform } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';
import * as _ from 'lodash';
import { SiteGroup } from './filter.model';

@Pipe({
  name: 'siteTreeview'
})
export class SiteTreeviewPipe implements PipeTransform {

  transform(siteGroups: SiteGroup[]): TreeviewItem[] {
    let siteTreeItems: TreeviewItem[] = [];
    const creditGroup = 'Credit Sites';
    let siteLabelsOfCredit: string[] = [];
    if (!_.isNil(siteGroups)) {
      siteGroups.forEach(group => {
        let groupTreeviewItem = new TreeviewItem({ text: group.groupName, value: 0 });
        group.sites.forEach(site => {
          const item = new TreeviewItem({ text: site.siteName, value: site.siteId });
          if (group.groupName === creditGroup) {
            const indexOfSiteLabel = siteLabelsOfCredit.indexOf(site.siteLabel??site.siteName);
            if (siteLabelsOfCredit.length === 0 || indexOfSiteLabel === -1)
            {
              siteLabelsOfCredit.push(site.siteLabel??site.siteName);
              if (_.isNil(site.siteLabel))
              {
                this.addItemForChildren(groupTreeviewItem, new TreeviewItem({ text: site.siteName, value: site.siteId }));
              } else {
                this.addItemForChildren(groupTreeviewItem, new TreeviewItem({ text: site.siteLabel, value: 0 }));
                this.addItemForChildren(groupTreeviewItem.children[groupTreeviewItem.children.length-1], item);
              }
              
            } else {
              this.addItemForChildren(groupTreeviewItem.children[indexOfSiteLabel], item);
            }
          } else {
            this.addItemForChildren(groupTreeviewItem, item);
          }
        });
        siteTreeItems.push(groupTreeviewItem);
      });
    }
    return siteTreeItems;
  }

  addItemForChildren(groupTreeviewItem: TreeviewItem, item: TreeviewItem): void {
    if (_.isNil(groupTreeviewItem.children)) {
      groupTreeviewItem.children = [item];
    } else {
      groupTreeviewItem.children.push(item);
    }
  }

}
