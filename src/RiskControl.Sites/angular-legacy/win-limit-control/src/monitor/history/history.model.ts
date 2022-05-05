import { TableColumn, TableColumns } from '../common/column';

export interface HistoryModel {
    GroupId: number;
    GroupName: string;
    Currency: string;
    ModifiedDate: Date;
    BlackLimit: number;
    GreyLimit: number;
    OrangeLimit: number;
    YellowLimit: number;
    RedLimit: number;
    WinningAmount: number;
    WinningAmountRM: number;
    ReachedLimitLevel: number;
    ActionName: string;
    ProceededBy: string;
    IsNotified: boolean;
    LogID: number;
}

export interface InsertColumns extends TableColumns {
    no: TableColumn;
    date: TableColumn;
    settingGroup: TableColumn;
    lossLimitLevel: TableColumn;
    winLimitLevel: TableColumn;
    winningLosingAmountRM: TableColumn;
    winningLosingAmountInPlayerCurrency: TableColumn;
    reachedLimitLevel: TableColumn;
    action: TableColumn;
    proceededBy: TableColumn;
    isNotified: TableColumn;
    logID: TableColumn;
}

export const Columns: InsertColumns = {
    no: new TableColumn('#', 45, true, true),
    date: new TableColumn('Date', 90, true, true),
    settingGroup: new TableColumn('Setting Group', 150),
    lossLimitLevel: new TableColumn('Loss Limit Level', 130 * 2, false),
    winLimitLevel: new TableColumn('Win Limit Level', 130 * 3, false),
    winningLosingAmountRM: new TableColumn('Winning/Losing<br>Amount<br>(RM)', 130),
    winningLosingAmountInPlayerCurrency: new TableColumn('Winning/Losing<br>Amount<br>in Player Currency', 130),
    reachedLimitLevel: new TableColumn('Reached Limit Level', 70),
    action: new TableColumn('Action', 100),
    proceededBy: new TableColumn('Proceeded By', 100),
    isNotified: new TableColumn("IsNotified", 90, false, false),
    logID: new TableColumn("LogID", 100, false, false),
};
