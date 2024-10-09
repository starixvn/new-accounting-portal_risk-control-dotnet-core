using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Headline;

public class ViewModel
{
    public IEnumerable<StatisticsModel> Statistics { get; set; }

    public TotalStatisticsModel Total { get; set; }
}