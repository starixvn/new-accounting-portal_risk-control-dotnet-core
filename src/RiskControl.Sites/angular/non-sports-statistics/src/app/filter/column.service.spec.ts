import { TestBed } from '@angular/core/testing';
import { TreeviewItem } from 'ngx-treeview';
import { ColumnService } from './column.service';
import { Column, ReportType } from './filter.model';

describe('ColumnService', () => {
    let columnService: ColumnService;
    let expected: TreeviewItem[];
    function expectResult(reportType: ReportType, isNormalMode: boolean) {
        const result = columnService.getColumns(reportType, isNormalMode);
        expect(result).toEqual(expected);
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ColumnService
            ]
        });
        columnService = TestBed.get(ColumnService);
    });

    describe('Group1', () => {
        beforeEach(() => {
            expected = [
                new TreeviewItem({ text: 'No. Players', value: 'NoOfPlayers' }),
                new TreeviewItem({ text: 'Bet Count', value: 'BetCount' }),
                new TreeviewItem({ text: 'Currency', value: 'Currency' }),
                new TreeviewItem({ text: 'Total Bets', value: 'TotalBets' }),
                new TreeviewItem({ text: 'Total Wins', value: 'TotalWins', checked: false }),
                new TreeviewItem({ text: 'Game Income', value: 'GameIncome' }),
                new TreeviewItem({ text: 'Game Payout', value: 'GamePayout' }),
                new TreeviewItem({ text: 'Total Refund', value: 'TotalRefund', checked: false }),
                new TreeviewItem({ text: 'Turnover', value: 'HouseTurnover', checked: false }),
                new TreeviewItem({ text: 'Real Turnover', value: 'RealTurnover' }),
                new TreeviewItem({ text: 'Gross Income', value: 'HouseGrossIncome' }),
                new TreeviewItem({ text: 'Comm', value: 'HouseComm' }),
                new TreeviewItem({ text: 'ExtraPT', value: 'ExtraPT' }),
                new TreeviewItem({ text: 'Net Income', value: 'HouseNetIncome' })
            ];
        });

        it('should return list of columns in normal mode', () => {
            expectResult(ReportType.Hourly, true);
            expectResult(ReportType.Daily, true);
            expectResult(ReportType.Monthly, true);
            expectResult(ReportType.Product, true);
            expectResult(ReportType.Company, true);
            expectResult(ReportType.Device, true);
        });

        it('should return list of columns in history mode', () => {
            expectResult(ReportType.Hourly, false);
            expectResult(ReportType.Daily, false);
            expectResult(ReportType.Monthly, false);
            expectResult(ReportType.Product, false);
            expectResult(ReportType.Company, false);
            expectResult(ReportType.Device, false);
        });
    });

    describe('Group2', () => {
        beforeEach(() => {
            expected = [
                new TreeviewItem({ text: 'No. Players', value: 'NoOfPlayers' }),
                new TreeviewItem({ text: 'Bet Count', value: 'BetCount' }),
                new TreeviewItem({ text: 'Total Bets', value: 'TotalBets' }),
                new TreeviewItem({ text: 'Total Wins', value: 'TotalWins', checked: false }),
                new TreeviewItem({ text: 'Game Income', value: 'GameIncome' }),
                new TreeviewItem({ text: 'Game Payout', value: 'GamePayout' }),
                new TreeviewItem({ text: 'Total Refund', value: 'TotalRefund', checked: false }),
                new TreeviewItem({ text: 'Turnover', value: 'HouseTurnover', checked: false }),
                new TreeviewItem({ text: 'Real Turnover', value: 'RealTurnover' }),
                new TreeviewItem({ text: 'Gross Income', value: 'HouseGrossIncome' }),
                new TreeviewItem({ text: 'Comm', value: 'HouseComm' }),
                new TreeviewItem({ text: 'ExtraPT', value: 'ExtraPT' }),
                new TreeviewItem({ text: 'Net Income', value: 'HouseNetIncome' })
            ];
        });

        it('should return list of columns in normal mode', () => {
            expectResult(ReportType.Currency, true);
        });

        it('should return list of columns in history mode', () => {
            expectResult(ReportType.Currency, false);
        });
    });

    describe('Group3', () => {
        it('should return list of columns in normal mode', () => {
            expected = [
                new TreeviewItem({ text: 'Cust ID', value: 'ReportById' }),
                new TreeviewItem({ text: 'Bet Count', value: 'BetCount' }),
                new TreeviewItem({ text: 'Currency', value: 'Currency' }),
                new TreeviewItem({ text: 'Total Bets', value: 'TotalBets' }),
                new TreeviewItem({ text: 'Total Wins', value: 'TotalWins', checked: false }),
                new TreeviewItem({ text: 'Game Income', value: 'GameIncome' }),
                new TreeviewItem({ text: 'Game Payout', value: 'GamePayout' }),
                new TreeviewItem({ text: 'Total Refund', value: 'TotalRefund', checked: false }),
                new TreeviewItem({ text: 'Turnover', value: 'HouseTurnover', checked: false }),
                new TreeviewItem({ text: 'Real Turnover', value: 'RealTurnover' }),
                new TreeviewItem({ text: 'Gross Income', value: 'HouseGrossIncome' }),
                new TreeviewItem({ text: 'Comm', value: 'HouseComm' }),
                new TreeviewItem({ text: 'ExtraPT', value: 'ExtraPT' }),
                new TreeviewItem({ text: 'Net Income', value: 'HouseNetIncome' }),
                new TreeviewItem({ text: 'House PT', value: 'HousePositionTaking' }),
                new TreeviewItem({ text: 'Associated Account', value: 'AssociatedAccounts' })
            ];
            expectResult(ReportType.UserName, true);
            expectResult(ReportType.Top20, true);
        });

        it('should return list of columns in history mode', () => {
            expected = [
                new TreeviewItem({ text: 'Cust ID', value: 'ReportById' }),
                new TreeviewItem({ text: 'Bet Count', value: 'BetCount' }),
                new TreeviewItem({ text: 'Currency', value: 'Currency' }),
                new TreeviewItem({ text: 'Total Bets', value: 'TotalBets' }),
                new TreeviewItem({ text: 'Total Wins', value: 'TotalWins', checked: false }),
                new TreeviewItem({ text: 'Game Income', value: 'GameIncome' }),
                new TreeviewItem({ text: 'Game Payout', value: 'GamePayout' }),
                new TreeviewItem({ text: 'Total Refund', value: 'TotalRefund', checked: false }),
                new TreeviewItem({ text: 'Turnover', value: 'HouseTurnover', checked: false }),
                new TreeviewItem({ text: 'Real Turnover', value: 'RealTurnover' }),
                new TreeviewItem({ text: 'Gross Income', value: 'HouseGrossIncome' }),
                new TreeviewItem({ text: 'Comm', value: 'HouseComm' }),
                new TreeviewItem({ text: 'ExtraPT', value: 'ExtraPT' }),
                new TreeviewItem({ text: 'Net Income', value: 'HouseNetIncome' }),
                new TreeviewItem({ text: 'Associated Account', value: 'AssociatedAccounts' })
            ];
            expectResult(ReportType.UserName, false);
            expectResult(ReportType.Top20, false);
        });
    });
});
