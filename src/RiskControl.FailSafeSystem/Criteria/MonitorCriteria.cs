using Fanex.Data.Repository;

namespace RiskControl.FailSafeSystem.Criteria;

public class MonitorCriteria : CriteriaBase
{
    public string FromDate { get; set; }

    public string ToDate { get; set; }

    public string ProductIdList { get; set; }

    public string ConstantKeyList { get; set; }

    public override string GetSettingKey() => "fss_Monitor";

    public override bool IsValid() => true;
}