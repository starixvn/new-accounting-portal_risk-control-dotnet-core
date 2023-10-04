import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { TestObject } from './filter.model';

@Pipe({
    name: 'napExcludeTest2'
})
export class ExcludeTest2Pipe implements PipeTransform {
    transform(objects: TestObject[], excludeTestData: boolean): TestObject[] {
        if (_.isNil(objects)) {
            return undefined;
        }

        const filteredObjects = objects.filter(object => !object.isTest || object.isTest === !excludeTestData);
        const copyObjects = filteredObjects.map(object => _.cloneDeep(object));
        return copyObjects;
    }
}
