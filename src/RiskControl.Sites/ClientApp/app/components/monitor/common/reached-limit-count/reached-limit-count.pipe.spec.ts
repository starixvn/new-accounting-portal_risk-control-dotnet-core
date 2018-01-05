import { ReachedLimitCountPipe } from './reached-limit-count.pipe';

describe('ReachedLimitCountPipe', () => {

    const pipe = new ReachedLimitCountPipe();

    it('transforms level 2 to "(2)"', () => {
        expect(pipe.transform(2)).toBe('(2)');
    });

    it('transforms level 1 to ""', () => {
        expect(pipe.transform(1)).toBe('');
    });
});
