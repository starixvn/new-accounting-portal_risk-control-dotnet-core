import * as _ from 'lodash';
import { ExcludeTest2Pipe } from './exclude-test2.pipe';
import { TestObject } from './filter.model';

describe('ExcludeTest2Pipe', () => {
    const pipe = new ExcludeTest2Pipe();

    it('should transform null or undefined to undefined', () => {
        expect(pipe.transform(null, true)).toBeUndefined();
        expect(pipe.transform(undefined, false)).toBeUndefined();
    });

    describe('transform a list of objects', () => {
        const testObjects: TestObject[] = [
            { isTest: false },
            { isTest: true },
            { isTest: true }
        ];

        it('should keep test objects if second param is false', () => {
            const filteredObjects = pipe.transform(testObjects, false);
            expect(filteredObjects.length).toBe(3);
        });

        it('should remove test objects if second param is true & unkeep object references', () => {
            const filteredObjects = pipe.transform(testObjects, true);
            expect(filteredObjects.length).toBe(1);
            expect(testObjects[0] === filteredObjects[0]).toBe(false);
            expect(_.isEqual(testObjects[0], filteredObjects[0])).toBe(true, 'clone object');
        });
    });
});
