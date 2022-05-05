import { NapDate } from 'nap-components/date';

export class FilterModel {
  fromDate: NapDate;
  toDate: NapDate;
  productIds: string;
  gameTypes: string;
  excludeTestData: boolean;
}
