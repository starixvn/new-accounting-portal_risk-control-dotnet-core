import { FloorPipe } from './floor.pipe';

describe('FloorPipe', () => {

    const pipe = new FloorPipe();

    it('transforms 1 to 1', () => {
        expect(pipe.transform(1)).toBe(1);
    });

    it('transforms 1.2 to 1', () => {
        expect(pipe.transform(1.2)).toBe(1);
    });

    it('transforms 1.9 to 1', () => {
        expect(pipe.transform(1.9)).toBe(1);
    });

    it('transforms -1 to -1', () => {
        expect(pipe.transform(-1)).toBe(-1);
    });

    it('transforms -1.2 to -1', () => {
        expect(pipe.transform(-1.2)).toBe(-1);
    });

    it('transforms -1.9 to -1', () => {
        expect(pipe.transform(-1.9)).toBe(-1);
    });
});
