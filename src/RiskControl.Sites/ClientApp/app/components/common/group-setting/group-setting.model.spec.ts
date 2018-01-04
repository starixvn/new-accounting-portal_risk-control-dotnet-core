import { ProductBetTypeSetting } from './index';

export const fakeProductBetTypeSettings: ProductBetTypeSetting[] = [
    {
        ProductId: 1,
        ProductName: 'Product 1',
        Groups: [
            {
                GroupName: 'Group 1',
                BetTypes: ['BetType 11', 'BetType 12']
            },
            {
                GroupName: 'Group 2',
                BetTypes: ['BetType 21', 'BetType 22']
            }
        ]
    },
    {
        ProductId: 2,
        ProductName: 'Product 2',
        Groups: [
            {
                GroupName: 'Group 3',
                BetTypes: ['BetType 31', 'BetType 32']
            }
        ]
    }
];
