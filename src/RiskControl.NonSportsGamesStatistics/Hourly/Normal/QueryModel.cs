using System;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.Hourly.Normal
{
    public class QueryModel : BaseStatisticQueryModel, IRequest<HourlyReportModel>
    {
        public DateTime WinLostDate { get; set; }

        public bool UsernameDrillDown { get; set; }
    }
}