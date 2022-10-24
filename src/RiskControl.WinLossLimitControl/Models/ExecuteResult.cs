namespace RiskControl.WinLossLimitControl.Models
{
    public class ExecuteResult
    {
        public ExecuteResult()
        {
            ErrorCode = 0;
        }

        public ExecuteResult(int errorCode)
        {
            ErrorCode = errorCode;
        }

        public int ErrorCode { get; set; }

        public bool IsValid => ErrorCode == 0;
    }
}