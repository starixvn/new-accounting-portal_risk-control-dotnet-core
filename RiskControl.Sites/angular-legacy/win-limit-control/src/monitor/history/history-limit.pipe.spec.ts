import { HistoryLimitPipe } from './history-limit.pipe';

describe('HistoryLimitPipe', () => {

    const pipe = new HistoryLimitPipe();

    it('transforms(1,"Unblock" to ""', () => {
        expect(pipe.transform(1, 'Unblock')).toBe('');
    });

    it('transforms(1,"Unblock Transfer" to ""', () => {
        expect(pipe.transform(1, 'Unblock Transfer')).toBe('');
    });

    it('transforms(1,"Block" to "1"', () => {
        expect(pipe.transform(1, 'Block')).toBe('1');
    });
});
