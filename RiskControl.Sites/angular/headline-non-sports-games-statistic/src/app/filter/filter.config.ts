import { Column } from './filter.model';

const gridColumns = {
  user: { text: '', value: 'User' } as Column,
  custId: { text: 'Cust ID', value: 'CustId' } as Column,
  betCount: { text: 'Bet Count', value: 'BetCount' } as Column,
  currency: { text: 'Currency', value: 'Currency' } as Column,
  totalBets: { text: 'Total Bets', value: 'TotalBets' } as Column,
  gameIncome: { text: 'Game Income', value: 'GameIncome' } as Column,
  gamePayout: { text: 'Game Payout', value: 'GamePayout' } as Column,
  realTurnover: { text: 'Real Turnover', value: 'RealTurnover' } as Column,
  grossIncome: { text: 'Gross Income', value: 'HouseGrossIncome' } as Column,
  commission: { text: 'Comm', value: 'HouseComm' } as Column,
  netIncome: { text: 'Net Income', value: 'HouseNetIncome' } as Column,
  extraPT: { text: 'ExtraPT', value: 'ExtraPT' }
};

export const FilterConfig = {
  gridColumns: gridColumns,
  housePTAllValue: -1,
  currencyAllValue: 0,
  currencyBaseRM: -1
};
