using Fanex.Data.Repository;

namespace RiskControl.NonSportsGamesStatistics.Filter.Criteria;

public class CurrencyCriteria : CriteriaBase
{
    public string SiteId { get; set; }

    public bool ExcludeTest { get; set; }

    public override string GetSettingKey() => "Acc_Rpt_NonSportsProductStatistic_CurrencySel";

    public override bool IsValid() => true;
}