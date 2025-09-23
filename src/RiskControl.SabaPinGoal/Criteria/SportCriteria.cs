using Fanex.Data.Repository;

namespace RiskControl.SabaPinGoal.Criteria;

public class SportCriteria : CriteriaBase
{
    public override string GetSettingKey() => "Acc_Rpt_SabaPingoal_SportTypeSel";

    public override bool IsValid() => true;
}