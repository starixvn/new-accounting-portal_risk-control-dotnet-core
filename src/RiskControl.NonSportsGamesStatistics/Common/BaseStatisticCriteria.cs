using Fanex.Data;
using Fanex.Data.Repository;

namespace RiskControl.NonSportsGamesStatistics.Common;

public class BaseStatisticCriteria : CriteriaBase
{
    [SpParam(Ignored = true)]
    public bool IsNormalMode { get; set; }

    [SpParam(Ignored = true)]
    public string ReportBy { get; set; }

    public string ProductId { get; set; }

    [SpParam(Ignored = true)]
    public int CustId { get; set; }

    public string UserName { get; set; }

    public string Site { get; set; }

    public string Bettype { get; set; }

    public string LeagueId { get; set; }

    public string Sporttype { get; set; }

    public string Currency { get; set; }

    public string Device { get; set; }

    public bool ExcludeTest { get; set; }

    public int TotalBetType { get; set; }

    public decimal TotalBetValue { get; set; }

    public int GameIncomeType { get; set; }

    public decimal GameIncomeValue { get; set; }

    public string SportBetType { get; set; }

    [SpParam(Ignored = true)]
    public string Source { get; set; }

    public bool IsExactly { get; set; }

    public override bool IsValid()
    {
        return true;
    }

    public override string GetSettingKey()
    {
        return $"Acc_Rpt_NonSportsProductStatistics_{ReportBy}_{Source}";
    }
}