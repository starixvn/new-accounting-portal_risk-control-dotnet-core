import { TreeviewConfig } from 'ngx-treeview';

export interface GameType {
  productId: number;
  typeName: string;
  typeId: number;
  gameType: number;
}

export interface ProductGameType {
  productId: number;
  productName: string;
  bettype: number;
  bettypeName: string;
}

const AllProducts: { [Id: number]: string } = {};
AllProducts[21] = 'Allbet';
AllProducts[12] = 'Gold Deluxe';
AllProducts[38] = 'Virtual Games';
AllProducts[39] = 'SA Gaming';
AllProducts[45] = 'AE Casino';
AllProducts[46] = 'IBCBet Live Casino';
AllProducts[51] = 'WM';
const AllGameTypes: number[] = [
  2401,
  2402,
  2403,
  2404,
  2405,
  2406,
  2407,
  1701,
  1702,
  1703,
  1704,
  1705,
  3001,
  3002,
  3003,
  3004,
  3005,
  3006,
  3007,
  4601,
  4602,
  4603,
  4604,
  3101,
  3102,
  3103,
  3104,
  3105,
  3201,
  3202,
  3203,
  3204,
  3205,
  3401,
  3402,
  3403,
  3404,
  3405,
  3406,
  3407,
  3408,
  3409,
  3410,
  3411,
  2408
];

export { AllProducts, AllGameTypes };

const DefaultTreeviewConfig: TreeviewConfig = TreeviewConfig.create({
  hasCollapseExpand: true,
  hasAllCheckBox: true,
  hasFilter: false,
  maxHeight: 500
});

export { DefaultTreeviewConfig };
