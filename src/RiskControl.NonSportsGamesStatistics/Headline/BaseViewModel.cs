using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Headline;

public class BaseViewModel
{
    public IEnumerable<StatisticsModel> Statistics { get; set; }

    public IEnumerable<StatisticsModel> SubTotals { get; set; }

    public TotalStatisticsModel Total { get; set; }
}