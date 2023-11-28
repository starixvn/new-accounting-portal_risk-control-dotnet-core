namespace RiskControl.WinLossLimitControl.Models;

public class ExecuteResult(int errorCode)
{
    public ExecuteResult() : this(0)
    {
    }

    public int ErrorCode { get; set; } = errorCode;

    public bool IsValid => ErrorCode == 0;
}