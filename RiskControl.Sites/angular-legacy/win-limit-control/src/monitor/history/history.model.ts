import { TableColumn, TableColumns } from '../common/column';

export interface HistoryModel {
    groupId: number;
    groupName: string;
    currency: string;
    modifiedDate: Date;
    blackLimit: number;
    greyLimit: number;
    orangeLimit: number;
    yellowLimit: number;
    redLimit: number;
    winningAmount: number;
    winningAmountRM: number;
    reachedLimitLevel: number;
    actionName: string;
    proceededBy: string;
    isNotified: boolean;
    logID: number;
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
    winLossAnalysis: new TableColumn('Win Loss Analysis', 70),
    proceededBy: new TableColumn('Proceeded By', 100),
    isNotified: new TableColumn("IsNotified", 90, false, false),
    logID: new TableColumn("LogID", 100, false, false),
};
