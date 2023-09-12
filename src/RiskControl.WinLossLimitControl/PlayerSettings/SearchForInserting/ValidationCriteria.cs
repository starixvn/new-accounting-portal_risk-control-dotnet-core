using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.PlayerSettings.SearchForInserting;

public class ValidationCriteria : CriteriaBase
{
    public string Username { get; set; }

    public override string GetSettingKey() => "NAP_WinLimit_CustSettingValidateInsertingUser";

    public override bool IsValid() => true;
}