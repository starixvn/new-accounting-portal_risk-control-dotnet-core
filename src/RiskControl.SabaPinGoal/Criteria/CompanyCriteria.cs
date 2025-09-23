using Fanex.Data.Repository;

namespace RiskControl.SabaPinGoal.Criteria;

public class CompanyCriteria : CriteriaBase
{
    public override string GetSettingKey() => "Acc_Rpt_SabaPingoal_CompanySel";

    public override bool IsValid() => true;
}