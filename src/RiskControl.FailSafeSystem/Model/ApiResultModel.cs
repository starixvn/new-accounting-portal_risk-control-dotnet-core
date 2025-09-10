namespace RiskControl.FailSafeSystem.Model;

public class ApiResultModel
{
    public DateTime Timestamp { get; set; }

    public string Seq { get; set; }

    public int StatusCode { get; set; }

    public int ErrorCode { get; set; }

    public string ErrorDescription { get; set; }
}