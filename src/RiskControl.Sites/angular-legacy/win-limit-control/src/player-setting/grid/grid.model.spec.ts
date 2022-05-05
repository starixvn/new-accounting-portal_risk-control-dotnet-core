import { PlayerCurrencySetting } from './index';

export const fakePlayerCurrencySettings: PlayerCurrencySetting[] = [
    {
        Username: 'User1', SiteName: 'Site 1', CurrencyName: 'Currency 1', Products: [
            {
                ProductName: 'Product 1', PlayerSettings: [
                    {
                        CustId: 1,
                        Username: 'User1',
                        SiteId: 1,
                        SiteName: 'Site 1',
                        CurrencyId: 1,
                        CurrencyName: 'Currency 1',
                        ProductId: 1,
                        ProductName: 'Product 1',
                        GroupId: 1,
                        GroupName: 'Group 1',
                        BlackLimit: -2,
                        GreyLimit: -1,
                        OrangeLimit: 1,
                        YellowLimit: 2,
                        RedLimit: 3,
                        HasCurrencySetting: true
                    },
                    {
                        CustId: 1,
                        Username: 'User1',
                        SiteId: 1,
                        SiteName: 'Site 1',
                        CurrencyId: 1,
                        CurrencyName: 'Currency 1',
                        ProductId: 1,
                        ProductName: 'Product 1',
                        GroupId: 2,
                        GroupName: 'Group 2',
                        BlackLimit: -1234,
                        GreyLimit: -123,
                        OrangeLimit: 123,
                        YellowLimit: 1234,
                        RedLimit: 12345,
                        HasCurrencySetting: true
                    }
                ]
            },
            {
                ProductName: 'Product 2', PlayerSettings: [
                    {
                        CustId: 1,
                        Username: 'User1',
                        SiteId: 1,
                        SiteName: 'Site 1',
                        CurrencyId: 1,
                        CurrencyName: 'Currency 1',
                        ProductId: 2,
                        ProductName: 'Product 2',
                        GroupId: 3,
                        GroupName: 'Group 3',
                        BlackLimit: -2,
                        GreyLimit: 0,
                        OrangeLimit: 1,
                        YellowLimit: 0,
                        RedLimit: 3,
                        HasCurrencySetting: false
                    }
                ]
            }
        ]
    },
    {
        Username: 'User2', SiteName: 'Site 2', CurrencyName: 'Currency 2', Products: [
            {
                ProductName: 'Product 3', PlayerSettings: [
                    {
                        CustId: 2,
                        Username: 'User2',
                        SiteId: 2,
                        SiteName: 'Site 2',
                        CurrencyId: 2,
                        CurrencyName: 'Currency 2',
                        ProductId: 3,
                        ProductName: 'Product 3',
                        GroupId: 3,
                        GroupName: 'Group 3',
                        BlackLimit: -1234567,
                        GreyLimit: 0,
                        OrangeLimit: 1,
                        YellowLimit: 0,
                        RedLimit: 123456789,
                        HasCurrencySetting: false
                    }
                ]
            }
        ]
    }
];
