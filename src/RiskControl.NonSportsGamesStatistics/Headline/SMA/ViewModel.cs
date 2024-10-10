using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Headline.SMA;

public class ViewModel : BaseViewModel
{
    public IEnumerable<StatisticsModel> SubTotal { get; set; }
}