import { TreeviewItem } from 'ngx-treeview';
import { CasinoType } from '../common';
import { DeviceTreeviewPipe } from './device-treeview.pipe';
import { Device } from './filter.model';

describe('DeviceTreeviewPipe', () => {
    const pipe = new DeviceTreeviewPipe();

    it('should transform to undefined if gameTypes is null or undefined', () => {
        expect(pipe.transform(null)).toBe(undefined);
        expect(pipe.transform(undefined)).toBe(undefined);
    });

    it('should transform exactly', () => {
        const fakeDevices: Device[] = [{
            fullName: 'Device 1',
            betFrom: '1',
            groupName: 'Mobile'
        }, {
            fullName: 'Device 2',
            betFrom: '2',
            groupName: 'Mobile'
        }, {
            fullName: 'Device 3',
            betFrom: '3',
            groupName: 'Non-mobile'
        }, {
            fullName: 'Device 4',
            betFrom: '4',
            groupName: 'Uncategorized'
        }];

        const result = pipe.transform(fakeDevices);
        const expectedResult: TreeviewItem[] = [new TreeviewItem({
            text: 'Mobile',
            value: undefined,
            children: [new TreeviewItem({
                text: 'Device 1',
                value: fakeDevices[0]
            }), new TreeviewItem({
                text: 'Device 2',
                value: fakeDevices[1]
            })]
        }), new TreeviewItem({
            text: 'Non-mobile',
            value: undefined,
            children: [new TreeviewItem({
                text: 'Device 3',
                value: fakeDevices[2]
            })]
        }), new TreeviewItem({
            text: 'Uncategorized',
            value: undefined,
            children: [new TreeviewItem({
                text: 'Device 4',
                value: fakeDevices[3]
            })]
        })];
        expect(result).toEqual(expectedResult);
    });
});
