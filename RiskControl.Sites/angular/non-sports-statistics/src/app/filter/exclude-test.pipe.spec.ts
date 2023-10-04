import { ExcludeTestPipe } from './exclude-test.pipe';
import { TestObject } from './filter.model';

describe('ExcludeTestPipe', () => {
    const pipe = new ExcludeTestPipe();

    it('should transform null or undefined to undefined', () => {
        expect(pipe.transform(null, true)).toBe(undefined);
        expect(pipe.transform(undefined, false)).toBe(undefined);
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

        it('should remove test objects if second param is true & keep object references', () => {
            const filteredObjects = pipe.transform(testObjects, true);
            expect(filteredObjects.length).toBe(1, 'remove test objects');
            expect(testObjects[0] === filteredObjects[0]).toBeTruthy();
        });
    });
});
