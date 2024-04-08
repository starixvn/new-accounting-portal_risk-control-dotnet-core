using RiskControl.NonSportsGamesStatistics.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.DailyView.Daily;

public class Criteria : BaseStatisticCriteria
{
    public DateTime FromDate { get; set; }

    public DateTime ToDate { get; set; }

    public bool IsDrillDown { get; set; }

    public bool IsGrandTotal { get; set; }

    public bool UsernameDrillDown { get; set; }
}