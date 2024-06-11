using System;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Constants;

namespace RiskControl.NonSportsGamesStatistics.DailyView.Main.Normal;

public class Criteria : BaseStatisticCriteria
{
    public DateTime WinLostDate { get; set; }

    public int HousePTType { get; set; }

    public decimal HousePTValue { get; set; }

    public bool IsDrillDown { get; set; }

    public bool IsGrandTotal { get; set; }

    public int? CasinoType =>
        ReportBy == ReportByConstant.PRODUCT_DETAIL ? CasinoTypeConstant.PRODUCT_DETAIL : null;
}