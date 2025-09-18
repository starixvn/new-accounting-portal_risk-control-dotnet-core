using Fanex.Data.Repository;

namespace RiskControl.FailSafeSystem.Criteria;

public class InsertProductActionLogCommand : NonQueryCommand
{
    public DateTime InsertTime { get; set; }

    public int ProductId { get; set; }

    public int SportType { get; set; }

    public string ActionType { get; set; }

    public string ApiJsonBodyInfo { get; set; }

    public int ApiResponseStatusCode { get; set; }

    public string ApiResponseMessage { get; set; }

    public int CreatedBy { get; set; }

    public override string GetSettingKey() => "fss_InsertProductActionLog";

    public override bool IsValid() => true;
}