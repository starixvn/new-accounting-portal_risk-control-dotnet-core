using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.ManagedSettingGroup.Search;

public class RepresentativeBettypeCriteria : CriteriaBase
{
    public int ProductID { get; set; }

    public override string GetSettingKey() => "NAP_Winlimit_SelRepresentativeBettype";

    public override bool IsValid() => true;
}