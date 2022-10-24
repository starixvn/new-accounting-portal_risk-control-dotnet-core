import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { TestObject } from './filter.model';

@Pipe({
    name: 'napExcludeTest'
})
export class ExcludeTestPipe implements PipeTransform {
    transform(objects: TestObject[], excludeTestData: boolean): TestObject[] {
        if (_.isNil(objects)) {
            return undefined;
        }

        return objects.filter(object => !object.isTest || object.isTest === !excludeTestData);
    }
}
