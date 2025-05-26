import { Column } from './filter.model';

const gridColumns = {
  reportBy: { text: '', value: 'ReportBy' } as Column,
  custId: { text: 'Cust ID', value: 'ReportById' } as Column,
  playerCount: { text: 'No. Players', value: 'NoOfPlayers' } as Column,
  betCount: { text: 'Bet Count', value: 'BetCount' } as Column,
  currency: { text: 'Currency', value: 'Currency' } as Column,
  totalBets: { text: 'Total Bets', value: 'TotalBets' } as Column,
  totalWins: { text: 'Total Wins', value: 'TotalWins' } as Column,
  gameIncome: { text: 'Game Income', value: 'GameIncome' } as Column,
  gamePayout: { text: 'Game Payout', value: 'GamePayout' } as Column,
  totalRefund: { text: 'Total Refund', value: 'TotalRefund' } as Column,
  turnover: { text: 'Turnover', value: 'HouseTurnover' } as Column,
  realTurnover: { text: 'Real Turnover', value: 'RealTurnover' } as Column,
  grossIncome: { text: 'Gross Income', value: 'HouseGrossIncome' } as Column,
  commission: { text: 'Comm', value: 'HouseComm' } as Column,
  netIncome: { text: 'Net Income', value: 'HouseNetIncome' } as Column,
  housePositionTaking: { text: 'House PT', value: 'HousePositionTaking' } as Column,
  associatedAccount: { text: 'Associated Account', value: 'AssociatedAccounts' } as Column,
  extraPT: { text: 'ExtraPT', value: 'ExtraPT' }
};

export const FilterConfig = {
  gridColumns: gridColumns,
  housePTAllValue: -1,
  currencyAllValue: 0,
  currencyBaseRM: -1,
  currencyBaseUSD: -2
};
