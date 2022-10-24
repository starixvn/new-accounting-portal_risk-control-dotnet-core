using Fanex.Data.Repository;

namespace RiskControl.NonSportsGamesStatistics.Filter.Criteria
{
    public class GameTypeCriteria : CriteriaBase
    {
        public override bool IsValid() => true;

        public override string GetSettingKey() => "Acc_Rpt_NonSportsProductStatistics_GameTypeSel";
    }
}