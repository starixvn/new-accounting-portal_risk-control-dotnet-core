import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { TreeviewItem } from 'ngx-treeview';
import { Device } from './filter.model';

@Pipe({
    name: 'napDeviceTreeview'
})
export class DeviceTreeviewPipe implements PipeTransform {
    transform(devices: Device[]): TreeviewItem[] {
        if (_.isNil(devices)) {
            return undefined;
        }

        const mobileTreeItem = new TreeviewItem({ text: 'Mobile', value: undefined });
        const nonMobileTreeItem = new TreeviewItem({ text: 'Non-mobile', value: undefined });
        const uncategorizedTreeItem = new TreeviewItem({ text: 'Uncategorized', value: undefined });
        devices.forEach(device => {
            const item = new TreeviewItem({ text: device.fullName, value: device });
            let groupTreeviewItem: TreeviewItem;
            switch (device.groupName) {
                case 'Mobile':
                    groupTreeviewItem = mobileTreeItem;
                    break;
                case 'Non-mobile':
                    groupTreeviewItem = nonMobileTreeItem;
                    break;
                default:
                    groupTreeviewItem = uncategorizedTreeItem;
                    break;
            }

            if (_.isNil(groupTreeviewItem.children)) {
                groupTreeviewItem.children = [item];
            } else {
                groupTreeviewItem.children.push(item);
            }
        });

        const treeItems = [
            mobileTreeItem,
            nonMobileTreeItem,
            uncategorizedTreeItem
        ];
        return treeItems.filter(item => !_.isNil(item.children) && item.children.length > 0);
    }
}
