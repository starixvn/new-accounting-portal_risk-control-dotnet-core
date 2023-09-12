using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.PlayerSettings.SearchForInserting;

public class SearchCriteria : CriteriaBase
{
    public string Username { get; set; }

    public override string GetSettingKey() => "NAP_WinLimit_CustSettingUndefinedProductSettingSel";

    public override bool IsValid() => true;
}