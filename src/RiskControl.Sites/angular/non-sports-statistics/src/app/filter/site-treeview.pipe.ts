import { Pipe, PipeTransform } from "@angular/core";
import * as _ from "lodash";
import { TreeviewItem } from "ngx-treeview";
import { LicenseeModel, Site, SiteGroupModel } from "./filter.model";

@Pipe({
  name: "napSiteTreeview",
})
export class SiteTreeviewPipe implements PipeTransform {
  transform(sites: SiteGroupModel[]): TreeviewItem[] {
    if (_.isNil(sites)) {
      return undefined;
    }

    return this.createTree(sites);
  }

  private createTree(siteGroups: SiteGroupModel[]): TreeviewItem[] {
    if (siteGroups === null || siteGroups.length === 0) {
      return [];
    }

    let tree = siteGroups.map(siteGroup => new TreeviewItem({
      text: siteGroup.groupName !== null ? siteGroup.groupName : siteGroup.licenseeName,
      value: siteGroup,
      children: this.createTree(siteGroup.childGroups)
    }));

    return tree;
  }
}
