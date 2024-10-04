using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Headline.Main;

public class ViewModel
{
    public IEnumerable<StatisticsModel> Statistics { get; set; }

    public TotalStatisticsModel Total { get; set; }
}