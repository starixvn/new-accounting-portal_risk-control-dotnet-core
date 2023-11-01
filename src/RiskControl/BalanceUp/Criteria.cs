namespace RiskControl.BalanceUp;

using Fanex.Data.Repository;

public class Criteria : CriteriaBase
{
    public override string GetSettingKey() => "GetBalanceUpRange";

    public override bool IsValid() => true;
}