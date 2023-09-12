using Fanex.Data.Repository;

namespace RiskControl.Core.BalanceUp;

public class Criteria : CriteriaBase
{
    public override string GetSettingKey() => "GetBalanceUpRange";

    public override bool IsValid() => true;
}