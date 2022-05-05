import { TreeviewItem } from 'ngx-treeview';
import { CasinoType } from '../common';
import { ProductTreeviewPipe } from './product-treeview.pipe';
import { Product } from './filter.model';

describe('ProductTreeviewPipe', () => {
    const pipe = new ProductTreeviewPipe();

    it('should transform to undefined if gameTypes is null or undefined', () => {
        expect(pipe.transform(null)).toBe(undefined);
        expect(pipe.transform(undefined)).toBe(undefined);
    });

    it('should transform exactly', () => {
        const fakeProducts: Product[] = [{
            productName: 'Product 1',
            productId: 1,
            casinoType: CasinoType.SLI,
            isSingleWallet: true
        }, {
            productName: 'Product 2',
            productId: 2,
            casinoType: CasinoType.SLI,
            isSingleWallet: true
        }, {
            productName: 'Product 3',
            productId: 3,
            casinoType: CasinoType.RNG,
            isSingleWallet: true
        }, {
            productName: 'Product 4',
            productId: 4,
            casinoType: CasinoType.None,
            isSingleWallet: true
        }];

        const result = pipe.transform(fakeProducts);
        const expectedResult: TreeviewItem[] = [new TreeviewItem({
            text: 'Live Casino',
            value: undefined,
            children: [new TreeviewItem({
                text: 'Product 1',
                value: fakeProducts[0]
            }), new TreeviewItem({
                text: 'Product 2',
                value: fakeProducts[1]
            })]
        }), new TreeviewItem({
            text: 'RNG Casino',
            value: undefined,
            children: [new TreeviewItem({
                text: 'Product 3',
                value: fakeProducts[2]
            })]
        }), new TreeviewItem({
            text: 'Product 4',
            value: fakeProducts[3]
        })];
        expect(result).toEqual(expectedResult);
    });
});
