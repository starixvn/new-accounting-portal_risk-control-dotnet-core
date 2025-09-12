import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { TreeviewItem } from 'ngx-treeview';
import { CompanyModel, Currency, SportModel } from './filter.model';

@Injectable()
export class TreeViewBuilderService {

  buildCompanyTreeViewItems(companies: CompanyModel[]): TreeviewItem[] {
    if (companies.length === 0) {
      return [];
    }
    let result: TreeviewItem[] = [];
    let tree: TreeviewItem;
    const creditGroups = companies.filter(x => !x.isDeposit);
    if (creditGroups.length > 0) {
      tree = this.CreateSiteGroupTree(creditGroups, 'Credit Group', 0);
      result.push(tree);
    }
    const licenseeGroups = companies.filter(x => x.isDeposit);
    if (licenseeGroups.length > 0) {
      tree = this.CreateSiteGroupTree(licenseeGroups, 'Licensee Group', 1);
      result.push(tree);
    }
    return result;
  }

  buildCurrencyTreeViewItems(currenies: Currency[]): TreeviewItem[] {
    if (currenies.length === 0) {
      return [];
    }
    return currenies.map(currency => new TreeviewItem({
      text: currency.currency,
      value: currency.exchangeId,
      checked: true
    }));
  }

  buildSportTreeViewItems(sports: SportModel[]): TreeviewItem[] {
    if (sports.length === 0) {
      return [];
    }
    const grouped = _.groupBy(sports, sport => `${sport.sportType}-${sport.sportName}`);
    const items: TreeviewItem[] = [];
    for (const [sportType, group] of Object.entries(grouped)) {
      items.push(new TreeviewItem({
        text: sportType.split('-')[1],
        value: sportType,
        checked: true,
        children: group.map(sport => new TreeviewItem({
          text: sport.betTypeName,
          value: `${sport.sportType}-${sport.sportName}`,
          checked: true
        }))
      }));
    }
    return items;
  }

  private CreateSiteGroupTree(sites: CompanyModel[], siteName: string, siteId: number): TreeviewItem {
    var tree = new TreeviewItem({
      text: siteName,
      value: siteId,
      checked: true,
      children: this.CreateTree(sites)
    });
    return tree;
  }

  private CreateTree(siteGroups: CompanyModel[]): TreeviewItem[] {
    if (siteGroups === null || siteGroups.length === 0) {
      return [];
    }

    var tree = siteGroups.map(siteGroup => {
      const childGroups = siteGroups.filter(x => x.siteId === siteGroup.parentId);
      return new TreeviewItem({
        text: siteGroup.siteName,
        value: siteGroup.siteId,
        checked: true,
        children: this.CreateTree(childGroups)
      });
    });

    return tree;
  }
}
