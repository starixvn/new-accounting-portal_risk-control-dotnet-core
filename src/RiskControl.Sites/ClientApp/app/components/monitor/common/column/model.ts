export class TableColumn {
    text: string;
    width: number;
    checked: boolean;
    hidden: boolean;

    constructor(text: string, width: number, checked = true, hidden = false) {
        this.text = text;
        this.width = width;
        this.checked = checked;
        this.hidden = hidden;
    }
}

export interface TableColumns {
    [columnName: string]: TableColumn;
}

export interface GridColumns extends TableColumns {
    no: TableColumn;
    username: TableColumn;
    siteLicensee: TableColumn;
    currency: TableColumn;
    product: TableColumn;
    settingGroup: TableColumn;
    lossLimitLevel: TableColumn;
    winLimitLevel: TableColumn;
    winningLosingAmountRM: TableColumn;
    winningLosingAmountInPlayerCurrency: TableColumn;
    reachedLimitTime: TableColumn;
    reachedLimitLevel: TableColumn;
    blockPlaceBet: TableColumn;
    blockTransferWithdraw: TableColumn;
    history: TableColumn;
}

export const Columns: GridColumns = {
    no: new TableColumn('#', 45, true, true),
    username: new TableColumn('Username', 150, true, true),
    siteLicensee: new TableColumn('Site / Licensee', 100),
    currency: new TableColumn('Currency', 100),
    product: new TableColumn('Product', 120),
    settingGroup: new TableColumn('Setting Group', 150),
    lossLimitLevel: new TableColumn('Loss Limit Level', 90 * 2, false),
    winLimitLevel: new TableColumn('Win Limit Level', 100 * 3, false),
    winningLosingAmountRM: new TableColumn('Winning/Losing<br>Amount<br>(RM)', 130),
    winningLosingAmountInPlayerCurrency: new TableColumn('Winning/Losing<br>Amount<br>in Player Currency', 130),
    reachedLimitTime: new TableColumn('Reached Limit Time', 90),
    reachedLimitLevel: new TableColumn('Reached Limit Level', 70),
    blockPlaceBet: new TableColumn('Block<br/>Place Bet', 80),
    blockTransferWithdraw: new TableColumn('Block<br/>Transfer/Withdraw', 130),
    history: new TableColumn('', 40, true, true)
};
