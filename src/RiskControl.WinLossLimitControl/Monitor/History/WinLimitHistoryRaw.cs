using System;

namespace RiskControl.WinLossLimitControl.Monitor.History;

public class WinLimitHistoryRaw
{
    public int GroupId { get; set; }

    public string Currency { get; set; }

    public DateTime ModifiedDate { get; set; }

    public decimal TotalWinAmount { get; set; }

    public decimal TotalWinAmountRM { get; set; }

    public string MaxWinLimitSetting { get; set; }

    public int ReachedLimitLevel { get; set; }

    public string ActionName { get; set; }

    public string ProceededBy { get; set; }

    public long LogID { get; set; }

    public bool IsNotified { get; set; }
}