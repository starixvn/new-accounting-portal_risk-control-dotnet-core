using Fanex.Data;
using Fanex.Data.Repository;
using System;

namespace RiskControl.NonSportsGamesStatistics.Headline.SMA;

public class NormalCriteria : CriteriaBase
{
    [SpParam(SqlParamName = "WinlostDate")]
    public DateTime FromDate { get; set; }

    public string ProductId { get; set; }

    public int Headline { get; set; }

    public bool ExcludeTest { get; set; }

    public string Site { get; set; }

    public string Bettype { get; set; }

    public string LeagueId { get; set; }

    public string Sporttype { get; set; }

    public string Currency { get; set; }

    public string Device { get; set; }

    public int TotalBetType { get; set; }

    public decimal TotalBetValue { get; set; }

    public int GameIncomeType { get; set; }

    public decimal GameIncomeValue { get; set; }

    public string SportBetType { get; set; }

    public byte RoleId { get; set; }

    public bool IsDrillDown { get; set; }

    public bool IsGrandTotal { get; set; }

    public bool IsExactly { get; set; }

    public override string GetSettingKey() => "Acc_Rpt_NonSportsProductStatistics_SMA";

    public override bool IsValid() => true;
}