namespace RiskControl.WinLossLimitControl.Models;

public class ExecuteResult
{
    public int ErrorCode { get; set; }

    public bool IsValid => ErrorCode == 0;
}