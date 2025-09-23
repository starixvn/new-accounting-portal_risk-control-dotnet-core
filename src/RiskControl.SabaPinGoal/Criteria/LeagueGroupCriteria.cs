using Fanex.Data.Repository;

namespace RiskControl.SabaPinGoal.Criteria;

public class LeagueGroupCriteria: CriteriaBase
{
    public override string GetSettingKey() => "Acc_Rpt_SabaPingoal_LeagueGroupSel";

    public override bool IsValid() => true;
}