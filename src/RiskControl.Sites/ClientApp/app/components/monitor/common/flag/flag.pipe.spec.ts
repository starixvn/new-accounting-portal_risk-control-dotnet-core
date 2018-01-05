import { FlagPipe } from './flag.pipe';

describe('FlagPipe', () => {

    const pipe = new FlagPipe();

    it('transforms level 102 to "text-black"', () => {
        expect(pipe.transform(102)).toBe('text-black');
    });

    it('transforms level 101 to "text-grey"', () => {
        expect(pipe.transform(101)).toBe('text-grey');
    });

    it('transforms level 1 to "text-orange"', () => {
        expect(pipe.transform(1)).toBe('text-orange');
    });

    it('transforms level 2 to "text-yellow"', () => {
        expect(pipe.transform(2)).toBe('text-yellow');
    });

    it('transforms level 3 to "text-red"', () => {
        expect(pipe.transform(3)).toBe('text-red');
    });

    it('transforms level 0 to ""', () => {
        expect(pipe.transform(0)).toBe('');
    });
});
