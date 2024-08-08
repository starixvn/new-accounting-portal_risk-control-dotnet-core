using System;

namespace RiskControl.WinLossLimitControl.Monitor.FileDownload;

public class WinLossAnalysisExcelModel
{
    public int CustId { get; set; }

    public int ProductId { get; set; }

    public DateTime ReachedLimitTime { get; set; }

    public string Username { get; set; }
}