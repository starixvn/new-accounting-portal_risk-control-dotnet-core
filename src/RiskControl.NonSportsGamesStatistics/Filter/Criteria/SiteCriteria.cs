using Fanex.Data.Repository;

namespace RiskControl.NonSportsGamesStatistics.Filter.Criteria
{
    public class SiteCriteria : CriteriaBase
    {
        public string ProductId { get; set; }

        public override bool IsValid() => true;

        public override string GetSettingKey() => "Acc_Rpt_NonSportsProductStatistics_SiteSel";
    }
}