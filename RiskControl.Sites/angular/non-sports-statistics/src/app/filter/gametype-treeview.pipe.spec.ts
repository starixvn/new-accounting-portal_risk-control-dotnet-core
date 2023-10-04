import { TreeviewItem } from 'ngx-treeview';
import { CasinoType } from '../common';
import { GametypeTreeviewPipe } from './gametype-treeview.pipe';
import { GameType, Product } from './filter.model';

const fakeGameTypes: GameType[] = [{
    productId: 1,
    typeId: 1,
    typeName: 'Type 1',
    isTest: false,
    gameType: 1
}, {
    productId: 1,
    typeId: 2,
    typeName: 'Type 2',
    isTest: false,
    gameType: 2
}];

const fakeProducts: Product[] = [{
    productId: 1,
    productName: 'Product 1',
    casinoType: CasinoType.None,
    isSingleWallet: true
}, {
    productId: 2,
    productName: 'Product 2',
    casinoType: CasinoType.SLI,
    isSingleWallet: true
}];

describe('GametypeTreeviewPipe', () => {
    const pipe = new GametypeTreeviewPipe();

    it('should transform to undefined if gameTypes is null or undefined', () => {
        expect(pipe.transform(null, fakeProducts)).toBe(undefined);
        expect(pipe.transform(undefined, fakeProducts)).toBe(undefined);
    });

    it('should transform to empty list if product is null or empty', () => {
        expect(pipe.transform(fakeGameTypes, null)).toEqual([]);
        expect(pipe.transform(fakeGameTypes, undefined)).toEqual([]);
    });

    it('should transform exactly', () => {
        const result = pipe.transform(fakeGameTypes, fakeProducts);
        const expectedResult: TreeviewItem[] = [new TreeviewItem({
            text: 'Product 1',
            value: 1,
            children: [new TreeviewItem({
                text: 'Type 1',
                value: fakeGameTypes[0]
            }), new TreeviewItem({
                text: 'Type 2',
                value: fakeGameTypes[1]
            })]
        }), new TreeviewItem({
            text: 'Product 2',
            value: 2
        })];
        expect(result).toEqual(expectedResult);
    });
});
