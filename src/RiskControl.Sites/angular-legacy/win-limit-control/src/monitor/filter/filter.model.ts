import { NapDate } from 'nap-components/date';
import { LimitLevel } from '../../common/filter';
import { GridColumns } from '../common/column';

export class FilterModel {
  fromDate: NapDate;
  toDate: NapDate;
  productId: number;
  levelId: LimitLevel[];
  userName: string;
  siteId: number;
  currencyId: number;
  excludeTestData: boolean;
  columns: GridColumns;
}
