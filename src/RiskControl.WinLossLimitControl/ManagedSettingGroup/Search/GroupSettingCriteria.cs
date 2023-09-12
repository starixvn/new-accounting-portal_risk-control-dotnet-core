using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.ManagedSettingGroup.Search;

public class GroupSettingCriteria : CriteriaBase
{
    public int ProductID { get; set; }

    public override string GetSettingKey() => "NAP_WinLimit_GameGroupSettingSel";

    public override bool IsValid() => true;
}